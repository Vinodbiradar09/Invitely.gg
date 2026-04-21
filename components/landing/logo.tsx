import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: number;
};

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`overflow-hidden border border-border bg-black shrink-0 ${className ?? ""}`}
    >
      <Image
        src="/invitely.jpeg"
        alt="Invitely logo"
        width={size}
        height={size}
        style={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: "100%",
        }}
        priority
      />
    </div>
  );
}
