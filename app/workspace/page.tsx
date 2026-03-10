import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { WorkspaceCreateDialog } from "@/components/workspace/workspace-create-dialog";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspaces | Invitely.gg",
  description: "Manage your contact workspaces",
};

export default async function WorkspacePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-base font-semibold text-foreground">
            Workspaces
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Organise your contacts into groups.{" "}
            <span className="text-foreground">{workspaces.length}/5</span>{" "}
            workspaces used.
          </p>
        </div>

        <WorkspaceCreateDialog currentCount={workspaces.length} />
      </div>

      <Separator className="bg-border" />
      <WorkspaceList workspaces={workspaces} />
    </div>
  );
}
