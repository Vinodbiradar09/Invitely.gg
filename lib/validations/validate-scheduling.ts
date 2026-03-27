import { generateSmartSendRecommendationPrompt } from "../prompts/scheduling";
import { ZodLLMSmartSendTimeResponse } from "@/lib/zod/llm";
import { llm } from "@/lib/llm/llm";
import {
  InternalServerError,
  ValidationError,
  TimeoutError,
} from "@/lib/shared/exceptions";

export const SchedulingService = {
  async getSmartSendRecommendation(params: {
    eventName: string;
    eventDate: string;
    eventLocation: string;
    eventDesc: string;
    currentTime: string;
    currentIso: string;
  }) {
    try {
      const prompt = generateSmartSendRecommendationPrompt(params);
      const raw = await llm(prompt);
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.error("[AI_PARSE_FAILURE]:", raw);
        throw new InternalServerError(
          "LLM returned an invalid scheduling format.",
        );
      }
      const validated = ZodLLMSmartSendTimeResponse.safeParse(parsed);
      if (!validated.success) {
        console.error("[AI_SHAPE_FAILURE]:", validated.error.format());
        throw new InternalServerError(
          "LLM scheduling recommendation was malformed.",
        );
      }
      this.validateScheduleBounds(validated.data.suggestedAt, params.eventDate);
      return validated.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "gemini response error") {
        throw new TimeoutError(
          "The AI took too long to schedule. Please try again.",
        );
      }
      throw error;
    }
  },
  validateScheduleBounds(suggestedAtIso: string, eventDateIso: string) {
    const now = new Date();
    const suggestedAt = new Date(suggestedAtIso);
    const eventAtDate = new Date(eventDateIso);

    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    const eighteenHoursBeforeEvent = new Date(
      eventAtDate.getTime() - 18 * 60 * 60 * 1000,
    );

    if (suggestedAt <= thirtyMinutesFromNow) {
      throw new ValidationError(
        "The suggested time is too soon. Please send the invite now instead.",
      );
    }

    if (suggestedAt > eighteenHoursBeforeEvent) {
      throw new ValidationError(
        "The suggested time is too close to the event. Send it immediately.",
      );
    }
  },
};
