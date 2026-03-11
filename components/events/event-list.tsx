import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { Plus } from "lucide-react";
import { PastEvent } from "@/lib/types";

interface EventListProps {
  events: {
    id: string;
    name: string;
    location: string;
    eventAt: Date;
    createdAt: Date;
    summary: {
      total: number;
      attending: number;
      maybe: number;
      declined: number;
      pending: number;
    };
  }[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="border border-dashed border-border w-12 h-12 flex items-center justify-center">
          <span className="font-mono text-lg text-muted-foreground">+</span>
        </div>
        <div className="text-center flex flex-col gap-1">
          <p className="font-mono text-sm text-foreground">No events yet</p>
          <p className="font-mono text-xs text-muted-foreground">
            Create your first event and start sending invitations
          </p>
        </div>
        <Link href="/events/new">
          <Button size="sm" className="font-mono text-xs gap-2">
            <Plus className="h-3 w-3" />
            Create event
          </Button>
        </Link>
      </div>
    );
  }

  // split into upcoming and past
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.eventAt) >= now);
  const past = events.filter((e) => new Date(e.eventAt) < now);

  return (
    <div className="flex flex-col gap-8">
      {upcoming.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Upcoming — {upcoming.length}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Past — {past.length}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {past.map((event: PastEvent) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
