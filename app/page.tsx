import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { EmailPreview } from "@/components/landing/email-preview";
import { AISection } from "@/components/landing/ai-section";
import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

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
    <div className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <HowItWorks />
      <Features />
      <EmailPreview />
      <AISection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
