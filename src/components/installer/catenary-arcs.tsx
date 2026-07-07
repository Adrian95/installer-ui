import { useId } from "react";

import { cn } from "#/lib/utils";

// ──────────────────────────────────────────────────────────────
//  CatenaryArcs — nested catenary arches, hairline-drawn.
//
//  Gaudí found the catenary by hanging chains and inverting them;
//  here four nested arches draw themselves on, outermost first,
//  like a nave receding into light. Everything is hairline
//  stroke — the only color is the innermost arch, which carries
//  the brand gradient. Pure CSS (stroke-dasharray draw), static
//  under prefers-reduced-motion.
// ──────────────────────────────────────────────────────────────

const CX = 120;
const FOOT_Y = 118;

type Arch = {
	/** Half-width at the feet. */
	w: number;
	/** Apex height (smaller = taller). */
	ay: number;
	opacity: number;
	delayMs: number;
	gradient?: boolean;
};

const ARCHES: Arch[] = [
	{ w: 98, ay: 10, opacity: 0.1, delayMs: 0 },
	{ w: 76, ay: 34, opacity: 0.16, delayMs: 140 },
	{ w: 55, ay: 57, opacity: 0.24, delayMs: 280 },
	{ w: 35, ay: 79, opacity: 0.9, delayMs: 420, gradient: true },
];

/** Cubic approximation of a catenary arch: steep at the legs, flat at
 *  the crown. Drawn foot → apex → foot so the dash animation raises the
 *  arch from both sides at once. */
function archPath({ w, ay }: Pick<Arch, "w" | "ay">) {
	const h = FOOT_Y - ay;
	const shoulderY = FOOT_Y - 0.62 * h;
	const crownX = 0.58 * w;
	return [
		`M ${CX - w} ${FOOT_Y}`,
		`C ${CX - w} ${shoulderY}, ${CX - crownX} ${ay}, ${CX} ${ay}`,
		`C ${CX + crownX} ${ay}, ${CX + w} ${shoulderY}, ${CX + w} ${FOOT_Y}`,
	].join(" ");
}

export function CatenaryArcs({
	className,
	drawDurationMs = 1200,
}: {
	className?: string;
	drawDurationMs?: number;
}) {
	const rawId = useId();
	const uid = rawId.replace(/[^a-zA-Z0-9-]/g, "");
	const gradientId = `catenary-gradient-${uid}`;
	const pathClass = `catenary-path-${uid}`;

	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 240 120"
			fill="none"
			className={cn("overflow-visible", className)}
		>
			<style>{`
				.${pathClass} {
					stroke-dasharray: 1;
					stroke-dashoffset: 1;
					animation: catenary-draw-${uid} ${drawDurationMs}ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
				}
				@keyframes catenary-draw-${uid} {
					to { stroke-dashoffset: 0; }
				}
				@media (prefers-reduced-motion: reduce) {
					.${pathClass} {
						animation: none;
						stroke-dashoffset: 0;
					}
				}
			`}</style>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#7AFF04" />
					<stop offset="1" stopColor="#00CC33" />
				</linearGradient>
			</defs>
			{ARCHES.map((arch) => (
				<path
					key={arch.w}
					d={archPath(arch)}
					pathLength={1}
					className={pathClass}
					stroke={arch.gradient ? `url(#${gradientId})` : "currentColor"}
					strokeWidth={1}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
					opacity={arch.opacity}
					style={{ animationDelay: `${arch.delayMs}ms` }}
				/>
			))}
		</svg>
	);
}
