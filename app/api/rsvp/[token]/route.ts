import { NextRequest, NextResponse } from "next/server";
import { ZodRsvpStatus } from "@/lib/types";
import { db } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token || token.length !== 64) {
      return NextResponse.json(
        { message: "invalid token", success: false },
        { status: 400 },
      );
    }

    const invitation = await db.invitation.findUnique({
      where: { token },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        respondedAt: true,
        // never return token back to client
        event: {
          select: {
            id: true,
            name: true,
            desc: true,
            eventAt: true,
            location: true,
            status: true,
            // never return emailBody/emailSubject
            user: {
              select: {
                name: true, // organizer name
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "invitation not found", success: false },
        { status: 404 },
      );
    }

    // check if event has already passed
    const eventHasPassed = new Date(invitation.event.eventAt) < new Date();

    return NextResponse.json(
      {
        message: "invitation fetched successfully",
        success: true,
        invitation: {
          recipientName: invitation.name,
          recipientEmail: invitation.email,
          currentStatus: invitation.status,
          respondedAt: invitation.respondedAt,
          eventHasPassed,
          eventCancelled: invitation.event.status === "cancelled",
          event: {
            id: invitation.event.id,
            name: invitation.event.name,
            desc: invitation.event.desc,
            eventAt: invitation.event.eventAt,
            location: invitation.event.location,
            organizerName: invitation.event.user.name,
          },
        },
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token || token.length !== 64) {
      return NextResponse.json(
        { message: "invalid token", success: false },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { success, data } = ZodRsvpStatus.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { message: "invalid status value", success: false },
        { status: 400 },
      );
    }

    const invitation = await db.invitation.findUnique({
      where: { token },
      select: {
        id: true,
        status: true,
        respondedAt: true,
        event: {
          select: {
            id: true,
            eventAt: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "invitation not found", success: false },
        { status: 404 },
      );
    }

    if (new Date(invitation.event.eventAt) < new Date()) {
      return NextResponse.json(
        {
          message: "this event has already passed. rsvp is closed.",
          success: false,
        },
        { status: 410 },
      );
    }
    // check if the event is canceled
    if (invitation.event.status === "cancelled") {
      return NextResponse.json(
        {
          message: "this event has been cancelled. rsvp is closed.",
          success: false,
        },
        { status: 410 },
      );
    }
    // if they already responded and it was less than 30 seconds ago, reject
    if (invitation.respondedAt) {
      const secondsSinceLastResponse =
        (new Date().getTime() - new Date(invitation.respondedAt).getTime()) /
        1000;

      if (secondsSinceLastResponse < 10) {
        return NextResponse.json(
          {
            message: "please wait a moment before changing your response",
            success: false,
          },
          { status: 429 },
        );
      }
    }

    if (invitation.status === data.status && !data.guestNote) {
      return NextResponse.json(
        {
          message: `you already responded as ${data.status}`,
          success: true,
          status: data.status,
        },
        { status: 200 },
      );
    }

    const updated = await db.invitation.update({
      where: { token },
      data: {
        status: data.status,
        respondedAt: new Date(),
        ...(data.guestNote !== undefined && { guestNote: data.guestNote }),
      },
      select: {
        status: true,
        respondedAt: true,
        guestNote: true,
      },
    });

    return NextResponse.json(
      {
        message: getConfirmationMessage(data.status, invitation.event.name),
        success: true,
        status: updated.status,
        respondedAt: updated.respondedAt,
        guestNote: updated.guestNote,
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

function getConfirmationMessage(
  status: "attending" | "maybe" | "declined",
  eventName: string,
): string {
  switch (status) {
    case "attending":
      return `You're in! See you at ${eventName} 🎉`;
    case "maybe":
      return `Got it! We'll keep your spot tentative for ${eventName}`;
    case "declined":
      return `Sorry you can't make it. You've declined ${eventName}`;
  }
}
