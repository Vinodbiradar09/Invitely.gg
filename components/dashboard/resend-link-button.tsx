"use client";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ResendLinkButtonProps {
  eventId: string;
  email: string;
}

export function ResendLinkButton({ eventId, email }: ResendLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleResend() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events/${eventId}/resend-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
    } catch {
      toast.error("failed to resend link");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-mono text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
      onClick={handleResend}
      disabled={isLoading}
    >
      <Send className="h-3 w-3" />
    </Button>
  );
}
