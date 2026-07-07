import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import type * as React from "react";
import {
	type ChevronProps,
	DayPicker,
	type DayPickerProps,
	type DropdownProps,
	getDefaultClassNames,
	UI,
} from "react-day-picker";

import { cn } from "#/lib/utils";

// ─── Custom components ────────────────────────────────────────────────
//
// `react-day-picker` renders the grid as a real `<table>`:
//
//   MonthGrid → <table>
//   Weekdays  → <thead><tr>
//   Weekday   → <th>
//   Weeks     → <tbody>
//   Week      → <tr>
//   Day       → <td>                  (carries aria-selected / data-*)
//   DayButton → <button> inside <td>
//
// Applying flex to a <thead>/<tbody>/<tr> breaks column layout — columns
// clip, rows stack oddly. So the grid uses native `table-fixed w-full`
// and all modifier state is read from the `<td>` via group selectors.

/**
 * Month / year dropdown. A native `<select>` is kept (keyboard, native
 * menu, SR support, zero custom menu code) with a ghost-button surface —
 * the caption reads as one typographic unit instead of two form-field
 * chips. No app dropdown component is used, so this is fully
 * self-contained.
 */
function CalendarDropdown({
	value,
	onChange,
	options,
	className,
	disabled,
	"aria-label": ariaLabel,
}: DropdownProps) {
	return (
		<span className="relative inline-flex shrink-0 items-center">
			<select
				value={value}
				onChange={onChange}
				disabled={disabled}
				aria-label={ariaLabel}
				className={cn(
					"h-7 cursor-pointer appearance-none rounded-[8px] bg-transparent py-0 pl-2 pr-5 font-ui text-sm font-semibold tracking-tight text-foreground outline-none",
					"transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
					"disabled:pointer-events-none disabled:opacity-40",
					className,
				)}
			>
				{options?.map((option) => (
					<option
						key={option.value}
						value={option.value}
						disabled={option.disabled}
					>
						{option.label}
					</option>
				))}
			</select>
			<CaretDown
				aria-hidden
				weight="bold"
				className="pointer-events-none absolute right-1.5 size-3 text-muted-foreground"
			/>
		</span>
	);
}

