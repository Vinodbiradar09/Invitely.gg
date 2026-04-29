import { EventList } from "@/components/events/event-list";
import { getSession } from "@/lib/auth/client/get-session";
import { EventListSkeleton } from "@/components/skeletons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EventWithStatus } from "@/lib/types";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Events | Invitely.gg" };

function PageHeader() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-mono text-base font-semibold text-foreground">
          Events
        </h1>
        <Link href="/events/new">
          <Button size="sm" className="font-mono text-xs gap-2 rounded-none">
            <Plus className="h-3 w-3" />
            New event
          </Button>
        </Link>
      </div>
      <Separator className="bg-border" />
    </div>
  );
}

async function EventListSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rawEvents = await db.event.findMany({
    where: { userId: session.user.id },
    orderBy: { eventAt: "desc" },
    include: { invitations: { select: { status: true } } },
  });

  const events = rawEvents.map((event: EventWithStatus) => {
    const summary = {
      total: event.invitations.length,
      attending: event.invitations.filter(
        (i: { status: string }) => i.status === "attending",
      ).length,
      maybe: event.invitations.filter(
        (i: { status: string }) => i.status === "maybe",
      ).length,
      declined: event.invitations.filter(
        (i: { status: string }) => i.status === "declined",
      ).length,
      pending: event.invitations.filter(
        (i: { status: string }) => i.status === "pending",
      ).length,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { invitations: _, ...rest } = event;
    return { ...rest, summary };
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-xs text-muted-foreground -mt-2">
        {events.length === 0
          ? "Create your first event to start sending invitations."
          : `${events.length} event${events.length === 1 ? "" : "s"} total`}
      </p>
      <EventList events={events} />
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <Suspense fallback={<EventListSkeleton />}>
        <EventListSection />
      </Suspense>
    </div>
  );
}
