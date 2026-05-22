import type { ReactNode } from "react";
import { LenisProvider } from "@/lib/motion/lenis-provider";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { StickyWhatsApp } from "@/components/marketing/sticky-whatsapp";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { ButtonStyles } from "@/components/ui/button";
import { CursorProvider } from "@/components/cursor/cursor-context";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { FocusRing } from "@/components/microinteractions/focus-ring";
import { TransitionProvider } from "@/components/transitions/transition-provider";

type SiteLayoutProps = {
  children: ReactNode;
};

/**
 * (site) route-group layout — public marketing chrome.
 */
export default function SiteLayout({
  children,
}: SiteLayoutProps): React.ReactElement {
  return (
    <LenisProvider>
      <CursorProvider>
        <FocusRing />
        <CustomCursor />
        <ButtonStyles />
        <SkipToContent />
        <Header />
        <main id="main" className="relative min-h-screen">
          <TransitionProvider>{children}</TransitionProvider>
        </main>
        <Footer />
        <StickyWhatsApp />
        <GrainOverlay />
      </CursorProvider>
    </LenisProvider>
  );
}

/**
 * Global grain overlay (SIG-09).
 * Provides a tactile, cinematic texture to the whole site.
 */
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] mix-blend-multiply opacity-[0.04]"
    >
      <svg width="100%" height="100%" className="h-full w-full">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
