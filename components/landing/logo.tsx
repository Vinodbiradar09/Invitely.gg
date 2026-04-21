import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: number;
};

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        borderRadius: 6,
        position: "relative",
      }}
      className={className}
    >
      <Image
        src="/invitely.jpeg"
        alt="Invitely logo"
        width={size * 2}
        height={size * 2}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1.5)",
          transformOrigin: "center",
        }}
        priority
      />
    </div>
  );
}
