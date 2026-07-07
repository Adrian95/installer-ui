/**
 * Shared visual language for the Installer dropdown family
 * (`dropdown-menu.tsx`, `select.tsx`, `combobox.tsx`).
 *
 * Every picker reads its surface, item, and motion recipes from this
 * file — one cohesive grammar instead of three one-off pickers:
 *
 *   ─ Surface ─
 *     DROPDOWN_POPUP_CLASS         the floating card
 *     DROPDOWN_LIST_CLASS          the scroll region inside the popup
 *
 *   ─ Item anatomy ─
 *     DROPDOWN_ITEM_CLASS          the row
 *     DROPDOWN_ITEM_COMPACT_CLASS  tighter variant for cells
 *     DROPDOWN_ITEM_SELECTED_CLASS subtle tint for already-committed row
 *     DROPDOWN_ITEM_DESTRUCTIVE_CLASS destructive variant
 *
 *   ─ Slots & copy ─
 *     DROPDOWN_LABEL_CLASS         small uppercase group header
 *     DROPDOWN_SEPARATOR_CLASS     hairline between sections
 *     DROPDOWN_DESCRIPTION_CLASS   second-line meta on an item
 *     DROPDOWN_SECONDARY_CLASS     right-aligned meta (count, time)
 *     DROPDOWN_SHORTCUT_CLASS      row-level kbd hint
 *     DROPDOWN_KBD_CLASS           individual kbd chip
 *
 *   ─ Triggers ─
 *     DROPDOWN_FIELD_TRIGGER_CLASS  Select/Combobox in form rows
 *     DROPDOWN_GHOST_TRIGGER_CLASS  pill / toolbar style
 *     DROPDOWN_INLINE_CARET_CLASS   adaptive caret for inline cells
 *
 *   ─ Search + footer ─
 *     DROPDOWN_SEARCH_INPUT_CLASS    the input row inside comboboxes
 *     DROPDOWN_FOOTER_CLASS          the bottom hint rail
 *     DROPDOWN_EMPTY_CLASS           the "no matches" block
 *
 * Motion is CSS-only where possible — Base UI exposes
 * `data-[starting-style]` / `data-[ending-style]` attributes that
 * cleanly drive open/close transitions without React mount churn.
 * `DROPDOWN_SPRING` / `DROPDOWN_EASE` are for `motion/react` consumers
 * that need spring physics on top (committed-value pulse, etc).
 *
 * Self-containment note: every class below is expressed with plain
 * Tailwind utilities or Tailwind arbitrary values (`[scrollbar-width:thin]`,
 * `before:...`, `data-[starting-style]:...`). None of it depends on a
 * custom `@utility` or `@keyframes` block from `styles.css` — only on
 * the plain design tokens already defined there (`--color-brand`,
 * `--primary`, `--border`, `--popover`, `--secondary`, `--accent`,
 * `--muted`, `font-ui`). This file has no other dependencies.
 */

import type { ReactNode } from "react";

// ─── Tokens ──────────────────────────────────────────────────────

/**
 * Item density. `compact` is for dense surfaces (tables, inline
 * cells, command palettes); `comfortable` is for nav + action
 * menus where scanability wins over raw density.
 */
export type DropdownDensity = "compact" | "comfortable";

/** Anchored-popup placement passed through to Base UI's Positioner. */
export interface DropdownAnchoring {
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	sideOffset?: number;
	alignOffset?: number;
}

/**
 * Generic option shape used by the sugared Select and Combobox APIs.
 * Threads its value generic through the whole family so call sites
 * get exhaustive type checks on their enums.
 */
export interface DropdownOption<TValue> {
	value: TValue;
	label: string;
	description?: string;
	disabled?: boolean;
	/** Overrides label in both trigger and row (full override). */
	display?: ReactNode;
	/** Small glyph in front of the label (16px icon or color swatch). */
	icon?: ReactNode;
	/** Right-aligned secondary — kbd, count, timestamp. */
	secondary?: ReactNode;
	/** Group heading label; consecutive options with the same group render together. */
	group?: string;
	/** Extra strings that match the query (synonyms, codes). */
	keywords?: readonly string[];
}

