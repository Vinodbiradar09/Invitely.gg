type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-label="Invitely logo"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle
        cx="12"
        cy="12"
        r="6.8"
        stroke="currentColor"
        strokeWidth="1.25"
      />

      <g transform="translate(12 12) rotate(-40)">
        <rect
          x="-4.8"
          y="-5.4"
          width="1.65"
          height="10.8"
          rx="0.3"
          fill="currentColor"
          stroke="none"
        />

        <rect
          x="-1.55"
          y="-5.4"
          width="1.65"
          height="10.8"
          rx="0.3"
          fill="currentColor"
          stroke="none"
        />

        <rect
          x="1.7"
          y="-5.4"
          width="1.65"
          height="10.8"
          rx="0.3"
          fill="currentColor"
          stroke="none"
        />
      </g>
    </svg>
  );
}
