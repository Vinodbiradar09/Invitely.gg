import { LandingFooter } from "@/components/landing/landing-footer";
import { EmailPreview } from "@/components/landing/email-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNav } from "@/components/landing/landing-nav";
import { BrandFooter } from "@/components/landing/brand-footer";
import { CTASection } from "@/components/landing/cta-section";
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
    <main className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <EmailPreview />
      <CTASection />
      <BrandFooter />
      <LandingFooter />
    </main>
  );
}
