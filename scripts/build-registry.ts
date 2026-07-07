/**
 * Builds shadcn-compatible registry JSON into public/r/.
 *
 * Run with: bun scripts/build-registry.ts
 *
 * Each registry item inlines its source files from disk at build time
 * (never hand-copied), rewriting this repo's `#/` import alias to the
 * shadcn-conventional `@/` in the emitted content. Relative imports
 * (e.g. `./logo-path`) are left alone. Shared files (logo-path,
 * tooltip, cn) are duplicated into every item that needs them so each
 * item installs standalone.
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

// ── Types (subset of the shadcn registry-item schema) ────────────────────

type RegistryFileType = "registry:component" | "registry:ui" | "registry:lib";

interface FileDef {
	/** Repo-relative source path, read from disk at build time. */
	path: string;
	type: RegistryFileType;
	/** Where the file lands in a consumer project. */
	target: string;
}

type CssVarMap = Record<string, string>;

interface ItemDef {
	name: string;
	title: string;
	description: string;
	dependencies?: readonly string[];
	files: readonly FileDef[];
	cssVars?: {
		theme?: CssVarMap;
		light?: CssVarMap;
		dark?: CssVarMap;
	};
	css?: Record<string, Record<string, string>>;
}

// ── Shared file definitions ───────────────────────────────────────────────

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

function installerFile(basename: string): FileDef {
	return {
		path: `src/components/installer/${basename}`,
		type: "registry:component",
		target: `components/installer/${basename}`,
	};
}

// ── Shared dependency sets ────────────────────────────────────────────────

/** cn() pulls in clsx + tailwind-merge. */
const CN_DEPS = ["clsx", "tailwind-merge"] as const;

/** The tooltip is built on Base UI and uses cn(). */
const TOOLTIP_DEPS = ["@base-ui-components/react", ...CN_DEPS] as const;

// ── Shared CSS variables (values from src/styles.css) ─────────────────────

/** Brand gradient tokens, identical in light and dark. */
const BRAND_THEME_VARS: CssVarMap = {
	"color-brand": "#00CC33",
	"color-brand-light": "#7AFF04",
};

/** Neutral tokens the meters rely on (shadcn-standard names). */
const METER_LIGHT_VARS: CssVarMap = {
	border: "#E0E0E0",
	"muted-foreground": "#8A8A8A",
	destructive: "#dc2626",
};

const METER_DARK_VARS: CssVarMap = {
	border: "#2A2A2A",
	"muted-foreground": "#888888",
	destructive: "#dc2626",
};

// ── Type-* utilities used by component classNames (from src/styles.css) ──

const TYPE_META_UTILITY: Record<string, Record<string, string>> = {
	"@utility type-meta": {
		"font-family": "var(--font-ui, var(--font-sans, system-ui))",
		"font-size": "10px",
		"font-weight": "500",
		"text-transform": "uppercase",
		"letter-spacing": "0.12em",
	},
};

const TYPE_DISPLAY_UTILITY: Record<string, Record<string, string>> = {
	"@utility type-display": {
		"font-family": "var(--font-display, var(--font-sans, system-ui))",
		"font-weight": "700",
		"letter-spacing": "-0.035em",
	},
};

// ── Registry items ────────────────────────────────────────────────────────

