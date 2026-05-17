// Generates all site imagery via Pollinations.ai (free, no key).
// Run: node scripts/generate-site-images.mjs
//
// Skips the home hero (kept as-is per owner instruction).
// Focus: lush flower + balloon decor for Indian events, premium / editorial.

import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const STYLE_BASE =
  'editorial cinematic photograph, premium Indian event decoration, deep saturated colours, soft golden hour light, rich shallow depth of field, professional wedding photography, magazine quality, ultra detailed, 8k';
const NEG = 'low quality, watermark, text, logo, blurry, distorted faces';

// ---- MANIFEST ---------------------------------------------------------------

const items = [
  // === SITE_IMAGES.hero (alt only — home hero is left alone) ===
  {
    out: 'images/marketing/hero-home-alt.jpg',
    w: 2070,
    h: 1380,
    prompt:
      'aerial cinematic view of a luxurious Indian wedding mandap built entirely from cascading marigold garlands, white roses and red carnations, hundreds of warm hanging bulbs, gold drapes, dusk lighting, opulent, dreamy bokeh background',
  },

  // === SITE_IMAGES.work / services (shared) — 7 unique editorial shots ===
  {
    out: 'images/marketing/work-01.jpg',
    w: 1974,
    h: 1316,
    prompt:
      'majestic mandap covered in fresh marigold, rose and orchid flowers, four pillars wrapped in floral garlands, soft warm fairy lights, deep red carpet aisle, Indian wedding, dusk',
  },
  {
    out: 'images/marketing/work-02.jpg',
    w: 1974,
    h: 1316,
    prompt:
      'spectacular balloon arch entrance for an Indian birthday party, pastel pink rose gold and white balloons cascading, fresh roses woven in, golden welcome sign, ornate, magical',
  },
  {
    out: 'images/marketing/work-03.jpg',
    w: 1974,
    h: 1316,
    prompt:
      'sangeet stage backdrop with sequin gold fans, fresh white jasmine and pink rose garlands, suspended floral chandeliers, warm spotlights, opulent Indian decor',
  },
  {
    out: 'images/marketing/work-04.jpg',
    w: 1974,
    h: 1316,
    prompt:
      'haldi ceremony set in a marigold-filled courtyard, swing decorated with yellow and white flowers, brass urns, turmeric petals scattered, sunny warm Indian decor',
  },
  {
    out: 'images/marketing/work-05.jpg',
    w: 2070,
    h: 1380,
    prompt:
      'grand reception stage in deep burgundy and gold, floral wall of red roses and white orchids, crystal chandeliers, velvet seating, cinematic Indian wedding reception',
  },
  {
    out: 'images/marketing/service-06.jpg',
    w: 2070,
    h: 1380,
    prompt:
      'corporate gala stage with elegant white orchid and lily floral wall, gold geometric backdrop, warm pin spots, sophisticated event design',
  },
  {
    out: 'images/marketing/service-07.jpg',
    w: 2069,
    h: 1379,
    prompt:
      'first birthday baby celebration stage in pastel mint and peach, balloon arches with helium clusters, plush teddy props, fresh pink rose garlands, dreamy soft lighting',
  },

  // === decor-pairs — 4 subjects × day/night = 8 ===
  // mandap 01 (4:5)
  {
    out: 'media/decor-pairs/mandap-01-day.jpg',
    w: 1600,
    h: 2000,
    prompt:
      'traditional Bengali mandap during daytime, four bamboo pillars wrapped in fresh marigold and tuberose garlands, white silk drapes, brass kalash, red carpet, lush courtyard background, soft natural noon light',
  },
  {
    out: 'media/decor-pairs/mandap-01-night.jpg',
    w: 1600,
    h: 2000,
    prompt:
      'same traditional Bengali mandap at night, four bamboo pillars wrapped in fresh marigold and tuberose, hundreds of warm fairy lights and brass diyas glowing, red carpet, magical golden nighttime ambience',
  },
  // stage 01 (16:9)
  {
    out: 'media/decor-pairs/stage-01-day.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'sangeet stage backdrop in daylight, fresh pink and white rose floral wall, gold latticework, suspended jasmine strings, polished wood platform, bright airy Indian event design',
  },
  {
    out: 'media/decor-pairs/stage-01-night.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'same sangeet stage at night, glowing fresh rose floral wall, gold latticework lit warm, suspended jasmine strings with fairy lights, pin spots, cinematic Indian evening event',
  },
  // haldi 01 (1:1)
  {
    out: 'media/decor-pairs/haldi-01-day.jpg',
    w: 1600,
    h: 1600,
    prompt:
      'haldi ceremony backdrop in daylight, swing covered in yellow marigold and white jasmine garlands, brass pots, sunny courtyard, fresh turmeric flowers, joyful warm Indian decor',
  },
  {
    out: 'media/decor-pairs/haldi-01-night.jpg',
    w: 1600,
    h: 1600,
    prompt:
      'same haldi ceremony set at night, swing covered in yellow marigold and white jasmine garlands lit by warm bulbs and fairy lights, brass diyas, golden glow, intimate Indian evening',
  },
  // bday 01 (3:2)
  {
    out: 'media/decor-pairs/bday-01-day.jpg',
    w: 1800,
    h: 1200,
    prompt:
      'milestone birthday party setup in daylight, lush pastel pink rose gold and white balloon arch, fresh rose and eucalyptus garlands, gold name signage, cake table, bright cheerful',
  },
  {
    out: 'media/decor-pairs/bday-01-night.jpg',
    w: 1800,
    h: 1200,
    prompt:
      'same milestone birthday party at night, balloon arch and fresh florals glowing under warm fairy lights, gold name signage lit, cake table with candles, magical evening ambience',
  },

  // === team portraits — 5 ===
  {
    out: 'images/team/founder.jpg',
    w: 1200,
    h: 1500,
    prompt:
      'professional editorial portrait of an Indian woman in her 40s, creative director of an event decoration studio in Siliguri, soft warm studio lighting, holding a marigold sprig, elegant kurta, confident gentle smile, magazine portrait',
  },
  {
    out: 'images/team/design-lead.jpg',
    w: 1200,
    h: 1500,
    prompt:
      'professional editorial portrait of an Indian woman in her 30s, design lead at an event company, sketching at a studio desk with fabric swatches and floral samples, warm natural light',
  },
  {
    out: 'images/team/head-florist.jpg',
    w: 1200,
    h: 1500,
    prompt:
      'editorial portrait of an Indian florist in his 30s arranging fresh marigold and jasmine garlands in a cool flower workshop, focused expression, warm rim light',
  },
  {
    out: 'images/team/production-manager.jpg',
    w: 1200,
    h: 1500,
    prompt:
      'editorial portrait of an Indian production manager in his 40s on a wedding decor site, holding a clipboard, hi-vis vest layered over kurta, mandap structure in soft background',
  },
  {
    out: 'images/team/client-care.jpg',
    w: 1200,
    h: 1500,
    prompt:
      'editorial portrait of a young Indian woman in her late 20s, client care lead at an event studio, warm friendly smile, headset, soft pastel office background',
  },

  // === about-hero founder portrait ===
  {
    out: 'images/about/founder-portrait.jpg',
    w: 1400,
    h: 1750,
    prompt:
      'editorial environmental portrait of an Indian woman creative director standing in front of a half-built marigold mandap, elegant ivory kurta, soft golden hour light, magazine cover quality',
  },

  // === locations heroes — 7 ===
  {
    out: 'images/locations/siliguri-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'cinematic wide shot of an opulent Indian wedding mandap built in a Siliguri banquet lawn, marigold and rose garlands cascading, warm bulb canopy, eastern Himalayan foothills horizon, dusk',
  },
  {
    out: 'images/locations/bagdogra-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'resort poolside Indian wedding reception near Bagdogra, floating floral candles in pool, balloon and fresh rose arches around deck, warm string lights, dusk',
  },
  {
    out: 'images/locations/darjeeling-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'intimate mountain wedding mandap in Darjeeling with Kanchenjunga snow peaks behind, simple white orchid and pine garlands, brass lanterns, golden morning light, cinematic',
  },
  {
    out: 'images/locations/kalimpong-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'Kalimpong garden wedding decor, orchid and gerbera floral arches, brass detailing, mountain backdrop, soft afternoon sun, lush green',
  },
  {
    out: 'images/locations/jalpaiguri-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'traditional Bengali wedding mandap in Jalpaiguri courtyard, red and white silk drapes, alpana floor art, brass kalash, marigold garlands, warm evening light',
  },
  {
    out: 'images/locations/gangtok-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'Sikkimese wedding decoration in Gangtok, prayer flag inspired drapery, brass butter lamps, white orchids and rhododendron garlands, monastery aesthetic, soft mountain light',
  },
  {
    out: 'images/locations/dooars-hero.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'tea garden wedding decor in the Dooars, wooden pergola covered in eucalyptus and white roses, hanging Edison bulbs, misty green tea rows backdrop, golden hour',
  },

  // === portfolio project covers — 6 ===
  {
    out: 'images/placeholders/PROJ-rinki-aditya-COVER.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'Bengali wedding mandap at golden hour, four bamboo pillars wrapped in fresh marigold and tuberose, red silk drapes, brass kalash, soft warm bulbs, dreamy cinematic',
  },
  {
    out: 'images/placeholders/PROJ-arpita-sanjay-COVER.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'lavish Marwari wedding baraat entrance, mirror-work canopy, saffron and ivory floral garlands, brass elephants, rose petal carpet, evening warm light, opulent',
  },
  {
    out: 'images/placeholders/PROJ-tea-garden-COVER.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'wooden arched mandap on a Dooars tea garden ridge at dawn, eucalyptus and white rose garlands, copper details, mist over tea rows, soft pastel cinematic light',
  },
  {
    out: 'images/placeholders/PROJ-darjeeling-COVER.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'intimate Darjeeling mountain wedding ceremony with Kanchenjunga behind, simple wooden arch with white orchids and pine, brass lanterns, golden morning light',
  },
  {
    out: 'images/placeholders/PROJ-corporate-gala-COVER.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'corporate gala stage in luxury hotel ballroom, modern gold geometric backdrop, white orchid and lily floral wall, pin spots, sophisticated minimal',
  },
  {
    out: 'images/placeholders/PROJ-bday-milestone-COVER.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'milestone birthday party stage, lush pastel pink rose gold and white balloon cascade, fresh rose and eucalyptus garlands, gold marquee letters, cinematic warm lighting',
  },

  // === generic placeholder fallback (used for all sub-image IDs) ===
  {
    out: 'images/placeholders/_fallback-3x2.jpg',
    w: 1800,
    h: 1200,
    prompt:
      'editorial Indian event decor detail shot, fresh marigold and rose garland close-up, soft golden hour light, dreamy bokeh, magazine quality',
  },
  {
    out: 'images/placeholders/_fallback-4x5.jpg',
    w: 1600,
    h: 2000,
    prompt:
      'editorial Indian wedding decor portrait orientation, mandap pillar wrapped in marigolds with brass lantern and red silk drape, golden hour glow',
  },
  {
    out: 'images/placeholders/_fallback-16x9.jpg',
    w: 1920,
    h: 1080,
    prompt:
      'cinematic wide Indian event decoration, sangeet stage with fresh floral wall and balloon arches at dusk, warm string lights, dreamy',
  },
  {
    out: 'images/placeholders/_fallback-1x1.jpg',
    w: 1600,
    h: 1600,
    prompt:
      'square editorial close-up of brass diya glowing among fresh marigold petals and jasmine on red silk, intimate warm light',
  },
  {
    out: 'images/placeholders/_fallback-9x16.jpg',
    w: 1080,
    h: 1920,
    prompt:
      'vertical editorial shot of a tall mandap pillar wrapped in cascading marigold and rose garlands with warm hanging bulbs, dusk',
  },

  // === map placeholder (contact) — kept SVG; skip ===
];

