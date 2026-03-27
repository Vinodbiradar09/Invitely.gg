import { InvitationService } from "@/lib/validations/validate-invitations";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { ZodOrganizerNote } from "@/lib/zod/event";
import { InvitationIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

export async function PUT(req: NextRequest, { params }: InvitationIdParams) {
  try {
    const session = await requireSession();
    const { invitationId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodOrganizerNote, body);
    const invitation = await InvitationService.ownedInvitation(
      invitationId,
      session.user.id,
    );
    const updated = await db.invitation.update({
      where: {
        id: invitationId ?? invitation.id,
      },
      data: {
        organizerNote: data.organizerNote || null,
      },
      select: {
        id: true,
        organizerNote: true,
      },
    });
    return InvitelyResponse(200, "Note saved successfully", {
      organizerNote: updated.organizerNote,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
