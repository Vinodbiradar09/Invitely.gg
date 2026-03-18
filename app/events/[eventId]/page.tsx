import { StopRecurrenceButton } from "@/components/dashboard/stop-recurrence-button";
import { EventCancelDialog } from "@/components/events/event-cancel-dialog";
import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import { UnscheduleButton } from "@/components/dashboard/unschedule-button";
import { ReminderButton } from "@/components/dashboard/reminder-button";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { InsightsCard } from "@/components/dashboard/insights-card";
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
import {
  SummaryCardsSkeleton,
  GuestTableSkeleton,
} from "@/components/skeletons";
import { cache } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Pencil,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

const getEvent = cache(async (eventId: string) => {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: {
          childEvents: {
            where: {
              eventAt: { gt: new Date() },
              status: { not: "cancelled" },
            },
          },
        },
      },
    },
  });
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

async function GuestSection({
  eventId,
  isScheduled,
}: {
  eventId: string;
  isScheduled: boolean;
}) {
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
      guestNote: true,
      organizerNote: true,
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
            Guest list {summary.total}
          </h2>
          {!isScheduled && (
            <ReminderButton eventId={eventId} pendingCount={summary.pending} />
          )}
        </div>
        <GuestTable
          invitations={invitations}
          eventId={eventId}
          isScheduled={isScheduled}
        />
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
  const isRecurring = !!event.recurrence;
  const isChildEvent = !!event.parentEventId;
  const futureChildCount = event._count.childEvents;

  const hoursUntilEvent =
    (new Date(event.eventAt).getTime() - new Date().getTime()) /
    (1000 * 60 * 60);
  const noInvitationsSent = !event.sentAt && event.status !== "scheduled";

  const showUrgentBanner =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent <= 12 &&
    hoursUntilEvent > 0;

  const showInvitePendingBanner =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent > 12 &&
    hoursUntilEvent <= 18;

  const showYellowBanner =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent > 18;

  const hoursLabel =
    hoursUntilEvent < 1
      ? "less than 1 hour"
      : `${Math.round(hoursUntilEvent)} hour${Math.round(hoursUntilEvent) === 1 ? "" : "s"}`;

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

      {showUrgentBanner && (
        <div className="border border-red-500/30 bg-red-500/5 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-xs font-semibold text-red-500">
                Event starts in {hoursLabel} — no invitations sent
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                Your guests don&apos;t know about this recurring event yet.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${eventId}/send-invitations`}
            className="shrink-0"
          >
            <Button
              size="sm"
              className="font-mono text-xs h-8 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Send invitations now
            </Button>
          </Link>
        </div>
      )}

      {showInvitePendingBanner && (
        <div className="border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-xs font-semibold text-yellow-500">
                Event in {hoursLabel} send invitations soon
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                This occurrence was created automatically. Select guests and
                send invitations.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${eventId}/send-invitations`}
            className="shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs h-8 border-yellow-500/30 text-yellow-500 hover:border-yellow-500/60"
            >
              Send invitations
            </Button>
          </Link>
        </div>
      )}

      {showYellowBanner && (
        <div className="border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-4 w-4 text-yellow-500/60 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-xs font-semibold text-yellow-500/80">
                Recurring event no invitations sent yet
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                This occurrence was created automatically. Select guests when
                ready.
              </p>
            </div>
          </div>
          <Link
            href={`/events/${eventId}/send-invitations`}
            className="shrink-0"
          >
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs h-8 border-yellow-500/20 text-yellow-500/80 hover:border-yellow-500/40"
            >
              Send invitations
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className={`font-mono text-xs px-1.5 py-0 h-4 w-fit ${badgeClass}`}
            >
              {badgeLabel}
            </Badge>
            {isRecurring && (
              <Badge
                variant="secondary"
                className="font-mono text-xs px-1.5 py-0 h-4 w-fit bg-purple-500/10 text-purple-500 border-purple-500/20 flex items-center gap-1"
              >
                <RefreshCw className="h-2.5 w-2.5" />
                {event.recurrence}
              </Badge>
            )}
            {isChildEvent && noInvitationsSent && !isCancelled && !isPast && (
              <Badge
                variant="secondary"
                className="font-mono text-xs px-1.5 py-0 h-4 w-fit bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              >
                invite pending
              </Badge>
            )}
          </div>
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
          {isScheduled && event.scheduledAt && (
            <p className="font-mono text-xs text-blue-500">
              Sends{" "}
              {new Date(event.scheduledAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {isScheduled && event.scheduledAt && (
            <UnscheduleButton
              eventId={event.id}
              scheduledAt={event.scheduledAt}
            />
          )}
          {!isCancelled && !isScheduled && isRecurring && (
            <StopRecurrenceButton
              eventId={event.id}
              recurrence={event.recurrence!}
              futureCount={futureChildCount}
            />
          )}
          {!isCancelled && !isScheduled && (
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
          {!isCancelled && !isScheduled && (
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
        <GuestSection eventId={eventId} isScheduled={isScheduled} />
      </Suspense>
    </div>
  );
}
