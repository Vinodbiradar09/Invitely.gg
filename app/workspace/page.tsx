import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { WorkspaceCreateDialog } from "@/components/workspace/workspace-create-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspaces | Invitely.gg",
};

export default async function WorkspacePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = workspaces.reduce((acc, w) => acc + w.members.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-base font-semibold text-foreground">
            Workspaces
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {workspaces.length === 0
              ? "Create a workspace to start organising your contacts."
              : `${workspaces.length}/5 workspaces · ${totalMembers} total contacts`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {totalMembers > 0 && (
            <Link href="/events">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-2"
              >
                Go to Events
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
          <WorkspaceCreateDialog currentCount={workspaces.length} />
        </div>
      </div>

      <Separator className="bg-border" />

      <WorkspaceList workspaces={workspaces} />
      {totalMembers > 0 && workspaces.length > 0 && (
        <div className="border border-dashed border-border px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-xs text-foreground font-semibold">
              Ready to send invitations?
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              You have {totalMembers} contact
              {totalMembers === 1 ? "" : "s"} ready to invite.
            </p>
          </div>
          <Link href="/events/new">
            <Button size="sm" className="font-mono text-xs gap-2 shrink-0">
              <Plus className="h-3 w-3" />
              Create event
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
