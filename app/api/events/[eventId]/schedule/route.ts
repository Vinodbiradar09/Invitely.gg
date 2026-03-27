import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { EventIdParams, formatEventDate } from "@/lib/utils";
import { ConflictError } from "@/lib/shared/exceptions";
import { ZodSchedule } from "@/lib/zod/invitation";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodSchedule, body);
    const result = await EventService.scheduleInvitations(
      eventId,
      session.user.id,
      data,
    );
    const formattedDate = formatEventDate(result.scheduledAt);
    return InvitelyResponse(200, `Invitations scheduled for ${formattedDate}`, {
      scheduledAt: result.scheduledAt,
      recipients: result.recipientCount,
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
    if (event.status !== "scheduled") {
      throw new ConflictError("Event is not scheduled");
    }
    await EventService.cancelscheduledInvitations(eventId);
    return InvitelyResponse(200, "scheduled send cancelled successfully");
  } catch (e) {
    return InvitelyError(e);
  }
}
