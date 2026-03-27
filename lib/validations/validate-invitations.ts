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
};

export { InvitationService };
