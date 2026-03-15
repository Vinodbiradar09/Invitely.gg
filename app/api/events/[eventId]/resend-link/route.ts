import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { ZodResendLink } from "@/lib/types";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

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
        {
          message: "unauthorized user",
          success: false,
        },
        { status: 401 },
      );
    }
    const { eventId } = await params;
    const body = await req.json();
    const { success, data } = ZodResendLink.safeParse(body);
    if (!success) {
      return NextResponse.json(
        {
          message: "invalid email",
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
        {
          message: "forbidden access you are not owner of the event",
          success: false,
        },
        { status: 403 },
      );
    }

    if (event.status === "cancelled") {
      return NextResponse.json(
        {
          message: "cannot resend link for a cancelled event",
          success: false,
        },
        { status: 409 },
      );
    }

    const invitation = await db.invitation.findUnique({
      where: {
        eventId_email: {
          eventId,
          email: data.email,
        },
      },
    });
    if (!invitation) {
      return NextResponse.json(
        { message: "no invitation found for this email", success: false },
        { status: 404 },
      );
    }

    const eventDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await resend.emails.send({
      from: process.env.FROM!,
      to: invitation.email,
      subject: `Your invitation link: ${event.name}`,
      react: InviteEmail({
        organizerEmail: session.user.email,
        organizerName: session.user.name,
        recipientName: invitation.name ?? "",
        recipientEmail: invitation.email,
        eventName: event.name,
        eventDate,
        eventLocation: event.location,
        emailBody: event.emailBody,
        token: invitation.token,
      }),
    });
    return NextResponse.json(
      {
        message: `invitation link resent to ${data.email}`,
        success: true,
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
