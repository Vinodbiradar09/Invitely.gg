"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export function LandingNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center border border-border bg-primary group-hover:bg-highlight transition-colors duration-300">
            <span className="font-mono text-sm font-bold text-primary-foreground group-hover:text-background transition-colors duration-300">
              I
            </span>
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            invitely.gg
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            How it works
          </Link>
          <Link
            href="https://github.com/Vinodbiradar09/Invitely.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            GitHub
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block">
            <span className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
              Log in
            </span>
          </Link>
          <Link href="/login">
            <Button size="sm" className="font-mono text-xs h-9 px-5 gap-2">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
