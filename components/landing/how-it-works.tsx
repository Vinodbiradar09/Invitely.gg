"use client";

import { FolderOpen, PenTool, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Create Workspaces",
    description:
      "Organize contacts into groups — Family, Office, Friends. Add once, reuse forever across all your events.",
    icon: FolderOpen,
  },
  {
    number: "02",
    title: "Write Your Invite",
    description:
      "Type your message casually. AI tailors it into a professional invitation with personalized openings.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Send & Track",
    description:
      "Send to everyone at once. Watch responses come in live on your dashboard. Remind pending guests with one click.",
    icon: Rocket,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/8 bg-white/1">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-4">
            How it works
          </span>
          {/*<h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-balance">
            From list to sent
            <br />
            <span className="text-muted-foreground">in three steps.</span>
          </h2>*/}
        </div>

        <div className="relative">
          <div className="absolute top-10 left-8 right-8 h-px bg-white/6 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative flex flex-col items-center text-center gap-6"
              >
                <div className="relative flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center border border-white/8 bg-background relative z-10">
                    <step.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                    Step {step.number}
                  </span>
                </div>

                <div className="flex flex-col gap-3 max-w-xs">
                  <h3 className="font-mono text-base font-semibold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="font-mono text-sm text-muted-foreground/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
