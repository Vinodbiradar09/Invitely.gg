import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WorkspaceIdParams {
  params: Promise<{ workspaceId: string }>;
}

export interface MemberIdParams {
  params: Promise<{ memberId: string }>;
}

export interface Token {
  params: Promise<{ token: string }>;
}

export interface TemplateIdParams {
  params: Promise<{ templateId: string }>;
}

export interface InvitationIdParams {
  params: Promise<{ invitationId: string }>;
}

export interface EventIdParams {
  params: Promise<{ eventId: string }>;
}

export const WORKSPACE_LIMITS = {
  MAX_WORKSPACES_PER_USER: 5,
  MAX_MEMBERS_PER_WORKSPACE: 25,
};

type DateFormatType = "full" | "short" | "llm";
export function formatEventDate(
  date: Date | string | number,
  type: DateFormatType = "short",
): string {
  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...((type === "full" || type === "llm") && { year: "numeric" }),
    ...(type === "llm" && { timeZoneName: "short" }),
  };

  return d.toLocaleString("en-US", options);
}
