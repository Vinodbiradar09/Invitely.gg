import { z } from "zod";

export const workspaceZ = z.object({
  name: z.string().min(3, "workspace name must be atleast 3 chars"),
});

export const workspaceIdZ = z.object({
  workspaceId: z.string(),
});

export const workspaceMembersZ = z.array(
  z.object({
    name: z.string().optional(),
    email: z.email(),
  }),
);
