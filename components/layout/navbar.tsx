import { NavbarActions } from "@/components/layout/navbar-actions";
import { NavbarLinks } from "@/components/layout/navbar-links";
import type { User } from "@/lib/auth/server/auth";
import { Logo } from "../landing/logo";
import Link from "next/link";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/workspace" className="flex items-center gap-2 shrink-0">
            <div className="flex h-6 w-6 items-center justify-center border border-border bg-black">
              <Logo className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              invitely.gg
            </span>
          </Link>
          <NavbarLinks />
        </div>
        <NavbarActions user={user} />
      </div>
    </header>
  );
}
