import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <section className="relative pt-22 pb-20 px-6">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center gap-8">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
            <span className="h-1.25 w-1.25 rounded-full bg-current animate-[pulse_2.4s_ease-in-out_infinite]" />
            AI powered invitation platform
          </span>

          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight text-balance">
            Send <span className="text-muted-foreground">Invitations</span> At
            Scale
            <br />
            On Your
            <span className="text-muted-foreground"> Behalf.</span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Stop manual emailing. Give us your list, and we’ll handle the rest.
            Professional, automated, and sent on your behalf.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button className="font-mono text-sm px-6 h-10 gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link
              href="https://github.com/Vinodbiradar09/Invitely.gg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="font-mono text-sm px-6 h-10 gap-2 text-muted-foreground hover:text-foreground"
              >
                <GitHubIcon />
                Open Source
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-2xl border border-border bg-card mt-8">
            <div className="border-b border-border px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
                <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
                <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
              </div>
              <span className="font-mono text-xs text-muted-foreground ml-2">
                invitely.gg [event dashboard]
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { label: "Invited", value: "47" },
                { label: "Attending", value: "23" },
                { label: "Maybe", value: "8" },
                { label: "Pending", value: "16" },
              ].map(({ label, value }, index) => (
                <div
                  key={label}
                  className={`flex flex-col gap-1 p-4 sm:p-5 ${index % 2 !== 0 ? "border-l border-border" : ""} ${index >= 2 ? "border-t sm:border-t-0 border-border" : ""} ${index >= 1 ? "sm:border-l" : ""}`}
                >
                  <span className="font-mono text-xl sm:text-2xl font-semibold text-foreground">
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
      </div>
    </section>
  );
}