// ═══════════════════════════════════════════════════════════════════
// Surface
// ═══════════════════════════════════════════════════════════════════
//
// One shell for every dropdown role. Menu, Select, and Combobox share
// the same popup chrome — only their *behavior* differs. This is
// intentional: the user should not have to learn that "status pickers
// open slower than action menus."

export const DROPDOWN_POPUP_CLASS = [
	// Layout
	"font-ui z-50 flex min-w-[var(--anchor-width,14rem)] flex-col",
	// Height clamp uses Base UI's exposed `--available-height` so the
	// popup never eats the viewport. 8px breathes under the edge.
	"max-h-[min(calc(var(--available-height,60vh)-8px),24rem)]",
	// Surface — a 10px radius is the sweet spot between "chip" and
	// "card." Border at 60% so dark-mode stays crisp without shouting.
	"overflow-hidden rounded-[10px] border border-border/60 bg-popover text-popover-foreground",
	// Elevation: a tight near-shadow for contact, a wide diffuse
	// shadow for depth, and a 1px inset highlight so the top edge
	// catches light without muddying the surface.
	"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_14px_40px_-16px_rgba(0,0,0,0.34),0_6px_18px_-8px_rgba(0,0,0,0.2)]",
	"outline-none focus-visible:outline-none",
	// Motion — CSS-only via Base UI data-states. 160ms open, 120ms close.
	// Transform-origin comes from the Positioner so the popup scales
	// from the edge closest to its trigger.
	"transform-gpu origin-[var(--transform-origin)] will-change-[opacity,transform]",
	"transition-[opacity,scale] duration-[160ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
	"data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.97]",
	"data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:duration-[120ms]",
].join(" ");

export const DROPDOWN_LIST_CLASS = [
	"flex min-h-0 flex-1 flex-col gap-px overflow-y-auto overscroll-contain p-1",
	// Slim, subtle scrollbar. The track is transparent so the popup
	// edge isn't cluttered. Expressed as arbitrary Tailwind values so
	// it needs no `scrollbar-thin` utility from styles.css.
	"[scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]",
	"[&::-webkit-scrollbar]:w-1.5",
	"[&::-webkit-scrollbar-track]:bg-transparent",
	"[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/70",
].join(" ");

// ═══════════════════════════════════════════════════════════════════
// Item anatomy
// ═══════════════════════════════════════════════════════════════════
//
//   ┌─────────────────────────────────────────────────────────┐
//   │ ▎  [icon]   Label                     [secondary] [✓]  │
//   │              Description                                │
//   └─────────────────────────────────────────────────────────┘
//     ↑    ↑        ↑                            ↑        ↑
//     │    │        │                            │        │
//     │    │        │                            │        └── Selected indicator
//     │    │        │                            └── Trailing: shortcut/count/time
//     │    │        └── Label + optional description
//     │    └── Leading: icon / swatch / avatar
//     └── Highlight rail (keyboard nav cue)
//
// Every row in the family renders with this geometry — action items,
// select options, combobox hits. The eye tracks predictably across
// all three primitives. The rail appears only on highlight so there's
// one unambiguous "you are here" cue for keyboard users without
// visual noise at rest.

export const DROPDOWN_ITEM_CLASS = [
	// Geometry
	"group/item relative flex h-8 shrink-0 cursor-default select-none items-center gap-2 rounded-md pl-2 pr-2",
	// Typography — 13px is the family's UI body. Weight 500 reads crisp
	// in both themes without feeling heavy.
	"text-[13px] font-medium leading-none text-foreground",
	// Motion on state changes. 75ms is short enough to feel
	// immediate while still being a *transition*, not a snap.
	"transition-[background-color,color] duration-75 ease-out",
	// Highlight (keyboard or pointer). accent ≈ subtle gray wash in
	// light mode, slate-600-ish in dark. We pair it with a bold 2px
	// brand rail on the left edge (::before) so the locus of focus
	// is unambiguous even for low-contrast vision.
	"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
	"before:pointer-events-none before:absolute before:inset-y-1.5 before:left-0 before:w-[2px] before:rounded-full before:bg-[var(--color-brand)] before:opacity-0 before:transition-opacity before:duration-100",
	"data-[highlighted]:before:opacity-100",
	// Disabled
	"data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
	// Icon slot defaults: 16px, muted, adopt row color on highlight.
	"[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground/80",
	"data-[highlighted]:[&>svg]:text-accent-foreground",
].join(" ");

