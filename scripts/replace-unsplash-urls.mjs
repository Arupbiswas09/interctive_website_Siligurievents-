#!/usr/bin/env node
/**
 * One-shot: replace every hardcoded `https://images.unsplash.com/photo-*` URL
 * across components/, app/, and lib/ (excluding lib/media/) with a thematic
 * local seed image. Deterministic — same input URL at the same file path
 * always maps to the same local file.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const POOLS = {
  wedding: [
    "/images/marketing/work-01.jpg",
    "/images/marketing/work-03.jpg",
    "/images/marketing/work-05.jpg",
    "/images/work/work-01.webp",
    "/images/work/work-03.webp",
    "/images/work/work-05.webp",
    "/media/decor-pairs/mandap-01-day.avif",
    "/media/decor-pairs/mandap-01-night.avif",
  ],
  preWedding: [
    "/images/marketing/work-04.jpg",
    "/images/work/work-04.webp",
    "/images/services/svc-02.webp",
    "/images/services/svc-04.webp",
    "/media/decor-pairs/haldi-01-day.avif",
    "/media/decor-pairs/haldi-01-night.avif",
  ],
  stage: [
    "/images/marketing/work-02.jpg",
    "/images/marketing/work-05.jpg",
    "/images/work/work-02.webp",
    "/images/work/work-05.webp",
    "/images/services/svc-03.webp",
    "/images/services/svc-05.webp",
    "/media/decor-pairs/stage-01-day.avif",
    "/media/decor-pairs/stage-01-night.avif",
  ],
  family: [
    "/images/marketing/service-06.jpg",
    "/images/services/svc-01.webp",
    "/images/services/svc-06.webp",
    "/images/services/svc-07.webp",
    "/media/decor-pairs/bday-01-day.avif",
    "/media/decor-pairs/bday-01-night.avif",
  ],
  hero: [
    "/images/marketing/hero-home-alt.jpg",
    "/images/hero-01.webp",
    "/images/hero-02.webp",
    "/images/marketing/work-01.jpg",
    "/images/marketing/work-03.jpg",
    "/images/marketing/work-05.jpg",
  ],
  location: [
    "/images/locations/kalimpong-hero.jpg",
    "/images/marketing/work-05.jpg",
    "/images/marketing/work-01.jpg",
    "/images/marketing/work-03.jpg",
    "/images/marketing/hero-home-alt.jpg",
    "/images/hero-01.webp",
    "/images/hero-02.webp",
  ],
  team: [
    "/images/marketing/service-06.jpg",
    "/images/services/svc-01.webp",
    "/images/services/svc-06.webp",
    "/images/services/svc-07.webp",
    "/images/marketing/work-04.jpg",
    "/images/work/work-04.webp",
  ],
  blog: [
    "/images/marketing/work-01.jpg",
    "/images/marketing/work-02.jpg",
    "/images/marketing/work-03.jpg",
    "/images/marketing/work-04.jpg",
    "/images/marketing/work-05.jpg",
    "/images/marketing/hero-home-alt.jpg",
    "/images/hero-01.webp",
    "/images/hero-02.webp",
    "/images/services/svc-03.webp",
  ],
};

function poolForFile(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.includes("team") || lower.includes("author")) return POOLS.team;
  if (lower.includes("hero") && lower.includes("about")) return POOLS.hero;
  if (lower.includes("location")) return POOLS.location;
  if (lower.includes("blog")) return POOLS.blog;
  if (lower.includes("case-study") || lower.includes("portfolio")) return POOLS.wedding;
  if (lower.includes("gallery")) return POOLS.stage;
  if (lower.includes("services-hub") || lower.includes("services")) return POOLS.family;
  if (lower.includes("pricing")) return POOLS.wedding;
  if (lower.includes("signature") || lower.includes("home-")) return POOLS.wedding;
  if (lower.includes("timeline")) return POOLS.preWedding;
  if (lower.includes("ceremony")) return POOLS.preWedding;
  return POOLS.wedding;
}

function hash(key) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

const FILES = execSync(
  `grep -rln "https://images.unsplash.com/photo-" --include="*.ts" --include="*.tsx" components/ app/ lib/ceremony/ 2>/dev/null || true`,
  { cwd: ROOT, encoding: "utf8" },
).split("\n").filter(Boolean);

let totalReplacements = 0;
for (const rel of FILES) {
  const full = path.join(ROOT, rel);
  const original = readFileSync(full, "utf8");
  const pool = poolForFile(rel);
  let count = 0;
  // Match the full quoted URL — preserve surrounding quotes.
  const replaced = original.replace(
    /(["'`])https:\/\/images\.unsplash\.com\/photo-[^"'`]+\1/g,
    (full_match, quote) => {
      const key = `${rel}::${count++}::${full_match}`;
      const pick = pool[hash(key) % pool.length];
      return `${quote}${pick}${quote}`;
    },
  );
  if (replaced !== original) {
    writeFileSync(full, replaced);
    console.log(`  ${rel} — ${count} replacement(s)`);
    totalReplacements += count;
  }
}

console.log(`\nTotal: ${totalReplacements} URLs replaced across ${FILES.length} files.`);
