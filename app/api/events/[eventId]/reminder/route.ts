import { EmailData, pendingInvitation, ResendResult } from "@/lib/types";
import { buildPersonalisationPrompt } from "@/lib/prompt";
import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { llm } from "@/lib/llm";

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

    const event = await db.event.findUnique({ where: { id: eventId } });

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

    if (event.status === "cancelled") {
      return NextResponse.json(
        {
          message: "cannot send reminders for a cancelled event",
          success: false,
        },
        { status: 409 },
      );
    }

    const pendingInvitations = await db.invitation.findMany({
      where: { eventId, status: "pending" },
      select: { id: true, email: true, name: true, token: true },
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

    // generate new personalised openings for reminders in parallel
    const openings = await Promise.allSettled(
      pendingInvitations.map(async (inv: pendingInvitation) => {
        const raw = await llm(
          buildPersonalisationPrompt({
            recipientName: inv.name || inv.email.split("@")[0],
            eventName: event.name,
            eventDate,
            eventLocation: event.location,
            eventDesc: event.desc,
          }),
        );
        const parsed = JSON.parse(raw);
        return { email: inv.email, opening: parsed.opening ?? "" };
      }),
    );

    const openingMap = new Map<string, string>();
    openings.forEach((result, i) => {
      const email = pendingInvitations[i].email;
      if (result.status === "fulfilled") {
        openingMap.set(email, result.value.opening);
      } else {
        openingMap.set(email, "");
      }
    });

    const batchPayload = pendingInvitations.map((inv: pendingInvitation) => ({
      from: process.env.FROM!,
      to: inv.email,
      subject: `Reminder: ${event.emailSubject}`,
      react: InviteEmail({
        organizerName: session.user.name,
        organizerEmail: session.user.email,
        recipientName: inv.name ?? "",
        recipientEmail: inv.email,
        eventName: event.name,
        eventDate,
        eventLocation: event.location,
        emailBody: event.emailBody,
        personalizedOpening: openingMap.get(inv.email) ?? "",
        token: inv.token,
      }),
    }));

    const batches: EmailData[][] = [];
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
