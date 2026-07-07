/**
 * `Combobox` — searchable single-value picker.
 *
 * Owner, account, contact, company, tag, linked record — anywhere the
 * set is large, dynamic, or the user already knows the *name* of what
 * they want. The picker is input-first: focus lands in a search box,
 * arrow keys walk the list, Enter commits, Esc closes. Clicking a row
 * commits.
 *
 * Built on Base UI `Combobox`. Two API shapes:
 *
 *   1. **Sugared** — fully wired single-component picker:
 *
 *       <Combobox
 *         value={ownerId}
 *         onValueChange={setOwnerId}
 *         items={owners}
 *         placeholder="Owner"
 *         renderItem={(o) => <OwnerRow owner={o} />}
 *       />
 *
 *      Pair with `onSearch` + `isSearching` when the list is
 *      server-driven; the parent owns debouncing.
 *
 *   2. **Composed** — drop to the primitives when you need a custom
 *      trigger (e.g. an entity tile) or grouped results:
 *
 *       <ComboboxRoot value={v} onValueChange={setV}>
 *         <ComboboxTrigger>…</ComboboxTrigger>
 *         <ComboboxContent>
 *           <ComboboxInput placeholder="Search" />
 *           <ComboboxList>
 *             <ComboboxGroup label="People">…</ComboboxGroup>
 *           </ComboboxList>
 *           <ComboboxEmpty>No matches.</ComboboxEmpty>
 *         </ComboboxContent>
 *       </ComboboxRoot>
 *
 * The behavior layer (focus trap, portal, keyboard nav, ARIA) is Base
 * UI's responsibility — it renders to `document.body` by default, no
 * container wiring required. This file owns the Installer look and
 * feel only — see `./dropdown-primitives` for the shared recipe.
 *
 * Also exports a small set of atoms shared by the dropdown family:
 * `Kbd`, `HintBar`, `StatusDot`, `LoadingRows`, `Spinner` — handy for
 * composing keyboard hint footers, async loading states, and status
 * rows around any of the three dropdown primitives.
 */

import { Combobox } from "@base-ui/react/combobox";
import {
	CaretDown,
	Check,
	MagnifyingGlass,
	SpinnerGap,
	X,
} from "@phosphor-icons/react";
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";

import { cn } from "#/lib/utils";

import {
	DROPDOWN_DESCRIPTION_CLASS,
	DROPDOWN_EMPTY_CLASS,
	DROPDOWN_FIELD_TRIGGER_CLASS,
	DROPDOWN_FOOTER_CLASS,
	DROPDOWN_GHOST_TRIGGER_CLASS,
	DROPDOWN_ITEM_CLASS,
	DROPDOWN_ITEM_COMPACT_CLASS,
	DROPDOWN_ITEM_SELECTED_CLASS,
	DROPDOWN_KBD_CLASS,
	DROPDOWN_LABEL_CLASS,
	DROPDOWN_LIST_CLASS,
	DROPDOWN_POPUP_CLASS,
	DROPDOWN_SEARCH_INPUT_CLASS,
	DROPDOWN_SEARCH_WRAPPER_CLASS,
	DROPDOWN_SEPARATOR_CLASS,
	type DropdownAnchoring,
	type DropdownDensity,
	type DropdownOption,
	defaultMatchesQuery,
} from "./dropdown-primitives";

// ═══════════════════════════════════════════════════════════════════
// Composable primitives
// ═══════════════════════════════════════════════════════════════════

type RootProps<TValue> = Omit<
	ComponentPropsWithoutRef<typeof Combobox.Root>,
	"value" | "onValueChange"
> & {
	value: TValue | null;
	onValueChange: (value: TValue | null) => void;
};

function ComboboxRoot<TValue>({
	value,
	onValueChange,
	autoHighlight = true,
	...props
}: RootProps<TValue>) {
	return (
		<Combobox.Root
			value={value}
			onValueChange={(next) => onValueChange(next as TValue | null)}
			autoHighlight={autoHighlight}
			{...props}
		/>
	);
}

// ── Trigger ─────────────────────────────────────────────────────

