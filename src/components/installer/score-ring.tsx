/**
 * ScoreRing — a circular 0–100 indicator that spring-fills on mount.
 *
 * Four sizes (xs 20px → lg 80px) and four states driving the stroke:
 *   unknown → slate, dashed track, number suppressed (shows "—")
 *   low     → red
 *   medium  → amber
 *   high    → brand green
 *
 * When `state="unknown"` the ring stays empty and hides the number so
 * it never reads as a real zero.
 */
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "#/lib/utils";

export type ScoreRingSize = "xs" | "sm" | "md" | "lg";
export type ScoreRingState = "unknown" | "low" | "medium" | "high";

export interface ScoreRingProps {
	/** 0–100. Clamped and rounded for display. */
	score: number;
	state: ScoreRingState;
	size?: ScoreRingSize;
	showLabel?: boolean;
	className?: string;
	/** Overrides the computed aria-label. */
	label?: string;
}

const SIZE_CONFIG: Record<
	ScoreRingSize,
	{ outer: number; r: number; stroke: number; text: string }
> = {
	xs: { outer: 20, r: 8, stroke: 2.5, text: "text-[9px] font-semibold" },
	sm: { outer: 24, r: 10, stroke: 2.5, text: "text-[10px] font-semibold" },
	md: { outer: 48, r: 21, stroke: 4, text: "text-sm font-semibold" },
	lg: { outer: 80, r: 35, stroke: 6, text: "text-xl font-bold" },
};

const STATE_COLOR: Record<ScoreRingState, string> = {
	unknown: "text-slate-400",
	low: "text-red-500",
	medium: "text-amber-500",
	high: "text-[var(--color-brand)]",
};

const STATE_TRACK: Record<ScoreRingState, string> = {
	unknown: "text-slate-200 dark:text-slate-800",
	low: "text-red-500/15",
	medium: "text-amber-500/15",
	high: "text-[var(--color-brand)]/15",
};

export function ScoreRing({
	score,
	state,
	size = "sm",
	showLabel = true,
	className,
	label,
}: ScoreRingProps) {
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
