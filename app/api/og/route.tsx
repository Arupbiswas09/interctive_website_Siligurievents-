import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Runs on Fluid Compute (Vercel default). `next/og` handles the image
// encoding — no need to opt into Edge.
export const contentType = "image/png";
export const size = { width: 1200, height: 630 } as const;

const BRAND = "Siligurievent";
const TAGLINE = "Cinematic event decor · North Bengal";

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function deriveTitle(path: string): string {
  if (path === "/" || path === "") return "Cinematic event decor in Siliguri";
  const trimmed = path.replace(/^\/+|\/+$/g, "").split("/");
  const last = trimmed[trimmed.length - 1] ?? "";
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path") ?? "/";
  const titleOverride = searchParams.get("title");
  const title = clamp(titleOverride ?? deriveTitle(path), 72);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #14100a 0%, #2a1c12 55%, #3a1a24 100%)",
          color: "#f5ede0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#c89860",
          }}
        >
          <div
            style={{
              width: 48,
              height: 1,
              background: "#c89860",
            }}
          />
          <span>{BRAND}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 72 : 88,
              lineHeight: 1.05,
              fontStyle: "italic",
              fontWeight: 300,
              maxWidth: "920px",
              color: "#f5ede0",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#b8a992",
              maxWidth: "820px",
            }}
          >
            {TAGLINE}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#9a8d7a",
          }}
        >
          <span>siligurievent.com{path === "/" ? "" : path}</span>
          <span style={{ color: "#c89860" }}>Designed to be remembered.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
