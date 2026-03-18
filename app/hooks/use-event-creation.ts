"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type Step = 1 | 2 | 3 | 4;
export type Recurrence = "weekly" | "monthly" | "annually" | null;

export interface RecipientEntry {
  email: string;
  name: string | null;
}

export interface EventCreationState {
  // step 1
  name: string;
  desc: string;
  eventAt: string; // ISO string from datetime-local input
  location: string;

  // step 2
  emailSubject: string;
  emailBody: string;

  // step 3 — map of email → recipient entry
  selectedRecipients: Map<string, RecipientEntry>;

  // ui
  currentStep: Step;
  isPolishing: boolean;
  isSending: boolean;
  recurrence: Recurrence;
  autoInvite: boolean;
}

const initialState: Omit<EventCreationState, "selectedRecipients"> & {
  selectedRecipients: Map<string, RecipientEntry>;
} = {
  name: "",
  desc: "",
  eventAt: "",
  location: "",
  emailSubject: "",
  emailBody: "",
  selectedRecipients: new Map(),
  currentStep: 1,
  isPolishing: false,
  isSending: false,
  recurrence: null,
  autoInvite: false,
};

export function useEventCreation() {
  const router = useRouter();
  const [state, setState] = useState<EventCreationState>({
    ...initialState,
    selectedRecipients: new Map(),
  });

  function goToStep(step: Step) {
    setState((prev) => ({ ...prev, currentStep: step }));
  }

  function nextStep() {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(4, prev.currentStep + 1) as Step,
    }));
  }

  function prevStep() {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1) as Step,
    }));
  }

  function setField<K extends keyof EventCreationState>(
    key: K,
    value: EventCreationState[K],
  ) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRecipient(entry: RecipientEntry) {
    setState((prev) => {
      const map = new Map(prev.selectedRecipients);
      if (map.has(entry.email)) {
        map.delete(entry.email);
      } else {
        map.set(entry.email, entry);
      }
      return { ...prev, selectedRecipients: map };
    });
  }

  function toggleWorkspace(members: RecipientEntry[]) {
    setState((prev) => {
      const map = new Map(prev.selectedRecipients);
      const allSelected = members.every((m) => map.has(m.email));
      if (allSelected) {
        // deselect all
        members.forEach((m) => map.delete(m.email));
      } else {
        // select all
        members.forEach((m) => map.set(m.email, m));
      }
      return { ...prev, selectedRecipients: map };
    });
  }

  function getWorkspaceSelectionState(
    members: RecipientEntry[],
  ): "none" | "some" | "all" {
    if (members.length === 0) return "none";
    const selectedCount = members.filter((m) =>
      state.selectedRecipients.has(m.email),
    ).length;
    if (selectedCount === 0) return "none";
    if (selectedCount === members.length) return "all";
    return "some";
  }

  async function polishWithAI(casualText: string) {
    try {
      setState((prev) => ({ ...prev, isPolishing: true }));
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casualText,
          eventName: state.name,
          eventDate: state.eventAt,
          eventLocation: state.location,
          eventDesc: state.desc,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setState((prev) => ({
        ...prev,
        emailSubject: data.subject,
        emailBody: data.body,
      }));
      toast.success("email improved by ai");
    } catch {
      toast.error("ai improvement failed. please try again.");
    } finally {
      setState((prev) => ({ ...prev, isPolishing: false }));
    }
  }

  async function submitEvent() {
    if (state.selectedRecipients.size === 0) {
      toast.error("select at least one recipient");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isSending: true }));
      const eventRes = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          desc: state.desc.trim(),
          eventAt: new Date(state.eventAt).toISOString(),
          location: state.location.trim(),
          emailSubject: state.emailSubject.trim(),
          emailBody: state.emailBody.trim(),
          recurrence: state.recurrence,
          autoInvite: state.autoInvite,
        }),
      });

      const eventData = await eventRes.json();
      if (!eventData.success) {
        toast.error(eventData.message);
        return;
      }

      const eventId = eventData.event.id;

      // step 2 — send invitations
      const recipients = Array.from(state.selectedRecipients.values());

      const sendRes = await fetch(`/api/events/${eventId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients }),
      });

      const sendData = await sendRes.json();
      if (!sendData.success && sendRes.status !== 207) {
        toast.error(sendData.message);
        return;
      }

      if (sendRes.status === 207) {
        // partial success db saved but some emails failed
        toast.warning(sendData.message);
      } else {
        toast.success(`invitations sent to ${sendData.sent} guests`);
      }

      router.push(`/events/${eventId}`);
    } catch {
      toast.error("something went wrong. Please try again.");
    } finally {
      setState((prev) => ({ ...prev, isSending: false }));
    }
  }

  async function scheduleEvent(scheduledAt: string) {
    if (state.selectedRecipients.size === 0) {
      toast.error("select at least one recipient");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isSending: true }));

      const eventRes = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          desc: state.desc.trim(),
          eventAt: new Date(state.eventAt).toISOString(),
          location: state.location.trim(),
          emailSubject: state.emailSubject.trim(),
          emailBody: state.emailBody.trim(),
          recurrence: state.recurrence,
        }),
      });

      const eventData = await eventRes.json();
      if (!eventData.success) {
        toast.error(eventData.message);
        return;
      }

      const eventId = eventData.event.id;
      const recipients = Array.from(state.selectedRecipients.values());

      const scheduleRes = await fetch(`/api/events/${eventId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt, recipients }),
      });

      const scheduleData = await scheduleRes.json();
      if (!scheduleData.success) {
        toast.error(scheduleData.message);
        return;
      }

      toast.success(scheduleData.message);
      router.push(`/events/${eventId}`);
    } catch {
      toast.error("something went wrong. please try again.");
    } finally {
      setState((prev) => ({ ...prev, isSending: false }));
    }
  }

  return {
    state,
    setField,
    goToStep,
    nextStep,
    prevStep,
    toggleRecipient,
    toggleWorkspace,
    getWorkspaceSelectionState,
    polishWithAI,
    submitEvent,
    scheduleEvent,
  };
}
