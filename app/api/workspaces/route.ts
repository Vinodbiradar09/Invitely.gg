import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { workspaceZ } from "@/lib/types";
type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "unauthorized user",
          success: false,
        },
        { status: 401 },
      );
    }
    const body = await req.json();
    const { success, data } = workspaceZ.safeParse(body);
    if (!success) {
      return NextResponse.json(
        {
          message: "invalid body",
          success: false,
        },
        { status: 400 },
      );
    }
    // check the workspace existed
    const existedWorkspaceName = await db.workSpace.findFirst({
      where: {
        userId: session.user.id,
        name: data.name,
      },
    });
    if (existedWorkspaceName) {
      return NextResponse.json(
        {
          message: "workspace name is already present choose new one",
          success: false,
        },
        { status: 409 },
      );
    }
    // only 5 workspaces are allowed
    const workspace = await db.$transaction(async (tx: TxClient) => {
      const count = await tx.workSpace.count({
        where: {
          userId: session.user.id,
        },
      });
      if (count >= 5) {
        throw new Error("only 5 workspaces are allowed");
      }
      return tx.workSpace.create({
        data: { name: data.name, userId: session.user.id },
      });
    });
    return NextResponse.json(
      {
        message: "workspace created successfully",
        success: true,
        workspace,
      },
      { status: 201 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "unauthorized user",
          success: false,
        },
        { status: 401 },
      );
    }
    // find the workspace of user
    const workspace = await db.workSpace.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        members: true,
      },
    });
    if (workspace.length === 0) {
      return NextResponse.json(
        {
          message: "you have zero workspace",
          success: true,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      {
        message: "your workspace",
        success: true,
        workspace,
      },
      { status: 200 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "internal server error",
        success: false,
      },
      { status: 500 },
    );
  }
}
