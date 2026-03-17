import { NextRequest, NextResponse } from "next/server";
import { ZodOrganizerNote } from "@/lib/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> },
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
    const { invitationId } = await params;
    const body = await req.json();
    const { success, data } = ZodOrganizerNote.safeParse(body);
    if (!success) {
      return NextResponse.json(
        {
          message: "note is required",
          success: false,
        },
        { status: 400 },
      );
    }
    const invitation = await db.invitation.findUnique({
      where: {
        id: invitationId,
      },
      select: {
        id: true,
        event: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!invitation) {
      return NextResponse.json(
        {
          message: "invitation not found",
          success: false,
        },
        { status: 404 },
      );
    }
    if (invitation.event.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden access you are not the owner", success: false },
        { status: 403 },
      );
    }
    const updated = await db.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        organizerNote: data.organizerNote || null,
      },
      select: {
        id: true,
        organizerNote: true,
      },
    });
    return NextResponse.json(
      {
        message: "note saved",
        success: true,
        organizerNote: updated.organizerNote,
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
