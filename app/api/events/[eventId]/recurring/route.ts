import { NextRequest, NextResponse } from "next/server";
import { ZodRecurrence } from "@/lib/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
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
    const { eventId } = await params;
    const body = await req.json();
    const { success, data } = ZodRecurrence.safeParse(body);
    if (!success) {
      return NextResponse.json(
        {
          message: "invalid data",
          success: false,
        },
        { status: 400 },
      );
    }
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      return NextResponse.json(
        {
          message: "event not found",
          success: false,
        },
        { status: 404 },
      );
    }
    if (event.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden access you are not the owner", success: false },
        { status: 403 },
      );
    }
    if (event.status === "cancelled") {
      return NextResponse.json(
        {
          message: "cannot set recurrence on a cancelled event",
          success: false,
        },
        { status: 409 },
      );
    }
    const updated = await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        recurrence: data.recurrence,
      },
    });
    return NextResponse.json(
      {
        message: data.recurrence
          ? `event set to repeat ${data.recurrence}`
          : "recurrence removed",
        success: true,
        recurrence: updated.recurrence,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "unauthorized user", success: false },
        { status: 401 },
      );
    }

    const { eventId } = await params;

    const url = new URL(req.url);
    const cancelFuture = url.searchParams.get("cancelFuture") === "true";

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        childEvents: {
          where: {
            eventAt: { gt: new Date() },
            status: { not: "cancelled" },
          },
          select: { id: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "event not found", success: false },
        { status: 404 },
      );
    }

    if (event.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden access you are not the owner", success: false },
        { status: 403 },
      );
    }

    if (!event.recurrence) {
      return NextResponse.json(
        { message: "this event has no recurrence set", success: false },
        { status: 409 },
      );
    }

    const now = new Date();

    await db.$transaction(async (tx) => {
      await tx.event.update({
        where: { id: eventId },
        data: { recurrence: null },
      });

      if (cancelFuture && event.childEvents.length > 0) {
        await tx.event.updateMany({
          where: {
            id: { in: event.childEvents.map((c) => c.id) },
          },
          data: {
            status: "cancelled",
            cancelledAt: now,
            recurrence: null,
          },
        });
      }
    });

    return NextResponse.json(
      {
        message: cancelFuture
          ? `recurrence stopped and ${event.childEvents.length} future event${event.childEvents.length === 1 ? "" : "s"} cancelled`
          : "recurrence stopped existing events unchanged",
        success: true,
        cancelledFutureCount: cancelFuture ? event.childEvents.length : 0,
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
