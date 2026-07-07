import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "#/lib/utils";

export function CopyButton({
	text,
	className,
	label = "Copy to clipboard",
}: {
	text: string;
	className?: string;
	label?: string;
}) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | null>(null);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			if (timer.current !== null) window.clearTimeout(timer.current);
			timer.current = window.setTimeout(() => setCopied(false), 1600);
		} catch {
			// Clipboard unavailable — nothing sensible to do.
		}
	};

	return (
		<button
			type="button"
			onClick={copy}
			aria-label={copied ? "Copied" : label}
			title={copied ? "Copied" : label}
			className={cn(
				"inline-flex size-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-neutral-400 transition-colors hover:bg-white/10 hover:text-white",
				copied && "text-[var(--color-brand)] hover:text-[var(--color-brand)]",
				className,
			)}
		>
			{copied ? (
				<Check className="size-3.5" aria-hidden="true" />
			) : (
				<Copy className="size-3.5" aria-hidden="true" />
			)}
		</button>
	);
}

/**
 * Always-dark code panel — reads well on both themes and spares us a
 * highlighter dependency. `maxHeight` turns long sources into a
 * scrollable well.
 */
export function CodeBlock({
	code,
	className,
	maxHeight,
}: {
	code: string;
	className?: string;
	maxHeight?: number;
}) {
	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-lg border border-border bg-[#0D110E] dark:border-white/10 dark:bg-[#141414]",
				className,
			)}
		>
			<CopyButton text={code} className="absolute right-2.5 top-2.5 z-10" />
			<pre
				className="overflow-auto p-4 pr-12 font-mono text-[12.5px] leading-relaxed text-neutral-300"
				style={maxHeight ? { maxHeight } : undefined}
			>
				<code>{code}</code>
			</pre>
		</div>
	);
}
