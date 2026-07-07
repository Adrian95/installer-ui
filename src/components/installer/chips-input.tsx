import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "#/lib/utils";

// A token/tag input: free text becomes removable chips. Enter or comma
// commits the current text; Backspace on an empty field removes the last
// chip; each chip has its own remove button. De-dupes case-insensitively so
// "SaaS" and "saas" don't both land.

const CHIP_SPRING = {
	type: "spring",
	stiffness: 520,
	damping: 34,
	mass: 0.5,
} as const;

export function Chip({
	label,
	onRemove,
	disabled,
	animate = true,
}: {
	label: string;
	onRemove?: () => void;
	disabled?: boolean;
	animate?: boolean;
}) {
	const reduceMotion = useReducedMotion();
	const motionProps =
		animate && !reduceMotion
			? {
					layout: true,
					initial: { opacity: 0, scale: 0.85 },
					animate: { opacity: 1, scale: 1 },
					exit: { opacity: 0, scale: 0.85 },
					transition: CHIP_SPRING,
				}
			: {};

	return (
		<motion.span
			{...motionProps}
			className="inline-flex max-w-full items-center gap-1 rounded-[6px] border border-border/70 bg-card py-0.5 pl-2 pr-1 text-[12px] font-medium text-foreground"
		>
			<span className="truncate">{label}</span>
			{onRemove ? (
				<button
					type="button"
					aria-label={`Remove ${label}`}
					onClick={onRemove}
					disabled={disabled}
					className="inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
				>
					<X weight="bold" className="size-2.5" />
				</button>
			) : null}
		</motion.span>
	);
}

export function ChipsInput({
	value,
	onChange,
	placeholder,
	disabled = false,
	id,
	"aria-label": ariaLabel,
}: {
	value: readonly string[];
	onChange: (next: string[]) => void;
	placeholder?: string;
	disabled?: boolean;
	id?: string;
	"aria-label"?: string;
}) {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const [text, setText] = useState("");

	function addToken(raw: string) {
		const token = raw.trim();
		if (token.length === 0) return;
		const exists = value.some(
			(entry) => entry.toLowerCase() === token.toLowerCase(),
		);
		if (!exists) onChange([...value, token]);
		setText("");
	}

	function removeAt(index: number) {
		onChange(value.filter((_, i) => i !== index));
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter" || event.key === ",") {
			event.preventDefault();
			addToken(text);
		} else if (event.key === "Backspace" && text.length === 0 && value.length) {
			event.preventDefault();
			removeAt(value.length - 1);
		}
	}

	return (
		// The input is `flex-1`, so it already fills the empty area to the right
		// of the chips — clicking the field lands on the real control. The
		// labeled control is the input itself; chip buttons carry their own
		// labels.
		<div
			className={cn(
				"flex w-full cursor-text flex-wrap items-center gap-1.5 rounded-[8px] border border-border bg-secondary px-2 py-1.5 text-left transition-[border-color,box-shadow] duration-150",
				"focus-within:border-primary focus-within:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
				disabled && "pointer-events-none opacity-50",
			)}
		>
			<AnimatePresence initial={false}>
				{value.map((chip, index) => (
					<Chip
						key={chip}
						label={chip}
						disabled={disabled}
						onRemove={() => removeAt(index)}
					/>
				))}
			</AnimatePresence>
			<input
				id={inputId}
				value={text}
				disabled={disabled}
				aria-label={ariaLabel}
				onChange={(event) => setText(event.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={() => addToken(text)}
				placeholder={value.length === 0 ? placeholder : undefined}
				className="font-ui h-6 min-w-[8ch] flex-1 bg-transparent px-1 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
			/>
		</div>
	);
}
