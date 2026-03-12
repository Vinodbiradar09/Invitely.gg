import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

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
          <Link
            href="https://github.com/Vinodbiradar09/Invitely.gg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="font-mono text-sm px-8 h-10 gap-2 text-muted-foreground hover:text-foreground"
            >
              <GitHubIcon />
              Open Source
            </Button>
          </Link>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          Free to use · No credit card · Google sign-in · Open source on GitHub
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
