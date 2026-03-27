import { z } from "zod";

export const ZodEvent = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  desc: z.string().min(1, "Description is required").max(1000),
  eventAt: z.string().datetime(), // ISO string from frontend
  location: z.string().min(1, "Location is required").max(200),
  emailSubject: z.string().min(1, "Email subject is required").max(150),
  emailBody: z.string().min(1, "Email body is required").max(5000),
  recurrence: z.enum(["weekly", "monthly", "annually"]).nullable().optional(),
  autoInvite: z.boolean().optional().default(false),
});

export const ZodUpdateEvent = z.object({
  name: z.string().min(1).max(100).optional(),
  desc: z.string().min(1).optional(),
  eventAt: z.string().datetime().optional(),
  location: z.string().min(1).optional(),
  emailSubject: z.string().min(1).optional(),
  emailBody: z.string().min(1).optional(),
});

export const ZodOrganizerNote = z.object({
  organizerNote: z.string().max(500),
});

export const ZodRecurrence = z.object({
  recurrence: z.enum(["weekly", "monthly", "annually"]).nullable(),
  autoInvite: z.boolean().optional().default(false),
});
