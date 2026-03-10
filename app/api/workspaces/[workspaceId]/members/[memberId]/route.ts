import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
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
    const { memberId } = await params;
    // find the member
    const isMember = await db.workSpaceMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        workspace: true,
      },
    });
    // return not found
    if (!isMember) {
      return NextResponse.json(
        { message: "member not found", success: false },
        { status: 404 },
      );
    }
    // check ownership
    if (isMember.workspace.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "Forbidden",
          success: false,
        },
        { status: 403 },
      );
    }
    // delete the member from workspace
    await db.workSpaceMember.delete({
      where: {
        id: memberId,
      },
    });
    return NextResponse.json(
      {
        message: "member removed from workspace successfully",
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
