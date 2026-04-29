"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

function ScannedImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <div
      ref={ref}
      className="relative border border-white/8 bg-[#050505] overflow-hidden w-full"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto block"
        priority
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-[#050505] z-10 pointer-events-none"
        initial={{ height: "100%" }}
        animate={inView ? { height: "0%" } : { height: "100%" }}
        transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
      />
    </div>
  );
}

function StepContent({
  n,
  title,
  description,
  align = "left",
}: {
  n: string;
  title: string;
  description: string;
  align?: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`flex flex-col gap-1.5 ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/20">
        Step {n}
      </span>
      <h3 className="font-mono text-base font-bold text-foreground tracking-tight leading-snug">
        {title}
      </h3>
      <p className="font-mono text-xs text-muted-foreground/50 leading-relaxed max-w-55">
        {description}
      </p>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/8">
      <div className="px-6 pt-24 pb-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-5"
        >
          How it works
        </motion.span>
      </div>

      <div className="px-6 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col gap-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-12 items-start">
            <div className="lg:pt-2">
              <StepContent
                n="01"
                title="Create Workspaces"
                description="Organize contacts into groups — Family, Office, Friends. Add Members once, reuse forever."
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <ScannedImage
                src="/members.jpeg"
                alt="Add members modal showing Family workspace"
                width={900}
                height={790}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className=""
            >
              <ScannedImage
                src="/ai3.jpeg"
                alt="AI writing assistant turning casual text into a professional invitation"
                width={1390}
                height={865}
              />
            </motion.div>

            <div className="lg:pt-2">
              <StepContent
                n="02"
                title="Write Your Invite"
                description="Type casually. AI turns it into a professional invite with personalized openings."
                align="left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 lg:gap-12 items-start">
            <div className="lg:pt-2">
              <StepContent
                n="03"
                title="Send & Track"
                description="Send to everyone at once. Watch responses come in live on your dashboard. Remind pending guests with one click."
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <ScannedImage
                src="/dash.jpeg"
                alt="RSVP tracking dashboard with guest list and statuses"
                width={1390}
                height={760}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
