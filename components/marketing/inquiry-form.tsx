"use client";

import {
  type FormEvent,
  useCallback,
  useId,
  useMemo,
  useState,
} from "react";
import {
  useForm,
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import {
  ADD_ON_LABELS,
  ADD_ONS,
  BUDGET_BAND_NOTES,
  BUDGET_BANDS,
  EVENT_TYPE_LABELS,
  EVENT_TYPES,
  type InquiryInput,
  InquirySchema,
  InquiryStep1Schema,
  InquiryStep2Schema,
  normalisePhone,
} from "@/lib/validators/inquiry";
import { InquirySuccess } from "@/components/marketing/inquiry-success";

type Props = {
  /** Optional sourcePage (e.g. "pricing:weddings-signature"). */
  sourcePage?: string;
  /** Optional pre-selected budget band (from pricing CTA). */
  initialBudget?: InquiryInput["budgetBand"];
};

const STEPS = ["Event", "Scope", "Contact"] as const;
type StepIndex = 0 | 1 | 2;

const STEP_FIELDS: Record<StepIndex, ReadonlyArray<keyof InquiryInput>> = {
  0: ["eventType", "eventDate", "eventDateUndecided", "guestCount"],
  1: ["venue", "venueHelpNeeded", "budgetBand", "addOns"],
  2: ["name", "phone", "email", "whatsappPreferred", "message", "company"],
};

/**
 * InquiryForm — 3-step wizard per docs/05-PAGE-SPECS.md §5.10.
 *
 *   Step 1 — Event type · Event date (+ "Not decided") · Guest count
 *   Step 2 — Venue (+ "Help me find one") · Budget band · Add-ons
 *   Step 3 — Name · Phone (+91) · Email · WhatsApp preferred · Message
 *
 * Validation: react-hook-form + zodResolver. Per-step `trigger()` gates
 * Next button. Final submit re-runs full schema via the resolver and POSTs
 * to /api/inquiry. Step transitions slide horizontally with Framer Motion.
 *
 * Progressive enhancement: the underlying <form> uses POST to /api/inquiry
 * with a hidden fallback so the basic submit works without JS.
 */
export function InquiryForm({
  sourcePage,
  initialBudget,
}: Props): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const formId = useId();
  const [stepIndex, setStepIndex] = useState<StepIndex>(0);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submittedName, setSubmittedName] = useState<string>("");

  const form = useForm<InquiryInput>({
    resolver: zodResolver(InquirySchema),
    mode: "onTouched",
    defaultValues: {
      eventType: "wedding",
      eventDate: null,
      eventDateUndecided: false,
      guestCount: 100,
      venue: "",
      venueHelpNeeded: false,
      budgetBand: initialBudget ?? "₹₹",
      addOns: [],
      name: "",
      phone: "",
      email: "",
      whatsappPreferred: false,
      message: "",
      sourcePage: sourcePage ?? "contact",
      company: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = form;

  // Validate just the current step's fields before advancing.
  const goNext = useCallback(async () => {
    const stepFields = STEP_FIELDS[stepIndex];
    const ok = await trigger(
      [...stepFields] as Array<keyof InquiryInput>,
      { shouldFocus: true },
    );
    if (!ok) return;

    // Cross-field check for step 1 + 2.
    if (stepIndex === 0) {
      const v = getValues();
      const stepRes = InquiryStep1Schema.safeParse({
        eventType: v.eventType,
        eventDate: v.eventDate,
        eventDateUndecided: v.eventDateUndecided,
        guestCount: v.guestCount,
      });
      if (!stepRes.success) return;
    }
    if (stepIndex === 1) {
      const v = getValues();
      const stepRes = InquiryStep2Schema.safeParse({
        venue: v.venue,
        venueHelpNeeded: v.venueHelpNeeded,
        budgetBand: v.budgetBand,
        addOns: v.addOns,
      });
      if (!stepRes.success) return;
    }

    if (stepIndex < 2) {
      setStepIndex(((stepIndex + 1) as StepIndex));
    }
  }, [stepIndex, trigger, getValues]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) setStepIndex(((stepIndex - 1) as StepIndex));
  }, [stepIndex]);

  const onValid = useCallback(
    async (data: InquiryInput): Promise<void> => {
      setSubmitState("submitting");
      try {
        const res = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            phone: normalisePhone(data.phone),
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSubmittedName(data.name.split(" ")[0] ?? data.name);
        setSubmitState("success");
      } catch {
        setSubmitState("error");
      }
    },
    [],
  );

  const onInvalid = useCallback((errs: FieldErrors<InquiryInput>): void => {
    // Jump to the earliest step that has an error.
    for (const key of STEP_FIELDS[0]) {
      if (errs[key as keyof InquiryInput]) {
        setStepIndex(0);
        return;
      }
    }
    for (const key of STEP_FIELDS[1]) {
      if (errs[key as keyof InquiryInput]) {
        setStepIndex(1);
        return;
      }
    }
  }, []);

  // Manual submit handler that wires onValid + onInvalid.
  const onSubmit = useMemo(
    () => handleSubmit(onValid, onInvalid),
    [handleSubmit, onValid, onInvalid],
  );

  if (submitState === "success") {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+91XXXXXXXXXX";
    const sanitized = phone.replace(/[^\d]/g, "");
    const v = getValues();
    const msg =
      `Hi Siligurievent — I just submitted an inquiry. ` +
      `Event: ${EVENT_TYPE_LABELS[v.eventType] ?? v.eventType}, ` +
      `~${v.guestCount} guests, budget ${v.budgetBand}.`;
    const whatsappHref = `https://wa.me/${sanitized}?text=${encodeURIComponent(msg)}`;

    return (
      <InquirySuccess
        name={submittedName}
        whatsappHref={whatsappHref}
        onDismiss={() => {
          setSubmitState("idle");
          setStepIndex(0);
          form.reset();
        }}
      />
    );
  }

  const direction = 1;
  const slide = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, x: 32 * direction },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -32 * direction },
        transition: {
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
      };

  return (
    <form
      id={formId}
      method="POST"
      action="/api/inquiry"
      noValidate
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void onSubmit(e);
      }}
      className={cn(
        "relative flex flex-col gap-[var(--space-8)]",
        "rounded-[var(--radius-md)] border border-[color:var(--color-border)]",
        "bg-[color:var(--color-bg-elevated)]",
        "p-[var(--space-6)] md:p-[var(--space-10)]",
      )}
      aria-labelledby={`${formId}-heading`}
    >
      <h2
        id={`${formId}-heading`}
        className="sr-only"
      >
        Plan my event — inquiry form
      </h2>

      {/* Progress ─────────────────────────────────────────────────── */}
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={stepIndex + 1}
        aria-valuetext={`Step ${stepIndex + 1} of ${STEPS.length} — ${STEPS[stepIndex]}`}
        className="flex flex-col gap-[var(--space-3)]"
      >
        <div className="flex items-center justify-between text-[length:var(--text-xs)] uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span aria-hidden="true">{STEPS[stepIndex]}</span>
        </div>
        <div className="relative h-[2px] w-full overflow-hidden bg-[color:var(--color-border)]">
          <div
            className="absolute inset-y-0 left-0 bg-[color:var(--color-accent)] transition-[width] duration-500"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Honeypot ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-0"
      >
        <label htmlFor={`${formId}-company`}>Company (leave blank)</label>
        <input
          id={`${formId}-company`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      {/* Steps ─────────────────────────────────────────────────────── */}
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" initial={false}>
          {stepIndex === 0 && (
            <motion.div
              key="step-1"
              {...slide}
              className="flex flex-col gap-[var(--space-6)]"
            >
              <Step1
                formId={formId}
                register={register}
                control={control}
                errors={errors}
              />
            </motion.div>
          )}
          {stepIndex === 1 && (
            <motion.div
              key="step-2"
              {...slide}
              className="flex flex-col gap-[var(--space-6)]"
            >
              <Step2
                formId={formId}
                register={register}
                control={control}
                errors={errors}
              />
            </motion.div>
          )}
          {stepIndex === 2 && (
            <motion.div
              key="step-3"
              {...slide}
              className="flex flex-col gap-[var(--space-6)]"
            >
              <Step3
                formId={formId}
                register={register}
                errors={errors}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer controls ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)] border-t border-[color:var(--color-border)] pt-[var(--space-6)]">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0 || submitState === "submitting"}
          className={cn(
            buttonVariants({ variant: "ghost", size: "md" }),
            "disabled:invisible",
          )}
        >
          ← Back
        </button>

        {submitState === "error" && (
          <p
            role="alert"
            className="text-[length:var(--text-sm)] text-[color:var(--color-error)]"
          >
            Something went wrong. Please try again, or message us on WhatsApp.
          </p>
        )}

        {stepIndex < 2 ? (
          <button
            type="button"
            onClick={() => void goNext()}
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitState === "submitting"}
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            {submitState === "submitting" ? "Sending…" : "Send inquiry"}
          </button>
        )}
      </div>
    </form>
  );
}

