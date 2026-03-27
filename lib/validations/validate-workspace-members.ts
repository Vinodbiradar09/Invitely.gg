import { ConflictError, ForbiddenError } from "../shared/exceptions";
import { WORKSPACE_LIMITS } from "../utils";
import { db } from "../db/prisma";

const MemberService = {
  async slotAvailability(workspaceId: string, incomingCount: number) {
    const current = await db.workSpaceMember.count({ where: { workspaceId } });
    const limit = WORKSPACE_LIMITS.MAX_MEMBERS_PER_WORKSPACE;
    const remaining = limit - current;
    if (incomingCount > remaining) {
      throw new ForbiddenError(
        `Slot limit exceeded: Only ${remaining} slots left (Max: ${limit}).`,
      );
    }
  },

  async checkDuplicateEmails(workspaceId: string, emails: string[]) {
    const existing = await db.workSpaceMember.findMany({
      where: {
        workspaceId,
        email: { in: emails },
      },
      select: {
        email: true,
      },
    });
    if (existing.length > 0) {
      const list = existing.map((e) => e.email).join(", ");
      throw new ConflictError(`These emails are already members: ${list}`);
    }
  },
};

export { MemberService };
