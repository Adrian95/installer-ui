import { ArrowRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "#/lib/utils";
import {
	INSTALLER_GRADIENT_FROM,
	INSTALLER_GRADIENT_TO,
	INSTALLER_LOGO_PATH,
	INSTALLER_LOGO_TRANSFORM,
	INSTALLER_LOGO_VIEWBOX,
} from "./logo-path";

// ──────────────────────────────────────────────────────────────
//  HeroScene — the "network behind the mark" landing scene.
//
//  installer.com connects the people who sell a job to the people
//  who do it. The scene says that without saying it: a monumental
//  ghost of the logomark spans the hero — its two interlocked hooks
//  reaching into either side of a constellation. Hollow squares
//  send work, filled dots do it, and every so often a gradient
//  route draws from a square to a dot and lands as a green ping:
//  a job finding its installer. The vivid mark up front is the
//  product at the center of its own network.
//
//  Fully standalone: all copy is prop-overridable with baked-in
//  defaults, the CTA is an optional plain <a>, and every animation
//  is scoped CSS that goes static under prefers-reduced-motion.
// ──────────────────────────────────────────────────────────────

export type HeroSceneChip = { label: string; meta: string };

export type HeroSceneProps = {
	/** Kicker line above the headline (mono, tracked-out). */
	kicker?: ReactNode;
	headlinePre?: string;
	/** The one gradient-sheen word in the headline. */
	headlineAccent?: string;
	headlinePost?: string;
	subhead?: string;
	footnote?: string;
	/** Optional primary CTA, rendered as a plain anchor. */
	primaryCta?: { label: string; href: string };
	/** Insider chips floating around the logomark scene (4 spots). */
	chips?: readonly HeroSceneChip[];
	/** Bottom marquee ticker items. */
	tickerItems?: readonly string[];
	className?: string;
};

const DEFAULT_HEADLINE_PRE = "The ";
const DEFAULT_HEADLINE_ACCENT = "pipeline";
const DEFAULT_HEADLINE_POST = " lives here.";

const DEFAULT_SUBHEAD =
	"Patches, plays, quotes, and the Monday numbers. Same deals, same timeline, no spreadsheets.";

const DEFAULT_FOOTNOTE =
	"If none of that meant anything to you, this isn't the page you're looking for.";

const DEFAULT_KICKER = (
	<>
		installer.com <span className="text-[var(--color-brand)]">·</span> internal
	</>
);

const DEFAULT_CHIPS: readonly HeroSceneChip[] = [
	{ label: "/today", meta: "triaged" },
	{ label: "patches", meta: "mapped" },
	{ label: "plays", meta: "running" },
	{ label: "quote v3", meta: "opened" },
];

const DEFAULT_TICKER: readonly string[] = [
	"SPICED gates enforced",
	"stage history immutable",
	"Monday numbers ready",
	"patches mapped",
	"plays running",
	"quotes versioned",
	"agents on a leash",
	"no spreadsheets were harmed",
];

export function HeroScene({
	kicker = DEFAULT_KICKER,
	headlinePre = DEFAULT_HEADLINE_PRE,
	headlineAccent = DEFAULT_HEADLINE_ACCENT,
	headlinePost = DEFAULT_HEADLINE_POST,
	subhead = DEFAULT_SUBHEAD,
	footnote = DEFAULT_FOOTNOTE,
	primaryCta,
	chips = DEFAULT_CHIPS,
	tickerItems = DEFAULT_TICKER,
	className,
}: HeroSceneProps) {
	return (
		<main
			className={cn(
				"relative isolate flex h-full flex-col overflow-hidden bg-[linear-gradient(to_bottom,#F3F3F3,#FFFFFF)] dark:bg-none",
				className,
			)}
		>
			<style>{HERO_SCENE_CSS}</style>
			<SceneBackdrop />

			<div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 items-center gap-4 px-6 sm:gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
				{/* ── Copy ─────────────────────────────────────────────── */}
				<div className="relative z-10 flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
					<span className="hero-scene-enter-kicker font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
						{kicker}
					</span>

					<h1 className="type-display hero-scene-enter-headline max-w-[14ch] text-balance text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] text-foreground">
						{headlinePre}
						<span className="hero-scene-accent bg-clip-text text-transparent">
							{headlineAccent}
						</span>
						{headlinePost}
					</h1>

					<p className="hero-scene-enter-subhead max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
						{subhead}
					</p>

					{primaryCta ? (
						<div className="hero-scene-enter-cta">
							<a href={primaryCta.href} className="hero-scene-brand-btn group">
								{primaryCta.label}
								<ArrowRight
									className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
									weight="bold"
								/>
							</a>
						</div>
					) : null}

					<p className="hero-scene-enter-footnote text-xs text-muted-foreground/60">
						{footnote}
					</p>
				</div>

				{/* ── Logomark scene ───────────────────────────────────── */}
				<LogoScene chips={chips} />
			</div>

			<Ticker items={tickerItems} />
		</main>
	);
}

// ── Backdrop: the network behind the mark ────────────────────────────────

// Raw glyph center ≈ (406, 504); place it at (720, 410) so the ghost bleeds
// past the top and bottom edges of the 1440×820 stage.
const GHOST_SCALE = 1.35;
const GHOST_TRANSFORM = `translate(${720 - 406 * GHOST_SCALE} ${410 - 504 * GHOST_SCALE}) scale(${GHOST_SCALE})`;

/** Hollow squares — the shops and brands that send jobs into the network. */
const NETWORK_SENDERS = [
	{ x: 140, y: 150 },
	{ x: 95, y: 540 },
	{ x: 420, y: 105 },
	{ x: 300, y: 700 },
	{ x: 660, y: 180 },
	{ x: 1210, y: 110 },
] as const;

/** Filled dots — the installers who pick the jobs up. */
const NETWORK_INSTALLERS = [
	{ x: 240, y: 255 },
	{ x: 520, y: 610 },
	{ x: 760, y: 700 },
	{ x: 860, y: 120 },
	{ x: 1055, y: 690 },
	{ x: 1330, y: 300 },
	{ x: 1390, y: 620 },
	{ x: 180, y: 660 },
] as const;

/** A job finding its installer: route draws square → dot, lands as a ping.
    Durations/delays are desynced so dispatches feel organic, and the ping
    shares the route's clock so it always fires as the line arrives. */
const NETWORK_ROUTES = [
	{
		d: "M 140 150 Q 420 55, 860 120",
		to: { x: 860, y: 120 },
		dur: "16s",
		delay: "-3s",
	},
	{
		d: "M 95 540 Q 300 765, 760 700",
		to: { x: 760, y: 700 },
		dur: "19s",
		delay: "-11s",
	},
	{
		d: "M 660 180 Q 1000 40, 1330 300",
		to: { x: 1330, y: 300 },
		dur: "22s",
		delay: "-17s",
	},
] as const;

function SceneBackdrop() {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
			<svg
				aria-hidden="true"
				viewBox="0 0 1440 820"
				preserveAspectRatio="xMidYMid slice"
				className="hero-scene-breathe absolute inset-0 h-full w-full text-border"
			>
				<defs>
					<linearGradient
						id="hero-scene-route-grad"
						x1="0"
						y1="0"
						x2="1"
						y2="0"
					>
						<stop offset="0" stopColor={INSTALLER_GRADIENT_FROM} />
						<stop offset="1" stopColor={INSTALLER_GRADIENT_TO} />
					</linearGradient>
				</defs>

				{/* The ghost mark — the network's spine, traced on load */}
				<path
					d={INSTALLER_LOGO_PATH}
					transform={GHOST_TRANSFORM}
					pathLength={1}
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					vectorEffect="non-scaling-stroke"
					className="hero-scene-ghost"
				/>

				{/* The constellation — senders and installers */}
				<g className="text-muted-foreground">
					{NETWORK_SENDERS.map((node) => (
						<rect
							key={`s-${node.x}-${node.y}`}
							x={node.x - 3.5}
							y={node.y - 3.5}
							width="7"
							height="7"
							rx="1.5"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
							opacity="0.5"
						/>
					))}
					{NETWORK_INSTALLERS.map((node) => (
						<circle
							key={`i-${node.x}-${node.y}`}
							cx={node.x}
							cy={node.y}
							r="2.5"
							fill="currentColor"
							opacity="0.4"
						/>
					))}
				</g>

				{/* Dispatches */}
				<g className="motion-reduce:hidden">
					{NETWORK_ROUTES.map((route) => (
						<g key={route.d}>
							<path
								d={route.d}
								pathLength={1}
								fill="none"
								stroke="url(#hero-scene-route-grad)"
								strokeWidth="1.2"
								className="hero-scene-route"
								style={{
									animationDuration: route.dur,
									animationDelay: route.delay,
								}}
							/>
							<circle
								cx={route.to.x}
								cy={route.to.y}
								r="7"
								fill="none"
								stroke="var(--color-brand)"
								strokeWidth="1.5"
								className="hero-scene-ping"
								style={{
									animationDuration: route.dur,
									animationDelay: route.delay,
								}}
							/>
						</g>
					))}
				</g>
			</svg>
			<div className="absolute left-1/2 top-[-20%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-brand)_8%,transparent)_0%,transparent_65%)] blur-3xl" />
		</div>
	);
}

