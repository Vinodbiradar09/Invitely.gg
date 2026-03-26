import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingNav() {
  return (
    <header className="border-b border-border bg-background px-6 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center border border-border">
          <Logo className="h-4 w-4" />
        </div>
        <span className="font-mono text-sm font-semibold tracking-tight">
          invitely.gg
        </span>
      </Link>

      <Link href="/login">
        <Button size="sm" className="font-mono text-xs h-8 px-5">
          Sign In
        </Button>
      </Link>
    </header>
  );
}
