import { ForbiddenError, NotFoundError } from "../shared/exceptions";
import { db } from "../db/prisma";

const InvitationService = {
  async ownedInvitation(id: string, userId: string) {
    const invitation = await db.invitation.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        event: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!invitation) {
      throw new NotFoundError("Invitation not found");
    }
    if (invitation.event.userId !== userId) {
      throw new ForbiddenError(
        "Only the invitation owner can perform this action",
      );
    }
    return invitation;
  },
  async userInvitationsData(eventId: string) {
    const invitations = await db.invitation.findMany({
      where: { eventId },
      orderBy: { sentAt: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        sentAt: true,
        respondedAt: true,
      },
    });
    const summary = {
      total: invitations.length,
      attending: invitations.filter(
        (i: { status: string }) => i.status === "attending",
      ).length,
      maybe: invitations.filter((i: { status: string }) => i.status === "maybe")
        .length,
      declined: invitations.filter(
        (i: { status: string }) => i.status === "declined",
      ).length,
      pending: invitations.filter(
        (i: { status: string }) => i.status === "pending",
      ).length,
    };
    return { invitations, summary };
  },
  async addNote(id: string, userId: string, note: { organizerNote: string }) {
    const invitation = await this.ownedInvitation(id, userId);
    const addedNote = await db.invitation.update({
      where: {
        id: id ?? invitation.id,
      },
      data: {
        organizerNote: note.organizerNote ?? null,
      },
      select: {
        id: true,
        organizerNote: true,
      },
    });
    return addedNote;
  },
  async validateInvitationForEmail(eventId: string, email: string) {
    const invitation = await db.invitation.findUnique({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
    });
    if (!invitation) {
      throw new NotFoundError("No invitation found for this email");
    }
    return invitation;
  },
};

export { InvitationService };