type TriggerProps = ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
	intent?: "field" | "ghost" | "bare";
	asChild?: boolean;
};

const ComboboxTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
	function ComboboxTrigger(
		{ className, intent = "field", asChild, nativeButton, children, ...props },
		ref,
	) {
		const base =
			intent === "ghost"
				? DROPDOWN_GHOST_TRIGGER_CLASS
				: intent === "bare"
					? ""
					: DROPDOWN_FIELD_TRIGGER_CLASS;

		if (asChild && isValidElement(children)) {
			return (
				<Combobox.Trigger
					ref={ref}
					className={cn(base, className)}
					// Base UI defaults `nativeButton` to true, which warns in dev
					// when `render` substitutes a non-<button> element. `asChild`
					// is used precisely to plug in a non-button wrapper (inline
					// cell, entity tile, etc.), so flip the default here. Callers
					// who really do wrap a <button> can opt back in explicitly.
					nativeButton={nativeButton ?? false}
					render={children as ReactElement<Record<string, unknown>>}
					{...props}
				/>
			);
		}

		return (
			<Combobox.Trigger
				ref={ref}
				className={cn(base, className)}
				nativeButton={nativeButton}
				{...props}
			>
				{children}
			</Combobox.Trigger>
		);
	},
);

// ── Content (Portal + Positioner + Popup) ───────────────────────

type ContentProps = Omit<
	ComponentPropsWithoutRef<typeof Combobox.Popup>,
	"render"
> &
	DropdownAnchoring & {
		/**
		 * Sizing of the popup. "anchor" matches the trigger width (default
		 * for inline cells + form rows); a number caps it at a fixed
		 * pixel width (used when the trigger is narrower than the row
		 * content wants to be).
		 */
		width?: number | "anchor" | "auto";
	};

const ComboboxContent = forwardRef<HTMLDivElement, ContentProps>(
	function ComboboxContent(
		{
			className,
			children,
			side = "bottom",
			align = "start",
			sideOffset = 6,
			alignOffset,
			width = "anchor",
			style,
			...props
		},
		ref,
	) {
		// Width strategy:
		//  - "anchor" (default): match the trigger width, but grow to fit a
		//    minimum of 16rem so a narrow trigger doesn't produce a claustrophobic list.
		//  - number: exact pixel width.
		//  - "auto": let content drive width.
		const widthStyle =
			width === "anchor"
				? {
						minWidth: "var(--anchor-width)",
						width: "max(var(--anchor-width),16rem)",
					}
				: width === "auto"
					? undefined
					: { width, minWidth: width };

		return (
			<Combobox.Portal>
				<Combobox.Positioner
					side={side}
					align={align}
					sideOffset={sideOffset}
					alignOffset={alignOffset}
					className="z-50"
				>
					<Combobox.Popup
						ref={ref}
						className={cn(DROPDOWN_POPUP_CLASS, className)}
						style={{ ...widthStyle, ...style }}
						{...props}
					>
						{children}
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		);
	},
);

// ── Search input row ────────────────────────────────────────────

type InputProps = Omit<
	ComponentPropsWithoutRef<typeof Combobox.Input>,
	"className"
> & {
	placeholder?: string;
	/** Right-side slot — spinner, clear button, shortcut hint. */
	trailing?: ReactNode;
	leading?: ReactNode;
	className?: string;
	wrapperClassName?: string;
};

const ComboboxInput = forwardRef<HTMLInputElement, InputProps>(
	function ComboboxInput(
		{ placeholder, leading, trailing, className, wrapperClassName, ...props },
		ref,
	) {
		return (
			<div className={cn(DROPDOWN_SEARCH_WRAPPER_CLASS, wrapperClassName)}>
				<span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/70">
					{leading ?? <MagnifyingGlass weight="bold" className="size-4" />}
				</span>
				<Combobox.Input
					ref={ref}
					placeholder={placeholder ?? "Search…"}
					className={cn(DROPDOWN_SEARCH_INPUT_CLASS, className)}
					{...props}
				/>
				{trailing ? (
					<span className="flex shrink-0 items-center">{trailing}</span>
				) : null}
			</div>
		);
	},
);

