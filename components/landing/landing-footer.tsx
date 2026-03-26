"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

export function LandingFooter() {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <footer ref={footerRef} className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
            {/* Brand section */}
            <div className="flex flex-col gap-5 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center border border-border bg-primary">
                  <span className="font-mono text-sm font-bold text-primary-foreground">
                    I
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold text-foreground">
                  invitely.gg
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                Send event invitations at scale. Built for organizers who value
                their time and want professional results.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="https://github.com/Vinodbiradar09/Invitely.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border hover:border-highlight/30 hover:bg-highlight/5 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-muted-foreground"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </Link>
                <Link
                  href="https://twitter.com/invitelygg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-border hover:border-highlight/30 hover:bg-highlight/5 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-muted-foreground"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Links sections */}
            <div className="flex flex-wrap gap-16 sm:gap-20">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-widest">
                  Product
                </span>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Features", href: "#features" },
                    { label: "How it works", href: "#how-it-works" },
                    { label: "Get started", href: "/login" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-widest">
                  Resources
                </span>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      label: "GitHub",
                      href: "https://github.com/Vinodbiradar09/Invitely.gg",
                    },
                    { label: "Documentation", href: "#" },
                    { label: "Changelog", href: "#" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-widest">
                  Legal
                </span>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Terms of Service", href: "/terms" },
                    { label: "Privacy Policy", href: "/privacy" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground/60">
              2025 Invitely.gg. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-highlight animate-pulse" />
              <p className="font-mono text-xs text-muted-foreground/60">
                Built with passion
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
