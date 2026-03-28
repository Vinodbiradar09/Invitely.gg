import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  TimeoutError,
} from "@/lib/shared/exceptions";
import { ZodLLMInsightsResponse, ZodLLMOptimizeResponse } from "@/lib/zod/llm";
import { llm } from "@/lib/llm/llm";
import { db } from "../db/prisma";
import { formatEventDate } from "../utils";
import { generateRsvpInsightsPrompt } from "../prompts/analytics";
import { InvitationData } from "../types/index";

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
  async EventInsights(eventId: string, userId: string) {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        invitations: {
          select: {
            status: true,
            sentAt: true,
            respondedAt: true,
            openedAt: true,
          },
        },
      },
    });
    if (!event) throw new NotFoundError("Event not found");
    if (event.userId !== userId) throw new ForbiddenError("Not authorized");
    const total = event.invitations.length;
    if (total === 0) throw new BadRequestError("No invitations to analyze");
    const stats = {
      attending: event.invitations.filter((x) => x.status === "attending")
        .length,
      pending: event.invitations.filter((x) => x.status === "pending").length,
      declined: event.invitations.filter((x) => x.status === "declined").length,
      maybe: event.invitations.filter((x) => x.status === "maybe").length,
      openedNotResponded: event.invitations.filter(
        (i) => i.openedAt && i.status === "pending",
      ).length,
    };
    const responded = total - stats.pending;
    const responseRate = Math.round((responded / total) * 100);
    if (responseRate < 10) {
      throw new ConflictError(
        "Not enough responses yet to generate insights (minimum 10% required)",
      );
    }
    const avgResponseHours = this.calculateAvgResponseTime(event.invitations);
    const eventDate = formatEventDate(event.eventAt, "full");
    const daysUntilEvent = Math.max(
      0,
      Math.ceil(
        (new Date(event.eventAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const prompt = generateRsvpInsightsPrompt({
      eventName: event.name,
      eventDate,
      daysUntilEvent,
      totalInvited: total,
      ...stats,
      responseRate,
      avgResponseHours,
    });

    const llmRes = await this.fetchAndValidateAI(prompt);
    return {
      insights: llmRes,
      stats: { total, ...stats, responseRate },
    };
  },

  calculateAvgResponseTime(invitations: InvitationData[]): number | null {
    const validResponses = invitations.filter(
      (
        i,
      ): i is InvitationData & {
        respondedAt: Date | string;
        sentAt: Date | string;
      } => i.respondedAt !== null && i.sentAt !== null,
    );
    if (validResponses.length === 0) return null;
    const times = validResponses.map((i) => {
      const responded = new Date(i.respondedAt).getTime();
      const sent = new Date(i.sentAt).getTime();
      return (responded - sent) / (1000 * 60 * 60);
    });
    const totalHours = times.reduce((acc, curr) => acc + curr, 0);
    return Math.round(totalHours / times.length);
  },
  async fetchAndValidateAI(prompt: string) {
    const raw = await llm(prompt);
    try {
      const parsed = JSON.parse(raw);
      const validated = ZodLLMInsightsResponse.safeParse(parsed);
      if (!validated.success) throw new Error("AI response mismatch");
      return validated.data;
    } catch (e) {
      console.log(e);
      throw new Error("AI failed to provide valid insights");
    }
  },
};
