import { NotificationService } from "@/lib/validations/validate-notification";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { BadRequestError } from "@/lib/shared/exceptions";
import { ZodUpdateEvent } from "@/lib/zod/event";
import { EventIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
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
      throw new BadRequestError("Please provide at least one field to update.");
    }
    const { updated, hasSentInvitations, changes } =
      await EventService.updateEvent(eventId, session.user.id, data);
    const shouldNotify = changes.locationChanged || changes.timeChanged;
    if (shouldNotify && hasSentInvitations) {
      const invitations = await db.invitation.findMany({
        where: { eventId },
        select: { email: true, name: true, token: true },
      });

      if (invitations.length > 0) {
        await NotificationService.sendEventUpdateEmails({
          event: updated,
          invitations,
          session,
          changes,
        });
      }
    }
    return InvitelyResponse(200, "Event updated successfully", {
      event: updated,
      notified: shouldNotify && hasSentInvitations,
      changes,
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
