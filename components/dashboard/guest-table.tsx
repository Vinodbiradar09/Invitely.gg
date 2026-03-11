import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InvitationStatus = "pending" | "attending" | "maybe" | "declined";

interface Invitation {
  id: string;
  name: string | null;
  email: string;
  status: InvitationStatus;
  sentAt: Date;
  respondedAt: Date | null;
}

interface GuestTableProps {
  invitations: Invitation[];
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

export function GuestTable({ invitations }: GuestTableProps) {
  if (invitations.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          No invitations sent yet
        </p>
      </div>
    );
  }

  // sort: attending first, then maybe, then pending, then declined
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
    <div className="border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4">
              Name
            </TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4">
              Email
            </TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4">
              Status
            </TableHead>
            <TableHead className="font-mono text-xs text-muted-foreground h-9 px-4 text-right">
              Responded
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((inv: Invitation) => {
            const config = statusConfig[inv.status];
            return (
              <TableRow
                key={inv.id}
                className="border-border hover:bg-muted/30"
              >
                <TableCell className="font-mono text-xs text-foreground px-4 py-2.5">
                  {inv.name ?? (
                    <span className="text-muted-foreground italic">
                      No name
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5">
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
                <TableCell className="font-mono text-xs text-muted-foreground px-4 py-2.5 text-right">
                  {formatDate(inv.respondedAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
