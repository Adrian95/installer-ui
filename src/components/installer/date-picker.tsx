import { Popover } from "@base-ui/react/popover";
import { CalendarBlank } from "@phosphor-icons/react";
import { motion } from "motion/react";
import * as React from "react";
import type { Matcher } from "react-day-picker";

import { cn } from "#/lib/utils";

import { Calendar } from "./calendar";

// ─── Tiny date helpers ──────────────────────────────────────────────────
//
// Standalone stand-ins for the app's internal `date-only` lib. All dates
// here are plain `Date` objects normalized to local noon (avoids DST
// off-by-one glitches when only the calendar day matters).

function buildDate(year: number, monthIndex: number, day: number): Date {
	return new Date(year, monthIndex, day, 12, 0, 0, 0);
}

function todayDate(): Date {
	const now = new Date();
	return buildDate(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(date: Date, amount: number): Date {
	const next = buildDate(date.getFullYear(), date.getMonth(), date.getDate());
	next.setDate(next.getDate() + amount);
	return next;
}

function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

type PopoverAlign = React.ComponentProps<typeof Popover.Positioner>["align"];
type PopoverSide = React.ComponentProps<typeof Popover.Positioner>["side"];

type DatePickerVariant = "field" | "pill" | "inline";

export interface DatePickerPreset {
	readonly label: string;
	readonly getValue: (today: Date) => Date;
}

export interface DatePickerProps {
	value: Date | null | undefined;
	onChange: (value: Date | null) => void;
	placeholder?: string;
	ariaLabel?: string;
	id?: string;
	name?: string;
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	autoFocus?: boolean;
	/**
	 * Open the popover automatically when the component mounts. Useful when
	 * `DatePicker` is revealed by a parent edit-mode transition (inline/editable
	 * fields) so the calendar appears directly rather than requiring a second
	 * click on the trigger.
	 */
	autoOpen?: boolean;
	allowClear?: boolean;
	closeOnSelect?: boolean;
	variant?: DatePickerVariant;
	align?: PopoverAlign;
	side?: PopoverSide;
	className?: string;
	contentClassName?: string;
	onBlur?: React.FocusEventHandler<HTMLButtonElement>;
	onFocus?: React.FocusEventHandler<HTMLButtonElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
	/**
	 * Fires when the popover closes, regardless of cause (selection, Escape,
	 * outside click). Edit-mode wrappers use this instead of `onBlur` because
	 * focus legitimately shifts between trigger and popup during interaction —
	 * blur-based commits would spuriously exit edit mode on every focus hop.
	 */
	onClose?: () => void;
	formatValue?: (value: Date) => string;
	startMonth?: Date;
	endMonth?: Date;
	disabledDates?: Matcher | Matcher[];
	presets?: readonly DatePickerPreset[];
}

const DEFAULT_PRESETS: readonly DatePickerPreset[] = [
	{ label: "Today", getValue: (today) => today },
	{ label: "Tomorrow", getValue: (today) => addDays(today, 1) },
	{ label: "Next week", getValue: (today) => addDays(today, 7) },
];

// ─── Trigger styles ───────────────────────────────────────────────────
//
// Three variants share a vocabulary (height, icon, truncation, focus ring)
// but each is tuned for a concrete surface. Each variant's "open" state
// pulls toward the popup's design language (primary-tinted focus ring,
// lifted surface) so the trigger + popup read as one component.

const TRIGGER_BASE = cn(
	"font-ui relative inline-flex min-w-0 items-center gap-2 text-left text-foreground outline-none",
	"transition-[border-color,background-color,color,box-shadow] duration-150",
	"disabled:cursor-not-allowed disabled:opacity-50",
);

const TRIGGER_VARIANT_CLASS: Record<DatePickerVariant, string> = {
	field: cn(
		"h-9 w-full rounded-[8px] border border-border bg-secondary px-3 text-sm leading-5",
		"hover:border-foreground/12 hover:bg-background/80",
		"focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
	),
	pill: cn(
		"h-8 min-w-[9.5rem] rounded-full border border-border/60 bg-card px-3 text-xs font-medium",
		"hover:border-foreground/15 hover:bg-muted",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
	),
	inline: cn(
		// Trigger sizes to its container (callers typically wrap with
		// `flex-1`/`w-full`). No hard min-width — avoids double truncation
		// in dense cells where the container is the real width authority.
		"h-8 rounded-[10px] border border-border/70 bg-background px-2.5 text-sm",
		"hover:border-foreground/15 hover:bg-accent/60",
		"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
	),
};

const TRIGGER_OPEN_CLASS: Record<DatePickerVariant, string> = {
	field:
		"border-primary/45 bg-background [box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
	pill: "border-primary/50 bg-background [box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
	inline:
		"border-primary/45 bg-background [box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
};

// ─── DatePicker ───────────────────────────────────────────────────────

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
	function DatePicker(
		{
			value,
			onChange,
			placeholder = "Select date",
			ariaLabel,
			id,
			name,
			disabled,
			required,
			invalid,
			autoFocus,
			autoOpen = false,
			allowClear = true,
			closeOnSelect = true,
			variant = "field",
			align = "start",
			side = "bottom",
			className,
			contentClassName,
			onBlur,
			onFocus,
			onKeyDown,
			onClose,
			formatValue = formatDate,
			startMonth,
			endMonth,
			disabledDates,
			presets = DEFAULT_PRESETS,
		}: DatePickerProps,
		ref,
	) {
		const selected = value ?? null;
		const today = todayDate();
		const [open, setOpen] = React.useState(autoOpen);
		const [month, setMonth] = React.useState<Date>(() => selected ?? today);

		const displayValue = selected ? formatValue(selected) : placeholder;
		const showClear = allowClear && selected != null;
		const hasFooter = presets.length > 0 || allowClear;

		const commitValue = React.useCallback(
			(next: Date | null) => {
				onChange(next);
				if (next) {
					setMonth(next);
					if (closeOnSelect) setOpen(false);
					return;
				}
				setMonth(today);
				setOpen(false);
			},
			[closeOnSelect, onChange, today],
		);

		return (
			<Popover.Root
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					if (next) {
						setMonth(selected ?? today);
					} else {
						onClose?.();
					}
				}}
			>
				<Popover.Trigger
					ref={ref}
					id={id}
					name={name}
					disabled={disabled}
					autoFocus={autoFocus}
					onBlur={onBlur}
					onFocus={onFocus}
					aria-label={ariaLabel ?? placeholder}
					aria-invalid={invalid ? "true" : undefined}
					aria-required={required ? "true" : undefined}
					render={
						<motion.button
							type="button"
							whileTap={disabled ? undefined : { scale: 0.985 }}
						/>
					}
					onKeyDown={(event) => {
						onKeyDown?.(event);
						if (event.defaultPrevented) return;
						if (!showClear) return;
						if (event.key !== "Backspace" && event.key !== "Delete") return;
						event.preventDefault();
						commitValue(null);
					}}
					className={(state) =>
						cn(
							TRIGGER_BASE,
							TRIGGER_VARIANT_CLASS[variant],
							invalid &&
								"border-destructive/55 focus-visible:border-destructive focus-visible:[box-shadow:0_0_0_3px_rgba(220,38,38,0.12)]",
							state.open && TRIGGER_OPEN_CLASS[variant],
							className,
						)
					}
				>
					<CalendarBlank
						aria-hidden
						className={cn(
							"size-4 shrink-0 text-muted-foreground transition-colors",
							open && "text-primary",
							selected && "text-foreground/70",
						)}
						weight={selected ? "fill" : "regular"}
					/>
					<span
						className={cn(
							"min-w-0 flex-1 truncate tabular-nums",
							!selected && "text-muted-foreground",
						)}
					>
						{displayValue}
					</span>
				</Popover.Trigger>

				<Popover.Portal>
					<Popover.Positioner
						side={side}
						align={align}
						sideOffset={8}
						collisionPadding={12}
						className="z-[70]"
					>
						<Popover.Popup
							render={
								<motion.div
									initial={{ opacity: 0, y: -4, scale: 0.985 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: -3, scale: 0.99 }}
									transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
								/>
							}
							className={cn(
								"w-[17.5rem] origin-top overflow-hidden rounded-[16px] border border-border/70 bg-popover text-popover-foreground",
								"shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_48px_-16px_rgba(15,23,42,0.22)]",
								"focus-visible:outline-none data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
								contentClassName,
							)}
						>
							<Calendar
								mode="single"
								month={month}
								onMonthChange={setMonth}
								selected={selected ?? undefined}
								onSelect={(next) => commitValue(next ?? null)}
								disabled={disabledDates}
								startMonth={startMonth}
								endMonth={endMonth}
							/>

							{hasFooter ? (
								<DatePickerFooter
									presets={presets}
									today={today}
									allowClear={allowClear}
									showClear={showClear}
									onPick={commitValue}
								/>
							) : null}
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			</Popover.Root>
		);
	},
);

