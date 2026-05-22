/**
 * Mock team data — founder + four team members.
 *
 * Replace with Payload `team` collection in Sprint 2.
 * Founder is the named `Person` in About-page JSON-LD (per docs/07-SEO §7.6).
 */
import { pickSeedImage, SEED_TEAM } from "@/lib/media/seed-images";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** Single-line bio for the grid card. */
  bio: string;
  /** Optional longer bio rendered on hover / dedicated bio page. */
  longBio?: string;
  imageUrl: string;
  /** Public profiles for `Person.sameAs`. */
  sameAs?: ReadonlyArray<string>;
  /** Marks the founder for schema + visual hierarchy. */
  isFounder?: boolean;
}

const TEAM: ReadonlyArray<TeamMember> = [
  {
    slug: "founder",
    name: "TODO: Founder Name",
    role: "Founder & Creative Director",
    bio: "Designs every event personally. Twelve years on weddings across Bengal, Sikkim and the Dooars.",
    longBio:
      "TODO: founder long-form bio from CMS — keep to 60–90 words, anchored on training, philosophy, signature projects.",
    imageUrl: pickSeedImage(SEED_TEAM, "founder"),
    sameAs: [
      "https://instagram.com/siligurievent",
      "https://www.youtube.com/@siligurievent",
    ],
    isFounder: true,
  },
  {
    slug: "design-lead",
    name: "TODO: Design Lead",
    role: "Design Lead",
    bio: "Translates client briefs into mood boards, palettes and the full visual treatment.",
    imageUrl: pickSeedImage(SEED_TEAM, "design-lead"),
  },
  {
    slug: "florist",
    name: "TODO: Head Florist",
    role: "Head Florist",
    bio: "Sources flowers from local farms and runs the cold-room. Specialises in marigold and jasmine work.",
    imageUrl: pickSeedImage(SEED_TEAM, "florist"),
  },
  {
    slug: "production",
    name: "TODO: Production Manager",
    role: "Production Manager",
    bio: "Runs site builds, lighting rigs and the crew. Keeps every event on schedule.",
    imageUrl: pickSeedImage(SEED_TEAM, "production"),
  },
  {
    slug: "client-care",
    name: "TODO: Client Care Lead",
    role: "Client Care",
    bio: "Your first reply on WhatsApp and your guide through every meeting until handover.",
    imageUrl: pickSeedImage(SEED_TEAM, "client-care"),
  },
];

export function getTeam(): ReadonlyArray<TeamMember> {
  return TEAM;
}

export function getFounder(): TeamMember {
  const f = TEAM.find((m) => m.isFounder);
  if (!f) {
    // Defensive: stub always contains a founder, but keeps TS happy
    // and surfaces drift if seed data ever loses one.
    throw new Error("Team stub missing a founder entry.");
  }
  return f;
}
