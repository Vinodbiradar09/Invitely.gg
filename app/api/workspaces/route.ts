import { WorkspaceService } from "@/lib/validations/validate-workspace";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { ZodWorkspace } from "@/lib/types";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = validateRequest(ZodWorkspace, body);
    await WorkspaceService.verifyWorkspaceName(session.user.id, data.name);
    const workspace = await db.$transaction(async (tx: TxClient) => {
      // only 5 workspaces are allowed
      await WorkspaceService.workspaceLimit(session.user.id);
      return tx.workSpace.create({
        data: { name: data.name, userId: session.user.id },
      });
    });
    return InvitelyResponse(201, "workspace created", workspace);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function GET() {
  try {
    const session = await requireSession();
    const workspace = await WorkspaceService.userWorkspaces(session.user.id);
    const message =
      workspace.length === 0 ? "Zero workspaces found" : `Your workspaces`;
    return InvitelyResponse(200, message, workspace);
  } catch (e) {
    return InvitelyError(e);
  }
}
