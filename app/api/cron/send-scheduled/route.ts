import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { EmailData, ResendResult } from "@/lib/types";
import { getNextEventDate } from "@/lib/prompt";
import { resend } from "@/lib/resend";
import { randomBytes } from "crypto";
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

    // fire scheduled sends
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

    const scheduleResults = await Promise.allSettled(
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
            personalizedOpening: inv.personalizedOpening ?? "",
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
          data: { status: "active", sentAt: now, scheduledAt: null },
        });

        if (failed.length > 0) {
          throw new Error(
            `event ${event.id} — ${failed.length} batches failed`,
          );
        }

        return { eventId: event.id, sent: event.invitations.length };
      }),
    );

    // create next occurrence for recurring parent events
    const recurringParents = await db.event.findMany({
      where: {
        recurrence: { not: null },
        status: "active",
        eventAt: { lt: now },
        parentEventId: null,
      },
      include: {
        childEvents: {
          orderBy: { eventAt: "desc" },
          take: 1,
          select: { eventAt: true },
        },
      },
    });

    const recurringResults = await Promise.allSettled(
      recurringParents.map(async (event) => {
        const lastEventAt =
          event.childEvents.length > 0
            ? event.childEvents[0].eventAt
            : event.eventAt;

        const nextEventAt = getNextEventDate(lastEventAt, event.recurrence!);

        if (nextEventAt <= now) return;

        const existingChild = await db.event.findFirst({
          where: { parentEventId: event.id, eventAt: nextEventAt },
        });

        if (existingChild) return;

        await db.event.create({
          data: {
            userId: event.userId,
            name: event.name,
            desc: event.desc,
            eventAt: nextEventAt,
            location: event.location,
            emailSubject: event.emailSubject,
            emailBody: event.emailBody,
            recurrence: event.recurrence,
            autoInvite: event.autoInvite,
            inviteSendOffset: event.inviteSendOffset,
            parentEventId: event.id,
            status: "active",
          },
        });
      }),
    );

    // auto-send invitations for recurring child events at the right time
    // find child events where autoInvite=true, not yet sent,
    // and the send time (eventAt - inviteSendOffset hours) has arrived
    const autoInviteChildren = await db.event.findMany({
      where: {
        autoInvite: true,
        sentAt: null,
        status: "active",
        parentEventId: { not: null },
        eventAt: { gt: now },
      },
      include: {
        user: { select: { name: true, email: true } },
        parentEvent: {
          include: {
            invitations: {
              select: { email: true, name: true },
              distinct: ["email"],
            },
          },
        },
      },
    });

    const autoInviteResults = await Promise.allSettled(
      autoInviteChildren.map(async (childEvent) => {
        if (!childEvent.parentEvent) return;
        if (!childEvent.inviteSendOffset) return;

        // calculate when invites should be sent for this child
        const sendAt = new Date(
          childEvent.eventAt.getTime() -
            childEvent.inviteSendOffset * 60 * 60 * 1000,
        );

        // only send if we've reached or passed the send time
        if (sendAt > now) return;

        const parentInvitations = childEvent.parentEvent.invitations;
        if (parentInvitations.length === 0) return;

        const invitationData = parentInvitations.map((inv) => ({
          eventId: childEvent.id,
          email: inv.email,
          name: inv.name ?? null,
          token: randomBytes(32).toString("hex"),
        }));

        const createdInvitations = await db.invitation.createManyAndReturn({
          data: invitationData,
          skipDuplicates: true,
        });

        if (createdInvitations.length === 0) return;

        const eventDate = new Date(childEvent.eventAt).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        );

        const batchPayload: EmailData[] = createdInvitations.map((inv) => ({
          from: process.env.FROM!,
          to: inv.email,
          subject: childEvent.emailSubject,
          react: InviteEmail({
            organizerName: childEvent.user.name,
            organizerEmail: childEvent.user.email,
            recipientName: inv.name ?? "",
            recipientEmail: inv.email,
            eventName: childEvent.name,
            eventDate,
            eventLocation: childEvent.location,
            emailBody: childEvent.emailBody,
            personalizedOpening: "",
            token: inv.token,
          }),
        }));

        const batches: EmailData[][] = [];
        for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
          batches.push(batchPayload.slice(i, i + BATCH_SIZE));
        }

        await Promise.allSettled(
          batches.map((batch) => resend.batch.send(batch)),
        );

        await db.event.update({
          where: { id: childEvent.id },
          data: { sentAt: now },
        });
      }),
    );

    const scheduledSucceeded = scheduleResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const scheduledFailed = scheduleResults.filter(
      (r) => r.status === "rejected",
    ).length;
    const recurringCreated = recurringResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const autoInviteSent = autoInviteResults.filter(
      (r) => r.status === "fulfilled",
    ).length;

    return NextResponse.json(
      {
        message: "cron completed",
        success: true,
        scheduled: {
          processed: scheduledEvents.length,
          succeeded: scheduledSucceeded,
          failed: scheduledFailed,
        },
        recurring: {
          processed: recurringParents.length,
          created: recurringCreated,
        },
        autoInvite: {
          processed: autoInviteChildren.length,
          sent: autoInviteSent,
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
