"use client";

import { useDeleteMember } from "@/app/hooks/use-workspaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MemberDeleteDialogProps {
  memberId: string;
  memberEmail: string;
  workspaceId: string;
}

export function MemberDeleteDialog({
  memberId,
  memberEmail,
  workspaceId,
}: MemberDeleteDialogProps) {
  const { deleteMember, isLoading } = useDeleteMember();

  async function handleDelete() {
    await deleteMember(memberId, workspaceId);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="font-mono sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">
            Remove member
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            Remove{" "}
            <span className="text-foreground font-semibold">{memberEmail}</span>{" "}
            from this workspace?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono text-xs h-8">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="font-mono text-xs h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
