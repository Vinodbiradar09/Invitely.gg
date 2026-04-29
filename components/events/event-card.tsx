import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface EventSummary {
  total: number;
  attending: number;
  maybe: number;
  declined: number;
  pending: number;
}

interface EventCardProps {
  event: {
    id: string;
    name: string;
    location: string;
    eventAt: Date;
    createdAt: Date;
    status: string;
    recurrence: string | null;
    parentEventId: string | null;
    sentAt: Date | null;
    summary: EventSummary;
  };
}

export function EventCard({ event }: EventCardProps) {
  const now = new Date();
  const isPast = new Date(event.eventAt) < now;
  const isCancelled = event.status === "cancelled";
  const isScheduled = event.status === "scheduled";
  const isRecurring = !!event.recurrence;
  const isChildEvent = !!event.parentEventId;
  const noInvitationsSent = !event.sentAt && event.status !== "scheduled";

  const hoursUntilEvent =
    (new Date(event.eventAt).getTime() - now.getTime()) / (1000 * 60 * 60);

  const isUrgent =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent <= 18 &&
    hoursUntilEvent > 0;

  const isInvitePending =
    isChildEvent &&
    !isCancelled &&
    !isPast &&
    noInvitationsSent &&
    hoursUntilEvent > 18;

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.eventAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const badgeLabel = isCancelled
    ? "cancelled"
    : isScheduled
      ? "scheduled"
      : isPast
        ? "past"
        : "upcoming";

  const badgeClass = isCancelled
    ? "bg-destructive/10 text-destructive border-destructive/20"
    : "bg-muted text-muted-foreground border-border";

  return (
    <Card
      className={`border-border bg-card group transition-colors relative rounded-none shadow-none ${
        isCancelled
          ? "opacity-50"
          : isUrgent
            ? "border-destructive/40 hover:border-destructive/60"
            : "hover:border-foreground/20"
      }`}
    >
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge
                variant="outline"
                className={`font-mono text-[10px] px-1.5 py-0 h-4 rounded-none ${badgeClass}`}
              >
                {badgeLabel}
              </Badge>

              {isRecurring && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] px-1.5 py-0 h-4 rounded-none bg-muted text-muted-foreground border-border flex items-center gap-1"
                >
                  <RefreshCw className="h-2 w-2" />
                  {event.recurrence}
                </Badge>
              )}

              {isUrgent && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] px-1.5 py-0 h-4 rounded-none bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1"
                >
                  <AlertTriangle className="h-2 w-2" />
                  urgent
                </Badge>
              )}

              {isInvitePending && !isUrgent && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] px-1.5 py-0 h-4 rounded-none bg-muted text-muted-foreground border-border"
                >
                  invite pending
                </Badge>
              )}
            </div>

            <Link href={`/events/${event.id}`}>
              <h3 className="font-mono text-sm font-semibold text-foreground truncate hover:underline underline-offset-4">
                {event.name}
              </h3>
            </Link>
          </div>

          <EventDeleteDialog eventId={event.id} eventName={event.name} />
        </div>
      </CardHeader>

      <Link href={`/events/${event.id}`} className="block">
        <CardContent className="px-4 pb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span
                className={`font-mono text-xs text-muted-foreground ${isCancelled ? "line-through" : ""}`}
              >
                {formattedDate} · {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span
                className={`font-mono text-xs text-muted-foreground truncate ${isCancelled ? "line-through" : ""}`}
              >
                {event.location}
              </span>
            </div>
          </div>

          <Separator className="bg-border" />

          {event.summary.total === 0 ? (
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">
                {isScheduled
                  ? "Send scheduled"
                  : isInvitePending || isUrgent
                    ? "No invitations sent — action needed"
                    : "No invitations sent yet"}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "going", value: event.summary.attending },
                { label: "maybe", value: event.summary.maybe },
                { label: "no", value: event.summary.declined },
                { label: "pending", value: event.summary.pending },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
                    {value}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
