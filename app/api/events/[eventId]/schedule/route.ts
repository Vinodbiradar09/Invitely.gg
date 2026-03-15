import { NextRequest, NextResponse } from "next/server";
import { ZodSchedule } from "@/lib/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

export async function POST(
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
    const body = await req.json();
    const { success, data } = ZodSchedule.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid data", success: false },
        { status: 400 },
      );
    }
    const scheduledAt = new Date(data.scheduledAt);
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { message: "scheduled time must be in the future", success: false },
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
    // if the event is cancelled return
    if (event.status === "cancelled") {
      return NextResponse.json(
        { message: "cannot schedule a cancelled event", success: false },
        { status: 409 },
      );
    }
    // if the event is already scheduled return
    if (event.status === "scheduled") {
      return NextResponse.json(
        { message: "event is already scheduled", success: false },
        { status: 409 },
      );
    }

    if (event.sentAt) {
      return NextResponse.json(
        {
          message: "invitations have already been sent for this event",
          success: false,
        },
        { status: 409 },
      );
    }

    const incomingEmails = data.recipients.map((x) => x.email);
    const alreadyInvited = await db.invitation.findMany({
      where: {
        eventId,
        email: { in: incomingEmails },
      },
    });
    if (alreadyInvited.length > 0) {
      const duplicates = alreadyInvited.map((i) => i.email).join(", ");
      return NextResponse.json(
        {
          message: `these emails were already invited: ${duplicates}`,
          success: false,
        },
        { status: 409 },
      );
    }
    const { randomBytes } = await import("crypto");
    const invitationData = data.recipients.map((recipient) => ({
      eventId,
      email: recipient.email,
      name: recipient.name ?? null,
      token: randomBytes(32).toString("hex"),
    }));
    await db.$transaction(async (tx: TxClient) => {
      await tx.invitation.createMany({
        data: invitationData,
      });
      await tx.event.update({
        where: {
          id: eventId,
        },
        data: {
          status: "scheduled",
          scheduledAt,
        },
      });
    });

    return NextResponse.json(
      {
        message: `invitations scheduled for ${scheduledAt.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
        success: true,
        scheduledAt,
        recipients: data.recipients.length,
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

    if (event.status !== "scheduled") {
      return NextResponse.json(
        { message: "event is not scheduled", success: false },
        { status: 409 },
      );
    }

    await db.$transaction(async (tx: TxClient) => {
      await tx.invitation.deleteMany({
        where: {
          eventId,
        },
      });
      await tx.event.update({
        where: {
          id: eventId,
        },
        data: {
          status: "active",
          scheduledAt: null,
        },
      });
    });
    return NextResponse.json(
      { message: "scheduled send cancelled successfully", success: true },
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
