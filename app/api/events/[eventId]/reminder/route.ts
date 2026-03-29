import { EmailData, pendingInvitation, ResendResult } from "@/lib/types/index";
import { BadRequestError, ConflictError } from "@/lib/shared/exceptions";
import { generateGuestOpeningPrompt } from "@/lib/prompts/generation";
import { requireSession } from "@/lib/auth/server/require-session";
import { EventService } from "@/lib/validations/validate-event";
import { EventIdParams, formatEventDate } from "@/lib/utils";
import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { InvitelyError } from "@/lib/shared/api";
import { resend } from "@/lib/resend/index";
import { db } from "@/lib/db/prisma";
import { llm } from "@/lib/llm/llm";

const BATCH_SIZE = 25;

export async function POST(_req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const event = await EventService.ownedEvent(eventId, session.user.id);
    if (event.status === "cancelled") {
      throw new ConflictError("Cannot send reminders for a cancelled event");
    }
    const pendingInvitations = await db.invitation.findMany({
      where: { eventId, status: "pending" },
      select: { id: true, email: true, name: true, token: true },
    });
    if (pendingInvitations.length === 0) {
      throw new BadRequestError(
        "No pending invitations everyone has already responded",
      );
    }
    const eventDate = formatEventDate(event.eventAt, "full");
    // generate new personalised openings for reminders in parallel
    const openings = await Promise.allSettled(
      pendingInvitations.map(async (inv: pendingInvitation) => {
        const raw = await llm(
          generateGuestOpeningPrompt({
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
    return InvitelyError(e);
  }
}
