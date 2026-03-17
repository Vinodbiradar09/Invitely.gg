"use client";
import { useState } from "react";
import { toast } from "sonner";

type RSVPStatus = "attending" | "maybe" | "declined";

interface UseRSVPProps {
  token: string;
  initialStatus: RSVPStatus | "pending";
  initialGuestNote?: string | null;
}

export function useRSVP({
  token,
  initialStatus,
  initialGuestNote,
}: UseRSVPProps) {
  const [status, setStatus] = useState<RSVPStatus | "pending">(initialStatus);
  const [isLoading, setIsLoading] = useState<RSVPStatus | null>(null);
  const [guestNote, setGuestNote] = useState<string>(initialGuestNote ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  async function respond(newStatus: RSVPStatus, note?: string) {
    try {
      setIsLoading(newStatus);
      const res = await fetch(`/api/rsvp/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(note !== undefined && { guestNote: note }),
        }),
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
      if (note !== undefined) {
        setGuestNote(note);
        setNoteSaved(true);
      }
      toast.success(data.message);
    } catch {
      toast.error("failed to submit response. please try again.");
    } finally {
      setIsLoading(null);
    }
  }

  async function saveNote(note: string) {
    if (!status || status === "pending") {
      toast.error("please respond first before adding a note");
      return;
    }
    await respond(status as RSVPStatus, note);
  }

  return {
    status,
    isLoading,
    respond,
    guestNote,
    setGuestNote,
    noteSaved,
    saveNote,
  };
}
