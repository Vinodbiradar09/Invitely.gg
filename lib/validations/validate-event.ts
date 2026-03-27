import { ForbiddenError, NotFoundError } from "../shared/exceptions";
import { db } from "../db/prisma";

const EventService = {
  async ownedEvent(id: string, userId: string) {
    const event = await db.event.findUnique({
      where: {
        id,
      },
    });
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    if (event.userId !== userId) {
      throw new ForbiddenError("Only the event owner can perform this action");
    }
    return event;
  },
};

export { EventService };
