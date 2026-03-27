import { InvitationService } from "@/lib/validations/validate-invitations";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { EventIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    await EventService.ownedEvent(eventId, session.user.id);
    const { invitations, summary } =
      await InvitationService.userInvitationsData(eventId);
    return InvitelyResponse(200, "Invitations got successfully", {
      invitations,
      summary,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
