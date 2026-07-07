import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

// ─── SpicedBand ────────────────────────────────────────
//
// Five discrete cell meters, one per pillar, three cells
// high because the scale *is* discrete (0–3). Reads like a
// battery — a glance says how charged each pillar is, and
// the empty track keeps the maximum visible.
//
// Designed as a hero centrepiece, so it is fluid: five equal
// bays split the available width (56px bays on a phone,
// ~130px in a desktop hero) and the cells are plain layout
// boxes, not fixed SVG geometry. Motion animates fills
// rising from the baseline.
//
// The four-ink grammar, unchanged:
//   ink   — a filled cell
//   red   — a weak pillar (score 0–1), the only alarm; a
//           scored zero shows as a red sliver at the baseline
//           so "measured: nothing" ≠ "not yet measured"
//   brand — the active bay while its detail view is open, and
//           the sweep that crosses the band while an
//           assessment runs
//   dashed— not yet scored, or gate-withheld potential
//
// Numbers live in the tooltip and the aria-label, not on the
// marks.

export type SpicedDimension =
	| "situation"
	| "pain"
	| "impact"
	| "critical_event"
	| "decision";

export type SpicedScore = 0 | 1 | 2 | 3;

export interface BandPillar {
	dimension: SpicedDimension;
	label: string;
	/** Raw operator/agent score, before the P+I gate. */
	score: SpicedScore | undefined;
	/** Score after the gate cap — what the meter actually fills. */
	displayedScore: SpicedScore | undefined;
	/** True when the P+I gate is withholding cells from this pillar. */
	gateBlocked: boolean;
}

export interface SpicedBandProps {
	pillars: readonly BandPillar[];
	activeDimension?: SpicedDimension | null;
	onPillarClick?: (dimension: SpicedDimension) => void;
	/** True while an assessment is in flight — a brand sheen sweeps
	 * the band until the new scores land and the cells re-animate. */
	assessing?: boolean;
	className?: string;
}

/** Cell slots rendered top-down; the slot number is the cell's
 * identity, counted from the baseline up (0 = bottom). */
const CELL_SLOTS_TOP_DOWN = [2, 1, 0] as const;

const DIM_INITIAL: Record<SpicedDimension, string> = {
	situation: "S",
	pain: "P",
	impact: "I",
	critical_event: "C",
	decision: "D",
};

