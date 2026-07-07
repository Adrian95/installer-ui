import { motion } from "motion/react";
import { type ReactNode, useState } from "react";

import { AnimatedNumber } from "#/components/installer/animated-number";
// Raw component sources, embedded at build time for the "Source" panel.
import animatedNumberSource from "#/components/installer/animated-number.tsx?raw";
import { CatenaryArcs } from "#/components/installer/catenary-arcs";
import catenaryArcsSource from "#/components/installer/catenary-arcs.tsx?raw";
import { ConfidenceMeter } from "#/components/installer/confidence-meter";
import confidenceMeterSource from "#/components/installer/confidence-meter.tsx?raw";
import { CopilotMark } from "#/components/installer/copilot-mark";
import copilotMarkSource from "#/components/installer/copilot-mark.tsx?raw";
import { HeroScene } from "#/components/installer/hero-scene";
import heroSceneSource from "#/components/installer/hero-scene.tsx?raw";
import {
	ArcherIllustration,
	AscentIllustration,
	CatalystIllustration,
	FunnelIllustration,
	HourglassIllustration,
	TopographyIllustration,
} from "#/components/installer/illustrations";
import topographySource from "#/components/installer/illustrations/TopographyIllustration.tsx?raw";
import { InstallerLoading } from "#/components/installer/installer-loading";
import installerLoadingSource from "#/components/installer/installer-loading.tsx?raw";
import { InstallerLogomark } from "#/components/installer/installer-logomark";
import installerLogomarkSource from "#/components/installer/installer-logomark.tsx?raw";
import {
	type BandPillar,
	SpicedBand,
	type SpicedDimension,
} from "#/components/installer/spiced-band";
import spicedBandSource from "#/components/installer/spiced-band.tsx?raw";
import {
	SpicedRing,
	type SpicedRingState,
} from "#/components/installer/spiced-ring";
import spicedRingSource from "#/components/installer/spiced-ring.tsx?raw";
import {
	DemoButton,
	DemoSurface,
	Note,
	type PropRow,
	Replayer,
	Section,
} from "#/components/showcase/component-page";
import type { RegistrySlug } from "#/components/showcase/registry";

export interface DemoEntry {
	title: string;
	lede: string;
	sourceFile: string;
	source: string;
	propRows: readonly PropRow[];
	demo: ReactNode;
}

// ── Shared demo data ────────────────────────────────────────────────────────

const BAND_PILLARS = [
	{
		dimension: "situation",
		label: "Situation",
		score: 3,
		displayedScore: 3,
		gateBlocked: false,
	},
	{
		dimension: "pain",
		label: "Pain",
		score: 2,
		displayedScore: 2,
		gateBlocked: false,
	},
	{
		dimension: "impact",
		label: "Impact",
		score: 1,
		displayedScore: 1,
		gateBlocked: false,
	},
	{
		dimension: "critical_event",
		label: "Critical event",
		score: 3,
		displayedScore: 1,
		gateBlocked: true,
	},
	{
		dimension: "decision",
		label: "Decision",
		score: undefined,
		displayedScore: undefined,
		gateBlocked: false,
	},
] satisfies readonly BandPillar[];

const usd = (value: number) =>
	value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

// ── Interactive demo widgets ────────────────────────────────────────────────

function SpicedBandDemo() {
	const [active, setActive] = useState<SpicedDimension | null>("pain");
	const [assessing, setAssessing] = useState(false);
	return (
		<div className="flex w-full flex-col items-center gap-8">
			<div className="w-64">
				<SpicedBand
					pillars={BAND_PILLARS}
					activeDimension={active}
					assessing={assessing}
					onPillarClick={(dim) =>
						setActive((cur) => (cur === dim ? null : dim))
					}
				/>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-2">
				<DemoButton onClick={() => setActive(null)}>Clear active</DemoButton>
				<DemoButton onClick={() => setAssessing((a) => !a)}>
					{assessing ? "Stop assessing" : "Run assessment sweep"}
				</DemoButton>
			</div>
			<p className="text-xs text-muted-foreground">
				Click a pillar to focus it. Critical event is gate-withheld (dashed
				ghost); Decision is unscored.
			</p>
		</div>
	);
}

function AnimatedNumberDemo() {
	const [value, setValue] = useState(48200);
	return (
		<div className="flex flex-col items-center gap-6">
			<AnimatedNumber
				value={value}
				format={usd}
				className="type-display type-tabular text-5xl text-foreground"
			/>
			<DemoButton
				onClick={() =>
					setValue(12000 + (Math.round(value * 0.618 + 31337) % 90000))
				}
			>
				Change the number
			</DemoButton>
		</div>
	);
}

