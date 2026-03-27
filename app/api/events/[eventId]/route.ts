import { NotificationService } from "@/lib/validations/validate-notification";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { ConflictError } from "@/lib/shared/exceptions";
import { NextRequest, NextResponse } from "next/server";
import { ZodUpdateEvent } from "@/lib/zod/event";
import { EventIdParams } from "@/lib/utils";
import { db } from "@/lib/db/prisma";

export async function GET(_req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const event = await EventService.ownedEvent(eventId, session.user.id);
    return InvitelyResponse(200, "event queued successfully", event);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function PUT(req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodUpdateEvent, body);
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "no fields to update", success: false },
        { status: 400 },
      );
    }
    const event = await EventService.ownedEvent(eventId, session.user.id);
    if (event.status === "cancelled") {
      throw new ConflictError("Cannot edit a cancelled event.");
    }

    const locationChanged = data.location && data.location !== event.location;
    const timeChanged =
      data.eventAt &&
      new Date(data.eventAt).getTime() !== new Date(event.eventAt).getTime();
    const shouldNotify = !!(locationChanged || timeChanged);

    const oldLocation = event.location;
    const oldDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = await db.event.update({
      where: { id: eventId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.desc && { desc: data.desc }),
        ...(data.eventAt && { eventAt: new Date(data.eventAt) }),
        ...(data.location && { location: data.location }),
        ...(data.emailSubject && { emailSubject: data.emailSubject }),
        ...(data.emailBody && { emailBody: data.emailBody }),
      },
    });

    if (shouldNotify && event.sentAt) {
      const invitations = await db.invitation.findMany({
        where: { eventId },
        select: { email: true, name: true, token: true },
      });

      if (invitations.length > 0) {
        await NotificationService.sendEventUpdateEmails({
          event: updated,
          invitations,
          session,
          changes: {
            locationChanged: !!locationChanged,
            timeChanged: !!timeChanged,
            oldLocation: locationChanged ? oldLocation : undefined,
            oldDate: timeChanged ? oldDate : undefined,
          },
        });
      }
    }
    return InvitelyResponse(200, "Event updated successfully", {
      event: updated,
      shouldNotify,
      notified: shouldNotify && !!event.sentAt,
      changes: {
        locationChanged: !!locationChanged,
        timeChanged: !!timeChanged,
      },
    });
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const event = await EventService.ownedEvent(eventId, session.user.id);
    await db.event.delete({ where: { id: eventId ?? event.id } });
    return InvitelyResponse(200, "Event deleted successfully");
  } catch (e) {
    return InvitelyError(e);
  }
}
