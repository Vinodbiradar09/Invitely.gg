import { EmailData, pendingInvitation, ResendResult } from "@/lib/types";
import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const BATCH_SIZE = 25;

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
        { message: "forbidden you are not owner", success: false },
        { status: 403 },
      );
    }

    // only fetch pending these are the only ones getting a reminder
    const pendingInvitations = await db.invitation.findMany({
      where: {
        eventId,
        status: "pending",
      },
      select: {
        id: true,
        email: true,
        name: true,
        token: true,
      },
    });

    if (pendingInvitations.length === 0) {
      return NextResponse.json(
        {
          message: "no pending invitations everyone has already responded",
          success: false,
        },
        { status: 400 },
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

    // build reminder emails
    const batchPayload = pendingInvitations.map((inv: pendingInvitation) => ({
      from: process.env.FROM!,
      to: inv.email,
      subject: `Reminder: ${event.emailSubject}`, // prefix subject with reminder
      react: InviteEmail({
        organizerName: session.user.name,
        organizerEmail: session.user.email,
        recipientName: inv.name ?? inv.email,
        recipientEmail: inv.email,
        eventName: event.name,
        eventDate,
        eventLocation: event.location,
        emailBody: event.emailBody,
        token: inv.token,
      }),
    }));

    const batches = [];
    for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
      batches.push(batchPayload.slice(i, i + BATCH_SIZE));
    }

    const batchResults = await Promise.allSettled(
      batches.map((batch: EmailData[]) => resend.batch.send(batch)),
    );

    const failedBatches = batchResults.filter(
      (r: ResendResult): r is PromiseRejectedResult => r.status === "rejected",
    );

    if (failedBatches.length > 0) {
      console.error("some reminder batches failed:", failedBatches);
      return NextResponse.json(
        {
          message: "some reminders failed to send. please try again.",
          success: false,
        },
        { status: 207 },
      );
    }

    return NextResponse.json(
      {
        message: `reminder sent to ${pendingInvitations.length} pending guest${pendingInvitations.length === 1 ? "" : "s"}`,
        success: true,
        reminded: pendingInvitations.length,
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
