import Image from "next/image";
import { cn } from "@/lib/utils";

type EditorialImageProps = {
  src: string;
  alt: string;
  /** Tailwind aspect ratio class, e.g. `aspect-[4/5]`. */
  aspectClassName?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Show SIG-09 film grain overlay. */
  grain?: boolean;
  /** Optional vignette for text-on-image contexts. */
  vignette?: "bottom" | "full" | "none";
};

/**
 * Editorial photography plate — next/image + optional grain + vignette.
 * Used wherever decor imagery should carry the section (hero, cards, intros).
 */
export function EditorialImage({
  src,
  alt,
  aspectClassName = "aspect-[4/5]",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 42vw",
  className,
  grain = true,
  vignette = "none",
}: EditorialImageProps): React.ReactElement {
  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden bg-[color:var(--color-bg-elevated)]",
        aspectClassName,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />

      {grain ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full mix-blend-multiply opacity-[0.06]"
        >
          <filter id={`grain-${hashSrc(src)}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${hashSrc(src)})`} />
        </svg>
      ) : null}

      {vignette === "bottom" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-1/2 bg-gradient-to-t from-[color:var(--color-ink-deep)]/70 to-transparent"
        />
      ) : null}
      {vignette === "full" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[color:var(--color-ink-deep)]/55 via-transparent to-[color:var(--color-ink-deep)]/25"
        />
      ) : null}
    </figure>
  );
}

/** Stable short id for SVG filter defs (avoids duplicate ids when same src repeats). */
function hashSrc(src: string): string {
  let h = 0;
  for (let i = 0; i < src.length; i++) {
    h = (h << 5) - h + src.charCodeAt(i);
    h |= 0;
  }
  return `g${Math.abs(h)}`;
}
