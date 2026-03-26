"use client";

import {
  Sparkles,
  Check,
  HelpCircle,
  Calendar,
  MapPin,
  Clock,
  X,
  Star,
  Reply,
  MoreHorizontal,
  Archive,
  Trash2,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function EmailPreview() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 border-t border-border relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-highlight/5 blur-[200px]" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col gap-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-highlight" />
              <span className="font-mono text-xs text-highlight uppercase tracking-widest">
                AI-Powered
              </span>
            </div>
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
              Write casually.
              <br />
              <span className="text-muted-foreground">Send professionally.</span>
            </h2>
            <p className="font-mono text-sm text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed">
              Type your message the way you&apos;d text a friend. Invitely&apos;s AI
              transforms it into a polished invitation that feels personal.
            </p>
          </motion.div>

          {/* Email preview window */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 50, scale: 0.98 }
            }
            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-highlight/10 via-transparent to-highlight/10 blur-2xl opacity-60" />

            <div className="relative border border-border bg-card overflow-hidden">
              {/* Browser chrome */}
              <div className="border-b border-border px-4 py-3 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 bg-destructive/60 hover:bg-destructive transition-colors cursor-pointer" />
                    <div className="h-3 w-3 bg-chart-4/60 hover:bg-chart-4 transition-colors cursor-pointer" />
                    <div className="h-3 w-3 bg-highlight/60 hover:bg-highlight transition-colors cursor-pointer" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-background/50 border border-border">
                    <svg
                      className="h-3 w-3 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="font-mono text-xs text-muted-foreground">
                      mail.google.com
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                  Preview
                </span>
              </div>

              {/* Email toolbar */}
              <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-background/50">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-muted transition-colors">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 hover:bg-muted transition-colors">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="h-4 w-px bg-border" />
                  <button className="p-2 hover:bg-muted transition-colors">
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground/60">
                    Just now
                  </span>
                </div>
              </div>

              {/* Email header */}
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center border border-border bg-primary shrink-0">
                      <span className="font-mono text-lg font-bold text-primary-foreground">
                        I
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          Invitely.gg
                        </span>
                        <span className="font-mono text-xs text-muted-foreground/60">
                          via invitely.gg
                        </span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        to me
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted transition-colors">
                      <Reply className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted transition-colors">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject line */}
              <div className="border-b border-border px-6 py-4 bg-muted/10">
                <span className="font-mono text-lg font-semibold text-foreground">
                  You&apos;re Invited: Birthday Celebration
                </span>
              </div>

              {/* Email body */}
              <div className="px-6 py-10 sm:px-10 sm:py-12">
                <div className="max-w-xl mx-auto flex flex-col gap-8">
                  {/* Greeting */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col gap-4"
                  >
                    <p className="font-mono text-base text-foreground">
                      Hi Shambavi,
                    </p>
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                      It&apos;s that time of year! You&apos;re invited to celebrate my
                      birthday this Saturday evening at my place.
                    </p>
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                      Dinner and drinks are on me, just bring yourself and good
                      energy. It&apos;s going to be a great night.
                    </p>
                  </motion.div>

                  {/* Event details card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="border border-border p-6 bg-muted/10"
                  >
                    <h4 className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                      Event Details
                    </h4>
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center gap-4 group">
                        <div className="flex h-10 w-10 items-center justify-center border border-border bg-background group-hover:border-highlight/30 transition-colors shrink-0">
                          <Calendar className="h-4 w-4 text-foreground group-hover:text-highlight transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-foreground">
                            Saturday, March 29th
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            Date
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="flex h-10 w-10 items-center justify-center border border-border bg-background group-hover:border-highlight/30 transition-colors shrink-0">
                          <Clock className="h-4 w-4 text-foreground group-hover:text-highlight transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-foreground">
                            7:00 PM onwards
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            Time
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="flex h-10 w-10 items-center justify-center border border-border bg-background group-hover:border-highlight/30 transition-colors shrink-0">
                          <MapPin className="h-4 w-4 text-foreground group-hover:text-highlight transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-foreground">
                            123 Main Street, Apartment 4B
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            Location
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* RSVP buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col gap-5 pt-2"
                  >
                    <p className="font-mono text-sm text-foreground font-medium">
                      Will you be joining us?
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="font-mono text-sm px-4 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 group">
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Yes</span>
                      </button>
                      <button className="font-mono text-sm px-4 py-4 border border-border bg-background text-muted-foreground hover:text-foreground hover:border-highlight/30 hover:bg-highlight/5 transition-all duration-300 flex items-center justify-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Maybe</span>
                      </button>
                      <button className="font-mono text-sm px-4 py-4 border border-border bg-background text-muted-foreground hover:text-foreground hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-300 flex items-center justify-center gap-2">
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">No</span>
                      </button>
                    </div>
                  </motion.div>

                  {/* Footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="pt-8 border-t border-border mt-4"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center border border-border bg-foreground">
                        <span className="font-mono text-[10px] font-bold text-background">
                          I
                        </span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        Sent via Invitely.gg
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-6"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <span className="font-mono text-xs text-muted-foreground/60 px-2">
              You always review before sending
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
