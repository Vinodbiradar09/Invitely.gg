import { ZodInsightsResponse, ZodInsights } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { buildInsightsPrompt } from "@/lib/prompt";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { llm } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "unauthorized user", success: false },
        { status: 401 },
      );
    }
    const body = await req.json();

    const { success, data } = ZodInsights.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid id", success: false },
        { status: 400 },
      );
    }
    const event = await db.event.findUnique({
      where: {
        id: data.eventId,
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

    if (!event) {
      return NextResponse.json(
        { message: "event not found", success: false },
        { status: 404 },
      );
    }

    if (event.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "forbidden access you are not owner of event",
          success: false,
        },
        { status: 403 },
      );
    }
    const total = event.invitations.length;
    if (total === 0) {
      return NextResponse.json(
        { message: "no invitations to analyse", success: false },
        { status: 400 },
      );
    }
    const attending = event.invitations.filter(
      (x) => x.status === "attending",
    ).length;
    const pending = event.invitations.filter(
      (x) => x.status === "pending",
    ).length;
    const declined = event.invitations.filter(
      (x) => x.status === "declined",
    ).length;
    const maybe = event.invitations.filter((x) => x.status === "maybe").length;
    const responded = total - pending;
    const responseRate = Math.round((responded / total) * 100);
    if (responseRate < 10) {
      return NextResponse.json(
        {
          message: "not enough responses yet to generate insights",
          success: false,
        },
        { status: 400 },
      );
    }
    const responseTimes = event.invitations
      .filter((i) => i.respondedAt && i.sentAt)
      .map((i) => {
        const diff =
          new Date(i.respondedAt!).getTime() - new Date(i.sentAt).getTime();
        return diff / (1000 * 60 * 60);
      });
    const avgResponseHours =
      responseTimes.length > 0
        ? Math.round(
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
          )
        : null;

    const eventDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const daysUntilEvent = Math.max(
      0,
      Math.ceil(
        (new Date(event.eventAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );

    const openedNotResponded = event.invitations.filter(
      (i) => i.openedAt && i.status === "pending",
    ).length;

    const prompt = buildInsightsPrompt({
      eventName: event.name,
      eventDate,
      daysUntilEvent,
      totalInvited: total,
      attending,
      maybe,
      declined,
      pending,
      openedNotResponded,
      responseRate,
      avgResponseHours,
    });
    const raw = await llm(prompt);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { message: "ai returned invalid response", success: false },
        { status: 502 },
      );
    }
    const validated = ZodInsightsResponse.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { message: "ai response did not match expected shape", success: false },
        { status: 502 },
      );
    }
    return NextResponse.json(
      {
        message: "insights generated",
        success: true,
        insights: validated.data,
        stats: { total, attending, maybe, declined, pending, responseRate },
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 },
    );
  }
}
