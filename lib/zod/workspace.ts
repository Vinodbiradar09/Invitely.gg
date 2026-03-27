import { z } from "zod";

export const ZodWorkspace = z.object({
  name: z.string().min(3, "workspace name must be atleast 3 chars"),
});

export const ZodWorkspaceId = z.object({
  workspaceId: z.string(),
});

export const ZodWorkspaceMembers = z.array(
  z.object({
    name: z.string().optional(),
    email: z.email(),
  }),
);
