import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useId } from "react";

import { AnimatedNumber } from "#/components/installer/animated-number";
import { CatenaryArcs } from "#/components/installer/catenary-arcs";
import { ConfidenceMeter } from "#/components/installer/confidence-meter";
import { CopilotMark } from "#/components/installer/copilot-mark";
import { TopographyIllustration } from "#/components/installer/illustrations";
import { InstallerLogomark } from "#/components/installer/installer-logomark";
import {
	INSTALLER_GRADIENT_FROM,
	INSTALLER_GRADIENT_TO,
	INSTALLER_LOGO_PATH,
	INSTALLER_LOGO_TRANSFORM,
} from "#/components/installer/logo-path";
import {
	type BandPillar,
	SpicedBand,
} from "#/components/installer/spiced-band";
import { SpicedRing } from "#/components/installer/spiced-ring";

// ── Card previews ─────────────────────────────────────────────────────────

function LogomarkPreview() {
	return <InstallerLogomark play={false} className="h-11 w-11" />;
}

/** Frozen frame of the loading loop: ghost outline + gradient comet. */
function LoadingPreview() {
	const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
	return (
		<svg
			viewBox="0 0 900 900"
			className="h-11 w-11 text-foreground"
			aria-hidden="true"
		>
			<defs>
				<linearGradient
					id={`loading-preview-${uid}`}
					x1="0"
					y1="0"
					x2="0"
					y2="1"
				>
					<stop offset="0" stopColor={INSTALLER_GRADIENT_FROM} />
					<stop offset="1" stopColor={INSTALLER_GRADIENT_TO} />
				</linearGradient>
			</defs>
			<g transform={INSTALLER_LOGO_TRANSFORM}>
				<path
					d={INSTALLER_LOGO_PATH}
					pathLength={1}
					fill="none"
					stroke="currentColor"
					strokeWidth={10}
					opacity={0.22}
				/>
				<path
					d={INSTALLER_LOGO_PATH}
					pathLength={1}
					fill="none"
					stroke={`url(#loading-preview-${uid})`}
					strokeWidth={26}
					strokeLinecap="round"
					strokeDasharray="0.14 0.86"
					strokeDashoffset={-0.3}
				/>
			</g>
		</svg>
	);
}

