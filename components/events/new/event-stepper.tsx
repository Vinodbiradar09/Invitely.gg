"use client";

import { Step } from "@/app/hooks/use-event-creation";

interface EventStepperProps {
  currentStep: Step;
}

const steps: { step: Step; label: string }[] = [
  { step: 1, label: "Details" },
  { step: 2, label: "Invite" },
  { step: 3, label: "Recipients" },
  { step: 4, label: "Preview" },
];

export function EventStepper({ currentStep }: EventStepperProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map(({ step, label }, index) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

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
                className={`font-mono text-xs transition-colors hidden sm:block ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
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
  );
}
