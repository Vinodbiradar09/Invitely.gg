import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { EventList } from "@/components/events/event-list";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { EventWithStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events | Invitely.gg",
};

export default async function EventsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const rawEvents = await db.event.findMany({
    where: { userId: session.user.id },
    orderBy: { eventAt: "desc" },
    include: {
      invitations: { select: { status: true } },
    },
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
    const { invitations, ...rest } = event;
    return { ...rest, summary };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-base font-semibold text-foreground">
            Events
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {events.length === 0
              ? "Create your first event to start sending invitations."
              : `${events.length} event${events.length === 1 ? "" : "s"} total`}
          </p>
        </div>

        <Link href="/events/new">
          <Button size="sm" className="font-mono text-xs gap-2 shrink-0">
            <Plus className="h-3 w-3" />
            New event
          </Button>
        </Link>
      </div>

      <Separator className="bg-border" />

      <EventList events={events} />
    </div>
  );
}