// ── List ────────────────────────────────────────────────────────

const ComboboxList = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Combobox.List>
>(function ComboboxList({ className, ...props }, ref) {
	return (
		<Combobox.List
			ref={ref}
			className={cn(DROPDOWN_LIST_CLASS, className)}
			{...props}
		/>
	);
});

// ── Item ────────────────────────────────────────────────────────

type ItemProps = ComponentPropsWithoutRef<typeof Combobox.Item> & {
	density?: DropdownDensity;
	icon?: ReactNode;
	trailing?: ReactNode;
	description?: string;
	/** Whether this item is currently the committed selection. */
	selected?: boolean;
};

const ComboboxItem = forwardRef<HTMLDivElement, ItemProps>(
	function ComboboxItem(
		{
			className,
			density = "comfortable",
			icon,
			trailing,
			description,
			selected,
			children,
			...props
		},
		ref,
	) {
		return (
			<Combobox.Item
				ref={ref}
				// Apply the selected prop as a data-attribute so the shared
				// `DROPDOWN_ITEM_SELECTED_CLASS` recipe drives both tint and
				// left-rail. Base UI will also set its own `data-selected` when
				// the item's value matches the Root's value; either trips the
				// same CSS so call sites that forget to pass `selected` still
				// get the correct visual.
				data-selected={selected ? "" : undefined}
				className={cn(
					DROPDOWN_ITEM_CLASS,
					DROPDOWN_ITEM_SELECTED_CLASS,
					density === "compact" && DROPDOWN_ITEM_COMPACT_CLASS,
					description && "h-auto min-h-8 items-start py-2",
					className,
				)}
				{...props}
			>
				{icon ? (
					<span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/80 [&>svg]:size-4">
						{icon}
					</span>
				) : null}
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="min-w-0 truncate text-[13px] font-medium leading-none">
						{children}
					</span>
					{description ? (
						<span className={DROPDOWN_DESCRIPTION_CLASS}>{description}</span>
					) : null}
				</div>
				{trailing ? (
					<span className="ml-auto flex shrink-0 items-center text-muted-foreground/70 group-data-[highlighted]/item:text-accent-foreground/80">
						{trailing}
					</span>
				) : null}
				{selected ? (
					<Check
						className="ml-auto size-3.5 shrink-0 text-[var(--color-brand)]"
						weight="bold"
						aria-hidden="true"
					/>
				) : null}
			</Combobox.Item>
		);
	},
);

// ── Group / separator / empty ───────────────────────────────────

const ComboboxGroup = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Combobox.Group> & { label?: ReactNode }
>(function ComboboxGroup({ className, label, children, ...props }, ref) {
	return (
		<Combobox.Group
			ref={ref}
			className={cn("flex flex-col", className)}
			{...props}
		>
			{label ? (
				<Combobox.GroupLabel className={DROPDOWN_LABEL_CLASS}>
					{label}
				</Combobox.GroupLabel>
			) : null}
			{children}
		</Combobox.Group>
	);
});

const ComboboxSeparator = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Combobox.Separator>
>(function ComboboxSeparator({ className, ...props }, ref) {
	return (
		<Combobox.Separator
			ref={ref}
			className={cn(DROPDOWN_SEPARATOR_CLASS, className)}
			{...props}
		/>
	);
});

const ComboboxEmpty = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Combobox.Empty>
>(function ComboboxEmpty({ className, children, ...props }, ref) {
	return (
		<Combobox.Empty
			ref={ref}
			className={cn(DROPDOWN_EMPTY_CLASS, className)}
			{...props}
		>
			{children}
		</Combobox.Empty>
	);
});

// ═══════════════════════════════════════════════════════════════════
// Sugared single-component API
// ═══════════════════════════════════════════════════════════════════

