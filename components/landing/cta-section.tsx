import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="border border-border px-8 py-16 flex flex-col items-center text-center gap-8 relative overflow-hidden">
          <span
            className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 font-mono text-[180px] font-bold text-border/30 select-none leading-none hidden sm:block"
            aria-hidden
          >
            .gg
          </span>
          <div className="flex flex-col gap-4 relative z-10 max-w-xl">
            <h2 className="font-mono text-2xl sm:text-4xl font-bold text-foreground leading-tight">
              Stop copy-pasting.
              <br />
              Start inviting.
            </h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Invitely.gg handles the sending so you can focus on the event.
              Free to use, no credit card required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
            <Link href="/login">
              <Button className="font-mono text-sm px-10 h-10 gap-2">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="font-mono text-xs text-muted-foreground relative z-10">
            5 workspaces · 25 members each · 125 emails per event · Free forever
          </p>
        </div>
      </div>
    </section>
  );
}