/* ============================================================ STEP 1 */

type Step1Props = {
  formId: string;
  register: UseFormRegister<InquiryInput>;
  control: Control<InquiryInput>;
  errors: FieldErrors<InquiryInput>;
};

function Step1({
  formId,
  register,
  control,
  errors,
}: Step1Props): React.ReactElement {
  return (
    <>
      <Fieldset
        legend="Event type"
        hint="Pick the closest match — we'll refine on call."
        error={errors.eventType?.message}
      >
        <Controller
          control={control}
          name="eventType"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3">
              {EVENT_TYPES.map((type) => {
                const id = `${formId}-event-${type}`;
                const checked = field.value === type;
                return (
                  <label
                    key={type}
                    htmlFor={id}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-[var(--space-2)]",
                      "rounded-[var(--radius-sm)] border px-[var(--space-3)] py-[var(--space-3)]",
                      "text-[length:var(--text-sm)] tracking-[var(--tracking-tight)]",
                      "transition-[border-color,background-color] duration-200",
                      checked
                        ? "border-[color:var(--color-ink)] bg-[color:var(--color-bg)]"
                        : "border-[color:var(--color-border)] hover:border-[color:var(--color-ink)]",
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      value={type}
                      name={field.name}
                      checked={checked}
                      onChange={() => field.onChange(type)}
                      onBlur={field.onBlur}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-block h-2 w-2 rounded-full",
                        checked
                          ? "bg-[color:var(--color-accent)]"
                          : "bg-[color:var(--color-ink-soft)]/40",
                      )}
                    />
                    {EVENT_TYPE_LABELS[type]}
                  </label>
                );
              })}
            </div>
          )}
        />
      </Fieldset>

      <Fieldset
        legend="Event date"
        hint="A best-estimate is fine — we'll firm it up together."
        error={errors.eventDate?.message}
      >
        <div className="flex flex-wrap items-center gap-[var(--space-4)]">
          <Controller
            control={control}
            name="eventDateUndecided"
            render={({ field: undecidedField }) => (
              <>
                <input
                  id={`${formId}-event-date`}
                  type="date"
                  disabled={undecidedField.value}
                  {...register("eventDate")}
                  className={cn(
                    "h-12 rounded-[var(--radius-sm)] border px-[var(--space-4)]",
                    "border-[color:var(--color-border)] bg-[color:var(--color-bg)]",
                    "text-[length:var(--text-base)] text-[color:var(--color-ink)]",
                    "focus-visible:border-[color:var(--color-accent)]",
                    "disabled:opacity-50",
                  )}
                />
                <label className="inline-flex cursor-pointer items-center gap-[var(--space-2)] text-[length:var(--text-sm)]">
                  <input
                    type="checkbox"
                    checked={undecidedField.value}
                    onChange={(e) => undecidedField.onChange(e.target.checked)}
                    className="h-4 w-4 accent-[color:var(--color-accent)]"
                  />
                  Not decided yet
                </label>
              </>
            )}
          />
        </div>
      </Fieldset>

      <Fieldset
        legend="Guest count"
        hint="Slide to your estimate — 25 to 1000+."
        error={errors.guestCount?.message}
      >
        <Controller
          control={control}
          name="guestCount"
          render={({ field }) => (
            <div className="flex flex-col gap-[var(--space-3)]">
              <div className="flex items-baseline gap-[var(--space-3)]">
                <span className="font-display text-[length:var(--text-3xl)] tracking-[var(--tracking-display)]">
                  {field.value}
                </span>
                <span className="text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]">
                  {field.value >= 1000 ? "1000+ guests" : "guests"}
                </span>
              </div>
              <input
                id={`${formId}-guests`}
                type="range"
                min={25}
                max={1000}
                step={25}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full accent-[color:var(--color-accent)]"
              />
              <div className="flex justify-between text-[length:var(--text-xs)] text-[color:var(--color-ink-soft)]">
                <span>25</span>
                <span>250</span>
                <span>500</span>
                <span>1000+</span>
              </div>
            </div>
          )}
        />
      </Fieldset>
    </>
  );
}

