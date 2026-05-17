"use client";

import { ColdOpen } from "@/lib/cinematic/cold-open";

/**
 * ColdOpenMount — tiny client island that drops into app/(site)/layout.tsx.
 *
 * Why a separate component? Layouts in App Router are server components by
 * default. We don't want to convert the whole site layout to a client
 * component just to host the cold-open. This wrapper carries the "use client"
 * boundary so the server layout stays a server component.
 *
 * Behaviour gates (handled inside <ColdOpen />):
 *   - Plays only on first visit per session (sessionStorage flag).
 *   - Respects NEXT_PUBLIC_CINEMATIC_HERO — if the cinematic hero feature
 *     flag is off, the cold-open does not play either (they ship together).
 *
 * Integration hint for the main agent (do not modify layout files here):
 *
 *   import { ColdOpenMount } from "@/components/cinematic/cold-open-mount";
 *
 *   <LenisProvider>
 *     <ColdOpenMount />
 *     ...rest of layout
 *   </LenisProvider>
 *
 * The mount is rendered before the page tree but inside Lenis so smooth
 * scroll is already running by the time the cold-open ends.
 */
export function ColdOpenMount(): React.ReactElement | null {
  const enabled =
    process.env.NEXT_PUBLIC_CINEMATIC_HERO === "true" ||
    process.env.NEXT_PUBLIC_CINEMATIC_HERO === "1";

  if (!enabled) return null;
  return <ColdOpen />;
}
