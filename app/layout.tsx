import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://siligurievent.com"),
  title: {
    default: "Siligurievent — Cinematic event decor in North Bengal",
    template: "%s · Siligurievent",
  },
  description:
    "Wedding, balloon and event decoration in Siliguri & North Bengal. Weddings, receptions, sangeet, haldi, birthdays, corporate and festival pujas — designed like film stills.",
  applicationName: "Siligurievent",
  authors: [{ name: "Siligurievent" }],
  creator: "Siligurievent",
  publisher: "Siligurievent",
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Siligurievent",
    title: "Siligurievent — Wedding, balloon & event decoration in Siliguri",
    description:
      "Wedding, balloon and event decoration in Siliguri & North Bengal. Weddings, receptions, sangeet, haldi, birthdays, corporate and festival pujas.",
    url: "https://siligurievent.com",
    locale: "en_IN",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Siligurievent — wedding, balloon and event decoration in Siliguri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siligurievent — Wedding, balloon & event decoration in Siliguri",
    description:
      "Wedding, balloon and event decoration in Siliguri & North Bengal. Weddings, receptions, sangeet, haldi, birthdays, corporate and festival pujas.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Paste the Google Search Console verification code into
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (Vercel env) to verify ownership.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0B08" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" data-theme="light" className={fontVariables}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
