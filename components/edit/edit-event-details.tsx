"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface EditEventDetailsProps {
  initialValues: {
    name: string;
    desc: string;
    eventAt: string;
    location: string;
  };
  onNext: (values: {
    name: string;
    desc: string;
    eventAt: string;
    location: string;
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
    onNext({ name, desc, eventAt, location });
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
