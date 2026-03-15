import { NextRequest, NextResponse } from "next/server";
import { ZodCreateTemplate } from "@/lib/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
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
    const templates = await db.eventTemplate.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        emailSubject: true,
        emailBody: true,
        createdAt: true,
        eventId: true,
        event: {
          select: { id: true, name: true },
        },
      },
    });
    return NextResponse.json(
      { message: "templates fetched successfully", success: true, templates },
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
    const { success, data } = ZodCreateTemplate.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { message: "invalid data", success: false },
        { status: 400 },
      );
    }
    const existingCount = await db.eventTemplate.count({
      where: {
        userId: session.user.id,
      },
    });
    if (existingCount >= 20) {
      return NextResponse.json(
        { message: "maximum 20 templates allowed", success: false },
        { status: 409 },
      );
    }
    if (data.eventId) {
      const event = await db.event.findUnique({
        where: {
          id: data.eventId,
        },
        select: {
          userId: true,
        },
      });
      if (!event || event.userId !== session.user.id) {
        return NextResponse.json(
          { message: "event not found or forbidden", success: false },
          { status: 404 },
        );
      }
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
    return NextResponse.json(
      { message: "template created successfully", success: true, template },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "internal server error", success: false },
      { status: 500 },
    );
  }
}
