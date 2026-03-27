import { MemberService } from "@/lib/validations/validate-workspace-members";
import { WorkspaceService } from "@/lib/validations/validate-workspace";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { ZodWorkspaceMembers } from "@/lib/types";
import { WorkspaceIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

export async function POST(req: NextRequest, { params }: WorkspaceIdParams) {
  try {
    const session = await requireSession();
    const { workspaceId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodWorkspaceMembers, body);
    await WorkspaceService.ownedWorkspace(workspaceId, session.user.id);
    const members = await db.$transaction(async (tx: TxClient) => {
      // count workspace members
      await MemberService.slotAvailability(workspaceId, data.length);
      // check existing members email address
      await MemberService.checkDuplicateEmails(
        workspaceId,
        data.map((m) => m.email),
      );
      return tx.workSpaceMember.createManyAndReturn({
        data: data.map((mem: { email: string; name?: string | undefined }) => ({
          workspaceId,
          name: mem.name ?? null,
          email: mem.email,
        })),
      });
    });
    return InvitelyResponse(201, "Members added successfully", members);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function GET(_req: NextRequest, { params }: WorkspaceIdParams) {
  try {
    const session = await requireSession();
    const { workspaceId } = await params;
    await WorkspaceService.ownedWorkspace(workspaceId, session.user.id);
    const members = await db.workSpaceMember.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });

    return InvitelyResponse(200, "Workspace members", members);
  } catch (e) {
    return InvitelyError(e);
  }
}
