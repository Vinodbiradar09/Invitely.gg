import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

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
        {
          message: "forbidden access you are not owner of event",
          success: false,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { message: "event queued successfully", success: true, event },
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

export async function DELETE(
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

    await db.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json(
      { message: "event deleted successfully", success: true },
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
