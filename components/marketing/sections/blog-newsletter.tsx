"use client";

import { useId, useState, type FormEvent } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * BlogNewsletter — single email field + optional name.
 * Per docs/05-PAGE-SPECS.md §5.8. Client Component because we manage a
 * submit state machine and inline confirmation. Action is stubbed — the
 * real endpoint lands in Sprint 4 alongside Resend integration.
 */
export function BlogNewsletter(): React.ReactElement {
	const nameId = useId();
	const emailId = useId();
	const [status, setStatus] = useState<Status>("idle");

	async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		setStatus("submitting");
		try {
			// TODO: POST to /api/newsletter once Sprint 4 wires Resend.
			await new Promise<void>((resolve) => setTimeout(resolve, 600));
			setStatus("success");
		} catch {
			setStatus("error");
		}
	}

	return (
		<Section tone="elevated" spacing="lg">
			<Container size="narrow">
				<div className="text-center">
					<Eyebrow tone="accent">Get the seasonal guide</Eyebrow>
					<h2
						className={cn(
							"mt-[var(--space-4)] font-display tracking-[var(--tracking-display)]",
							"text-[length:var(--text-4xl)] leading-[1.05]",
							"text-balance text-[color:var(--color-ink)]",
						)}
					>
						<em className="italic">Notes from the studio,</em> twice a season.
					</h2>
					<p
						className={cn(
							"mx-auto mt-[var(--space-4)] max-w-[520px]",
							"font-body text-[length:var(--text-base)] leading-[1.6]",
							"text-[color:var(--color-ink-muted)]",
						)}
					>
						TODO: Newsletter blurb — what subscribers receive, cadence, opt-out.
					</p>
				</div>

				{status === "success" ? (
					<div
						role="status"
						aria-live="polite"
						className={cn(
							"mx-auto mt-[var(--space-10)] max-w-[480px]",
							"rounded-[var(--radius-md)] border border-[color:var(--color-success)]/40",
							"bg-[color:var(--color-bg)] px-[var(--space-6)] py-[var(--space-6)] text-center",
						)}
					>
						<p
							className={cn(
								"font-display text-[length:var(--text-xl)] leading-[1.2]",
								"text-[color:var(--color-ink)]",
							)}
						>
							TODO: Thanks — we'll be in touch.
						</p>
					</div>
				) : (
					<form
						onSubmit={onSubmit}
						className={cn(
							"mx-auto mt-[var(--space-10)] max-w-[520px]",
							"grid gap-[var(--space-4)]",
						)}
						aria-describedby={
							status === "error" ? `${emailId}-error` : undefined
						}
					>
						<div>
							<label
								htmlFor={nameId}
								className={cn(
									"mb-[var(--space-2)] block font-body uppercase",
									"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
									"text-[color:var(--color-ink-muted)]",
								)}
							>
								Your name <span className="normal-case opacity-60">(optional)</span>
							</label>
							<input
								id={nameId}
								name="name"
								type="text"
								autoComplete="name"
								disabled={status === "submitting"}
								placeholder="TODO: Priya"
								className={cn(
									"h-12 w-full px-[var(--space-4)]",
									"rounded-[var(--radius-sm)] border border-[color:var(--color-border)]",
									"bg-[color:var(--color-bg)] font-body text-[length:var(--text-base)]",
									"text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]",
									"focus-visible:outline-none focus-visible:border-[color:var(--color-ink)]",
									"focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
									"focus-visible:ring-offset-[color:var(--color-bg-elevated)]",
									"disabled:opacity-60",
								)}
							/>
						</div>
						<div>
							<label
								htmlFor={emailId}
								className={cn(
									"mb-[var(--space-2)] block font-body uppercase",
									"text-[length:var(--text-xs)] tracking-[var(--tracking-eyebrow)]",
									"text-[color:var(--color-ink-muted)]",
								)}
							>
								Email
							</label>
							<input
								id={emailId}
								name="email"
								type="email"
								autoComplete="email"
								required
								disabled={status === "submitting"}
								placeholder="TODO: hello@yours.com"
								aria-invalid={status === "error" ? "true" : "false"}
								className={cn(
									"h-12 w-full px-[var(--space-4)]",
									"rounded-[var(--radius-sm)] border border-[color:var(--color-border)]",
									"bg-[color:var(--color-bg)] font-body text-[length:var(--text-base)]",
									"text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-soft)]",
									"focus-visible:outline-none focus-visible:border-[color:var(--color-ink)]",
									"focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
									"focus-visible:ring-offset-[color:var(--color-bg-elevated)]",
									"disabled:opacity-60",
								)}
							/>
							{status === "error" ? (
								<p
									id={`${emailId}-error`}
									role="alert"
									className={cn(
										"mt-[var(--space-2)] font-body text-[length:var(--text-sm)]",
										"text-[color:var(--color-error)]",
									)}
								>
									TODO: Something went wrong — please try again.
								</p>
							) : null}
						</div>
						<button
							type="submit"
							disabled={status === "submitting"}
							className={cn(
								"h-12 px-[var(--space-6)]",
								"rounded-[var(--radius-sm)] bg-[color:var(--color-accent)]",
								"font-medium text-[length:var(--text-base)] tracking-[var(--tracking-tight)]",
								"text-[color:var(--color-bg)]",
								"transition-colors hover:bg-[color:var(--color-accent-deep)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2",
								"focus-visible:ring-offset-[color:var(--color-bg-elevated)]",
								"disabled:cursor-not-allowed disabled:opacity-60",
							)}
						>
							{status === "submitting" ? "Sending…" : "Subscribe"}
						</button>
						<p
							className={cn(
								"mt-[var(--space-2)] text-center font-body text-[length:var(--text-xs)]",
								"text-[color:var(--color-ink-soft)]",
							)}
						>
							TODO: privacy line — one-click unsubscribe, no spam.
						</p>
					</form>
				)}
			</Container>
		</Section>
	);
}
