import { InvitationService } from "@/lib/validations/validate-invitations";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { EventService } from "@/lib/validations/validate-event";
import { EventIdParams, formatEventDate } from "@/lib/utils";
import { InviteEmail } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { ConflictError } from "@/lib/shared/exceptions";
import { ZodResendLink } from "@/lib/zod/invitation";
import { InvitelyError } from "@/lib/shared/api";
import { resend } from "@/lib/resend/index";

export async function POST(req: NextRequest, { params }: EventIdParams) {
  try {
    const session = await requireSession();
    const { eventId } = await params;
    const body = await req.json();
    const data = validateRequest(ZodResendLink, body);
    const event = await EventService.ownedEvent(eventId, session.user.id);
    if (event.status === "cancelled") {
      throw new ConflictError("Cannot resend link for a cancelled event");
    }
    const invitation = await InvitationService.validateInvitationForEmail(
      eventId,
      data.email,
    );
    const eventDate = formatEventDate(event.eventAt, "full");
    await resend.emails.send({
      from: process.env.FROM!,
      to: invitation.email,
      subject: `Your invitation link: ${event.name}`,
      react: InviteEmail({
        organizerEmail: session.user.email,
        organizerName: session.user.name,
        recipientName: invitation.name ?? "",
        recipientEmail: invitation.email,
        eventName: event.name,
        eventDate,
        eventLocation: event.location,
        emailBody: event.emailBody,
        token: invitation.token,
      }),
    });
    return NextResponse.json(
      {
        message: `invitation link resent to ${data.email}`,
        success: true,
      },
      { status: 200 },
    );
  } catch (e) {
    return InvitelyError(e);
  }
}
