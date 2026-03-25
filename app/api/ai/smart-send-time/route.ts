import { ZodSmartSendTime, ZodSmartSendTimeResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { buildSmartSendTimePrompt } from "@/lib/prompt";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
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
    const { success, data, error } = ZodSmartSendTime.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid data", success: false, errors: error.flatten() },
        { status: 400 },
      );
    }

    const now = new Date();
    const currentIso = now.toISOString();
    const currentTime = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const prompt = buildSmartSendTimePrompt({
      eventName: data.eventName,
      eventDate: data.eventDate,
      eventLocation: data.eventLocation,
      eventDesc: data.eventDesc,
      currentTime,
      currentIso,
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

    const validated = ZodSmartSendTimeResponse.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { message: "ai response did not match expected shape", success: false },
        { status: 502 },
      );
    }

    const suggestedAt = new Date(validated.data.suggestedAt);
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    const eventAtDate = new Date(data.eventDate);
    const eighteenHoursBeforeEvent = new Date(
      eventAtDate.getTime() - 18 * 60 * 60 * 1000,
    );

    if (suggestedAt <= thirtyMinutesFromNow) {
      return NextResponse.json(
        {
          message: "event is too soon for a scheduled send send now instead",
          success: false,
        },
        { status: 400 },
      );
    }

    if (suggestedAt > eighteenHoursBeforeEvent) {
      return NextResponse.json(
        {
          message: "event is too soon to schedule send now instead",
          success: false,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "smart send time generated",
        success: true,
        suggestion: validated.data,
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
