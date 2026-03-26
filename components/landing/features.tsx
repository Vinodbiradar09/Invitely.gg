import { Sparkles, Send, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Powered",
    description:
      "Write casually, send professionally. AI optimizes your message into a clean invitation with personalized openings for each guest.",
  },
  {
    icon: Send,
    title: "Send at Scale",
    description:
      "Send to everyone instantly or schedule for the best time. Batch delivery to your entire contact list with zero manual effort.",
  },
  {
    icon: BarChart3,
    title: "Live Tracking",
    description:
      "Track attending, maybe, and declined in real time. See who opened the email and send reminders to pending guests in one click.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-background p-8 flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-card">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-mono text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
