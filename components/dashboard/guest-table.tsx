"use client";

import { OrganizerNoteInput } from "@/components/dashboard/organizer-note-input";
import { ResendLinkButton } from "@/components/dashboard/resend-link-button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

type InvitationStatus = "pending" | "attending" | "maybe" | "declined";

interface Invitation {
  id: string;
  name: string | null;
  email: string;
  status: InvitationStatus;
  sentAt: Date;
  respondedAt: Date | null;
  openedAt: Date | null;
  guestNote: string | null;
  organizerNote: string | null;
}

interface GuestTableProps {
  invitations: Invitation[];
  eventId: string;
  isScheduled?: boolean;
}

const statusConfig: Record<
  InvitationStatus,
  { label: string; className: string }
> = {
  attending: {
    label: "Attending",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  maybe: {
    label: "Maybe",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  declined: {
    label: "Declined",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-border",
  },
};

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GuestRow({
  inv,
  eventId,
  isScheduled,
}: {
  inv: Invitation;
  eventId: string;
  isScheduled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[inv.status];
  const hasNotes = !!inv.guestNote || !!inv.organizerNote;

  return (
    <>
      <TableRow className="border-border hover:bg-muted/30">
        <TableCell className="font-mono text-xs text-foreground px-4 py-2.5">
          <div className="flex flex-col gap-0.5">
            <span>
              {inv.name ?? (
                <span className="text-muted-foreground italic">No name</span>
              )}
            </span>
            <span className="text-muted-foreground md:hidden">{inv.email}</span>
          </div>
        </TableCell>

        <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5 hidden md:table-cell">
          {inv.email}
        </TableCell>

        <TableCell className="px-4 py-2.5">
          <Badge
            variant="outline"
            className={`font-mono text-xs px-1.5 py-0 h-4 ${config.className}`}
          >
            {config.label}
          </Badge>
        </TableCell>

        <TableCell className="px-4 py-2.5 hidden lg:table-cell">
          <Tooltip>
            <TooltipTrigger asChild>
              {inv.openedAt ? (
                <Badge
                  variant="outline"
                  className="font-mono text-xs px-1.5 py-0 h-4 bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-default"
                >
                  Opened
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="font-mono text-xs px-1.5 py-0 h-4 bg-muted text-muted-foreground border-border cursor-default"
                >
                  Unknown
                </Badge>
              )}
            </TooltipTrigger>
            <TooltipContent className="font-mono text-xs max-w-48">
              {inv.openedAt
                ? `Opened ${new Date(inv.openedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                : "Cannot confirm — recipient may have images blocked"}
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5 hidden lg:table-cell">
          {formatDate(inv.respondedAt)}
        </TableCell>

        <TableCell className="px-4 py-2.5 text-right">
          <div className="flex items-center justify-end gap-1">
            {!isScheduled && (
              <ResendLinkButton eventId={eventId} email={inv.email} />
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 w-7 p-0 transition-colors ${
                hasNotes
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="border-border bg-muted/10 hover:bg-muted/10">
          <TableCell colSpan={6} className="px-4 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Guest note
                </span>
                {inv.guestNote ? (
                  <p className="font-mono text-xs text-foreground leading-relaxed break-words whitespace-pre-wrap">
                    {inv.guestNote}
                  </p>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground/40 italic">
                    No note from guest
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Your private note
                </span>
                <OrganizerNoteInput
                  invitationId={inv.id}
                  initialNote={inv.organizerNote}
                />
              </div>
              <div className="flex flex-col gap-1 lg:hidden">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Opened
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {inv.openedAt ? formatDate(inv.openedAt) : "Unknown"}
                </span>
              </div>
              <div className="flex flex-col gap-1 lg:hidden">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Responded
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(inv.respondedAt)}
                </span>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function GuestTable({
  invitations,
  eventId,
  isScheduled,
}: GuestTableProps) {
  if (invitations.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          No invitations sent yet
        </p>
      </div>
    );
  }

  const order: InvitationStatus[] = [
    "attending",
    "maybe",
    "pending",
    "declined",
  ];
  const sorted = [...invitations].sort(
    (a, b) => order.indexOf(a.status) - order.indexOf(b.status),
  );

  return (
    <TooltipProvider>
      <div className="border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4">
                Name
              </TableHead>
              <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4 hidden md:table-cell">
                Email
              </TableHead>
              <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4 hidden lg:table-cell">
                Opened
              </TableHead>
              <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4 hidden lg:table-cell">
                Responded
              </TableHead>
              <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((inv: Invitation) => (
              <GuestRow
                key={inv.id}
                inv={inv}
                eventId={eventId}
                isScheduled={isScheduled}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
