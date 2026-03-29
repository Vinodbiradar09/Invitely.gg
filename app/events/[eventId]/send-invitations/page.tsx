import { SendInvitationsForm } from "@/components/events/send-invitations-form";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/client/get-session";
import { Separator } from "@/components/ui/separator";
import { redirect, notFound } from "next/navigation";
import { WorkspaceWithMembers } from "@/lib/types";
import { EventIdParams } from "@/lib/utils";
import { db } from "@/lib/db/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Send Invitations | Invitely.gg" };

export default async function SendInvitationsPage({ params }: EventIdParams) {
  const { eventId } = await params;
  const [session, event] = await Promise.all([
    getSession(),
    db.event.findUnique({ where: { id: eventId } }),
  ]);

  if (!session) redirect("/login");
  if (!event) notFound();
  if (event.userId !== session.user.id) notFound();
  if (event.status === "cancelled") redirect(`/events/${eventId}`);
  if (event.sentAt) redirect(`/events/${eventId}`);

  const workspaces = await db.workSpace.findMany({
    where: { userId: session.user.id },
    include: { members: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  const totalMembers = workspaces.reduce(
    (acc: number, w: WorkspaceWithMembers) => acc + w.members.length,
    0,
  );

  const formattedDate = new Date(event.eventAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          Send invitations
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Select guests for this occurrence of{" "}
          <span className="text-foreground">{event.name}</span>
        </p>
      </div>

      <div className="border border-border px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="font-mono text-xs text-muted-foreground">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="font-mono text-xs text-muted-foreground">
            {event.location}
          </span>
        </div>
      </div>

      <Separator className="bg-border" />

      {totalMembers === 0 ? (
        <div className="border border-dashed border-border px-5 py-8 flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-sm text-foreground">No contacts yet</p>
          <p className="font-mono text-xs text-muted-foreground">
            Add members to a workspace before sending invitations.
          </p>
        </div>
      ) : (
        <SendInvitationsForm
          eventId={eventId}
          workspaces={workspaces}
          organizerName={session.user.name ?? "Organizer"}
          organizerEmail={session.user.email}
          event={{
            name: event.name,
            eventAt: event.eventAt,
            location: event.location,
            emailSubject: event.emailSubject,
            emailBody: event.emailBody,
          }}
        />
      )}
    </div>
  );
}
