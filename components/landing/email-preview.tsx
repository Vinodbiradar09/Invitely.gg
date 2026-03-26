import {
  Sparkles,
  Check,
  HelpCircle,
  Calendar,
  MapPin,
  Clock,
  X,
} from "lucide-react";

export function EmailPreview() {
  return (
    <section className="py-16 px-6 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-16">
          <div className="text-center">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-3 text-balance">
              Write casually. Send professionally.
            </h2>
            <p className="font-mono text-sm text-muted-foreground mt-4 max-w-lg mx-auto">
              Type your message the way you{"'"}d text a friend. Invitely{"'"}s
              AI transforms it into a high-end invitation.
            </p>
          </div>

          <div className="border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-4 py-3 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 bg-destructive/60" />
                  <div className="h-3 w-3 bg-chart-4/60" />
                  <div className="h-3 w-3 bg-chart-2/60" />
                </div>
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  mail.google.com
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                Just now
              </span>
            </div>

            <div className="border-b border-border px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center border border-border bg-primary shrink-0">
                    <span className="font-mono text-base font-bold text-primary-foreground">
                      I
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        Invitely.gg
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {"<"}noreply@invitely.gg{">"}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      to me
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-border px-6 py-3 bg-muted/5">
              <span className="font-mono text-base font-semibold text-foreground">
                You{"'"}re Invited: Birthday Celebration
              </span>
            </div>

            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <div className="max-w-xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-sm text-foreground leading-relaxed">
                    Hi Shambavi,
                  </p>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    It{"'"}s that time of year! You{"'"}re invited to celebrate
                    my birthday this Saturday evening at my place.
                  </p>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    Dinner and drinks are on me just bring yourself and good
                    energy. It{"'"}s going to be a great night.
                  </p>
                </div>

                <div className="border border-border p-5 bg-muted/10">
                  <h4 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Event Details
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center border border-border bg-background shrink-0">
                        <Calendar className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium text-foreground">
                          Saturday, March 29th
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          Date
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center border border-border bg-background shrink-0">
                        <Clock className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium text-foreground">
                          7:00 PM onwards
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          Time
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center border border-border bg-background shrink-0">
                        <MapPin className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium text-foreground">
                          123 Main Street, Apartment 4B
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          Location
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <p className="font-mono text-sm text-foreground">
                    Will you be joining us?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="font-mono text-sm px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Yes</span>
                    </button>
                    <button className="font-mono text-sm px-4 py-3 border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Maybe</span>
                    </button>
                    <button className="font-mono text-sm px-4 py-3 border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center gap-2">
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">No</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-2">
                  <p className="font-mono text-xs text-muted-foreground text-center">
                    Sent via Invitely.gg [ Event invitations made simple ]
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-xs text-muted-foreground px-2">
              You always review before sending
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
}
