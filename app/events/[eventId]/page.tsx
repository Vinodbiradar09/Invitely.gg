import { EventCancelDialog } from "@/components/events/event-cancel-dialog";
import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import { ReminderButton } from "@/components/dashboard/reminder-button";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { InsightsCard } from "@/components/dashboard/insights-card";
import { ArrowLeft, Calendar, MapPin, Pencil } from "lucide-react";
import { GuestTable } from "@/components/dashboard/guest-table";
import { Separator } from "@/components/ui/separator";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/session";
import { Invitation } from "@/lib/types";
import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { Suspense } from "react";
import { cache } from "react";
import Link from "next/link";
import {
  SummaryCardsSkeleton,
  GuestTableSkeleton,
} from "@/components/skeletons";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

const getEvent = cache(async (eventId: string) => {
  return db.event.findUnique({ where: { id: eventId } });
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  return {
    title: event ? `${event.name} | Invitely.gg` : "Event | Invitely.gg",
  };
}

async function GuestSection({ eventId }: { eventId: string }) {
  const invitations = await db.invitation.findMany({
    where: { eventId },
    orderBy: { sentAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      sentAt: true,
      respondedAt: true,
      openedAt: true,
    },
  });

  const summary = {
    total: invitations.length,
    attending: invitations.filter((i: Invitation) => i.status === "attending")
      .length,
    maybe: invitations.filter((i: Invitation) => i.status === "maybe").length,
    declined: invitations.filter((i: Invitation) => i.status === "declined")
      .length,
    pending: invitations.filter((i: Invitation) => i.status === "pending")
      .length,
  };

  return (
    <>
      <SummaryCards summary={summary} />
      <Separator className="bg-border" />
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Guest list — {summary.total}
          </h2>
          <ReminderButton eventId={eventId} pendingCount={summary.pending} />
        </div>
        <GuestTable invitations={invitations} eventId={eventId} />
      </div>
    </>
  );
}

export default async function EventDashboardPage({ params }: PageProps) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([getSession(), getEvent(eventId)]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();

  const isCancelled = event.status === "cancelled";
  const isScheduled = event.status === "scheduled";
  const isPast = new Date(event.eventAt) < new Date();

  const badgeClass = isCancelled
    ? "bg-red-500/10 text-red-500 border-red-500/20"
    : isScheduled
      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
      : isPast
        ? "bg-muted text-muted-foreground"
        : "bg-green-500/10 text-green-500 border-green-500/20";

  const badgeLabel = isCancelled
    ? "cancelled"
    : isScheduled
      ? "scheduled"
      : isPast
        ? "past"
        : "upcoming";

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(event.eventAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const guestCount = await db.invitation.count({ where: { eventId } });

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/events"
        className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3 w-3" />
        All events
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge
            variant="secondary"
            className={`font-mono text-xs px-1.5 py-0 h-4 w-fit ${badgeClass}`}
          >
            {badgeLabel}
          </Badge>
          <h1 className="font-mono text-base font-semibold text-foreground">
            {event.name}
          </h1>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span
                className={`font-mono text-xs text-muted-foreground ${isCancelled ? "line-through" : ""}`}
              >
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span
                className={`font-mono text-xs text-muted-foreground ${isCancelled ? "line-through" : ""}`}
              >
                {event.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {!isCancelled && (
            <Link href={`/events/${eventId}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs h-8 gap-2"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            </Link>
          )}
          {!isCancelled && (
            <EventCancelDialog
              eventId={event.id}
              eventName={event.name}
              guestCount={guestCount}
            />
          )}
          <EventDeleteDialog eventId={event.id} eventName={event.name} />
        </div>
      </div>

      <Separator className="bg-border" />
      <InsightsCard eventId={eventId} />
      <Suspense
        fallback={
          <>
            <SummaryCardsSkeleton />
            <Separator className="bg-border" />
            <GuestTableSkeleton />
          </>
        }
      >
        <GuestSection eventId={eventId} />
      </Suspense>
    </div>
  );
}
