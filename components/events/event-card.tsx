import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventDeleteDialog } from "@/components/events/event-delete-dialog";
import { Calendar, MapPin, Users } from "lucide-react";

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
    summary: EventSummary;
  };
}

export function EventCard({ event }: EventCardProps) {
  const isPast = new Date(event.eventAt) < new Date();

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.eventAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="border-border bg-card group hover:border-foreground/20 transition-colors">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 min-w-0">
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
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-muted-foreground">
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-xs text-muted-foreground truncate">
                {event.location}
              </span>
            </div>
          </div>

          <Separator className="bg-border" />

          {event.summary.total === 0 ? (
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">
                No invitations sent yet
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  label: "going",
                  value: event.summary.attending,
                  color: "text-green-500",
                },
                {
                  label: "maybe",
                  value: event.summary.maybe,
                  color: "text-yellow-500",
                },
                {
                  label: "no",
                  value: event.summary.declined,
                  color: "text-destructive",
                },
                {
                  label: "pending",
                  value: event.summary.pending,
                  color: "text-muted-foreground",
                },
              ].map(
                ({
                  label,
                  value,
                  color,
                }: {
                  label: string;
                  value: number;
                  color: string;
                }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span
                      className={`font-mono text-sm font-semibold ${color}`}
                    >
                      {value}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
