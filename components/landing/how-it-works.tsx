"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { FolderPlus, PenLine, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FolderPlus,
    title: "Create Workspaces",
    description:
      "Organize your contacts into smart groups. Family, Office, Friends, create once and reuse for every event. Import from CSV or add manually.",
    details: ["Unlimited contacts", "CSV import", "Smart grouping"],
  },
  {
    number: "02",
    icon: PenLine,
    title: "Write Your Invite",
    description:
      "Type your message naturally. Our AI transforms casual text into polished, personalized invitations while keeping your authentic voice.",
    details: ["AI enhancement", "Personal tone", "Preview & edit"],
  },
  {
    number: "03",
    icon: Rocket,
    title: "Send & Track",
    description:
      "Launch your invitations to everyone at once. Watch RSVPs roll in live on your dashboard and send reminders with a single click.",
    details: ["Instant delivery", "Live tracking", "One-click reminders"],
  },
];

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      {/* Connection line */}
      {!isLast && (
        <div className="hidden lg:block absolute top-12 left-full w-full h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-px bg-gradient-to-r from-border via-highlight/40 to-border origin-left"
          />
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* Number and icon */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="font-mono text-7xl sm:text-8xl font-bold text-muted/30 select-none">
              {step.number}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center border border-border bg-card">
                <step.icon className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 max-w-sm">
          <h3 className="font-mono text-xl font-semibold text-foreground">
            {step.title}
          </h3>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Details list */}
          <div className="flex flex-wrap gap-2 pt-2">
            {step.details.map((detail) => (
              <span
                key={detail}
                className="font-mono text-[10px] px-3 py-1.5 border border-border bg-muted/30 text-muted-foreground uppercase tracking-wide"
              >
                {detail}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="py-32 px-6 border-t border-border bg-muted/20 relative overflow-hidden"
    >
      {/* Subtle gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <span className="font-mono text-xs text-highlight uppercase tracking-widest">
            How it works
          </span>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mt-4">
            Three steps to launch
          </h2>
          <p className="font-mono text-sm text-muted-foreground mt-4 max-w-md mx-auto">
            From contact list to sent invitations in under two minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
