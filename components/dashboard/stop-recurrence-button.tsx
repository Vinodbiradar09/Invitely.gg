"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
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

interface StopRecurrenceButtonProps {
  eventId: string;
  recurrence: string;
  futureCount: number;
}

export function StopRecurrenceButton({
  eventId,
  recurrence,
  futureCount,
}: StopRecurrenceButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [cancelFuture, setCancelFuture] = useState(false);

  async function handleStop() {
    try {
      setIsLoading(true);
      const url = cancelFuture
        ? `/api/events/${eventId}/recurring?cancelFuture=true`
        : `/api/events/${eventId}/recurring`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("failed to stop recurrence");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs h-8 gap-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3 w-3" />
          Stop repeating
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-mono sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-sm">
            Stop recurring event
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            This event repeats{" "}
            <span className="text-foreground font-semibold">{recurrence}</span>.
            {futureCount > 0 && (
              <>
                {" "}
                There {futureCount === 1 ? "is" : "are"}{" "}
                <span className="text-foreground font-semibold">
                  {futureCount} future event
                  {futureCount === 1 ? "" : "s"}
                </span>{" "}
                already created.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {futureCount > 0 && (
          <div className="flex flex-col gap-2 py-2">
            <button
              type="button"
              onClick={() => setCancelFuture(false)}
              className={`font-mono text-xs px-3 py-2.5 border text-left transition-colors ${
                !cancelFuture
                  ? "border-foreground bg-foreground/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              }`}
            >
              <span className="font-semibold">Stop future repeats only</span>
              <br />
              <span className="text-muted-foreground">
                Keep the {futureCount} already created event
                {futureCount === 1 ? "" : "s"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCancelFuture(true)}
              className={`font-mono text-xs px-3 py-2.5 border text-left transition-colors ${
                cancelFuture
                  ? "border-destructive bg-destructive/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-destructive/30"
              }`}
            >
              <span className="font-semibold">
                Stop and cancel all upcoming
              </span>
              <br />
              <span className="text-muted-foreground">
                Cancel the {futureCount} future event
                {futureCount === 1 ? "" : "s"} too
              </span>
            </button>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel className="font-mono text-xs h-8">
            Keep repeating
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStop}
            disabled={isLoading}
            className={`font-mono text-xs h-8 ${
              cancelFuture
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
          >
            {isLoading ? "Stopping..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
