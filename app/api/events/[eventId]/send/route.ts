import { EmailData, ResendResult, InvitationItem } from "@/lib/types/index";
import { generateGuestOpeningPrompt } from "@/lib/prompts/generation";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { EventService } from "@/lib/validations/validate-event";
import { EventIdParams, formatEventDate } from "@/lib/utils";
import { ZodSendInvitations } from "@/lib/zod/invitation";
import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { ConflictError } from "@/lib/shared/exceptions";
import { InvitelyError } from "@/lib/shared/api";
import { resend } from "@/lib/resend/index";
import { db } from "@/lib/db/prisma";
import { randomBytes } from "crypto";
import { llm } from "@/lib/llm/llm";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

const BATCH_SIZE = 50;

export async function POST(req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodSendInvitations, body);
    const event = await EventService.ownedEvent(eventId, session.user.id);
    if (event.status === "cancelled") {
      throw new ConflictError("Cannot send invitaions for a cancelled event");
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
    const eventDate = formatEventDate(event.eventAt, "full");
    const openings = await Promise.allSettled(
      data.recipients.map(
        async (recipient: { email: string; name?: string | null }) => {
          const raw = await llm(
            generateGuestOpeningPrompt({
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
    return InvitelyError(e);
  }
}
