import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Logo } from "@/components/landing/logo";
import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 px-6 h-14 flex items-center justify-between bg-background/80 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 group">
        <Logo size={28} />
        <span className="font-mono text-sm font-semibold tracking-tight text-foreground group-hover:text-muted-foreground transition-colors duration-300">
          Invitely.gg
        </span>
      </Link>
      <Link href="/login">
        <HoverBorderGradient
          containerClassName="rounded-none"
          className="rounded-none font-mono text-xs h-8 px-5 bg-black text-white flex items-center gap-2 cursor-pointer"
          as="button"
          duration={1.5}
        >
          Sign In
        </HoverBorderGradient>
      </Link>
    </header>
  );
}
