import { validateRequest } from "@/lib/validations/validate-request";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { requireSession } from "@/lib/auth/server/require-session";
import { EventService } from "@/lib/validations/validate-event";
import { ZodRecurrence } from "@/lib/zod/event";
import { EventIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodRecurrence, body);
    const updated = await EventService.updateRecurrence(
      eventId,
      session.user.id,
      data,
    );
    const message = updated.recurrence
      ? `Event set to repeat ${updated.recurrence}`
      : "Recurrence removed";
    return InvitelyResponse(200, message, {
      recurrence: updated.recurrence,
      autoInvite: updated.autoInvite,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function DELETE(req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const url = new URL(req.url);
    const cancelFuture = url.searchParams.get("cancelFuture") === "true";
    const result = await EventService.stopRecurrence(
      eventId,
      session.user.id,
      cancelFuture,
    );
    const message =
      cancelFuture && result.cancelledFutureCount > 0
        ? `Recurrence stopped and ${result.cancelledFutureCount} future event${result.cancelledFutureCount === 1 ? "" : "s"} cancelled`
        : "Recurrence stopped; existing events remain unchanged";

    return InvitelyResponse(200, message, {
      cancelledFutureCount: result.cancelledFutureCount,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
