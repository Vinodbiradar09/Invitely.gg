"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EventCreationState } from "@/app/hooks/use-event-creation";

interface StepEventDetailsProps {
  state: EventCreationState;
  setField: <K extends keyof EventCreationState>(
    key: K,
    value: EventCreationState[K],
  ) => void;
  onNext: () => void;
}

export function StepEventDetails({
  state,
  setField,
  onNext,
}: StepEventDetailsProps) {
  // get current datetime as min value for the picker
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  const isValid =
    state.name.trim() &&
    state.desc.trim() &&
    state.eventAt &&
    state.location.trim() &&
    new Date(state.eventAt) > new Date();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-name" className="font-mono text-xs">
          Event name *
        </Label>
        <Input
          id="event-name"
          placeholder="Rahul's Birthday Party"
          value={state.name}
          onChange={(e) => setField("name", e.target.value)}
          className="font-mono text-sm h-9"
          maxLength={100}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="event-desc" className="font-mono text-xs">
          Description *
        </Label>
        <Textarea
          id="event-desc"
          placeholder="A short description of your event..."
          value={state.desc}
          onChange={(e) => setField("desc", e.target.value)}
          className="font-mono text-sm min-h-20 resize-none"
          maxLength={1000}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-at" className="font-mono text-xs">
            Date & Time *
          </Label>
          <Input
            id="event-at"
            type="datetime-local"
            value={state.eventAt}
            min={minDateTime}
            onChange={(e) => setField("eventAt", e.target.value)}
            className="font-mono text-sm h-9"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="event-location" className="font-mono text-xs">
            Location *
          </Label>
          <Input
            id="event-location"
            placeholder="123 MG Road or Zoom link"
            value={state.location}
            onChange={(e) => setField("location", e.target.value)}
            className="font-mono text-sm h-9"
            maxLength={200}
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          className="font-mono text-xs"
          disabled={!isValid}
        >
          Next →
        </Button>
      </div>
    </form>
  );
}
