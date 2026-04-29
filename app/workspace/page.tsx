import { WorkspaceCreateDialog } from "@/components/workspace/workspace-create-dialog";
import { WorkspaceList } from "@/components/workspace/workspace-list";
import { WorkspaceListSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { Separator } from "@/components/ui/separator";
import { WorkspaceWithMembers } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workspaces | Invitely.gg",
};

function PageHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="font-mono text-base font-semibold text-foreground">
        Workspaces
      </h1>
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
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          {workspaces.length === 0
            ? "Create a workspace to start organising contacts."
            : `${workspaces.length}/5 workspaces · ${totalMembers} contact${totalMembers === 1 ? "" : "s"}`}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          {totalMembers > 0 && (
            <Link href="/events/new">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-2 rounded-none"
              >
                <Plus className="h-3 w-3" />
                New event
              </Button>
            </Link>
          )}
          <WorkspaceCreateDialog currentCount={workspaces.length} />
        </div>
      </div>

      <WorkspaceList workspaces={workspaces} />
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
