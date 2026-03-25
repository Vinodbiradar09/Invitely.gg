import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center border border-border bg-primary">
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

            <div className="flex gap-16">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-widest">
                  Product
                </span>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Features", href: "#features" },
                    { label: "How it works", href: "#how-it-works" },
                    { label: "Get started", href: "/login" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                    { label: "Terms", href: "/terms" },
                    { label: "Privacy", href: "/privacy" },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              © 2025 Invitely.gg
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Built with Love
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