const ITEMS: readonly ItemDef[] = [
	{
		name: "installer-logomark",
		title: "Installer Logomark",
		description:
			"Animated Installer logomark — a one-shot draw-on + gradient-bloom for arrival moments. Pure CSS, zero dependencies beyond React.",
		files: [installerFile("installer-logomark.tsx"), FILE_LOGO_PATH],
	},
	{
		name: "installer-loading",
		title: "Installer Loading",
		description:
			"Full-page indefinite wait state: a gradient comet endlessly traces the logomark while the fill breathes. Pure CSS, self-contained (no Tailwind required).",
		files: [installerFile("installer-loading.tsx"), FILE_LOGO_PATH],
	},
	{
		name: "hero-scene",
		title: "Hero Scene",
		description:
			'The "network behind the mark" landing hero: a monumental ghost logomark over an animated dispatch constellation, with staggered copy, chips, and a marquee ticker.',
		dependencies: ["@phosphor-icons/react", ...CN_DEPS],
		files: [installerFile("hero-scene.tsx"), FILE_LOGO_PATH, FILE_UTILS],
		cssVars: {
			theme: BRAND_THEME_VARS,
			light: METER_LIGHT_VARS,
			dark: METER_DARK_VARS,
		},
		css: TYPE_DISPLAY_UTILITY,
	},
	{
		name: "catenary-arcs",
		title: "Catenary Arcs",
		description:
			"Four nested catenary arches drawing themselves on, outermost first — hairline strokes with the brand gradient on the innermost arch. Pure CSS.",
		dependencies: CN_DEPS,
		files: [installerFile("catenary-arcs.tsx"), FILE_UTILS],
	},
	{
		name: "copilot-mark",
		title: "Copilot Mark",
		description:
			"The Installer logomark as a presence indicator: quiet in the text color when idle, a brand-gradient line perpetually tracing its own glyph while live.",
		dependencies: CN_DEPS,
		files: [installerFile("copilot-mark.tsx"), FILE_LOGO_PATH, FILE_UTILS],
	},
	{
		name: "spiced-band",
		title: "SPICED Band",
		description:
			"Five discrete cell meters, one per SPICED pillar, on a 0-3 scale — reads like a battery, with gate-capped ghosts, a red weak alarm, and an assessing sweep.",
		dependencies: ["motion", ...TOOLTIP_DEPS],
		files: [installerFile("spiced-band.tsx"), FILE_TOOLTIP, FILE_UTILS],
		cssVars: {
			theme: BRAND_THEME_VARS,
			light: METER_LIGHT_VARS,
			dark: METER_DARK_VARS,
		},
	},
	{
		name: "spiced-ring",
		title: "SPICED Ring",
		description:
			"Circular 0-100 score indicator in four sizes with spring-animated progress; state drives the stroke color and an unknown state renders a dashed ring.",
		dependencies: ["motion", ...CN_DEPS],
		files: [installerFile("spiced-ring.tsx"), FILE_UTILS],
		cssVars: {
			theme: BRAND_THEME_VARS,
			light: METER_LIGHT_VARS,
			dark: METER_DARK_VARS,
		},
	},
	{
		name: "confidence-meter",
		title: "Confidence Meter",
		description:
			"Calibrated 0-1 confidence as a dense 5-segment meter with tone-coded label and tooltip — fits in a row next to a chip without stealing the eye.",
		dependencies: ["motion", ...TOOLTIP_DEPS],
		files: [installerFile("confidence-meter.tsx"), FILE_TOOLTIP, FILE_UTILS],
		cssVars: {
			light: { ...METER_LIGHT_VARS, primary: "#00CC33" },
			dark: { ...METER_DARK_VARS, primary: "#00CC33" },
		},
		css: TYPE_META_UTILITY,
	},
	{
		name: "animated-number",
		title: "Animated Number",
		description:
			"Tasteful numeric ease for figures that change — rAF-driven easeOutQuad with an injected formatter; snaps under prefers-reduced-motion.",
		dependencies: ["motion"],
		files: [installerFile("animated-number.tsx")],
	},
	{
		name: "illustrations",
		title: "Illustrations",
		description:
			"Six animated SVG scene illustrations (Archer, Ascent, Catalyst, Funnel, Hourglass, Topography) with bloom filters and brand-token accents, plus a barrel export.",
		dependencies: ["motion"],
		files: [
			installerFile("illustrations/index.ts"),
			installerFile("illustrations/ArcherIllustration.tsx"),
			installerFile("illustrations/AscentIllustration.tsx"),
			installerFile("illustrations/CatalystIllustration.tsx"),
			installerFile("illustrations/FunnelIllustration.tsx"),
			installerFile("illustrations/HourglassIllustration.tsx"),
			installerFile("illustrations/TopographyIllustration.tsx"),
		],
		cssVars: {
			theme: BRAND_THEME_VARS,
			light: { background: "#FAFAFA" },
			dark: { background: "#111111" },
		},
	},
];

// ── Build ─────────────────────────────────────────────────────────────────

/** Rewrite this repo's `#/` alias to the shadcn-conventional `@/`. */
function rewriteImports(source: string): string {
	return source.replaceAll('"#/', '"@/');
}

async function buildItem(item: ItemDef): Promise<void> {
	const files = await Promise.all(
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
	);

	const payload = {
		$schema: ITEM_SCHEMA,
		name: item.name,
		type: "registry:component",
		title: item.title,
		description: item.description,
		...(item.dependencies ? { dependencies: [...item.dependencies] } : {}),
		files,
		...(item.cssVars ? { cssVars: item.cssVars } : {}),
		...(item.css ? { css: item.css } : {}),
	};

	const outPath = join(OUT_DIR, `${item.name}.json`);
	await writeFile(outPath, `${JSON.stringify(payload, null, "\t")}\n`);
	console.log(`  wrote r/${item.name}.json (${files.length} file(s))`);
}

async function buildIndex(): Promise<void> {
	const payload = {
		$schema: INDEX_SCHEMA,
		name: REGISTRY_NAME,
		homepage: HOMEPAGE,
		items: ITEMS.map((item) => ({
			name: item.name,
			type: "registry:component",
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
	console.log(`Building registry into public/r/`);
	for (const item of ITEMS) {
		await buildItem(item);
	}
	await buildIndex();
	console.log("Done.");
}

await main();
