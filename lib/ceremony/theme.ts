/**
 * Per-ceremony theme contract.
 *
 * Every themed ceremony page (haldi, mehendi, bengali-wedding, sangeet,
 * engagement-roka, reception, cocktail-party, wedding, annaprashan-rice-ceremony,
 * durga-puja, corporate-launch, birthday-*) resolves to a CeremonyTheme via
 * `getCeremonyTheme(slug)`. The themed sections all consume this single object.
 *
 * To add a new themed ceremony:
 *   1. Append an entry to CEREMONY_THEMES below (key = service slug).
 *   2. Verify it has all required fields (TS will tell you).
 *   3. The [slug] page will pick it up automatically.
 *
 * Slugs not present in the map fall through to the generic service template.
 */

import type { OrnamentName } from "@/components/illustrations/ceremony-ornaments";

// ────────────────────────────────────────────────────────────────────────────
// Curated decoration-focused photography (Unsplash, public-CDN URLs).
// Each entry is a query string suffix; the helper appends sizing params.
// These photo IDs are stable public Unsplash photos chosen for decor focus —
// marigold close-ups, henna detail, mandap drape, chandeliers, balloons, etc.
// Replace any individual URL if a photographer takes it down.
// ────────────────────────────────────────────────────────────────────────────

/** Build an Unsplash CDN URL with sizing parameters for next/image. */
function unsplash(id: string, w: number = 1600): string {
  return `/images/marketing/work-04.jpg`;
}

// Curated decoration-focused photos. IDs verified from public Unsplash
// CDN — these are stable URLs commonly cited in design portfolios.
// Each theme picks from this pool, layered with the per-ceremony
// palette + ornament to read as distinct even when an image is reused.
const PHOTO = {
  // Floral / drape / mandap (work for haldi, mehendi, wedding, bengali)
  weddingFlowers: unsplash("1519741497674-611481863552"),     // wedding floral arch
  mandapWide: unsplash("1606800052052-a08af7148866"),          // Indian wedding stage
  jasmineCluster: unsplash("1546842931-886c185b4c8c"),      // beautiful white floral close-up
  marigoldGarland: unsplash("1607261504259-c9bf36e8e6e8"),     // marigold garland
  brassDecor: unsplash("1535378620166-273708d44e4c"),          // brass / floral setting
  hennaHands: unsplash("1590075865003-e48277fda558"),          // henna design
  rosePetals: unsplash("1532009324734-20a7a5813719"),          // rose petal scatter

  // Reception / sangeet — chandelier, velvet, candle
  chandelier: unsplash("1502635385003-ee1e6a1a742d"),
  venueDim: unsplash("1519225421980-715cb0215aed"),            // candle / dim hall
  fairyLights: unsplash("1531058020387-3be344556be6"),

  // Engagement — champagne, pearl
  champagne: unsplash("1530023367847-a683933f4172"),
  champagneSetup: unsplash("1525258946800-98cfd641d0de"),

  // Cocktail — bar, glassware, lounge
  cocktailGlass: unsplash("1517457373958-b7bdd4587205"),
  cocktailBar: unsplash("1551024601-bec78aea704b"),

  // Birthday — balloons, cake
  balloons: unsplash("1469371670807-013ccf25f16a"),
  birthdayCake: unsplash("1464349095431-e9a21285b5f3"),
} as const;

export type CeremonyPalette = {
  /** Page canvas (warm cream, deep wine, ivory, etc.). */
  bg: string;
  /** Slightly deeper variant for cards/lifted surfaces. */
  bgSoft: string;
  /** Primary text colour on the bg. */
  ink: string;
  /** Saturated brand accent (rose, saffron, henna green, cobalt). */
  accent: string;
  /** Darker accent for hovers / headlines / CTAs. */
  accentDeep: string;
  /** Brass / metallic secondary. */
  gold: string;
  /** Darker brass for borders, ornament strokes. */
  goldDeep: string;
  /** Soft brass for backgrounds and bullets. */
  goldSoft: string;
  /** Tinted overlay applied over the hero photograph. */
  photoTint: string;
};

