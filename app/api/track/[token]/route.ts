import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { Token } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: Token) {
  try {
    const { token } = await params;

    const invitation = await db.invitation.findUnique({
      where: { token },
      select: { id: true, openedAt: true },
    });

    if (invitation && !invitation.openedAt) {
      await db.invitation.update({
        where: { id: invitation.id },
        data: { openedAt: new Date() },
      });
    }

    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64",
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (e) {
    console.error(e);

    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64",
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  }
}
