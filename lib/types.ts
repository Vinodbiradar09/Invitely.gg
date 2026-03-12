import { Prisma, InvitationStatus, $Enums } from "@prisma/client";
import { CreateBatchResponse, CreateBatchRequestOptions } from "resend";
import React from "react";
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

export const ZodEvent = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  desc: z.string().min(1, "Description is required").max(1000),
  eventAt: z.string().datetime(), // ISO string from frontend
  location: z.string().min(1, "Location is required").max(200),
  emailSubject: z.string().min(1, "Email subject is required").max(150),
  emailBody: z.string().min(1, "Email body is required").max(5000),
});

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
});

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export const Zodpolish = z.object({
  casualText: z.string().min(1).max(1000),
  eventName: z.string().min(1).max(100),
  eventDate: z.string().min(1),
  eventLocation: z.string().min(1).max(200),
  eventDesc: z.string().max(1000).optional().default(""),
});

export const ZodPolishResponse = z.object({
  subject: z.string(),
  body: z.string(),
});

export type RawEvent = Prisma.EventGetPayload<{
  include: {
    _count: { select: { invitations: true } };
    invitations: { select: { status: true } };
  };
}>;

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
  summary: {
    total: number;
    attending: number;
    maybe: number;
    declined: number;
    pending: number;
  };
}
