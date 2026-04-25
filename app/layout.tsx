import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invitely-gg.vercel.app"),
  title: {
    default: "Invitely.gg | Send Invitations at Scale, On Your Behalf",
    template: "%s | Invitely.gg",
  },
  description:
    "Stop manual emailing. Give us your list and we'll handle the rest. Professional, automated invitations sent on your behalf at scale.",
  keywords: [
    "invitation platform",
    "send invitations at scale",
    "automated email invitations",
    "bulk invitations",
    "email automation",
    "invitely",
  ],
  authors: [{ name: "Invitely.gg", url: "https://invitely-gg.vercel.app" }],
  creator: "Invitely.gg",
  applicationName: "Invitely.gg",
  icons: {
    icon: "/invitely-cropped.jpeg",
    shortcut: "/invitely-cropped.jpeg",
    apple: "/invitely-cropped.jpeg",
  },
  alternates: {
    canonical: "https://invitely-gg.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://invitely-gg.vercel.app",
    siteName: "Invitely.gg",
    title: "Invitely.gg | Send Invitations at Scale, On Your Behalf",
    description:
      "Stop manual emailing. Give us your list and we'll handle the rest. Professional, automated invitations sent on your behalf.",
    images: [
      {
        url: "https://invitely-gg.vercel.app/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Invitely.gg — Send Invitations at Scale, On Your Behalf",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@invitelygg",
    creator: "@invitelygg",
    title: "Invitely.gg | Send Invitations at Scale, On Your Behalf",
    description:
      "Stop manual emailing. Give us your list and we'll handle the rest.",
    images: [
      {
        url: "https://invitely-gg.vercel.app/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Invitely.gg — Send Invitations at Scale, On Your Behalf",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-mono", jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                fontFamily: "var(--font-mono)",
                borderRadius: "0px",
                fontSize: "13px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
