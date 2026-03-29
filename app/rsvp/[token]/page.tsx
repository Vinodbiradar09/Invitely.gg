import { RSVPCard } from "@/components/rsvp/rsvp-card";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Token } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({ params }: Token): Promise<Metadata> {
  const { token } = await params;
  const invitation = await db.invitation.findUnique({
    where: { token },
    select: { event: { select: { name: true } } },
  });
  if (!invitation) return { title: "Invitation | Invitely.gg" };
  return {
    title: `${invitation.event.name} | Invitely.gg`,
    description: `You've been invited to ${invitation.event.name}`,
  };
}

export default async function RSVPPage({ params }: Token) {
  const { token } = await params;
  if (!token || token.length !== 64 || !/^[a-f0-9]+$/.test(token)) {
    notFound();
  }
  const invitation = await db.invitation.findUnique({
    where: { token },
    select: {
      name: true,
      status: true,
      respondedAt: true,
      guestNote: true,
      event: {
        select: {
          name: true,
          desc: true,
          eventAt: true,
          location: true,
          status: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!invitation) notFound();

  const eventHasPassed = new Date(invitation.event.eventAt) < new Date();
  const eventCancelled = invitation.event.status === "cancelled";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <RSVPCard
        token={token}
        recipientName={invitation.name}
        currentStatus={invitation.status}
        guestNote={invitation.guestNote}
        eventHasPassed={eventHasPassed}
        eventCancelled={eventCancelled}
        event={{
          name: invitation.event.name,
          desc: invitation.event.desc,
          eventAt: invitation.event.eventAt,
          location: invitation.event.location,
          organizerName: invitation.event.user.name ?? "Organizer",
        }}
      />
    </main>
  );
}
