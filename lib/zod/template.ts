import { z } from "zod";

export const ZodCreateTemplate = z.object({
  name: z.string().min(1, "Template name is required").max(100),
  emailSubject: z.string().min(1, "Subject is required").max(150),
  emailBody: z.string().min(1, "Body is required").max(5000),
  eventId: z.string().optional(),
});
