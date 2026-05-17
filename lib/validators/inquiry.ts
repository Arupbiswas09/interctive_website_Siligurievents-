/**
 * Inquiry form validator.
 *
 * Used in two places:
 *   1. Client-side via react-hook-form + zodResolver in InquiryForm.
 *   2. Server-side in /api/inquiry to re-validate before persisting.
 *
 * Indian English copy. Phone format: +91 XXXXX XXXXX.
 */

import { z } from "zod";

// — Enums ─────────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  "wedding",
  "haldi-mehendi",
  "sangeet",
  "reception",
  "birthday",
  "anniversary",
  "annaprashan",
  "naamkaran",
  "griha-pravesh",
  "corporate",
  "festival-puja",
  "other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const BUDGET_BANDS = ["₹", "₹₹", "₹₹₹"] as const;

export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const ADD_ONS = ["photography", "planning", "catering"] as const;

export type AddOn = (typeof ADD_ONS)[number];

// — Field schemas ─────────────────────────────────────────────────────────

// Accepts:
//   +91 98765 43210
//   +919876543210
//   98765 43210         (we'll prefix +91 server-side)
// We lock to a 10-digit Indian mobile starting 6–9 after normalising.
const PHONE_REGEX = /^(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;

const phoneField = z
  .string({ required_error: "Phone is required." })
  .trim()
  .min(10, "Enter a valid Indian phone number.")
  .max(20, "That phone number looks too long.")
  .regex(PHONE_REGEX, "Use +91 format, e.g. +91 98765 43210.");

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date.")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Pick a valid date.");

// — Step-wise base shapes ─────────────────────────────────────────────────

const step1Base = z.object({
  eventType: z.enum(EVENT_TYPES, {
    errorMap: () => ({ message: "Pick an event type." }),
  }),
  eventDate: isoDate.optional().nullable(),
  eventDateUndecided: z.boolean().default(false),
  guestCount: z
    .number({
      invalid_type_error: "Guest count must be a number.",
      required_error: "Guest count is required.",
    })
    .int("Guest count must be a whole number.")
    .min(25, "Minimum guest count is 25.")
    .max(2000, "For 2000+ guests, please contact us directly."),
});

const step2Base = z.object({
  venue: z
    .string()
    .trim()
    .max(160, "Venue name is too long.")
    .optional()
    .or(z.literal("")),
  venueHelpNeeded: z.boolean().default(false),
  budgetBand: z.enum(BUDGET_BANDS, {
    errorMap: () => ({ message: "Pick a budget band." }),
  }),
  addOns: z.array(z.enum(ADD_ONS)).default([]),
});

const step3Base = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(2, "Tell us your name.")
    .max(80, "Name is too long."),
  phone: phoneField,
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .email("Enter a valid email."),
  whatsappPreferred: z.boolean().default(false),
  message: z
    .string()
    .trim()
    .max(2000, "Message is too long.")
    .optional()
    .or(z.literal("")),
  // Honeypot — must be blank.
  company: z.string().max(0, "Spam suspected.").optional().or(z.literal("")),
});

const metaBase = z.object({
  sourcePage: z.string().trim().max(200).optional(),
});

// — Combined inquiry schema ───────────────────────────────────────────────

const fullBase = step1Base.merge(step2Base).merge(step3Base).merge(metaBase);

export const InquirySchema = fullBase.superRefine((data, ctx) => {
  if (!data.eventDateUndecided && !data.eventDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["eventDate"],
      message: 'Pick a date or tick "Not decided".',
    });
  }
  if (!data.venueHelpNeeded && (!data.venue || data.venue.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["venue"],
      message: 'Enter a venue or tick "Help me find one".',
    });
  }
});

export type InquiryInput = z.infer<typeof InquirySchema>;

// — Step-wise sub-schemas (used by the wizard for per-step validation) ────

export const InquiryStep1Schema = step1Base.superRefine((data, ctx) => {
  if (!data.eventDateUndecided && !data.eventDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["eventDate"],
      message: 'Pick a date or tick "Not decided".',
    });
  }
});

export const InquiryStep2Schema = step2Base.superRefine((data, ctx) => {
  if (!data.venueHelpNeeded && (!data.venue || data.venue.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["venue"],
      message: 'Enter a venue or tick "Help me find one".',
    });
  }
});

export const InquiryStep3Schema = step3Base;

// — Field metadata for UI labels ──────────────────────────────────────────

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  wedding: "Wedding",
  "haldi-mehendi": "Haldi / Mehendi",
  sangeet: "Sangeet",
  reception: "Reception",
  birthday: "Birthday",
  anniversary: "Anniversary",
  annaprashan: "Annaprashan",
  naamkaran: "Naamkaran",
  "griha-pravesh": "Griha Pravesh",
  corporate: "Corporate",
  "festival-puja": "Festival / Puja",
  other: "Something else",
};

export const ADD_ON_LABELS: Record<AddOn, string> = {
  photography: "Photography & cinematography",
  planning: "End-to-end planning",
  catering: "Catering coordination",
};

export const BUDGET_BAND_NOTES: Record<BudgetBand, string> = {
  "₹": "Intimate, single-function, in-town.",
  "₹₹": "Mid-scale, multi-function, our recommended canvas.",
  "₹₹₹": "Destination, multi-day, bespoke design.",
};

// Normalise a user-entered phone to the canonical +91 XXXXX XXXXX form.
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  const ten = digits.startsWith("91") ? digits.slice(2) : digits;
  if (ten.length !== 10) return raw.trim();
  return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`;
}
