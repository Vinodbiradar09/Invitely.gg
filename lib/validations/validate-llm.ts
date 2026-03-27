import { InternalServerError, TimeoutError } from "@/lib/shared/exceptions";
import { ZodLLMOptimizeResponse } from "@/lib/zod/llm";
import { llm } from "@/lib/llm/llm";

export const LLMService = {
  async optimizeInvite(prompt: string) {
    try {
      const raw = await llm(prompt);
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.error("[AI_PARSE_FAILURE]:", raw);
        throw new InternalServerError(
          "LLM returned an invalid response format.",
        );
      }
      const validated = ZodLLMOptimizeResponse.safeParse(parsed);
      if (!validated.success) {
        console.error("[AI_SHAPE_FAILURE]:", validated.error.format());
        throw new InternalServerError(
          "LLM response did not match the expected template.",
        );
      }

      return validated.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "gemini response error") {
        throw new TimeoutError(
          "The LLM took too long to respond. please try again.",
        );
      }
      throw error;
    }
  },
};
