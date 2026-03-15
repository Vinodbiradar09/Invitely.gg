import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { EmailData, ResendResult } from "@/lib/types";
import { resend } from "@/lib/resend";
import { db } from "@/lib/prisma";

const BATCH_SIZE = 25;

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { message: "unauthorized", success: false },
        { status: 401 },
      );
    }

    const now = new Date();

    const scheduledEvents = await db.event.findMany({
      where: {
        status: "scheduled",
        scheduledAt: { lte: now },
      },
      include: {
        user: { select: { name: true, email: true } },
        invitations: {
          select: {
            id: true,
            email: true,
            name: true,
            token: true,
            personalizedOpening: true,
          },
        },
      },
    });

    if (scheduledEvents.length === 0) {
      return NextResponse.json(
        { message: "no scheduled events to send", success: true, processed: 0 },
        { status: 200 },
      );
    }

    const results = await Promise.allSettled(
      scheduledEvents.map(async (event) => {
        const eventDate = new Date(event.eventAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const batchPayload: EmailData[] = event.invitations.map((inv) => ({
          from: process.env.FROM!,
          to: inv.email,
          subject: event.emailSubject,
          react: InviteEmail({
            organizerName: event.user.name,
            organizerEmail: event.user.email,
            recipientName: inv.name ?? "",
            recipientEmail: inv.email,
            eventName: event.name,
            eventDate,
            eventLocation: event.location,
            emailBody: event.emailBody,
            token: inv.token,
          }),
        }));

        const batches: EmailData[][] = [];
        for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
          batches.push(batchPayload.slice(i, i + BATCH_SIZE));
        }

        const batchResults = await Promise.allSettled(
          batches.map((batch) => resend.batch.send(batch)),
        );

        const failed = batchResults.filter(
          (r: ResendResult): r is PromiseRejectedResult =>
            r.status === "rejected",
        );

        await db.event.update({
          where: { id: event.id },
          data: {
            status: "active",
            sentAt: now,
            scheduledAt: null,
          },
        });

        if (failed.length > 0) {
          throw new Error(
            `event ${event.id} — ${failed.length} batches failed`,
          );
        }

        return { eventId: event.id, sent: event.invitations.length };
      }),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      console.error("some scheduled events failed to send:", failed);
    }

    return NextResponse.json(
      {
        message: `processed ${scheduledEvents.length} scheduled events`,
        success: true,
        processed: scheduledEvents.length,
        succeeded,
        failed: failed.length,
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
