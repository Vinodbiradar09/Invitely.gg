"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CalendarX } from "lucide-react";
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

interface UnscheduleButtonProps {
  eventId: string;
  scheduledAt: Date;
}

export function UnscheduleButton({
  eventId,
  scheduledAt,
}: UnscheduleButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formattedSchedule = new Date(scheduledAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleUnschedule() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/schedule`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("scheduled send cancelled");
      router.refresh();
    } catch {
      toast.error("failed to cancel scheduled send");
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
          className="font-mono text-xs h-8 gap-2 text-blue-500 border-blue-500/30 hover:border-blue-500/60 hover:text-blue-400"
        >
          <CalendarX className="h-3 w-3" />
          Unschedule
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-mono sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">
            Cancel scheduled send
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            This will cancel the send scheduled for{" "}
            <span className="text-foreground font-semibold">
              {formattedSchedule}
            </span>
            . All pending invitations will be removed. You can send manually
            anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono text-xs h-8">
            Keep schedule
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnschedule}
            disabled={isLoading}
            className="font-mono text-xs h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Cancelling..." : "Cancel schedule"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
