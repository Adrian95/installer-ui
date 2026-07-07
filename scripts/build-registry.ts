/**
 * Builds shadcn-compatible registry JSON into public/r/.
 *
 * Run with: bun scripts/build-registry.ts
 *
 * Each component item inlines its source files from disk at build time
 * (never hand-copied), rewriting this repo's `#/` import alias to the
 * shadcn-conventional `@/`. Relative imports (`./logo-path`) are left
 * alone. Shared files (logo-path, tooltip, dropdown-primitives, cn)
 * are duplicated into every item that needs them so each installs
 * standalone.
 *
 * A dedicated `theme` item ships the full token sheet (CSS variables +
 * type utilities + keyframes) so `npx shadcn add …/r/theme.json` gives
 * a consumer the whole design system in one shot. Token-reliant
 * components list it in `registryDependencies`, so installing any one
 * of them also writes the tokens into the consumer's globals.css —
 * where they own and can edit every value.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "r");

const REGISTRY_NAME = "installer-ui";
const HOMEPAGE = "https://installer-ui.vercel.app";
const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const INDEX_SCHEMA = "https://ui.shadcn.com/schema/registry.json";
const THEME_URL = `${HOMEPAGE}/r/theme.json`;

// ── Types (subset of the shadcn registry-item schema) ────────────────────

type RegistryItemType =
	| "registry:component"
	| "registry:ui"
	| "registry:lib"
	| "registry:style";

interface FileDef {
	path: string;
	type: "registry:component" | "registry:ui" | "registry:lib";
	target: string;
}

type CssMap = Record<string, string>;

interface ItemDef {
	name: string;
	type?: RegistryItemType;
	title: string;
	description: string;
	dependencies?: readonly string[];
	registryDependencies?: readonly string[];
	files?: readonly FileDef[];
	cssVars?: { theme?: CssMap; light?: CssMap; dark?: CssMap };
	css?: Record<string, unknown>;
}

// ── Shared files ──────────────────────────────────────────────────────────

const FILE_LOGO_PATH: FileDef = {
	path: "src/components/installer/logo-path.ts",
	type: "registry:component",
	target: "components/installer/logo-path.ts",
};
const FILE_UTILS: FileDef = {
	path: "src/lib/utils.ts",
	type: "registry:lib",
	target: "lib/utils.ts",
};
const FILE_TOOLTIP: FileDef = {
	path: "src/components/ui/tooltip.tsx",
	type: "registry:ui",
	target: "components/ui/tooltip.tsx",
};
const FILE_DROPDOWN_PRIMS: FileDef = {
	path: "src/components/installer/dropdown-primitives.ts",
	type: "registry:component",
	target: "components/installer/dropdown-primitives.ts",
};

function installerFile(basename: string): FileDef {
	return {
		path: `src/components/installer/${basename}`,
		type: "registry:component",
		target: `components/installer/${basename}`,
	};
}

// ── Dependency sets ────────────────────────────────────────────────────────

const CN = ["clsx", "tailwind-merge"] as const;
const BASE_UI = "@base-ui/react";
const PHOSPHOR = "@phosphor-icons/react";

// ── Theme item: the full token sheet ──────────────────────────────────────
//
// Values mirror src/styles.css. The distributed display-font stack
// omits Interstaller (an Installer brand asset) and falls back to
// Geist → Inter → system-ui, so installs need no font files.

const THEME_MAP: CssMap = {
	"color-brand": "var(--color-brand)",
	"color-brand-light": "var(--color-brand-light)",
	"color-brand-strong": "var(--color-brand-strong)",
	"color-background": "var(--background)",
	"color-foreground": "var(--foreground)",
	"color-card": "var(--card)",
	"color-card-foreground": "var(--card-foreground)",
	"color-popover": "var(--popover)",
	"color-popover-foreground": "var(--popover-foreground)",
	"color-primary": "var(--primary)",
	"color-primary-foreground": "var(--primary-foreground)",
	"color-secondary": "var(--secondary)",
	"color-secondary-foreground": "var(--secondary-foreground)",
	"color-muted": "var(--muted)",
	"color-muted-foreground": "var(--muted-foreground)",
	"color-accent": "var(--accent)",
	"color-accent-foreground": "var(--accent-foreground)",
	"color-destructive": "var(--destructive)",
	"color-destructive-foreground": "var(--destructive-foreground)",
	"color-border": "var(--border)",
	"color-input": "var(--input)",
	"color-ring": "var(--ring)",
	"radius-sm": "calc(var(--radius) - 4px)",
	"radius-md": "calc(var(--radius) - 2px)",
	"radius-lg": "var(--radius)",
	"radius-xl": "calc(var(--radius) + 4px)",
	"font-sans": "var(--font-copy-stack)",
	"font-ui": "var(--font-ui-stack)",
	"font-display": "var(--font-display-stack)",
	"font-mono": '"JetBrains Mono", ui-monospace, monospace',
};

const LIGHT_MAP: CssMap = {
	"color-brand": "#00CC33",
	"color-brand-light": "#7AFF04",
	"color-brand-strong": "color-mix(in srgb, var(--color-brand) 85%, black)",
	background: "#FAFAFA",
	foreground: "#333333",
	card: "#FFFFFF",
	"card-foreground": "#333333",
	popover: "#FFFFFF",
	"popover-foreground": "#333333",
	primary: "#00CC33",
	"primary-foreground": "#FFFFFF",
	secondary: "#F5F5F5",
	"secondary-foreground": "#333333",
	muted: "#F5F5F5",
	"muted-foreground": "#8A8A8A",
	accent: "#F5F5F5",
	"accent-foreground": "#333333",
	destructive: "#dc2626",
	"destructive-foreground": "#FFFFFF",
	border: "#E0E0E0",
	input: "#E0E0E0",
	ring: "#00CC33",
	radius: "0.625rem",
	"ease-spring": "cubic-bezier(0.25, 1, 0.5, 1)",
	"ease-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
	"ease-button": "cubic-bezier(0.2, 0, 0, 1)",
	"font-copy-stack": '"Inter Variable", "Inter", system-ui, sans-serif',
	"font-ui-stack": '"Geist Variable", "Geist", system-ui, sans-serif',
	"font-display-stack":
		'"Geist Variable", "Inter Variable", system-ui, sans-serif',
};

const DARK_MAP: CssMap = {
	background: "#111111",
	foreground: "#E8E8E8",
	card: "#1A1A1A",
	"card-foreground": "#E8E8E8",
	popover: "#1A1A1A",
	"popover-foreground": "#E8E8E8",
	primary: "#00CC33",
	"primary-foreground": "#111111",
	secondary: "#222222",
	"secondary-foreground": "#E8E8E8",
	muted: "#222222",
	"muted-foreground": "#888888",
	accent: "#222222",
	"accent-foreground": "#E8E8E8",
	destructive: "#dc2626",
	"destructive-foreground": "#E8E8E8",
	border: "#2A2A2A",
	input: "#2A2A2A",
	ring: "#00CC33",
};

const THEME_CSS: Record<string, unknown> = {
	"@keyframes fade-up": {
		from: { opacity: "0", transform: "translateY(8px)" },
		to: { opacity: "1", transform: "translateY(0)" },
	},
	"@keyframes fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
	"@keyframes scale-in": {
		from: { opacity: "0", transform: "scale(0.95)" },
		to: { opacity: "1", transform: "scale(1)" },
	},
	".fade-up": { animation: "fade-up 0.35s var(--ease-spring, ease) both" },
	".fade-in": { animation: "fade-in 0.3s ease both" },
	".scale-in": { animation: "scale-in 0.3s var(--ease-spring, ease) both" },
	".brand-text": {
		background:
			"linear-gradient(135deg, var(--color-brand-light), var(--color-brand))",
		"-webkit-background-clip": "text",
		"background-clip": "text",
		"-webkit-text-fill-color": "transparent",
	},
	".brand-wordmark": {
		"font-family": "var(--font-display)",
		"font-weight": "700",
	},
	".type-display": {
		"font-family": "var(--font-display)",
		"font-weight": "700",
		"letter-spacing": "-0.035em",
	},
	".type-kicker": {
		"font-family": "var(--font-ui)",
		"font-size": "11px",
		"font-weight": "600",
		"text-transform": "uppercase",
		"letter-spacing": "0.14em",
	},
	".type-label": {
		"font-family": "var(--font-ui)",
		"font-size": "11px",
		"font-weight": "600",
		"text-transform": "uppercase",
		"letter-spacing": "0.08em",
	},
	".type-meta": {
		"font-family": "var(--font-ui)",
		"font-size": "10px",
		"font-weight": "500",
		"text-transform": "uppercase",
		"letter-spacing": "0.12em",
	},
	".type-overline": {
		"font-family": "var(--font-ui)",
		"font-size": "10px",
		"font-weight": "600",
		"text-transform": "uppercase",
		"letter-spacing": "0.12em",
	},
	".type-tabular": { "font-variant-numeric": "tabular-nums" },
	".section-heading": {
		"font-family": "var(--font-ui)",
		"font-size": "10px",
		"font-weight": "600",
		"text-transform": "uppercase",
		"letter-spacing": "0.12em",
		color: "var(--muted-foreground)",
	},
	".surface-card": { "box-shadow": "var(--shadow-card, 0 1px 4px rgba(0,0,0,0.06))" },
};

const THEME_ITEM: ItemDef = {
	name: "theme",
	type: "registry:style",
	title: "Installer UI theme",
	description:
		"The full Installer UI token sheet — brand + neutral CSS variables (light & dark), type utilities, and keyframes. Install once to theme every component; edit the values in your globals.css to make it yours.",
	cssVars: { theme: THEME_MAP, light: LIGHT_MAP, dark: DARK_MAP },
	css: THEME_CSS,
};

// ── Component items ────────────────────────────────────────────────────────

const withTheme = [THEME_URL] as const;

const COMPONENTS: readonly ItemDef[] = [
	// ── Brand & motion ──────────────────────────────────────────────
	{
		name: "installer-logomark",
		title: "Installer Logomark",
		description:
			"One-shot draw-on logomark with a gradient bloom, for arrival moments. Pure CSS, zero dependencies beyond React.",
		files: [installerFile("installer-logomark.tsx"), FILE_LOGO_PATH],
	},
	{
		name: "installer-loading",
		title: "Installer Loading",
		description:
			"Full-page indefinite wait state — a gradient comet endlessly traces the logomark while the fill breathes. Pure CSS, self-contained.",
		files: [installerFile("installer-loading.tsx"), FILE_LOGO_PATH],
	},
	{
		name: "copilot-mark",
		title: "Copilot Mark",
		description:
			"The logomark as a presence indicator — quiet in the text color when idle, a brand-gradient line tracing its own glyph while live.",
		dependencies: CN,
		registryDependencies: withTheme,
		files: [installerFile("copilot-mark.tsx"), FILE_LOGO_PATH, FILE_UTILS],
	},
	{
		name: "catenary-arcs",
		title: "Catenary Arcs",
		description:
			"Four nested catenary arches drawing themselves on, outermost first, the innermost in the brand gradient. Pure CSS.",
		dependencies: CN,
		registryDependencies: withTheme,
		files: [installerFile("catenary-arcs.tsx"), FILE_UTILS],
	},
	{
		name: "marquee",
		title: "Marquee",
		description:
			"A seamless, infinitely scrolling strip with edge fade and pause-on-hover. Self-contained scoped CSS, reduced-motion aware.",
		files: [installerFile("marquee.tsx")],
	},
	{
		name: "brand-button",
		title: "Brand Button",
		description:
			"A CTA with a crisp gradient border that lifts and glows on hover; renders as a button or an anchor. Self-contained, brand-token driven.",
		files: [installerFile("brand-button.tsx")],
	},
	{
		name: "animated-number",
		title: "Animated Number",
		description:
			"Tasteful numeric ease for figures that change — bring your own formatter; snaps under prefers-reduced-motion.",
		dependencies: ["motion"],
		files: [installerFile("animated-number.tsx")],
	},
	// ── Inputs & controls ───────────────────────────────────────────
	{
		name: "select",
		title: "Select",
		description:
			"A single-select built on Base UI: a keyboard-nav brand rail on the highlighted row, a persistent tint on the selected one, and a CSS spring open/close.",
		dependencies: [BASE_UI, PHOSPHOR, ...CN],
		registryDependencies: withTheme,
		files: [installerFile("select.tsx"), FILE_DROPDOWN_PRIMS, FILE_UTILS],
	},
	{
		name: "combobox",
		title: "Combobox",
		description:
			"A searchable select on Base UI — client or async filtering, clearable, with a searching spinner and skeleton rows. Shares the dropdown grammar.",
		dependencies: [BASE_UI, PHOSPHOR, ...CN],
		registryDependencies: withTheme,
		files: [installerFile("combobox.tsx"), FILE_DROPDOWN_PRIMS, FILE_UTILS],
	},
	{
		name: "dropdown-menu",
		title: "Dropdown Menu",
		description:
			"An actions menu on Base UI with items, icons, shortcuts, checkbox/radio items, submenus, and a destructive variant — one grammar with Select and Combobox.",
		dependencies: [BASE_UI, PHOSPHOR, ...CN],
		registryDependencies: withTheme,
		files: [installerFile("dropdown-menu.tsx"), FILE_DROPDOWN_PRIMS, FILE_UTILS],
	},
	{
		name: "calendar",
		title: "Calendar",
		description:
			"react-day-picker restyled as a real table with ghost month/year selects, brand focus rings, jump-to-today, and a selected-day brand shadow.",
		dependencies: ["react-day-picker", PHOSPHOR, ...CN],
		registryDependencies: withTheme,
		files: [installerFile("calendar.tsx"), FILE_UTILS],
	},
	{
		name: "date-picker",
		title: "Date Picker",
		description:
			"A Base UI popover wrapping the Calendar, with field / pill / inline variants, presets, and a clear affordance.",
		dependencies: [BASE_UI, PHOSPHOR, "motion", "react-day-picker", ...CN],
		registryDependencies: withTheme,
		files: [
			installerFile("date-picker.tsx"),
			installerFile("calendar.tsx"),
			FILE_UTILS,
		],
	},
	{
		name: "chips-input",
		title: "Chips Input",
		description:
			"A token / tag input with spring chip enter-exit, Enter/comma commit, Backspace-to-delete, and case-insensitive de-dupe.",
		dependencies: [PHOSPHOR, "motion", ...CN],
		registryDependencies: withTheme,
		files: [installerFile("chips-input.tsx"), FILE_UTILS],
	},
	{
		name: "segmented-control",
		title: "Segmented Control",
		description:
			"An ARIA radiogroup segmented control with a shared-layout sliding indicator, press feedback, and optional per-segment tooltips.",
		dependencies: ["motion", BASE_UI, ...CN],
		registryDependencies: withTheme,
		files: [
			installerFile("segmented-control.tsx"),
			FILE_TOOLTIP,
			FILE_UTILS,
		],
	},
	{
		name: "tabs",
		title: "Tabs",
		description:
			"Tabs with a layout-projected sliding underline and crossfade panel transitions, plus per-tab counts, busy dots, and loading skeletons.",
		dependencies: ["motion", ...CN],
		registryDependencies: withTheme,
		files: [installerFile("tabs.tsx"), FILE_UTILS],
	},
	// ── Feedback & data ─────────────────────────────────────────────
	{
		name: "toast",
		title: "Toast",
		description:
			"A theme-syncing sonner Toaster plus the toast() function, styled to the Installer surfaces (bottom-right, rich colors, close button).",
		dependencies: ["sonner"],
		registryDependencies: withTheme,
		files: [installerFile("toast.tsx")],
	},
	{
		name: "score-ring",
		title: "Score Ring",
		description:
			"A circular 0–100 indicator in four sizes that spring-fills on mount; state drives the stroke, and an unknown state renders a dashed ring.",
		dependencies: ["motion", ...CN],
		registryDependencies: withTheme,
		files: [installerFile("score-ring.tsx"), FILE_UTILS],
	},
	{
		name: "segment-meter",
		title: "Segment Meter",
		description:
			"A row of discrete cell meters (battery gauges) with a four-ink grammar — filled, weak alarm, active, and dashed/ghost — plus an assessing sweep.",
		dependencies: ["motion", BASE_UI, ...CN],
		registryDependencies: withTheme,
		files: [installerFile("segment-meter.tsx"), FILE_TOOLTIP, FILE_UTILS],
	},
	{
		name: "confidence-meter",
		title: "Confidence Meter",
		description:
			"Calibrated 0–1 confidence as a dense five-segment meter with a tone-coded label and tooltip — reads at a glance next to a chip.",
		dependencies: ["motion", BASE_UI, ...CN],
		registryDependencies: withTheme,
		files: [installerFile("confidence-meter.tsx"), FILE_TOOLTIP, FILE_UTILS],
	},
];

const ITEMS: readonly ItemDef[] = [THEME_ITEM, ...COMPONENTS];

// ── Build ─────────────────────────────────────────────────────────────────

/** Rewrite this repo's `#/` alias to the shadcn-conventional `@/`. */
function rewriteImports(source: string): string {
	return source.replaceAll('"#/', '"@/');
}

