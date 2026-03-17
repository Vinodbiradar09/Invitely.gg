import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import {
  Users,
  Sparkles,
  Send,
  BarChart3,
  Bell,
  RefreshCw,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  tags: string[];
}

const features: Feature[] = [
  {
    icon: Users,
    title: "Contact Workspaces",
    desc: "Group your contacts into named workspaces Family, Office, College. Invite an entire group or handpick individuals. Add members once, reuse forever across every event.",
    tags: ["Up to 5 workspaces", "25 members each"],
  },
  {
    icon: Sparkles,
    title: "AI Powered Invitations",
    desc: "Write casually, publish professionally. AI optimizes your message into a polished invite, writes a unique opening line per guest, suggests the best send time, and analyses response data with urgency insights.",
    tags: [
      "Optimize",
      "Personalised openings",
      "Smart send time",
      "Response insights",
    ],
  },
  {
    icon: Send,
    title: "Send & Schedule",
    desc: "Send to everyone instantly or schedule for the AI-suggested best time. Emails go from Invitely.gg on your behalf your name and email as organiser, zero manual effort. Resend magic links to specific guests anytime.",
    tags: ["Batch delivery", "Schedule send", "Magic link resend"],
  },
  {
    icon: BarChart3,
    title: "Live RSVP Dashboard",
    desc: "Track attending, maybe, declined, and pending in real time. See who opened the email, who left a note, and add your own private notes per guest. Secure 64-char token links no account needed for guests.",
    tags: ["Open tracking", "Guest notes", "Organizer notes", "Secure tokens"],
  },
  {
    icon: Bell,
    title: "Reminders & Updates",
    desc: "People forget. Send reminders to all pending guests in one click. Edit event details anytime guests are automatically notified of location or time changes. Cancel events and notify everyone at once.",
    tags: ["One-click reminders", "Change notifications", "Cancel & notify"],
  },
  {
    icon: RefreshCw,
    title: "Recurring Events & Templates",
    desc: "Set events to repeat weekly, monthly, or annually the next one is created automatically. Save your best invite as a reusable template. Build a library for every occasion.",
    tags: ["Weekly / Monthly / Annually", "Stop anytime", "Reusable templates"],
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 px-6 border-t border-border bg-card/30"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Features
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Everything you need.
            <br />
            <span className="text-muted-foreground">
              Nothing you don&rsquo;t.
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, tags }) => (
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
              <CardContent className="px-5 pb-5 flex flex-col gap-3">
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-1.5 py-0.5 border border-border text-muted-foreground/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
