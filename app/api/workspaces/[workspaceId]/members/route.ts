import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { workspaceMembersZ } from "@/lib/types";

const MAX_MEMBERS = 25;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "unauthorized user", success: false },
        { status: 401 },
      );
    }

    const { workspaceId } = await params;
    const body = await req.json();

    const { success, data } = workspaceMembersZ.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid input for members", success: false },
        { status: 400 },
      );
    }

    // find workspace if not found return
    const workspace = await db.workSpace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json(
        { message: "workspace not found", success: false },
        { status: 404 },
      );
    }
    // check ownership
    if (workspace.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden you are not owner of workspace", success: false },
        { status: 403 },
      );
    }

    const members = await db.$transaction(async (tx) => {
      // count workspace members
      const memberCount = await tx.workSpaceMember.count({
        where: { workspaceId },
      });

      const remainingSlots = MAX_MEMBERS - memberCount;

      if (data.length > remainingSlots) {
        throw new Error(
          `slot_exceeded:you can only add ${remainingSlots} more member${remainingSlots === 1 ? "" : "s"} (limit: ${MAX_MEMBERS})`,
        );
      }

      const incomingEmails = data.map((m) => m.email);
      // check existing members email address
      const existingMembers = await tx.workSpaceMember.findMany({
        where: {
          workspaceId,
          email: { in: incomingEmails },
        },
        select: { email: true },
      });

      if (existingMembers.length > 0) {
        const duplicates = existingMembers.map((m) => m.email).join(", ");
        throw new Error(`duplicate_emails:${duplicates}`);
      }

      return tx.workSpaceMember.createManyAndReturn({
        data: data.map((mem) => ({
          workspaceId,
          name: mem.name ?? null,
          email: mem.email,
        })),
      });
    });

    return NextResponse.json(
      {
        message: "members added successfully",
        success: true,
        members,
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.startsWith("slot_exceeded:")) {
        return NextResponse.json(
          { message: e.message.split("slot_exceeded:")[1], success: false },
          { status: 409 },
        );
      }
      if (e.message.startsWith("duplicate_emails:")) {
        const emails = e.message.split("duplicate_emails:")[1];
        return NextResponse.json(
          {
            message: `these emails already exist in the workspace: ${emails}`,
            success: false,
          },
          { status: 409 },
        );
      }
    }
    console.error(e);
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "unauthorized user", success: false },
        { status: 401 },
      );
    }

    const { workspaceId } = await params;

    // find workspace if not found return
    const workspace = await db.workSpace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found", success: false },
        { status: 404 },
      );
    }
    // check ownership
    if (workspace.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "forbidden you are not the owner of workspace",
          success: false,
        },
        { status: 403 },
      );
    }

    const members = await db.workSpaceMember.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        message: "members got successfully",
        success: true,
        members,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 },
    );
  }
}
