import { Prisma } from "@prisma/client";
export interface LLMResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export type RawEvent = Prisma.EventGetPayload<{
  include: {
    _count: { select: { invitations: true } };
    invitations: { select: { status: true } };
  };
}>;

export interface SendUpdateParams {
  event: {
    name: string;
    location: string;
    eventAt: Date;
  };
  invitations: Array<{
    email: string;
    name: string | null;
    token: string;
  }>;
  session: {
    user: {
      name: string;
      email: string;
    };
  };
  changes: {
    locationChanged: boolean;
    timeChanged: boolean;
    oldLocation?: string;
    oldDate?: string;
  };
}

export interface CancelNotificationParams {
  event: {
    name: string;
    location: string;
    eventAt: Date;
  };
  invitations: Array<{
    email: string;
    name: string | null;
  }>;
  session: {
    user: {
      name: string;
    };
  };
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  react: React.ReactElement;
}

export interface ScheduleInvitationsDTO {
  scheduledAt: string;
  recipients: {
    email: string;
    name?: string | null;
  }[];
}

export interface UpdateEventDTO {
  name?: string;
  desc?: string;
  eventAt?: string;
  location?: string;
  emailSubject?: string;
  emailBody?: string;
}

export interface InvitationData {
  status: string;
  sentAt: Date | string | null;
  respondedAt: Date | string | null;
  openedAt: Date | string | null;
}