// ── The showpiece: logo draw-on + orbiting deal dots + insider chips ────

const ORBIT_PATH = "M 70 450 a 380 140 0 1 0 760 0 a 380 140 0 1 0 -760 0";

function LogoScene({ chips }: { chips: readonly HeroSceneChip[] }) {
	return (
		<div className="relative mx-auto flex w-full max-w-[30rem] items-center justify-center lg:max-w-none">
			{/* Ambient glow — blooms in as the fill lands, then breathes with the float */}
			<div
				aria-hidden
				className="hero-scene-logo-glow absolute left-1/2 top-1/2 -z-10 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-brand)_18%,transparent)_0%,transparent_70%)] blur-2xl"
			/>
			{/* Ground shadow — breathes opposite the float, so the mark reads as airborne */}
			<div
				aria-hidden
				className="hero-scene-shadow absolute bottom-[8%] left-1/2 h-4 w-[38%] -translate-x-1/2 rounded-[100%] bg-foreground/15 blur-md dark:bg-black/40"
			/>
			<svg
				viewBox={INSTALLER_LOGO_VIEWBOX}
				className="hero-scene-float h-[max(8rem,min(22vh,29rem))] w-auto lg:h-[clamp(16rem,42vh,29rem)]"
				role="img"
				aria-label="Installer logomark"
			>
				<defs>
					<linearGradient
						id="hero-scene-brand-fill"
						x1="0"
						y1="0"
						x2="0"
						y2="1"
					>
						<stop offset="0" stopColor={INSTALLER_GRADIENT_FROM} />
						<stop offset="1" stopColor={INSTALLER_GRADIENT_TO} />
					</linearGradient>
				</defs>

				{/* The local loop — the network's traffic circulating the mark.
				    One hairline ring in the ghost's stroke dialect; the riders
				    reuse the backdrop's vocabulary (hollow square = sender,
				    muted dots = installers), with a single brand dot as the
				    only green among them. Different periods let them overtake
				    each other, so the loop never reads as a mechanism. */}
				<g transform="rotate(-16 450 450)">
					<path
						d={ORBIT_PATH}
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						vectorEffect="non-scaling-stroke"
						className="text-border"
						opacity="0.9"
					/>
					<g className="motion-reduce:hidden text-muted-foreground">
						<circle r="5" fill="currentColor" opacity="0.55">
							<animateMotion
								dur="22s"
								begin="-8s"
								repeatCount="indefinite"
								path={ORBIT_PATH}
							/>
						</circle>
						<circle r="5" fill="currentColor" opacity="0.55">
							<animateMotion
								dur="22s"
								begin="-16s"
								repeatCount="indefinite"
								path={ORBIT_PATH}
							/>
						</circle>
						<rect
							x="-6.5"
							y="-6.5"
							width="13"
							height="13"
							rx="2.5"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.25"
							vectorEffect="non-scaling-stroke"
							opacity="0.6"
						>
							<animateMotion
								dur="26s"
								begin="-4s"
								repeatCount="indefinite"
								path={ORBIT_PATH}
							/>
						</rect>
						<circle r="5.5" fill="url(#hero-scene-brand-fill)">
							<animateMotion
								dur="18s"
								begin="-2s"
								repeatCount="indefinite"
								path={ORBIT_PATH}
							/>
						</circle>
					</g>
				</g>

				{/* The mark itself — traced, then filled */}
				<g transform={INSTALLER_LOGO_TRANSFORM}>
					<path
						d={INSTALLER_LOGO_PATH}
						pathLength={1}
						className="hero-scene-logo-path"
						stroke="url(#hero-scene-brand-fill)"
						fill="url(#hero-scene-brand-fill)"
					/>
				</g>
			</svg>

			{/* Insider chips — arrive one by one, then drift on their own phase */}
			<div aria-hidden className="hidden md:contents">
				{chips.slice(0, CHIP_SPOTS.length).map((chip, i) => (
					<span
						key={chip.label}
						className={`hero-scene-chip absolute inline-flex items-baseline gap-1.5 rounded-lg border border-border/70 bg-card/70 px-2.5 py-1 shadow-sm backdrop-blur-sm ${CHIP_SPOTS[i]}`}
						style={{
							animationDelay: `${0.9 + i * 0.15}s, ${1.5 + i * 0.9}s`,
						}}
					>
						<span className="font-mono text-[11px] text-foreground">
							{chip.label}
						</span>
						<span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-brand)]">
							{chip.meta}
						</span>
					</span>
				))}
			</div>
		</div>
	);
}