/** The hero in miniature: ghost mark, one dispatch route, the network. */
function HeroScenePreview() {
	const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
	return (
		<svg
			viewBox="0 0 160 80"
			className="h-20 w-full max-w-[220px] text-muted-foreground"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={`hero-preview-${uid}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={INSTALLER_GRADIENT_FROM} />
					<stop offset="1" stopColor={INSTALLER_GRADIENT_TO} />
				</linearGradient>
			</defs>
			<g transform="translate(46 5) scale(0.078)">
				<g transform={INSTALLER_LOGO_TRANSFORM}>
					<path
						d={INSTALLER_LOGO_PATH}
						fill="none"
						stroke="currentColor"
						strokeWidth={1.2}
						vectorEffect="non-scaling-stroke"
						opacity={0.5}
					/>
				</g>
			</g>
			<rect
				x="14"
				y="17"
				width="5"
				height="5"
				fill="none"
				stroke="currentColor"
				opacity="0.7"
			/>
			<rect
				x="26"
				y="60"
				width="5"
				height="5"
				fill="none"
				stroke="currentColor"
				opacity="0.5"
			/>
			<circle cx="134" cy="21" r="2.4" fill="currentColor" opacity="0.85" />
			<circle cx="120" cy="63" r="2.4" fill="currentColor" opacity="0.55" />
			<path
				d="M 19 19 Q 76 4, 131 20"
				fill="none"
				stroke={`url(#hero-preview-${uid})`}
				strokeWidth="1"
			/>
			<circle
				cx="134"
				cy="21"
				r="5"
				fill="none"
				stroke="#00CC33"
				strokeWidth="0.75"
				opacity="0.5"
			/>
		</svg>
	);
}

function CatenaryPreview() {
	return <CatenaryArcs className="h-14 w-36 text-foreground" />;
}

function CopilotPreview() {
	return (
		<div className="flex items-center gap-6">
			<CopilotMark className="size-6 text-muted-foreground" />
			<CopilotMark live className="size-6" />
		</div>
	);
}

const PREVIEW_PILLARS = [
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

function SpicedBandPreview() {
	return (
		<div inert className="w-40">
			<SpicedBand pillars={PREVIEW_PILLARS} />
		</div>
	);
}

function SpicedRingPreview() {
	return (
		<div className="flex items-center gap-4">
			<SpicedRing score={24} state="weak" size="sm" />
			<SpicedRing score={61} state="developing" size="md" />
			<SpicedRing score={88} state="strong" size="lg" />
		</div>
	);
}

function ConfidenceMeterPreview() {
	return (
		<div inert className="flex flex-col items-start gap-2.5">
			<ConfidenceMeter value={0.45} />
			<ConfidenceMeter value={0.93} />
		</div>
	);
}

const previewCurrency = (value: number) =>
	value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

function AnimatedNumberPreview() {
	return (
		<AnimatedNumber
			value={48200}
			format={previewCurrency}
			className="type-display type-tabular text-3xl text-foreground"
		/>
	);
}

function IllustrationsPreview() {
	return (
		<motion.div initial="idle" animate="idle" className="text-foreground">
			<TopographyIllustration className="h-20 w-20" />
		</motion.div>
	);
}

// ── Registry ──────────────────────────────────────────────────────────────

export const REGISTRY = [
	{
		slug: "installer-logomark",
		name: "InstallerLogomark",
		href: "/components/installer-logomark",
		description:
			"One-shot draw-on logomark with a gradient bloom, for arrival moments.",
		preview: LogomarkPreview,
	},
	{
		slug: "installer-loading",
		name: "InstallerLoading",
		href: "/components/installer-loading",
		description:
			"Looping loading scene — a gradient comet endlessly traces the glyph.",
		preview: LoadingPreview,
	},
	{
		slug: "hero-scene",
		name: "HeroScene",
		href: "/components/hero-scene",
		description:
			"Full-viewport marketing hero: ghost mark, dispatch network, live ticker.",
		preview: HeroScenePreview,
	},
	{
		slug: "catenary-arcs",
		name: "CatenaryArcs",
		href: "/components/catenary-arcs",
		description:
			"Four nested catenary arches, hairline-drawn, innermost in the gradient.",
		preview: CatenaryPreview,
	},
	{
		slug: "copilot-mark",
		name: "CopilotMark",
		href: "/components/copilot-mark",
		description:
			"The logomark as a status indicator — quiet at rest, tracing while live.",
		preview: CopilotPreview,
	},
	{
		slug: "spiced-band",
		name: "SpicedBand",
		href: "/components/spiced-band",
		description:
			"Five discrete cell meters, one per SPICED pillar, with gate semantics.",
		preview: SpicedBandPreview,
	},
	{
		slug: "spiced-ring",
		name: "SpicedRing",
		href: "/components/spiced-ring",
		description:
			"Circular 0–100 score in four sizes, colored by qualification state.",
		preview: SpicedRingPreview,
	},
	{
		slug: "confidence-meter",
		name: "ConfidenceMeter",
		href: "/components/confidence-meter",
		description: "Calibrated 0–1 confidence as a dense five-segment meter.",
		preview: ConfidenceMeterPreview,
	},
	{
		slug: "animated-number",
		name: "AnimatedNumber",
		href: "/components/animated-number",
		description:
			"Tasteful numeric ease for figures that change — bring your own formatter.",
		preview: AnimatedNumberPreview,
	},
	{
		slug: "illustrations",
		name: "Illustrations",
		href: "/components/illustrations",
		description:
			"Six hover-animated SVG scenes for empty states and feature cards.",
		preview: IllustrationsPreview,
	},
] as const;

export type RegistryEntry = (typeof REGISTRY)[number];
export type RegistrySlug = RegistryEntry["slug"];

// ── Grid ──────────────────────────────────────────────────────────────────

export function ComponentsGrid() {
	return (
		<div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
			{REGISTRY.map((entry) => {
				const Preview = entry.preview;
				return (
					<Link
						key={entry.slug}
						to="/components/$slug"
						params={{ slug: entry.slug }}
						className="group relative flex flex-col bg-background p-6 transition-colors hover:bg-card"
					>
						<div
							inert
							className="flex h-28 items-center justify-center overflow-hidden text-foreground"
						>
							<Preview />
						</div>
						<div className="mt-5 flex items-center justify-between gap-3">
							<h3 className="font-mono text-[13px] font-semibold text-foreground">
								{entry.name}
							</h3>
							<ArrowRight
								className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
								aria-hidden="true"
							/>
						</div>
						<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
							{entry.description}
						</p>
					</Link>
				);
			})}
		</div>
	);
}
