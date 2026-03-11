import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eventZ, RawEvent } from "@/lib/types";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { success, data } = eventZ.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { message: "invalid event data", success: false },
        { status: 400 },
      );
    }

    // eventAt must be in the future
    if (new Date(data.eventAt) <= new Date()) {
      return NextResponse.json(
        { message: "event date must be in the future", success: false },
        { status: 400 },
      );
    }

    const event = await db.event.create({
      data: {
        userId: session.user.id,
        name: data.name.trim(),
        desc: data.desc.trim(),
        eventAt: new Date(data.eventAt),
        location: data.location.trim(),
        emailSubject: data.emailSubject.trim(),
        emailBody: data.emailBody.trim(),
      },
    });

    return NextResponse.json(
      { message: "event created successfully", success: true, event },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 },
    );
  }
}

export async function GET() {
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

    const events = await db.event.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            invitations: true,
          },
        },
        invitations: {
          select: { status: true },
        },
      },
    });

    const shaped = events.map((event: RawEvent) => {
      const summary = {
        total: event.invitations.length,
        attending: event.invitations.filter(
          (i: { status: string }) => i.status === "attending",
        ).length,
        maybe: event.invitations.filter(
          (i: { status: string }) => i.status === "maybe",
        ).length,
        declined: event.invitations.filter(
          (i: { status: string }) => i.status === "declined",
        ).length,
        pending: event.invitations.filter(
          (i: { status: string }) => i.status === "pending",
        ).length,
      };

      const { invitations, _count, ...rest } = event;
      return { ...rest, summary };
    });

    return NextResponse.json(
      { message: "events fetched successfully", success: true, events: shaped },
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
