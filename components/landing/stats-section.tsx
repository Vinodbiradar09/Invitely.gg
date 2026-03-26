"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const stats = [
  {
    value: "10K+",
    label: "Invitations Sent",
    description: "And counting every day",
  },
  {
    value: "98%",
    label: "Delivery Rate",
    description: "Industry-leading reliability",
  },
  {
    value: "2min",
    label: "Average Setup",
    description: "From signup to first send",
  },
  {
    value: "4.9/5",
    label: "User Rating",
    description: "Based on user feedback",
  },
];

export function StatsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 border-t border-border relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs text-highlight uppercase tracking-widest">
            By the numbers
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground mt-4">
            Trusted by organizers everywhere
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-background p-8 sm:p-10 flex flex-col gap-3 text-center group hover:bg-muted/30 transition-colors duration-300"
            >
              <span className="font-mono text-4xl sm:text-5xl font-bold text-foreground tabular-nums">
                {stat.value}
              </span>
              <span className="font-mono text-sm font-medium text-foreground">
                {stat.label}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {stat.description}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