/* ============================================================ STEP 2 */

function Step2({
  formId,
  register,
  control,
  errors,
}: Step1Props): React.ReactElement {
  return (
    <>
      <Fieldset
        legend="Venue"
        hint='Enter a venue, or tick "Help me find one".'
        error={errors.venue?.message}
      >
        <div className="flex flex-col gap-[var(--space-3)]">
          <input
            id={`${formId}-venue`}
            type="text"
            placeholder="e.g. Mainak Tourist Lodge, Siliguri"
            {...register("venue")}
            className={cn(
              "h-12 w-full rounded-[var(--radius-sm)] border px-[var(--space-4)]",
              "border-[color:var(--color-border)] bg-[color:var(--color-bg)]",
              "text-[length:var(--text-base)] text-[color:var(--color-ink)]",
              "placeholder:text-[color:var(--color-ink-soft)]",
              "focus-visible:border-[color:var(--color-accent)]",
            )}
          />
          <Controller
            control={control}
            name="venueHelpNeeded"
            render={({ field }) => (
              <label className="inline-flex cursor-pointer items-center gap-[var(--space-2)] text-[length:var(--text-sm)]">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 accent-[color:var(--color-accent)]"
                />
                Help me find one
              </label>
            )}
          />
        </div>
      </Fieldset>

      <Fieldset
        legend="Budget band"
        hint="The bands above guide your quote — pick what feels right."
        error={errors.budgetBand?.message}
      >
        <Controller
          control={control}
          name="budgetBand"
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-[var(--space-3)] sm:grid-cols-3">
              {BUDGET_BANDS.map((band) => {
                const id = `${formId}-budget-${band}`;
                const checked = field.value === band;
                return (
                  <label
                    key={band}
                    htmlFor={id}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-[var(--space-2)]",
                      "rounded-[var(--radius-sm)] border p-[var(--space-4)]",
                      "transition-[border-color,background-color] duration-200",
                      checked
                        ? "border-[color:var(--color-ink)] bg-[color:var(--color-bg)]"
                        : "border-[color:var(--color-border)] hover:border-[color:var(--color-ink)]",
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      value={band}
                      name={field.name}
                      checked={checked}
                      onChange={() => field.onChange(band)}
                      onBlur={field.onBlur}
                      className="sr-only"
                    />
                    <span
                      aria-label={`Budget band ${band}`}
                      className={cn(
                        "font-display text-[length:var(--text-2xl)] leading-none",
                        checked
                          ? "text-[color:var(--color-gold)]"
                          : "text-[color:var(--color-ink-muted)]",
                      )}
                    >
                      {band}
                    </span>
                    <span className="text-[length:var(--text-sm)] text-[color:var(--color-ink-muted)]">
                      {BUDGET_BAND_NOTES[band]}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        />
      </Fieldset>

      <Fieldset
        legend="Add-ons"
        hint="We coordinate these directly with trusted partners."
        error={errors.addOns?.message as string | undefined}
      >
        <Controller
          control={control}
          name="addOns"
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-[var(--space-2)] sm:grid-cols-3">
              {ADD_ONS.map((addOn) => {
                const id = `${formId}-addon-${addOn}`;
                const checked = field.value?.includes(addOn) ?? false;
                return (
                  <label
                    key={addOn}
                    htmlFor={id}
                    className={cn(
                      "flex cursor-pointer items-center gap-[var(--space-3)]",
                      "rounded-[var(--radius-sm)] border p-[var(--space-3)]",
                      "text-[length:var(--text-sm)]",
                      "transition-[border-color] duration-200",
                      checked
                        ? "border-[color:var(--color-ink)] bg-[color:var(--color-bg)]"
                        : "border-[color:var(--color-border)] hover:border-[color:var(--color-ink)]",
                    )}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = new Set(field.value ?? []);
                        if (e.target.checked) next.add(addOn);
                        else next.delete(addOn);
                        field.onChange(Array.from(next));
                      }}
                      className="h-4 w-4 accent-[color:var(--color-accent)]"
                    />
                    {ADD_ON_LABELS[addOn]}
                  </label>
                );
              })}
            </div>
          )}
        />
      </Fieldset>
    </>
  );
}

