# GEMINI PROMPT BOOK — Siligurievent

A complete, ready-to-paste prompt library for generating every image on **siligurievent.com** using **Gemini Studio / Imagen 4 / Gemini 2.5 image mode**.

Brand: **Siligurievent** · Domain: **siligurievent.com** · Region: **North Bengal, India** · Voice: **cinematic editorial luxury with Indian soul**.

This document is self-contained. You do not need to read any other file to use it. Read Section 1 once, paste the **Universal Style Block (§2)** + **Negative Block (§3)** + **Hyper-Realism Specs (§4)** at the start of every prompt, then jump to the section you need.

---

## TABLE OF CONTENTS

1. How to use this book
2. Universal Style Block (paste into every prompt)
3. Negative-Prompt Block (paste into every prompt's "negative" field)
4. Hyper-Realism Technical Specs (append to every prompt)
5. Logo & brand marks (5 prompts)
6. Home page heroes — HERO-01 to HERO-07
7. Signature work cards — WORK-01 to WORK-05
8. Service tiles — SVC-01 to SVC-07
9. Service detail page heroes (templated for 19 services) + 4-image DETAIL set each
10. Case studies — 6 case studies, ~25 images each
11. Day↔Night decor switcher pairs — 10 compositions × 2 lighting states
12. About page — 16 images (founder, BTS, team)
13. Testimonials — 9 client portraits
14. Blog post covers — 6 launch posts
15. Location pages — 7 location heroes + venue shots
16. Decorative motifs (illustration-style)
17. 404 page art
18. Open Graph fallback image
19. Image-set selection workflow (10-item QC checklist)
20. Step-by-step Gemini Studio operating instructions
21. Cost & batch order
22. What to do if a prompt fails (rescue snippets)

---

# 1. How to use this book

**You will paste prompts into Gemini Studio (or Vertex AI / Google AI Studio).** The model you want is **Imagen 4** for stills (highest photorealism), or **Gemini 2.5 image mode** when you need image-to-image editing (the night-version step of the Day↔Night pairs).

### The recipe (do this for every image)

1. Open Gemini Studio → choose **Imagen 4** as the model.
2. Set candidate count to **4** (always generate 4 — pick the best one).
3. Set the **aspect ratio** in the Gemini UI knob (do NOT only write the aspect inside the prompt — set the knob too). Aspect-ratio options used in this book: `16:9`, `4:5`, `1:1`, `3:2`, `21:9`, `2:3`, `9:16`.
4. Paste, in this exact order, into the prompt field:
   - The **Universal Style Block (§2)** — once at the top.
   - A blank line.
   - The **specific prompt** for the image ID (from §5–§18).
   - A blank line.
   - The **Hyper-Realism Specs (§4)** — appended at the end.
5. In the "Negative prompt" field (Imagen 4 exposes this; if your interface does not, paste it at the end of the main prompt prefixed with `Negative: …`), paste the **Negative-Prompt Block (§3)**.
6. Generate. Look at all 4 candidates side-by-side. Run the **QC checklist (§19)** mentally.
7. Save the chosen image with **the exact ID as filename**: e.g. `HERO-01.jpg`, `DECOR-MANDAP-01-DAY.jpg`. Save format: JPG (quality 95) or PNG. Do NOT save as WEBP from Gemini — we'll convert later.
8. Upload to **Payload CMS → Media collection** (admin panel). Set `altText` from the prompt's one-line description.

### When to read this book vs. ignore it

> **Always**: read §2 (Universal Style Block) and §3 (Negative Block) once before starting a session — they apply to every prompt.
>
> **Then**: jump straight to the section for the image you're rendering.

### Trust Gemini's text rendering NEVER

Gemini cannot reliably render brand-name text strings inside images. **Do not** ask it to render the word "Siligurievent" or any wordmark. The wordmark is type-set later in design tools using **Cormorant Garamond**. Any signage that needs text in the final shot will get the text added in Photoshop / Figma afterwards. See §5 `LOGO-WORDMARK-NOTE` for the explicit policy.

---

# 2. UNIVERSAL STYLE BLOCK

**Paste this verbatim at the top of every Gemini prompt:**

```
Cinematic editorial photograph for Siligurievent, a luxury Indian event-decoration studio based in Siliguri, North Bengal. Vogue-India editorial quality. Style: restrained Indian wedding luxury with North Bengal native character — warm ivory and brass palette, single accent of wine or marigold, generous negative space, never chaotic. Composition uses rule-of-thirds purposefully, layered foreground / midground / background, subject placed off-centre, deep negative space allowed. Lighting: soft directional natural light, golden hour or candlelit interiors, warm tungsten highlights with deep velvet shadows, gentle highlight roll-off, no harsh on-camera flash, no ring-light flatness. Camera feel: shot on a Sony A7R IV full-frame body, 35mm f/1.4 prime for environment shots and 85mm f/1.8 prime for portraits and intimate decor — shallow depth of field with creamy bokeh, optical lens character. Colour grading: warm-cool film contrast, ivory whites with terracotta and brass mid-tones, deep burgundy and midnight-blue shadows, restrained saturation, slight Kodak Portra 400 film emulation. People in the frame are South Asian (Bengali, Marwari, Nepali, or pan-Indian) with authentic skin tones, natural facial features, age-appropriate, hands and jewellery photographically accurate. Region: North Bengal, India — visual cues may include Himalayan haze, tea-garden green, jasmine and marigold florals, brass and copper hardware, banana leaves, handloom textiles, dhotis, Banarasi and Baluchari sarees, sherwanis, tilak, sindoor. Aesthetic position: editorial magazine — never Pinterest-cliché, never stock-photo flat, never garish.
```

This is your single source of truth for the brand look. If a specific prompt below adds details that conflict with this block, the specific prompt wins for that one image.

---

# 3. NEGATIVE-PROMPT BLOCK

**Paste this verbatim into the Negative-Prompt field for every image** (or append as `Negative: …` at the end of the main prompt if your interface lacks a separate field):

```
plastic skin, waxy AI skin, doll-like faces, uncanny valley, illustration, cartoon, 3D render look, low resolution, blur, motion blur, watermark, text artifacts, garbled text on signs or banners, brand logos, distorted hands, extra fingers, six fingers, missing fingers, melted jewellery, deformed gold, anachronistic clothing, white-westernised features on Indian subjects, blonde hair on Indian subjects, blue eyes on Indian subjects, every-colour-in-one-frame, oversaturated reds, neon RGB lighting, harsh on-camera flash, ring-light glare, lens flare artefacts, heavy vignetting, fish-eye distortion, over-sharpened edges, AI sheen, glossy plastic look, halo edges, double pupils, asymmetric eyes, deformed ears, floating limbs, fused fingers, fused jewellery, fused fabric, stock-photo composition, generic Pinterest mandap, marigold pile aesthetic, balloon-shop birthday, glitter overload, gradient sky backdrop, fake bokeh, painterly filters, Instagram filter look, HDR overcooking, oversaturated mehendi, cluttered backgrounds, every-colour-saree-in-one-shot, chaotic composition, drone-shot chaos, child-labour imagery, distressed or sad expressions on celebratory subjects.
```

---

# 4. HYPER-REALISM TECHNICAL SPECS

**Append this verbatim at the end of every prompt:**

```
Technical specs: photorealistic, native 4K resolution feel, full dynamic range with detail in both shadows and highlights, gentle natural film grain (Kodak Portra 400 emulation, fine even grain — no digital noise), deep shadow detail without crushed blacks, highlight roll-off without clipped whites, photographically accurate skin texture (visible pores, fine vellus hair, natural sub-surface scattering, no smoothing), fabric weave visible at thread level on close shots (silk catches highlights, cotton diffuses light, velvet absorbs light), jewellery reflections optically accurate (brass reads warm-yellow, gold reads deeper-yellow, silver reads cool-white, gemstones have caustic sparkle but no plastic shine), depth of field consistent with the stated lens and aperture, no synthetic lens flare unless specifically requested, no synthetic bokeh — bokeh should follow physically correct circle-of-confusion math, colour grading consistent across the frame, white balance warm 4200K–4800K for indoor candlelit shots and 5200K–5600K for golden-hour outdoor, shot ratio respects the aspect ratio set in the Gemini knob.
```

---

# 5. LOGO & BRAND MARKS

### `LOGO-EMBLEM-A` — Primary brass-foil monogram emblem

**Aspect**: 1:1 square. **Background**: transparent (set Imagen "transparent background" if available; otherwise pure white #FFFFFF for keying later). **Render mode**: Imagen 4 illustration / vector-graphic mode preferred. Resolution: 2048×2048.

**Prompt** (paste after Universal Style Block):

```
A single luxury monogram emblem for a high-end Indian event-decoration studio. The monogram is the letters "S" and "E" intertwined as a continuous brush-stroke calligraphic glyph, rendered in brushed-brass foil with a soft matte sheen — never glossy plastic. Behind and through the monogram, a single stylised five-petal jasmine bloom is composed in negative space, the petals forming organic counter-curves around the letterforms. The whole emblem is a single colour, brass #B8893A, on a pure white background. Style references: Hermès equestrian emblem, Saint Laurent monogram restraint, Cartier engraved foil. Composition: emblem centred, generous negative space on all sides (the emblem occupies roughly 60% of the canvas), perfectly symmetrical balance. No drop shadow, no gradient, no 3D bevel — flat brass colour with subtle hand-engraved line texture only. Square 1:1 format, ready to extract on a transparent layer.
```

**Selection criteria for the 4 candidates**:
1. The "S" and "E" must both be legible — if you cannot identify both letters within one second, reject.
2. The jasmine bloom must read as jasmine (five small rounded petals), not a lotus or daisy.
3. Brass colour must be matte and warm — reject anything that looks glossy, plastic, or rose-gold pink.
4. No accidental third letter, no extra ornaments creeping in.

**Common pitfalls**: Gemini often turns monograms into busy crests with crowns or laurel wreaths — reject those. Also rejects: any version where the letters look like Latin script but slightly wrong (e.g., S that reads as "8").

---

### `LOGO-EMBLEM-B` — Round wax-seal emblem (alternate)

**Aspect**: 1:1. **Resolution**: 2048×2048. **Background**: charcoal #0E0B08 (for dark-mode use; we'll mask later).

**Prompt**:

```
A round wax-seal-style emblem for a luxury Indian event-decoration studio, rendered in brushed brass on a deep charcoal background (charcoal #0E0B08). The seal is a perfect circle, 1500 pixels in diameter, with a thin laurel-style border of paired jasmine sprigs running around the inner edge. At the centre, a single open marigold bloom (Tagetes / genda) is drawn in stylised line-art with carefully placed petals — botanically credible, not generic. Around the inner border, evenly spaced, are eight tiny five-pointed stars. The whole emblem is monochrome brass #B8893A on charcoal, no gradients, no 3D, no embossing — pure flat foil aesthetic, like a hot-stamped wax seal pressed once cleanly. References: Aesop apothecary seal, Le Labo wax seal, Soho House emblem. Composition: emblem fills 75% of the canvas, centered, symmetric. No text. Render in vector-illustration style with fine line detail.
```

**Selection criteria**:
1. Marigold at centre must be recognisable as a marigold (concentric ruffled petals), not a generic flower.
2. Jasmine border must repeat as a clean rhythm — reject if irregular or chaotic.
3. Brass on charcoal must have enough contrast to read at 32×32.
4. Eight stars exactly — reject if Gemini gives six or twelve.

---

### `LOGO-EMBLEM-C` — Minimal calligraphic flourish (S / flame / diya)

**Aspect**: 1:1. **Resolution**: 2048×2048. **Background**: pure white #FFFFFF.

**Prompt**:

```
A single calligraphic glyph that reads simultaneously as the letter "S" and as a stylised flame of a brass diya (Indian oil lamp). The glyph is drawn in one continuous brush-pen stroke, with deliberate weight variation — thick downstroke, hairline upstroke — in the style of a master calligrapher's flourish. The glyph is brass #B8893A on pure white. At the very base of the glyph, a tiny pool of brass suggests the diya's bowl — a single curved line, no more. The flame curves upward into the body of the "S" and resolves at the top as a small teardrop of brass. References: Hassan Massoudy Arabic calligraphy, Edward Catich Roman brush-and-ink studies, devanagari calligraphy thick-thin contrast. No background ornament, no text, no flourish beyond the glyph itself. Composition: glyph occupies 50% of the canvas height, centered, generous negative space.
```

**Selection criteria**:
1. Reads as S **and** as flame — both must be present.
2. One continuous stroke — reject any version with multiple disconnected strokes.
3. Brass on white must be clean — no halos, no anti-alias fuzz.

---

### `LOGO-WORDMARK-NOTE` — DO NOT generate the wordmark with Gemini

> **Policy**: The brand wordmark "Siligurievent" is **not** generated by Gemini. Gemini's text rendering is unreliable — letters drop, kerning breaks, fake serifs appear. The wordmark is set in **Cormorant Garamond** (display weight 500, italic optional, tracking +0.06em, small-caps for the secondary line) directly in **Figma / Illustrator / SVG** by the developer or designer. The wordmark exists in the codebase as an SVG component and is rendered as live text in the header. **Do not** paste a prompt to Gemini asking for the word "Siligurievent" in any form. If a hero shot needs the wordmark composited in (e.g., on a brass signage prop), it is added in Photoshop afterwards — Gemini generates the brass plaque without text, the designer adds the text.

---

### `FAVICON-MARK` — 1024×1024 favicon-legible simplification

**Aspect**: 1:1. **Resolution**: 1024×1024. **Background**: pure white #FFFFFF.

**Prompt**:

```
A radical simplification of a luxury brass monogram emblem, designed to remain legible at 32×32 pixels. A single bold brass glyph that suggests an "S" form drawn as one continuous thick brush-stroke, with one stylised jasmine bloom-dot above or beside the curve as a single small filled brass disc. Total shape complexity: no more than four visual elements. Brass #B8893A on pure white. Heavy weight — minimum stroke width 8% of the canvas. No fine detail, no thin lines (those would vanish at favicon scale), no inner ornament. References: Apple's logomark simplicity, Lacoste's silhouette, the way Hermès reduces to just an "H". Composition: glyph centered, occupies 70% of canvas, generous edge padding.
```

**Selection criteria**:
1. Test mentally at 32×32 — can you still see the S and the dot? If no, reject.
2. No thin strokes anywhere — every stroke must be thick enough to survive downscaling.
3. Pure flat brass, no gradients, no shadows.

---

# 6. HOME PAGE HEROES — HERO-01 to HERO-07

Set the Gemini aspect knob per ID. For each hero, generate the primary aspect AND a 4:5 mobile-crop variant in a second run with the prompt slightly re-framed (note the mobile direction at the end of each).

---

### `HERO-01` — Home hero

**Used on**: `/` Section H1 — the brand's first frame. **Aspect**: 16:9 desktop, 4:5 mobile variant. **Resolution**: 3840×2160 desktop / 2048×2560 mobile. **CSS render box**: full viewport on desktop, full-bleed background on mobile.

**Prompt**:

```
Editorial cinematic wide shot of a signature North-Bengal Bengali-wedding Mandap at golden hour, viewed from a low front-three-quarter angle. The Mandap is a sculptural square structure of four hand-turned brass-tipped wooden pillars, draped with cream and ivory raw-silk panels falling in long vertical folds, accented by garlands of freshly strung white jasmine (Bel) and gentle threads of pale-gold Bengali marigold (genda). The roof of the Mandap is an open lattice of woven mango leaves and banana stalks, with a single oversized rajnigandha (tuberose) stem cascading from the centre. On the marble Mandap floor: a copper urli with floating jasmine and a single brass diya, lit, flame gentle. In the deep midground (out of focus, hinted only): the soft silhouette of a Bengali bride seated, wearing a red Banarasi saree with gold zari, her face turned three-quarters away from camera so identity is suggestive not portraited — she occupies the right third of the frame. Foreground: a low brass thali with vermillion sindoor, two betel leaves, a small ghee diya — soft focus, foreground texture. Background: a North-Bengal courtyard with weathered ivory plaster walls, a single hand-carved wooden door visible far left, soft Himalayan late-afternoon light pouring in from camera-right at a 30-degree angle, motes of dust drifting in the light beam. Time: 5:45pm in late November, sun very low and warm. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.0, ISO 400, shutter 1/125. Subject focus on the Mandap centre, bride is in soft focus depth, foreground thali in soft-bokeh out of focus. Mood adjectives: reverent, cinematic, intimate, unhurried, golden, quietly opulent. Colour: warm ivory whites, brass-gold mid-tones, deep terracotta-red accents, single thread of fresh marigold orange, no other colours competing. Cultural specifics: Bengali wedding (Bashor-side of the ceremony), not Punjabi or Marwari — keep restraint on red, emphasise white and brass rather than red-and-gold maximalism. Strictly: no garbled text on the brass, no Western faces, no plastic jasmine.

Mobile-variant note for the 4:5 re-run: re-frame to portrait orientation, bring the bride silhouette up to the top third, push the foreground thali into the lower third for thumb-CTA breathing room.
```

---

### `HERO-02` — About hero

**Used on**: `/about` Section 1. **Aspect**: 3:2 landscape. **Resolution**: 3000×2000. **CSS render box**: half-viewport hero block, right-cropped on desktop.

**Prompt**:

```
Editorial half-portrait of the founder of a luxury Indian event-decoration studio, photographed at work in a calm moment between installations. Subject: a South Asian person in their early 40s, of Bengali heritage, photographic but not corporate, calm and confident expression, eyes not directly to camera but to a middle distance off-frame-right. Wearing a fine black handloom kurta with subtle silver thread at the collar, a single brass cuff on the right wrist, a small brass-pen tucked behind the ear. Hands engaged: one hand holding a strung jasmine garland mid-thread, the other resting on a wooden workbench scattered with stem clippings, a single open notebook with handwritten sketches (illegible — purposely soft-focus), and a brass scissor. Lighting: large soft window light from the left, late-morning, warm cream wall behind the subject, deep shadow on the right side of the face — Rembrandt-style chiaroscuro but gentle, not dramatic. Background: bokeh-soft, suggests a studio space with hanging fabric panels and a wall of glass jars containing flower stems — no clutter, every object intentional. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/2.0, shallow depth of field, focus locked on the eyes. Mood: thoughtful, quietly authoritative, hands-on craftsperson, "the maker" archetype. Colour: warm ivory, soft skin warmth, single thread of jasmine white, no other colour competing.
```

**Mobile variant**: re-run at 4:5, tighten to head-and-shoulders, keep the jasmine garland visible in the lower frame.

---

### `HERO-03` — Services index hero

**Used on**: `/services`. **Aspect**: 21:9 panoramic. **Resolution**: 5040×2160. **CSS render box**: full-bleed panoramic banner.

**Prompt**:

```
Ultra-wide editorial panoramic shot of a multi-ceremony Indian wedding venue, mid-afternoon, soft overcast light. The frame reads left-to-right as a visual journey: on the far left, a small Haldi corner with copper urli, marigold-and-mango-leaf garlands and a low wooden seat dressed with raw cotton; centre-left, a mehendi nook with cushions, parasols and glass jars of fresh roses; centre, a sangeet stage with layered drape backdrops and a statement floral arch hinted in soft focus; centre-right, a Bengali Mandap structure with jasmine pillars; far right, a reception backdrop with a long taper-candle table runner. Each setup occupies its own zone separated by negative space and changes in floor texture — there is no chaos, no overlap, each "room" reads as its own composed scene. The light is gentle North-Bengal afternoon, slightly hazy, slightly cool — like the air before a winter dusk. The 21:9 panorama allows the eye to scan slowly across the celebrations. People are absent or only suggested as soft distant silhouettes. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/4.0 for a slightly wider field of focus, stitched-pan feel but native single-frame composition. Mood: a portfolio in one breath, the breadth of the studio's craft. Colour: warm ivory base, marigold accents in zone-1, jade-and-rose in zone-2, deep wine in zone-3, ivory-and-brass in zone-4, midnight-blue-and-gold in zone-5 — each zone has a single accent so the eye can rest.
```

---

### `HERO-04` — Portfolio index hero

**Used on**: `/portfolio`. **Aspect**: 16:9. **Resolution**: 3840×2160.

**Prompt**:

```
Cinematic wide editorial frame of a finished wedding venue moments after the ceremony has ended and the guests have left — a "stage at rest" composition. A grand ballroom, gentle low ambient light, the Mandap stands still-decorated in the deep centre of the frame, lit only by twelve brass diyas placed in a curving line on the floor leading the eye toward the structure. A single chair in the foreground is slightly turned out of position — a tiny imperfection that proves a celebration happened here. Fabric drapes are still in place but stir gently. The composition is symmetrical from a central low-eye axis, with deep perspective into the Mandap. Time: just after sunset, 7:30pm, ambient blue hour outside the window panes, warm tungsten ambient inside. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.8, focus on the Mandap centre, foreground chair softly out of focus. Mood: quietly cinematic, the silence after a story, the breath the studio takes. Colour: cool blue hour outside the window, warm tungsten + candle interior, brass accents glowing.
```

---

### `HERO-05` — Pricing hero

**Used on**: `/pricing`. **Aspect**: 16:9. **Resolution**: 3840×2160.

**Prompt**:

```
Macro editorial detail shot, shallow focus. Centre-frame: a single hand-strung jasmine garland (Bel) draped across a smooth slab of pale-cream Indian marble, a freshly cut blush-pink rose stem laid beside it, a single beeswax pillar candle lit at the right of the frame, its flame leaning gently leftward as if from a draft. Behind the marble slab: a soft drape of raw ivory silk falling vertically, slightly out of focus. The composition is intimate, two-thirds negative space, the objects occupy the lower-right diagonal. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/1.8 wide open, focus on the jasmine knot at the centre of the garland, candle flame in soft bokeh. Lighting: single warm window light from camera-left, 5pm late winter, the candle adds its own small warm pool. Mood: honest, considered, hand-made, "what your budget is buying" — material truth. Colour: cream-ivory, jasmine-white, soft blush, brass candle holder, no other colours.
```

---

### `HERO-06` — Blog index hero

**Used on**: `/blog`. **Aspect**: 16:9. **Resolution**: 3840×2160.

**Prompt**:

```
Editorial overhead flat-lay on a weathered linen tablecloth — the desk of a planner mid-research. Composition: top-down 90-degree perspective. Objects arranged with editorial intention but not over-styled: a hand-bound notebook open to a page of handwritten Bengali wedding ceremony notes (illegible Bengali script, purposely soft so no text-rendering errors are visible), a single fountain pen, two pressed jasmine blooms, a brass paperweight shaped like a marigold, a small ivory ceramic cup of black tea with a sliver of jaggery beside it, a stack of three printed wedding photographs (face-down — only the photo-paper backs visible), a single sprig of fresh tuberose laid across the diagonal. The linen tablecloth is creased softly, with one corner folded back to reveal a hint of a darker wood table beneath. Lighting: soft north-window daylight from the top of the frame, no harsh shadows. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/4.0, focus across the plane of objects, slight Brenizer feel. Mood: editorial journal, notes on craft, "we write things down". Colour: warm ivory, brass, soft jade leaves, black ink, no competing hues.
```

---

### `HERO-07` — Contact hero

**Used on**: `/contact`. **Aspect**: 16:9. **Resolution**: 3840×2160.

**Prompt**:

```
Intimate close-up detail shot: a single brass candle lit, flame steady, casting warm pool of light across a wooden table-edge. To the right of the candle, a thick cream cotton stationery card lies face-up, blank — no text, no script, purposely empty (do not render writing on the card; do not generate handwriting). To the left of the candle, a single sprig of fresh jasmine. Background: deep velvety shadow falling off into near-black, only the warm pool of candlelight reads. The composition is quiet, asymmetric, two-thirds shadow, one-third lit. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/1.8, focus on the candle wick. Mood: come-have-a-conversation, an invitation, late evening, after-hours, intimate. Colour: warm candle amber, deep velvety brown shadow, ivory card, jasmine white. No other colour.
```

---

# 7. SIGNATURE WORK CARDS — WORK-01 to WORK-05

Each is a 4:5 portrait dramatic editorial shot for the horizontal scroll showcase on Home Section H4. Each card is one "film still" from a different signature project type.

---

### `WORK-01` — Bengali wedding hero shot

**Aspect**: 4:5. **Resolution**: 2400×3000. **Render box**: card occupies ~80% viewport when scroll-pinned.

**Prompt**:

```
Vertical editorial cinematic still: a Bengali wedding Mandap centred, photographed at the moment of Subho Drishti — the bride and groom's first ritual gaze. The bride sits centre-frame in a red Banarasi saree with deep gold zari and a traditional Topor headdress (the white pith conical Bengali bridal crown with the lacework), her face partially obscured by the Topor and a soft drape — identity suggestive, not portraited. The groom is across from her in a cream silk dhoti and kurta with a Topor of his own, his back partially to camera. Between them, suspended at face height, a thin embroidered cloth (the betel-leaf veil) is held by two attendants whose hands only are visible. The Mandap behind them is rich with white jasmine pillars, banana-leaf trim, brass-tipped wooden posts, and a single overhead canopy of fresh tuberose. Lighting: warm tungsten from above and warm candlelight from copper urlis at the Mandap floor — chiaroscuro, but every face-area softly readable. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/2.0, focus on the cloth between the couple, shallow depth so the Mandap behind is creamy bokeh. Mood: reverent, ritual, the heart of a Bengali wedding. Colour: deep red, ivory, brass, jasmine white. Cultural specifics: this is Bengali — Topor is non-negotiable, no Punjabi turbans, no Marwari sehra, no generic "Indian wedding crown".
```

---

### `WORK-02` — Marwari sangeet stage

**Aspect**: 4:5. **Resolution**: 2400×3000.

**Prompt**:

```
Vertical editorial cinematic still: a Marwari sangeet stage at peak performance, photographed from the side aisle at a low angle. The stage backdrop is a layered drape composition — deep wine velvet base, gold tissue overlay, a sculptural floral arch of dark-red roses, marigold and burgundy dahlia framing the proscenium. On stage, the silhouette of three female performers mid-dance, in heavily embellished lehengas (gold and wine, mirror work catching highlights), their faces motion-blurred enough to abstract identity but expressive in posture — the choreography is mid-spin. Foreground: the bokeh of audience heads, soft, and a brass garland strung across the lower frame edge as a leading line. Lighting: warm key from above-stage at a 45-degree angle, deep coloured rim lights from behind (warm amber, not RGB neon — avoid coloured stage lights), uplighters at the proscenium adding a brass glow to the drapes. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/1.8, slight motion blur on the dancers (shutter 1/60). Mood: high-energy joy held in cinematic restraint. Colour: wine, gold, burgundy, brass — restrained palette despite the maximalism, no greens, no blues.
```

---

### `WORK-03` — Tea garden reception

**Aspect**: 4:5. **Resolution**: 2400×3000.

**Prompt**:

```
Vertical editorial cinematic still: an outdoor evening wedding reception set in a Darjeeling tea estate, photographed from a slightly elevated angle. Mid-ground: a long table runs across the frame, set for forty guests, covered in raw ivory linen, lined with fresh tuberose and white roses in low brass urns every metre, taper candles in brass holders every other place setting, hand-calligraphed place cards (purposely soft so no readable text). Above the table, three layers of warm-white festoon lights and string-lights crisscross the open sky between bamboo poles. Beyond the table, the tea garden rolls away into the background — neat green rows of Camellia sinensis bushes, the silhouette of a colonial planter's bungalow far in the distance, the Kanchenjunga mountain range catching the last alpenglow of pink-gold light on its peaks (very subtle, slightly out of focus). Foreground: a single empty chair at the head of the table, slightly pulled back, with a folded napkin on the seat. Lighting: blue-hour ambient sky, warm festoon and candle interiors, alpenglow on the mountain. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.0, focus on the table centre, mountain in soft focus. Mood: a destination wedding's quiet first moment. Colour: warm ivory, brass-amber, soft jade green, alpenglow-pink in the distance.
```

---

### `WORK-04` — Intimate Haldi

**Aspect**: 4:5. **Resolution**: 2400×3000.

**Prompt**:

```
Vertical editorial cinematic still: an intimate Haldi (Gaye Holud) ceremony in a North Bengal courtyard, late morning. The bride sits on a low wooden Pidi (Bengali wedding stool) wrapped in a turmeric-yellow handloom cotton saree, her hands extended forward — fingers and forearms streaked with golden turmeric paste, fresh marigold petals scattered across her lap, jasmine garlands around her wrists. Her face is turned three-quarters away from camera (so identity is suggestive), a small smile at the corner of her mouth, two friends to her left mid-laugh applying more haldi from a brass thali. Behind the bride: a wall of fresh marigold and mango-leaf garlands draped vertically, and a hand-painted Alpana motif (white rice-paste floor art) on the courtyard tiles in front. Above: an open-sky atrium pouring soft midday Bengal sun through a sheer ivory canopy fabric — the light is filtered, warm, glowing. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.0, focus on the bride's outstretched turmeric-coated hand, shallow depth. Mood: joyful, intimate, warm, the morning before the wedding. Colour: marigold-yellow dominant, turmeric-gold, soft jade leaves, ivory canopy — no red, this is Haldi not the wedding. Cultural specifics: Bengali Haldi-Gaye-Holud, not Punjabi Haldi — emphasise Alpana, Pidi, mango-leaf garland, brass thali.
```

---

### `WORK-05` — Corporate / heritage event

**Aspect**: 4:5. **Resolution**: 2400×3000.

**Prompt**:

```
Vertical editorial cinematic still: a corporate gala / heritage product launch evening, set inside a high-ceilinged colonial heritage banquet hall in Siliguri, photographed from a low-front angle looking up along the central aisle. The hall is rectangular, white-and-cream walls with restored teak woodwork, a row of original wrought-iron pendant chandeliers running down the ceiling spine — every chandelier lit with warm tungsten. The aisle is a centre-runway of polished black stone flanked by two rows of slim brass plinths, each plinth topped with a sculptural floral installation of architectural white anthurium, single-stem orchids, and trailing eucalyptus — minimalist Ikebana-meets-modern-Indian. At the far end of the aisle, a back-lit signage frame (intentionally blank — do not render any text) glows softly. Foreground: a single waist-height brass plinth with a curved glass top, suggesting a product reveal. No people. Lighting: warm tungsten chandeliers overhead, narrow uplighters at each plinth, a deep blue ambient wash on the far wall for cinematic depth — never RGB neon, restrained colour temperature only. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.8, focus on the foreground plinth, mid-aisle in soft focus. Mood: opulent restraint, "this brand chose this studio for a reason." Colour: warm tungsten, brass, ivory, single deep-blue ambient wash in the deep background — no greens or warm oranges in the lighting palette.
```

---

# 8. SERVICE TILES — SVC-01 to SVC-07

Seven tiles for Home Section H5. Each tile must read as visually distinct from the others — pay attention to the differentiation notes in each prompt.

---

### `SVC-01` — Weddings (big hero tile)

**Aspect**: 4:3. **Resolution**: 2400×1800.

**Prompt**:

```
Editorial wide tile shot of a fully built Mandap-centred wedding setup, photographed from a front-three-quarter angle, late afternoon golden hour. The Mandap is sculptural — four ivory-silk-wrapped pillars, jasmine and marigold garlands cascading, a sheer fabric canopy above, brass uplighters at the base of each pillar. The Mandap floor is dressed with a Persian-style cream-and-gold rug, two cushioned low seats waiting empty. Behind the Mandap, soft bokeh of a banquet hall with rows of cream-draped guest chairs and a single back-wall floral installation. Foreground: shallow-focus brass urli with floating jasmine. No people. Lighting: warm golden hour pouring in through a tall window camera-right. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.2. Mood: the centrepiece of a wedding day. Differentiation note: this tile is the WIDE establishing shot — the other six tiles are tighter and more intimate, this one is the big-picture overview.
```

---

### `SVC-02` — Haldi

**Aspect**: 1:1. **Resolution**: 2048×2048.

**Prompt**:

```
Editorial square tile, intimate Haldi setup detail. Centre-frame: a low Bengali Pidi (wooden ceremonial stool) dressed with a fresh marigold-and-mango-leaf cushion, an open brass thali at the foot of the stool containing turmeric paste, a small heap of marigold petals, a few rose petals, a brass diya unlit, a small terracotta cup of milk. Behind: a vertical drape of fresh marigold-petal strings hanging like a curtain, soft focus, sun-dappled. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/2.0, focus on the brass thali. Lighting: late morning sun-dappled, warm. Mood: a quiet moment before the ritual. Colour: marigold-yellow dominant, brass, mango-leaf green, no other colour. Differentiation note: this tile is YELLOW-DOMINANT and intimate detail-scale — distinct from the brass-and-cream wedding tile, and distinct from the wine sangeet tile.
```

---

### `SVC-03` — Mehendi

**Aspect**: 1:1. **Resolution**: 2048×2048.

**Prompt**:

```
Editorial square tile, Mehendi corner detail. Foreground: a row of floor cushions in jade-green and dusty-rose handloom upholstery, on a printed dhurrie, with three open silver thalis containing fresh henna paste in piping cones, small bowls of lemon halves, and a stack of folded cotton hand-towels. Mid-ground: a vintage brass tea trolley topped with three glass jars of fresh rose petals, mint sprigs and gooseberry, suggesting a small drinks-station. Background: a soft sheer ivory drape with a single pendant brass lantern hanging at the upper-right of the frame, lit gently. No people, but a single henna-piping cone is freshly used and propped on the rim of a thali. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/2.5. Lighting: soft window light from the right. Mood: lounge-y, slow afternoon. Colour: jade green, dusty rose, soft brass — distinct from the marigold Haldi tile. Differentiation note: this tile is JADE-AND-ROSE, lounge-energy — distinct from every other tile in the grid.
```

---

### `SVC-04` — Sangeet

**Aspect**: 1:1. **Resolution**: 2048×2048.

**Prompt**:

```
Editorial square tile, sangeet stage detail. Mid-ground: a portion of a sangeet stage backdrop — three vertical layered drapes (deep wine velvet, gold tissue, ivory silk) rising out of frame, fronted by a sculptural floral arch corner of dark-red roses, dahlias and burgundy ranunculus, with one trail of golden-amaranth cascade. A single warm-amber par-can light grazes the drapes at a 30-degree angle from camera-left, throwing deep shadow into the velvet folds. Floor: a polished dark-wood stage with a single microphone stand silhouetted in the foreground. No people. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/2.0, focus on the floral corner. Mood: theatrical luxury, the moment before the performance. Colour: wine, gold, burgundy, brass — restrained and dark. Differentiation note: this tile is DARK and WINE-DOMINANT — distinct from all other tiles which lean ivory/yellow/jade.
```

---

### `SVC-05` — Reception

**Aspect**: 1:1. **Resolution**: 2048×2048.

**Prompt**:

```
Editorial square tile, reception table detail. Top-down 70-degree perspective on a section of a long banquet table — ivory linen, a hand-folded napkin in cream linen with a single sprig of dried lavender tucked under a brass ring, gold-rimmed bone-china dinner plate, brass charger, three crystal glasses, a hand-calligraphed place card (purposely soft so no readable text), a low brass urn of white roses, eucalyptus and silver-dollar leaves at the table edge, two taper candles in tall brass holders lit. Lighting: warm tungsten from above and the taper candles themselves. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/2.8. Mood: refined dinner setting. Colour: ivory, brass, soft silver-green eucalyptus, white roses, candle amber. Differentiation note: this tile is IVORY-AND-BRASS dinner-elegance — distinct from the stage, distinct from the Haldi, distinct from the Mehendi.
```

---

### `SVC-06` — Birthday

**Aspect**: 1:1. **Resolution**: 2048×2048.

**Prompt**:

```
Editorial square tile, milestone birthday setup detail. Centre-frame: a single sculpted three-tier cake in pale-blush buttercream with delicate brushwork in burnished-gold edible leaf, topped with a small cluster of fresh white anemones and a single deep-red dahlia. The cake stands on a marble pedestal, in front of a sculptural floral backdrop of dusty-rose roses, white anemones, soft champagne hydrangea, eucalyptus — modern, asymmetric, not balloon-shop. To the side: a single brass dessert stand with a stack of macarons, a small calligraphy plaque (purposely text-less). Lighting: soft directional from camera-left, warm but not orange. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/2.0. Mood: grown-up milestone — the opposite of children's-party energy. Colour: blush, ivory, burnished gold, deep-red accent. Differentiation note: this tile is BLUSH-AND-BURNISHED-GOLD modern — distinct from every traditional Indian-wedding tile in the grid. NO BALLOONS. NO PRINTED BANNERS.
```

---

### `SVC-07` — Corporate

**Aspect**: 1:1. **Resolution**: 2048×2048.

**Prompt**:

```
Editorial square tile, corporate event setup detail. Front-elevation shot of a single floor-to-ceiling architectural floral installation in a modern banquet hall — a vertical column of structured greenery (monstera, philodendron, areca palm fronds) interspersed with white phalaenopsis orchids and architectural anthurium, against a smooth charcoal-grey wall. To the right of the installation: a clean brass plinth (intentionally text-less). Floor: polished black stone. Lighting: precise narrow-beam uplighter at the base of the installation, ambient cool-white wash on the wall — restrained, never RGB. Camera: Sony A7R IV, 35mm f/1.4 prime, aperture f/4.0 for crisp full focus. Mood: corporate luxury, architectural. Colour: jade green, white, brass, charcoal, ivory — modern restraint. Differentiation note: this tile is ARCHITECTURAL and COOL — distinct from every warm/traditional tile in the grid.
```

---

# 9. SERVICE DETAIL PAGE HEROES — TEMPLATED FOR 19 SERVICES

Each of the 19 services gets 5 images: **1 HERO (16:9)** + **DETAIL-01, DETAIL-02 (4:5)** + **DETAIL-03, DETAIL-04 (3:2)**.

## 9.1 Master template

**For the HERO (16:9) prompt of each service**, substitute the variables in this template (paste this after the Universal Style Block):

```
Editorial cinematic wide hero shot of a [SERVICE_NAME] event setup, photographed at [TIME_OF_DAY] in a [VENUE_TYPE] in North Bengal. Composition: [COMPOSITION_DIRECTION]. The setup features three signature elements: (1) [DIFFERENTIATOR_1], (2) [DIFFERENTIATOR_2], (3) [DIFFERENTIATOR_3]. Foreground: [FOREGROUND_DETAIL]. Mid-ground: [MIDGROUND_DETAIL]. Background: [BACKGROUND_DETAIL]. Lighting: [LIGHTING_DIRECTION]. Camera: Sony A7R IV, [LENS] prime, aperture [APERTURE], focus on [FOCUS_TARGET], shallow depth. Mood: [MOOD_ADJECTIVES]. Colour palette: [COLOUR_PALETTE]. Cultural specifics: [CULTURAL_NOTES]. No people in the frame unless specified — the decor itself is the subject. Strictly: no garbled text on signage, no plastic florals, no Pinterest-cliché overload.
```

**For each DETAIL (4:5 or 3:2)**, use the shorter template:

```
Editorial close-up detail shot of [DETAIL_SUBJECT] from a [SERVICE_NAME] setup. Composition: [DETAIL_COMPOSITION]. Lighting: [DETAIL_LIGHTING]. Camera: Sony A7R IV, 85mm f/1.8 prime, aperture f/1.8–f/2.5 depending on subject. Focus: [DETAIL_FOCUS]. Colour: [DETAIL_COLOUR]. Mood: [DETAIL_MOOD].
```

## 9.2 Service-by-service substitutions

For each of the 19 services below, the table gives the three differentiators and the four DETAIL subjects. The HERO substitutions are written out for each; the four DETAILs use the shorter template with the four listed subjects (close-up decor, close-up florals, wide of stage, close-up of fabric/lighting).

---

### 1. `wedding` — Generic wedding (pan-Indian, includes Marwari / Sikh / Christian / Muslim / Nepali coverage)

- **DIFFERENTIATOR_1**: A full Mandap structure with four pillars, sheer fabric canopy, and a sculptural floral arch.
- **DIFFERENTIATOR_2**: A baraat-ready entrance with marigold and rose torans (door-garlands).
- **DIFFERENTIATOR_3**: A reception backdrop suggested in soft focus behind, with a long ivory-runner table.
- **HERO** (16:9): TIME_OF_DAY = golden hour 5:30pm; VENUE_TYPE = pillared banquet hall with high ceiling; COMPOSITION = front-three-quarter, centred Mandap, slight low angle; FOREGROUND_DETAIL = a single brass diya lit on a stone step; MIDGROUND_DETAIL = the Mandap in full focus; BACKGROUND_DETAIL = the reception backdrop softly out of focus far back; LIGHTING = warm window light from camera-right plus interior tungsten warm tones; LENS = 35mm; APERTURE = f/2.2; FOCUS_TARGET = the Mandap centre; MOOD = ceremonial grandeur held with restraint; COLOUR_PALETTE = ivory, brass, single thread of red and one of marigold; CULTURAL_NOTES = pan-Indian — keep neutral so the page can speak to Hindu / Sikh / Christian / Muslim families. NO Topor (that is Bengali — separate slug). NO Sehra (that is Marwari — covered as a tradition section).
- **DETAIL subjects**: (01) close-up of jasmine garland tied to brass pillar tip; (02) close-up of fresh rose petals on a Mandap floor with a brass diya; (03) wide of the reception stage with backdrop and ground florals; (04) close-up of layered fabric drape — silk, organza, raw cotton — catching warm light.

### 2. `bengali-wedding` — Bengali wedding (own slug)

- **DIFFERENTIATOR_1**: Bengali Topor (bridal pith crown) on a brass plinth waiting to be worn, signalling Bengali-specific tradition.
- **DIFFERENTIATOR_2**: A Bashor Ghor corner with mosquito-net canopy, brass khat (bed) frame and a hand-painted Alpana floor pattern.
- **DIFFERENTIATOR_3**: Mandap pillars wrapped in fresh Bel (jasmine) and banana-leaf trim — Bengali-signature.
- **HERO**: TIME = late afternoon 4:30pm; VENUE = traditional Bengali home courtyard or banquet with old-world arches; COMPOSITION = centred Mandap with the Topor plinth in the right foreground; FOREGROUND = the brass plinth with white-pith Topor and a smaller bridal Mukut (gold filigree headdress) beside it; MIDGROUND = jasmine-and-banana-leaf Mandap; BACKGROUND = hand-painted Alpana floor pattern (white rice-paste lotus motif) in soft focus; LIGHTING = warm window light, soft hazy Bengal afternoon; LENS = 35mm; APERTURE = f/2.0; FOCUS = the Topor; MOOD = Bengali ceremonial intimacy; COLOUR = ivory, jasmine white, brass, soft thread of red Banarasi; CULTURAL_NOTES = Bengali specifics non-negotiable — Topor, Mukut, banana-leaf trim, Alpana, Bel jasmine, brass urli with floating jasmine.
- **DETAIL**: (01) close-up of Topor and Mukut on brass plinth; (02) close-up of Alpana rice-paste floor art with one fallen marigold; (03) wide of Bashor Ghor corner with mosquito-net canopy and brass bed; (04) close-up of banana-leaf-wrapped Mandap pillar at the brass tip.

### 3. `haldi-gaye-holud` — Haldi / Gaye Holud

- **DIFFERENTIATOR_1**: A copper urli with floating marigold and turmeric blend at the centre of the setup.
- **DIFFERENTIATOR_2**: A low Pidi (Bengali ceremonial stool) dressed in turmeric-yellow handloom cotton.
- **DIFFERENTIATOR_3**: A vertical wall of fresh marigold strings (genda petal curtain).
- **HERO**: TIME = late morning 11am sun-dappled; VENUE = open courtyard or covered atrium with sheer canopy overhead; COMPOSITION = centred Pidi in the middle of the frame, marigold curtain behind, copper urli foreground; FOREGROUND = copper urli with floating yellow petals; MIDGROUND = Pidi with folded turmeric-yellow handloom cotton seat and a brass thali at its foot; BACKGROUND = marigold curtain wall; LIGHTING = sun-dappled top light filtered through ivory sheer; LENS = 35mm; APERTURE = f/2.2; FOCUS = Pidi cushion; MOOD = warm joyful morning; COLOUR = marigold-yellow dominant, brass, mango-leaf green, ivory — strictly NO red; CULTURAL_NOTES = Bengali Gaye Holud and pan-Indian Haldi conventions both honoured — emphasise Pidi, brass thali, marigold, turmeric.
- **DETAIL**: (01) close-up of brass thali with turmeric paste, marigold petals, lemon slices; (02) close-up of marigold strings hanging vertically; (03) wide of the full setup with the courtyard light; (04) close-up of turmeric-yellow handloom cotton weave catching sun.

### 4. `mehendi` — Mehendi

- **DIFFERENTIATOR_1**: A lounge cluster of floor cushions in jade and dusty-rose handloom on a printed dhurrie.
- **DIFFERENTIATOR_2**: A henna-station with silver thalis, piping cones, lemon halves.
- **DIFFERENTIATOR_3**: Parasols (Rajasthani-style hand-printed paper-and-bamboo) hanging or planted around the lounge as both shade and decor.
- **HERO**: TIME = early afternoon 1pm; VENUE = covered terrace or open lawn; COMPOSITION = wide lounge frame, parasol overhead canopy, cushions arranged in a curving cluster; FOREGROUND = a single henna-piping cone propped on a thali; MIDGROUND = cushion cluster with brass tea trolley; BACKGROUND = sheer drapes catching breeze, soft bokeh; LIGHTING = dappled afternoon, warm; LENS = 35mm; APERTURE = f/2.5; FOCUS = the lounge centre; MOOD = lounge-y, slow afternoon, conversation-energy; COLOUR = jade, dusty rose, brass, soft printed reds in the dhurrie; CULTURAL_NOTES = pan-Indian Mehendi — emphasise henna station, parasols, lounge cushions.
- **DETAIL**: (01) close-up of fresh henna paste in piping cone on a silver thali; (02) close-up of jade-and-rose cushion textile; (03) wide of the full lounge with parasols overhead; (04) close-up of a hanging paper parasol pattern with light through it.

### 5. `sangeet` — Sangeet

- **DIFFERENTIATOR_1**: A layered drape stage backdrop — wine velvet, gold tissue, ivory silk.
- **DIFFERENTIATOR_2**: A sculptural floral arch of dark roses, dahlias and burgundy ranunculus.
- **DIFFERENTIATOR_3**: A warm-amber par-can stage light grazing the drapes (never RGB).
- **HERO**: TIME = dusk to evening 7pm; VENUE = banquet hall with high ceiling; COMPOSITION = front-on stage shot, slight low angle, full backdrop visible; FOREGROUND = audience-seat silhouette suggestion (out of focus); MIDGROUND = stage with backdrop and arch; BACKGROUND = drape folds; LIGHTING = warm amber stage light, theatrical; LENS = 35mm; APERTURE = f/2.0; FOCUS = the floral arch centre; MOOD = theatrical luxury before performance; COLOUR = wine, gold, burgundy, brass; CULTURAL_NOTES = pan-Indian sangeet — no specific community marker.
- **DETAIL**: (01) close-up of velvet drape fold with a single dahlia; (02) close-up of brass microphone on stand; (03) wide of stage from audience POV; (04) close-up of warm-amber stage light catching dust motes.

### 6. `engagement-roka` — Engagement / Roka

- **DIFFERENTIATOR_1**: A two-seat low ceremonial setup with cushion seating and a brass thali for ring exchange.
- **DIFFERENTIATOR_2**: A flower wall backdrop — fresh roses, eucalyptus, baby's breath.
- **DIFFERENTIATOR_3**: A tilak corner with a small wooden plate of rice, vermillion, and a brass diya.
- **HERO**: TIME = early evening 6pm; VENUE = intimate banquet or home reception room; COMPOSITION = centred two-seat ceremonial space with flower wall behind; FOREGROUND = brass thali with two ring boxes; MIDGROUND = the seats; BACKGROUND = flower wall; LIGHTING = warm tungsten with one soft accent uplighter on the wall; LENS = 85mm; APERTURE = f/2.0; FOCUS = the thali; MOOD = intimate first-promise; COLOUR = blush, ivory, brass, soft jade; CULTURAL_NOTES = pan-Indian Roka — restrained, intimate scale, not wedding-scale.
- **DETAIL**: (01) close-up of two ring boxes on brass thali; (02) close-up of rose-and-eucalyptus wall; (03) wide of the seating area; (04) close-up of vermillion and rice on tilak plate.

### 7. `reception` — Reception

- **DIFFERENTIATOR_1**: A long banquet table with ivory linen, brass urns and taper candles.
- **DIFFERENTIATOR_2**: A back-of-room couple-stage with a soft floral backdrop and two ceremonial chairs.
- **DIFFERENTIATOR_3**: A cake station / dessert table with sculptural florals.
- **HERO**: TIME = blue hour 7pm; VENUE = banquet hall or hotel ballroom; COMPOSITION = receding long table down the centre, stage at the far end; FOREGROUND = candle and table edge; MIDGROUND = full table running back; BACKGROUND = stage with backdrop; LIGHTING = warm tungsten + taper candles; LENS = 35mm; APERTURE = f/2.8; FOCUS = mid-table; MOOD = refined evening; COLOUR = ivory, brass, soft eucalyptus green, candle amber; CULTURAL_NOTES = pan-Indian.
- **DETAIL**: (01) close-up of a single place-setting with brass charger and napkin; (02) close-up of brass urn florals; (03) wide of stage with two ceremonial chairs; (04) close-up of cake or dessert table florals.

### 8. `cocktail-party` — Cocktail party

- **DIFFERENTIATOR_1**: A bar with brass-framed back-bar shelving and amber glassware.
- **DIFFERENTIATOR_2**: High cocktail tables with single-stem florals and votive candles.
- **DIFFERENTIATOR_3**: Moody lighting — black walls, focused pin-spot uplighters.
- **HERO**: TIME = night 9pm; VENUE = lounge / hotel rooftop; COMPOSITION = bar in the right of frame, cocktail tables in mid, soft city lights or terrace darkness behind; FOREGROUND = an amber cocktail glass with citrus garnish; MIDGROUND = the bar; BACKGROUND = high cocktail tables with votives; LIGHTING = pin-spots, no overhead general light, moody; LENS = 35mm; APERTURE = f/1.8; FOCUS = the bar centre; MOOD = lounge sophistication; COLOUR = amber, deep brown wood, brass, charcoal, single rose-pink accent; CULTURAL_NOTES = pan-Indian / urban-Indian sensibility.
- **DETAIL**: (01) close-up of amber cocktail with citrus; (02) close-up of brass back-bar shelving with glassware; (03) wide of the room with cocktail tables; (04) close-up of pin-spot uplighter on a wall texture.

### 9. `birthday-party` — Birthday (adult milestone & themed)

- **DIFFERENTIATOR_1**: A sculptural cake centrepiece on a marble pedestal (no balloon-shop energy).
- **DIFFERENTIATOR_2**: A floral installation backdrop (modern, asymmetric).
- **DIFFERENTIATOR_3**: A dessert table with macarons, candy, hand-calligraphed plaques (text-less).
- **HERO**: TIME = early evening 6:30pm; VENUE = intimate hall or rooftop; COMPOSITION = cake pedestal centre-frame with floral backdrop; FOREGROUND = dessert table edge; MIDGROUND = cake; BACKGROUND = floral wall; LIGHTING = soft directional warm; LENS = 35mm; APERTURE = f/2.5; FOCUS = the cake; MOOD = grown-up milestone; COLOUR = blush, ivory, burnished gold, single deep-red accent; CULTURAL_NOTES = no balloons, no printed banners, no children's-party visual vocabulary.
- **DETAIL**: (01) close-up of cake brushwork and floral top; (02) close-up of dessert table macarons; (03) wide of floral backdrop and cake station; (04) close-up of a brass calligraphy plaque (text-less).

### 10. `anniversary` — 25th / 50th anniversary

- **DIFFERENTIATOR_1**: A long intimate table for 12–24, taper candles, brass and white florals.
- **DIFFERENTIATOR_2**: A vow-renewal or photo-display corner with framed black-and-white prints (frames present, images intentionally blurred to avoid generated text/face issues).
- **DIFFERENTIATOR_3**: A subtle gold-leaf milestone number floral installation (e.g., a brass numeral hung on a floral wreath — keep the numeral generic, do not specify "25" or "50" — render a stylised brass numeral form).
- **HERO**: TIME = blue hour 7pm; VENUE = intimate banquet room with timber detailing; COMPOSITION = long table receding into frame; FOREGROUND = candle and napkin detail; MIDGROUND = table; BACKGROUND = photo-display corner softly out of focus; LIGHTING = warm tungsten + taper candles; LENS = 35mm; APERTURE = f/2.5; FOCUS = mid-table; MOOD = a quiet milestone; COLOUR = ivory, brass, taper-amber, single white-rose accent; CULTURAL_NOTES = pan-Indian, multigenerational.
- **DETAIL**: (01) close-up of taper candle and brass holder; (02) close-up of white-rose-and-eucalyptus brass urn; (03) wide of photo-display corner (frames present, images blurred); (04) close-up of fabric runner with linen napkin and ring.

### 11. `baby-shower-godh-bharai` — Baby shower / Godh Bharai

- **DIFFERENTIATOR_1**: A pastel-palette swing or low-seat ceremonial area for the mother-to-be.
- **DIFFERENTIATOR_2**: A pastel floral installation — peach, blush, soft yellow, dusty mint.
- **DIFFERENTIATOR_3**: A heritage textile (Banarasi or hand-block-print) draped on the swing.
- **HERO**: TIME = late morning 11am; VENUE = home living-room or intimate banquet; COMPOSITION = swing or ceremonial seat centred, floral backdrop behind; FOREGROUND = a small brass thali with rice, betel leaves, fruit; MIDGROUND = the swing; BACKGROUND = pastel floral wall; LIGHTING = warm window light; LENS = 35mm; APERTURE = f/2.2; FOCUS = the swing seat; MOOD = warm intimate anticipation; COLOUR = peach, blush, soft yellow, mint, brass; CULTURAL_NOTES = Godh Bharai pan-Indian — emphasise heritage textile, brass thali ritual items, pastel restraint.
- **DETAIL**: (01) close-up of brass thali ritual items; (02) close-up of heritage Banarasi textile drape; (03) wide of swing and floral wall; (04) close-up of pastel floral cluster.

### 12. `annaprashan-rice-ceremony` — Annaprashan (rice ceremony)

- **DIFFERENTIATOR_1**: A small low decorated ceremonial chair or Pidi for the baby.
- **DIFFERENTIATOR_2**: A brass thali with the seven traditional items (a fistful of rice, a gold coin, a small book, a pen, a clump of clay, a strand of pearls, a small toy) arranged neatly — do not render text on the book.
- **DIFFERENTIATOR_3**: A wall of marigold and a single Alpana floor motif (Bengali rice-paste).
- **HERO**: TIME = late morning 10am; VENUE = Bengali home or intimate hall; COMPOSITION = the baby's seat centred, brass thali in foreground; FOREGROUND = brass thali with seven items; MIDGROUND = baby's seat dressed in cream cotton, no baby in frame; BACKGROUND = marigold wall and Alpana floor; LIGHTING = warm window light; LENS = 35mm; APERTURE = f/2.2; FOCUS = the thali; MOOD = a small intimate Bengali ritual; COLOUR = ivory, marigold, brass, jasmine white; CULTURAL_NOTES = Bengali Annaprashan specifically — Alpana non-negotiable.
- **DETAIL**: (01) close-up of brass thali with seven items; (02) close-up of Alpana on floor; (03) wide of the room; (04) close-up of marigold wall with banana-leaf trim.

### 13. `naamkaran` — Naamkaran (naming ceremony)

- **DIFFERENTIATOR_1**: A pastel-and-gold floral installation, modern restrained.
- **DIFFERENTIATOR_2**: A brass cradle (Jhoola) dressed in soft drape.
- **DIFFERENTIATOR_3**: A small writing-of-name corner — a wooden tray with rice and a sprig of fresh tulsi (do not render the actual name text — leave the rice flat, the name will be added in real life).
- **HERO**: TIME = morning 10am; VENUE = home or intimate hall; COMPOSITION = brass Jhoola centred with floral installation behind; FOREGROUND = the wooden tray with rice and tulsi; MIDGROUND = Jhoola; BACKGROUND = floral wall; LIGHTING = soft window; LENS = 35mm; APERTURE = f/2.2; FOCUS = the Jhoola; MOOD = quiet anticipation; COLOUR = soft pastels, brass, ivory, jade; CULTURAL_NOTES = pan-Indian Naamkaran.
- **DETAIL**: (01) close-up of brass Jhoola and drape; (02) close-up of rice tray with tulsi; (03) wide of the room; (04) close-up of floral installation detail.

### 14. `griha-pravesh` — Griha Pravesh (housewarming)

- **DIFFERENTIATOR_1**: A doorway garland of marigold and mango-leaves (Toran).
- **DIFFERENTIATOR_2**: A pair of brass diyas flanking the threshold.
- **DIFFERENTIATOR_3**: A rangoli (floor art) at the entrance using rice flour and fresh petals — generic auspicious mandala motif, no text.
- **HERO**: TIME = morning 9am; VENUE = the front entrance of a modern Siliguri home; COMPOSITION = the doorway centred, viewed from outside looking in; FOREGROUND = the rangoli on the floor; MIDGROUND = doorway with Toran; BACKGROUND = soft hint of the interior with sheer drape; LIGHTING = soft morning sun from camera-right; LENS = 35mm; APERTURE = f/2.8; FOCUS = the doorway; MOOD = welcoming, auspicious; COLOUR = marigold, mango-green, brass, ivory, soft rose; CULTURAL_NOTES = pan-Indian Griha Pravesh.
- **DETAIL**: (01) close-up of Toran (door garland); (02) close-up of brass diya at the threshold; (03) wide of doorway and rangoli; (04) close-up of rangoli petal-and-rice-flour detail.

### 15. `corporate-events` — Corporate events

- **DIFFERENTIATOR_1**: An architectural floral installation (vertical column, modern).
- **DIFFERENTIATOR_2**: A clean brass-and-charcoal aesthetic, no traditional decor.
- **DIFFERENTIATOR_3**: A product-plinth or speaker-podium (text-less).
- **HERO**: TIME = evening 7pm; VENUE = modern banquet hall or heritage colonial hall; COMPOSITION = centre aisle perspective with installations flanking; FOREGROUND = a brass plinth; MIDGROUND = installations on each side; BACKGROUND = signage frame text-less; LIGHTING = narrow-beam uplighters, restrained ambient; LENS = 35mm; APERTURE = f/4.0; FOCUS = plinth; MOOD = opulent restraint; COLOUR = jade, white, brass, charcoal; CULTURAL_NOTES = pan-Indian corporate, never gaudy.
- **DETAIL**: (01) close-up of orchid-anthurium-monstera installation; (02) close-up of brass plinth; (03) wide of the room aisle; (04) close-up of uplighter beam on textured wall.

### 16. `durga-puja-decoration` — Durga Puja decoration (apartment / cultural-association pandal)

- **DIFFERENTIATOR_1**: A thematic pandal-style backdrop — fabric drapes, hand-painted motifs, terracotta and brass accents.
- **DIFFERENTIATOR_2**: A Durga idol stand or main altar area (the idol is suggested by silhouette / backdrop frame, the actual idol intentionally implied not rendered to avoid AI-rendering of religious iconography incorrectly).
- **DIFFERENTIATOR_3**: A Bengali Alpana floor motif.
- **HERO**: TIME = evening 7pm during festival; VENUE = an apartment complex courtyard or cultural-association pandal; COMPOSITION = the altar frame centred (without the idol — frame and decor visible, central altar area in soft glow); FOREGROUND = Alpana floor motif; MIDGROUND = altar frame; BACKGROUND = decorated pandal interior; LIGHTING = warm festival lighting with diyas and ambient amber; LENS = 35mm; APERTURE = f/2.8; FOCUS = the altar frame; MOOD = festival sacred; COLOUR = red, gold, white, brass, terracotta; CULTURAL_NOTES = Bengali-specific Durga Puja — keep the idol respectfully suggested only, not rendered.
- **DETAIL**: (01) close-up of Alpana motif; (02) close-up of hand-painted fabric drape; (03) wide of the pandal; (04) close-up of brass and terracotta altar lamps.

### 17. `lakshmi-puja` — Lakshmi Puja

- **DIFFERENTIATOR_1**: A small altar with a brass Lakshmi figurine (rendered as a stylised brass form, not photorealistic deity face — keep the figurine in soft focus / silhouette to avoid AI mis-rendering).
- **DIFFERENTIATOR_2**: Marigold and lotus floral arrangement.
- **DIFFERENTIATOR_3**: A trail of small clay diyas (rows of lamps).
- **HERO**: TIME = dusk 6:30pm; VENUE = home interior; COMPOSITION = altar centred, diya trail leading the eye; FOREGROUND = a row of lit clay diyas; MIDGROUND = altar with brass figurine in soft focus; BACKGROUND = soft ivory wall with marigold garland; LIGHTING = warm diya light dominant; LENS = 35mm; APERTURE = f/2.0; FOCUS = the diya row; MOOD = sacred warm; COLOUR = marigold, brass, terracotta, ivory, deep gold; CULTURAL_NOTES = pan-Indian Lakshmi Puja, keep figurine soft-focus.
- **DETAIL**: (01) close-up of clay diya flame; (02) close-up of lotus and marigold; (03) wide of altar with diya trail; (04) close-up of brass items on altar.

### 18. `saraswati-puja` — Saraswati Puja

- **DIFFERENTIATOR_1**: A wooden study desk with stacked books (closed — do not render text on covers), a brass inkwell, and a single white rose.
- **DIFFERENTIATOR_2**: A white-and-yellow floral palette (Saraswati's colours).
- **DIFFERENTIATOR_3**: A bamboo flute laid across the altar.
- **HERO**: TIME = morning 9am; VENUE = a school auditorium or home; COMPOSITION = altar with books and floral installation; FOREGROUND = a brass inkwell and a closed book (no rendered text on cover); MIDGROUND = altar; BACKGROUND = white-and-yellow floral wall; LIGHTING = soft morning; LENS = 35mm; APERTURE = f/2.5; FOCUS = the inkwell; MOOD = scholarly sacred; COLOUR = white, yellow, brass, ivory, jade; CULTURAL_NOTES = pan-Indian Saraswati Puja.
- **DETAIL**: (01) close-up of stacked books (covers blank or generic, no readable text); (02) close-up of white-and-yellow florals; (03) wide of altar; (04) close-up of bamboo flute and brass.

### 19. `private-celebrations` — Private celebrations (catch-all bespoke)

- **DIFFERENTIATOR_1**: An intimate dinner setup — long table, taper candles, brass, single-stem florals.
- **DIFFERENTIATOR_2**: A bespoke installation that hints at customisation (a sculptural floral or fabric piece, distinctly non-formulaic).
- **DIFFERENTIATOR_3**: A custom signage frame (text-less, the client's wording will be added later).
- **HERO**: TIME = blue hour 7:30pm; VENUE = a private home or rooftop; COMPOSITION = long intimate table with bespoke installation; FOREGROUND = a candle and place card (text-less); MIDGROUND = table; BACKGROUND = bespoke installation; LIGHTING = warm tungsten and taper candles; LENS = 35mm; APERTURE = f/2.8; FOCUS = mid-table; MOOD = bespoke intimacy; COLOUR = ivory, brass, taper-amber, single accent (blush or jade depending on candidate); CULTURAL_NOTES = pan-Indian, modern.
- **DETAIL**: (01) close-up of bespoke installation detail; (02) close-up of single-stem floral in brass urn; (03) wide of full table; (04) close-up of candle and brass holder.

---

# 10. CASE STUDIES — 6 launch case studies

Each case study has approximately 25 images: **COVER** (16:9), **BRIEF** (3:2 insert), **SETTING-01..04** (mixed 4:5 and 3:2), **DESIGN-01..03** (4:5), **CHAPTER-DAY-N-01..04** (per-day, ~12 chapter images for a 3-day average), **CLOSING** (16:9).

---

## 10.1 `rinki-aditya-bengali-wedding-2025`

**Brief**: Rinki (bride, 28, Bengali, schoolteacher in Siliguri) and Aditya (groom, 30, Bengali, software engineer in Bangalore) — a four-day full-traditional Bengali wedding in late November 2025, in a Siliguri banquet venue (Mainak Tourist Lodge ballroom + adjacent lawn), 400 guests, theme: "Ivory, Bel-jasmine, brass — quiet Bengali grandeur." Four days: **Day 1 Aiburo Bhaat & Gaye Holud**, **Day 2 Mehendi**, **Day 3 Wedding** (Subho Drishti, Saat Paak, Sindoor Daan, Bashor Ghor), **Day 4 Bou Bhaat / Reception**.

### COVER (16:9)

```
Cinematic editorial cover frame: a wide front-three-quarter shot of the Bengali Mandap on the wedding day at the moment of Subho Drishti. The Mandap is centre, pillars wrapped in fresh Bel jasmine and banana leaves, brass-tipped wooden posts, ivory silk canopy above with a single tuberose cascade. Rinki sits in the centre in red Banarasi saree with gold zari, wearing the Topor (Bengali bridal pith crown) and Mukut, her face purposely turned three-quarters away — identity suggestive. Aditya sits across, in cream silk dhoti and kurta with his own Topor. Between them, the embroidered betel-leaf veil is held by two attendants whose hands only are visible. Floor: copper urli with floating jasmine and lit diya in the foreground. Background: soft hint of the Mainak ballroom. Time: 4:30pm late November, warm Bengal afternoon light from camera-right. Camera: Sony A7R IV, 35mm f/1.4, aperture f/2.0, focus on the veil. Mood: reverent, the heart of a Bengali wedding. Colour: deep red, ivory, brass, jasmine white.
```

### BRIEF (3:2 editorial insert)

```
Editorial inset shot: a small wooden tray on a marble surface holding the wedding card (closed and faced down so no text rendering — only the cream paper back visible with a brass tassel), a sprig of jasmine, a small brass ring, and a single sheet with a hand-written timeline (purposely soft so no readable text). Soft window light from camera-left. Camera: Sony A7R IV, 85mm f/1.8, aperture f/2.0, focus on the brass tassel. Mood: the brief, the beginning of a story.
```

### SETTING-01..04

- **SETTING-01** (4:5): "Wide of the Mainak ballroom emptied of guests, mid-afternoon, before the wedding setup begins — high ceiling, two rows of pillars, the empty stage at the far end, warm wooden floor. Camera 35mm f/2.8, soft window light from camera-left. Mood: 'the canvas before the painting.'"
- **SETTING-02** (3:2): "Wide of the lawn adjacent to the Mainak, late afternoon, where the Gaye Holud is being staged — overhead sheer canopy not yet finished being rigged, two ladders, one team member in the foreground stringing marigold. Camera 35mm f/2.8. Mood: 'the day before.'"
- **SETTING-03** (4:5): "A detail shot of the Mainak's old-world wooden door entrance, with the first Toran of marigold and mango-leaves freshly hung. Soft afternoon light. Camera 85mm f/2.0. Mood: 'welcoming.'"
- **SETTING-04** (3:2): "The hand-painted Alpana floor pattern being completed by a senior team member, hands visible, white rice-paste in a small ceramic bowl, brush in hand. Top-down 70-degree angle. Camera 35mm f/2.2. Mood: 'craft in process.'"

### DESIGN-01..03

- **DESIGN-01** (4:5): "Close-up of a single Mandap pillar — the brass tip, the Bel jasmine wrapping, the banana-leaf trim — photographed against a deep shadow background. Camera 85mm f/2.0. Mood: 'the texture of the brief.'"
- **DESIGN-02** (4:5): "Studio mood-board flat-lay: brass-tip pillar swatch, ivory raw-silk swatch, fresh jasmine strand, mango-leaf, red Banarasi cloth fragment, hand-sketch of the Mandap (purposely soft so no readable text). Top-down. Camera 35mm f/4.0. Mood: 'how the design was decided.'"
- **DESIGN-03** (4:5): "Close-up of the betel-leaf veil embroidery in soft focus, hands of an artisan holding the corner. Camera 85mm f/1.8. Mood: 'the small detail that holds the ritual.'"

### CHAPTER-DAY-1 (Aiburo Bhaat & Gaye Holud) — 4 images

- **DAY-1-01** (4:5): "Vertical editorial — Aiburo Bhaat thali on a Bengali plantain leaf, with steamed rice, ghee, fish, dal, fried vegetables, sweets — arranged in the traditional pattern. Top-down, soft morning window light. Camera 85mm f/2.2. Mood: 'the last meal as a maiden.'"
- **DAY-1-02** (3:2): "Wide of the Gaye Holud setup at the lawn — marigold curtain wall, Pidi centre, copper urli foreground, sun-dappled canopy overhead. No people. Camera 35mm f/2.5. Mood: 'morning of turmeric.'"
- **DAY-1-03** (4:5): "Vertical: a friend's hand mid-application of haldi paste on the bride's forearm, jasmine garland around the wrist, marigold petals scattered. Camera 85mm f/1.8, focus on the wrist. Mood: 'joy in close quarters.'"
- **DAY-1-04** (3:2): "Wide of the bride seated on the Pidi after the ceremony, turmeric streaks on hands and face, two friends laughing beside her — bride's face turned three-quarters. Camera 35mm f/2.0. Mood: 'after the morning.'"

### CHAPTER-DAY-2 (Mehendi) — 4 images

- **DAY-2-01** (4:5): "Vertical: the bride's hand mid-mehendi application, an artisan's hand holding the piping cone, fine intricate pattern emerging on the back of the bride's hand. Camera 85mm f/2.0, focus on the piping tip. Mood: 'concentration.'"
- **DAY-2-02** (3:2): "Wide of the mehendi lounge — cushion cluster, parasols, brass trolley, multiple guests in soft focus. Camera 35mm f/2.5. Mood: 'lounge afternoon.'"
- **DAY-2-03** (4:5): "Vertical detail: a complete mehendi-finished hand resting on a lap of jade silk, the henna dried and dark-orange. Camera 85mm f/1.8. Mood: 'the result.'"
- **DAY-2-04** (3:2): "A row of glass jars on the brass trolley with rose petals and mint, soft afternoon light. Camera 85mm f/2.0. Mood: 'small details of hospitality.'"

### CHAPTER-DAY-3 (Wedding Day — Subho Drishti, Saat Paak, Sindoor Daan, Bashor Ghor) — 4 images

- **DAY-3-01** (4:5): "Vertical: the Saat Paak — the bride seated on the Pidi being lifted by four uncles on her brothers' shoulders, circling the groom seven times. The lift is mid-rotation, motion-blurred slightly. Camera 35mm f/2.0, shutter 1/60. Mood: 'movement of ritual.'"
- **DAY-3-02** (3:2): "Wide of the full Mandap during the ceremony, the priest seated to one side, the couple under the canopy, brass urli foreground. Camera 35mm f/2.5. Mood: 'the whole picture.'"
- **DAY-3-03** (4:5): "Vertical close-up of Sindoor Daan — the groom's hand mid-application of vermillion to the bride's hair-part, his hand and her forehead in frame, her eyes lowered. Camera 85mm f/1.8, focus on the vermillion. Mood: 'the moment of becoming.'"
- **DAY-3-04** (3:2): "The Bashor Ghor at night — mosquito-net canopy, brass khat (bed) dressed with flowers, candles around the room, no people. Camera 35mm f/2.0. Mood: 'the room after the day.'"

### CHAPTER-DAY-4 (Bou Bhaat / Reception) — 4 images

- **DAY-4-01** (3:2): "Wide of the reception stage — backdrop with ivory drapes and sculptural florals, two ceremonial chairs, foreground a hint of guests. Camera 35mm f/2.5. Mood: 'introducing the bride to the new family.'"
- **DAY-4-02** (4:5): "Vertical: the long banquet table laid for Bou Bhaat — banana-leaf plates, brass tumblers, ivory linen. Top-down 75-degree. Camera 35mm f/2.8. Mood: 'the table is set.'"
- **DAY-4-03** (4:5): "Vertical: the bride in a new red Banarasi saree (different from wedding-day) being introduced — face turned three-quarters away, the new family hands reaching to bless her. Camera 85mm f/2.0. Mood: 'welcome.'"
- **DAY-4-04** (3:2): "A late-night detail: the empty ballroom after dinner, two candles still lit, one stray jasmine garland on a chair. Camera 35mm f/2.0. Mood: 'after the celebration.'"

### CLOSING (16:9)

```
Cinematic wide closing frame: the Mandap at night-end, lit only by brass diyas and one warm pendant lamp, empty of people, the cushioned seats still on the floor, a single jasmine garland fallen to the side. Camera 35mm f/2.0, focus on the Mandap centre. Mood: 'the story closes, the room remembers.' Colour: warm tungsten, jasmine ivory, brass.
```

---

## 10.2 `arpita-sanjay-marwari-wedding-2025`

**Brief**: Arpita (bride, 26, Marwari, family in Siliguri) and Sanjay (groom, 29, Marwari, family in Jaipur) — a three-day opulent Marwari wedding in February 2025, banquet venue Sinclairs Siliguri, 500 guests, theme: "Wine, gold, peacock-jewel — Marwari grand-tradition." Three days: **Day 1 Tilak & Mahira Dastoor**, **Day 2 Pithi & Sangeet**, **Day 3 Wedding & Reception**.

### COVER (16:9)

```
Cinematic editorial cover frame: a wide front-on shot of the Marwari wedding Mandap, lit at night, deep wine and gold drapes layered on the structure, marigold-and-rose floral cascades, the groom on his white mare (Ghodi) in the foreground left in mid-procession (Baraat) — the groom's face turned to look ahead, his ornate Sehra of marigold and jasmine falling over his forehead. The Mandap glows in deep gold tungsten, the wine drapes catching light. Camera 35mm f/2.0, focus on the Sehra. Mood: 'opulent arrival, Marwari grand-tradition.' Colour: deep wine, gold, marigold, ivory horse, brass. Cultural specifics: Marwari — Sehra non-negotiable, no Bengali Topor. The groom's outfit is a deep maroon achkan with heavy gold zari.
```

### BRIEF (3:2)

```
Inset flat-lay: the Marwari wedding card holder (cream paper folder closed so no text), a brass-handle dagger ornament (Marwari Kataar), a sprig of marigold, a velvet pouch with gold thread closure. Top-down. Camera 85mm f/2.0. Mood: 'the heritage in the brief.'"
```

### SETTING-01..04, DESIGN-01..03, CHAPTERS, CLOSING

(Use the same structural pattern as the Bengali wedding above. For brevity, here are the substantive substitutions — paste each into the chapter-template structure exactly as above.)

- **SETTING-01** (4:5): Wide of the Sinclairs banquet hall empty, high pillars, before setup. Mood: 'the canvas.'
- **SETTING-02** (3:2): Wide of the lawn adjacent to the hall where Baraat will arrive, with ceremonial gateway under construction. Mood: 'the entrance, in progress.'
- **SETTING-03** (4:5): Detail of the heritage banquet door with the first Toran. Mood: 'welcoming.'
- **SETTING-04** (3:2): Wide of the Sangeet stage under construction at night, lit only by work-lights. Mood: 'craft at midnight.'
- **DESIGN-01** (4:5): Close-up of a Mandap pillar wrapped in deep wine velvet with gold tissue overlay and marigold garland. Mood: 'wine and gold.'
- **DESIGN-02** (4:5): Mood-board flat-lay — wine velvet, gold zari, marigold petals, peacock-feather, brass kalash, hand-sketch (soft). Mood: 'the design language.'
- **DESIGN-03** (4:5): Close-up of a brass kalash with mango leaves and a coconut — the Marwari signature. Mood: 'tradition in brass.'
- **DAY-1 (Tilak & Mahira Dastoor) — 4 images**: (01) Tilak ceremony detail — the groom's forehead receives the tilak, hand mid-application; (02) Wide of the Mahira Dastoor setup with the maternal uncle's family; (03) Detail of the groom's Achkan being adjusted; (04) The Tilak thali — turmeric, vermillion, rice, coconut, gold coin.
- **DAY-2 (Pithi & Sangeet) — 4 images**: (01) Detail of the Pithi paste application (turmeric, sandalwood, rosewater) on the bride's arm; (02) Wide of the Sangeet stage at peak performance, performers silhouetted; (03) Detail of the bride's lehenga zari work; (04) Wide of the audience under the chandeliers from a low rear angle.
- **DAY-3 (Wedding & Reception) — 4 images**: (01) The Baraat arrival — the groom on the Ghodi, the procession behind; (02) The Pheras (seven circles around the sacred fire) — wide, fire glow centre; (03) Detail of the gold sindoor Daan; (04) The reception at night — the stage glowing wine and gold, the couple in different outfits, hint of the audience.
- **CLOSING** (16:9): The Mandap after the wedding, only candles lit, deep wine drapes glowing in the warm light, empty of people. Mood: 'opulence at rest.'

---

## 10.3 `tea-garden-destination-darjeeling-2025`

**Brief**: Niharika (bride, 27, Bengali) and Karan (groom, 31, Punjabi) — a three-day destination wedding in late October 2025 at Glenburn Tea Estate, Darjeeling, 80 guests, theme: "Tea garden, alpenglow, fresh local florals." Three days: **Day 1 Welcome dinner & Mehendi**, **Day 2 Haldi & Wedding**, **Day 3 Reception with Kanchenjunga sunrise**.

### COVER (16:9)

```
Cinematic wide cover frame: a destination wedding ceremony at Glenburn Tea Estate, late afternoon, the Mandap structure sits in the open lawn with the green tea rows rolling away into the mid-distance and the alpenglow on Kanchenjunga catching the far horizon in soft focus pink-gold. The Mandap is restrained — four slim brass-tipped poles, sheer ivory drapes, fresh local florals (rhododendron, white roses, fresh fern, eucalyptus). A single brass urli with floating petals in the foreground. No people in frame. Time: 5pm late October. Camera 35mm f/2.2, focus on the Mandap, mountain in soft focus. Mood: 'destination quiet luxury.' Colour: ivory, jade tea-rows, brass, alpenglow pink-gold. Cultural specifics: Bengali-Punjabi inter-marriage — Mandap respectful of both traditions, no Topor in this cover (used in Day-2 ceremony detail), no Sehra in cover.
```

### BRIEF (3:2), SETTING-01..04, DESIGN-01..03, CHAPTERS, CLOSING

- **BRIEF**: A tea-leaf-pressed page in a wooden invitation, soft window light. Mood: 'destination brief.'
- **SETTING-01** (4:5): Wide of the Glenburn estate exterior — the colonial bungalow, the lawn, the tea rows. Mood: 'the venue.'
- **SETTING-02** (3:2): Detail of the bungalow's wraparound veranda being set up for welcome dinner. Mood: 'arrival.'
- **SETTING-03** (4:5): Wide of the lawn at sunrise, mist over the tea rows, Kanchenjunga visible. Mood: 'the morning of.'
- **SETTING-04** (3:2): Detail of a local guide arranging fresh rhododendron in a brass urn. Mood: 'local craft.'
- **DESIGN-01** (4:5): Close-up of the Mandap pole wrapped in eucalyptus and rhododendron. Mood: 'local-first design.'
- **DESIGN-02** (4:5): Mood-board flat-lay: tea leaf, eucalyptus, rhododendron, fern, ivory linen, brass, hand-sketch. Mood: 'the brief.'
- **DESIGN-03** (4:5): Close-up of the place-card on dinner table — a single fern frond as natural calligraphy holder (text-less). Mood: 'detail.'
- **DAY-1 (Welcome & Mehendi)**: (01) Wide of the welcome dinner on the veranda at dusk; (02) Detail of mehendi application in the bungalow drawing room; (03) Bride's hand resting on a fern; (04) Late-night close-up of a candle and a tea-leaf on a wooden table.
- **DAY-2 (Haldi & Wedding)**: (01) Detail of Haldi paste on the bride's hand with rhododendron petals; (02) The Mandap at the wedding moment, light pouring in from camera-right, alpenglow visible far behind; (03) Detail of Subho Drishti or the equivalent moment — the couple's first gaze; (04) The Pheras around a small contained fire on the lawn.
- **DAY-3 (Reception with sunrise)**: (01) The sunrise reception setup — long table on the lawn at 6am, mist clearing, Kanchenjunga gold; (02) Detail of a brass cup of first-flush tea on the table; (03) Wide of the family seated, sun rising behind; (04) A guest holding a tea cup, soft focus, mountain behind.
- **CLOSING** (16:9): The lawn after the wedding, the Mandap still standing, tea garden green in late-morning light, one chair turned, jasmine on the seat. Mood: 'the estate keeps the memory.'

---

## 10.4 `rohit-50th-birthday-2026`

**Brief**: Rohit (50, professional, Siliguri) — an intimate milestone 50th birthday in February 2026, at a private rooftop venue in Siliguri, 60 guests, theme: "Charcoal, blush, burnished gold — grown-up milestone." One day.

### COVER (16:9)

```
Cinematic editorial cover: a rooftop intimate gathering at blue hour, a long table dressed in ivory linen with taper candles every other place setting, brass urns of blush and burgundy florals, a sculptural cake on a marble pedestal at the far head of the table, a charcoal-grey wall behind with a sculptural floral installation. The Siliguri skyline behind in soft bokeh, the first city lights just on. Camera 35mm f/2.5, focus on the cake at far end. Mood: 'milestone quiet luxury.' Colour: ivory, brass, blush, burnished gold, deep blue blue-hour sky.
```

### BRIEF (3:2), SETTING-01..04, DESIGN-01..03, CHAPTERS, CLOSING

(For a one-day case study, we use 8 "chapter" images instead of 12.)

- **BRIEF**: A flat-lay of the invitation card (folded so no text), a brass numeral charm (stylised "50" or generic numeral — keep it stylised), a single dahlia. Mood: 'the milestone.'
- **SETTING-01..04**: Rooftop wide before setup; the marble cake pedestal being placed; the floral installation rigging; the lighting tech adjusting uplighters at dusk.
- **DESIGN-01..03**: Close-up of cake brushwork; close-up of charcoal wall with installation; close-up of taper candle and brass.
- **CHAPTERS (8 images)**: (01) Wide of guests arriving at dusk, hint of figures; (02) Detail of welcome cocktails on a brass tray; (03) Wide of the table at dinner peak — candles lit, conversation in soft focus; (04) Detail of a single place-setting with name card (text-less); (05) The cake-cutting moment, hands and cake only, no face; (06) Wide of a toast — silhouettes raising glasses; (07) Detail of a guest laughing in soft focus; (08) Late-night detail of a single candle and a half-eaten plate of cake.
- **CLOSING** (16:9): The rooftop after midnight, one candle still burning, the city lit below, the table cleared but the floral installation still in place. Mood: 'a quiet end to a milestone.'

---

## 10.5 `mukherjee-annaprashan-2025`

**Brief**: The Mukherjee family — Annaprashan (rice ceremony) for baby Ananya (6 months) in September 2025, at the family home in Siliguri (Pradhan Nagar), 40 guests, daytime, theme: "Bengali heritage soft restraint — Alpana, marigold, brass, jasmine." One day, daytime.

### COVER (16:9)

```
Cinematic editorial cover: the family living room set up for Annaprashan, a small low decorated ceremonial chair at centre (no baby in frame — chair empty, set up), a wall of fresh marigold behind, hand-painted white Alpana motif on the floor in front, a brass thali with the seven traditional ritual items (rice, gold coin, generic closed book, brass pen, clay clump, pearl strand, small wooden toy) in the foreground. Time: 10am late September, soft Bengali morning light through a high window. Camera 35mm f/2.2, focus on the thali. Mood: 'a quiet Bengali ritual at home.' Colour: marigold, ivory, brass, jasmine. Cultural specifics: Bengali Annaprashan — Alpana, brass thali, marigold non-negotiable. No baby in this frame.
```

### BRIEF (3:2), SETTING, DESIGN, CHAPTERS (8 images), CLOSING

- **BRIEF**: The folded invitation with a brass charm. Mood: 'small ceremony.'
- **SETTING-01..04**: Wide of the empty living room before setup; the Alpana being painted; the marigold wall being hung; the brass thali being arranged.
- **DESIGN-01..03**: Close-up of Alpana brushwork; close-up of the thali items; close-up of the chair fabric (cream cotton).
- **CHAPTERS (8)**: (01) Guests arriving; (02) The brass thali fully set, top-down; (03) The ceremonial chair lit by window light, empty; (04) Detail of an aunt's hands placing rice into the thali; (05) A guest in soft focus admiring the marigold wall; (06) Detail of a banana-leaf serving platter with sweets; (07) Wide of the room with guests in soft focus mid-ceremony; (08) Detail of one fallen marigold on the Alpana after the ceremony.
- **CLOSING** (16:9): The living room after the ceremony, ceremonial chair empty, Alpana intact, brass thali set aside, soft afternoon light. Mood: 'the home holds the memory.'

---

## 10.6 `prestige-corporate-launch-2026`

**Brief**: Prestige Group — a corporate product launch / heritage banquet event at a heritage colonial banquet hall in Siliguri, March 2026, 200 invited guests, evening, theme: "Architectural florals, charcoal, brass, restrained corporate luxury."

### COVER (16:9)

```
Cinematic editorial cover: the heritage banquet hall interior at evening, a long centre aisle of polished black stone flanked by tall slim brass plinths each topped with an architectural floral installation (white phalaenopsis, monstera, anthurium, eucalyptus), warm tungsten chandeliers overhead, a back-lit signage frame at the far end (intentionally text-less). A single waist-height brass plinth with curved glass top in the foreground — the product reveal stage. No people. Camera 35mm f/2.8, focus on the foreground plinth, aisle in soft focus. Mood: 'corporate luxury restraint.' Colour: jade, white, brass, charcoal, ivory, single deep-blue ambient wash on the far wall.
```

### BRIEF (3:2), SETTING, DESIGN, CHAPTERS (8 images), CLOSING

- **BRIEF**: Flat-lay of the corporate event briefing folder (closed, text-less), a brass paperweight, a sprig of eucalyptus. Mood: 'the brief.'
- **SETTING-01..04**: Wide of the heritage hall empty; the brass plinths being delivered; the floral team installing the columns; the lighting tech testing uplighters.
- **DESIGN-01..03**: Close-up of one floral column at brass-plinth top; close-up of the back-lit signage frame text-less; close-up of the product-reveal plinth glass top.
- **CHAPTERS (8)**: (01) Guests arriving at the heritage doorway; (02) Welcome drinks on a brass tray; (03) Wide of the aisle filled with guests in soft focus pre-reveal; (04) Detail of the product-reveal moment — a silhouette of a hand pulling a velvet cover; (05) Wide of the reveal stage post-reveal, single product on the plinth (render the product as a generic high-end object — a watch, a perfume bottle, a leather goods piece, soft focus, no text); (06) Detail of a guest's hand holding a brass-printed program (intentionally face-down so no text); (07) Wide of the dinner — long table with corporate guests in soft focus; (08) Detail of a single floral column with one petal fallen.
- **CLOSING** (16:9): The hall at the end of the evening, the columns still glowing, the aisle empty, one champagne glass on a plinth. Mood: 'the brand takes its bow.'

---

# 11. DAY ↔ NIGHT DECOR SWITCHER PAIRS (the signature interactive section)

**This is the most important section of the document — execute it with care.**

10 compositions × 2 lighting states = 20 images. For each pair you run a **two-step workflow**:

### Two-step workflow (read once, repeat for each pair)

**STEP 1 — Generate the DAY image.**

1. Open Gemini Studio → Imagen 4.
2. Set the aspect ratio knob to the pair's stated aspect.
3. Paste: Universal Style Block (§2) + the pair's DAY prompt + Hyper-Realism Specs (§4).
4. Negative-Prompt field: Negative Block (§3).
5. Generate 4 candidates. Pick the strongest, save as `DECOR-[PAIR]-DAY.jpg` (e.g. `DECOR-MANDAP-01-DAY.jpg`).

**STEP 2 — Generate the matching NIGHT image as an image-to-image edit.**

1. Still in Gemini Studio, open the **Edit Image** mode (in some interfaces called "Image-to-image" or "Edit with prompt"; in Vertex AI use the "Imagen 4 edit" endpoint; in Gemini 2.5 use the image-attachment + prompt mode).
2. **Upload the DAY image you just saved** as the reference / source image.
3. Paste: Universal Style Block (§2) + the **anchor phrase** + the pair's NIGHT prompt + Hyper-Realism Specs (§4).
4. The **anchor phrase** (paste verbatim before the NIGHT prompt):

```
ANCHOR INSTRUCTION — Same exact composition, framing, props, subjects, camera position, decor positions, fabric folds, floral arrangements and overall layout as the uploaded reference image. ONLY the lighting transforms — the decor and structures are unchanged. Do not introduce new objects. Do not move or remove existing objects. Do not change subject positions or expressions. Do not change camera angle or framing. The image must read as the SAME PHYSICAL SCENE photographed at a different time of day with different practical lighting on.
```

5. Negative-Prompt field: Negative Block (§3) **plus** these extras: `new objects, removed objects, repositioned objects, different camera angle, different framing, changed subject pose, changed clothing, changed expression, hallucinated additions`.
6. Generate 4 candidates. **Verify each one against the QC checklist below**, then save the strongest as `DECOR-[PAIR]-NIGHT.jpg`.

### Per-image QC for the NIGHT version (run on all 4 candidates, reject anything that fails)

1. **Identical framing**: overlay mentally — does every prop sit in the exact same pixel zone?
2. **Identical decor positions**: every drape, garland, candle, urn must be in the same place.
3. **Believable practical light sources**: the night version should show **where the light is coming from** — candles, festoon bulbs, uplighters, lanterns — and those sources should be visible IN the frame (or just out of frame, with believable falloff).
4. **No hallucinated new objects**: Gemini sometimes adds an extra candle or a new garland. Reject.
5. **Same camera angle**: same eye-line, same perspective, same lens compression.
6. **Brightness drop without subject change**: subjects and clothing must be unchanged — only the light reads differently.
7. **Same colour cast where applicable on unchanged materials**: brass should still read brass (just warmer), ivory should still read ivory (just dimmer), jasmine should still read white (just under candlelight).
8. If 3 of the 4 candidates fail, regenerate with the anchor phrase strengthened — add the line *"This is a STRICT no-change edit on everything except light. Even a 1% change in decor position is a failure."*

### Naming convention

```
public/media/decor-pairs/
  mandap-01-day.jpg     ← DAY version
  mandap-01-night.jpg   ← NIGHT version
  stage-01-day.jpg
  stage-01-night.jpg
  ...
```

---

## 11.1 `DECOR-MANDAP-01` — Traditional Bengali mandap (4:5)

### DAY prompt

```
Editorial cinematic vertical (4:5) of a traditional Bengali wedding Mandap, photographed centred at front-three-quarter angle, in the late afternoon. Mandap: four brass-tipped wooden pillars wrapped vertically with fresh Bel (white jasmine) garlands and banana-leaf trim, ivory raw-silk drapes falling along each pillar, an open lattice roof of woven mango leaves and banana stalks, a single cascading tuberose stem from the centre. Mandap floor: a cream Persian-style rug, a copper urli with floating jasmine and a small unlit brass diya, two empty low cushioned seats. Background: a hand-painted Alpana motif (white rice-paste lotus) on the floor in front of the Mandap, a soft ivory plaster wall behind. No people. Time: 4pm late afternoon, soft Bengal sun pouring in from camera-right at 30 degrees, motes of dust in the light beam, golden hour quality. Camera: Sony A7R IV, 35mm f/1.4, aperture f/2.2, ISO 200, focus on the Mandap centre. Mood: airy, reverent, Bengali heritage in daylight. Colour: ivory, jasmine white, brass, mango-green, soft red of the rug.
```

### NIGHT prompt (image-to-image edit on the DAY image)

```
[ANCHOR INSTRUCTION above]

Now transform the lighting only. The scene is after sunset — 7:30pm. The brass diya on the Mandap floor is now LIT, flame steady. Add two additional small clay diyas on the rug floor that we now reveal had been there all along, lit. Two warm tungsten uplighters at the base of the Mandap pillars cast a soft glow up the silk drapes. A row of small warm festoon bulbs (visible in the frame) is hung along the underside of the Mandap roof, lit. The ambient room light has dropped — the plaster wall behind is in deep velvety shadow, the Alpana motif on the floor is partially in shadow, partially catching candle pool. The motes of dust now drift in the festoon-light beams. The brass glows warmer (more amber). The ivory drapes catch warm pools of candlelight. Outside the implied window, blue-hour twilight is visible only as a hint at one edge. Colour palette: deep velvet shadows, warm tungsten amber, jasmine white catching candle pool, brass glowing amber. Everything else in the frame — Mandap structure, drape positions, jasmine garlands, banana-leaf roof, copper urli position, cushion positions, Alpana motif (where lit), camera angle and focal length — is UNCHANGED.
```

---

## 11.2 `DECOR-MANDAP-02` — Modern minimal mandap (4:5)

### DAY

```
Editorial cinematic vertical (4:5) of a modern minimal wedding Mandap, photographed centred at front-three-quarter angle, in late morning. Mandap: four slim matte-white square pillars (no traditional wrapping), a sheer organza canopy in white above, a sculptural cluster of white orchids, white anthurium and trailing eucalyptus suspended from the canopy centre. Floor: polished cream stone, two clear acrylic ghost-chairs as ceremonial seats, a single brass urli with white floating roses. Background: a sheer ivory drape backdrop wall, a single architectural crystal-pendant chandelier hanging above. No people. Time: 11am, soft diffuse daylight through a high window, no direct sun. Camera 35mm f/1.4 at f/2.2. Mood: modern luxury, architectural restraint. Colour: white, ivory, brass, soft jade-eucalyptus green, crystal sparkle.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms only — evening, 8pm. The crystal-pendant chandelier above is now LIT (warm dimmable LED, not cool-white). The brass urli holds three lit floating candles (revealed to have been there). Add three subtle slim brass uplighter beams at the base of the Mandap pillars, casting narrow upward warm gradients up the white pillars. A row of warm-white festoon bulbs (visible) crisscrosses the canopy underside. Ambient room light has dropped — the backdrop wall is in deep velvet near-black shadow except where the chandelier's pool reaches, the ghost-chairs catch warm reflections. Time outside is blue-hour, hinted at the edge as cool-blue contrast. Brass glows warm-amber. Orchids and roses catch candle highlights. Everything else — Mandap structure, drape positions, ghost-chair positions, urli, orchid suspension, eucalyptus, camera angle — UNCHANGED.
```

---

## 11.3 `DECOR-STAGE-01` — Sangeet stage (16:9)

### DAY

```
Editorial cinematic wide (16:9) of a sangeet stage, photographed front-on at slight low angle, in late afternoon. Stage: a raised dark-wood platform, backdrop of three vertical layered drapes (deep wine velvet base, gold tissue overlay, ivory silk in front), a sculptural floral arch corner of dark-red roses, dahlias and burgundy ranunculus at the proscenium left, with one trailing amaranth cascade. A single microphone stand silhouetted at stage right. Floor: polished dark wood. Background: a hint of a darkened banquet hall behind. No people. Time: 3pm — house lights up for tech rehearsal, daylight pouring in from house-right high window. Camera 35mm f/1.4 at f/2.0. Mood: theatrical luxury in daylight. Colour: wine, gold, ivory, burgundy, dark wood.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — evening 8:30pm, performance about to begin. House lights are off. Two warm-amber par-cans (visible above frame as light sources) graze the drapes from front-right at 30 degrees, throwing deep shadow into the velvet folds. A narrow follow-spot in warm tungsten holds on the microphone stand. Two ground-level uplighters at the proscenium add warm brass uplight on the floral arch. Add subtle dust-mote light in the par-can beams. The dark wood floor catches warm reflections. Outside (offstage) goes to near-black velvet shadow. Brass glows warmer. Colours saturate: wine deepens, gold brightens in the spots. Everything else — drape positions, floral arch, microphone stand position, camera angle — UNCHANGED.
```

---

## 11.4 `DECOR-STAGE-02` — Reception stage (16:9)

### DAY

```
Editorial cinematic wide (16:9) of a reception stage, photographed front-on, in late afternoon. Stage: a raised dais with two ornate cushioned ceremonial chairs (couple-seats) facing the audience, an ivory drape backdrop with a sculptural soft floral arch of white roses, blush dahlias, eucalyptus and trailing amaranth. Ground florals: two large brass urns of the same palette at the base of the dais. Background: a hint of the banquet hall, soft bokeh. No people. Time: 4:30pm, soft daylight from high windows house-left. Camera 35mm f/1.4 at f/2.5. Mood: refined reception elegance in daylight. Colour: ivory, blush, soft jade-eucalyptus, brass, warm wood floor.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — evening 7:30pm. House overhead lights have dimmed. A subtle warm key light from house-right washes the chairs in soft warm pool. Two narrow uplighters at the base of the dais add brass uplight on the backdrop drape. Festoon bulbs (visible) crisscross the proscenium above. The brass urns now contain lit taper candles (revealed to have been there). The wood floor catches warm reflections. Outside falls to deep blue-hour velvet. Brass glows amber. Roses and dahlias catch candle highlights. Everything else — chair positions, backdrop, floral arch, brass urns, camera angle — UNCHANGED.
```

---

## 11.5 `DECOR-HALDI-01` — Haldi backdrop (1:1)

### DAY

```
Editorial cinematic square (1:1) of a Haldi setup, photographed front-on at eye-level, in late morning. Centre-frame: a low Bengali Pidi (wooden ceremonial stool) dressed in turmeric-yellow handloom cotton, a brass thali at its foot with turmeric paste, marigold petals and lemon halves. Behind the Pidi: a vertical wall of fresh marigold-petal strings (genda curtain), 2 metres wide. To the side: a copper urli with floating yellow marigold petals and one floating jasmine. No people. Time: 11am, soft sun-dappled top light filtered through an ivory sheer canopy overhead, warm. Camera 35mm f/1.4 at f/2.2. Mood: joyful warm Haldi morning. Colour: marigold-yellow dominant, brass, mango-leaf green, ivory.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — early evening 7pm, ambient daylight is gone. Add two lit clay diyas placed at the base of the Pidi (revealed to have been there). The copper urli now has three lit floating candles. A warm tungsten pendant lamp hangs from above (visible at top of frame), lit, casting a focused warm pool over the Pidi and thali. Marigold curtain falls into deep velvet shadow at the edges with a warm amber rim where the pendant catches it. Brass glows warm-amber. Turmeric reads deeper-yellow. Everything else — Pidi position, thali, marigold curtain, urli position, camera angle — UNCHANGED.
```

---

## 11.6 `DECOR-MEHENDI-01` — Mehendi corner (1:1)

### DAY

```
Editorial cinematic square (1:1) of a Mehendi corner, photographed at slight overhead angle, in early afternoon. Composition: a lounge cluster — three floor cushions in jade-green and dusty-rose handloom on a printed dhurrie, a brass tea trolley with three glass jars of fresh rose petals, mint and gooseberry, a silver thali with henna piping cones and lemon halves on the dhurrie. Above: two hand-painted paper-and-bamboo parasols (Rajasthani-style) tilted at angles, suspended. Background: sheer ivory drape catching breeze. No people. Time: 1pm, dappled afternoon light through the parasols casting pattern on the dhurrie. Camera 35mm f/1.4 at f/2.5. Mood: lounge-y slow afternoon. Colour: jade, dusty rose, brass, soft ivory, printed reds in dhurrie.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — evening 7:30pm. Daylight is gone. Add a row of warm-white festoon bulbs strung between the parasols (visible), lit, casting a warm pattern on the dhurrie and cushions. Two ground brass candle-lanterns (revealed to have been there) glow on the dhurrie at the cushion edge. The sheer drape catches warm tungsten falloff. Shadows in the corners deepen to velvet. Brass glows warm-amber. Jade cushions read deeper, rose reads dustier. Everything else — cushion positions, trolley, parasol suspension, dhurrie, silver thali, camera angle — UNCHANGED.
```

---

## 11.7 `DECOR-BDAY-01` — Milestone birthday setup (3:2)

### DAY

```
Editorial cinematic horizontal (3:2) of a milestone birthday setup, photographed front-on at eye-level, in early afternoon. Centre-frame: a marble cake pedestal holding a sculptural three-tier cake (pale blush buttercream, burnished gold-leaf brushwork, topped with white anemones and a single deep-red dahlia). Behind: a modern asymmetric floral installation backdrop on a charcoal-grey wall (dusty-rose roses, white anemones, champagne hydrangea, eucalyptus). To the side: a dessert station with a brass stand holding macarons and a single brass calligraphy plaque (text-less). No people. No balloons. Time: 2pm, soft directional daylight from camera-left, no harsh shadow. Camera 35mm f/1.4 at f/2.5. Mood: grown-up milestone elegance. Colour: blush, ivory, burnished gold, deep-red dahlia accent, charcoal-grey wall.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — evening 7pm. Daylight is gone. Add a narrow warm-tungsten downlighter centred above the cake pedestal, casting a focused warm pool on the cake — the burnished gold leaf catches highlight. Two ground uplighters at the base of the floral backdrop wash warm-amber up the installation. The charcoal-grey wall deepens to near-black at the edges. The dessert station catches a soft side-glow from a hidden warm sconce. Add a single lit taper candle in a brass holder on the dessert station (revealed). Brass glows warm-amber. Blush deepens. Everything else — cake position, pedestal, floral installation, dessert station, camera angle — UNCHANGED.
```

---

## 11.8 `DECOR-BDAY-02` — Kids' themed birthday (editorial, NOT balloon-shop) (3:2)

### DAY

```
Editorial cinematic horizontal (3:2) of an editorial-themed children's birthday, photographed at slight overhead angle, in mid-afternoon. Centre-frame: a low children's table set for eight, covered in soft pastel-mint linen, with hand-folded napkins in dusty-rose and a small craft-paper plate at each setting. A sculptural single-tier cake at the table centre in pastel buttercream with hand-piped fine details (no characters, no brand IP). Behind: a soft pastel floral wall installation in mint, pastel-yellow, dusty-rose, ivory. Two paper-and-bamboo parasols hung from above (one mint, one rose). No balloons. No printed banners. Time: 3pm, soft directional daylight from camera-right. Camera 35mm f/1.4 at f/2.8. Mood: restrained editorial children's, opposite of balloon-shop. Colour: pastel mint, dusty rose, pastel yellow, ivory, brass.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — early evening 6pm. Daylight is fading. Add warm-white fairy lights strung between the parasols (visible), lit, casting soft warm glow on the table and floral wall. Add four small votive candles in glass holders on the table (revealed to have been there), lit. The floral wall catches warm-amber rim light from a hidden uplighter. Brass napkin rings catch candle pool. The walls beyond fall to deep velvet shadow. Everything else — table setup, plate positions, cake, floral wall, parasol positions, camera angle — UNCHANGED.
```

---

## 11.9 `DECOR-ANNIV-01` — 25th/50th anniversary table (3:2)

### DAY

```
Editorial cinematic horizontal (3:2) of an intimate anniversary long table, photographed front-on at slight low angle, in late afternoon. Table: 4 metres long, ivory linen, set for sixteen — every place setting has a brass charger, white-bone-china plate, gold-rimmed crystal glasses, a hand-calligraphed place card (text-less, soft focus). Down the centre: a runner of low brass urns with white roses, eucalyptus, and silver-dollar leaves, alternated with tall brass taper-candle holders (candles unlit in the day). At the far end: a sculptural floral installation against the wall. Above: a row of warm-wood pendant lamps (unlit in day). No people. Time: 4pm, soft daylight pouring in from a tall window house-left. Camera 35mm f/1.4 at f/2.5. Mood: refined milestone intimacy in daylight. Colour: ivory, brass, soft eucalyptus green, white roses.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — blue hour 7pm. Daylight has dropped. The taper candles down the centre of the table are now LIT (every other one). The wood pendant lamps overhead are LIT (warm tungsten). The window beyond catches blue-hour twilight as cool contrast. The brass urns catch warm pool. The floral installation at the far end has a subtle uplighter glow. Brass glows amber. White roses catch candle highlight. Shadows under the table go to velvet. Everything else — table position, place settings, runner, floral installation, camera angle — UNCHANGED.
```

---

## 11.10 `DECOR-ENTRY-01` — Wedding entry arch (4:5)

### DAY

```
Editorial cinematic vertical (4:5) of a wedding entry archway, photographed front-on at eye-level, in late afternoon. Composition: a freestanding arched gateway, approximately 3 metres tall, built of dark wood frame, draped with cascading fresh marigold-and-rose torans, with a base of woven mango-leaf trim. Pathway leading to the arch is strewn with rose petals and a few marigold blooms. Two brass diyas flanking the threshold (unlit in day). Background: a hint of the banquet venue exterior, soft bokeh. No people. Time: 4:30pm, golden hour, warm sun pouring from camera-right at 30 degrees. Camera 35mm f/1.4 at f/2.2. Mood: welcoming, the threshold to a celebration. Colour: marigold orange, deep rose red, mango-green, brass, ivory pathway stone.
```

### NIGHT

```
[ANCHOR INSTRUCTION]

Lighting transforms — evening 7:30pm, dusk. The two brass diyas at the threshold are now LIT, flames steady. Add warm festoon bulbs strung along the inner curve of the arch (revealed), lit. Add a row of small clay diyas along the petal-strewn pathway leading to the arch (revealed), lit, creating a runway of warm pools. The arch florals catch warm-amber rim light from a hidden uplighter at the base. The background falls to blue-hour twilight beyond. Brass glows amber. Marigold and rose deepen in colour. Pathway stone catches warm pools. Everything else — arch structure, toran positions, pathway petals, diya positions, camera angle — UNCHANGED.
```

---

# 12. ABOUT PAGE — 16 images

### `ABOUT-01` — Founder hero portrait (3:2)

Use the prompt at `HERO-02` above as the primary; this is the same image. (HERO-02 doubles as ABOUT-01.)

### `ABOUT-02` — Founder at work (3:2)

```
Editorial wide-angle of the founder mid-installation at a venue, photographed from the side at a slight low angle. Subject: same South Asian person from ABOUT-01, now standing on a low step-ladder mid-rig, hands above head adjusting a hanging tuberose cascade on a Mandap canopy. Wearing a black handloom kurta, sleeves rolled to elbow, brass cuff. Below the ladder: a junior team member handing up a fresh strand of jasmine. Background: a half-built Mandap, soft afternoon light. Camera 35mm f/1.4 at f/2.5. Mood: "hands-on, working studio." Colour: ivory, jasmine white, brass, warm wood.
```

### `BTS-01` — Hands stringing jasmines (4:5)

```
Editorial close-up vertical of two pairs of hands stringing jasmine garlands at a wooden workshop bench. The hands are South Asian, of working age (one pair younger, one older), threading a needle with strong cotton through fresh jasmine buds. Foreground: a pile of loose jasmine, a small ceramic bowl of water, a brass thimble. Background: soft bokeh of a workshop wall with a row of finished garlands hung. Soft natural window light. Camera 85mm f/1.8 at f/2.0. Mood: 'craft in slow time.' Colour: jasmine white, warm wood, brass, ivory.
```

### `BTS-02` — Team rigging a mandap (3:2)

```
Editorial wide of three team members on stepladders rigging a Mandap canopy at an empty venue, mid-afternoon, work in progress. Team members are South Asian, in dark work-shirts. One holds a strand of jasmine, another adjusts a drape, the third on the ground steadies a ladder. Foreground: tool bags and floral crates. Soft natural light. Camera 35mm f/1.4 at f/4.0. Mood: 'the studio at work.' Colour: ivory, warm wood, brass, neutral team uniforms.
```

### `BTS-03` — Lighting test, evening (3:2)

```
Editorial wide of a Mandap mid-lighting-test at dusk, with one team member at a small DMX board on the side (board is generic, no readable text), warm-amber uplighters lighting one pillar but not yet the others, the rest of the Mandap in half-shadow. The asymmetry shows the test in progress. Camera 35mm f/1.4 at f/2.5. Mood: 'finding the light.' Colour: warm tungsten, deep velvet shadow.
```

### `BTS-04` — Fabric draping in detail (4:5)

```
Editorial close-up of a team member's hands carefully pinning a silk drape to a Mandap pillar — the brass pin going through layered silk and organza, the folds being arranged. Camera 85mm f/1.8 at f/1.8, focus on the pin. Mood: 'precision in cloth.' Colour: ivory silk, brass pin.
```

### `BTS-05` — Truck unloading at venue (3:2)

```
Editorial wide of a small white logistics truck parked at a banquet venue's service entrance, mid-afternoon, two team members carrying a tall floral installation toward the entrance. Foreground: a few floral crates on the ground. The truck is generic — no readable brand text. Camera 35mm f/1.4 at f/4.0. Mood: 'arrival on event day.' Colour: warm asphalt, ivory truck, brass crate accents.
```

### `BTS-06` — Late-night working candid (4:5)

```
Editorial vertical of two team members working late in a half-built venue at 11pm, the Mandap behind them complete, the pair seated cross-legged on the floor, drinking chai from a paper cup, faces softly lit by a hanging work-lamp. One smiles tiredly. Camera 35mm f/1.4 at f/2.0. Mood: 'the hour after the brief.' Colour: warm tungsten, deep velvet shadow.
```

### `TEAM-01..08` — Eight individual team headshots (4:5 each)

For each, run the **shared headshot template** below with the listed variations.

**Shared headshot template** (paste after Universal Style Block):

```
Editorial vertical headshot (4:5) of [SUBJECT_DESCRIPTION], South Asian, photographed against a soft cream studio backdrop or against a soft venue wall in natural window light. Three-quarter framing — head, shoulders, and a hint of torso. Subject is engaged but relaxed, eyes to camera with a slight smile, neither corporate-stiff nor candid-laughing. Soft directional natural window light from camera-left, gentle Rembrandt shadow on the right side of the face. Camera Sony A7R IV, 85mm f/1.8 at f/2.0, focus locked on the eyes. Mood: 'a member of the studio, not a brochure model.' Colour: warm ivory, soft skin warmth, the subject's chosen wardrobe with one brass accent (cuff, ring, earring).
```

Variations:

- **TEAM-01**: Lead designer — South Asian woman, late 30s, Bengali, wearing a charcoal handloom shirt with a thin brass necklace, hair tied back loosely, calm authoritative gaze.
- **TEAM-02**: Floral lead — South Asian man, mid-40s, Nepali heritage, wearing a deep-green linen kurta, hands resting on a single jasmine sprig at chest height (in-frame at bottom), warm steady gaze.
- **TEAM-03**: Lighting tech — South Asian man, early 30s, Bengali, wearing a black tee and a thin brass chain, a small lapel mic clip visible, focused gaze.
- **TEAM-04**: Logistics lead — South Asian woman, early 40s, Marwari, wearing a dusty-rose cotton kurta with brass earrings, slight smile, confident.
- **TEAM-05**: Junior designer — South Asian woman, late 20s, Bengali, wearing an ivory cotton blouse, brass ring on right hand, gentle curious gaze.
- **TEAM-06**: Carpentry lead — South Asian man, late 40s, Bengali, wearing a denim shirt rolled at the sleeves, calloused hands visible at bottom of frame, steady weather-worn gaze.
- **TEAM-07**: Client liaison — South Asian man, early 30s, Nepali, wearing a deep-charcoal kurta-shirt with a thin brass pen tucked at the chest pocket, warm welcoming smile.
- **TEAM-08**: Photography lead — South Asian woman, mid-30s, Bengali, wearing a black turtleneck and small brass-rimmed glasses (no text on glasses), holding a small camera at chest (camera body generic, no readable text), focused gaze.

---

# 13. TESTIMONIALS — 9 client portraits (1:1 each)

Use the **shared client-portrait template**, then apply the nine variations.

**Shared client-portrait template**:

```
Editorial square (1:1) candid client portrait, South Asian subjects, photographed informally at home or at a venue in soft natural light. Three-quarter framing, subjects engaged with each other or looking softly at camera with relaxed expression — never corporate, never stiff. Soft directional natural window light from camera-left. Camera 85mm f/1.8 at f/2.0, focus on the primary subject's eyes. Mood: 'real family, who chose us, photographed honestly.' Colour: warm ivory background, natural skin tones, the subject's chosen wardrobe with restrained palette (no neon, no harsh prints).
```

- **TEST-01**: Bengali couple in their late 20s, the woman in a soft jamdani saree, the man in a kurta, seated on a sofa with a single jasmine garland on the table foreground.
- **TEST-02**: Marwari couple in their early 30s, the woman in a soft pastel cotton suit with delicate gold-thread embroidery, the man in a linen shirt, standing in a doorway.
- **TEST-03**: Nepali couple in their early 40s, the woman in a handloom cotton dress with a thin brass necklace, the man in a kurta, seated at a small dining table.
- **TEST-04**: Mixed Bengali-Punjabi couple in their late 20s, casual modern, the woman in a cream cotton kurta with mehendi-decorated hands resting in lap, the man in a soft chambray shirt.
- **TEST-05**: A multigenerational Bengali family — three generations, the eldest woman in a white-with-red-border saree, parents in middle-age modest dress, two grown children in casual modern.
- **TEST-06**: A single Bengali mother in her late 40s, warm confident smile, wearing a deep-red Tangail saree with a single thin gold chain.
- **TEST-07**: A Marwari father in his early 60s and his daughter in her late 20s — the father in a sherwani-style jacket, the daughter in a dusty-rose cotton kurta.
- **TEST-08**: A Bengali corporate professional couple in their early 30s, the woman in a modern silk-blend dress, the man in a casual blazer over a kurta — wedding-followed-by-corporate-event clients.
- **TEST-09**: A young new-parent couple in their early 30s with a toddler on the mother's lap (toddler face soft-focus / partially turned), Bengali, the mother in a soft yellow cotton saree, the father in a charcoal kurta — Annaprashan client family.

---

# 14. BLOG POST COVERS — 6 launch posts (16:9 each)

### `POST-01-COVER` — Bengali Wedding Checklist

```
Editorial cinematic wide cover: a flat-lay editorial overhead of a Bengali wedding planning desk — a hand-bound planning notebook open to a page with a Bengali ceremony rhythm sketched (purposely soft so no readable text), a folded red Banarasi saree corner peeking at the frame edge, a single Topor in soft focus at the top of the frame, a brass ink-pen, a pressed jasmine bloom, a small wooden mock-Mandap design model, a sprig of fresh marigold. Linen tablecloth. Top-down 90-degree perspective. Camera 35mm f/1.4 at f/4.0, soft window light from the top. Mood: 'six months out, planning a Bengali wedding.' Colour: ivory, red Banarasi, jasmine white, brass, marigold.
```

### `POST-02-COVER` — How to Plan a Haldi Ceremony

```
Editorial wide cover: a warm intimate Haldi corner detail — a brass thali with fresh turmeric paste, marigold petals scattered on a turmeric-yellow handloom cloth, two halves of a lemon, a small brass ladle. Beside the thali, a low Pidi (Bengali ceremonial stool) at the right of the frame. Behind, a soft hint of marigold curtain in deep bokeh. Late morning sun-dappled. Camera 35mm f/1.4 at f/2.2. Mood: 'the morning of turmeric, photographed quietly.' Colour: marigold-yellow, brass, mango-green, ivory.
```

### `POST-03-COVER` — Best Wedding Venues in Siliguri

```
Editorial wide cover: a wide architectural shot of a Siliguri banquet ballroom interior at late afternoon, high ceilings, two rows of cream pillars, a polished wood floor catching warm light from tall windows house-left, empty of people. The middle of the room has a single mock-up table draped in cream linen, two chairs and a single brass urn of white roses — suggesting the planning of a venue. Camera 35mm f/1.4 at f/4.0. Mood: 'the canvas of a Siliguri venue.' Colour: ivory, warm wood, brass, soft jade roses.
```

### `POST-04-COVER` — Tea Garden Wedding Guide

```
Editorial wide cover: a tea-garden estate lawn at golden hour, neat rows of Camellia sinensis bushes rolling away into the mid-distance, the silhouette of a colonial planter's bungalow on a low rise in the background, the Kanchenjunga range catching alpenglow pink-gold on the far horizon (soft focus). In the foreground, a single brass urn with fresh local florals (rhododendron, fern, white roses) on a low wooden table that suggests a wedding setup in progress, with two ivory linen drape panels fluttering gently behind. No people. Camera 35mm f/1.4 at f/2.5. Mood: 'destination luxury in a working tea garden.' Colour: jade tea-green, ivory, brass, alpenglow pink-gold.
```

### `POST-05-COVER` — Mandap Design Ideas

```
Editorial wide cover: a side-elevation cinematic shot of four different Mandap structures arranged sculpturally in soft focus depth — closest to camera a traditional Bengali Mandap (brass-tipped wood, jasmine pillars), behind it a modern minimal Mandap (matte white pillars, sheer canopy), then a Marwari opulent Mandap (wine drapes, gold), furthest back a destination tea-garden Mandap (slim brass poles, fern). The arrangement is editorial-set-piece, not a real composite of four real Mandaps in one space. Warm late-afternoon light. Camera 35mm f/1.4 at f/4.0, focus on the closest Mandap. Mood: 'four families of Mandap shapes.' Colour: ivory base with each Mandap holding its signature accent.
```

### `POST-06-COVER` — Annaprashan Decoration Ideas

```
Editorial wide cover: a small low decorated ceremonial chair at centre — empty, no baby in frame — set against a vertical wall of fresh marigold, with a brass thali in the foreground holding the seven traditional ritual items (rice, gold coin, generic closed book, brass pen, clay clump, pearl strand, small wooden toy). A hand-painted white Alpana motif on the floor between thali and chair. Late morning, soft window light from camera-left. Camera 35mm f/1.4 at f/2.5. Mood: 'a small Bengali ritual, designed quietly.' Colour: marigold, ivory, brass, jasmine white, Alpana white-on-stone.
```

---

# 15. LOCATION PAGES — 7 location heroes (16:9 each)

Each is a 16:9 cinematic shot of the location's *character* (not an event). Plus 3 venue shots per location as a templated extra (use the venue template at the end of the section).

### `LOC-siliguri-HERO`

```
Editorial cinematic wide (16:9) of a Siliguri evening street scene from a slightly elevated vantage — Hill Cart Road in soft blue-hour twilight, traffic streaks in soft motion blur, the silhouette of a colonial-era heritage building at the left of the frame with warm window light, low Himalayan foothills visible as soft silhouettes in the background. Foreground: a single chai-stall with a brass kettle and a soft glow of bare-bulb light. No readable signage text. Camera 35mm f/1.4 at f/2.5, shutter 1/30 for traffic blur. Mood: 'North Bengal's gateway city, between mountain and plain.' Colour: warm tungsten, blue-hour cool sky, mountain-blue silhouette, ivory heritage walls.
```

### `LOC-bagdogra-HERO`

```
Editorial cinematic wide (16:9) of the road from Bagdogra airport at late afternoon — a tree-lined NH avenue with tea-garden rows visible through the trees on one side and a glimpse of the airport perimeter on the other, a single white Ambassador car driving away from camera into the warm light, no readable signage. Background: foothills visible at the horizon. Camera 35mm f/1.4 at f/2.8. Mood: 'arrival to North Bengal.' Colour: warm tarmac, jade tea-green, ivory car, soft blue mountain.
```

### `LOC-darjeeling-HERO`

```
Editorial cinematic wide (16:9) of a Darjeeling tea estate at sunrise — terraced tea rows in the foreground catching first light, mist clinging in the valleys, a colonial planter's bungalow silhouette on a ridge mid-frame, the Kanchenjunga range catching alpenglow pink-gold on the right horizon, a single hawk circling overhead. No people. Camera 35mm f/1.4 at f/4.0. Mood: 'the postcard you want to be inside of.' Colour: jade tea-green, ivory mist, alpenglow pink-gold.
```

### `LOC-kalimpong-HERO`

```
Editorial cinematic wide (16:9) of a Kalimpong hillside afternoon — rhododendron blooms in the foreground (pink and red varieties), terraced gardens behind, a colonial-era stone church spire visible in the mid-distance, the Himalayan range as soft silhouette far behind. Soft mountain light. Camera 35mm f/1.4 at f/2.8. Mood: 'quiet hill-town, in bloom.' Colour: rhododendron pink-red, jade hillside, ivory church, soft blue Himalaya.
```

### `LOC-jalpaiguri-HERO`

```
Editorial cinematic wide (16:9) of a Jalpaiguri river-edge scene at golden hour — the wide slow Teesta river in soft focus, a low wooden boat moored at the bank, tall reed grass in the foreground, soft golden sky reflecting on the water, the silhouette of a riverside village at the far bank with one warm window light. Camera 35mm f/1.4 at f/2.5. Mood: 'the slow river country.' Colour: golden water, reed-jade, warm sky-pink.
```

### `LOC-gangtok-HERO`

```
Editorial cinematic wide (16:9) of a Gangtok hill-monastery rooftop in misty morning — the warm-yellow ochre walls of a Sikkimese monastery, fluttering prayer flags (the traditional five colours: blue, white, red, green, yellow) strung between rooftops, mist drifting between the upper-storey terraces, a glimpse of green ridge falling away into the valley behind. No people. Camera 35mm f/1.4 at f/2.8. Mood: 'sacred mountain morning.' Colour: ochre-yellow monastery, prayer-flag primary colours (used with restraint), jade ridge, ivory mist.
```

### `LOC-dooars-HERO`

```
Editorial cinematic wide (16:9) of a Dooars tea-and-forest landscape — in the foreground tall elephant grass leaning in a soft breeze, mid-ground a winding earthen path leading toward a row of tea labour quarters (low whitewashed cottages with terracotta roofs, no readable signage), background a sal-tree forest line with the Himalayan foothills as silhouette far behind. Soft late-afternoon haze. Camera 35mm f/1.4 at f/4.0. Mood: 'the working tea country, photographed with respect.' Colour: jade grass, terracotta roofs, ivory cottage walls, soft mountain-blue.
```

### Venue shot template (`LOC-[slug]-VENUE-01..03`)

For each location, use this template substituting the venue type:

```
Editorial wide (16:9) of [VENUE_NAME_OR_TYPE] in [LOCATION], photographed at [TIME_OF_DAY] in soft natural light. The shot shows the venue's character — high-ceilinged ballroom / lawn-and-pavilion / heritage room / rooftop — empty of any event setup, just the architectural canvas. Camera 35mm f/1.4 at f/4.0. Mood: 'this is the room we'd dress.' Colour: ivory walls, warm wood, brass accents, soft daylight.
```

For each location, plug in three actual venue types (e.g. for Siliguri: Mainak ballroom, Sinclairs hotel ballroom, a lawn venue at Salugara; for Darjeeling: Glenburn estate lawn, Mayfair ballroom, a heritage tea-planter bungalow drawing room).

---

# 16. DECORATIVE MOTIFS (illustration-style, NOT photorealism)

These are line-art / vector-style assets. **In Gemini, switch to Imagen 4 illustration mode** (where supported) or use the prompt explicitly requesting flat vector illustration. If Imagen consistently fails to produce clean vectors, fall back to a vector tool — open the resulting raster in Illustrator and trace, or commission a designer.

### `MOTIF-MARIGOLD`

```
A single flat vector-style illustration of a marigold (Tagetes / genda) bloom, viewed top-down, drawn in fine continuous line-art with concentric ruffled petal layers, in brass colour #B8893A on pure white background. No shading, no gradient, no 3D. Style: botanical line-illustration in the manner of a vintage seed-catalogue plate. Composition: bloom fills 70% of the canvas, centred. Square 1:1.
```

### `MOTIF-JASMINE`

```
A single flat vector-style illustration of a jasmine sprig with three blooms and four leaves, in fine continuous line-art, brass colour #B8893A on pure white. No shading, no gradient. Style: botanical line-illustration. Composition: sprig laid diagonally across the canvas, fills 70%. Square 1:1.
```

### `MOTIF-DIYA`

```
A single flat vector-style illustration of a brass diya (Indian oil lamp), side-elevation view, with a small steady flame, in fine continuous line-art, brass colour #B8893A on pure white. No shading, no gradient. Style: heritage line-engraving in the manner of a wax-seal plate. Composition: diya centred, fills 60% of canvas. Square 1:1.
```

### `MOTIF-DIVIDER`

```
A horizontal ornate divider for an editorial page, drawn in fine flat line-art, brass colour #B8893A on pure white. Style: a thin horizontal line interrupted at centre by a small diamond-shaped ornament with a stylised five-petal jasmine bloom inside, flanked by two single brass leaves curling outward. The whole divider is symmetrical, thin-stroke, intricate but readable. Aspect 6:1 (very wide).
```

### `MAP-01` — Stylised North Bengal region map

```
A stylised line-art map of the North Bengal region, drawn in flat vector line-art, brass #B8893A on a cream #FAF7F2 background. Style: editorial heritage map in the spirit of a vintage tea-trade map. The map shows: the city of Siliguri (marked with a small brass dot and the label "Siliguri" — render the label in a clean serif font WITH CARE — if Gemini fails to render text cleanly, leave the labels blank and a designer will add them in vector tools), Bagdogra airport, Darjeeling (with a tiny stylised mountain icon), Kalimpong, Jalpaiguri, Gangtok, and the Dooars region (with tiny tea-leaf icons). Rivers are drawn as wavy hairlines (Teesta, Mahananda). The Himalayan range is suggested at the top with a thin row of stylised peaks. Composition: the region fills the canvas with generous margin, the title 'NORTH BENGAL' appears across the top in clean serif (again, if text rendering fails, leave blank). Aspect 4:3.
```

> Recommendation: render MAP-01 with text intentionally left blank in Gemini, then add the labels in Figma or Illustrator afterwards using Cormorant Garamond.

---

# 17. 404 PAGE ART — `404-ART`

**Aspect**: 16:9. **Resolution**: 3840×2160.

**Prompt**:

```
Editorial cinematic wide (16:9) of a quiet, melancholic-but-not-sad post-celebration detail. The frame: a single tipped-over wooden ceremonial chair on a polished stone floor, slightly off-centre to the right, two fallen fresh marigold petals on the floor beside it, a single jasmine garland slipping off the chair seat, a copper urli at the left of the frame holding still water with one floating jasmine. Time: golden hour, the last warm light pouring in from a tall window camera-right at a low 15-degree angle, casting long elongated shadows of the chair across the floor toward camera. Background: soft bokeh of a venue interior, empty. No people. Camera 35mm f/1.4 at f/2.5, focus on the tipped chair. Mood: 'something happened here. We'll find it.' Colour: warm golden floor, ivory chair, jasmine white, marigold orange single accent, deep elongated shadow.
```

---

# 18. OPEN GRAPH FALLBACK IMAGE

**Aspect**: 1.91:1 (1200×630 — set the Gemini knob to 16:9 then crop). **Resolution**: 1200×630 final, generate at 2400×1260 for downscale.

**Prompt**:

```
Editorial wide (16:9, to be cropped to 1.91:1 1200x630) brand-grounded fallback image for social-media share previews. Composition: a moody atmospheric Mandap detail at golden hour, photographed from below at a low angle — the underside of a Mandap canopy where brass-tipped wooden poles meet the woven mango-leaf roof, cascading jasmine garlands fall vertically from the canopy, a single tuberose stem reaches down centre, warm tungsten and golden-hour light pouring across the structure. The LEFT THIRD of the frame is intentionally darker / lower-detail — this is where the brand wordmark "Siligurievent" will be type-set in design tools (Cormorant Garamond) afterwards. DO NOT render the wordmark text in this image — leave the left third as a clean dark moody area suitable for typography overlay. Camera 35mm f/1.4 at f/2.5, focus on the canopy centre. Mood: 'the brand in one frame.' Colour: warm tungsten, jasmine white, brass, deep velvet shadow on the left third.
```

---

# 19. IMAGE-SET SELECTION WORKFLOW — 10-item QC checklist

Run this on every batch of 4 candidates. If 3 of 4 fail, regenerate with prompt adjustments. If 4 of 4 fail, see Section 22 (rescue prompts).

- [ ] **1. Hands and fingers natural?** No extra fingers, no fused fingers, no claw-like distortion. Hands match the lighting and angle of the rest of the body.
- [ ] **2. Skin texture realistic?** Visible pores, fine vellus hair, natural subsurface scattering. NOT plastic, NOT smoothed, NOT waxy.
- [ ] **3. Jewellery sharp and accurate?** Brass reads warm-yellow, gold reads deeper-yellow. No melted-looking or impossible filigree. Gemstones have real caustic sparkle, not plastic shine.
- [ ] **4. Indian features authentic?** Skin tones, facial structure, hair colour and texture are South Asian — not generic-white-with-tan, not anime-stylised, not blonde-Indian-fusion errors. Eyes are brown (or natural-Indian variation), never pale-blue/green unless contextually justified.
- [ ] **5. Fabric weave and texture visible?** Silk catches highlights properly, cotton diffuses light, velvet absorbs light. No fabric reads as plastic sheet or painted texture.
- [ ] **6. Lighting consistent with description?** Direction, intensity, colour temperature match the prompt. Shadows fall where they should. No "light from nowhere" errors.
- [ ] **7. No garbled text on signs/banners?** Check all paper, signage, books, invitations, calligraphy plaques. If ANY text appears legibly mis-spelled or garbled (e.g. "SilliguIievent", "Welcoms", "GAYE HoLED"), REJECT. Either re-prompt with explicit "no text" or accept that you will mask the area in Photoshop.
- [ ] **8. Composition leads the eye to the decor?** The eye should land on the intended focal point within 1 second. If the eye wanders or is pulled by a stray bright object, the composition has failed.
- [ ] **9. Mood matches the brand voice?** Editorial-restraint vs Pinterest-cliché. Confident vs saccharine. Cinematic vs stock. Reject anything that feels like a generic "Indian wedding" stock-image.
- [ ] **10. Could a human photographer have shot this?** The acid test. If the perspective is physically impossible, if the light defies real optics, if the depth-of-field math is wrong (e.g. mid-ground sharp while foreground and background both bokeh) — reject.

---

# 20. STEP-BY-STEP GEMINI STUDIO OPERATING INSTRUCTIONS

For a non-technical owner. Numbered list, dead-simple.

1. **Open** https://aistudio.google.com (Google AI Studio) or https://gemini.google.com depending on access tier. If using Vertex AI, sign in at https://console.cloud.google.com and navigate to **Vertex AI → Model Garden → Imagen 4**.
2. **Sign in** with the Google account that has Imagen 4 access (the project owner should have provisioned this with the project's billing account).
3. **In the model selector, choose "Imagen 4"** (or "Imagen 4 Fast" for cheaper iterations on test prompts — but always use full Imagen 4 for final images). For NIGHT-version image-to-image, choose **Imagen 4 Edit** if it's a separate option, or use **Gemini 2.5 Image Mode**.
4. **Set the aspect ratio in the UI knob** (do not rely only on the prompt). Options are typically: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3. For 21:9 use the closest (16:9) and crop manually afterwards if Imagen does not natively support 21:9. For 4:5 use 4:5 if present; if only 3:4 is available, use 3:4 and crop.
5. **Set the candidate count to 4** (always).
6. **Set the safety filters to standard** (Imagen 4 default). If the model refuses a prompt for safety reasons (rare — typically only happens with religious imagery), see §22 rescue snippets.
7. **In the prompt field**, paste in this order:
   - Universal Style Block (§2)
   - Blank line
   - The specific prompt for the image ID (from this book)
   - Blank line
   - Hyper-Realism Specs (§4)
8. **In the Negative Prompt field**, paste the Negative Block (§3). If your interface does not show a separate field, append it to the main prompt as `Negative: …`.
9. **Click Generate**.
10. **Compare the 4 candidates** side-by-side. Run the QC checklist (§19) in your head. Pick the strongest.
11. **Right-click the chosen candidate → Save Image As**. Save with the exact ID as the filename:
    - For singles: `HERO-01.jpg`, `WORK-03.jpg`, `SVC-05.jpg`, etc.
    - For day/night pairs: `DECOR-MANDAP-01-DAY.jpg`, `DECOR-MANDAP-01-NIGHT.jpg`.
    - For service detail sets: `SVC-bengali-wedding-HERO.jpg`, `SVC-bengali-wedding-DETAIL-01.jpg`, etc.
    - For case studies: `PROJ-rinki-aditya-bengali-wedding-2025-COVER.jpg`, `PROJ-rinki-aditya-bengali-wedding-2025-CHAPTER-DAY-3-01.jpg`, etc.
12. **Choose save format JPG quality 95** (preferred) or PNG. Do NOT save as WEBP from Gemini — conversion to WEBP/AVIF is handled later in our build pipeline.
13. **Move the file** into the folder structure on your computer: `~/SiliguriEvents/uploads/[bucket]/[id].jpg`. (Your developer will confirm the exact folder if different.)
14. **Open the Payload CMS admin panel** at `/admin` on the staging site, log in.
15. **Go to the Media collection → Create New**. Upload the image. Set the `altText` field to a short factual description (e.g., for HERO-01: "Bengali wedding Mandap at golden hour with jasmine pillars and copper urli"). DO NOT include keywords stuffing — write it as you would describe it to a friend.
16. **Set the `caption` field** (optional) with a longer editorial line if the image deserves a caption on the site.
17. **Click Save**. The file is now uploaded and ready for the developer to reference by ID on the right page.
18. **Repeat** for the next image.

---

# 21. COST & BATCH ORDER

### Approximate cost estimate

- Imagen 4 (full quality) typically costs **$0.03–$0.05 per generated image** (at 4 candidates per prompt = $0.12–$0.20 per prompt).
- 375 images × 4 candidates = ~1,500 generations → **$45–$75** in raw Imagen credits.
- Add 30% buffer for re-generations and rescue prompts → **$60–$100 total** for the full image suite.
- Image-to-image NIGHT edits are billed at the same rate per generation.
- Day/night pair (10 pairs × 2 images × 4 candidates) = 80 generations → **$2.40–$4** for that section alone.

> The owner should set a **monthly Vertex AI billing alert at $150** as a safety margin.

### Recommended render order

**Phase 1 — Brand calibration (Day 1 of generation work)**
1. `LOGO-EMBLEM-A`, `LOGO-EMBLEM-B`, `LOGO-EMBLEM-C`, `FAVICON-MARK` — locks the brand mark.
2. `HERO-01` — locks the brand's "feel" reference for everything downstream.
3. Once HERO-01 is approved, every subsequent prompt should be compared against it for tonal consistency. If a later image drifts away from HERO-01's mood, prompt-tune it back.

**Phase 2 — Signature day/night pairs (Day 2–4)**
4. `DECOR-MANDAP-01-DAY` and `-NIGHT` (signature pair).
5. `DECOR-STAGE-01-DAY` and `-NIGHT`.
6. `DECOR-HALDI-01-DAY` and `-NIGHT`.
7. `DECOR-BDAY-01-DAY` and `-NIGHT`.
8. The remaining 6 day/night pairs.

**Phase 3 — Home page & service tiles (Day 5–6)**
9. `HERO-02` through `HERO-07`.
10. `WORK-01` through `WORK-05`.
11. `SVC-01` through `SVC-07`.

**Phase 4 — Service detail pages (Day 7–14)**
12. The 19 services × 5 images = 95 images. Render top-6 services first (`wedding`, `bengali-wedding`, `haldi-gaye-holud`, `mehendi`, `sangeet`, `reception`), then the remaining 13.

**Phase 5 — About, testimonials, blog covers, locations, motifs, 404, OG (Day 15–20)**
13. `ABOUT-01..02`, `BTS-01..06`, `TEAM-01..08`.
14. `TEST-01..09`.
15. `POST-01..06 COVER`.
16. `LOC-*-HERO` × 7 + venue shots.
17. `MOTIF-*` and `MAP-01`.
18. `404-ART` and OG fallback.

**Phase 6 — Case studies (Day 20–30)**
19. The 6 case studies × ~25 images each = 150 images. Render the launch case study first (`rinki-aditya-bengali-wedding-2025`) end-to-end, get sign-off on the visual rhythm, then proceed to the other 5.

---

# 22. WHAT TO DO IF A PROMPT FAILS

Common failure modes and the rescue snippets to fix them.

### Failure A — Image looks "AI-glossy" / plastic / over-stylised

**Symptoms**: Skin too smooth, fabric too shiny, brass looks like plastic-coated chrome, lighting is too clean.

**Rescue snippet** (append to the prompt):

```
Stylistic correction: this image is rendering too AI-glossy. Restore documentary-photography realism. Add fine film grain (Kodak Portra 400 emulation), authentic skin texture with pores and vellus hair, fabric weave visible at thread level. Surfaces should NOT have a synthetic sheen — brass is matte-warm, silk has natural luster but is never shiny like plastic. Reduce highlight glare, restore highlight roll-off, deepen shadow detail to natural levels. This is editorial photography, not 3D render.
```

### Failure B — Cultural specificity wrong (e.g., Punjabi turban on a Bengali groom)

**Symptoms**: Wrong ceremonial element appears, wrong floral, wrong food, wrong textile.

**Rescue snippet**:

```
Cultural correction: this is a [BENGALI / MARWARI / etc.] [WEDDING / HALDI / ETC.]. The image must show [specific correct element]. Replace any [wrong element] with [correct element]. Reference: Bengali wedding = Topor (white pith crown) and Mukut, banana-leaf trim, jasmine, brass, Alpana floor art. Marwari wedding = Sehra (groom's marigold-jasmine face-curtain), deep wine and gold, peacock motifs. Punjabi wedding = colourful turban, kalgi, ghodi (horse). Christian wedding = restrained whites, longer aisle. Muslim Nikah = ivory-and-green palette, screened areas. The cultural specifics are NON-NEGOTIABLE.
```

### Failure C — Wrong aspect ratio (image came out 1:1 when 16:9 was requested)

**Symptoms**: The Gemini knob was set wrong OR the prompt aspect contradicted the knob.

**Rescue**: re-generate with the knob set correctly. Do not rely on the prompt's stated aspect ratio alone — the knob is the source of truth.

### Failure D — Garbled text on signage / banners / invitations

**Symptoms**: A sign appears in-frame with mis-spelled or nonsense text.

**Rescue snippet**:

```
Text correction: this image contains a sign / banner / invitation / book with garbled or mis-spelled text. Regenerate the image with the signage / banner / book / invitation INTENTIONALLY BLANK or with the text PORTION OUT OF FOCUS — the readable text will be added in design tools afterwards. Do not attempt to render any brand-name text, ceremony names, or longer phrases. Words in the frame should either be: (a) intentionally blurred, (b) intentionally cropped, (c) on a paper that is folded or face-down, (d) entirely absent. The brass plaque should be plain brass — no engraved letters.
```

### Failure E — Westernised features on Indian subjects

**Symptoms**: Subject appears blonde, blue-eyed, or with European bone structure despite the prompt specifying South Asian.

**Rescue snippet**:

```
Ethnicity correction: the subject must be South Asian — specifically [BENGALI / MARWARI / NEPALI / PAN-INDIAN]. Skin tone in the range of warm brown to deep brown (subject-dependent). Hair is dark brown to black, straight to wavy. Eyes are warm brown. Facial structure is South Asian (broader cheekbones, more rounded face shape than European, fuller lips, fuller eyebrows, expressive eyes). DO NOT render with blonde hair, blue eyes, or European facial structure. Reference: contemporary Indian editorial photography (think Vogue India, Harper's Bazaar India, Bazaar Bride).
```

### Failure F — Every-colour-in-one-frame chaos

**Symptoms**: The image has too many saturated colours competing, the eye cannot rest.

**Rescue snippet**:

```
Colour correction: this image has too many competing colours. Restrict the palette to: [STATED 3-COLOUR PALETTE]. Any other colour should be muted to near-neutral or removed. The eye must be able to rest on one focal point. Editorial restraint, not Pinterest maximalism.
```

### Failure G — Imagen refuses to generate (safety filter)

**Symptoms**: "Cannot generate this image" error, usually on religious imagery (deity faces) or on prompts that imply minors.

**Rescue**:
- For deity / religious icon refusals: change the prompt to describe the deity in **silhouette or soft focus or absent from frame**, with the altar / framework / surroundings rendered instead. Example: instead of "a Lakshmi figurine on an altar," prompt "an altar with a small brass figurine in soft silhouette, no detail on the figurine."
- For minor / baby refusals: prompt the scene **without the baby in frame** — render the empty ceremonial chair, the empty thali, the empty crib. The site will use these "before-the-child-arrives" frames; the actual baby's photo (from the client family's own photos with permission) replaces the empty frame later.

### Failure H — Image is technically perfect but emotionally flat

**Symptoms**: All technicals correct, but the image feels like a stock-photo.

**Rescue snippet**:

```
Emotional correction: this image is technically correct but lacks editorial mood. Add: one small narrative imperfection (a fallen petal, a slightly-tilted chair, a single jasmine garland slipping off a hook, motes of dust in a light beam, a cup of half-drunk chai), shift the light to be more directional and less even (introduce a 30-degree angled key with deep shadow falloff), and let the composition breathe with more negative space. The image should look like a film still from a quiet moment in a celebration, not a brochure cover.
```

---

# END OF PROMPT BOOK

This document is the single source of truth for image generation on Siligurievent. When in doubt:
- Re-read the Universal Style Block (§2) and the Negative Block (§3).
- Run the QC checklist (§19).
- Use the rescue snippets (§22).
- Save with the right filename, upload to Payload, set the alt text.

Total prompts in this book: **375+** ready-to-paste image generations covering every ID in `09-IMAGE-PROMPTS.md`.

Maintained by the Siligurievent studio. Brand voice: cinematic editorial luxury with Indian soul. Region: North Bengal. Domain: siligurievent.com.
