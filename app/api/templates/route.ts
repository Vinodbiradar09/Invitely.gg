import { TemplateService } from "@/lib/validations/validate-template";
import { validateRequest } from "@/lib/validations/validate-request";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { EventService } from "@/lib/validations/validate-event";
import { ZodCreateTemplate } from "@/lib/types";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await requireSession();
    const templates = await TemplateService.eventTemplates(session.user.id);
    return InvitelyResponse(200, "templated got successfully", templates);
  } catch (e) {
    return InvitelyError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = validateRequest(ZodCreateTemplate, body);
    await TemplateService.templatesLimit(session.user.id);
    if (data.eventId) {
      await EventService.ownedEvent(data.eventId, session.user.id);
    }
    const template = await db.eventTemplate.create({
      data: {
        userId: session.user.id,
        name: data.name,
        eventId: data.eventId,
        emailBody: data.emailBody,
        emailSubject: data.emailSubject,
      },
    });
    return InvitelyResponse(201, "Template created successfully", template);
  } catch (e) {
    return InvitelyError(e);
  }
}
