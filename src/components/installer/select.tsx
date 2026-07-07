/**
 * `Select` — commit one value from a known, small, stable set.
 *
 * Stage. Status. Priority. Theme. Role. The canonical "one-of-N"
 * picker: the user is committing a single value, the set is
 * enumerated ahead of time, and we want a crisp selected indicator +
 * keyboard commit-on-Enter.
 *
 * Built on Base UI `Select`. Two API shapes:
 *
 *   1. **Sugared** — pass `options` and get a fully-wired picker in
 *      one component. Covers 90 % of call sites.
 *
 *       <Select
 *         value={stage}
 *         onValueChange={setStage}
 *         options={STAGE_OPTIONS}
 *         placeholder="Pick a stage"
 *       />
 *
 *   2. **Composed** — drop to the primitives when you need a custom
 *      trigger or grouped items:
 *
 *       <SelectRoot value={stage} onValueChange={setStage}>
 *         <SelectTrigger>...</SelectTrigger>
 *         <SelectContent>
 *           <SelectGroup label="Pipeline">
 *             <SelectItem value="new">New</SelectItem>
 *           </SelectGroup>
 *         </SelectContent>
 *       </SelectRoot>
 *
 * For searchable selection (owner, account, contact) use `Combobox`
 * instead — Select is deliberately non-searchable so the keyboard
 * model is pure arrow-and-typeahead.
 *
 * Renders to `document.body` by default (Base UI's Portal), no
 * container wiring required.
 */

import { Select } from "@base-ui/react/select";
import { CaretDown, Check } from "@phosphor-icons/react";
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useMemo,
} from "react";

import { cn } from "#/lib/utils";

import {
	DROPDOWN_DESCRIPTION_CLASS,
	DROPDOWN_FIELD_TRIGGER_CLASS,
	DROPDOWN_GHOST_TRIGGER_CLASS,
	DROPDOWN_ITEM_CLASS,
	DROPDOWN_ITEM_COMPACT_CLASS,
	DROPDOWN_ITEM_SELECTED_CLASS,
	DROPDOWN_LABEL_CLASS,
	DROPDOWN_LIST_CLASS,
	DROPDOWN_POPUP_CLASS,
	DROPDOWN_SEPARATOR_CLASS,
	type DropdownAnchoring,
	type DropdownDensity,
	type DropdownOption,
} from "./dropdown-primitives";

// ═══════════════════════════════════════════════════════════════════
// Composable primitives
// ═══════════════════════════════════════════════════════════════════

type RootProps<TValue extends string> = Omit<
	ComponentPropsWithoutRef<typeof Select.Root>,
	"value" | "onValueChange" | "defaultValue"
> & {
	value: TValue | null;
	onValueChange: (value: TValue) => void;
	defaultValue?: TValue;
};

function SelectRoot<TValue extends string>({
	value,
	onValueChange,
	defaultValue,
	...props
}: RootProps<TValue>) {
	return (
		<Select.Root
			value={value ?? undefined}
			onValueChange={(next) => {
				if (typeof next === "string") onValueChange(next as TValue);
			}}
			defaultValue={defaultValue}
			{...props}
		/>
	);
}

// ── Trigger ─────────────────────────────────────────────────────

type TriggerProps = ComponentPropsWithoutRef<typeof Select.Trigger> & {
	/**
	 * - `field` (default): h-9 border + bg-secondary, for form rows.
	 * - `ghost`: minimal chrome, merges with surrounding UI.
	 * - `bare`: no styling; consumer supplies everything.
	 */
	intent?: "field" | "ghost" | "bare";
	placeholder?: string;
	/** Overrides the default `<Select.Value>` rendering. */
	children?: ReactNode;
	/** Use a custom element as the trigger (e.g. a colored badge). */
	asChild?: boolean;
};

const SelectTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
	function SelectTrigger(
		{
			className,
			intent = "field",
			placeholder,
			children,
			asChild,
			nativeButton,
			...props
		},
		ref,
	) {
		const baseClass =
			intent === "ghost"
				? DROPDOWN_GHOST_TRIGGER_CLASS
				: intent === "bare"
					? ""
					: DROPDOWN_FIELD_TRIGGER_CLASS;

		if (asChild && isValidElement(children)) {
			return (
				<Select.Trigger
					ref={ref}
					className={cn(baseClass, className)}
					nativeButton={nativeButton ?? false}
					render={children as ReactElement<Record<string, unknown>>}
					{...props}
				/>
			);
		}

		return (
			<Select.Trigger
				ref={ref}
				className={cn(baseClass, className)}
				nativeButton={nativeButton}
				{...props}
			>
				<span className="flex min-w-0 flex-1 items-center gap-2 text-left">
					{children ?? (
						<Select.Value
							placeholder={
								<span className="truncate text-muted-foreground">
									{placeholder ?? "Select…"}
								</span>
							}
							className="min-w-0 truncate"
						/>
					)}
				</span>
				<Select.Icon
					render={
						<CaretDown
							aria-hidden="true"
							className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150 group-data-[popup-open]/trigger:rotate-180"
						/>
					}
				/>
			</Select.Trigger>
		);
	},
);

// ── Content (Portal + Positioner + Popup) ───────────────────────

type ContentProps = Omit<
	ComponentPropsWithoutRef<typeof Select.Popup>,
	"render"
> &
	DropdownAnchoring & {
		positionerClassName?: string;
	};

const SelectContent = forwardRef<HTMLDivElement, ContentProps>(
	function SelectContent(
		{
			className,
			children,
			side = "bottom",
			align = "start",
			sideOffset = 6,
			alignOffset,
			positionerClassName,
			...props
		},
		ref,
	) {
		return (
			<Select.Portal>
				<Select.Positioner
					side={side}
					align={align}
					sideOffset={sideOffset}
					alignOffset={alignOffset}
					className={cn("z-50", positionerClassName)}
				>
					<Select.Popup
						ref={ref}
						className={cn(DROPDOWN_POPUP_CLASS, className)}
						{...props}
					>
						<Select.List className={DROPDOWN_LIST_CLASS}>
							{children}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		);
	},
);

// ── Item ────────────────────────────────────────────────────────

type ItemProps = ComponentPropsWithoutRef<typeof Select.Item> & {
	density?: DropdownDensity;
	icon?: ReactNode;
	description?: string;
};

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(function SelectItem(
	{ className, density = "comfortable", icon, description, children, ...props },
	ref,
) {
	return (
		<Select.Item
			ref={ref}
			className={cn(
				DROPDOWN_ITEM_CLASS,
				// Base UI auto-wires `data-selected` on the row that matches
				// the committed value. Our selected-state recipe is already
				// keyed off that attribute, so just composing it here paints
				// the brand tint + rail without runtime class arithmetic.
				DROPDOWN_ITEM_SELECTED_CLASS,
				density === "compact" && DROPDOWN_ITEM_COMPACT_CLASS,
				description && "h-auto min-h-8 items-start py-2",
				"pr-7",
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
				<Select.ItemText className="min-w-0 truncate text-[13px] font-medium leading-none">
					{children}
				</Select.ItemText>
				{description ? (
					<span className={DROPDOWN_DESCRIPTION_CLASS}>{description}</span>
				) : null}
			</div>
			<Select.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
				<Check
					className="size-3.5 text-[var(--color-brand)]"
					weight="bold"
					aria-hidden="true"
				/>
			</Select.ItemIndicator>
		</Select.Item>
	);
});

// ── Label / group / separator ───────────────────────────────────

const SelectGroup = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Select.Group> & { label?: ReactNode }
>(function SelectGroup({ className, label, children, ...props }, ref) {
	return (
		<Select.Group ref={ref} className={cn("px-0", className)} {...props}>
			{label ? (
				<Select.GroupLabel className={DROPDOWN_LABEL_CLASS}>
					{label}
				</Select.GroupLabel>
			) : null}
			{children}
		</Select.Group>
	);
});

const SelectSeparator = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Select.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
	return (
		<Select.Separator
			ref={ref}
			className={cn(DROPDOWN_SEPARATOR_CLASS, className)}
			{...props}
		/>
	);
});

