/**
 * POST /api/inquiry — accept structured inquiry submissions.
 *
 * Sprint 4 will wire Resend + Payload persistence. For now this validates
 * the payload, logs it, and returns { ok: true } so the form can be tested
 * end-to-end.
 *
 * TODO (Sprint 4):
 *   - Rate-limit per IP (e.g. Upstash + sliding window, 5/min).
 *   - Send transactional email via Resend to owner.
 *   - Persist into Payload `inquiries` collection.
 *   - Add Turnstile / hCaptcha verify step.
 *   - Send WhatsApp deep-link auto-reply.
 */

import { NextResponse, type NextRequest } from "next/server";
import { InquirySchema, normalisePhone } from "@/lib/validators/inquiry";


function methodNotAllowed(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // TODO (Sprint 4): rate-limit by IP using x-forwarded-for + Upstash.
  // const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Accept both JSON (from the wizard) and form-urlencoded (from the
  // progressive-enhancement fallback when JS is disabled).
  const contentType = request.headers.get("content-type") ?? "";
  let raw: unknown;
  try {
    if (contentType.includes("application/json")) {
      raw = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const fd = await request.formData();
      const obj: Record<string, unknown> = {};
      for (const [key, rawValue] of fd.entries()) {
        // Files are unexpected for this form — ignore them defensively.
        if (typeof rawValue !== "string") continue;
        const value = rawValue;
        if (key === "addOns") {
          const existing = obj.addOns;
          if (Array.isArray(existing)) {
            (existing as string[]).push(value);
          } else {
            obj.addOns = [value];
          }
          continue;
        }
        // Coerce known numeric / boolean fields.
        if (key === "guestCount") {
          obj[key] = Number(value);
        } else if (
          key === "eventDateUndecided" ||
          key === "venueHelpNeeded" ||
          key === "whatsappPreferred"
        ) {
          obj[key] = value === "on" || value === "true" || value === "1";
        } else {
          obj[key] = value;
        }
      }
      raw = obj;
    } else {
      raw = await request.json();
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot check — schema enforces empty, but defend in depth.
  if (data.company && data.company.length > 0) {
    // Silently accept so bots don't learn we rejected them.
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const payload = {
    ...data,
    phone: normalisePhone(data.phone),
    receivedAt: new Date().toISOString(),
  };

  // Stub side-effect — replace with Resend + Payload in Sprint 4.
  // biome-ignore lint/suspicious/noConsole: stub logging until Sprint 4 wires Resend.
  console.info("[inquiry] received", payload);

  return NextResponse.json({ ok: true }, { status: 200 });
}

export function GET(): NextResponse {
  return methodNotAllowed();
}

export function PUT(): NextResponse {
  return methodNotAllowed();
}

export function DELETE(): NextResponse {
  return methodNotAllowed();
}

export function PATCH(): NextResponse {
  return methodNotAllowed();
}
