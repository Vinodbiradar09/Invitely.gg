import { NextRequest, NextResponse } from "next/server";
import { UpdateEmail } from "@/components/update-email";
import { ZodUpdateEvent } from "@/lib/types";
import { headers } from "next/headers";
import { resend } from "@/lib/resend";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

const BATCH_SIZE = 25;

export async function GET(
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
    const event = await db.event.findUnique({ where: { id: eventId } });
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
    return NextResponse.json(
      { message: "event queued successfully", success: true, event },
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

export async function PUT(
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

    const { success, data } = ZodUpdateEvent.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid data", success: false },
        { status: 400 },
      );
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "no fields to update", success: false },
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
        {
          message: "forbidden access you are not owner of event",
          success: false,
        },
        { status: 403 },
      );
    }

    if (event.status === "cancelled") {
      return NextResponse.json(
        { message: "cannot edit a cancelled event", success: false },
        { status: 409 },
      );
    }

    const locationChanged = data.location && data.location !== event.location;
    const timeChanged =
      data.eventAt &&
      new Date(data.eventAt).getTime() !== new Date(event.eventAt).getTime();
    const shouldNotify = !!(locationChanged || timeChanged);

    const oldLocation = event.location;
    const oldDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = await db.event.update({
      where: { id: eventId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.desc && { desc: data.desc }),
        ...(data.eventAt && { eventAt: new Date(data.eventAt) }),
        ...(data.location && { location: data.location }),
        ...(data.emailSubject && { emailSubject: data.emailSubject }),
        ...(data.emailBody && { emailBody: data.emailBody }),
      },
    });

    if (shouldNotify && event.sentAt) {
      const invitations = await db.invitation.findMany({
        where: { eventId },
        select: { email: true, name: true, token: true },
      });

      if (invitations.length > 0) {
        const newDate = new Date(updated.eventAt).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const batchPayload = invitations.map((inv) => ({
          from: process.env.FROM!,
          to: inv.email,
          subject: `Event Update: ${updated.name}`,
          react: UpdateEmail({
            organizerName: session.user.name,
            recipientName: inv.name ?? "",
            recipientEmail: inv.email,
            eventName: updated.name,
            eventDate: newDate,
            eventLocation: updated.location,
            token: inv.token,
            changes: {
              locationChanged: !!locationChanged,
              timeChanged: !!timeChanged,
              oldLocation: locationChanged ? oldLocation : undefined,
              oldDate: timeChanged ? oldDate : undefined,
            },
          }),
        }));

        const batches = [];
        for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
          batches.push(batchPayload.slice(i, i + BATCH_SIZE));
        }

        await Promise.allSettled(
          batches.map((batch) => resend.batch.send(batch)),
        );
      }
    }

    return NextResponse.json(
      {
        message: "event updated successfully",
        success: true,
        event: updated,
        shouldNotify,
        notified: shouldNotify && event.sentAt,
        changes: {
          locationChanged: !!locationChanged,
          timeChanged: !!timeChanged,
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

export async function DELETE(
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
    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json(
        { message: "event not found", success: false },
        { status: 404 },
      );
    }
    if (event.userId !== session.user.id) {
      return NextResponse.json(
        { message: "forbidden", success: false },
        { status: 403 },
      );
    }
    await db.event.delete({ where: { id: eventId } });
    return NextResponse.json(
      { message: "event deleted successfully", success: true },
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