// ═══════════════════════════════════════════════════════════════════
// Sugared single-component API
// ═══════════════════════════════════════════════════════════════════

export interface SelectProps<TValue extends string> extends DropdownAnchoring {
	id?: string;
	value: TValue | null;
	onValueChange: (value: TValue) => void;
	options: readonly DropdownOption<TValue>[];
	placeholder?: string;
	disabled?: boolean;
	density?: DropdownDensity;
	intent?: "field" | "ghost" | "bare";
	triggerClassName?: string;
	popupClassName?: string;
	positionerClassName?: string;
	/** Override the trigger's rendered value (e.g. colored badge). */
	renderValue?: (option: DropdownOption<TValue> | null) => ReactNode;
	/** Override individual option rows. */
	renderItem?: (option: DropdownOption<TValue>) => ReactNode;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
}

/**
 * The single-component, data-driven Select. Automatically groups
 * options by `option.group` and draws a label per group.
 */
function InstallerSelect<TValue extends string>({
	id,
	value,
	onValueChange,
	options,
	placeholder,
	disabled,
	density = "comfortable",
	intent = "field",
	triggerClassName,
	popupClassName,
	positionerClassName,
	renderValue,
	renderItem,
	side,
	align,
	sideOffset,
	alignOffset,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	"aria-describedby": ariaDescribedBy,
}: SelectProps<TValue>) {
	const selected = useMemo(
		() => options.find((o) => o.value === value) ?? null,
		[options, value],
	);

	// Group consecutive options by their `group` key so the caller can
	// produce a sectioned list without hand-writing Group boundaries.
	const sections = useMemo(() => groupOptions(options), [options]);

	return (
		<SelectRoot value={value} onValueChange={onValueChange} disabled={disabled}>
			<SelectTrigger
				id={id}
				intent={intent}
				placeholder={placeholder}
				className={triggerClassName}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
			>
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
			</SelectTrigger>
			<SelectContent
				side={side}
				align={align}
				sideOffset={sideOffset}
				alignOffset={alignOffset}
				positionerClassName={positionerClassName}
				className={popupClassName}
			>
				{sections.map((section, sectionIndex) => (
					<SelectGroup
						// biome-ignore lint/suspicious/noArrayIndexKey: sections are consecutive display groups; labels can repeat, so order is part of identity
						key={`${section.label ?? "__ungrouped"}:${sectionIndex}`}
						label={section.label}
					>
						{section.items.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								disabled={option.disabled}
								density={density}
								icon={option.icon}
								description={option.description}
							>
								{renderItem
									? renderItem(option)
									: (option.display ?? option.label)}
							</SelectItem>
						))}
					</SelectGroup>
				))}
			</SelectContent>
		</SelectRoot>
	);
}

function groupOptions<TValue>(
	options: readonly DropdownOption<TValue>[],
): ReadonlyArray<{
	label: string | undefined;
	items: readonly DropdownOption<TValue>[];
}> {
	const sections: {
		label: string | undefined;
		items: DropdownOption<TValue>[];
	}[] = [];
	for (const option of options) {
		const current = sections[sections.length - 1];
		if (current && current.label === option.group) {
			current.items.push(option);
		} else {
			sections.push({ label: option.group, items: [option] });
		}
	}
	return sections;
}

// ═══════════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════════

export {
	InstallerSelect as Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectRoot,
	SelectSeparator,
	SelectTrigger,
};
