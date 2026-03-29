"use client";

import { signOut } from "@/lib/auth/client/auth-client";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth/server/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface NavbarActionsProps {
  user: User;
}

export function NavbarActions({ user }: NavbarActionsProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push("/login");
    } catch {
      toast.error("failed to sign out");
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-muted-foreground hidden sm:block truncate max-w-40">
        {user.email}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs h-7 px-3 shrink-0"
          >
            {user.name?.split(" ")[0] ?? "Account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-mono text-xs w-48">
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-xs cursor-pointer text-destructive focus:text-destructive"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
