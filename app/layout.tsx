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
    "Editorial event decoration in Siliguri & North Bengal. Weddings, receptions, sangeet, haldi, corporate, festival pujas — designed like film stills.",
  applicationName: "Siligurievent",
  authors: [{ name: "Siligurievent" }],
  creator: "Siligurievent",
  publisher: "Siligurievent",
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Siligurievent",
    title: "Siligurievent — Cinematic event decor in North Bengal",
    description:
      "Editorial event decoration in Siliguri & North Bengal. Weddings, receptions, sangeet, haldi, corporate, festival pujas.",
    url: "https://siligurievent.com",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siligurievent — Cinematic event decor in North Bengal",
    description:
      "Editorial event decoration in Siliguri & North Bengal. Weddings, receptions, sangeet, haldi, corporate, festival pujas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