const RING_STATES: { score: number; state: SpicedRingState; note: string }[] = [
	{ score: 0, state: "unknown", note: "unknown" },
	{ score: 22, state: "weak", note: "weak" },
	{ score: 58, state: "developing", note: "developing" },
	{ score: 87, state: "strong", note: "strong" },
];

function ConfidenceMeterDemo() {
	const [value, setValue] = useState(0.62);
	return (
		<div className="flex flex-col items-center gap-6">
			<ConfidenceMeter value={value} />
			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				value={value}
				aria-label="Confidence value"
				onChange={(e) => setValue(Number(e.target.value))}
				className="w-56 accent-[var(--color-brand)]"
			/>
		</div>
	);
}

const ILLUSTRATIONS = [
	{ name: "Topography", C: TopographyIllustration },
	{ name: "Archer", C: ArcherIllustration },
	{ name: "Ascent", C: AscentIllustration },
	{ name: "Catalyst", C: CatalystIllustration },
	{ name: "Funnel", C: FunnelIllustration },
	{ name: "Hourglass", C: HourglassIllustration },
] as const;

function IllustrationsDemo() {
	return (
		<div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
			{ILLUSTRATIONS.map(({ name, C }) => (
				<motion.div
					key={name}
					initial="idle"
					animate="idle"
					whileHover="hover"
					className="flex cursor-pointer flex-col items-center gap-3 bg-card p-6 text-foreground transition-colors hover:bg-accent"
				>
					<C className="size-24" />
					<span className="font-mono text-[11px] text-muted-foreground">
						{name}
					</span>
				</motion.div>
			))}
		</div>
	);
}

// ── Registry of demos, keyed by slug ────────────────────────────────────────

