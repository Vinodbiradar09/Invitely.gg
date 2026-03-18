import { InviteEmail } from "@/components/email-template";
import { buildPersonalisationPrompt } from "@/lib/prompt";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { llm } from "@/lib/llm";
import { randomBytes } from "crypto";
import {
  EmailData,
  InvitationItem,
  ResendResult,
  ZodSendInvitations,
} from "@/lib/types";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

const BATCH_SIZE = 25;

export async function POST(
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
    const body = await req.json();

    const { success, data } = ZodSendInvitations.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid recipients data", success: false },
        { status: 400 },
      );
    }

    const event = await db.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json(
        { message: "event not found", success: false },
        { status: 404 },
      );
    }

    if (event.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden you are not owner of event", success: false },
        { status: 403 },
      );
    }

    if (event.status === "cancelled") {
      return NextResponse.json(
        {
          message: "cannot send invitations for a cancelled event",
          success: false,
        },
        { status: 409 },
      );
    }

    const incomingEmails = data.recipients.map(
      (r: { email: string; name?: string | null }) => r.email,
    );
    const alreadyInvited = await db.invitation.findMany({
      where: { eventId, email: { in: incomingEmails } },
      select: { email: true },
    });

    if (alreadyInvited.length > 0) {
      const duplicates = alreadyInvited
        .map((i: { email: string }) => i.email)
        .join(", ");
      return NextResponse.json(
        {
          message: `these emails were already invited: ${duplicates}`,
          success: false,
        },
        { status: 409 },
      );
    }

    const now = new Date();

    // calculate how many hours before the event the organizer is sending
    const hoursBeforeEvent = Math.round(
      (new Date(event.eventAt).getTime() - now.getTime()) / (1000 * 60 * 60),
    );

    const eventDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const openings = await Promise.allSettled(
      data.recipients.map(
        async (recipient: { email: string; name?: string | null }) => {
          const raw = await llm(
            buildPersonalisationPrompt({
              recipientName: recipient.name || recipient.email.split("@")[0],
              eventName: event.name,
              eventDate,
              eventLocation: event.location,
              eventDesc: event.desc,
            }),
          );
          const parsed = JSON.parse(raw);
          return { email: recipient.email, opening: parsed.opening ?? "" };
        },
      ),
    );

    const openingMap = new Map<string, string>();
    openings.forEach((result, i) => {
      const email = data.recipients[i].email;
      openingMap.set(
        email,
        result.status === "fulfilled" ? result.value.opening : "",
      );
    });

    const invitationData = data.recipients.map(
      (recipient: { email: string; name?: string | null }) => ({
        eventId,
        email: recipient.email,
        name: recipient.name ?? null,
        token: randomBytes(32).toString("hex"),
        personalizedOpening: openingMap.get(recipient.email) ?? "",
      }),
    );

    const createdInvitations = await db.$transaction(async (tx: TxClient) => {
      const invitations = await tx.invitation.createManyAndReturn({
        data: invitationData,
      });
      await tx.event.update({
        where: { id: eventId },
        data: {
          sentAt: now,
          // store offset only if this is a recurring event and offset not already set
          ...(event.recurrence &&
            !event.inviteSendOffset && {
              inviteSendOffset: hoursBeforeEvent,
            }),
        },
      });
      return invitations;
    });

    const batchPayload = createdInvitations.map((inv: InvitationItem) => ({
      from: process.env.FROM!,
      to: inv.email,
      subject: event.emailSubject,
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
      console.error("some batches failed:", failedBatches);
      return NextResponse.json(
        {
          message:
            "invitations saved but some emails failed to send. Use 'Send Reminder' to retry.",
          success: true,
          sent: createdInvitations.length,
          emailsFailed: failedBatches.length * BATCH_SIZE,
        },
        { status: 207 },
      );
    }

    return NextResponse.json(
      {
        message: "invitations sent successfully",
        success: true,
        sent: createdInvitations.length,
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