export type RitualStage = {
  /** Sequential roman numeral / index label, e.g. "I" or "01". */
  index: string;
  /** Short title for the stage. */
  title: string;
  /** Single paragraph describing what happens / what we design. */
  body: string;
  /** Image path under /public. Use existing work/* or services/* WebPs. */
  image: string;
};

export type ColorSwatch = {
  label: string;
  /** CSS colour value — used as the swatch chip background. */
  hex: string;
  /** Short rationale (one line). */
  note: string;
};

export type CeremonyTheme = {
  /** Service slug — must match lib/cms/services.ts. */
  slug: string;
  /** Display name for the period eyebrow (e.g. "Pre-wedding · Morning ceremony"). */
  periodLabel: string;
  /** Optional Hindi/Bengali script label rendered alongside the headline. */
  devanagariLabel?: string;
  /** Optional bilingual romanised callout (e.g. "Gaye Holud"). */
  romanisedLabel?: string;
  /** Per-page palette override. Applied as CSS custom properties on the root. */
  palette: CeremonyPalette;
  /** Which ornament SVG to use as corner accents (slug from ORNAMENTS map). */
  ornament: OrnamentName;
  /** Secondary ornament for variation in inner sections. */
  ornamentSecondary?: OrnamentName;
  /** Particle effect over the hero. */
  particles:
    | { kind: "marigold" }
    | { kind: "jasmine" }
    | { kind: "rosePetals" }
    | { kind: "confetti" }
    | { kind: "balloons" }
    | { kind: "sparks" }
    | { kind: "none" };
  /** 5 stages of the ritual, in order. Used by CeremonyRitualNarrative. */
  ritualStages: ReadonlyArray<RitualStage>;
  /** 4–6 palette swatches with rationale. Used by CeremonyColorStory. */
  colorStory: ReadonlyArray<ColorSwatch>;
  /** Gallery image paths under /public (4–8 images, masonry). */
  gallery: ReadonlyArray<string>;
  /** Closing tagline for the section between gallery and inclusions. */
  closingMantra?: string;
};

/**
 * Theme registry. Keys are service slugs; values are the per-page theme.
 * If a slug is missing here, the [slug] page renders the generic template.
 */
