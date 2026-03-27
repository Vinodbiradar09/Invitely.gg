import { Prisma } from "@prisma/client";
import { db } from "../db/prisma";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../shared/exceptions";

type CreateEventDTO = Omit<Prisma.EventUncheckedCreateInput, "userId">;

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
};

export { EventService };
