"use client";

import { useState } from "react";
import { toast } from "sonner";

type RSVPStatus = "attending" | "maybe" | "declined";

interface UseRSVPProps {
  token: string;
  initialStatus: RSVPStatus | "pending";
}

export function useRSVP({ token, initialStatus }: UseRSVPProps) {
  const [status, setStatus] = useState<RSVPStatus | "pending">(initialStatus);
  const [isLoading, setIsLoading] = useState<RSVPStatus | null>(null);

  async function respond(newStatus: RSVPStatus) {
    if (status === newStatus) {
      toast.info(`you already responded as ${newStatus}`);
      return;
    }

    try {
      setIsLoading(newStatus);

      const res = await fetch(`/api/rsvp/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.status === 410) {
        toast.error(data.message);
        return;
      }

      if (res.status === 429) {
        toast.error(data.message);
        return;
      }

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setStatus(newStatus);
      toast.success(data.message);
    } catch {
      toast.error("failed to submit response. Please try again.");
    } finally {
      setIsLoading(null);
    }
  }

  return { status, isLoading, respond };
}
