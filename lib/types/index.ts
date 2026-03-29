import { CreateBatchResponse, CreateBatchRequestOptions } from "resend";
import { Prisma, InvitationStatus, $Enums } from "@prisma/client";

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
export interface pendingInvitation {
  name: string | null;
  id: string;
  email: string;
  token: string;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  react: React.ReactElement;
}

export type ResendResult = PromiseSettledResult<
  CreateBatchResponse<CreateBatchRequestOptions>
>;

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

export interface InvitationItem {
  id: string;
  eventId: string;
  email: string;
  name: string | null;
  token: string;
  status: InvitationStatus;
  respondedAt: Date | null;
  sentAt: Date;
  updatedAt: Date | null;
}

export interface EventWithStatus {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  desc: string;
  eventAt: Date;
  location: string;
  emailSubject: string;
  emailBody: string;
  status: string;
  cancelledAt: Date | null;
  scheduledAt: Date | null;
  recurrence: string | null;
  parentEventId: string | null;
  sentAt: Date | null;
  invitations: {
    status: $Enums.InvitationStatus;
  }[];
}

export interface Invitation {
  name: string | null;
  email: string;
  status: $Enums.InvitationStatus;
  id: string;
  respondedAt: Date | null;
  sentAt: Date;
  openedAt: Date | null;
  guestNote: string | null;
  organizerNote: string | null;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

export interface WorkspaceWithMembers {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  members: WorkspaceMember[];
}

export interface PastEvent {
  id: string;
  name: string;
  location: string;
  eventAt: Date;
  createdAt: Date;
  status: string;
  recurrence: string | null;
  parentEventId: string | null;
  sentAt: Date | null;
  summary: {
    total: number;
    attending: number;
    maybe: number;
    declined: number;
    pending: number;
  };
}
