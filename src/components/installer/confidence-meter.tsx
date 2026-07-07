import { motion } from "motion/react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

// ── ConfidenceMeter ───────────────────────────────────────────────────────
//
// Calibrated 0–1 confidence rendered as a 5-segment meter with a label.
// Tactile and dense — fits in the same row as a small chip without
// stealing the eye from the title.
//
// Buckets: very_low / low / moderate / high / very_high.

const SEGMENTS = 5;

type ConfidenceTone = "muted" | "amber" | "primary";

function segmentsFilled(value: number): number {
	if (value < 0.3) return 1;
	if (value < 0.55) return 2;
	if (value < 0.75) return 3;
	if (value < 0.9) return 4;
	return 5;
}

function toneFor(value: number): ConfidenceTone {
	if (value < 0.55) return "amber";
	if (value < 0.75) return "muted";
	return "primary";
}

function labelFor(value: number): string {
	if (value < 0.3) return "Very low";
	if (value < 0.55) return "Low";
	if (value < 0.75) return "Moderate";
	if (value < 0.9) return "High";
	return "Very high";
}

const TONE_FILL: Record<ConfidenceTone, string> = {
	muted: "bg-muted-foreground/45",
	amber: "bg-amber-500/85",
	primary: "bg-primary",
};

const TONE_TEXT: Record<ConfidenceTone, string> = {
	muted: "text-muted-foreground",
	amber: "text-amber-700 dark:text-amber-300",
	primary: "text-primary",
};

export type ConfidenceMeterProps = {
	value: number | null | undefined;
	/** Compact mode hides the numeric label; meter only. */
	compact?: boolean;
	className?: string;
};

export function ConfidenceMeter({
	value,
	compact = false,
	className,
}: ConfidenceMeterProps) {
	if (value == null) {
		return (
			<span
				className={cn(
					"inline-flex items-center gap-1.5 type-meta text-muted-foreground/70",
					className,
				)}
				aria-label="Confidence not provided"
			>
				<span className="inline-flex gap-[2px]" aria-hidden>
					{Array.from({ length: SEGMENTS }).map((_, i) => (
						<span
							key={i}
							className="h-2 w-1.5 rounded-[1px] bg-muted-foreground/15"
						/>
					))}
				</span>
				{!compact ? <span>—</span> : null}
			</span>
		);
	}

	const clamped = Math.max(0, Math.min(1, value));
	const filled = segmentsFilled(clamped);
	const tone = toneFor(clamped);
	const label = labelFor(clamped);
	const percent = Math.round(clamped * 100);

	return (
		<TooltipProvider delayDuration={150}>
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className={cn("inline-flex items-center gap-1.5", className)}
						role="meter"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={percent}
						aria-label={`Confidence ${percent} percent — ${label}`}
					>
						<span className="inline-flex gap-[2px]" aria-hidden>
							{Array.from({ length: SEGMENTS }).map((_, i) => {
								const isFilled = i < filled;
								return (
									<motion.span
										key={i}
										initial={{ scaleY: isFilled ? 0.4 : 1, opacity: 0.5 }}
										animate={{ scaleY: 1, opacity: 1 }}
										transition={{
											duration: 0.18,
											delay: i * 0.025,
											ease: [0.25, 0.1, 0.25, 1],
										}}
										className={cn(
											"h-2 w-1.5 origin-bottom rounded-[1px] transition-colors",
											isFilled ? TONE_FILL[tone] : "bg-muted-foreground/15",
										)}
									/>
								);
							})}
						</span>
						{!compact ? (
							<span
								className={cn(
									"type-meta tabular-nums leading-none",
									TONE_TEXT[tone],
								)}
							>
								{label}
							</span>
						) : null}
					</span>
				</TooltipTrigger>
				<TooltipContent>
					<span className="font-medium">{label}</span> confidence ·{" "}
					<span className="tabular-nums">{percent}%</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
