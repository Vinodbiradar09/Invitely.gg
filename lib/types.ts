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

export const eventZ = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  desc: z.string().min(1, "Description is required").max(1000),
  eventAt: z.string().datetime(), // ISO string from frontend
  location: z.string().min(1, "Location is required").max(200),
  emailSubject: z.string().min(1, "Email subject is required").max(150),
  emailBody: z.string().min(1, "Email body is required").max(5000),
});

export const sendInvitationsZ = z.object({
  recipients: z
    .array(
      z.object({
        email: z.email(),
        name: z.string().nullable().optional(),
      }),
    )
    .min(1, "Select at least one recipient")
    .max(125, "Maximum 125 recipients allowed"),
});

export const rsvpStatusZ = z.object({
  status: z.enum(["attending", "maybe", "declined"]),
});

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export const polishZ = z.object({
  casualText: z.string().min(1).max(1000),
  eventName: z.string().min(1).max(100),
  eventDate: z.string().min(1),
  eventLocation: z.string().min(1).max(200),
  eventDesc: z.string().max(1000).optional().default(""),
});

export const polishResponseZ = z.object({
  subject: z.string(),
  body: z.string(),
});
