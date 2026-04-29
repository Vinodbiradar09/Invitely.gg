"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Sparkles, Send, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "AI Powered",
    description:
      "Write casually, send professionally. AI optimizes your message into a clean invitation with personalized openings.",
  },
  {
    icon: Send,
    title: "Send at Scale",
    description:
      "Batch delivery to your entire contact list with zero manual effort. Schedule sends for the perfect time.",
  },
  {
    icon: BarChart3,
    title: "Live Tracking",
    description:
      "Track attending, maybe, and declined in real time. Send reminders to pending guests in one click.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-white/8 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Features
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-balance">
            Everything you need to send
            <br />
            <span className="text-muted-foreground">at scale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 border border-white/8">
          {features.map(({ icon: Icon, title, description }) => (
            <CardSpotlight
              key={title}
              className="relative bg-background p-8 flex flex-col justify-between min-h-70 cursor-default"
              radius={200}
              color="rgba(255,255,255,0.03)"
            >
              <div className="relative z-20 flex h-10 w-10 items-center justify-center border border-white/8 bg-white/2">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative z-20 flex flex-col gap-3">
                <h3 className="font-mono text-base font-semibold text-foreground tracking-tight">
                  {title}
                </h3>
                <p className="font-mono text-sm text-muted-foreground/60 leading-relaxed">
                  {description}
                </p>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
