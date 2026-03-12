import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EmailPreview() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            What your guests receive
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            A real email.
            <br />
            <span className="text-muted-foreground">Not a notification.</span>
          </h2>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-lg">
            Every guest gets a beautifully formatted email delivered straight to
            their inbox with your name as the organiser, the full event details,
            and three clear RSVP buttons.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="border border-border bg-card">
            <div className="border-b border-border bg-muted/20 px-4 py-3">
              <div className="grid grid-cols-[56px_1fr] gap-1 font-mono text-xs">
                <span className="text-muted-foreground">From</span>
                <span className="text-foreground">teej@gmail.com</span>
                <span className="text-muted-foreground">To</span>
                <span className="text-foreground">vinod@gmail.com</span>
                <span className="text-muted-foreground">Subject</span>
                <span className="text-foreground font-semibold">
                  You&rsquo;re invited to Shambavi&rsquo;s Birthday Party 🎉
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-l-2 border-foreground/30 pl-3">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  Invited by{" "}
                  <span className="text-foreground font-semibold">
                    Teej Devries
                  </span>
                </span>
              </div>
              <h3 className="font-mono text-lg font-bold text-foreground">
                Shambavi&rsquo;s Birthday Party
              </h3>
              <div className="flex flex-col gap-1.5 border border-border px-3 py-2.5 bg-background">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">
                    Saturday, March 15, 2025 at 8:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">
                    123 MG Road, Bangalore
                  </span>
                </div>
              </div>

              <div className="font-mono text-xs text-foreground leading-relaxed flex flex-col gap-2">
                <p>
                  It&rsquo;s that time of year again! Come celebrate my birthday
                  with good food, great music, and even better company.
                </p>
                <p>
                  Dress smart-casual. Dinner and drinks will be on me just bring
                  yourself and good vibes.
                </p>
              </div>

              <Separator className="bg-border" />

              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs text-muted-foreground">
                  Hey Vinod, will you be attending?
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    {
                      label: "✅ Attending",
                      cls: "bg-green-500/10 text-green-500 border-green-500/30",
                    },
                    {
                      label: "🤔 Maybe",
                      cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
                    },
                    {
                      label: "❌ Can't Make It",
                      cls: "bg-red-500/10 text-red-500 border-red-500/30",
                    },
                  ].map(({ label, cls }) => (
                    <div
                      key={label}
                      className={`font-mono text-xs px-3 py-1.5 border ${cls}`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  You can change your response anytime before the event.
                </p>
              </div>
            </div>

            <div className="border-t border-border px-5 py-3">
              <p className="font-mono text-xs text-muted-foreground text-center">
                Sent via{" "}
                <span className="text-foreground font-semibold">
                  Invitely.gg
                </span>{" "}
                on behalf of Teej Devries
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                tag: "Personalised",
                title: "Your name. Your event.",
                desc: 'Every email shows you as the organiser "Invited by Teej Devries" not some faceless service.',
              },
              {
                tag: "No account needed",
                title: "Guests just click.",
                desc: "Recipients don't need to sign up for anything. One click on any RSVP button and their response is recorded instantly.",
              },
              {
                tag: "Real-time",
                title: "Responses update live.",
                desc: "The moment a guest clicks Attending, your dashboard updates. Watch RSVPs come in as they happen.",
              },
              {
                tag: "Changeable",
                title: "They can update anytime.",
                desc: "Plans change. Guests can click the link again at any time to update their response before the event.",
              },
            ].map(({ tag, title, desc }) => (
              <div
                key={tag}
                className="border border-border px-5 py-4 flex flex-col gap-2 hover:border-foreground/20 transition-colors"
              >
                <Badge
                  variant="secondary"
                  className="font-mono text-xs px-1.5 py-0 h-4 w-fit"
                >
                  {tag}
                </Badge>
                <h4 className="font-mono text-sm font-semibold text-foreground">
                  {title}
                </h4>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
