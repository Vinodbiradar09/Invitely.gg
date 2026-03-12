"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { href: "/workspace", label: "Workspaces" },
  { href: "/events", label: "Events" },
];

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ href, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`font-mono text-xs px-3 py-1.5 transition-colors ${
              isActive
                ? "text-foreground bg-muted/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
