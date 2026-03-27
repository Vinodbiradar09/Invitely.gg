import { UpdateEmail } from "@/components/update-email";
import { CancelEmail } from "@/components/cancel-email";
import { resend } from "../resend/index";
import {
  SendUpdateParams,
  CancelNotificationParams,
  EmailData,
} from "../types/index";

const BATCH_SIZE = 50;

export const NotificationService = {
  async sendEventUpdateEmails({
    event,
    invitations,
    session,
    changes,
  }: SendUpdateParams): Promise<void> {
    const newDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const batchPayload = invitations.map((inv) => ({
      from: process.env.FROM!,
      to: inv.email,
      subject: `Event Update: ${event.name}`,
      react: UpdateEmail({
        organizerName: session.user.name,
        organizerEmail: session.user.email,
        recipientName: inv.name ?? "",
        recipientEmail: inv.email,
        eventName: event.name,
        eventDate: newDate,
        eventLocation: event.location,
        token: inv.token,
        changes: {
          ...changes,
        },
      }),
    }));

    for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
      const batch = batchPayload.slice(i, i + BATCH_SIZE);
      await Promise.allSettled([resend.batch.send(batch)]);
    }
  },

  async sendCancellationEmails({
    event,
    invitations,
    session,
  }: CancelNotificationParams) {
    const eventDate = new Date(event.eventAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const batchPayload: EmailData[] = invitations.map((inv) => ({
      from: process.env.FROM!,
      to: inv.email,
      subject: `Cancelled: ${event.name}`,
      react: CancelEmail({
        organizerName: session.user.name,
        recipientName: inv.name ?? "",
        recipientEmail: inv.email,
        eventName: event.name,
        eventDate,
        eventLocation: event.location,
      }),
    }));
    const batches: EmailData[][] = [];
    for (let i = 0; i < batchPayload.length; i += BATCH_SIZE) {
      batches.push(batchPayload.slice(i, i + BATCH_SIZE));
    }
    return await Promise.allSettled(
      batches.map((batch) => resend.batch.send(batch)),
    );
  },
};
