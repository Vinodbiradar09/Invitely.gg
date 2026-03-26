"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

export function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 border-t border-border bg-muted/20 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-highlight/5 to-transparent" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-highlight/20 via-transparent to-highlight/20 blur-xl opacity-50" />

          <div className="relative border border-border bg-card px-8 py-20 sm:px-16 sm:py-24 flex flex-col items-center text-center gap-10">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-highlight/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-highlight/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-highlight/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-highlight/40" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-6 max-w-2xl"
            >
              <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                Stop copy-pasting.
                <br />
                <span className="text-muted-foreground">Start inviting.</span>
              </h2>
              <p className="font-mono text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                Invitely.gg handles the sending so you can focus on the event.
                Free to use, no credit card required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/login">
                <Button className="font-mono text-sm px-10 h-12 gap-2 group">
                  Get started free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4"
            >
              {[
                "5 workspaces",
                "25 members each",
                "Unlimited events",
                "Free forever",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-highlight" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {item}
                  </span>
                  {index < 3 && (
                    <span className="font-mono text-xs text-muted-foreground/30 hidden sm:inline">
                      /
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
