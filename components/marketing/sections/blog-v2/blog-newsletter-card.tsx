"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { CeremonyOrnament } from "@/components/illustrations/ceremony-ornaments";
import { cn } from "@/lib/utils";

/**
 * Editorial newsletter signup card. Inline email validation + a tasteful
 * "thank you" state. No backend wiring yet — that lives in the inquiry
 * pipeline. We just collect the email and surface the confirmation.
 */
export function BlogNewsletterCard(): React.ReactElement {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

	const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		if (status !== "idle") return;
		if (!email.includes("@")) return;
		setStatus("submitting");
		// TODO: wire to Resend or Payload newsletter collection.
		window.setTimeout(() => setStatus("done"), 600);
	};

	return (
		<Section tone="default" spacing="lg">
			<Container>
				<article
					className={cn(
						"relative overflow-hidden",
						"rounded-[var(--radius-lg)]",
						"bg-[color:var(--color-bg-soft)]",
						"border border-[color:var(--color-gold)]/30",
						"px-[var(--space-8)] py-[var(--space-16)] md:px-[var(--space-16)]",
					)}
				>
					<BrassCorner position="tl" />
					<BrassCorner position="tr" />
					<BrassCorner position="bl" />
					<BrassCorner position="br" />

					<div
						aria-hidden="true"
						className={cn(
							"pointer-events-none absolute -right-16 -bottom-16",
							"hidden md:block",
							"h-[420px] w-[420px] opacity-[0.08]",
						)}
					>
						<CeremonyOrnament
							name="jasmine"
							className="h-full w-full"
							hue="var(--color-gold)"
							hueSecondary="var(--color-gold)"
						/>
					</div>

					<div className="relative grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-12 md:items-end">
						<div className="md:col-span-7">
							<Eyebrow tone="gold">A letter from the studio</Eyebrow>
							<DisplayHeading
								as="h2"
								size="xl"
								className="mt-[var(--space-5)] font-light italic"
							>
								A letter from the studio. Once a month.
							</DisplayHeading>
							<p
								className={cn(
									"mt-[var(--space-5)] max-w-[52ch]",
									"font-body text-[length:var(--text-base)] leading-relaxed",
									"text-[color:var(--color-ink-muted)]",
								)}
							>
								One essay, two photographs, and a single recipe for the
								season. No sales pitches, no calendar reminders — just the
								quiet, considered things we've learned that month.
							</p>
						</div>

						<form
							onSubmit={handleSubmit}
							className="md:col-span-5"
							aria-label="Subscribe to the studio newsletter"
						>
							{status === "done" ? (
								<p
									role="status"
									className={cn(
										"font-display italic text-[length:var(--text-xl)]",
										"text-[color:var(--color-ink)]",
									)}
								>
									Thank you — we'll be in touch.
								</p>
							) : (
								<div className="flex flex-col gap-[var(--space-3)]">
									<label
										htmlFor="newsletter-email"
										className={cn(
											"font-mono text-[length:var(--text-xs)] uppercase",
											"tracking-[var(--tracking-eyebrow)] text-[color:var(--color-ink-soft)]",
										)}
									>
										Email
									</label>
									<div
										className={cn(
											"flex items-stretch gap-[var(--space-3)]",
											"border-b border-[color:var(--color-ink)]/30",
											"focus-within:border-[color:var(--color-gold)]",
											"transition-colors",
										)}
									>
										<input
											id="newsletter-email"
											type="email"
											required
											autoComplete="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											disabled={status === "submitting"}
											className={cn(
												"min-w-0 flex-1 bg-transparent py-3",
												"font-body text-[length:var(--text-base)]",
												"text-[color:var(--color-ink)]",
												"placeholder:text-[color:var(--color-ink-soft)]",
												"focus:outline-none",
											)}
										/>
										<button
											type="submit"
											disabled={status === "submitting"}
											className={buttonVariants({
												variant: "gold",
												size: "md",
											})}
										>
											{status === "submitting" ? "Sending…" : "Subscribe"}
										</button>
									</div>
									<p
										className={cn(
											"mt-[var(--space-2)] font-body text-[length:var(--text-xs)]",
											"text-[color:var(--color-ink-soft)]",
										)}
									>
										We send 12 letters a year. Unsubscribe anytime.
									</p>
								</div>
							)}
						</form>
					</div>
				</article>
			</Container>
		</Section>
	);
}

function BrassCorner({
	position,
}: {
	position: "tl" | "tr" | "bl" | "br";
}): React.ReactElement {
	const map: Record<typeof position, string> = {
		tl: "top-3 left-3 rotate-0",
		tr: "top-3 right-3 rotate-90",
		bl: "bottom-3 left-3 -rotate-90",
		br: "bottom-3 right-3 rotate-180",
	};
	return (
		<span
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute z-10 h-7 w-7",
				"text-[color:var(--color-gold)]",
				map[position],
			)}
		>
			<svg
				viewBox="0 0 28 28"
				fill="none"
				className="h-full w-full"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
			>
				<path d="M0 10 L 0 0 L 10 0" />
				<path d="M3 13 Q 6 6 13 3" opacity="0.55" />
				<circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.7" />
			</svg>
		</span>
	);
}