export const DEMOS: Record<RegistrySlug, DemoEntry> = {
	"installer-logomark": {
		title: "Installer Logomark",
		lede: "The Installer glyph that draws itself on, then blooms into the brand gradient. A one-shot arrival moment for app boots, gated intros, and hero sections.",
		sourceFile: "components/installer/installer-logomark.tsx",
		source: installerLogomarkSource,
		propRows: [
			{
				name: "className",
				type: "string",
				description: "Sizing / color classes for the <svg>.",
			},
			{
				name: "play",
				type: "boolean",
				defaultValue: "true",
				description: "false renders the final filled state with no animation.",
			},
			{
				name: "drawDurationMs",
				type: "number",
				defaultValue: "1100",
				description: "Length of the stroke draw-on.",
			},
			{
				name: "title",
				type: "string",
				description: "Accessible name; when omitted the mark is aria-hidden.",
			},
		],
		demo: (
			<>
				<Section title="Draw-on">
					<DemoSurface label="Press replay to watch the draw-on + gradient bloom.">
						<Replayer
							render={() => (
								<InstallerLogomark
									title="Installer"
									className="h-28 w-28 text-foreground"
								/>
							)}
						/>
					</DemoSurface>
				</Section>
				<Section title="Static">
					<DemoSurface label="play={false} — the resting mark, no animation.">
						<InstallerLogomark play={false} className="h-20 w-20" />
					</DemoSurface>
				</Section>
			</>
		),
	},
	"installer-loading": {
		title: "Installer Loading",
		lede: "An indefinite wait state built from the logomark — a gradient comet endlessly traces the glyph while the fill breathes on the same clock. Pure CSS, zero dependencies.",
		sourceFile: "components/installer/installer-loading.tsx",
		source: installerLoadingSource,
		propRows: [
			{
				name: "kicker",
				type: "string",
				defaultValue: '"Loading"',
				description: "Short uppercase label under the mark.",
			},
			{
				name: "message",
				type: "string",
				description: "Optional supporting sentence.",
			},
			{
				name: "className",
				type: "string",
				description: "Extra classes on the root.",
			},
		],
		demo: (
			<Section title="Preview" hint="fills its container">
				<DemoSurface
					className="min-h-80 p-0"
					label={
						<>
							Drop it into any full-height container.{" "}
							<a
								href="/demo/loading"
								className="font-medium text-foreground underline decoration-border underline-offset-2 hover:text-[var(--color-brand)]"
							>
								Open full screen ↗
							</a>
						</>
					}
				>
					<div className="h-80 w-full">
						<InstallerLoading
							kicker="Loading workspace"
							message="Syncing your organization and session."
						/>
					</div>
				</DemoSurface>
			</Section>
		),
	},
	"hero-scene": {
		title: "Hero Scene",
		lede: "The full-bleed marketing hero: a ghost logomark tracing itself, a constellation of senders and installers wired by gradient dispatch routes, an orbiting deal-dot, and a live ticker. Everything is a prop.",
		sourceFile: "components/installer/hero-scene.tsx",
		source: heroSceneSource,
		propRows: [
			{
				name: "kicker",
				type: "ReactNode",
				description: "Kicker line above the headline.",
			},
			{
				name: "headlinePre / headlineAccent / headlinePost",
				type: "string",
				description: "Headline split around one gradient-sheen word.",
			},
			{ name: "subhead", type: "string", description: "Supporting paragraph." },
			{
				name: "footnote",
				type: "string",
				description: "Small print under the CTA.",
			},
			{
				name: "primaryCta",
				type: "{ label, href }",
				description: "Optional CTA, rendered as an anchor.",
			},
			{
				name: "chips",
				type: "HeroSceneChip[]",
				description: "Up to four floating chips around the mark.",
			},
			{
				name: "tickerItems",
				type: "string[]",
				description: "Bottom marquee items.",
			},
			{
				name: "className",
				type: "string",
				description: "Extra classes on the root <main>.",
			},
		],
		demo: (
			<Section title="Preview" hint="scaled into a frame">
				<div className="relative h-[560px] overflow-hidden rounded-lg border border-border">
					<HeroScene
						kicker="installer.com · ui"
						headlinePre="One "
						headlineAccent="scene"
						headlinePost=", every prop."
						primaryCta={{ label: "Get the component", href: "#" }}
					/>
				</div>
				<Note>
					Renders as a full-height <code>&lt;main&gt;</code>. Give it a sized
					parent (or a route of its own) for the intended full-bleed effect.
				</Note>
			</Section>
		),
	},
	"catenary-arcs": {
		title: "Catenary Arcs",
		lede: "Four nested catenary arches — the curve a chain makes hanging under its own weight — drawn outermost-first, the innermost carrying the brand gradient. A quiet ornament for empty states.",
		sourceFile: "components/installer/catenary-arcs.tsx",
		source: catenaryArcsSource,
		propRows: [
			{
				name: "className",
				type: "string",
				description: "Sizing / color classes.",
			},
			{
				name: "drawDurationMs",
				type: "number",
				defaultValue: "1200",
				description: "Length of the draw-on.",
			},
		],
		demo: (
			<Section title="Draw-on">
				<DemoSurface label="Outermost arch first; the innermost lands in the gradient.">
					<Replayer
						render={() => (
							<CatenaryArcs className="h-24 w-64 text-foreground" />
						)}
					/>
				</DemoSurface>
			</Section>
		),
	},
	"copilot-mark": {
		title: "Copilot Mark",
		lede: "The logomark as a status indicator: flat and quiet at rest, tracing its own outline in the brand gradient while live. Sits inline next to copy at any size.",
		sourceFile: "components/installer/copilot-mark.tsx",
		source: copilotMarkSource,
		propRows: [
			{
				name: "live",
				type: "boolean",
				defaultValue: "false",
				description: "true animates the gradient trace.",
			},
			{
				name: "className",
				type: "string",
				description: "Sizing / color classes.",
			},
		],
		demo: (
			<Section title="Idle vs. live">
				<DemoSurface>
					<div className="flex items-center gap-12">
						<div className="flex flex-col items-center gap-3">
							<CopilotMark className="size-9 text-muted-foreground" />
							<span className="type-meta text-muted-foreground">Idle</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<CopilotMark live className="size-9" />
							<span className="type-meta text-muted-foreground">Live</span>
						</div>
					</div>
				</DemoSurface>
			</Section>
		),
	},
	"spiced-band": {
		title: "SPICED Band",
		lede: "Five discrete three-cell meters, one per SPICED pillar, animating up from a baseline. A four-ink grammar carries the whole state: filled, weak-pillar alarm, active bay, and dashed/gate-withheld.",
		sourceFile: "components/installer/spiced-band.tsx",
		source: spicedBandSource,
		propRows: [
			{
				name: "pillars",
				type: "BandPillar[]",
				description: "Five pillars with score, displayedScore, gateBlocked.",
			},
			{
				name: "activeDimension",
				type: "SpicedDimension | null",
				description: "Highlights one pillar's bay.",
			},
			{
				name: "onPillarClick",
				type: "(dim) => void",
				description: "Makes pillars interactive.",
			},
			{
				name: "assessing",
				type: "boolean",
				defaultValue: "false",
				description: "Sweeps a brand sheen while a pass runs.",
			},
			{
				name: "className",
				type: "string",
				description: "Extra classes on the root.",
			},
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<SpicedBandDemo />
				</DemoSurface>
			</Section>
		),
	},
	"spiced-ring": {
		title: "SPICED Ring",
		lede: "A circular 0–100 score dial in four sizes, spring-animating its fill and colored by qualification state. Suppresses the number entirely when the score is unknown.",
		sourceFile: "components/installer/spiced-ring.tsx",
		source: spicedRingSource,
		propRows: [
			{ name: "score", type: "number", description: "0–100 value." },
			{
				name: "state",
				type: '"unknown" | "weak" | "developing" | "strong"',
				description: "Drives the stroke color and label.",
			},
			{
				name: "size",
				type: '"xs" | "sm" | "md" | "lg"',
				defaultValue: '"sm"',
				description: "One of four fixed sizes.",
			},
			{
				name: "showLabel",
				type: "boolean",
				defaultValue: "true",
				description: "Renders the number in the center.",
			},
			{
				name: "label",
				type: "string",
				description: "Overrides the aria-label.",
			},
		],
		demo: (
			<>
				<Section title="By state">
					<DemoSurface>
						<div className="flex items-end gap-10">
							{RING_STATES.map((r) => (
								<div key={r.note} className="flex flex-col items-center gap-3">
									<SpicedRing score={r.score} state={r.state} size="lg" />
									<span className="type-meta text-muted-foreground">
										{r.note}
									</span>
								</div>
							))}
						</div>
					</DemoSurface>
				</Section>
				<Section title="By size">
					<DemoSurface>
						<div className="flex items-end gap-8">
							<SpicedRing score={72} state="developing" size="xs" />
							<SpicedRing score={72} state="developing" size="sm" />
							<SpicedRing score={72} state="developing" size="md" />
							<SpicedRing score={72} state="developing" size="lg" />
						</div>
					</DemoSurface>
				</Section>
			</>
		),
	},
	"confidence-meter": {
		title: "Confidence Meter",
		lede: "A calibrated 0–1 confidence read as five segments, bucketed from Very low to Very high, with amber warning tones at the bottom of the range. Handles the null / not-yet-scored state.",
		sourceFile: "components/installer/confidence-meter.tsx",
		source: confidenceMeterSource,
		propRows: [
			{
				name: "value",
				type: "number | null | undefined",
				description: "0–1 confidence, or null for the empty state.",
			},
			{
				name: "compact",
				type: "boolean",
				defaultValue: "false",
				description: "Hides the numeric label; meter only.",
			},
			{ name: "className", type: "string", description: "Extra classes." },
		],
		demo: (
			<>
				<Section title="Interactive">
					<DemoSurface>
						<ConfidenceMeterDemo />
					</DemoSurface>
				</Section>
				<Section title="States">
					<DemoSurface>
						<div className="flex flex-col items-start gap-3">
							<ConfidenceMeter value={0.18} />
							<ConfidenceMeter value={0.66} />
							<ConfidenceMeter value={0.95} />
							<ConfidenceMeter value={null} />
						</div>
					</DemoSurface>
				</Section>
			</>
		),
	},
	"animated-number": {
		title: "Animated Number",
		lede: "A tasteful numeric ease for figures that change — currency, scores, coverage. Bring your own formatter; it snaps instead of easing under reduced-motion.",
		sourceFile: "components/installer/animated-number.tsx",
		source: animatedNumberSource,
		propRows: [
			{
				name: "value",
				type: "number",
				description: "Target value to interpolate toward.",
			},
			{
				name: "format",
				type: "(n: number) => string",
				description: "Pure formatter — must be referentially stable.",
			},
			{ name: "className", type: "string", description: "Typography classes." },
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<AnimatedNumberDemo />
				</DemoSurface>
			</Section>
		),
	},
	illustrations: {
		title: "Illustrations",
		lede: "Six hover-animated SVG scenes for empty states and feature cards — glass ledgers, aligning rings, radar sweeps. Each animates via motion variant propagation from its hovered parent.",
		sourceFile: "components/installer/illustrations/",
		source: topographySource,
		propRows: [
			{
				name: "className",
				type: "string",
				description:
					"Sizing / color classes on the <svg>. Every illustration shares this single prop.",
			},
		],
		demo: (
			<>
				<Section title="Hover any card" hint="6 scenes">
					<IllustrationsDemo />
				</Section>
				<Note>
					Each illustration animates through motion variants named{" "}
					<code>idle</code> / <code>hover</code>. Wrap it in a parent{" "}
					<code>
						&lt;motion.div initial="idle" animate="idle" whileHover="hover"&gt;
					</code>{" "}
					to drive the scene. The source below is{" "}
					<code>TopographyIllustration</code>; the other five follow the same
					shape.
				</Note>
			</>
		),
	},
};
