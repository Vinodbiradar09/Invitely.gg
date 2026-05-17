import { GrainBackdrop } from "@/components/landing/grain-backdrop";
import { EmailPreview } from "@/components/landing/email-preview";
import { BrandFooter } from "@/components/landing/brand-footer";
// import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNav } from "@/components/landing/landing-nav";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitely.gg | Send Invitations at Scale",
  description:
    "Create beautiful event invitations and send them to everyone at once. AI-powered, RSVP tracking included. Free to use.",
  openGraph: {
    title: "Invitely.gg | Send Invitations at Scale",
    description:
      "Stop copy-pasting invites. Send to everyone in one go with RSVP tracking.",
    url: "https://invitely.gg",
  },
};

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <GrainBackdrop />

      <div className="relative mx-auto max-w-5xl border border-white/10 overflow-hidden">
        <LandingNav />
        <Hero />
        <Features />
        {/*<HowItWorks />*/}
        <EmailPreview />
        <div className="border-t border-white/8">
          <BrandFooter />
        </div>
      </div>
    </main>
  );
}
