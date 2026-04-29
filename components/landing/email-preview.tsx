import { Logo } from "@/components/landing/logo";
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
    <section className="border-t border-white/8 relative overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col gap-12 py-16 px-6">
          <div className="text-center">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-3 tracking-tight text-balance">
              Write casually. Send professionally.
            </h2>
            <p className="font-mono text-sm text-muted-foreground/60 mt-4 max-w-lg mx-auto leading-relaxed">
              Type your message the way you&apos;d text a friend.
              Invitely&apos;s AI transforms it into a high-end invitation.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 bg-linear-to-b from-white/2 to-transparent blur-2xl opacity-40" />
            <div className="relative border border-white/8 bg-[#0a0a0a] overflow-hidden">
              <div className="border-b border-white/6 px-4 py-3 bg-white/2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 bg-white/10" />
                    <div className="h-3 w-3 bg-white/10" />
                    <div className="h-3 w-3 bg-white/10" />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground/40 ml-2">
                    mail.google.com
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground/30">
                  Just now
                </span>
              </div>

              <div className="border-b border-white/6 px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center bg-black shrink-0 border border-white/8">
                      <Logo size={44} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          Invitely.gg
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground/40">
                          {"<"}noreply@invitely.gg{">"}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground/40">
                        to me
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/6 px-6 py-3 bg-white/1">
                <span className="font-mono text-base font-semibold text-foreground">
                  You&apos;re Invited: Birthday Celebration
                </span>
              </div>

              <div className="px-6 py-10 sm:px-8 sm:py-12">
                <div className="max-w-xl mx-auto flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <p className="font-mono text-sm text-foreground leading-relaxed">
                      Hi Shambavi,
                    </p>
                    <p className="font-mono text-sm text-muted-foreground/60 leading-relaxed">
                      It&apos;s that time of year! You&apos;re invited to
                      celebrate my birthday this Saturday evening at my place.
                    </p>
                    <p className="font-mono text-sm text-muted-foreground/60 leading-relaxed">
                      Dinner and drinks are on me — just bring yourself and good
                      energy. It&apos;s going to be a great night.
                    </p>
                  </div>

                  <div className="border border-white/6 p-6 bg-white/1">
                    <h4 className="font-mono text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.15em] mb-5">
                      Event Details
                    </h4>
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center border border-white/8 bg-background shrink-0">
                          <Calendar className="h-4 w-4 text-foreground/60" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-foreground">
                            Saturday, March 29th
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/40">
                            Date
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center border border-white/8 bg-background shrink-0">
                          <Clock className="h-4 w-4 text-foreground/60" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-foreground">
                            7:00 PM onwards
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/40">
                            Time
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 items-center justify-center border border-white/8 bg-background shrink-0">
                          <MapPin className="h-4 w-4 text-foreground/60" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-foreground">
                            123 Main Street, Apartment 4B
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/40">
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
                      <button className="font-mono text-sm px-4 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Yes</span>
                      </button>
                      <button className="font-mono text-sm px-4 py-3 border border-white/8 bg-background text-muted-foreground hover:text-foreground hover:border-white/15 transition-colors flex items-center justify-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Maybe</span>
                      </button>
                      <button className="font-mono text-sm px-4 py-3 border border-white/8 bg-background text-muted-foreground hover:text-foreground hover:border-white/15 transition-colors flex items-center justify-center gap-2">
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">No</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/6 mt-2">
                    <p className="font-mono text-[11px] text-muted-foreground/30 text-center tracking-wide">
                      Sent via Invitely.gg [ Event invitations made simple ]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/8 to-transparent" />
            <span className="font-mono text-[11px] text-muted-foreground/30 px-3 tracking-wide">
              You always review before sending
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/8 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
