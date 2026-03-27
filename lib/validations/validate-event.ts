import { ScheduleInvitationsDTO, UpdateEventDTO } from "../types/index";
import { formatEventDate } from "../utils";
import { Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { db } from "../db/prisma";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../shared/exceptions";

type CreateEventDTO = Omit<Prisma.EventUncheckedCreateInput, "userId">;
type RecurrenceUpdateDTO = Pick<
  Prisma.EventUpdateInput,
  "recurrence" | "autoInvite"
>;

const EventService = {
  async ownedEvent(id: string, userId: string) {
    const event = await db.event.findUnique({
      where: {
        id,
      },
    });
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    if (event.userId !== userId) {
      throw new ForbiddenError("Only the event owner can perform this action");
    }
    return event;
  },
  async createEvent(userId: string, eventDTO: CreateEventDTO) {
    // eventAt must be in the future
    if (new Date(eventDTO.eventAt) <= new Date()) {
      throw new ValidationError("Event date must be in future");
    }
    const event = await db.event.create({
      data: {
        userId,
        name: eventDTO.name.trim(),
        desc: eventDTO.desc.trim(),
        eventAt: new Date(eventDTO.eventAt),
        location: eventDTO.location.trim(),
        emailSubject: eventDTO.emailSubject.trim(),
        emailBody: eventDTO.emailBody.trim(),
        recurrence: eventDTO.recurrence ?? null,
        autoInvite: eventDTO.autoInvite ?? false,
      },
    });
    return event;
  },
  async userEvents(userId: string) {
    const events = await db.event.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        invitations: {
          select: {
            status: true,
          },
        },
      },
    });

    return events.map((event) => {
      const stats = {
        total: event.invitations.length,
        attending: 0,
        maybe: 0,
        declined: 0,
        pending: 0,
      };
      event.invitations.forEach((inv) => {
        if (inv.status in stats) {
          stats[inv.status as keyof typeof stats]++;
        }
      });
      const { invitations, ...eventData } = event;
      return {
        ...eventData,
        summary: stats,
      };
    });
  },
  async updateRecurrence(
    id: string,
    userId: string,
    data: RecurrenceUpdateDTO,
  ) {
    const event = await this.ownedEvent(id, userId);
    if (event.status === "cancelled") {
      throw new ConflictError("Cannot set recurrence on a cancelled event");
    }
    return await db.event.update({
      where: { id },
      data: {
        recurrence: data.recurrence,
        autoInvite: data.recurrence ? data.autoInvite : false,
      },
    });
  },
  async stopRecurrence(eventId: string, userId: string, cancelFuture: boolean) {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        childEvents: {
          where: {
            eventAt: { gt: new Date() },
            status: { not: "cancelled" },
          },
          select: { id: true },
        },
      },
    });
    if (!event) throw new NotFoundError("Event not found");
    if (event.userId !== userId)
      throw new ForbiddenError("Forbidden access: you are not the owner");
    if (!event.recurrence)
      throw new ConflictError("This event has no recurrence set");

    const now = new Date();
    const futureCount = event.childEvents.length;
    await db.$transaction(async (tx) => {
      await tx.event.update({
        where: { id: eventId },
        data: { recurrence: null },
      });
      if (cancelFuture && futureCount > 0) {
        await tx.event.updateMany({
          where: {
            id: { in: event.childEvents.map((c) => c.id) },
          },
          data: {
            status: "cancelled",
            cancelledAt: now,
            recurrence: null,
          },
        });
      }
    });
    return {
      cancelledFutureCount: cancelFuture ? futureCount : 0,
      wasFutureCancelled: cancelFuture && futureCount > 0,
    };
  },
  async cancelscheduledInvitations(eventId: string) {
    await db.$transaction(async (tx) => {
      await tx.invitation.deleteMany({
        where: {
          eventId,
        },
      });
      await tx.event.update({
        where: {
          id: eventId,
        },
        data: {
          status: "active",
          scheduledAt: null,
        },
      });
    });
  },
  async scheduleInvitations(
    eventId: string,
    userId: string,
    scheduledDTO: ScheduleInvitationsDTO,
  ) {
    const scheduledAt = new Date(scheduledDTO.scheduledAt);
    if (scheduledAt <= new Date()) {
      throw new ValidationError("Scheduled time must be in the future");
    }
    const event = await this.ownedEvent(eventId, userId);
    if (event.status === "cancelled")
      throw new ConflictError("Cannot schedule a cancelled event");
    if (event.status === "scheduled")
      throw new ConflictError("Event is already scheduled");
    if (event.sentAt)
      throw new ConflictError("Invitations have already been sent");

    const incomingEmails = scheduledDTO.recipients.map((r) => r.email);
    const alreadyInvited = await db.invitation.findMany({
      where: {
        eventId,
        email: { in: incomingEmails },
      },
      select: { email: true },
    });

    if (alreadyInvited.length > 0) {
      const duplicates = alreadyInvited.map((i) => i.email).join(", ");
      throw new ConflictError(
        `These emails were already invited: ${duplicates}`,
      );
    }
    const invitationData = scheduledDTO.recipients.map((recipient) => ({
      eventId,
      email: recipient.email,
      name: recipient.name ?? null,
      token: randomBytes(32).toString("hex"),
    }));
    await db.$transaction(async (tx) => {
      await tx.invitation.createMany({
        data: invitationData,
      });
      await tx.event.update({
        where: { id: eventId },
        data: {
          status: "scheduled",
          scheduledAt,
        },
      });
    });
    return {
      scheduledAt,
      recipientCount: scheduledDTO.recipients.length,
    };
  },
  async updateEvent(eventId: string, userId: string, eventDTO: UpdateEventDTO) {
    const event = await this.ownedEvent(eventId, userId);
    if (event.status === "cancelled") {
      throw new ConflictError("Cannot edit a cancelled event.");
    }
    const locationChanged = !!(
      eventDTO.location && eventDTO.location !== event.location
    );
    const timeChanged = !!(
      eventDTO.eventAt &&
      new Date(eventDTO.eventAt).getTime() !== new Date(event.eventAt).getTime()
    );
    const oldLocation = event.location;
    const oldDateFormatted = formatEventDate(event.eventAt, "full");
    const updated = await db.event.update({
      where: { id: eventId },
      data: {
        ...(eventDTO.name && { name: eventDTO.name }),
        ...(eventDTO.desc && { desc: eventDTO.desc }),
        ...(eventDTO.eventAt && { eventAt: new Date(eventDTO.eventAt) }),
        ...(eventDTO.location && { location: eventDTO.location }),
        ...(eventDTO.emailSubject && { emailSubject: eventDTO.emailSubject }),
        ...(eventDTO.emailBody && { emailBody: eventDTO.emailBody }),
      },
    });
    return {
      updated,
      hasSentInvitations: !!event.sentAt,
      changes: {
        locationChanged,
        timeChanged,
        oldLocation: locationChanged ? oldLocation : undefined,
        oldDate: timeChanged ? oldDateFormatted : undefined,
      },
    };
  },

  async getInvitationAndCancelEvent(id: string, userId: string) {
    const event = await this.ownedEvent(id, userId);
    if (event.status === "cancelled") {
      throw new ConflictError("Event already cancelled");
    }
    const invitations = await db.invitation.findMany({
      where: {
        eventId: id,
      },
      select: {
        email: true,
        name: true,
      },
    });
    await db.event.update({
      where: {
        id,
      },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });
    return { event, invitations };
  },
};

export { EventService };
