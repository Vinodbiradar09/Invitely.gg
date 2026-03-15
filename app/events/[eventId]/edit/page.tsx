import { EditEventForm } from "@/components/edit/edit-event-form";
import { EditEventFormSkeleton } from "@/components/skeletons";
import { Separator } from "@/components/ui/separator";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/session";
import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { Suspense } from "react";
import { cache } from "react";
import Link from "next/link";

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

export default async function EditEventPage({ params }: PageProps) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([getSession(), getEvent(eventId)]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();

  if (event.status === "cancelled") {
    redirect(`/events/${eventId}`);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link
        href={`/events/${eventId}`}
        className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to event
      </Link>

      <div className="flex flex-col gap-1">
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
