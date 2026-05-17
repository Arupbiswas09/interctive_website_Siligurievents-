"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type PostProgressProps = {
	/** ID of the article element to measure scroll progress against. */
	readonly targetId: string;
};

/**
 * PostProgress — fixed top-of-viewport reading progress bar.
 * Per docs/05-PAGE-SPECS.md §5.9 "Reading aids".
 *
 * Smoothing is driven by `gsap.quickTo` writing `transform: scaleX(v)`
 * on the bar directly — no React state in the hot loop, no re-renders
 * per scroll frame. Reduced motion: snaps without smoothing.
 */
export function PostProgress({ targetId }: PostProgressProps): React.ReactElement {
	const barRef = useRef<HTMLDivElement | null>(null);
	const [mounted, setMounted] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const bar = barRef.current;
		if (!bar) return;
		const target = document.getElementById(targetId);
		if (!target) return;

		// `quickTo` returns a buttery setter that internally smooths values
		// without triggering layout. We write to `scaleX` so the GPU
		// composites the bar — zero paint per frame.
		const quickScale = gsap.quickTo(bar, "scaleX", {
			duration: prefersReducedMotion ? 0 : 0.18,
			ease: "power2.out",
		});

		let rafId = 0;
		let lastV = -1;

		const computeProgress = (): void => {
			const rect = target.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const totalScrollable = rect.height - viewportHeight;
			let v: number;
			if (totalScrollable <= 0) {
				v = 1;
			} else {
				const passed = Math.min(Math.max(-rect.top, 0), totalScrollable);
				v = passed / totalScrollable;
			}
			if (v !== lastV) {
				lastV = v;
				quickScale(v);
			}
		};

		const onScroll = (): void => {
			if (rafId) return;
			rafId = window.requestAnimationFrame(() => {
				computeProgress();
				rafId = 0;
			});
		};

		// Initial paint — set without smoothing.
		bar.style.transformOrigin = "left center";
		gsap.set(bar, { scaleX: 0 });
		computeProgress();

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);

		return (): void => {
			if (rafId) window.cancelAnimationFrame(rafId);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			gsap.killTweensOf(bar);
		};
	}, [targetId, prefersReducedMotion]);

	if (!mounted) return <></>;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]",
				"bg-[color:var(--color-border)]",
			)}
		>
			<div
				ref={barRef}
				className="h-full w-full origin-left bg-[color:var(--color-accent)] will-change-transform"
				style={{ transform: "scaleX(0)" }}
			/>
		</div>
	);
}
