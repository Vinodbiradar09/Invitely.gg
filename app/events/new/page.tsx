import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { NewEventForm } from "@/components/events/new/new-event-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import { WorkspaceWithMembers } from "@/lib/types";
import { getSession } from "@/lib/session";
import { NewEventFormSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "New Event | Invitely.gg",
};

function PageHeader() {
  return (
    <>
      <Link
        href="/events"
        className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to events
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-mono text-base font-semibold text-foreground">
          New event
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Create an event and send invitations to your contacts.
        </p>
      </div>
      <Separator className="bg-border" />
    </>
  );
}

async function NewEventSection() {
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

  if (totalMembers === 0) {
    return (
      <div className="border border-dashed border-border px-5 py-8 flex flex-col items-center gap-4 text-center">
        <p className="font-mono text-sm text-foreground">No contacts yet</p>
        <p className="font-mono text-xs text-muted-foreground">
          Add members to a workspace before creating an event.
        </p>
        <Link href="/workspace">
          <Button size="sm" className="font-mono text-xs gap-2">
            Go to Workspaces
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <NewEventForm
      workspaces={workspaces}
      organizerName={session.user.name ?? "Organizer"}
      organizerEmail={session.user.email}
    />
  );
}

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <PageHeader />
      <Suspense fallback={<NewEventFormSkeleton />}>
        <NewEventSection />
      </Suspense>
    </div>
  );
}
