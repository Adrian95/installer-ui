/**
 * SegmentMeter — a row of discrete cell meters (think battery gauges),
 * one column per segment, `max` cells high. A glance reads how charged
 * each segment is; the empty track keeps the ceiling visible.
 *
 * Four-ink grammar:
 *   ink    — a filled cell
 *   red    — a "weak" segment (value ≤ weakThreshold), the only alarm;
 *            a measured zero shows as a red sliver at the baseline so
 *            "measured: nothing" ≠ "not yet measured"
 *   brand  — the active column, and the sweep while `assessing`
 *   dashed — not yet scored (value undefined), or "ghost" potential
 *            between the filled value and `ghostTo`
 *
 * Fluid layout (no fixed SVG geometry); fills rise from the baseline
 * with a gentle stagger, and hold still under reduced motion.
 */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

export interface MeterSegment {
	/** Stable identity. */
	key: string;
	/** Full label, shown in the tooltip and aria-label. */
	label: string;
	/** Short glyph on the shelf under the column (e.g. an initial). */
	short?: string;
	/** Filled cells, 0..max. `undefined` = not yet scored (dashed track). */
	value: number | undefined;
	/**
	 * Optional "potential" ceiling. When `ghostTo > value`, the cells
	 * between value and ghostTo render dashed — withheld, not yet real.
	 */
	ghostTo?: number;
}

export interface SegmentMeterProps {
	segments: readonly MeterSegment[];
	/** Cells per column. */
	max?: number;
	/** Values at or below this read as the red "weak" alarm. */
	weakThreshold?: number;
	activeKey?: string | null;
	onSegmentClick?: (key: string) => void;
	/** True while a scoring pass runs — a brand sheen sweeps the row. */
	assessing?: boolean;
	className?: string;
}

export function SegmentMeter({
	segments,
	max = 3,
	weakThreshold = 1,
	activeKey = null,
	onSegmentClick,
	assessing = false,
	className,
}: SegmentMeterProps) {
	const reduce = useReducedMotion();
	// Slots rendered top-down; slot number counts from the baseline (0 = bottom).
	const slotsTopDown = Array.from({ length: max }, (_, i) => max - 1 - i);

	return (
		<TooltipProvider delayDuration={150}>
			<div
				className={cn("relative w-full", className)}
				data-assessing={assessing || undefined}
			>
				<div
					className="grid gap-1.5 sm:gap-2.5"
					style={{
						gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))`,
					}}
				>
					{segments.map((segment, bayIndex) => {
						const shown = segment.value;
						const capped =
							segment.ghostTo !== undefined &&
							shown !== undefined &&
							segment.ghostTo > shown;
						const active = segment.key === activeKey;
						const detail =
							shown === undefined
								? "Not yet scored"
								: `Score ${shown} of ${max}${
										capped ? ` · potential ${segment.ghostTo}` : ""
									}`;
						return (
							<Tooltip key={segment.key}>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={() => onSegmentClick?.(segment.key)}
										aria-current={active ? "true" : undefined}
										aria-label={`${segment.label}: ${detail}.`}
										className={cn(
											"group min-w-0 rounded-lg p-1 pb-0.5 outline-none transition-colors sm:p-1.5 sm:pb-1",
											"hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04]",
											"focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-brand)]",
											active && "bg-foreground/[0.04]",
										)}
									>
										<MeterColumn
											segment={segment}
											slotsTopDown={slotsTopDown}
											weakThreshold={weakThreshold}
											bayIndex={bayIndex}
											active={active}
											reduce={reduce ?? false}
										/>
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom" className="px-2.5 py-1 text-xs">
									<span className="font-medium">{segment.label}</span>
									<span className="text-muted-foreground"> · {detail}</span>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>

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
									repeat: Number.POSITIVE_INFINITY,
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

// One segment's column: `max` stacked cells over an optional glyph shelf.
function MeterColumn({
	segment,
	slotsTopDown,
	weakThreshold,
	bayIndex,
	active,
	reduce,
}: {
	segment: MeterSegment;
	slotsTopDown: number[];
	weakThreshold: number;
	bayIndex: number;
	active: boolean;
	reduce: boolean;
}) {
	const shown = segment.value;
	const isUnknown = shown === undefined;
	const weak = !isUnknown && shown <= weakThreshold;
	const filledCount = shown ?? 0;
	const ghostTo =
		segment.ghostTo !== undefined && segment.ghostTo > filledCount
			? segment.ghostTo
			: filledCount;

	const fillClass = active
		? "bg-[var(--color-brand)]"
		: weak
			? "bg-red-500 dark:bg-red-400"
			: "bg-foreground/75";

	return (
		<span className="flex w-full flex-col">
			<span className="relative flex w-full flex-col gap-[3px]">
				{slotsTopDown.map((slot) => {
					if (isUnknown) {
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

				{/* A measured zero gets a red sliver at the baseline. */}
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

			{segment.short ? (
				<span
					className={cn(
						"mt-1.5 w-full text-center font-mono text-[10px] font-semibold leading-none",
						active ? "text-foreground" : "text-muted-foreground/70",
					)}
				>
					{segment.short}
				</span>
			) : null}
		</span>
	);
}
