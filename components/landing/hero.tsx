"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-32 overflow-hidden">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-highlight/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-highlight/5 blur-[120px]" />
      
      {/* Fade overlays */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl w-full">
        <div className="flex flex-col items-center text-center gap-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-card/50 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-highlight opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-highlight" />
              </span>
              <span className="font-mono text-xs text-muted-foreground tracking-wide">
                AI-POWERED INVITATION PLATFORM
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <div className="flex flex-col gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] tracking-tight"
            >
              Send invitations
              <br />
              <span className="text-muted-foreground">at scale.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
            >
              Stop copy-pasting invites. Create once, send to everyone.
              <br className="hidden sm:block" />
              AI-powered personalization with real-time RSVP tracking.
            </motion.p>
          </div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/login">
              <Button className="font-mono text-sm px-8 h-12 gap-2 group">
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link
              href="https://github.com/Vinodbiradar09/Invitely.gg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="font-mono text-sm px-8 h-12 gap-2 text-muted-foreground hover:text-foreground group"
              >
                <GitHubIcon />
                View on GitHub
                <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mt-8"
          >
            <div className="relative">
              {/* Glow effect behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-highlight/20 via-transparent to-highlight/20 blur-xl opacity-50" />
              
              <div className="relative border border-border bg-card overflow-hidden">
                {/* Terminal header */}
                <div className="border-b border-border px-5 py-3 flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 bg-muted-foreground/30 hover:bg-destructive/70 transition-colors" />
                      <div className="h-3 w-3 bg-muted-foreground/30 hover:bg-chart-4/70 transition-colors" />
                      <div className="h-3 w-3 bg-muted-foreground/30 hover:bg-highlight/70 transition-colors" />
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <span className="font-mono text-xs text-muted-foreground">
                      invitely.gg/dashboard
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                    Live Preview
                  </span>
                </div>
                
                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
                  {[
                    { label: "Total Sent", value: "2,847", change: "+127 today" },
                    { label: "Attending", value: "1,423", change: "50% rate" },
                    { label: "Maybe", value: "389", change: "14% rate" },
                    { label: "Pending", value: "1,035", change: "36% rate" },
                  ].map(({ label, value, change }, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col gap-2 p-6 sm:p-8 group hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-mono text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
                        {value}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs text-muted-foreground">
                          {label}
                        </span>
                        <span className="font-mono text-[10px] text-highlight">
                          {change}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-mono text-xs text-muted-foreground/60 mt-4"
          >
            Free forever  /  No credit card required  /  5 workspaces included
          </motion.p>
        </div>
      </div>
    </section>
  );
}
