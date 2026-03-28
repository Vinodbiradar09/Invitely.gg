import { generateInviteEmailPrompt } from "@/lib/prompts/generation";
import { validateRequest } from "@/lib/validations/validate-request";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { requireSession } from "@/lib/auth/server/require-session";
import { LLMService } from "@/lib/validations/validate-llm";
import { ZodLLMOptimze } from "@/lib/zod/llm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireSession();
    const body = await req.json();
    const data = validateRequest(ZodLLMOptimze, body);
    const prompt = generateInviteEmailPrompt(data);
    const optimizedContent = await LLMService.optimizeInvite(prompt);
    return InvitelyResponse(
      200,
      "Email optimized successfully",
      optimizedContent,
    );
  } catch (e) {
    return InvitelyError(e);
  }
}
