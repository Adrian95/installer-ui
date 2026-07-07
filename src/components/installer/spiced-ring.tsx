import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "#/lib/utils";

// ─── SpicedRing ────────────────────────────────────────
//
// Circular 0–100 score indicator. Sizes:
//   xs   — 18px outer, for kanban cards
//   sm   — 22px outer, for data table cells
//   md   — 48px outer, for hero blocks
//   lg   — 80px outer, for full-screen flows
//
// `state` drives the stroke colour:
//   unknown    → slate  (haven't measured yet)
//   weak       → red    (<40)
//   developing → amber  (40–74)
//   strong     → emerald brand (≥75)
//
// When `state === "unknown"` we render a dashed ring and
// suppress the percentage so the UI doesn't mislead the
// viewer into thinking the score is zero.

export type SpicedRingSize = "xs" | "sm" | "md" | "lg";
export type SpicedRingState = "unknown" | "weak" | "developing" | "strong";

export interface SpicedRingProps {
	score: number;
	state: SpicedRingState;
	size?: SpicedRingSize;
	showLabel?: boolean;
	className?: string;
	label?: string;
}

const SIZE_CONFIG: Record<
	SpicedRingSize,
	{ outer: number; r: number; stroke: number; text: string }
> = {
	xs: { outer: 20, r: 8, stroke: 2.5, text: "text-[9px] font-semibold" },
	sm: { outer: 24, r: 10, stroke: 2.5, text: "text-[10px] font-semibold" },
	md: { outer: 48, r: 21, stroke: 4, text: "text-sm font-semibold" },
	lg: { outer: 80, r: 35, stroke: 6, text: "text-xl font-bold" },
};

const STATE_COLOR: Record<SpicedRingState, string> = {
	unknown: "text-slate-400",
	weak: "text-red-500",
	developing: "text-amber-500",
	strong: "text-[var(--color-brand)]",
};

const STATE_TRACK: Record<SpicedRingState, string> = {
	unknown: "text-slate-200 dark:text-slate-800",
	weak: "text-red-500/15",
	developing: "text-amber-500/15",
	strong: "text-[var(--color-brand)]/15",
};

export function SpicedRing({
	score,
	state,
	size = "sm",
	showLabel = true,
	className,
	label,
}: SpicedRingProps) {
	const config = SIZE_CONFIG[size];
	const circumference = 2 * Math.PI * config.r;
	const center = config.outer / 2;
	const isUnknown = state === "unknown";
	const displayScore = Math.max(0, Math.min(100, Math.round(score)));

	const progress = useMotionValue(0);
	const spring = useSpring(progress, { stiffness: 110, damping: 22 });
	const strokeDashoffset = useTransform(
		spring,
		(v) => circumference - (v / 100) * circumference,
	);

	const hasAnimated = useRef(false);
	useEffect(() => {
		if (!hasAnimated.current) {
			progress.set(0);
			requestAnimationFrame(() => progress.set(isUnknown ? 0 : displayScore));
			hasAnimated.current = true;
		} else {
			progress.set(isUnknown ? 0 : displayScore);
		}
	}, [displayScore, isUnknown, progress]);

	return (
		<div
			className={cn(
				"relative inline-flex items-center justify-center",
				className,
			)}
			style={{ width: config.outer, height: config.outer }}
			role="img"
			aria-label={
				label ??
				(isUnknown ? "Score not yet assessed" : `Score ${displayScore} of 100`)
			}
		>
			<svg
				width={config.outer}
				height={config.outer}
				className="-rotate-90"
				aria-hidden="true"
			>
				<circle
					cx={center}
					cy={center}
					r={config.r}
					fill="none"
					stroke="currentColor"
					strokeWidth={config.stroke}
					strokeDasharray={isUnknown ? "2 3" : undefined}
					className={STATE_TRACK[state]}
				/>
				{!isUnknown && (
					<motion.circle
						cx={center}
						cy={center}
						r={config.r}
						fill="none"
						stroke="currentColor"
						strokeWidth={config.stroke}
						strokeDasharray={circumference}
						style={{ strokeDashoffset }}
						strokeLinecap="round"
						className={STATE_COLOR[state]}
					/>
				)}
			</svg>
			{showLabel && (
				<span
					className={cn(
						"absolute leading-none",
						config.text,
						isUnknown ? "text-slate-400" : STATE_COLOR[state],
					)}
				>
					{isUnknown ? "—" : displayScore}
				</span>
			)}
		</div>
	);
}
