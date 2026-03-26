import { LandingFooter } from "@/components/landing/landing-footer";
import { EmailPreview } from "@/components/landing/email-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";
import { LandingNav } from "@/components/landing/landing-nav";
import { BrandFooter } from "@/components/landing/brand-footer";
import { CTASection } from "@/components/landing/cta-section";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitely.gg | Send Invitations at Scale",
  description:
    "Create beautiful event invitations and send them to everyone at once. AI-powered personalization with real-time RSVP tracking. Free to use.",
  openGraph: {
    title: "Invitely.gg | Send Invitations at Scale",
    description:
      "Stop copy-pasting invites. Send to everyone in one go with AI-powered personalization and RSVP tracking.",
    url: "https://invitely.gg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitely.gg | Send Invitations at Scale",
    description:
      "Stop copy-pasting invites. Send to everyone in one go with AI-powered personalization and RSVP tracking.",
  },
};

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Noise overlay for premium texture */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
      
      <LandingNav />
      <Hero />
      <Features />
      <StatsSection />
      <HowItWorks />
      <EmailPreview />
      <CTASection />
      <BrandFooter />
      <LandingFooter />
    </main>
  );
}