/** Compact density for table cells / command palettes. */
export const DROPDOWN_ITEM_COMPACT_CLASS = "h-7 gap-1.5 text-[12.5px]";

/**
 * Subtle tint for the *currently-selected* option, in addition to
 * the check indicator. Gives peripheral scanning a second signal —
 * users don't need to land on the row to see "that's the one."
 *
 * Applied when `data-selected` is present (Base UI auto-wires this
 * on Select.Item). Written as a plain static class string so the
 * Tailwind JIT can see every variant.
 */
export const DROPDOWN_ITEM_SELECTED_CLASS = [
	"data-[selected]:bg-[color-mix(in_srgb,var(--color-brand)_6%,transparent)]",
	"data-[selected]:text-foreground",
	"data-[selected]:data-[highlighted]:bg-[color-mix(in_srgb,var(--color-brand)_12%,var(--accent))]",
	// A persistent brand rail on the selected row so the eye locks
	// onto it from peripheral vision. Sits behind the highlight rail.
	"data-[selected]:before:opacity-70",
].join(" ");

/** Destructive action tint (delete, sign out, archive). */
export const DROPDOWN_ITEM_DESTRUCTIVE_CLASS = [
	"text-destructive",
	"data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
	"before:bg-destructive",
	"[&>svg]:text-destructive/80",
	"data-[highlighted]:[&>svg]:text-destructive",
].join(" ");

// ═══════════════════════════════════════════════════════════════════
// Meta slots
// ═══════════════════════════════════════════════════════════════════

export const DROPDOWN_LABEL_CLASS =
	"px-2 pb-1 pt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground/65";

export const DROPDOWN_SEPARATOR_CLASS = "mx-2 my-1 h-px bg-border/60";

/** Second-line meta inside an item ("acme.com", "2 hours ago"). */
export const DROPDOWN_DESCRIPTION_CLASS =
	"mt-0.5 truncate text-[11px] font-normal leading-tight text-muted-foreground/80 group-data-[highlighted]/item:text-accent-foreground/80";

/** Right-aligned inline secondary (count, date). */
export const DROPDOWN_SECONDARY_CLASS =
	"ml-auto shrink-0 tabular-nums text-[11px] font-normal text-muted-foreground/70 group-data-[highlighted]/item:text-accent-foreground/80";

/** The trailing kbd/shortcut slot on a row. */
export const DROPDOWN_SHORTCUT_CLASS = [
	"ml-auto flex shrink-0 items-center gap-0.5",
	"text-[10px] font-semibold tracking-wide",
	"text-muted-foreground/60",
	"group-data-[highlighted]/item:text-accent-foreground/70",
].join(" ");

/**
 * Refined `<kbd>` chip. Used inside `DROPDOWN_SHORTCUT_CLASS`
 * containers and in footer hint bars (see `DropdownKbd` /
 * `DropdownHintBar` in `combobox.tsx`).
 */
export const DROPDOWN_KBD_CLASS = [
	"inline-flex h-4 min-w-[1rem] items-center justify-center rounded",
	"border border-border/60 bg-background/60 px-1",
	"font-sans text-[10px] font-semibold leading-none text-muted-foreground",
	"group-data-[highlighted]/item:border-accent-foreground/20 group-data-[highlighted]/item:text-accent-foreground/80",
].join(" ");

