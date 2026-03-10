"use client";
import { useDeleteWorkspace } from "@/app/hooks/use-workspaces";
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

interface WorkspaceDeleteDialogProps {
  workspaceId: string;
  workspaceName: string;
}

export function WorkspaceDeleteDialog({
  workspaceId,
  workspaceName,
}: WorkspaceDeleteDialogProps) {
  const { deleteWorkspace, isLoading } = useDeleteWorkspace();

  async function handleDelete() {
    await deleteWorkspace(workspaceId);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="font-mono text-xs h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="font-mono sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">
            Delete workspace
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            This will permanently delete{" "}
            <span className="text-foreground font-semibold">
              {workspaceName}
            </span>{" "}
            and remove all {`${workspaceName}'s`} members. This cannot be
            undone.
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
            {isLoading ? "Deleting..." : "Delete workspace"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
