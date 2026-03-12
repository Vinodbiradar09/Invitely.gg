import { NextResponse, NextRequest } from "next/server";
import { ZodWorkspaceId } from "@/lib/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "unauthorized user",
          success: false,
        },
        { status: 401 },
      );
    }
    const { workspaceId } = await params;
    const { success, data } = ZodWorkspaceId.safeParse({ workspaceId });
    if (!success) {
      return NextResponse.json(
        {
          message: "required valid workspace id",
          success: false,
        },
        { status: 400 },
      );
    }
    // find workspace if not found return
    const workspace = await db.workSpace.findUnique({
      where: { id: data.workspaceId },
    });
    if (!workspace) {
      return NextResponse.json(
        {
          message: "workspace not found",
          success: false,
        },
        { status: 404 },
      );
    }
    // check ownership
    if (workspace.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "forbidden you are not workspace owner",
          success: false,
        },
        { status: 403 },
      );
    }
    // delete workspace
    await db.workSpace.delete({
      where: {
        id: data.workspaceId,
        userId: session.user.id,
      },
    });
    return NextResponse.json(
      {
        message: "workspace deleted successfully",
        success: true,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
