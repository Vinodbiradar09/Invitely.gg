import { NextRequest, NextResponse } from "next/server";
import { CancelEmail } from "@/components/cancel-email";
import { EmailData, ResendResult } from "@/lib/types";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

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
        {
          message: "forbidden access you are not owner of event",
          success: false,
        },
        { status: 403 },
      );
    }

    if (event.status === "cancelled") {
      return NextResponse.json(
        { message: "event is already cancelled", success: false },
        { status: 409 },
      );
    }
    const invitations = await db.invitation.findMany({
      where: {
        eventId,
      },
      select: {
        email: true,
        name: true,
      },
    });
    await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });
    if (invitations.length === 0) {
      return NextResponse.json(
        { message: "event cancelled successfully", success: true, notified: 0 },
        { status: 200 },
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

    const batchPayload: EmailData[] = invitations.map((inv) => ({
      from: process.env.FROM!,
      to: inv.email,
      subject: `Cancelled: ${event.name}`,
      react: CancelEmail({
        organizerName: session.user.name,
        recipientName: inv.name ?? "",
        recipientEmail: inv.email,
        eventName: event.name,
        eventDate,
        eventLocation: event.location,
      }),
    }));

    const batches: EmailData[][] = [];
    for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
      batches.push(batchPayload.slice(i, i + BATCH_SIZE));
    }
    const batchResults = await Promise.allSettled(
      batches.map((batch) => resend.batch.send(batch)),
    );

    const failedBatches = batchResults.filter(
      (r: ResendResult): r is PromiseRejectedResult => r.status === "rejected",
    );
    if (failedBatches.length > 0) {
      console.error("some cancellation emails failed:", failedBatches);
      return NextResponse.json(
        {
          message: "event cancelled but some notification emails failed",
          success: true,
          notified: invitations.length - failedBatches.length * BATCH_SIZE,
        },
        { status: 207 },
      );
    }
    return NextResponse.json(
      {
        message: `event cancelled and ${invitations.length} guest${invitations.length === 1 ? "" : "s"} notified`,
        success: true,
        notified: invitations.length,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
