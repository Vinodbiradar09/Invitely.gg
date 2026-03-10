import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NewEventForm } from "@/components/events/new/new-event-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Event | Invitely.gg",
};

export default async function NewEventPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  // if no workspaces or no members at all, redirect to workspace first
  const totalMembers = workspaces.reduce((acc, w) => acc + w.members.length, 0);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
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
      {totalMembers === 0 ? (
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
      ) : (
        <NewEventForm
          workspaces={workspaces}
          organizerName={session.user.name ?? "Organizer"}
        />
      )}
    </div>
  );
}
