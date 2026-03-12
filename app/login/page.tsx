import { LoginCard } from "@/components/login-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Invitely.gg",
  description: "Sign in to Invitely to start sending event invitations",
};

export const dynamic = "force-static";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <LoginCard />
      </div>
    </main>
  );
}