// ---- DOWNLOADER -------------------------------------------------------------

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOne(item, attempt = 1) {
  const params = new URLSearchParams({
    width: String(item.w),
    height: String(item.h),
    nologo: 'true',
    seed: String(Math.floor(Math.random() * 1_000_000)),
  });
  const fullPrompt = `${item.prompt}. Style: ${STYLE_BASE}. Avoid: ${NEG}.`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`;
  const res = await fetch(url, { headers: { Accept: 'image/*' }, signal: AbortSignal.timeout(180_000) });
  if (res.status === 402 || res.status === 429) {
    if (attempt > 6) throw new Error(`Rate-limited after ${attempt} tries`);
    const wait = 8000 * attempt;
    console.log(`  · rate-limited, waiting ${wait / 1000}s then retry…`);
    await sleep(wait);
    return fetchOne(item, attempt + 1);
  }
  if (!res.ok) {
    if (attempt < 3) {
      await sleep(3000);
      return fetchOne(item, attempt + 1);
    }
    throw new Error(`HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(PUBLIC, item.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  return { out: item.out, bytes: buf.length };
}

async function runSequential(items) {
  const results = [];
  const failures = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    process.stdout.write(`[${i + 1}/${items.length}] ${item.out} … `);
    try {
      const r = await fetchOne(item);
      results.push(r);
      console.log(`ok (${Math.round(r.bytes / 1024)} KB)`);
    } catch (e) {
      failures.push({ item, error: e.message });
      console.log(`FAIL — ${e.message}`);
    }
    await sleep(2500);
  }
  return { results, failures };
}

const skipExisting = process.argv.includes('--skip-existing');
const toRun = [];
for (const item of items) {
  const outPath = path.join(PUBLIC, item.out);
  if (skipExisting && (await exists(outPath))) {
    console.log(`· skip (exists) ${item.out}`);
    continue;
  }
  toRun.push(item);
}

console.log(`Generating ${toRun.length} images via Pollinations (sequential)…`);
const t0 = Date.now();
const { results, failures } = await runSequential(toRun);
console.log(`\nDone in ${Math.round((Date.now() - t0) / 1000)}s — ${results.length} ok, ${failures.length} failed.`);
if (failures.length) {
  console.log('Failures:');
  for (const f of failures) console.log(`  - ${f.item.out}: ${f.error}`);
  process.exit(1);
}
