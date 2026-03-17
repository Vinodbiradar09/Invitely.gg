"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";

interface EventCancelDialogProps {
  eventId: string;
  eventName: string;
  guestCount: number;
}

export function EventCancelDialog({
  eventId,
  eventName,
  guestCount,
}: EventCancelDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCancel() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch {
      toast.error("failed to cancel event");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs h-8 gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50"
        >
          <XCircle className="h-3 w-3" />
          Cancel event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-mono sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">
            Cancel event
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            This will cancel{" "}
            <span className="text-foreground font-semibold">{eventName}</span>
            {guestCount > 0 && (
              <>
                {" "}
                and notify{" "}
                <span className="text-foreground font-semibold">
                  {guestCount} guest{guestCount === 1 ? "" : "s"}
                </span>{" "}
                by email
              </>
            )}
            . This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono text-xs h-8">
            Keep event
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="font-mono text-xs h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Cancelling..." : "Cancel event"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
