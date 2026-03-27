import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { ZodEvent } from "@/lib/zod/event";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = validateRequest(ZodEvent, body);
    const event = await EventService.createEvent(session.user.id, data);
    return InvitelyResponse(201, "event created successfully", event);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function GET() {
  try {
    const session = await requireSession();
    const events = await EventService.userEvents(session.user.id);
    return InvitelyResponse(200, "Events fetched successfully", events);
  } catch (e) {
    return InvitelyError(e);
  }
}