async function buildItem(item: ItemDef): Promise<void> {
	const files = item.files
		? await Promise.all(
				item.files.map(async (file) => {
					const source = await readFile(join(ROOT, file.path), "utf8");
					const content = rewriteImports(source);
					if (content.includes('"#/')) {
						throw new Error(`Unrewritten #/ import left in ${file.path}`);
					}
					return {
						path: file.path,
						content,
						type: file.type,
						target: file.target,
					};
				}),
			)
		: [];

	const payload = {
		$schema: ITEM_SCHEMA,
		name: item.name,
		type: item.type ?? "registry:component",
		title: item.title,
		description: item.description,
		...(item.dependencies ? { dependencies: [...item.dependencies] } : {}),
		...(item.registryDependencies
			? { registryDependencies: [...item.registryDependencies] }
			: {}),
		...(files.length ? { files } : {}),
		...(item.cssVars ? { cssVars: item.cssVars } : {}),
		...(item.css ? { css: item.css } : {}),
	};

	await writeFile(
		join(OUT_DIR, `${item.name}.json`),
		`${JSON.stringify(payload, null, "\t")}\n`,
	);
	console.log(`  wrote r/${item.name}.json (${files.length} file(s))`);
}

async function buildIndex(): Promise<void> {
	const payload = {
		$schema: INDEX_SCHEMA,
		name: REGISTRY_NAME,
		homepage: HOMEPAGE,
		items: ITEMS.map((item) => ({
			name: item.name,
			type: item.type ?? "registry:component",
			title: item.title,
			description: item.description,
		})),
	};
	await writeFile(
		join(OUT_DIR, "registry.json"),
		`${JSON.stringify(payload, null, "\t")}\n`,
	);
	console.log(`  wrote r/registry.json (${ITEMS.length} items)`);
}

async function main(): Promise<void> {
	await mkdir(OUT_DIR, { recursive: true });
	console.log("Building registry into public/r/");
	for (const item of ITEMS) {
		await buildItem(item);
	}
	await buildIndex();
	console.log("Done.");
}

await main();
