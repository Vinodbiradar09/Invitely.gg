"use client";
import { EditEventDetails } from "@/components/edit/edit-event-details";
import { EditEmailContent } from "@/components/edit/edit-email-content";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EditEventFormProps {
  event: {
    id: string;
    name: string;
    desc: string;
    eventAt: Date;
    location: string;
    emailSubject: string;
    emailBody: string;
  };
}

type Step = 1 | 2;

const stepTitles: Record<Step, string> = {
  1: "Event details",
  2: "Email content",
};

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSaving, setIsSaving] = useState(false);

  const eventAtLocal = new Date(event.eventAt);
  eventAtLocal.setMinutes(
    eventAtLocal.getMinutes() - eventAtLocal.getTimezoneOffset(),
  );
  const eventAtValue = eventAtLocal.toISOString().slice(0, 16);

  const [detailsValues, setDetailsValues] = useState({
    name: event.name,
    desc: event.desc,
    eventAt: eventAtValue,
    location: event.location,
  });

  async function handleSave(emailValues: {
    emailSubject: string;
    emailBody: string;
  }) {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: detailsValues.name,
          desc: detailsValues.desc,
          eventAt: new Date(detailsValues.eventAt).toISOString(),
          location: detailsValues.location,
          emailSubject: emailValues.emailSubject,
          emailBody: emailValues.emailBody,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      if (data.notified) {
        toast.success("event updated guests notified of changes");
      } else {
        toast.success("event updated successfully");
      }
      router.push(`/events/${event.id}`);
      router.refresh();
    } catch {
      toast.error("failed to update event");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {([1, 2] as Step[]).map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            return (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center border font-mono text-xs font-semibold transition-colors ${
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : isCompleted
                          ? "border-foreground/40 bg-foreground/10 text-foreground/60"
                          : "border-border bg-transparent text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "✓" : step}
                  </div>
                  <span
                    className={`font-mono text-xs hidden sm:block transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stepTitles[step]}
                  </span>
                </div>
                {index < 1 && (
                  <div
                    className={`mx-3 h-px w-8 transition-colors ${
                      currentStep > step ? "bg-foreground/40" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="font-mono text-xs text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => router.push(`/events/${event.id}`)}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>

      <Separator className="bg-border" />

      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
        Step {currentStep} — {stepTitles[currentStep]}
      </p>

      {currentStep === 1 && (
        <EditEventDetails
          initialValues={detailsValues}
          onNext={(values) => {
            setDetailsValues(values);
            setCurrentStep(2);
          }}
        />
      )}

      {currentStep === 2 && (
        <EditEmailContent
          initialValues={{
            emailSubject: event.emailSubject,
            emailBody: event.emailBody,
          }}
          eventName={detailsValues.name}
          eventDate={detailsValues.eventAt}
          eventLocation={detailsValues.location}
          eventDesc={detailsValues.desc}
          onBack={() => setCurrentStep(1)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
