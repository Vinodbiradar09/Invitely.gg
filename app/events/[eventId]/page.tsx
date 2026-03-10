import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { GuestTable } from "@/components/dashboard/guest-table";
import { ReminderButton } from "@/components/dashboard/reminder-button";
import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { name: true },
  });
  return {
    title: event ? `${event.name} | Invitely.gg` : "Event | Invitely.gg",
  };
}

export default async function EventDashboardPage({ params }: PageProps) {
  const { eventId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();

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
    },
  });

  const summary = {
    total: invitations.length,
    attending: invitations.filter((i) => i.status === "attending").length,
    maybe: invitations.filter((i) => i.status === "maybe").length,
    declined: invitations.filter((i) => i.status === "declined").length,
    pending: invitations.filter((i) => i.status === "pending").length,
  };

  const isPast = new Date(event.eventAt) < new Date();

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
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`font-mono text-xs px-1.5 py-0 h-4 ${
                isPast
                  ? "bg-muted text-muted-foreground"
                  : "bg-green-500/10 text-green-500 border-green-500/20"
              }`}
            >
              {isPast ? "past" : "upcoming"}
            </Badge>
          </div>
          <h1 className="font-mono text-base font-semibold text-foreground">
            {event.name}
          </h1>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-muted-foreground">
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-muted-foreground">
                {event.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ReminderButton eventId={event.id} pendingCount={summary.pending} />
          <EventDeleteDialog eventId={event.id} eventName={event.name} />
        </div>
      </div>

      <Separator className="bg-border" />

      <SummaryCards summary={summary} />

      <Separator className="bg-border" />

      <div className="flex flex-col gap-3">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Guest list — {summary.total}
        </h2>
        <GuestTable invitations={invitations} />
      </div>
    </div>
  );
}
