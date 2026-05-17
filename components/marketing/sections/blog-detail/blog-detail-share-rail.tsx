"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type BlogDetailShareRailProps = {
	title: string;
	path: string;
};

const SITE_ORIGIN = "https://siligurievent.in";

/**
 * Vertical, fixed left-side share rail. Desktop (lg+) only.
 * Magnetic-feel scale interaction via Framer Motion. Brass icons.
 */
export function BlogDetailShareRail({
	title,
	path,
}: BlogDetailShareRailProps): React.ReactElement {
	const prefersReducedMotion = useReducedMotion();
	const [copied, setCopied] = useState<boolean>(false);

	const url = useMemo(() => {
		const base = path.startsWith("http") ? path : `${SITE_ORIGIN}${path}`;
		return base;
	}, [path]);

	const links: ReadonlyArray<{
		label: string;
		href: string;
		icon: React.ReactNode;
	}> = [
		{
			label: "Share on X / Twitter",
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
			icon: <TwitterIcon />,
		},
		{
			label: "Share on Facebook",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			icon: <FacebookIcon />,
		},
		{
			label: "Share on WhatsApp",
			href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`,
			icon: <WhatsAppIcon />,
		},
	];

	const handleCopy = async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	const tap = prefersReducedMotion ? undefined : { scale: 0.92 };
	const hover = prefersReducedMotion ? undefined : { scale: 1.12 };

	return (
		<aside
			aria-label="Share this article"
			className={cn(
				"pointer-events-none fixed left-[var(--space-6)] top-1/2 z-30",
				"hidden -translate-y-1/2 lg:block",
			)}
		>
			<ul
				className={cn(
					"pointer-events-auto flex flex-col items-center gap-[var(--space-4)]",
					"rounded-full border border-[color:var(--color-gold)]/35",
					"bg-[color:var(--color-bg)]/85 px-2 py-4",
					"backdrop-blur-md",
				)}
			>
				{links.map((link) => (
					<li key={link.label}>
						<motion.a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={link.label}
							whileHover={hover}
							whileTap={tap}
							transition={{ type: "spring", stiffness: 320, damping: 22 }}
							className={cn(
								"flex h-10 w-10 items-center justify-center rounded-full",
								"text-[color:var(--color-gold)]",
								"transition-colors duration-300 hover:bg-[color:var(--color-gold)]/12",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
							)}
						>
							{link.icon}
						</motion.a>
					</li>
				))}

				<li>
					<motion.button
						type="button"
						onClick={handleCopy}
						aria-label={copied ? "Link copied" : "Copy link"}
						whileHover={hover}
						whileTap={tap}
						transition={{ type: "spring", stiffness: 320, damping: 22 }}
						className={cn(
							"flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
							"text-[color:var(--color-gold)]",
							"transition-colors duration-300 hover:bg-[color:var(--color-gold)]/12",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]",
						)}
					>
						{copied ? <CheckIcon /> : <LinkIcon />}
					</motion.button>
				</li>

				<li
					aria-hidden="true"
					className="my-1 h-8 w-px bg-[color:var(--color-gold)]/35"
				/>

				<li
					aria-hidden="true"
					className={cn(
						"writing-mode-vertical font-mono text-[length:10px] uppercase",
						"tracking-[0.28em] text-[color:var(--color-gold)]/75",
					)}
					style={{
						writingMode: "vertical-rl",
						transform: "rotate(180deg)",
					}}
				>
					Share
				</li>
			</ul>
		</aside>
	);
}

function TwitterIcon(): React.ReactElement {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M18.244 2H21l-6.55 7.49L22 22h-6.797l-5.32-6.96L3.8 22H1.043l7.014-8.02L1.5 2h6.969l4.812 6.36L18.244 2Zm-1.193 18.4h1.71L7.043 3.503H5.21L17.05 20.4Z" />
		</svg>
	);
}

function FacebookIcon(): React.ReactElement {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M22 12a10 10 0 1 0-11.563 9.875v-6.987H7.898V12h2.539V9.797c0-2.506 1.493-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.987A10.003 10.003 0 0 0 22 12Z" />
		</svg>
	);
}

function WhatsAppIcon(): React.ReactElement {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.56 4.14 1.62 5.94L0 24l6.27-1.6A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Zm-8.5 18.4a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.72.95.99-3.63-.22-.37A9.36 9.36 0 0 1 2.6 12 9.42 9.42 0 1 1 12 21.42a9.36 9.36 0 0 1 .02.02ZM17.2 14.4c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.74.91-.9 1.1-.17.19-.33.21-.61.07a7.7 7.7 0 0 1-2.27-1.4 8.5 8.5 0 0 1-1.57-1.95c-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 1-1 2.43s1.03 2.83 1.17 3.02c.14.19 2.03 3.1 4.92 4.35.69.3 1.22.47 1.64.6.69.22 1.32.19 1.82.12.55-.08 1.66-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33Z" />
		</svg>
	);
}

function LinkIcon(): React.ReactElement {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
		</svg>
	);
}

function CheckIcon(): React.ReactElement {
	return (
		<svg
			viewBox="0 0 24 24"
			width="16"
			height="16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.4"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M5 12l5 5 9-11" />
		</svg>
	);
}
