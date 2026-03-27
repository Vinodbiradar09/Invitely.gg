import { NotificationService } from "@/lib/validations/validate-notification";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { ConflictError } from "@/lib/shared/exceptions";
import { EventIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
import { db } from "@/lib/prisma";

const BATCH_SIZE = 50;

export async function POST(_req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const event = await EventService.ownedEvent(eventId, session.user.id);
    if (event.status === "cancelled") {
      throw new ConflictError("Event already cancelled");
    }
    const invitations = await db.invitation.findMany({
      where: {
        eventId,
      },
      select: {
        email: true,
        name: true,
      },
    });
    await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });
    if (invitations.length === 0) {
      return InvitelyResponse(200, "Event cancelled successfully", {
        notified: 0,
      });
    }
    const batchResults = await NotificationService.sendCancellationEmails({
      event,
      invitations,
      session,
    });
    const failedBatches = batchResults.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );
    if (failedBatches.length > 0) {
      console.error("[CANCELLATION_EMAIL_FAILURE]:", failedBatches);
      return InvitelyResponse(
        207,
        "Event cancelled but some notifications failed",
        {
          notified: invitations.length - failedBatches.length * BATCH_SIZE,
        },
      );
    }
    return InvitelyResponse(
      200,
      `Event cancelled and ${invitations.length} guests notified`,
      {
        notified: invitations.length,
      },
    );
  } catch (e) {
    return InvitelyError(e);
  }
}
