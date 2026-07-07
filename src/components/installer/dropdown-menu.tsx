/**
 * `DropdownMenu` — the unified action-menu surface.
 *
 * Use this primitive whenever the popup presents *verbs on a subject*:
 * archive, duplicate, delete, switch workspace, sign out. It is NOT a
 * select (single committed value) and NOT a combobox (searchable
 * picking). If you find yourself putting a search input inside a menu
 * or a list of radio options intended for committing, reach for
 * `Select` or `Combobox` instead.
 *
 * Built on Base UI's `Menu` primitive — the behavioral layer handles
 * typeahead, roving focus, submenu nesting, and focus-return on
 * close. It renders to `document.body` by default (no portal
 * container wiring needed). The only thing this file owns is the
 * Installer visual language, which lives in `./dropdown-primitives`.
 *
 * `asChild` is preserved as sugar over Base UI's `render` prop so
 * trigger buttons / custom rows keep their existing chrome.
 *
 * ## Usage
 *
 *   <DropdownMenu>
 *     <DropdownMenuTrigger className="...">Actions</DropdownMenuTrigger>
 *     <DropdownMenuContent>
 *       <DropdownMenuLabel>Workspace</DropdownMenuLabel>
 *       <DropdownMenuItem icon={<PencilSimple />} shortcut="⌘E">
 *         Edit
 *       </DropdownMenuItem>
 *       <DropdownMenuSeparator />
 *       <DropdownMenuItem variant="destructive" icon={<Trash />}>
 *         Delete
 *       </DropdownMenuItem>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 */

import { Menu } from "@base-ui/react/menu";
import { CaretRight, Check, Circle } from "@phosphor-icons/react";
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

import { cn } from "#/lib/utils";

import {
	DROPDOWN_ITEM_CLASS,
	DROPDOWN_ITEM_COMPACT_CLASS,
	DROPDOWN_ITEM_DESTRUCTIVE_CLASS,
	DROPDOWN_LABEL_CLASS,
	DROPDOWN_LIST_CLASS,
	DROPDOWN_POPUP_CLASS,
	DROPDOWN_SEPARATOR_CLASS,
	DROPDOWN_SHORTCUT_CLASS,
	type DropdownAnchoring,
	type DropdownDensity,
} from "./dropdown-primitives";

// ═══════════════════════════════════════════════════════════════════
// Root + Trigger + Sub
// ═══════════════════════════════════════════════════════════════════

type RootProps = ComponentPropsWithoutRef<typeof Menu.Root>;

/** Menu.Root re-export — `modal={false}` is the sensible default for app chrome. */
function DropdownMenu({ modal = false, ...props }: RootProps) {
	return <Menu.Root modal={modal} {...props} />;
}

type TriggerProps = ComponentPropsWithoutRef<typeof Menu.Trigger> & {
	/**
	 * Render the child element as the trigger instead of the default
	 * `<button>`. Mirrors Radix ergonomics; under the hood this maps
	 * to Base UI's `render` prop.
	 */
	asChild?: boolean;
};

const DropdownMenuTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
	function DropdownMenuTrigger({ asChild, children, ...props }, ref) {
		if (asChild && isValidElement(children)) {
			return (
				<Menu.Trigger
					ref={ref}
					render={children as ReactElement<Record<string, unknown>>}
					{...props}
				/>
			);
		}
		return (
			<Menu.Trigger ref={ref} {...props}>
				{children}
			</Menu.Trigger>
		);
	},
);

const DropdownMenuSub = Menu.SubmenuRoot;

// ═══════════════════════════════════════════════════════════════════
// Content
// ═══════════════════════════════════════════════════════════════════

type ContentProps = Omit<
	ComponentPropsWithoutRef<typeof Menu.Popup>,
	"render"
> &
	DropdownAnchoring & {
		density?: DropdownDensity;
	};

/**
 * Portal + Positioner + Popup in one component. Collapses Base UI's
 * three-level anchored structure into the single node consumers
 * think of — "the menu's body" — without losing the ability to
 * override anchoring. Portals to `document.body`.
 */
