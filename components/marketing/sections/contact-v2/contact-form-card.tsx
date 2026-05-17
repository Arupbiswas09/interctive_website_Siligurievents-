"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CEREMONY_TYPES = [
  "Wedding",
  "Pre-wedding",
  "Reception",
  "Corporate",
  "Festival",
  "Other",
] as const;
type CeremonyType = (typeof CEREMONY_TYPES)[number];

const BUDGET_BANDS = ["₹", "₹₹", "₹₹₹", "₹₹₹₹"] as const;
type BudgetBand = (typeof BUDGET_BANDS)[number];

type FormState = {
  ceremony: CeremonyType | "";
  eventDate: string;
  guests: string;
  city: string;
  name: string;
  phone: string;
  email: string;
  instagram: string;
  message: string;
  budget: BudgetBand | "";
  flexibleDate: boolean;
};

const INITIAL: FormState = {
  ceremony: "",
  eventDate: "",
  guests: "",
  city: "",
  name: "",
  phone: "",
  email: "",
  instagram: "",
  message: "",
  budget: "",
  flexibleDate: false,
};

/**
 * ContactFormCard — two-column inquiry layout.
 * Left: themed multi-section form (Event details → About you → Almost done).
 * Right: sticky brass-cornered benefits panel.
 */
export function ContactFormCard(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const formId = useId();

  const [state, setState] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  // GSAP stagger entrance on form fields when section enters viewport.
  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;
    if (!section || !form) return;

    const ctx = gsap.context(() => {
      const items = form.querySelectorAll<HTMLElement>("[data-field]");
      if (items.length === 0) return;
      if (reducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, section);

    return (): void => {
      ctx.revert();
    };
  }, [reducedMotion]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]): void {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // Placeholder for real submission — log to console for now.
    // eslint-disable-next-line no-console
    console.log("[contact] inquiry payload:", state);
    setSubmitted(true);
  }

  return (
    <Section tone="default" spacing="lg" id="inquiry">
      <Container>
        <div
          ref={sectionRef}
          className="grid grid-cols-1 gap-[var(--space-12)] lg:grid-cols-12 lg:gap-[var(--space-16)]"
        >
          {/* LEFT — Form */}
          <form
            ref={formRef}
            id={`${formId}-form`}
            onSubmit={handleSubmit}
            className="lg:col-span-7 flex flex-col gap-[var(--space-12)]"
            noValidate
          >
            {/* SECTION 1 — Event details */}
            <FormSection eyebrow="01 · Event details" title="What are we composing?">
              <ChipGroup
                label="Ceremony type"
                options={CEREMONY_TYPES}
                value={state.ceremony}
                onChange={(v) => update("ceremony", v as CeremonyType)}
                reducedMotion={reducedMotion}
              />

              <div
                data-field
                className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-2"
              >
                <Field label="Event date" hint="DD MMM YYYY">
                  <input
                    type="date"
                    value={state.eventDate}
                    onChange={(e) => update("eventDate", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Guest count" hint="Approximate is fine">
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 250"
                    value={state.guests}
                    onChange={(e) => update("guests", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div data-field>
                <Field label="City / venue area" hint="Where will it happen?">
                  <input
                    type="text"
                    placeholder="e.g. Siliguri, Darjeeling, Gangtok"
                    value={state.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </FormSection>

            {/* SECTION 2 — About you */}
            <FormSection eyebrow="02 · About you" title="So we know who to reach.">
              <div data-field>
                <Field label="Full name">
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div
                data-field
                className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-2"
              >
                <Field label="Phone (WhatsApp)" hint="+91 prefix">
                  <div className="flex items-stretch">
                    <span className="inline-flex items-center border border-r-0 border-[color:var(--color-border)] bg-[color:var(--color-bg-soft)] px-[var(--space-3)] text-[length:var(--text-sm)] tracking-[var(--tracking-tight)] text-[color:var(--color-ink-muted)]">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="98xxxxxxxx"
                      value={state.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={cn(inputClass, "flex-1")}
                    />
                  </div>
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={state.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div data-field>
                <Field label="Instagram (optional)" hint="If you'd like us to peek at your taste">
                  <input
                    type="text"
                    placeholder="@handle"
                    value={state.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            </FormSection>

            {/* SECTION 3 — Almost done */}
            <FormSection eyebrow="03 · Almost done" title="The simplest version of what you're imagining.">
              <div data-field>
                <Field
                  label="Tell us more"
                  hint="A line about vibe, must-haves, references — anything"
                >
                  <textarea
                    rows={4}
                    placeholder="We're picturing low candles, soft jasmine, an outdoor mandap…"
                    value={state.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={cn(inputClass, "resize-y leading-relaxed")}
                  />
                </Field>
              </div>

              <BudgetChips
                value={state.budget}
                onChange={(v) => update("budget", v)}
                reducedMotion={reducedMotion}
              />

              <label
                data-field
                className="inline-flex cursor-pointer items-center gap-[var(--space-3)] text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]"
              >
                <input
                  type="checkbox"
                  checked={state.flexibleDate}
                  onChange={(e) => update("flexibleDate", e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--color-gold)]"
                />
                I'm flexible on date
              </label>
            </FormSection>

            {/* SUBMIT */}
            <div data-field className="flex flex-col gap-[var(--space-3)]">
              <button
                type="submit"
                className={cn(
                  "group relative inline-flex h-14 w-full items-center justify-center",
                  "bg-[color:var(--color-gold)] text-white",
                  "font-medium uppercase tracking-[0.14em] text-[length:var(--text-sm)]",
                  "transition-[background-color,transform] duration-200 ease-out",
                  "hover:bg-[color:var(--color-gold-deep)] active:scale-[0.99]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
                )}
              >
                {submitted ? "Brief received — we'll be in touch" : "Send the brief →"}
              </button>
              <p className="font-mono text-[length:var(--text-xs)] tracking-wide text-[color:var(--color-ink-soft)]">
                We reply within 24 hours · Reach us on WhatsApp for faster
              </p>
            </div>
          </form>

          {/* RIGHT — Sticky benefits panel */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <BenefitsCard />
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Form section heading + divider
// ─────────────────────────────────────────────────────────────────────────────

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div data-field className="flex flex-col gap-[var(--space-3)]">
        <div className="flex items-center gap-[var(--space-3)]">
          <span
            aria-hidden="true"
            className="inline-block h-px w-10 bg-[color:var(--color-gold)]"
          />
          <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold-deep)]">
            {eyebrow}
          </span>
        </div>
        <h2
          className="font-display italic font-light text-[color:var(--color-ink)]"
          style={{
            fontSize: "clamp(22px, 2.2vw + 14px, 30px)",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-[var(--space-5)]">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field wrapper
// ─────────────────────────────────────────────────────────────────────────────

const inputClass = cn(
  "block w-full bg-transparent",
  "border border-[color:var(--color-border)]",
  "rounded-[var(--radius-sm)]",
  "px-[var(--space-4)] py-[var(--space-3)]",
  "text-[length:var(--text-base)] tracking-[var(--tracking-tight)] text-[color:var(--color-ink)]",
  "placeholder:text-[color:var(--color-ink-soft)]",
  "outline-none transition-[border-color,background-color] duration-200 ease-out",
  "hover:border-[color:var(--color-gold)]/60",
  "focus:border-[color:var(--color-gold)] focus:bg-[color:var(--color-bg-elevated)]",
);

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <label className="flex flex-col gap-[var(--space-2)]">
      <span className="flex items-baseline justify-between gap-[var(--space-3)]">
        <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
          {label}
        </span>
        {hint ? (
          <span className="text-[length:var(--text-xs)] italic text-[color:var(--color-ink-soft)]">
            {hint}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chip group — ceremony type
// ─────────────────────────────────────────────────────────────────────────────

function ChipGroup({
  label,
  options,
  value,
  onChange,
  reducedMotion,
}: {
  label: string;
  options: ReadonlyArray<string>;
  value: string;
  onChange: (v: string) => void;
  reducedMotion: boolean;
}): React.ReactElement {
  return (
    <div data-field className="flex flex-col gap-[var(--space-3)]">
      <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
        {label}
      </span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-[var(--space-2)]">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <motion.button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt)}
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "rounded-[var(--radius-sm)] border px-[var(--space-4)] py-[var(--space-2)]",
                "text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]",
                "cursor-pointer select-none transition-colors duration-200",
                active
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-white"
                  : "border-[color:var(--color-border)] bg-transparent text-[color:var(--color-ink)] hover:border-[color:var(--color-gold)]/60",
              )}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Budget chips
// ─────────────────────────────────────────────────────────────────────────────

function BudgetChips({
  value,
  onChange,
  reducedMotion,
}: {
  value: string;
  onChange: (v: BudgetBand) => void;
  reducedMotion: boolean;
}): React.ReactElement {
  return (
    <div data-field className="flex flex-col gap-[var(--space-3)]">
      <span className="text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-muted)]">
        Budget band
      </span>
      <div role="radiogroup" aria-label="Budget band" className="grid grid-cols-4 gap-[var(--space-2)]">
        {BUDGET_BANDS.map((band) => {
          const active = value === band;
          return (
            <motion.button
              key={band}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(band)}
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex h-12 items-center justify-center rounded-[var(--radius-sm)] border",
                "font-display text-[length:var(--text-lg)] tracking-[var(--tracking-tight)]",
                "cursor-pointer select-none transition-colors duration-200",
                active
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-ink)]"
                  : "border-[color:var(--color-border)] bg-transparent text-[color:var(--color-ink-muted)] hover:border-[color:var(--color-gold)]/60",
              )}
            >
              {band}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Right side — benefits card with brass corners
// ─────────────────────────────────────────────────────────────────────────────

const BENEFITS = [
  "Moodboard tailored to date + venue",
  "Three price-band proposals",
  "Site visit if you're in Siliguri",
  "Direct line with the lead designer",
] as const;

function BenefitsCard(): React.ReactElement {
  return (
    <div className="relative overflow-hidden bg-[color:var(--color-bg-elevated)] p-[var(--space-8)] md:p-[var(--space-12)]">
      <BrassCorners />

      {/* Jasmine accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-60"
      >
        <CeremonyOrnament
          name="jasmine"
          hue="var(--color-gold)"
          hueSecondary="var(--color-gold-deep)"
          className="h-full w-full"
        />
      </div>

      <div className="relative flex flex-col gap-[var(--space-6)]">
        <div className="flex flex-col gap-[var(--space-3)]">
          <span className="inline-flex items-center gap-[var(--space-3)] text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-gold-deep)]">
            <span
              aria-hidden="true"
              className="inline-block h-px w-8 bg-[color:var(--color-gold)]"
            />
            What you'll get back
          </span>
          <h3
            className="font-display italic font-light text-[color:var(--color-ink)]"
            style={{
              fontSize: "clamp(24px, 2.4vw + 14px, 36px)",
              lineHeight: 1.1,
            }}
          >
            A reply that actually reads your brief.
          </h3>
        </div>

        <ul className="flex flex-col">
          {BENEFITS.map((b, i) => (
            <li
              key={b}
              className={cn(
                "flex items-start gap-[var(--space-4)] py-[var(--space-4)]",
                i !== 0 && "border-t border-[color:var(--color-border)]",
              )}
            >
              <span
                aria-hidden="true"
                className="mt-[10px] inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--color-gold)]"
              />
              <span className="text-[length:var(--text-base)] leading-relaxed text-[color:var(--color-ink)]">
                {b}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-[var(--space-2)] border-t border-[color:var(--color-border)] pt-[var(--space-4)]">
          <p className="font-mono text-[length:var(--text-xs)] tracking-wide text-[color:var(--color-ink-muted)]">
            Studio: Hill Cart Road, Siliguri · 14 years
          </p>
        </div>
      </div>
    </div>
  );
}

function BrassCorners(): React.ReactElement {
  const arm = "h-px w-8 md:w-12 bg-[color:var(--color-gold)]";
  const armV = "h-8 md:h-12 w-px bg-[color:var(--color-gold)]";
  return (
    <>
      {/* top-left L */}
      <span aria-hidden="true" className={cn("absolute left-3 top-3", arm)} />
      <span aria-hidden="true" className={cn("absolute left-3 top-3", armV)} />
      {/* bottom-right L */}
      <span aria-hidden="true" className={cn("absolute bottom-3 right-3", arm)} />
      <span aria-hidden="true" className={cn("absolute bottom-3 right-3", armV)} />
    </>
  );
}