const CHIP_SPOTS = [
	"left-[2%] top-[14%] -rotate-3",
	"right-[1%] top-[26%] rotate-2",
	"left-[6%] bottom-[18%] rotate-1",
	"right-[8%] bottom-[10%] -rotate-2",
] as const;

// ── Ticker — legible inside, noise outside ──────────────────────────────

function Ticker({ items }: { items: readonly string[] }) {
	return (
		<div
			aria-hidden
			className="relative z-10 shrink-0 overflow-hidden border-t border-border/60 py-3 [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]"
		>
			{/* Two copies of the row; the track scrolls -50% and loops seamlessly. */}
			<div className="hero-scene-ticker-track flex w-max items-center">
				<TickerRow items={items} />
				<TickerRow items={items} />
			</div>
		</div>
	);
}

function TickerRow({ items }: { items: readonly string[] }) {
	return (
		<>
			{items.map((item) => (
				<span
					key={item}
					className="flex items-center gap-6 pr-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground/70"
				>
					{item}
					<span className="inline-block size-1 rounded-full bg-[var(--color-brand)] opacity-60" />
				</span>
			))}
		</>
	);
}

// ── Scoped animation CSS (kept off the global sheet) ────────────────────

const HERO_SCENE_CSS = `
/* Copy column entrance — staggered fade/rise (the source's tw-animate
   utilities, inlined so the scene has zero plugin dependencies). */
@keyframes hero-scene-rise-2 {
  from { opacity: 0; transform: translateY(0.5rem); }
}
@keyframes hero-scene-rise-3 {
  from { opacity: 0; transform: translateY(0.75rem); }
}
@keyframes hero-scene-fade {
  from { opacity: 0; }
}
.hero-scene-enter-kicker { animation: hero-scene-rise-2 0.5s ease both; }
.hero-scene-enter-headline { animation: hero-scene-rise-3 0.7s ease both; }
.hero-scene-enter-subhead { animation: hero-scene-rise-3 0.7s ease 0.15s both; }
.hero-scene-enter-cta { animation: hero-scene-rise-3 0.7s ease 0.3s both; }
.hero-scene-enter-footnote { animation: hero-scene-fade 0.7s ease 0.5s both; }

.hero-scene-logo-path {
  stroke-width: 8;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  fill-opacity: 0;
  animation:
    hero-scene-draw 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
    hero-scene-fill 0.9s ease-out 1.2s forwards;
}
@keyframes hero-scene-draw { to { stroke-dashoffset: 0; } }
@keyframes hero-scene-fill { to { fill-opacity: 1; } }

/* Headline accent — the one lively brand moment: a slow gradient sheen */
.hero-scene-accent {
  background-image: linear-gradient(to right, ${INSTALLER_GRADIENT_FROM}, ${INSTALLER_GRADIENT_TO}, ${INSTALLER_GRADIENT_FROM});
  background-size: 200% 100%;
  animation: hero-scene-sheen 8s linear infinite;
}
@keyframes hero-scene-sheen { to { background-position: -200% 0; } }

/* Ghost mark — the network's spine traces itself on load, in step with
   the vivid logomark up front */
.hero-scene-ghost {
  opacity: 0.75;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: hero-scene-draw 3.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

/* A dispatch: the route draws itself from sender to installer, hangs for a
   beat, and dissolves. Duration/delay set inline per route. */
.hero-scene-route {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  animation-name: hero-scene-route;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
@keyframes hero-scene-route {
  0% { stroke-dashoffset: 1; opacity: 0; }
  10% { opacity: 0.65; }
  30% { stroke-dashoffset: 0; opacity: 0.65; }
  44% { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

/* The job lands: a ring blooms at the installer as the route arrives.
   Shares the route's clock, so 28–48% here trails the 30% draw-complete. */
.hero-scene-ping {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
  animation-name: hero-scene-ping;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
}
@keyframes hero-scene-ping {
  0%, 27% { opacity: 0; transform: scale(0.35); }
  33% { opacity: 0.85; transform: scale(1); }
  48% { opacity: 0; transform: scale(2); }
  100% { opacity: 0; transform: scale(2); }
}

.hero-scene-breathe { animation: hero-scene-breathe 18s ease-in-out infinite alternate; }
@keyframes hero-scene-breathe {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(9px) scale(1.012); }
}

/* Ambient glow behind the mark — opacity only; the centering translate
   lives on the element and must not be overridden by keyframes. */
.hero-scene-logo-glow {
  opacity: 0;
  animation:
    hero-scene-glow-in 1.4s ease-out 1.3s forwards,
    hero-scene-glow-breathe 7s ease-in-out 2.7s infinite;
}
@keyframes hero-scene-glow-in { to { opacity: 1; } }
@keyframes hero-scene-glow-breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

.hero-scene-float { animation: hero-scene-float 7s ease-in-out infinite; }
@keyframes hero-scene-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Ground shadow breathes opposite the float (same 7s clock).
   Scale/opacity only — the centering translate lives on the element. */
.hero-scene-shadow { animation: hero-scene-shadow 7s ease-in-out infinite; }
@keyframes hero-scene-shadow {
  0%, 100% { transform: scaleX(1); opacity: 0.7; }
  50% { transform: scaleX(0.9); opacity: 0.45; }
}

/* Chips: staggered arrival, then each drifts on its own phase */
.hero-scene-chip {
  animation:
    hero-scene-chip-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both,
    hero-scene-bob 5s ease-in-out infinite;
}
@keyframes hero-scene-chip-in {
  from { opacity: 0; translate: 0 10px; }
  to { opacity: 1; translate: 0 0; }
}
@keyframes hero-scene-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.hero-scene-ticker-track { animation: hero-scene-ticker 32s linear infinite; }
@keyframes hero-scene-ticker { to { transform: translateX(-50%); } }

.hero-scene-brand-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 3rem;
  padding: 0 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  border: 2px solid transparent;
  border-radius: 8px;
  background:
    linear-gradient(var(--background), var(--background)) padding-box,
    linear-gradient(to bottom, ${INSTALLER_GRADIENT_FROM}, ${INSTALLER_GRADIENT_TO}) border-box;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.hero-scene-brand-btn:hover {
  box-shadow: 0 0 32px -8px var(--color-brand);
  transform: translateY(-1px);
}
.hero-scene-brand-btn:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .hero-scene-enter-kicker,
  .hero-scene-enter-headline,
  .hero-scene-enter-subhead,
  .hero-scene-enter-cta,
  .hero-scene-enter-footnote {
    animation: none;
  }
  .hero-scene-logo-path {
    animation: none;
    stroke-dashoffset: 0;
    fill-opacity: 1;
  }
  .hero-scene-ghost {
    animation: none;
    stroke-dashoffset: 0;
  }
  .hero-scene-chip,
  .hero-scene-logo-glow {
    animation: none;
    opacity: 1;
  }
  .hero-scene-accent,
  .hero-scene-breathe,
  .hero-scene-float,
  .hero-scene-shadow,
  .hero-scene-ticker-track {
    animation: none;
  }
}
`;
