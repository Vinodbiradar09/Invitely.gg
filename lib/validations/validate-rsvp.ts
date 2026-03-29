import { db } from "../db/prisma";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../shared/exceptions";

const RsvpServices = {
  async rsvpInvitation(token: string) {
    const invitation = await db.invitation.findUnique({
      where: { token },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        respondedAt: true,
        // never return token back to client
        event: {
          select: {
            id: true,
            name: true,
            desc: true,
            eventAt: true,
            location: true,
            status: true,
            // never return emailBody/emailSubject
            user: {
              select: {
                name: true, // organizer name
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundError("Invitation not found");
    }
    return invitation;
  },

  async updateRsvpInvitation(token: string) {
    const invitation = await db.invitation.findUnique({
      where: { token },
      select: {
        id: true,
        status: true,
        respondedAt: true,
        event: {
          select: {
            id: true,
            eventAt: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundError("Invitation not found");
    }

    if (new Date(invitation.event.eventAt) < new Date()) {
      throw new BadRequestError(
        "This event has already passed. rsvp is closed",
      );
    }
    if (invitation.event.status === "cancelled") {
      throw new BadRequestError(
        "This event has been cancelled. rsvp is closed",
      );
    }
    if (invitation.respondedAt) {
      const secondsSinceLastResponse =
        (new Date().getTime() - new Date(invitation.respondedAt).getTime()) /
        1000;

      if (secondsSinceLastResponse < 10) {
        throw new ConflictError(
          "Please wait a moment before changing your response",
        );
      }
    }
    return invitation;
  },
};

export { RsvpServices };