DatePicker.displayName = "DatePicker";

// ─── Footer ───────────────────────────────────────────────────────────

const FOOTER_BUTTON_BASE = cn(
	"font-ui inline-flex h-7 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] px-2 text-[11px] font-medium outline-none",
	"transition-[background-color,color,scale] duration-150 active:scale-[0.96]",
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
	"disabled:pointer-events-none disabled:cursor-default",
);

export interface DatePickerFooterProps {
	presets: readonly DatePickerPreset[];
	today: Date;
	allowClear: boolean;
	showClear: boolean;
	onPick: (next: Date | null) => void;
}

export function DatePickerFooter({
	presets,
	today,
	allowClear,
	showClear,
	onPick,
}: DatePickerFooterProps) {
	return (
		<div className="flex items-center gap-1 border-t border-border/60 px-2 py-1.5">
			{presets.map((preset) => (
				<button
					key={preset.label}
					type="button"
					className={cn(
						FOOTER_BUTTON_BASE,
						"text-foreground/80 hover:bg-[rgba(0,0,0,0.04)] hover:text-foreground",
					)}
					onClick={() => onPick(preset.getValue(today))}
				>
					{preset.label}
				</button>
			))}
			{allowClear ? (
				<button
					type="button"
					disabled={!showClear}
					className={cn(
						FOOTER_BUTTON_BASE,
						"ml-auto",
						showClear
							? "text-muted-foreground hover:bg-[rgba(0,0,0,0.04)] hover:text-foreground"
							: "text-muted-foreground/40",
					)}
					onClick={() => onPick(null)}
				>
					Clear
				</button>
			) : null}
		</div>
	);
}

export { DatePicker };