function CalendarChevron({ orientation = "left", className }: ChevronProps) {
	if (orientation === "left") {
		return <CaretLeft className={className} weight="bold" />;
	}
	if (orientation === "right") {
		return <CaretRight className={className} weight="bold" />;
	}
	if (orientation === "down") {
		return <CaretDown className={className} weight="bold" />;
	}
	return <CaretDown className={cn("rotate-180", className)} weight="bold" />;
}

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	fixedWeeks = true,
	captionLayout = "dropdown",
	startMonth,
	endMonth,
	month,
	onMonthChange,
	...props
}: DayPickerProps) {
	const defaultClassNames = getDefaultClassNames();
	const today = new Date();
	const fallbackStartMonth = new Date(today.getFullYear() - 5, 0, 1);
	const fallbackEndMonth = new Date(today.getFullYear() + 5, 11, 31);

	// Power-user keyboard hooks layered on top of react-day-picker's default
	// arrow / PageUp / PageDown navigation. We only intercept keys the
	// library leaves free — never reassign its grid nav.
	//
	//   t, .             jump today's month into view
	//   Shift+PageUp     previous year
	//   Shift+PageDown   next year
	//
	// The wrapping <div> catches the events before they bubble out of the
	// calendar, but uses a single handler so nothing fires when the
	// calendar isn't focused.
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.defaultPrevented) return;

		if (event.shiftKey && event.key === "PageUp") {
			event.preventDefault();
			const base = month ?? today;
			const next = new Date(base.getFullYear() - 1, base.getMonth(), 1, 12);
			onMonthChange?.(next);
			return;
		}

		if (event.shiftKey && event.key === "PageDown") {
			event.preventDefault();
			const base = month ?? today;
			const next = new Date(base.getFullYear() + 1, base.getMonth(), 1, 12);
			onMonthChange?.(next);
			return;
		}

		// Jump-to-today. Skip when typing into the month/year dropdowns
		// (`select` elements) so they keep their native first-letter search.
		const target = event.target as HTMLElement;
		const isEditableSurface =
			target.tagName === "SELECT" ||
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA";
		if ((event.key === "t" || event.key === ".") && !isEditableSurface) {
			event.preventDefault();
			const now = new Date();
			onMonthChange?.(new Date(now.getFullYear(), now.getMonth(), 1, 12));
		}
	};

	// The wrapping div is a keyboard proxy, not an interactive control —
	// the real grid roles live inside <DayPicker>. `role="group"` keeps
	// the a11y tree honest (grouping of related controls) without
	// stealing focus or implying a custom widget.
	return (
		<div role="group" onKeyDown={handleKeyDown}>
			<DayPicker
				showOutsideDays={showOutsideDays}
				fixedWeeks={fixedWeeks}
				captionLayout={captionLayout}
				startMonth={startMonth ?? fallbackStartMonth}
				endMonth={endMonth ?? fallbackEndMonth}
				month={month}
				onMonthChange={onMonthChange}
				className={cn("select-none p-2.5", className)}
				classNames={{
					[UI.Root]: defaultClassNames[UI.Root],
					// Single month: Months is the positioning context for the
					// absolutely-placed Nav. For multi-month, consumers can
					// override with their own `classNames`.
					[UI.Months]: "relative flex flex-col gap-3 sm:flex-row sm:gap-5",
					[UI.Month]: "flex flex-col gap-2",
					[UI.MonthCaption]: "flex h-8 items-center pl-0.5 pr-[4.25rem]",
					[UI.Dropdowns]: "flex items-center gap-0.5",
					[UI.DropdownRoot]: "flex shrink-0",
					[UI.MonthsDropdown]: "min-w-[6.5rem]",
					[UI.YearsDropdown]: "min-w-[4.5rem]",
					[UI.CaptionLabel]:
						"font-ui text-sm font-semibold tracking-tight text-foreground",
					// Nav renders as a sibling of Month inside Months. Anchor it
					// absolutely to the top-right of Months so it sits in the
					// same visual row as the caption.
					[UI.Nav]: "absolute right-0 top-0 z-10 flex h-8 items-center gap-0.5",
					[UI.PreviousMonthButton]: cn(
						"inline-flex size-7 items-center justify-center rounded-[8px] text-muted-foreground",
						"transition-[background-color,color,scale] duration-150",
						"hover:bg-muted hover:text-foreground active:scale-[0.96]",
						"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
						"disabled:pointer-events-none disabled:opacity-30",
					),
					[UI.NextMonthButton]: cn(
						"inline-flex size-7 items-center justify-center rounded-[8px] text-muted-foreground",
						"transition-[background-color,color,scale] duration-150",
						"hover:bg-muted hover:text-foreground active:scale-[0.96]",
						"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
						"disabled:pointer-events-none disabled:opacity-30",
					),
					[UI.Chevron]: "size-3.5",
					// Real <table>. `table-fixed` gives equal columns regardless of
					// numeric width; `w-full` lets it fill the popup.
					[UI.MonthGrid]: "w-full border-collapse table-fixed",
					[UI.Weekdays]: "",
					[UI.Weekday]:
						"h-7 pb-1 text-center align-middle font-ui text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70",
					[UI.Weeks]: "",
					[UI.Week]: "",
					// Day is the <td>. It carries aria-selected / data-selected /
					// data-today / data-outside / data-disabled — we style the
					// nested <button> from here via `group-data-[…]/day:`.
					[UI.Day]: cn(
						"group/day px-0 py-0.5 text-center align-middle",
						// Modifier → button styling, from the td state
						"[&[data-today=true]>button]:text-primary",
						"[&[data-today=true]>button]:font-semibold",
						"[&[data-outside=true]>button]:text-muted-foreground/40",
						"[&[data-disabled=true]>button]:pointer-events-none",
						"[&[data-disabled=true]>button]:opacity-40",
					),
					// 36 px tile hits touch guidance without blowing grid rhythm.
					[UI.DayButton]: cn(
						"relative mx-auto inline-flex size-9 items-center justify-center rounded-[10px] font-ui text-[13px] font-medium text-foreground outline-none",
						"transition-[background-color,color,scale,box-shadow] duration-150",
						"hover:bg-muted",
						"focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
						"active:scale-[0.96]",
						// Selected state is projected from the parent <td>:
						"group-data-[selected=true]/day:bg-primary",
						"group-data-[selected=true]/day:!text-primary-foreground",
						"group-data-[selected=true]/day:font-semibold",
						"group-data-[selected=true]/day:shadow-[0_6px_14px_-8px_color-mix(in_srgb,var(--primary)_70%,transparent)]",
						"group-data-[selected=true]/day:hover:bg-primary",
					),
					...classNames,
				}}
				components={{
					Dropdown: CalendarDropdown,
					Chevron: CalendarChevron,
				}}
				{...props}
			/>
		</div>
	);
}

export { Calendar };
