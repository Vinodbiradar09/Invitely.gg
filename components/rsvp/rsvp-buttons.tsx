"use client";

import { Check, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRSVP } from "@/app/hooks/use-rsvp";

type RSVPStatus = "attending" | "maybe" | "declined" | "pending";

interface RSVPButtonsProps {
  token: string;
  initialStatus: RSVPStatus;
  eventHasPassed: boolean;
}

const buttons = [
  {
    status: "attending" as const,
    label: "Attending",
    icon: Check,
    activeClass:
      "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600",
    inactiveClass:
      "border-border text-muted-foreground hover:border-green-500/50 hover:text-green-500",
  },
  {
    status: "maybe" as const,
    label: "Maybe",
    icon: HelpCircle,
    activeClass:
      "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600",
    inactiveClass:
      "border-border text-muted-foreground hover:border-yellow-500/50 hover:text-yellow-500",
  },
  {
    status: "declined" as const,
    label: "Can't make it",
    icon: X,
    activeClass:
      "bg-destructive text-white border-destructive hover:bg-destructive/90",
    inactiveClass:
      "border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive",
  },
];

export function RSVPButtons({
  token,
  initialStatus,
  eventHasPassed,
}: RSVPButtonsProps) {
  const { status, isLoading, respond } = useRSVP({ token, initialStatus });

  if (eventHasPassed) {
    return (
      <div className="border border-border px-4 py-3">
        <p className="font-mono text-xs text-muted-foreground text-center">
          This event has already passed. RSVP is closed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs text-muted-foreground">
        Will you be attending?
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        {buttons.map(
          ({
            status: btnStatus,
            label,
            icon: Icon,
            activeClass,
            inactiveClass,
          }) => {
            const isActive = status === btnStatus;
            const isThisLoading = isLoading === btnStatus;
            const isAnyLoading = isLoading !== null;

            return (
              <Button
                key={btnStatus}
                variant="outline"
                size="sm"
                className={`font-mono text-xs gap-2 flex-1 transition-all ${
                  isActive ? activeClass : inactiveClass
                }`}
                onClick={() => respond(btnStatus)}
                disabled={isAnyLoading}
              >
                {isThisLoading ? (
                  <span className="h-3 w-3 animate-spin border border-current border-t-transparent" />
                ) : (
                  <Icon className="h-3 w-3" />
                )}
                {label}
                {isActive && !isThisLoading && (
                  <span className="ml-auto font-mono text-xs opacity-70">
                    ✓
                  </span>
                )}
              </Button>
            );
          },
        )}
      </div>

      {status !== "pending" && (
        <p className="font-mono text-xs text-muted-foreground">
          You responded{" "}
          <span className="text-foreground font-semibold">{status}</span>. You
          can change this anytime before the event.
        </p>
      )}
    </div>
  );
}
