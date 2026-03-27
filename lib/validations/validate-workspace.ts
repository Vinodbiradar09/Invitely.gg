import { WORKSPACE_LIMITS } from "../utils";
import { db } from "../db/prisma";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../shared/exceptions";

const WorkspaceService = {
  async verifyWorkspaceName(userId: string, name: string) {
    const exists = await db.workSpace.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });
    if (exists) {
      throw new ConflictError("You already have a workspace with this name.");
    }
  },
  async ownedWorkspace(id: string, userId: string) {
    const workspace = await db.workSpace.findUnique({ where: { id } });
    if (!workspace) throw new NotFoundError("Workspace not found.");
    if (workspace.userId !== userId) {
      throw new ForbiddenError(
        "Only the workspace owner can perform this action.",
      );
    }
    return workspace;
  },
  async workspaceLimit(userId: string) {
    const count = await db.workSpace.count({ where: { userId } });
    if (count >= WORKSPACE_LIMITS.MAX_WORKSPACES_PER_USER) {
      throw new ForbiddenError(
        `Workspace limit reached. You can only create up to ${WORKSPACE_LIMITS.MAX_WORKSPACES_PER_USER} workspaces.`,
      );
    }
  },
  async userWorkspaces(userId: string) {
    const workspace = await db.workSpace.findMany({
      where: {
        userId,
      },
      include: {
        members: true,
      },
    });
    return workspace;
  },
};

export { WorkspaceService };
