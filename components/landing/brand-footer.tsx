"use client";
import { animate, motion, useMotionValue, useSpring } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

const BrandFooter = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const svgViewBox = { width: 932, height: 213 };

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
      const svgX = ((e.clientX - rect.left) / rect.width) * svgViewBox.width;
      const svgY = ((e.clientY - rect.top) / rect.height) * svgViewBox.height;
      x.set(svgX);
      y.set(svgY);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex h-32.5 items-center overflow-hidden px-4 sm:h-auto sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      <svg
        width="100%"
        height="213"
        viewBox="0 0 932 213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#2C2C2C" strokeLinejoin="round">
          <g transform="translate(-1.0625, 0)">
            <path
              d="M33.375 43V171H14.0625V43H33.375Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M40 36H21L13.5 42.5H34M40 36L34 42.5M40 36V164L34 171.5V42.5" />
          </g>
          <g transform="translate(10.696, 0)">
            <path
              d="M164.813 43V171H147.062L82 77.125H80.8125V171H61.5V43H79.375L144.5 137H145.687V43H164.813Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M87 35H68L61 42.5H79.5L87 35ZM87 35L145.5 121" />
            <path d="M81 171.5L89 165V88" />
            <path d="M145 42.5L151 35H172M172 35L165.5 42.5M172 35V166L165 171.5" />
          </g>
          <g transform="translate(32.096, 0)">
            <path
              d="M204.172 43L239.797 147.25H241.234L276.859 43H297.734L251.672 171H229.359L183.297 43H204.172Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M182.5 42.5L189 35H211.5M211.5 35L204.5 42.5M211.5 35L245.5 134M276.5 42.5L283 35H307.5M307.5 35L298.5 42.5M307.5 35L261 166L252 171.5" />
          </g>
          <g transform="translate(-75.411, 0)">
            <path
              d="M464.438 43V171H445.125V43H464.438Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M470.5 36H451.5L444.618 42.5H465M470.5 36L465 42.5M470.5 36V164L465 171.5V42.5" />
          </g>
          <g transform="translate(74.911, 0)">
            <path
              d="M354 43H454V59.625H413.656V171H394.344V59.625H354Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M461.266 35.5H360.516L353.516 42.5H454.266M461.266 35.5L454.266 42.5M461.266 35.5V53L454.266 59.625V42.5" />
            <path d="M420.281 59.625V164L413.656 171.5" />
          </g>
          <g transform="translate(-53.19, 0)">
            <path
              d="M621.984 171V43H702.234V59.625H641.297V98.625H698.047V115.187H641.297V154.375H702.984V171H621.984Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M709.5 35.5H628.5L621.5 42.5H702.5M709.5 35.5L702.5 42.5M709.5 35.5V53L702.5 60V42.5M649 115.5V147M649 147H710.5M649 147L642 154M710.5 147L703.5 154M710.5 147V164.5L703.5 172M649 60V91M649 91L641.5 98.5M649 91H705.5M705.5 91L698.5 98.5M705.5 91V108.5L698.5 116" />
          </g>
          <g transform="translate(-38.353, 0)">
            <path
              d="M728.031 171V43H747.344V154.375H805.344V171H728.031Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M727.5 42.5L734.5 35.5H755M755 35.5L748 42.5M755 35.5V147M755 147L748 154M755 147H813M813 147L805.5 154.5M813 147V164.5L806 171.5" />
          </g>
          <g transform="translate(-35, 0)">
            <path
              d="M808.047 43H829.984L863.422 101.187H864.797L898.234 43H920.172L873.734 120.75V171H854.484V120.75L808.047 43Z"
              fill="url(#text-gradient)"
              stroke="#2C2C2C"
            />
            <path d="M807 42.5L814 35.5H837M837 35.5L830 42.5M837 35.5L869.5 91.5M898 42.5L907.5 35.5H931.5M931.5 35.5L921 42.5M931.5 35.5L881.5 120.5V164.5L874.5 171.5" />
          </g>
        </g>

        <g mask="url(#stroke-mask)">
          <motion.circle
            animate={{ rotate: 360 }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            }}
            cx={smoothX}
            cy={smoothY}
            r="90"
            fill="url(#circle-rgb-gradient)"
            filter="url(#blur-filter)"
            overflow="visible"
          />
        </g>

        <defs>
          <filter id="blur-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </filter>
          <mask id="stroke-mask">
            <g stroke="white" strokeLinejoin="round" fill="none" opacity="0.6">
              <g transform="translate(-1.0625, 0)">
                <path d="M33.375 43V171H14.0625V43H33.375Z" />
                <path d="M40 36H21L13.5 42.5H34M40 36L34 42.5M40 36V164L34 171.5V42.5" />
              </g>
              <g transform="translate(10.696, 0)">
                {" "}
                {/* N mask */}{" "}
                <path d="M164.813 43V171H147.062L82 77.125H80.8125V171H61.5V43H79.375L144.5 137H145.687V43H164.813Z" />{" "}
                <path d="M87 35H68L61 42.5H79.5L87 35ZM87 35L145.5 121" />{" "}
                <path d="M81 171.5L89 165V88" />{" "}
                <path d="M145 42.5L151 35H172M172 35L165.5 42.5M172 35V166L165 171.5" />{" "}
              </g>
              <g transform="translate(32.096, 0)">
                {" "}
                {/* V mask */}{" "}
                <path d="M204.172 43L239.797 147.25H241.234L276.859 43H297.734L251.672 171H229.359L183.297 43H204.172Z" />{" "}
                <path d="M182.5 42.5L189 35H211.5M211.5 35L204.5 42.5M211.5 35L245.5 134M276.5 42.5L283 35H307.5M307.5 35L298.5 42.5M307.5 35L261 166L252 171.5" />{" "}
              </g>
              <g transform="translate(-75.411, 0)">
                {" "}
                {/* I2 mask */} <path d="M464.438 43V171H445.125V43H464.438Z" />{" "}
                <path d="M470.5 36H451.5L444.618 42.5H465M470.5 36L465 42.5M470.5 36V164L465 171.5V42.5" />{" "}
              </g>
              <g transform="translate(74.911, 0)">
                {" "}
                {/* T mask */}{" "}
                <path d="M354 43H454V59.625H413.656V171H394.344V59.625H354Z" />{" "}
                <path d="M461.266 35.5H360.516L353.516 42.5H454.266M461.266 35.5L454.266 42.5M461.266 35.5V53L454.266 59.625V42.5" />{" "}
                <path d="M420.281 59.625V164L413.656 171.5" />{" "}
              </g>
              <g transform="translate(-53.19, 0)">
                {" "}
                {/* E mask */}{" "}
                <path d="M621.984 171V43H702.234V59.625H641.297V98.625H698.047V115.187H641.297V154.375H702.984V171H621.984Z" />{" "}
                <path d="M709.5 35.5H628.5L621.5 42.5H702.5M709.5 35.5L702.5 42.5M709.5 35.5V53L702.5 60V42.5M649 115.5V147M649 147H710.5M649 147L642 154M710.5 147L703.5 154M710.5 147V164.5L703.5 172M649 60V91M649 91L641.5 98.5M649 91H705.5M705.5 91L698.5 98.5M705.5 91V108.5L698.5 116" />{" "}
              </g>
              <g transform="translate(-38.353, 0)">
                {" "}
                {/* L mask */}{" "}
                <path d="M728.031 171V43H747.344V154.375H805.344V171H728.031Z" />{" "}
                <path d="M727.5 42.5L734.5 35.5H755M755 35.5L748 42.5M755 35.5V147M755 147L748 154M755 147H813M813 147L805.5 154.5M813 147V164.5L806 171.5" />{" "}
              </g>
              <g transform="translate(-35, 0)">
                {" "}
                {/* Y mask — tightened */}{" "}
                <path d="M808.047 43H829.984L863.422 101.187H864.797L898.234 43H920.172L873.734 120.75V171H854.484V120.75L808.047 43Z" />{" "}
                <path d="M807 42.5L814 35.5H837M837 35.5L830 42.5M837 35.5L869.5 91.5M898 42.5L907.5 35.5H931.5M931.5 35.5L921 42.5M931.5 35.5L881.5 120.5V164.5L874.5 171.5" />{" "}
              </g>
            </g>
          </mask>
          <linearGradient
            id="text-gradient"
            x1="466"
            y1="0"
            x2="466"
            y2="171"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2C2C2C" stopOpacity="0" />
            <stop offset="1" stopColor="#2C2C2C" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="circle-rgb-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#06b6d4" />
            <stop offset="0.2" stopColor="#818cf8" />
            <stop offset="0.4" stopColor="#a78bfa" />
            <stop offset="0.55" stopColor="#ec4899" />
            <stop offset="0.75" stopColor="#f97316" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export { BrandFooter };
