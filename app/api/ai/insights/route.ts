import { NextRequest } from "next/server";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { ZodLLMInsights } from "@/lib/zod/llm";
import { requireSession } from "@/lib/auth/server/require-session";
import { validateRequest } from "@/lib/validations/validate-request";
import { LLMService } from "@/lib/validations/validate-llm";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const { eventId } = validateRequest(ZodLLMInsights, body);
    const result = await LLMService.EventInsights(eventId, session.user.id);
    return InvitelyResponse(200, "Insights generated successfully", result);
  } catch (e) {
    return InvitelyError(e);
  }
}
