"use client";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Recurrence = "weekly" | "monthly" | "annually" | null;

interface EditEventDetailsProps {
  initialValues: {
    name: string;
    desc: string;
    eventAt: string;
    location: string;
    recurrence: Recurrence;
    autoInvite: boolean;
  };
  onNext: (values: {
    name: string;
    desc: string;
    eventAt: string;
    location: string;
    recurrence: Recurrence;
    autoInvite: boolean;
  }) => void;
}

export function EditEventDetails({
  initialValues,
  onNext,
}: EditEventDetailsProps) {
  const [name, setName] = useState(initialValues.name);
  const [desc, setDesc] = useState(initialValues.desc);
  const [eventAt, setEventAt] = useState(initialValues.eventAt);
  const [location, setLocation] = useState(initialValues.location);
  const [recurrence, setRecurrence] = useState<Recurrence>(
    initialValues.recurrence,
  );
  const [autoInvite, setAutoInvite] = useState(initialValues.autoInvite);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  const isValid =
    name.trim() &&
    desc.trim() &&
    eventAt &&
    location.trim() &&
    new Date(eventAt) > new Date();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onNext({ name, desc, eventAt, location, recurrence, autoInvite });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-name" className="font-mono text-xs">
          Event name *
        </Label>
        <Input
          id="event-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
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
            value={eventAt}
            min={minDateTime}
            onChange={(e) => setEventAt(e.target.value)}
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="font-mono text-sm h-9"
            maxLength={200}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="font-mono text-xs flex items-center gap-2">
          <RefreshCw className="h-3 w-3" />
          Repeat this event
        </Label>
        <Select
          value={recurrence ?? "none"}
          onValueChange={(val) => {
            const newRecurrence = val === "none" ? null : (val as Recurrence);
            setRecurrence(newRecurrence);
            if (!newRecurrence) setAutoInvite(false);
          }}
        >
          <SelectTrigger className="font-mono text-xs h-9 w-full sm:w-48">
            <SelectValue placeholder="Does not repeat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="font-mono text-xs">
              Does not repeat
            </SelectItem>
            <SelectItem value="weekly" className="font-mono text-xs">
              Weekly
            </SelectItem>
            <SelectItem value="monthly" className="font-mono text-xs">
              Monthly
            </SelectItem>
            <SelectItem value="annually" className="font-mono text-xs">
              Annually
            </SelectItem>
          </SelectContent>
        </Select>

        {recurrence && (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              A new event will be created automatically every{" "}
              <span className="text-foreground">{recurrence}</span> after this
              one ends.
            </p>
            <div className="flex items-start gap-3 border border-border px-4 py-3">
              <Checkbox
                id="auto-invite-edit"
                checked={autoInvite}
                onCheckedChange={(checked) => setAutoInvite(checked === true)}
                className="mt-0.5"
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="auto-invite-edit"
                  className="font-mono text-xs text-foreground font-semibold cursor-pointer"
                >
                  Automatically invite same guests each time
                </label>
                <p className="font-mono text-xs text-muted-foreground">
                  When the next occurrence is created, invitations are sent to
                  the same guest list automatically. Leave unchecked to select
                  guests manually each time.
                </p>
              </div>
            </div>
          </div>
        )}
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
