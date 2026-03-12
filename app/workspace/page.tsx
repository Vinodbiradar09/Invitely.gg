import { WorkspaceCreateDialog } from "@/components/workspace/workspace-create-dialog";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { WorkspaceListSkeleton } from "@/components/skeletons";
import { Separator } from "@/components/ui/separator";
import { WorkspaceWithMembers } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workspaces | Invitely.gg",
};

function PageHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-mono text-base font-semibold text-foreground">
          Workspaces
        </h1>
      </div>
    </div>
  );
}

async function WorkspaceSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = workspaces.reduce(
    (acc: number, w: WorkspaceWithMembers) => acc + w.members.length,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 -mt-6">
        <p className="font-mono text-xs text-muted-foreground">
          {workspaces.length === 0
            ? "Create a workspace to start organising your contacts."
            : `${workspaces.length}/5 workspaces · ${totalMembers} total contacts`}
        </p>
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

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <Separator className="bg-border" />
      <Suspense fallback={<WorkspaceListSkeleton />}>
        <WorkspaceSection />
      </Suspense>
    </div>
  );
}
