"use client";

import { useAddMembers } from "@/app/hooks/use-workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface MemberAddDialogProps {
  workspaceId: string;
  workspaceName: string;
  currentMemberCount: number;
}

interface MemberRow {
  id: string; // local only for key
  name: string;
  email: string;
}

const MAX_MEMBERS = 25;

function createRow(): MemberRow {
  return { id: crypto.randomUUID(), name: "", email: "" };
}

export function MemberAddDialog({
  workspaceId,
  workspaceName,
  currentMemberCount,
}: MemberAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<MemberRow[]>([createRow()]);
  const { addMembers, isLoading } = useAddMembers();

  const remainingSlots = MAX_MEMBERS - currentMemberCount;
  const isAtLimit = remainingSlots <= 0;

  function updateRow(id: string, field: "name" | "email", value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function addRow() {
    if (rows.length >= remainingSlots) {
      toast.error(`only ${remainingSlots} slots remaining`);
      return;
    }
    setRows((prev) => [...prev, createRow()]);
  }

  function removeRow(id: string) {
    if (rows.length === 1) return; // always keep at least one row
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleClose() {
    setRows([createRow()]);
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validRows = rows.filter((r) => r.email.trim());
    if (validRows.length === 0) {
      toast.error("add at least one email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validRows.filter(
      (r) => !emailRegex.test(r.email.trim()),
    );
    if (invalidEmails.length > 0) {
      toast.error(`invalid email: ${invalidEmails[0].email}`);
      return;
    }

    const members = validRows.map((r: MemberRow) => ({
      email: r.email.trim().toLowerCase(),
      name: r.name.trim() || undefined,
    }));

    const success = await addMembers(workspaceId, members);
    if (success) {
      handleClose();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (o ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs gap-2 h-7"
          disabled={isAtLimit}
          title={isAtLimit ? "workspace is full (25/25)" : undefined}
        >
          <Plus className="h-3 w-3" />
          Add members
        </Button>
      </DialogTrigger>

      <DialogContent className="font-mono sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">Add members</DialogTitle>
          <DialogDescription className="font-mono text-xs text-muted-foreground">
            Adding to{" "}
            <span className="text-foreground font-semibold">
              {workspaceName}
            </span>{" "}
            — {currentMemberCount}/{MAX_MEMBERS} slots used
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_1fr_24px] gap-2">
            <Label className="font-mono text-xs text-muted-foreground">
              Name (optional)
            </Label>
            <Label className="font-mono text-xs text-muted-foreground">
              Email *
            </Label>
            <div />
          </div>

          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {rows.map((row: MemberRow) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_1fr_24px] gap-2 items-center"
              >
                <Input
                  placeholder="Shambavi"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  className="font-mono text-xs h-8"
                />
                <Input
                  placeholder="shambavi@gmail.com"
                  type="email"
                  value={row.email}
                  onChange={(e) => updateRow(row.id, "email", e.target.value)}
                  className="font-mono text-xs h-8"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-6 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {rows.length < remainingSlots && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="font-mono text-xs gap-2 self-start h-7 text-muted-foreground"
              onClick={addRow}
            >
              <Plus className="h-3 w-3" />
              Add another
            </Button>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-mono text-xs"
              disabled={isLoading}
            >
              {isLoading
                ? "Adding..."
                : `Add ${rows.filter((r) => r.email.trim()).length || ""} member${rows.filter((r) => r.email.trim()).length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