const DropdownMenuContent = forwardRef<HTMLDivElement, ContentProps>(
	function DropdownMenuContent(
		{
			className,
			children,
			side = "bottom",
			align = "start",
			sideOffset = 6,
			alignOffset,
			density: _density,
			...props
		},
		ref,
	) {
		return (
			<Menu.Portal>
				<Menu.Positioner
					side={side}
					align={align}
					sideOffset={sideOffset}
					alignOffset={alignOffset}
					className="z-50"
				>
					<Menu.Popup
						ref={ref}
						className={cn(DROPDOWN_POPUP_CLASS, className)}
						{...props}
					>
						<div className={DROPDOWN_LIST_CLASS}>{children}</div>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		);
	},
);

/** Submenu content — same shell, rendered under a nested Portal. */
const DropdownMenuSubContent = forwardRef<
	HTMLDivElement,
	Omit<ContentProps, "side">
>(function DropdownMenuSubContent(
	{
		className,
		children,
		align = "start",
		sideOffset = 4,
		alignOffset,
		density: _density,
		...props
	},
	ref,
) {
	return (
		<Menu.Portal>
			<Menu.Positioner
				align={align}
				sideOffset={sideOffset}
				alignOffset={alignOffset}
				className="z-50"
			>
				<Menu.Popup
					ref={ref}
					className={cn(DROPDOWN_POPUP_CLASS, className)}
					{...props}
				>
					<div className={DROPDOWN_LIST_CLASS}>{children}</div>
				</Menu.Popup>
			</Menu.Positioner>
		</Menu.Portal>
	);
});

// ═══════════════════════════════════════════════════════════════════
// Items
// ═══════════════════════════════════════════════════════════════════

type ItemProps = Omit<ComponentPropsWithoutRef<typeof Menu.Item>, "render"> & {
	/** `destructive` tints the row red + wires the AT semantic. */
	variant?: "default" | "destructive";
	density?: DropdownDensity;
	/** Small glyph in front of the label. */
	icon?: ReactNode;
	/** Right-aligned hint — kbd, chip, timestamp. */
	shortcut?: ReactNode;
	/** Indent the row by one icon-slot (used in submenus). */
	inset?: boolean;
	/**
	 * Render the row as a different element (e.g. a router Link). Maps
	 * to Base UI's `render` prop so the row keeps its menu-item
	 * behavior while rendering as your component.
	 */
	asChild?: boolean;
};

const DropdownMenuItem = forwardRef<HTMLDivElement, ItemProps>(
	function DropdownMenuItem(
		{
			className,
			variant = "default",
			density = "comfortable",
			icon,
			shortcut,
			inset,
			asChild,
			children,
			...props
		},
		ref,
	) {
		const merged = cn(
			DROPDOWN_ITEM_CLASS,
			density === "compact" && DROPDOWN_ITEM_COMPACT_CLASS,
			variant === "destructive" && DROPDOWN_ITEM_DESTRUCTIVE_CLASS,
			inset && "pl-8",
			className,
		);

		const body = (
			<>
				{icon ? (
					<span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/80 [&>svg]:size-4">
						{icon}
					</span>
				) : null}
				<span className="min-w-0 flex-1 truncate">{children}</span>
				{shortcut ? (
					<span className={DROPDOWN_SHORTCUT_CLASS}>{shortcut}</span>
				) : null}
			</>
		);

		if (asChild && isValidElement(children)) {
			// In `asChild` mode the consumer provides the entire row;
			// pass it through `render` so Base UI still wires keyboard
			// selection to it. Icon/shortcut are ignored — composition
			// is the consumer's job.
			return (
				<Menu.Item
					ref={ref}
					className={merged}
					render={children as ReactElement<Record<string, unknown>>}
					{...props}
				/>
			);
		}

		return (
			<Menu.Item ref={ref} className={merged} {...props}>
				{body}
			</Menu.Item>
		);
	},
);