export function SpicedBand({
	pillars,
	activeDimension = null,
	onPillarClick,
	assessing = false,
	className,
}: SpicedBandProps) {
	const reduce = useReducedMotion();

	return (
		<TooltipProvider delayDuration={150}>
			<div
				className={cn("relative w-full", className)}
				data-assessing={assessing || undefined}
			>
				<div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
					{pillars.map((pillar, bayIndex) => {
						const shown = pillar.displayedScore ?? pillar.score;
						const capped =
							pillar.gateBlocked &&
							pillar.score !== undefined &&
							pillar.displayedScore !== undefined &&
							pillar.score > pillar.displayedScore;
						const active = pillar.dimension === activeDimension;
						const detail =
							shown === undefined
								? "Not yet scored"
								: `Score ${shown} of 3${
										capped
											? ` · capped from ${pillar.score} by the P+I gate`
											: ""
									}`;
						return (
							<Tooltip key={pillar.dimension}>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={() => onPillarClick?.(pillar.dimension)}
										aria-current={active ? "true" : undefined}
										aria-label={`${pillar.label}: ${detail}. Open details.`}
										className={cn(
											"group min-w-0 rounded-lg p-1 pb-0.5 outline-none transition-colors sm:p-1.5 sm:pb-1",
											"hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04]",
											"focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand)]",
											active && "bg-foreground/[0.04]",
										)}
									>
										<BandBay
											pillar={pillar}
											bayIndex={bayIndex}
											active={active}
											reduce={reduce ?? false}
										/>
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="px-2.5 py-1 text-xs">
									<span className="font-medium">{pillar.label}</span>
									<span className="text-muted-foreground"> · {detail}</span>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>

				{/* Assessing sweep — one soft brand gradient crossing the
				    cells on repeat while the assessment is in flight.
				    Purely decorative; the data swap is what actually
				    ends it. */}
				<AnimatePresence>
					{assessing && !reduce ? (
						<motion.div
							key="assess-sweep"
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<motion.div
								className="absolute inset-y-0 w-[18%] bg-gradient-to-r from-transparent via-[var(--color-brand)]/25 to-transparent"
								initial={{ left: "-18%" }}
								animate={{ left: "118%" }}
								transition={{
									duration: 1.4,
									ease: "easeInOut",
									repeat: Infinity,
									repeatDelay: 0.5,
								}}
							/>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</TooltipProvider>
	);
}

// ─── BandBay ──────────────────────────────────────────
//
// One pillar's column: three stacked cells over a letter
// shelf. Pure layout boxes — filled cells are motion divs
// that rise from the baseline, gently staggered.

function BandBay({
	pillar,
	bayIndex,
	active,
	reduce,
}: {
	pillar: BandPillar;
	bayIndex: number;
	active: boolean;
	reduce: boolean;
}) {
	const shown = pillar.displayedScore ?? pillar.score;
	const isUnknown = shown === undefined;
	const weak = !isUnknown && shown <= 1;
	const filledCount = shown ?? 0;

	// Gate-withheld cells sit between the capped fill and the raw
	// score — dashed, like everything not yet real.
	const capped =
		pillar.gateBlocked &&
		pillar.score !== undefined &&
		pillar.displayedScore !== undefined &&
		pillar.score > pillar.displayedScore;
	const ghostTo = capped ? (pillar.score as number) : filledCount;

	const fillClass = active
		? "bg-[var(--color-brand)]"
		: weak
			? "bg-red-500 dark:bg-red-400"
			: "bg-foreground/75";

	return (
		<span className="flex w-full flex-col">
			<span className="relative flex w-full flex-col gap-[3px]">
				{CELL_SLOTS_TOP_DOWN.map((slot) => {
					if (isUnknown) {
						// Unscored tracks arrive with the same baseline-up
						// stagger as filled cells, so the empty state still
						// moves like the scored one — just in outline.
						return (
							<motion.span
								key={`slot-${slot}`}
								className="h-2.5 w-full rounded-[3px] border border-dashed border-muted-foreground/40 sm:h-3"
								initial={reduce ? false : { opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={
									reduce
										? { duration: 0 }
										: { duration: 0.35, delay: bayIndex * 0.05 + slot * 0.06 }
								}
							/>
						);
					}
					if (slot < ghostTo && slot >= filledCount) {
						return (
							<span
								key={`slot-${slot}`}
								className="h-2.5 w-full rounded-[3px] border border-dashed border-foreground/40 sm:h-3"
							/>
						);
					}
					return (
						<span
							key={`slot-${slot}`}
							className="relative h-2.5 w-full rounded-[3px] bg-muted-foreground/15 sm:h-3"
						>
							<AnimatePresence>
								{slot < filledCount ? (
									<motion.span
										key="fill"
										className={cn("absolute inset-0 rounded-[3px]", fillClass)}
										initial={reduce ? false : { opacity: 0, y: 3 }}
										animate={{ opacity: 1, y: 0 }}
										exit={reduce ? { opacity: 0 } : { opacity: 0, y: 3 }}
										transition={
											reduce
												? { duration: 0 }
												: {
														type: "spring",
														stiffness: 420,
														damping: 32,
														delay: bayIndex * 0.05 + slot * 0.06,
													}
										}
									/>
								) : null}
							</AnimatePresence>
						</span>
					);
				})}

				{/* A scored zero is not "unmeasured" — it gets a red sliver
				    at the baseline: measured, and there is nothing there. */}
				{!isUnknown && filledCount === 0 ? (
					<motion.span
						className={cn(
							"absolute inset-x-0 bottom-0 h-[3px] rounded-full",
							active ? "bg-[var(--color-brand)]" : "bg-red-500 dark:bg-red-400",
						)}
						initial={reduce ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={reduce ? { duration: 0 } : { delay: bayIndex * 0.05 }}
					/>
				) : null}
			</span>

			{/* Pillar initial on the shelf. */}
			<span
				className={cn(
					"mt-1.5 w-full text-center font-mono text-[10px] font-semibold leading-none",
					active ? "text-foreground" : "text-muted-foreground/70",
				)}
			>
				{DIM_INITIAL[pillar.dimension]}
			</span>
		</span>
	);
}
