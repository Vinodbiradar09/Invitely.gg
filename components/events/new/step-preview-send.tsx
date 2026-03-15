"use client";

import { Calendar, MapPin, Send, Users, Sparkles, Clock } from "lucide-react";
import { EventCreationState } from "@/app/hooks/use-event-creation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

interface SmartSendSuggestion {
  suggestedAt: string;
  dayLabel: string;
  timeLabel: string;
  reason: string;
}

interface StepPreviewSendProps {
  state: EventCreationState;
  organizerName: string;
  organizerEmail: string;
  onBack: () => void;
  onSend: () => Promise<void>;
  onSchedule: (scheduledAt: string) => Promise<void>;
}

export function StepPreviewSend({
  state,
  organizerName,
  organizerEmail,
  onBack,
  onSend,
  onSchedule,
}: StepPreviewSendProps) {
  const selectedCount = state.selectedRecipients.size;
  const [suggestion, setSuggestion] = useState<SmartSendSuggestion | null>(
    null,
  );
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const formattedDate = state.eventAt
    ? new Date(state.eventAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  async function handleGetSuggestion() {
    try {
      setIsLoadingSuggestion(true);
      const res = await fetch("/api/ai/smart-send-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: state.name,
          eventDate: formattedDate,
          eventLocation: state.location,
          eventDesc: state.desc,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setSuggestion(data.suggestion);
    } catch {
      toast.error("failed to get suggestion");
    } finally {
      setIsLoadingSuggestion(false);
    }
  }

  async function handleSchedule() {
    if (!suggestion) return;
    try {
      setIsScheduling(true);
      await onSchedule(suggestion.suggestedAt);
    } finally {
      setIsScheduling(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-border">
        <div className="border-b border-border px-4 py-3 bg-muted/20">
          <div className="grid grid-cols-[48px_1fr] gap-1">
            <span className="font-mono text-xs text-muted-foreground">
              From
            </span>
            <span className="font-mono text-xs text-foreground">
              {organizerEmail || "Invitely.gg <noreply@invitely.gg>"}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Subject
            </span>
            <span className="font-mono text-xs text-foreground">
              {state.emailSubject || "—"}
            </span>
          </div>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          <div className="border-l-2 border-foreground/20 pl-3">
            <p className="font-mono text-xs text-muted-foreground">
              Invited by
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {organizerName}
            </p>
          </div>

          <div>
            <h3 className="font-mono text-base font-semibold text-foreground mb-2">
              {state.name}
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  {state.location}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="font-mono text-xs text-foreground leading-relaxed">
            {state.emailBody
              ? state.emailBody.split("\n").map((line, i) => (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                ))
              : "—"}
          </div>

          <Separator className="bg-border" />

          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs text-muted-foreground">
              Will you be attending?
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                {
                  label: "Attending",
                  bg: "bg-green-500/10 text-green-500 border-green-500/30",
                },
                {
                  label: "Maybe",
                  bg: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
                },
                {
                  label: "Can't Make It",
                  bg: "bg-destructive/10 text-destructive border-destructive/30",
                },
              ].map(({ label, bg }) => (
                <div
                  key={label}
                  className={`font-mono text-xs px-3 py-1.5 border ${bg}`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border border-border px-4 py-3">
        <Users className="h-3 w-3 text-muted-foreground" />
        <span className="font-mono text-xs text-muted-foreground">
          Sending to
        </span>
        <Badge
          variant="secondary"
          className="font-mono text-xs bg-foreground/10 text-foreground"
        >
          {selectedCount} recipient{selectedCount === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="border border-dashed border-border px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-xs font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Smart send time
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Let AI suggest the best time to send for maximum opens
            </p>
          </div>
          {!suggestion && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-mono text-xs gap-2 shrink-0"
              onClick={handleGetSuggestion}
              disabled={isLoadingSuggestion}
            >
              <Sparkles className="h-3 w-3" />
              {isLoadingSuggestion ? "Thinking..." : "Suggest time"}
            </Button>
          )}
        </div>

        {suggestion && (
          <div className="flex flex-col gap-3">
            <div className="border border-blue-500/20 bg-blue-500/5 px-3 py-2.5 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="font-mono text-xs font-semibold text-blue-500">
                  {suggestion.dayLabel} at {suggestion.timeLabel}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {suggestion.reason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-2"
                onClick={handleSchedule}
                disabled={isScheduling || state.isSending}
              >
                <Clock className="h-3 w-3" />
                {isScheduling
                  ? "Scheduling..."
                  : `Schedule for ${suggestion.dayLabel}`}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="font-mono text-xs text-muted-foreground"
                onClick={handleGetSuggestion}
                disabled={isLoadingSuggestion}
              >
                {isLoadingSuggestion ? "Thinking..." : "New suggestion"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          onClick={onBack}
          disabled={state.isSending || isScheduling}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-xs gap-2"
          onClick={onSend}
          disabled={state.isSending || isScheduling || selectedCount === 0}
        >
          <Send className="h-3 w-3" />
          {state.isSending
            ? "Sending..."
            : `Send now to ${selectedCount} guest${selectedCount === 1 ? "" : "s"}`}
        </Button>
      </div>
    </div>
  );
}