export interface ComboboxProps<TValue> extends DropdownAnchoring {
	id?: string;
	value: TValue | null;
	onValueChange: (value: TValue | null) => void;
	items: readonly DropdownOption<TValue>[];
	/** Override the default client-side filter. Use when ranking needs custom logic. */
	filter?: (option: DropdownOption<TValue>, query: string) => boolean;
	/**
	 * Fires on every keystroke — used for async / server-side search.
	 * When provided, client-side filtering is skipped and `items` is
	 * assumed to already be the filtered list.
	 */
	onSearch?: (query: string) => void;
	/** Show a spinner next to the search input. */
	isSearching?: boolean;
	emptyMessage?: ReactNode;
	placeholder?: string;
	searchPlaceholder?: string;
	/** When true, render an inline "×" that clears the selection. */
	allowClear?: boolean;
	disabled?: boolean;
	density?: DropdownDensity;
	intent?: "field" | "ghost" | "bare";
	triggerClassName?: string;
	popupClassName?: string;
	popupWidth?: number | "anchor" | "auto";
	renderValue?: (option: DropdownOption<TValue> | null) => ReactNode;
	renderItem?: (
		option: DropdownOption<TValue>,
		info: { selected: boolean },
	) => ReactNode;
	/** Passed through to Base UI for externally controlled openness. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	searchAriaLabel?: string;
}

/**
 * Opinionated, data-driven searchable picker. The 90 %-case API —
 * drop to the primitives only when you need custom trigger chrome or
 * grouped sections.
 *
 * ## How search actually works
 *
 * Base UI's Combobox filtering requires EITHER the function-children
 * pattern (`<List>{(item) => ...}</List>` + `items={...}` on Root) OR
 * external filtering with static children. We pick the second: simpler
 * mental model. Concretely:
 *
 *   - `query` is owned locally; `inputValue` + `onInputValueChange` on
 *     Root make Base UI's internal state a pure mirror of ours.
 *   - `filter={null}` disables Base UI's own filter pipeline — we own
 *     item visibility via `visibleItems` and render only those as children.
 *   - The empty state is a plain div gated on `visibleItems.length === 0`.
 *     `<Combobox.Empty>` is NOT used here because it keys off Base UI's
 *     internal filteredItems which we've intentionally short-circuited.
 *   - `query` is reset to "" whenever the popup closes so reopening
 *     starts with a clean slate.
 *
 * When `onSearch` is provided the parent owns the list — `items` arrive
 * already filtered by the server. We still track the typed query so the
 * callback fires, but we do not client-side filter on top.
 */
function InstallerCombobox<TValue>({
	id,
	value,
	onValueChange,
	items,
	filter,
	onSearch,
	isSearching = false,
	emptyMessage = "No matches.",
	placeholder,
	searchPlaceholder,
	allowClear = false,
	disabled,
	density = "comfortable",
	intent = "field",
	triggerClassName,
	popupClassName,
	popupWidth = "anchor",
	renderValue,
	renderItem,
	open,
	onOpenChange,
	side,
	align,
	sideOffset,
	alignOffset,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	"aria-describedby": ariaDescribedBy,
	searchAriaLabel,
}: ComboboxProps<TValue>) {
	const [query, setQuery] = useState("");

	const selected = useMemo(
		() => items.find((o) => o.value === value) ?? null,
		[items, value],
	);

	// Client-side filter. When the parent drives the list via
	// `onSearch`, trust their results as-is — they already filtered.
	const visibleItems = useMemo(() => {
		if (onSearch) return items;
		if (!query.trim()) return items;
		const matcher = filter ?? defaultMatchesQuery;
		return items.filter((o) => matcher(o, query));
	}, [items, filter, onSearch, query]);

	// Group CONSECUTIVE items by their `.group` key. Callers that want
	// one heading per group should pre-sort items by group.
	const sections = useMemo(() => {
		const out: {
			label: string | undefined;
			items: DropdownOption<TValue>[];
		}[] = [];
		for (const option of visibleItems) {
			const current = out[out.length - 1];
			if (current && current.label === option.group) {
				current.items.push(option);
			} else {
				out.push({ label: option.group, items: [option] });
			}
		}
		return out;
	}, [visibleItems]);

	const isEmpty = visibleItems.length === 0;

	const handleOpenChange = useCallback(
		(next: boolean) => {
			if (!next) setQuery("");
			onOpenChange?.(next);
		},
		[onOpenChange],
	);

	const handleInputValueChange = useCallback(
		(next: string) => {
			setQuery(next);
			onSearch?.(next);
		},
		[onSearch],
	);

	return (
		<ComboboxRoot
			value={value}
			onValueChange={onValueChange}
			disabled={disabled}
			open={open}
			onOpenChange={handleOpenChange}
			inputValue={query}
			onInputValueChange={handleInputValueChange}
			// Filtering is external; disable Base UI's internal pipeline so
			// the `filteredItems`/`empty` store values don't contradict what
			// we actually render.
			filter={null}
		>
			<ComboboxTrigger
				id={id}
				intent={intent}
				className={triggerClassName}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
			>
				<span className="flex min-w-0 flex-1 items-center gap-2 text-left">
					{renderValue ? (
						renderValue(selected)
					) : selected ? (
						<span className="flex min-w-0 items-center gap-2 truncate">
							{selected.icon ? (
								<span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/80 [&>svg]:size-4">
									{selected.icon}
								</span>
							) : null}
							<span className="truncate">
								{selected.display ?? selected.label}
							</span>
						</span>
					) : (
						<span className="truncate text-muted-foreground">
							{placeholder ?? "Select…"}
						</span>
					)}
				</span>
				<CaretDown
					aria-hidden="true"
					className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150 group-data-[popup-open]/trigger:rotate-180"
				/>
			</ComboboxTrigger>
			<ComboboxContent
				side={side}
				align={align}
				sideOffset={sideOffset}
				alignOffset={alignOffset}
				width={popupWidth}
				className={popupClassName}
			>
				<ComboboxInput
					placeholder={searchPlaceholder ?? placeholder ?? "Search…"}
					aria-label={
						searchAriaLabel ?? (ariaLabel ? `${ariaLabel} search` : undefined)
					}
					trailing={
						<>
							{isSearching ? (
								<SpinnerGap
									aria-hidden="true"
									className="size-3.5 animate-spin text-muted-foreground/70"
								/>
							) : null}
							{allowClear && selected ? (
								<button
									type="button"
									aria-label="Clear selection"
									onClick={() => onValueChange(null)}
									className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									<X className="size-3.5" weight="bold" aria-hidden="true" />
								</button>
							) : null}
						</>
					}
				/>
				<ComboboxList>
					{isSearching && items.length === 0 ? (
						<LoadingRows />
					) : (
						<>
							{sections.map((section, sectionIndex) => (
								<ComboboxGroup
									// biome-ignore lint/suspicious/noArrayIndexKey: sections derive from `items`; no more stable key is available and it is immaterial for re-ordering
									key={`${section.label ?? "__ungrouped"}:${sectionIndex}`}
									label={section.label}
								>
									{section.items.map((option) => {
										const isSelected = option.value === value;
										return (
											<ComboboxItem
												key={String(option.value)}
												value={option.value}
												disabled={option.disabled}
												density={density}
												icon={option.icon}
												description={option.description}
												selected={isSelected}
											>
												{renderItem
													? renderItem(option, { selected: isSelected })
													: (option.display ?? option.label)}
											</ComboboxItem>
										);
									})}
								</ComboboxGroup>
							))}
							{isEmpty ? (
								<div className={DROPDOWN_EMPTY_CLASS}>{emptyMessage}</div>
							) : null}
						</>
					)}
				</ComboboxList>
			</ComboboxContent>
		</ComboboxRoot>
	);
}

// ═══════════════════════════════════════════════════════════════════
// Shared dropdown-family atoms
// ═══════════════════════════════════════════════════════════════════
//
// Small pieces any of the three dropdown primitives (DropdownMenu,
// Select, Combobox) may embed. Kept here — rather than split into a
// fourth file — per the "only these four files" constraint; import
// them from `./combobox` wherever needed.

/**
 * A single kbd chip. Usage:
 *
 *   <Kbd>↵</Kbd>
 *   <Kbd>⌘K</Kbd>
 */
function Kbd({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <kbd className={cn(DROPDOWN_KBD_CLASS, className)}>{children}</kbd>;
}

/**
 * Linear-style keyboard affordance bar rendered at the bottom of a
 * Combobox or command-palette popup. Takes a list of hint pairs — one
 * or more kbd chips and a short label.
 *
 *   <HintBar
 *     hints={[
 *       { keys: ["↑", "↓"], label: "navigate" },
 *       { keys: ["↵"],      label: "select"   },
 *       { keys: ["esc"],    label: "close"    },
 *     ]}
 *   />
 */
export interface HintBarEntry {
	keys: readonly string[];
	label: string;
}

function HintBar({
	hints,
	trailing,
	className,
}: {
	hints?: readonly HintBarEntry[];
	/** Right-slot content (e.g. a small brand icon). */
	trailing?: ReactNode;
	className?: string;
}) {
	const resolved =
		hints ??
		([
			{ keys: ["↑", "↓"], label: "navigate" },
			{ keys: ["↵"], label: "select" },
			{ keys: ["esc"], label: "close" },
		] satisfies readonly HintBarEntry[]);

	return (
		<div className={cn(DROPDOWN_FOOTER_CLASS, className)}>
			{resolved.map((hint) => (
				<span
					key={hint.label}
					className="inline-flex items-center gap-1 whitespace-nowrap"
				>
					<span className="inline-flex items-center gap-0.5">
						{hint.keys.map((k, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: key chars are stable per hint; no natural id
							<Kbd key={`${k}-${idx}`}>{k}</Kbd>
						))}
					</span>
					<span>{hint.label}</span>
				</span>
			))}
			{trailing ? (
				<span className="ml-auto inline-flex items-center">{trailing}</span>
			) : null}
		</div>
	);
}

/**
 * Small colored dot used in status-style rows (and triggers).
 *
 *   <StatusDot color="#00CC33" />
 *
 * Accepts any CSS color. Use sparingly — the point is at-a-glance
 * parsing, not decoration.
 */
function StatusDot({
	color,
	size = "sm",
	className,
	...props
}: {
	color: string;
	size?: "sm" | "md";
	className?: string;
	"aria-hidden"?: boolean;
}) {
	const dims = size === "md" ? "size-2.5" : "size-2";
	return (
		<span
			aria-hidden="true"
			className={cn(
				dims,
				"inline-block shrink-0 rounded-full shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground)_8%,transparent)_inset]",
				className,
			)}
			style={{ backgroundColor: color }}
			{...props}
		/>
	);
}

/**
 * Skeleton rows rendered in a combobox while async items load.
 * Matches the 32px item row so the popup stays the same height
 * before and after the data lands (no layout shift on reveal).
 */
function LoadingRows({
	count = 3,
	compact = false,
}: {
	count?: number;
	compact?: boolean;
}) {
	const widths = [72, 58, 86] as const;
	const rowHeight = compact ? "h-7" : "h-8";
	return (
		<div aria-busy="true" className="flex flex-col gap-px p-1">
			{Array.from({ length: count }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are positional placeholders with no identity
					key={`combobox-skel-${i}`}
					className={cn("flex items-center gap-2 rounded-md px-2", rowHeight)}
				>
					<span className="size-4 shrink-0 animate-pulse rounded-sm bg-muted/80" />
					<span
						className="h-2 animate-pulse rounded bg-muted/80"
						style={{
							width: `${widths[i % widths.length]}%`,
							animationDelay: `${i * 75}ms`,
						}}
					/>
				</div>
			))}
		</div>
	);
}

/** Inline spinner — use inside trailing slots. */
function Spinner({ className }: { className?: string }) {
	return (
		<SpinnerGap
			aria-hidden="true"
			className={cn(
				"size-3.5 shrink-0 animate-spin text-muted-foreground/70",
				className,
			)}
		/>
	);
}

// ═══════════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════════

export {
	InstallerCombobox as Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxRoot,
	ComboboxSeparator,
	ComboboxTrigger,
	HintBar,
	Kbd,
	LoadingRows,
	Spinner,
	StatusDot,
};
