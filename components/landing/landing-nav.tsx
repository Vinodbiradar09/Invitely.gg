import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center border border-border bg-primary">
            <span className="font-mono text-xs font-bold text-primary-foreground">
              I
            </span>
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            invitely.gg
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link href="/login">
            <Button size="sm" className="font-mono text-xs h-7 px-4">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
