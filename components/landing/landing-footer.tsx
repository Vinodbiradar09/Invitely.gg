import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center border border-border bg-primary">
                <span className="font-mono text-xs font-bold text-primary-foreground">
                  I
                </span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">
                invitely.gg
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-xs">
              Send event invitations at scale. Built for organizers who value
              their time.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-widest">
              Product
            </span>
            <div className="flex flex-col gap-2">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Templates", href: "/templates" },
                { label: "Get started", href: "/login" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-widest">
              Legal
            </span>
            <div className="flex flex-col gap-2">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Separator className="bg-border" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-muted-foreground">
            © 2025 Invitely.gg · All rights reserved
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Built with Love
          </p>
        </div>
      </div>
    </footer>
  );
}
