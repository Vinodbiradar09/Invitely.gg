import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> },
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
    const { templateId } = await params;
    const template = await db.eventTemplate.findUnique({
      where: {
        id: templateId,
      },
    });
    if (!template) {
      return NextResponse.json(
        { message: "template not found", success: false },
        { status: 404 },
      );
    }
    if (template.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden", success: false },
        { status: 403 },
      );
    }
    await db.eventTemplate.delete({
      where: {
        id: templateId,
      },
    });
    return NextResponse.json(
      { message: "template deleted successfully", success: true },
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
