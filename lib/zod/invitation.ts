import { z } from "zod";

export const ZodSendInvitations = z.object({
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

export const ZodRsvpStatus = z.object({
  status: z.enum(["attending", "maybe", "declined"]),
  guestNote: z.string().max(500).optional(),
});

export const ZodSchedule = z.object({
  scheduledAt: z.string().datetime(),
  recipients: z
    .array(
      z.object({
        email: z.email(),
        name: z.string().nullable().optional(),
      }),
    )
    .min(1)
    .max(125),
});

export const ZodResendLink = z.object({
  email: z.email(),
});
