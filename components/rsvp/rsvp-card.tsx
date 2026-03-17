import { RSVPButtons } from "@/components/rsvp/rsvp-buttons";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RSVPStatus = "attending" | "maybe" | "declined" | "pending";

interface RSVPCardProps {
  token: string;
  recipientName: string | null;
  currentStatus: RSVPStatus;
  guestNote: string | null;
  eventHasPassed: boolean;
  eventCancelled: boolean;
  event: {
    name: string;
    desc: string;
    eventAt: Date;
    location: string;
    organizerName: string;
  };
}

export function RSVPCard({
  token,
  recipientName,
  currentStatus,
  guestNote,
  eventHasPassed,
  eventCancelled,
  event,
}: RSVPCardProps) {
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
    <div className="flex flex-col border border-border bg-card w-full max-w-md">
      <div className="border-b border-border px-5 py-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            Invited by{" "}
            <span className="text-foreground font-semibold">
              {event.organizerName}
            </span>
          </span>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          {eventCancelled && (
            <Badge
              variant="secondary"
              className="font-mono text-xs px-1.5 py-0 h-4 w-fit bg-red-500/10 text-red-500 border-red-500/20"
            >
              cancelled
            </Badge>
          )}
          {!eventCancelled && eventHasPassed && (
            <Badge
              variant="secondary"
              className="font-mono text-xs px-1.5 py-0 h-4 w-fit bg-muted text-muted-foreground"
            >
              past event
            </Badge>
          )}
          <h1 className="font-mono text-xl font-semibold text-foreground leading-tight">
            {event.name}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
            <span
              className={`font-mono text-xs text-muted-foreground ${eventCancelled ? "line-through" : ""}`}
            >
              {formattedDate} at {formattedTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span
              className={`font-mono text-xs text-muted-foreground ${eventCancelled ? "line-through" : ""}`}
            >
              {event.location}
            </span>
          </div>
        </div>

        {event.desc && (
          <>
            <Separator className="bg-border" />
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              {event.desc}
            </p>
          </>
        )}

        <Separator className="bg-border" />

        {recipientName && (
          <p className="font-mono text-xs text-foreground">
            Hey <span className="font-semibold">{recipientName}</span>,
          </p>
        )}

        <RSVPButtons
          token={token}
          initialStatus={currentStatus}
          initialGuestNote={guestNote}
          eventHasPassed={eventHasPassed}
          eventCancelled={eventCancelled}
        />
      </div>

      <div className="border-t border-border px-5 py-3">
        <p className="font-mono text-xs text-muted-foreground text-center">
          Powered by{" "}
          <span className="text-foreground font-semibold">Invitely.gg</span>
        </p>
      </div>
    </div>
  );
}
