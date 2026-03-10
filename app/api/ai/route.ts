import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { llm } from "@/lib/llm";
import { polishResponseZ, polishZ } from "@/lib/types";
import { buildPrompt } from "@/lib/prompt";

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
    const { success, data } = polishZ.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { message: "invalid input", success: false },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(data);
    const raw = await llm(prompt);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("gemini returned non-JSON:", raw);
      return NextResponse.json(
        {
          message: "AI returned an unexpected response. Please try again.",
          success: false,
        },
        { status: 502 },
      );
    }

    const validated = polishResponseZ.safeParse(parsed);
    if (!validated.success) {
      console.error("gemini response shape wrong:", parsed);
      return NextResponse.json(
        {
          message: "AI returned an unexpected format. Please try again.",
          success: false,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        message: "email polished successfully",
        success: true,
        subject: validated.data.subject,
        body: validated.data.body,
      },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof Error && e.message === "gemini response error") {
      return NextResponse.json(
        {
          message: "AI took too long to respond. Please try again.",
          success: false,
        },
        { status: 504 },
      );
    }

    console.error(e);
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 },
    );
  }
}
