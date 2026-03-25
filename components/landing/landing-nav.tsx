import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center border border-border bg-primary">
            <span className="font-mono text-sm font-bold text-primary-foreground">
              I
            </span>
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            invitely.gg
          </span>
        </Link>

        <Link href="/login">
          <Button size="sm" className="font-mono text-xs h-8 px-5">
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  );
}