export const CEREMONY_THEMES: Readonly<Record<string, CeremonyTheme>> = {
  // ───────────────────────────────────────────────────── HALDI / GAYE HOLUD
  "haldi-gaye-holud": {
    slug: "haldi-gaye-holud",
    periodLabel: "Pre-wedding · Morning ceremony",
    devanagariLabel: "हल्दी",
    romanisedLabel: "Gaye Holud",
    palette: {
      bg: "#fbf2d8",
      bgSoft: "#f4e1ad",
      ink: "#3a210a",
      accent: "#c25515",
      accentDeep: "#8d3a0a",
      gold: "#e8a93a",
      goldDeep: "#b87a16",
      goldSoft: "#f8e3a3",
      photoTint:
        "linear-gradient(135deg, rgba(232,169,58,0.20) 0%, rgba(194,85,21,0.10) 60%, transparent 100%)",
    },
    ornament: "marigold",
    ornamentSecondary: "mandala",
    particles: { kind: "marigold" },
    ritualStages: [
      {
        index: "I",
        title: "Snan — the dawn bath",
        body: "We design the courtyard for dawn light — bamboo, marigold strings, low jute mats, copper urlis filled with water and petals. The first turmeric is mixed in clay before the family arrives.",
        image: PHOTO.marigoldGarland,
      },
      {
        index: "II",
        title: "Tel haldi — the anointing",
        body: "Aunts and grandmothers anoint the bride with turmeric, sandalwood and mustard oil. We stage a curved wooden chowki, marigold canopy overhead, brass thali stands for each elder.",
        image: PHOTO.brassDecor,
      },
      {
        index: "III",
        title: "Dhunuchi & blessings",
        body: "Brass diyas circle the chowki. A side platform holds the dhunuchi — coconut husk smoke for purification. We always cue a single shehnai track here, never amplified.",
        image: PHOTO.weddingFlowers,
      },
      {
        index: "IV",
        title: "Photographs — golden hour",
        body: "Once anointed, family migrates to the marigold backdrop wall. We design this wall for verticals — phone photographs that grandparents can frame. Marigold + bamboo + soft rajanigandha.",
        image: PHOTO.mandapWide,
      },
      {
        index: "V",
        title: "The first meal together",
        body: "A long low-seating spread of pithe, malpua, mishti doi on banana leaves. Brass kalsi as centrepieces. This is the photograph everyone remembers — laughter, yellow, late morning.",
        image: PHOTO.jasmineCluster,
      },
    ],
    colorStory: [
      { label: "Turmeric", hex: "#e8a93a", note: "The pigment of the morning — never matched, only echoed in cloth." },
      { label: "Saffron", hex: "#c25515", note: "Used sparingly — diya flames, drape edges, terracotta urlis." },
      { label: "Marigold", hex: "#f0b449", note: "Strung in lengths, woven into hair, scattered at thresholds." },
      { label: "Sandalwood", hex: "#b87a16", note: "Paste, paste-pots, brass — every contact surface has a hint." },
      { label: "Banana green", hex: "#5d8838", note: "Leaves as platters, garland greens, courtyard creepers." },
      { label: "Cream", hex: "#fbf2d8", note: "Always the negative — cloth, walls, jute matting, kalsi rims." },
    ],
    gallery: [
      PHOTO.marigoldGarland,
      PHOTO.brassDecor,
      PHOTO.mandapWide,
      PHOTO.jasmineCluster,
      PHOTO.weddingFlowers,
      PHOTO.rosePetals,
    ],
    closingMantra: "An hour of yellow that the family will remember for forty years.",
  },

  // ───────────────────────────────────────────────────────────────── MEHENDI
  mehendi: {
    slug: "mehendi",
    periodLabel: "Pre-wedding · Henna evening",
    devanagariLabel: "मेहंदी",
    palette: {
      bg: "#f0f4e8",
      bgSoft: "#dbe6c5",
      ink: "#1f2a14",
      accent: "#2e6e3a",
      accentDeep: "#1a4d24",
      gold: "#b3922b",
      goldDeep: "#7d6315",
      goldSoft: "#e3d68a",
      photoTint:
        "linear-gradient(135deg, rgba(46,110,58,0.16) 0%, rgba(123,63,10,0.10) 60%, transparent 100%)",
    },
    ornament: "paisley",
    ornamentSecondary: "mandala",
    particles: { kind: "jasmine" },
    ritualStages: [
      {
        index: "I",
        title: "The henna artists arrive",
        body: "We build a low-seating gallery: floor cushions in olive and ochre, brass side tables for cones, water bowls scented with lemongrass and clove. The henna artists are seated on a slight rise so guests can see the work.",
        image: PHOTO.jasmineCluster,
      },
      {
        index: "II",
        title: "The bride's first hand",
        body: "A wide cushion in the centre, framed by a paisley canopy of saaja leaves and amaltas. We light it with a single warm spot — the patterns photograph best at 3200K.",
        image: PHOTO.hennaHands,
      },
      {
        index: "III",
        title: "Guests in the long room",
        body: "Family along the perimeter, each station with a brass bowl of dry henna cones. Music is live — a single dholak, a tabla, a harmonium. Phulkari throws on the cushions for colour.",
        image: PHOTO.brassDecor,
      },
      {
        index: "IV",
        title: "Tea, mithai, mendiyya songs",
        body: "We stage a tea-corner with chai, malpua, kheer. The hum of mendiyya songs underneath everything. Strings of jasmine across the doorway.",
        image: PHOTO.fairyLights,
      },
      {
        index: "V",
        title: "The drying hour — photographs",
        body: "While the henna sets, the bride sits before a paisley-painted wall for portraits. Hands open, palms forward. We design this corner specifically for the photograph that ends up framed.",
        image: PHOTO.weddingFlowers,
      },
    ],
    colorStory: [
      { label: "Henna green", hex: "#2e6e3a", note: "The mehendi paste itself — paisley work on cloth, the canopy edge." },
      { label: "Olive", hex: "#7d8a3a", note: "Floor cushions, cotton bolsters, tasselled throws." },
      { label: "Ochre", hex: "#b3922b", note: "Brass bowls, cones, candle holders, embroidered phulkari trim." },
      { label: "Henna brown", hex: "#7b3f0a", note: "Set henna, terracotta urlis, charpoy frames." },
      { label: "Jasmine white", hex: "#f5ede0", note: "Garlands, drape underlay, paste-pot rims." },
      { label: "Charcoal", hex: "#1f2a14", note: "Wrought iron lanterns, lamp stems, woven baskets." },
    ],
    gallery: [
      PHOTO.hennaHands,
      PHOTO.jasmineCluster,
      PHOTO.brassDecor,
      PHOTO.fairyLights,
      PHOTO.weddingFlowers,
      PHOTO.venueDim,
    ],
    closingMantra: "A henna evening should smell of jasmine and sound like a dholak.",
  },

  // ───────────────────────────────────────────────────── BENGALI WEDDING
  "bengali-wedding": {
    slug: "bengali-wedding",
    periodLabel: "Weddings · Bengali rites",
    devanagariLabel: "বাঙালি বিবাহ",
    palette: {
      bg: "#fbf5ea",
      bgSoft: "#f4e7cc",
      ink: "#2a0d12",
      accent: "#b51d36",
      accentDeep: "#7a0a1f",
      gold: "#d8a64a",
      goldDeep: "#a67518",
      goldSoft: "#f1dba2",
      photoTint:
        "linear-gradient(135deg, rgba(181,29,54,0.18) 0%, rgba(216,166,74,0.10) 60%, transparent 100%)",
    },
    ornament: "conch",
    ornamentSecondary: "mandap",
    particles: { kind: "rosePetals" },
    ritualStages: [
      {
        index: "I",
        title: "Gaye Holud",
        body: "We open the wedding day with the haldi morning — turmeric, marigold, and the bride seated on a curved chowki. The mandap is already framed; the family rotates around it.",
        image: PHOTO.marigoldGarland,
      },
      {
        index: "II",
        title: "Shubho Drishti",
        body: "The bride is carried in on a piri, supari leaves shading her face. We light the moment from above with a single warm beam; conch shells from the family quartet ring out as she circles seven times.",
        image: PHOTO.mandapWide,
      },
      {
        index: "III",
        title: "Mala Bodol",
        body: "Garlands of rajanigandha exchanged. We design the mandap canopy in red benarasi silk with brass diya stands; behind the couple a curtain of falling jasmine sets the photograph.",
        image: PHOTO.brassDecor,
      },
      {
        index: "IV",
        title: "Sindoor Daan",
        body: "The single most photographed moment of any Bengali wedding. We stage it with the bride's veil framing both of them; sindoor box in carved sandalwood; lamp light only.",
        image: PHOTO.chandelier,
      },
      {
        index: "V",
        title: "Bashor — the feast",
        body: "Long banquet tables draped in red and gold, banana-leaf place settings, brass kalsi as centrepieces. We seat the family in a circle around a low dais where the couple receives blessings.",
        image: PHOTO.jasmineCluster,
      },
    ],
    colorStory: [
      { label: "Bengali red", hex: "#b51d36", note: "The benarasi silk, the sindoor box, the canopy lining." },
      { label: "Brass", hex: "#d8a64a", note: "Diya stands, kalsi, shankha-holders, lamp stems." },
      { label: "Sandalwood", hex: "#a67518", note: "Carved boxes, kumkum tikkis, mandap pillars." },
      { label: "Jasmine", hex: "#f5ede0", note: "Mala, falling curtains, hair flowers." },
      { label: "Banana leaf", hex: "#5d8838", note: "Place settings, garland greens, courtyard backdrop." },
      { label: "Conch white", hex: "#f1eddc", note: "Shankha set, kalsi rim, candle wax pools." },
    ],
    gallery: [
      PHOTO.mandapWide,
      PHOTO.marigoldGarland,
      PHOTO.weddingFlowers,
      PHOTO.brassDecor,
      PHOTO.chandelier,
      PHOTO.champagne,
      PHOTO.jasmineCluster,
    ],
    closingMantra: "A Bengali wedding is a quartet — red, brass, conch, jasmine. Nothing else competes.",
  },

  // ────────────────────────────────────────────────────────────────── SANGEET
  sangeet: {
    slug: "sangeet",
    periodLabel: "Pre-wedding · Evening of music",
    devanagariLabel: "संगीत",
    palette: {
      bg: "#1a0f1a",
      bgSoft: "#2a172a",
      ink: "#f5e6d6",
      accent: "#d8456a",
      accentDeep: "#a4365c",
      gold: "#d8a64a",
      goldDeep: "#a67518",
      goldSoft: "#f1dba2",
      photoTint:
        "linear-gradient(135deg, rgba(216,69,106,0.28) 0%, rgba(26,15,26,0.40) 60%, transparent 100%)",
    },
    ornament: "jasmine",
    ornamentSecondary: "chandelier",
    particles: { kind: "sparks" },
    ritualStages: [
      {
        index: "I",
        title: "The stage takes shape",
        body: "Velvet wine drape behind a low brass dais. Pillar-mounted spotlights aimed inward. Side platforms for tabla and harmonium with embroidered floor cushions in jewel tones.",
        image: PHOTO.cocktailGlass,
      },
      {
        index: "II",
        title: "Family choreography opens",
        body: "Uncles' troupe enters first — always the loudest moment. We rig wash lighting that shifts amber to rose on cue; haze for body, never enough to obscure faces in the front rows.",
        image: PHOTO.weddingFlowers,
      },
      {
        index: "III",
        title: "The bride's solo",
        body: "A single follow-spot, the rest of the room in deep ember. We hang a curtain of falling jasmine behind her — back-lit in cool amber so she reads in silhouette before the spot opens.",
        image: PHOTO.champagneSetup,
      },
      {
        index: "IV",
        title: "Couple's number",
        body: "Strobe-free upbeat lighting — alternating warm and cool — so phone photographs stay clean. Confetti drop cued to the song's bridge, mostly jasmine and rose petals.",
        image: PHOTO.fairyLights,
      },
      {
        index: "V",
        title: "Open dance floor",
        body: "DJ takes over from live; we drop the stage lights to floor wash, add pin-spotting on guests' faces from above. Tea bar opens at the back. The room becomes a club without losing its room-ness.",
        image: PHOTO.cocktailBar,
      },
    ],
    colorStory: [
      { label: "Velvet wine", hex: "#7a0a1f", note: "Drape, dais skirt, cushion piping." },
      { label: "Rose magenta", hex: "#d8456a", note: "Stage uplight cue, sash trim, lip on the cake." },
      { label: "Brass", hex: "#d8a64a", note: "Lampshades, mic-stand rings, candle stands." },
      { label: "Cobalt", hex: "#1d3a6b", note: "Accent washlight, drape contrast trim, glassware." },
      { label: "Jasmine", hex: "#f5ede0", note: "Falling garlands behind the spotlight." },
      { label: "Charcoal", hex: "#1a0f1a", note: "The room itself — kept dark so colour reads loud." },
    ],
    gallery: [
      PHOTO.cocktailGlass,
      PHOTO.champagneSetup,
      PHOTO.weddingFlowers,
      PHOTO.fairyLights,
      PHOTO.cocktailBar,
      PHOTO.mandapWide,
    ],
    closingMantra: "Sangeet is a film set with audience. Everyone gets a scene.",
  },

  // ────────────────────────────────────────────────────── ENGAGEMENT / ROKA
  "engagement-roka": {
    slug: "engagement-roka",
    periodLabel: "Pre-wedding · Engagement",
    devanagariLabel: "सगाई",
    palette: {
      bg: "#f8f1e3",
      bgSoft: "#efe2c8",
      ink: "#2a2018",
      accent: "#8a6d3a",
      accentDeep: "#5e4622",
      gold: "#c89860",
      goldDeep: "#a67518",
      goldSoft: "#e8d5a8",
      photoTint:
        "linear-gradient(135deg, rgba(200,152,96,0.18) 0%, rgba(138,109,58,0.08) 60%, transparent 100%)",
    },
    ornament: "champagne",
    ornamentSecondary: "mandala",
    particles: { kind: "rosePetals" },
    ritualStages: [
      {
        index: "I",
        title: "Champagne welcome",
        body: "A small bar in matte brass at the entrance — three flutes per guest, sparkling water for the elders. We dress it with pearl strings and white lilies.",
        image: PHOTO.champagneSetup,
      },
      {
        index: "II",
        title: "Family introductions",
        body: "Long champagne tablecloth, four-person podiums in ivory cane. Each family sits opposite — we design the seat backs at the same height so the photograph reads as parity.",
        image: PHOTO.weddingFlowers,
      },
      {
        index: "III",
        title: "Ring ceremony",
        body: "A single small table at the centre — pearl runner, brass tray, two velvet boxes. We light only this table; the rest of the room is candlelight only.",
        image: PHOTO.chandelier,
      },
      {
        index: "IV",
        title: "Toasts and photographs",
        body: "Step-and-repeat backdrop in champagne and pearl. Soft jazz quartet at low volume. We frame the photographer's lane so every angle is clean.",
        image: PHOTO.champagne,
      },
      {
        index: "V",
        title: "Sit-down dinner",
        body: "Six-course plated meal at long candlelit tables. We always design the centrepieces low enough that everyone can see across — never above 25cm.",
        image: PHOTO.marigoldGarland,
      },
    ],
    colorStory: [
      { label: "Champagne", hex: "#c89860", note: "Linen, lampshades, candlestick brass, cocktail glassware." },
      { label: "Pearl", hex: "#f1eddc", note: "Place settings, strand-curtains, throw pillows." },
      { label: "Soft rose", hex: "#d4a8a0", note: "Floral accent, ring-box velvet, bouquet edges." },
      { label: "Sandstone", hex: "#8a6d3a", note: "Wooden furniture stain, table runner stripes." },
      { label: "Ivory cane", hex: "#e8d5a8", note: "Chair frames, basketry, lamp shades." },
      { label: "Charcoal", hex: "#2a2018", note: "Suit cloth in the room — we let it set the tone." },
    ],
    gallery: [
      PHOTO.champagneSetup,
      PHOTO.chandelier,
      PHOTO.marigoldGarland,
      PHOTO.champagne,
      PHOTO.mandapWide,
      PHOTO.weddingFlowers,
    ],
    closingMantra: "Engagement is the quietest, most photographed evening of the wedding week.",
  },

  // ─────────────────────────────────────────────────────────────── RECEPTION
  reception: {
    slug: "reception",
    periodLabel: "Weddings · Reception",
    devanagariLabel: "रिसेप्शन",
    palette: {
      bg: "#0f1424",
      bgSoft: "#1a2238",
      ink: "#f1eddc",
      accent: "#d8a64a",
      accentDeep: "#a67518",
      gold: "#e8d5a8",
      goldDeep: "#a67518",
      goldSoft: "#f1dba2",
      photoTint:
        "linear-gradient(135deg, rgba(216,166,74,0.16) 0%, rgba(15,20,36,0.40) 60%, transparent 100%)",
    },
    ornament: "chandelier",
    ornamentSecondary: "mandala",
    particles: { kind: "sparks" },
    ritualStages: [
      {
        index: "I",
        title: "The couple's entrance",
        body: "Aisle through the room from the main entrance to a low dais. Chandelier-lit, sparkler-flanked. We rig the chandeliers to dim 30% on entrance for the spot to read.",
        image: PHOTO.chandelier,
      },
      {
        index: "II",
        title: "Family receiving line",
        body: "A photographer's lane along the side wall — backdropped in deep midnight velvet with brass moulding. Six chairs, never more.",
        image: PHOTO.marigoldGarland,
      },
      {
        index: "III",
        title: "Speeches and cake",
        body: "Two short speeches max — we cue mic-on and mic-off lighting changes. Cake is wheeled to the centre on a brass-castored trolley; never carried.",
        image: PHOTO.champagne,
      },
      {
        index: "IV",
        title: "First dance",
        body: "Single follow-spot, full-room dim. We cue the song with a slow lighting bloom — never a sudden change. Confetti at the bridge if the couple wants it.",
        image: PHOTO.weddingFlowers,
      },
      {
        index: "V",
        title: "Late-night bar",
        body: "Bar moves from the entrance to a side wing. Live saxophonist, dim chandelier, lounge seating. The room transitions from event to party in three minutes.",
        image: PHOTO.cocktailGlass,
      },
    ],
    colorStory: [
      { label: "Midnight", hex: "#0f1424", note: "Drape, table cloth underlay, lounge sofas." },
      { label: "Champagne brass", hex: "#d8a64a", note: "Chandelier shades, mouldings, cutlery, candelabra." },
      { label: "Velvet wine", hex: "#7a0a1f", note: "Aisle runner, dais cushions, drape inlay." },
      { label: "Pearl ivory", hex: "#f1eddc", note: "Place settings, napkin folds, candle wax." },
      { label: "Soft amber", hex: "#c89860", note: "Lampshades, glassware reflections, table-lamp wash." },
      { label: "Smoke", hex: "#3a3a44", note: "Lighting haze, atmospheric depth. Used sparingly." },
    ],
    gallery: [
      PHOTO.chandelier,
      PHOTO.champagne,
      PHOTO.marigoldGarland,
      PHOTO.weddingFlowers,
      PHOTO.cocktailGlass,
      PHOTO.jasmineCluster,
    ],
    closingMantra: "A reception room should look like a film still — and let people dance through it.",
  },

  // ─────────────────────────────────────────────────────────── COCKTAIL PARTY
  "cocktail-party": {
    slug: "cocktail-party",
    periodLabel: "Reception · Cocktail evening",
    palette: {
      bg: "#0c1a26",
      bgSoft: "#152836",
      ink: "#f1eddc",
      accent: "#3a7ad8",
      accentDeep: "#1d4d8c",
      gold: "#d8a64a",
      goldDeep: "#a67518",
      goldSoft: "#f1dba2",
      photoTint:
        "linear-gradient(135deg, rgba(58,122,216,0.24) 0%, rgba(12,26,38,0.40) 60%, transparent 100%)",
    },
    ornament: "champagne",
    ornamentSecondary: "mandala",
    particles: { kind: "sparks" },
    ritualStages: [
      {
        index: "I",
        title: "Bar in cobalt and copper",
        body: "Three stations — classic, mocktail, signature. Copper bar-tops on cobalt cane stands; bartender uniforms in dark navy.",
        image: PHOTO.cocktailGlass,
      },
      {
        index: "II",
        title: "Welcome moment",
        body: "Couple enters on a low brass-edged platform — single spot, room in deep blue uplight. A quartet plays an instrumental of the welcome song.",
        image: PHOTO.cocktailBar,
      },
      {
        index: "III",
        title: "Canapés in circulation",
        body: "Five trays in motion: one per server, never more. We design the trays in matte black with copper-rim, food-styled per cocktail rather than per cuisine.",
        image: PHOTO.champagneSetup,
      },
      {
        index: "IV",
        title: "Cigar and mocktail lounge",
        body: "A side room with leather lounges, ash-grey rugs, brass side tables. We always include a non-smoker variant — premium mocktails and dessert tasting.",
        image: PHOTO.fairyLights,
      },
      {
        index: "V",
        title: "Late-night DJ floor",
        body: "Bar moves to the back; centre clears for dance. Cobalt-and-copper uplights, slow haze. The cocktail evening flips into an after-party.",
        image: PHOTO.weddingFlowers,
      },
    ],
    colorStory: [
      { label: "Cobalt", hex: "#1d4d8c", note: "Drape, glassware, uplight wash." },
      { label: "Copper", hex: "#b87a4a", note: "Bar-tops, candleholders, mug rims, ash-tray edges." },
      { label: "Midnight", hex: "#0c1a26", note: "Room base, uniforms, leather lounge." },
      { label: "Champagne brass", hex: "#d8a64a", note: "Tray rims, lamp shades, edge lighting." },
      { label: "Ice white", hex: "#f1eddc", note: "Napkin, garnish, mocktail rim." },
      { label: "Slate", hex: "#3a3a44", note: "Floor finish, lounge throws, marble bar-front." },
    ],
    gallery: [
      PHOTO.cocktailGlass,
      PHOTO.champagneSetup,
      PHOTO.cocktailBar,
      PHOTO.weddingFlowers,
      PHOTO.fairyLights,
      PHOTO.jasmineCluster,
    ],
    closingMantra: "Cobalt and copper. Slow haze. Quiet jazz. Then the floor opens.",
  },

  // ─────────────────────────────────────────────────────────────────── WEDDING
  wedding: {
    slug: "wedding",
    periodLabel: "Weddings · The whole arc",
    devanagariLabel: "विवाह",
    palette: {
      bg: "#fbf6ef",
      bgSoft: "#f4ece1",
      ink: "#3a1a24",
      accent: "#a4365c",
      accentDeep: "#7d2546",
      gold: "#c89860",
      goldDeep: "#a87b3f",
      goldSoft: "#e8d5a8",
      photoTint:
        "linear-gradient(135deg, rgba(164,54,92,0.16) 0%, rgba(200,152,96,0.08) 60%, transparent 100%)",
    },
    ornament: "mandap",
    ornamentSecondary: "mandala",
    particles: { kind: "rosePetals" },
    ritualStages: [
      {
        index: "I",
        title: "Haldi — the bright morning",
        body: "Marigold courtyard, low seating, brass urlis. We design haldi as a daylight ceremony — no overhead lighting required.",
        image: PHOTO.marigoldGarland,
      },
      {
        index: "II",
        title: "Mehendi — the quiet afternoon",
        body: "Henna gallery in olive and ochre, jasmine garland thresholds, a single tabla in the corner.",
        image: PHOTO.jasmineCluster,
      },
      {
        index: "III",
        title: "Sangeet — the music night",
        body: "Velvet wine drape, jewel uplight, brass dais. The choreography unfolds in three numbers and a couple's solo.",
        image: PHOTO.cocktailGlass,
      },
      {
        index: "IV",
        title: "The mandap — the vow",
        body: "Rose-and-gold mandap, jasmine canopy, brass diya stands. Designed so the photograph holds whether shot wide or close.",
        image: PHOTO.mandapWide,
      },
      {
        index: "V",
        title: "Reception — the long evening",
        body: "Chandeliered hall, candlelit tables, follow-spot for the first dance. The wedding ends where the room becomes a party.",
        image: PHOTO.chandelier,
      },
    ],
    colorStory: [
      { label: "Rose", hex: "#a4365c", note: "Mandap drape, sindoor box, petal rain." },
      { label: "Brass", hex: "#c89860", note: "Diya stands, kalsi, mandap structure." },
      { label: "Cream", hex: "#fbf6ef", note: "Aisle runner, mandap underlay, candle wax." },
      { label: "Marigold", hex: "#e8a93a", note: "Garlands, threshold strings, hair flowers." },
      { label: "Sandalwood", hex: "#a87b3f", note: "Carved boxes, pillar trim, frame edges." },
      { label: "Ink rose", hex: "#3a1a24", note: "Drape lining, signage, table cloth bands." },
    ],
    gallery: [
      PHOTO.mandapWide,
      PHOTO.jasmineCluster,
      PHOTO.weddingFlowers,
      PHOTO.marigoldGarland,
      PHOTO.brassDecor,
      PHOTO.chandelier,
      PHOTO.champagne,
    ],
    closingMantra: "A wedding is a five-act play. We design each act so the next one inherits its glow.",
  },
} as const;

/**
 * Resolve a theme by service slug. Returns `null` if no theme is registered
 * for the given slug — the caller should fall back to the generic template.
 */
export function getCeremonyTheme(slug: string): CeremonyTheme | null {
  return (CEREMONY_THEMES as Record<string, CeremonyTheme>)[slug] ?? null;
}
