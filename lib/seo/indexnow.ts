/**
 * IndexNow client for pinging Bing/Yandex (and any participating engine)
 * when content is published or updated.
 *
 * Called from Payload `afterChange` hooks (per docs/08-CMS-PLAN.md §8.6).
 *
 * Key rotation:
 *   - Generate a UUID-ish key once, store in env `INDEXNOW_KEY`.
 *   - Drop a static text file at `/public/<KEY>.txt` whose contents = the key.
 *     IndexNow verifies via GET to that URL before accepting our submissions.
 *   - To rotate, mint a new key, replace the env var AND the public file in
 *     the same deploy.
 */

import { SITE_URL } from "./schemas";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow" as const;

export interface IndexNowOptions {
	/** Override the env-derived key (useful for tests). */
	key?: string;
	/** Hostname (no protocol). Defaults to siligurievent.com. */
	host?: string;
	/** Retry attempts on 5xx / network failures. Default 3. */
	maxRetries?: number;
	/** Base backoff in ms (exponential). Default 500. */
	retryBaseMs?: number;
	/** Inject a custom fetch (for tests). */
	fetchImpl?: typeof fetch;
}

export interface IndexNowResult {
	ok: boolean;
	status: number;
	submitted: number;
	error?: string;
	attempts: number;
}

function getKey(opt?: IndexNowOptions): string | undefined {
	return opt?.key ?? process.env.INDEXNOW_KEY;
}

function getHost(opt?: IndexNowOptions): string {
	if (opt?.host) return opt.host;
	try {
		return new URL(SITE_URL).host;
	} catch {
		return "siligurievent.com";
	}
}

function keyLocation(key: string): string {
	return `${SITE_URL}/${key}.txt`;
}

function sleep(ms: number): Promise<void> {
	return new Promise((res) => {
		setTimeout(res, ms);
	});
}

/**
 * Submit a batch of URLs to IndexNow.
 *
 * - Up to 10,000 URLs per request (we cap at 1,000 for safety).
 * - URLs must be on the configured host.
 * - Retries on 5xx and network errors with exponential backoff.
 *
 * Returns a structured result instead of throwing — callers in Payload
 * hooks should never let an IndexNow blip break a publish.
 */
export async function submitToIndexNow(
	urls: ReadonlyArray<string>,
	options: IndexNowOptions = {},
): Promise<IndexNowResult> {
	const key = getKey(options);
	if (!key) {
		return {
			ok: false,
			status: 0,
			submitted: 0,
			error: "INDEXNOW_KEY env var not set",
			attempts: 0,
		};
	}

	if (urls.length === 0) {
		return { ok: true, status: 200, submitted: 0, attempts: 0 };
	}

	const host = getHost(options);
	const fetchImpl = options.fetchImpl ?? fetch;
	const maxRetries = options.maxRetries ?? 3;
	const retryBaseMs = options.retryBaseMs ?? 500;

	// Filter to same-host, dedupe, cap at 1000.
	const seen = new Set<string>();
	const sanitised: string[] = [];
	for (const u of urls) {
		try {
			const parsed = new URL(u);
			if (parsed.host !== host) continue;
			if (seen.has(parsed.toString())) continue;
			seen.add(parsed.toString());
			sanitised.push(parsed.toString());
			if (sanitised.length >= 1000) break;
		} catch {
			/* skip malformed URLs */
		}
	}

	if (sanitised.length === 0) {
		return {
			ok: false,
			status: 0,
			submitted: 0,
			error: "No valid URLs after sanitisation",
			attempts: 0,
		};
	}

	const body = {
		host,
		key,
		keyLocation: keyLocation(key),
		urlList: sanitised,
	};

	let attempt = 0;
	let lastError: string | undefined;
	let lastStatus = 0;

	while (attempt <= maxRetries) {
		attempt += 1;
		try {
			const res = await fetchImpl(INDEXNOW_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					Accept: "application/json",
				},
				body: JSON.stringify(body),
			});

			lastStatus = res.status;

			// 200 / 202 — accepted.
			if (res.status === 200 || res.status === 202) {
				return {
					ok: true,
					status: res.status,
					submitted: sanitised.length,
					attempts: attempt,
				};
			}

			// 4xx — bad request, don't retry.
			if (res.status >= 400 && res.status < 500) {
				const text = await res.text().catch(() => "");
				return {
					ok: false,
					status: res.status,
					submitted: 0,
					error: text || `IndexNow rejected with ${res.status}`,
					attempts: attempt,
				};
			}

			// 5xx — retry.
			lastError = `IndexNow ${res.status}`;
		} catch (err) {
			lastError = err instanceof Error ? err.message : String(err);
		}

		if (attempt > maxRetries) break;
		await sleep(retryBaseMs * 2 ** (attempt - 1));
	}

	return {
		ok: false,
		status: lastStatus,
		submitted: 0,
		error: lastError ?? "Unknown failure",
		attempts: attempt,
	};
}

/**
 * Convenience — submit a single URL.
 */
export function submitOneToIndexNow(
	url: string,
	options?: IndexNowOptions,
): Promise<IndexNowResult> {
	return submitToIndexNow([url], options);
}

/**
 * Build the public verification text-file contents. Use during build to
 * regenerate `/public/<KEY>.txt` if you ever programmatically rotate the
 * key; in practice the file should be checked into the repo and updated
 * via PR.
 */
export function buildIndexNowKeyFile(key: string): string {
	return key.trim();
}

/**
 * Helper — given a list of relative paths, expand them into per-locale
 * absolute URLs ready for `submitToIndexNow`.
 */
export function expandPathsForIndexNow(
	paths: ReadonlyArray<string>,
	locales: ReadonlyArray<"en" | "hi"> = ["en", "hi"],
): string[] {
	const out: string[] = [];
	for (const path of paths) {
		const normalised = path.startsWith("/") ? path : `/${path}`;
		for (const locale of locales) {
			out.push(
				normalised === "/"
					? `${SITE_URL}/${locale}`
					: `${SITE_URL}/${locale}${normalised}`,
			);
		}
	}
	return out;
}
