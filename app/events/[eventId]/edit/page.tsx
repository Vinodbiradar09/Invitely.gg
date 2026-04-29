import { EditEventForm } from "@/components/edit/edit-event-form";
import { EditEventFormSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { Separator } from "@/components/ui/separator";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EventIdParams } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";

const getEvent = cache(async (eventId: string) => {
  return db.event.findUnique({ where: { id: eventId } });
});

export async function generateMetadata({
  params,
}: EventIdParams): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  return {
    title: event
      ? `Edit ${event.name} | Invitely.gg`
      : "Edit Event | Invitely.gg",
  };
}

async function EditSection({ eventId }: { eventId: string }) {
  const event = await getEvent(eventId);
  if (!event) notFound();
  return <EditEventForm event={event} />;
}

export default async function EditEventPage({ params }: EventIdParams) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([getSession(), getEvent(eventId)]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();
  if (event.status === "cancelled") redirect(`/events/${eventId}`);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="font-mono text-xs gap-1.5 -ml-2 h-7 w-fit text-muted-foreground hover:text-foreground rounded-none"
      >
        <Link href={`/events/${eventId}`}>
          <ArrowLeft className="h-3 w-3" />
          Back to event
        </Link>
      </Button>

      <div className="flex flex-col gap-0.5">
        <h1 className="font-mono text-base font-semibold text-foreground">
          Edit event
        </h1>
        <p className="font-mono text-xs text-muted-foreground">{event.name}</p>
      </div>

      <Separator className="bg-border" />

      <Suspense fallback={<EditEventFormSkeleton />}>
        <EditSection eventId={eventId} />
      </Suspense>
    </div>
  );
}
