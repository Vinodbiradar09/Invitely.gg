import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-4xl">
        <Badge
          variant="outline"
          className="font-mono text-xs px-3 py-1 border-border text-muted-foreground gap-2 flex items-center"
        >
          <Sparkles className="h-3 w-3" />
          AI powered invitation platform
        </Badge>

        <div className="flex flex-col gap-4">
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
            Send invitations
            <br />
            <span className="text-muted-foreground">on your behalf.</span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Invitely.gg lets you create beautiful event invitations and send
            them to everyone at once no copy-pasting, no manual emails. Just
            write once, send to all.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/login">
            <Button className="font-mono text-sm px-8 h-10 gap-2">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              variant="outline"
              className="font-mono text-sm px-8 h-10 text-muted-foreground"
            >
              See how it works
            </Button>
          </Link>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          Free to use · No credit card · Google sign-in
        </p>

        <div className="w-full max-w-2xl border border-border bg-card mt-4">
          <div className="border-b border-border px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
              <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
              <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
            </div>
            <span className="font-mono text-xs text-muted-foreground ml-2">
              invitely.gg — event dashboard
            </span>
          </div>
          <div className="px-4 py-3 grid grid-cols-4 gap-4 divide-x divide-border">
            {[
              { label: "Invited", value: "47" },
              { label: "Attending", value: "23" },
              { label: "Maybe", value: "8" },
              { label: "Pending", value: "16" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 px-4 first:pl-0"
              >
                <span className="font-mono text-lg font-semibold text-foreground">
                  {value}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
