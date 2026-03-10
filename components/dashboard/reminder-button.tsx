"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ReminderButtonProps {
  eventId: string;
  pendingCount: number;
}

export function ReminderButton({ eventId, pendingCount }: ReminderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (pendingCount === 0) return null;

  async function handleReminder() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/reminder`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
    } catch {
      toast.error("Failed to send reminders");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-mono text-xs gap-2"
      onClick={handleReminder}
      disabled={isLoading}
    >
      <Send className="h-3 w-3" />
      {isLoading ? "Sending..." : `Remind ${pendingCount} pending`}
    </Button>
  );
}
