import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
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

    const { eventId } = await params;

    // ownership check
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: "event not found", success: false },
        { status: 404 },
      );
    }

    if (event.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden", success: false },
        { status: 403 },
      );
    }

    const invitations = await db.invitation.findMany({
      where: { eventId },
      orderBy: { sentAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        sentAt: true,
        respondedAt: true,
      },
    });

    const summary = {
      total: invitations.length,
      attending: invitations.filter((i) => i.status === "attending").length,
      maybe: invitations.filter((i) => i.status === "maybe").length,
      declined: invitations.filter((i) => i.status === "declined").length,
      pending: invitations.filter((i) => i.status === "pending").length,
    };

    return NextResponse.json(
      {
        message: "Invitations fetched successfully",
        success: true,
        invitations,
        summary,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}
