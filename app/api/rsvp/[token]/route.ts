import { validateRequest } from "@/lib/validations/validate-request";
import { RsvpServices } from "@/lib/validations/validate-rsvp";
import { getConfirmationMessage, Token } from "@/lib/utils";
import { ConflictError } from "@/lib/shared/exceptions";
import { NextRequest, NextResponse } from "next/server";
import { ZodRsvpStatus } from "@/lib/zod/invitation";
import { InvitelyError } from "@/lib/shared/api";
import { db } from "@/lib/db/prisma";

export async function GET(_req: NextRequest, { params }: Token) {
  try {
    const { token } = await params;
    if (!token || token.length !== 64) {
      throw new ConflictError("Invalid Token");
    }
    const invitation = await RsvpServices.rsvpInvitation(token);
    // check if event has already passed
    const eventHasPassed = new Date(invitation.event.eventAt) < new Date();
    return NextResponse.json(
      {
        message: "invitation fetched successfully",
        success: true,
        invitation: {
          recipientName: invitation.name,
          recipientEmail: invitation.email,
          currentStatus: invitation.status,
          respondedAt: invitation.respondedAt,
          eventHasPassed,
          eventCancelled: invitation.event.status === "cancelled",
          event: {
            id: invitation.event.id,
            name: invitation.event.name,
            desc: invitation.event.desc,
            eventAt: invitation.event.eventAt,
            location: invitation.event.location,
            organizerName: invitation.event.user.name,
          },
        },
      },
      { status: 200 },
    );
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: Token) {
  try {
    const { token } = await params;
    if (!token || token.length !== 64) {
      throw new ConflictError("Invalid Token");
    }
    const body = await req.json();
    const data = validateRequest(ZodRsvpStatus, body);
    const invitation = await RsvpServices.updateRsvpInvitation(token);
    if (invitation.status === data.status && !data.guestNote) {
      return NextResponse.json(
        {
          message: `you already responded as ${data.status}`,
          success: true,
          status: data.status,
        },
        { status: 200 },
      );
    }
    const updated = await db.invitation.update({
      where: { token },
      data: {
        status: data.status,
        respondedAt: new Date(),
        ...(data.guestNote !== undefined && { guestNote: data.guestNote }),
      },
      select: {
        status: true,
        respondedAt: true,
        guestNote: true,
      },
    });

    return NextResponse.json(
      {
        message: getConfirmationMessage(data.status, invitation.event.name),
        success: true,
        status: updated.status,
        respondedAt: updated.respondedAt,
        guestNote: updated.guestNote,
      },
      { status: 200 },
    );
  } catch (e) {
    return InvitelyError(e);
  }
}
