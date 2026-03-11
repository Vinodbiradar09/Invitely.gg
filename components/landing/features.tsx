import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Sparkles, Send, BarChart3, Bell, Shield } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: "Contact Workspaces",
    desc: "Group your contacts once into named workspaces. Invite an entire group or handpick individuals total flexibility every time.",
  },
  {
    icon: Sparkles,
    title: "AI Email Optimize",
    desc: "Write casually, publish professionally. Our AI rewrites your rough message into a optimized, warm invite in seconds.",
  },
  {
    icon: Send,
    title: "Send on Your Behalf",
    desc: "Emails go out from Invitely.gg on your behalf. Recipients see your name as the organiser personal touch, zero manual effort.",
  },
  {
    icon: BarChart3,
    title: "Live RSVP Dashboard",
    desc: "See who's attending, maybe, or declined in real time. A clean dashboard shows your complete guest list with response timestamps.",
  },
  {
    icon: Bell,
    title: "One-Click Reminders",
    desc: "People forget. Filter everyone who hasn't replied and send a reminder in one click same invite, same RSVP link, fresh nudge.",
  },
  {
    icon: Shield,
    title: "Secure RSVP Links",
    desc: "Every invitation gets a unique 64-character cryptographic token. No account needed for guests just click and respond.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-6 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Features
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you dont.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="border-border bg-card hover:border-foreground/20 transition-colors"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex h-8 w-8 items-center justify-center border border-border bg-background mb-3">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  {title}
                </h3>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
