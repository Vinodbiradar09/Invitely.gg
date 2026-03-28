import { WorkspaceService } from "@/lib/validations/validate-workspace";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { WorkspaceIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

export async function DELETE(_req: NextRequest, { params }: WorkspaceIdParams) {
  try {
    const session = await requireSession();
    const { workspaceId } = await params;
    const workspace = await WorkspaceService.ownedWorkspace(
      workspaceId,
      session.user.id,
    );
    await db.workSpace.delete({
      where: {
        id: workspace.id,
        userId: session.user.id,
      },
    });
    return InvitelyResponse(200, "Workspace deleted successfullys");
  } catch (e) {
    return InvitelyError(e);
  }
}
