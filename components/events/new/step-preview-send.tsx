"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Send, Users } from "lucide-react";
import { EventCreationState } from "@/app/hooks/use-event-creation";

interface StepPreviewSendProps {
  state: EventCreationState;
  organizerName: string;
  organizerEmail: string;
  onBack: () => void;
  onSend: () => Promise<void>;
}

export function StepPreviewSend({
  state,
  organizerName,
  organizerEmail,
  onBack,
  onSend,
}: StepPreviewSendProps) {
  const selectedCount = state.selectedRecipients.size;

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
                  label: "✅ Attending",
                  bg: "bg-green-500/10 text-green-500 border-green-500/30",
                },
                {
                  label: "🤔 Maybe",
                  bg: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
                },
                {
                  label: "❌ Can't Make It",
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

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          onClick={onBack}
          disabled={state.isSending}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-xs gap-2"
          onClick={onSend}
          disabled={state.isSending || selectedCount === 0}
        >
          <Send className="h-3 w-3" />
          {state.isSending
            ? "Sending..."
            : `Send to ${selectedCount} guest${selectedCount === 1 ? "" : "s"}`}
        </Button>
      </div>
    </div>
  );
}
