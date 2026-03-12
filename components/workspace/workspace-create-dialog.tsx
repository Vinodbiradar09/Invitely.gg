"use client";
import { useCreateWorkspace } from "@/app/hooks/use-workspaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface WorkspaceCreateDialogProps {
  currentCount: number;
}

const MAX_WORKSPACES = 5;

export function WorkspaceCreateDialog({
  currentCount,
}: WorkspaceCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { createWorkspace, isLoading } = useCreateWorkspace();

  const isAtLimit = currentCount >= MAX_WORKSPACES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const success = await createWorkspace(name.trim());
    if (success) {
      setName("");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="font-mono text-xs gap-2"
          disabled={isAtLimit}
          title={isAtLimit ? "Maximum 5 workspaces allowed" : undefined}
        >
          <Plus className="h-3 w-3" />
          New Workspace
        </Button>
      </DialogTrigger>

      <DialogContent className="font-mono sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">
            Create workspace
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-muted-foreground">
            Group your contacts by relationship. Max {MAX_WORKSPACES}{" "}
            workspaces.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="workspace-name" className="font-mono text-xs">
              Name
            </Label>
            <Input
              id="workspace-name"
              placeholder="e.g. College, Office, Family"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-mono text-sm h-9"
              maxLength={50}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              {currentCount}/{MAX_WORKSPACES} workspaces used
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-mono text-xs"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
