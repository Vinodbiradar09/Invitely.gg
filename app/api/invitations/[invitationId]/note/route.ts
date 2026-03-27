import { InvitationService } from "@/lib/validations/validate-invitations";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { ZodOrganizerNote } from "@/lib/zod/event";
import { InvitationIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: InvitationIdParams) {
  try {
    const session = await requireSession();
    const { invitationId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodOrganizerNote, body);
    const note = await InvitationService.addNote(
      invitationId,
      session.user.id,
      data,
    );
    return InvitelyResponse(200, "Note saved successfully", {
      organizerNote: note.organizerNote,
    });
  } catch (e) {
    return InvitelyError(e);
  }
}
