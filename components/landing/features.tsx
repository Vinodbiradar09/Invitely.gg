"use client";

import { Sparkles, Send, BarChart3, Zap, Users, Clock } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description:
      "Write casually, send professionally. Our AI transforms your message into polished invitations with personalized openings for each guest.",
    tag: "Smart",
  },
  {
    icon: Send,
    title: "Batch Delivery",
    description:
      "Send to your entire contact list in seconds. Schedule for optimal delivery times or send immediately with zero manual effort.",
    tag: "Scale",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description:
      "Track attending, maybe, and declined in real-time. Monitor open rates and send targeted reminders to pending guests.",
    tag: "Insights",
  },
  {
    icon: Users,
    title: "Smart Workspaces",
    description:
      "Organize contacts into reusable groups. Family, Office, Friends, create once and invite forever with one click.",
    tag: "Organize",
  },
  {
    icon: Clock,
    title: "Scheduled Sending",
    description:
      "AI analyzes optimal send times for maximum engagement. Schedule invitations to arrive when guests are most likely to respond.",
    tag: "Timing",
  },
  {
    icon: Zap,
    title: "Instant RSVPs",
    description:
      "One-click responses for your guests. No accounts needed, just tap to confirm attendance and see updates instantly.",
    tag: "Speed",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative bg-background p-8 sm:p-10 flex flex-col gap-6 hover:bg-muted/30 transition-all duration-500"
    >
      {/* Top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-highlight/0 to-transparent group-hover:via-highlight transition-all duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center border border-border bg-card group-hover:border-highlight/30 group-hover:bg-highlight/5 transition-all duration-300">
          <feature.icon className="h-5 w-5 text-foreground group-hover:text-highlight transition-colors duration-300" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          {feature.tag}
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="font-mono text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Bottom border highlight on hover */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-border group-hover:bg-highlight/30 transition-colors duration-500" />
    </motion.div>
  );
}

export function Features() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-32 px-6 border-t border-border relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-highlight/5 blur-[150px]" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="font-mono text-xs text-highlight uppercase tracking-widest">
            Features
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mt-4 text-balance">
            Everything you need to
            <br />
            <span className="text-muted-foreground">send at scale</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