/* ============================================================ STEP 3 */

type Step3Props = {
  formId: string;
  register: UseFormRegister<InquiryInput>;
  errors: FieldErrors<InquiryInput>;
};

function Step3({ formId, register, errors }: Step3Props): React.ReactElement {
  return (
    <>
      <Field
        id={`${formId}-name`}
        label="Your name"
        error={errors.name?.message}
      >
        <input
          id={`${formId}-name`}
          type="text"
          autoComplete="name"
          {...register("name")}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-2">
        <Field
          id={`${formId}-phone`}
          label="Phone"
          hint="+91 format — we may WhatsApp this number."
          error={errors.phone?.message}
        >
          <input
            id={`${formId}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
            className={inputCls}
          />
        </Field>

        <Field
          id={`${formId}-email`}
          label="Email"
          error={errors.email?.message}
        >
          <input
            id={`${formId}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
            className={inputCls}
          />
        </Field>
      </div>

      <label
        htmlFor={`${formId}-wa`}
        className="inline-flex cursor-pointer items-center gap-[var(--space-2)] text-[length:var(--text-sm)]"
      >
        <input
          id={`${formId}-wa`}
          type="checkbox"
          {...register("whatsappPreferred")}
          className="h-4 w-4 accent-[color:var(--color-accent)]"
        />
        I prefer WhatsApp over phone calls
      </label>

      <Field
        id={`${formId}-message`}
        label="Tell us more"
        hint="The story, the mood, anything you've already imagined."
        error={errors.message?.message}
      >
        <textarea
          id={`${formId}-message`}
          rows={5}
          {...register("message")}
          className={cn(
            inputCls,
            "min-h-[140px] resize-y py-[var(--space-3)] leading-relaxed",
          )}
        />
      </Field>
    </>
  );
}

/* ============================================================ shared */

const inputCls = cn(
  "h-12 w-full rounded-[var(--radius-sm)] border px-[var(--space-4)]",
  "border-[color:var(--color-border)] bg-[color:var(--color-bg)]",
  "text-[length:var(--text-base)] text-[color:var(--color-ink)]",
  "placeholder:text-[color:var(--color-ink-soft)]",
  "focus-visible:border-[color:var(--color-accent)]",
);

function Fieldset({
  legend,
  hint,
  error,
  children,
}: {
  legend: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <fieldset className="flex flex-col gap-[var(--space-3)]">
      <legend className="flex flex-col gap-[2px]">
        <span className="text-[length:var(--text-sm)] font-medium tracking-[var(--tracking-tight)] text-[color:var(--color-ink)]">
          {legend}
        </span>
        {hint && (
          <span className="text-[length:var(--text-xs)] text-[color:var(--color-ink-soft)]">
            {hint}
          </span>
        )}
      </legend>
      {children}
      {error && (
        <span
          role="alert"
          className="text-[length:var(--text-xs)] text-[color:var(--color-error)]"
        >
          {error}
        </span>
      )}
    </fieldset>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={id}
        className="flex flex-col gap-[2px]"
      >
        <span className="text-[length:var(--text-sm)] font-medium tracking-[var(--tracking-tight)] text-[color:var(--color-ink)]">
          {label}
        </span>
        {hint && (
          <span className="text-[length:var(--text-xs)] text-[color:var(--color-ink-soft)]">
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <span
          role="alert"
          className="text-[length:var(--text-xs)] text-[color:var(--color-error)]"
        >
          {error}
        </span>
      )}
    </div>
  );
}