// ═══════════════════════════════════════════════════════════════════
// Triggers
// ═══════════════════════════════════════════════════════════════════
//
// Two trigger recipes. "Field" looks like an Input — h-9, bordered,
// focus ring — used inside form rows and property panels. "Ghost"
// merges with its surroundings and only reveals itself on hover or
// when the popup is open; used for toolbar chips, status pills, and
// inline-cell affordances.

export const DROPDOWN_FIELD_TRIGGER_CLASS = [
	// Match input chrome exactly so the picker reads as a form control.
	"group/trigger flex h-9 w-full items-center justify-between gap-2 rounded-[8px]",
	"border border-border bg-secondary px-3 py-2",
	"text-sm text-foreground",
	// Transitions
	"transition-[border-color,box-shadow,background-color] duration-150 outline-none",
	"hover:border-border/80",
	// Focus / open states — both render the brand glow so the
	// control feels "held" regardless of how the user opened it.
	"focus-visible:border-primary focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
	"data-[popup-open]:border-primary data-[popup-open]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--primary)_12%,transparent)]",
	// Disabled
	"disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const DROPDOWN_GHOST_TRIGGER_CLASS = [
	"group/trigger inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-foreground",
	"transition-[background-color,color] outline-none",
	"hover:bg-muted",
	"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]",
	"data-[popup-open]:bg-muted",
	"disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

/**
 * Caret styling for inline-cell triggers. The caret stays muted
 * until the row is hovered/focused (keeps dense tables calm), and
 * rotates 180° while the popup is open so open-state is signaled
 * without borrowing a second icon slot.
 */
export const DROPDOWN_INLINE_CARET_CLASS = [
	"size-3 shrink-0 text-muted-foreground/40",
	"transition-[color,rotate] duration-150",
	"group-hover/cell:text-muted-foreground/90 group-hover/inline:text-muted-foreground/90",
	"group-data-[popup-open]/trigger:rotate-180 group-data-[popup-open]/trigger:text-foreground/90",
].join(" ");

// ═══════════════════════════════════════════════════════════════════
// Search + footer + empty
// ═══════════════════════════════════════════════════════════════════

export const DROPDOWN_SEARCH_WRAPPER_CLASS =
	"flex h-10 shrink-0 items-center gap-2.5 border-b border-border/60 px-3";

export const DROPDOWN_SEARCH_INPUT_CLASS = [
	"min-w-0 flex-1 bg-transparent text-[13px] font-medium leading-none text-foreground",
	"placeholder:text-muted-foreground/55",
	"outline-none focus-visible:outline-none",
	"disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const DROPDOWN_EMPTY_CLASS =
	"flex flex-col items-center justify-center gap-2 px-3 py-8 text-center text-[12px] text-muted-foreground/70";

export const DROPDOWN_FOOTER_CLASS = [
	"flex h-9 shrink-0 items-center gap-3 border-t border-border/60 bg-muted/30 px-3",
	"text-[10.5px] font-medium text-muted-foreground/70",
].join(" ");

// ═══════════════════════════════════════════════════════════════════
// Motion
// ═══════════════════════════════════════════════════════════════════

/**
 * The one spring the whole family uses for layout / commit / chip
 * animations. Tuned to feel tactile without bouncing — 420/32
 * critically-damps most text-scale animations.
 */
export const DROPDOWN_SPRING = {
	type: "spring",
	stiffness: 420,
	damping: 32,
	mass: 0.7,
} as const;

/** Matches the CSS ease curve on the popup for motion/react consumers. */
export const DROPDOWN_EASE: readonly [number, number, number, number] = [
	0.22, 0.61, 0.36, 1,
];

// ═══════════════════════════════════════════════════════════════════
// Filter helpers
// ═══════════════════════════════════════════════════════════════════

/**
 * Default client-side matcher. Prefix > keyword > substring.
 *
 * Exported so other pickers share the exact same ranking philosophy
 * without reinventing it.
 */
export function defaultMatchesQuery<T>(
	option: DropdownOption<T>,
	query: string,
): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	if (option.label.toLowerCase().includes(q)) return true;
	if (option.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
	if (option.description?.toLowerCase().includes(q)) return true;
	return false;
}
