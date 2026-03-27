import { ForbiddenError, NotFoundError } from "@/lib/shared/exceptions";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { MemberIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

export async function DELETE(_req: NextRequest, { params }: MemberIdParams) {
  try {
    const session = await requireSession();
    const { memberId } = await params;
    const member = await db.workSpaceMember.findUnique({
      where: { id: memberId },
      include: {
        workspace: {
          select: { userId: true },
        },
      },
    });
    if (!member) {
      throw new NotFoundError("This member does not exist in our workspace.");
    }
    if (member.workspace.userId !== session.user.id) {
      throw new ForbiddenError("Only workspace owners can remove members.");
    }
    await db.workSpaceMember.delete({
      where: { id: memberId },
    });
    return InvitelyResponse(200, "Member successfully removed from workspace");
  } catch (e) {
    return InvitelyError(e);
  }
}
