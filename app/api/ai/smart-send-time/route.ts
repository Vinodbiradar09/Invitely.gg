import { SchedulingService } from "@/lib/validations/validate-scheduling";
import { validateRequest } from "@/lib/validations/validate-request";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { requireSession } from "@/lib/auth/server/require-session";
import { ZodLLMSmartSendTime } from "@/lib/zod/llm";
import { formatEventDate } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await requireSession();
    const body = await req.json();
    const data = validateRequest(ZodLLMSmartSendTime, body);

    const now = new Date();
    const promptParams = {
      ...data,
      currentIso: now.toISOString(),
      currentTime: formatEventDate(now, "llm"),
    };
    const recommendation =
      await SchedulingService.getSmartSendRecommendation(promptParams);
    return InvitelyResponse(
      200,
      "Smart send time generated successfully",
      recommendation,
    );
  } catch (e) {
    return InvitelyError(e);
  }
}
