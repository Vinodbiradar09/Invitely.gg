"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import { EventCreationState } from "@/app/hooks/use-event-creation";

interface StepWriteInviteProps {
  state: EventCreationState;
  setField: <K extends keyof EventCreationState>(
    key: K,
    value: EventCreationState[K],
  ) => void;
  onNext: () => void;
  onBack: () => void;
  onPolish: (casualText: string) => Promise<void>;
}

export function StepWriteInvite({
  state,
  setField,
  onNext,
  onBack,
  onPolish,
}: StepWriteInviteProps) {
  const [casualText, setCasualText] = useState("");

  const isValid = state.emailSubject.trim() && state.emailBody.trim();

  async function handlePolish() {
    if (!casualText.trim()) return;
    await onPolish(casualText);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-dashed border-border p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Improve with AI
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Write in casual tone, AI will turn it into a proper invite
          </p>
        </div>

        <Textarea
          placeholder={`e.g. "bro it's my bday come party with us saturday night, gonna be lit"`}
          value={casualText}
          onChange={(e) => setCasualText(e.target.value)}
          className="font-mono text-xs min-h-16 resize-none"
          maxLength={1000}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs gap-2 self-start"
          onClick={handlePolish}
          disabled={!casualText.trim() || state.isPolishing}
        >
          <Sparkles className="h-3 w-3" />
          {state.isPolishing ? "Optimizing..." : "Optimize"}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-border" />
        <span className="font-mono text-xs text-muted-foreground">
          or write manually
        </span>
        <Separator className="flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email-subject" className="font-mono text-xs">
            Email subject *
          </Label>
          <Input
            id="email-subject"
            placeholder="You're invited to Rahul's Birthday Party 🎉"
            value={state.emailSubject}
            onChange={(e) => setField("emailSubject", e.target.value)}
            className="font-mono text-sm h-9"
            maxLength={150}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email-body" className="font-mono text-xs">
            Email body *
          </Label>
          <Textarea
            id="email-body"
            placeholder="Write your invite message here..."
            value={state.emailBody}
            onChange={(e) => setField("emailBody", e.target.value)}
            className="font-mono text-sm min-h-40 resize-none"
            maxLength={5000}
          />
          <p className="font-mono text-xs text-muted-foreground">
            Do not include greeting or sign-off — the email template handles
            that.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          onClick={onBack}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-xs"
          onClick={onNext}
          disabled={!isValid}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