// ── Submenu trigger ─────────────────────────────────────────────

type SubTriggerProps = ComponentPropsWithoutRef<typeof Menu.SubmenuTrigger> & {
	icon?: ReactNode;
	inset?: boolean;
};

const DropdownMenuSubTrigger = forwardRef<HTMLDivElement, SubTriggerProps>(
	function DropdownMenuSubTrigger(
		{ className, icon, inset, children, ...props },
		ref,
	) {
		return (
			<Menu.SubmenuTrigger
				ref={ref}
				className={cn(DROPDOWN_ITEM_CLASS, inset && "pl-8", className)}
				{...props}
			>
				{icon ? (
					<span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/80 [&>svg]:size-4">
						{icon}
					</span>
				) : null}
				<span className="min-w-0 flex-1 truncate">{children}</span>
				<CaretRight aria-hidden="true" className="ml-auto size-3.5" />
			</Menu.SubmenuTrigger>
		);
	},
);

// ── Checkbox / radio ────────────────────────────────────────────

type CheckboxItemProps = ComponentPropsWithoutRef<typeof Menu.CheckboxItem> & {
	density?: DropdownDensity;
};

const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, CheckboxItemProps>(
	function DropdownMenuCheckboxItem(
		{ className, density = "comfortable", children, ...props },
		ref,
	) {
		return (
			<Menu.CheckboxItem
				ref={ref}
				className={cn(
					DROPDOWN_ITEM_CLASS,
					density === "compact" && DROPDOWN_ITEM_COMPACT_CLASS,
					"pl-7",
					className,
				)}
				{...props}
			>
				<span className="absolute left-2 flex size-4 items-center justify-center">
					<Menu.CheckboxItemIndicator>
						<Check className="size-3.5" weight="bold" />
					</Menu.CheckboxItemIndicator>
				</span>
				<span className="min-w-0 flex-1 truncate">{children}</span>
			</Menu.CheckboxItem>
		);
	},
);

const DropdownMenuRadioGroup = Menu.RadioGroup;

type RadioItemProps = ComponentPropsWithoutRef<typeof Menu.RadioItem> & {
	density?: DropdownDensity;
};

const DropdownMenuRadioItem = forwardRef<HTMLDivElement, RadioItemProps>(
	function DropdownMenuRadioItem(
		{ className, density = "comfortable", children, ...props },
		ref,
	) {
		return (
			<Menu.RadioItem
				ref={ref}
				className={cn(
					DROPDOWN_ITEM_CLASS,
					density === "compact" && DROPDOWN_ITEM_COMPACT_CLASS,
					"pl-7",
					className,
				)}
				{...props}
			>
				<span className="absolute left-2 flex size-4 items-center justify-center">
					<Menu.RadioItemIndicator>
						<Circle className="size-2 fill-current" weight="fill" />
					</Menu.RadioItemIndicator>
				</span>
				<span className="min-w-0 flex-1 truncate">{children}</span>
			</Menu.RadioItem>
		);
	},
);

// ── Label / separator / group / shortcut ────────────────────────

const DropdownMenuGroup = Menu.Group;

const DropdownMenuLabel = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<"div"> & { inset?: boolean }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
	return (
		<div
			ref={ref}
			role="presentation"
			className={cn(DROPDOWN_LABEL_CLASS, inset && "pl-8", className)}
			{...props}
		/>
	);
});

const DropdownMenuSeparator = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<typeof Menu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
	return (
		<Menu.Separator
			ref={ref}
			className={cn(DROPDOWN_SEPARATOR_CLASS, className)}
			{...props}
		/>
	);
});

/** Pure visual — doesn't claim any menu semantics. */
function DropdownMenuShortcut({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<span className={cn(DROPDOWN_SHORTCUT_CLASS, className)}>{children}</span>
	);
}

// ═══════════════════════════════════════════════════════════════════
// Exports
// ═══════════════════════════════════════════════════════════════════

export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};
