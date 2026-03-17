"use client";
import { Check, HelpCircle, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRSVP } from "@/app/hooks/use-rsvp";
import { useState } from "react";

type RSVPStatus = "attending" | "maybe" | "declined" | "pending";

interface RSVPButtonsProps {
  token: string;
  initialStatus: RSVPStatus;
  initialGuestNote?: string | null;
  eventHasPassed: boolean;
  eventCancelled: boolean;
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
  initialGuestNote,
  eventHasPassed,
  eventCancelled,
}: RSVPButtonsProps) {
  const {
    status,
    isLoading,
    respond,
    guestNote,
    setGuestNote,
    noteSaved,
    saveNote,
  } = useRSVP({ token, initialStatus, initialGuestNote });
  const [showNoteInput, setShowNoteInput] = useState(!!initialGuestNote);

  if (eventCancelled) {
    return (
      <div className="border border-destructive/20 bg-destructive/5 px-4 py-3">
        <p className="font-mono text-xs text-destructive text-center">
          This event has been cancelled.
        </p>
      </div>
    );
  }

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
    <div className="flex flex-col gap-4">
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

      {status !== "pending" && (
        <div className="flex flex-col gap-2">
          {!showNoteInput ? (
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs text-muted-foreground hover:text-foreground w-fit px-0"
              onClick={() => setShowNoteInput(true)}
            >
              + Add a note for the organizer
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs text-muted-foreground">
                Note for the organizer{" "}
                <span className="text-muted-foreground/60">(optional)</span>
              </p>
              <Textarea
                placeholder="e.g. I'm bringing my partner, I'm vegetarian, I'll be 10 minutes late..."
                value={guestNote}
                onChange={(e) => setGuestNote(e.target.value)}
                className="font-mono text-xs min-h-16 resize-none"
                maxLength={500}
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs h-7"
                  onClick={() => saveNote(guestNote)}
                  disabled={isLoading !== null}
                >
                  {noteSaved ? "Update note" : "Save note"}
                </Button>
                {!initialGuestNote && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="font-mono text-xs h-7 text-muted-foreground"
                    onClick={() => {
                      setShowNoteInput(false);
                      setGuestNote("");
                    }}
                    disabled={isLoading !== null}
                  >
                    Cancel
                  </Button>
                )}
                {noteSaved && (
                  <span className="font-mono text-xs text-green-500">
                    ✓ Saved
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-muted-foreground/60">
                {guestNote.length}/500
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
