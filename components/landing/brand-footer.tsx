"use client";

import { animate, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function BrandFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const svgViewBox = { width: 800, height: 160 };

  const x = useMotionValue(svgViewBox.width / 2);
  const y = useMotionValue(svgViewBox.height / 2);

  const springConfig = { damping: 200, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const loopingAnimX = useRef<ReturnType<typeof animate> | null>(null);
  const loopingAnimY = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    let initialAnimX: ReturnType<typeof animate> | undefined;
    let initialAnimY: ReturnType<typeof animate> | undefined;

    if (!isHovered) {
      const fromX = x.get();
      const toX = svgViewBox.width;
      const fullDurationX = 10;
      const durationX =
        fullDurationX * (Math.abs(toX - fromX) / svgViewBox.width);

      initialAnimX = animate(x, toX, {
        duration: durationX,
        ease: "linear",
        onComplete: () => {
          loopingAnimX.current = animate(x, [toX, 0], {
            duration: fullDurationX,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          });
        },
      });

      const fromY = y.get();
      const toY = svgViewBox.height * 0.8;
      const waypointA = svgViewBox.height * 0.8;
      const waypointB = svgViewBox.height * 0.2;
      const fullDurationY = 8;
      const durationY =
        fullDurationY *
        (Math.abs(toY - fromY) / Math.abs(waypointA - waypointB));

      initialAnimY = animate(y, toY, {
        duration: durationY,
        ease: "linear",
        onComplete: () => {
          loopingAnimY.current = animate(y, [toY, waypointB], {
            duration: fullDurationY,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          });
        },
      });
    }

    return () => {
      initialAnimX?.stop();
      initialAnimY?.stop();
      loopingAnimX.current?.stop();
      loopingAnimX.current = null;
      loopingAnimY.current?.stop();
      loopingAnimY.current = null;
    };
  }, [isHovered, x, y, svgViewBox.width, svgViewBox.height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const svgX = (mouseX / rect.width) * svgViewBox.width;
      const svgY = (mouseY / rect.height) * svgViewBox.height;

      x.set(svgX);
      y.set(svgY);
    }
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  return (
    <section className="py-16 px-6 border-t border-border overflow-hidden bg-muted/10">
      <div
        ref={containerRef}
        className="flex h-28 items-center justify-center overflow-hidden sm:h-36 lg:h-48 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-4xl"
        >
          {/* Base text with stroke */}
          <g stroke="hsl(var(--border))" strokeWidth="1" strokeLinejoin="round">
            {/* I */}
            <path
              d="M20 20 L20 140 M10 20 L30 20 M10 140 L30 140"
              fill="none"
            />
            {/* N */}
            <path d="M50 140 L50 20 L100 140 L100 20" fill="none" />
            {/* V */}
            <path d="M120 20 L145 140 L170 20" fill="none" />
            {/* I */}
            <path
              d="M190 20 L190 140 M180 20 L200 20 M180 140 L200 140"
              fill="none"
            />
            {/* T */}
            <path d="M220 20 L280 20 M250 20 L250 140" fill="none" />
            {/* E */}
            <path
              d="M300 20 L300 140 L360 140 M300 20 L360 20 M300 80 L350 80"
              fill="none"
            />
            {/* L */}
            <path d="M380 20 L380 140 L440 140" fill="none" />
            {/* Y */}
            <path d="M460 20 L490 80 L520 20 M490 80 L490 140" fill="none" />
            {/* . */}
            <circle cx="555" cy="130" r="10" fill="none" />
            {/* G */}
            <path
              d="M620 60 C620 30, 580 20, 565 40 C550 60, 550 100, 565 120 C580 140, 620 130, 620 100 L590 100"
              fill="none"
            />
            {/* G */}
            <path
              d="M700 60 C700 30, 660 20, 645 40 C630 60, 630 100, 645 120 C660 140, 700 130, 700 100 L670 100"
              fill="none"
            />
          </g>

          {/* Animated gradient mask */}
          <g mask="url(#invitely-stroke-mask)">
            <motion.circle
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              cx={smoothX}
              cy={smoothY}
              r="120"
              fill="url(#invitely-gradient)"
              filter="url(#invitely-blur)"
              overflow="visible"
            />
          </g>

          <defs>
            <filter
              id="invitely-blur"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
            </filter>

            <mask id="invitely-stroke-mask">
              <g
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              >
                {/* I */}
                <path d="M20 20 L20 140 M10 20 L30 20 M10 140 L30 140" />
                {/* N */}
                <path d="M50 140 L50 20 L100 140 L100 20" />
                {/* V */}
                <path d="M120 20 L145 140 L170 20" />
                {/* I */}
                <path d="M190 20 L190 140 M180 20 L200 20 M180 140 L200 140" />
                {/* T */}
                <path d="M220 20 L280 20 M250 20 L250 140" />
                {/* E */}
                <path d="M300 20 L300 140 L360 140 M300 20 L360 20 M300 80 L350 80" />
                {/* L */}
                <path d="M380 20 L380 140 L440 140" />
                {/* Y */}
                <path d="M460 20 L490 80 L520 20 M490 80 L490 140" />
                {/* . */}
                <circle cx="555" cy="130" r="10" />
                {/* G */}
                <path d="M620 60 C620 30, 580 20, 565 40 C550 60, 550 100, 565 120 C580 140, 620 130, 620 100 L590 100" />
                {/* G */}
                <path d="M700 60 C700 30, 660 20, 645 40 C630 60, 630 100, 645 120 C660 140, 700 130, 700 100 L670 100" />
              </g>
            </mask>

            {/* Updated gradient with highlight color */}
            <linearGradient
              id="invitely-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0" stopColor="oklch(0.65 0.18 145)" />
              <stop offset="0.33" stopColor="oklch(0.55 0.15 180)" />
              <stop offset="0.66" stopColor="oklch(0.6 0.16 200)" />
              <stop offset="1" stopColor="oklch(0.65 0.18 145)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
