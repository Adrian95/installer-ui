import { motion, useReducedMotion } from "motion/react";
import { useCallback, useId } from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";

/**
 * SegmentedControl
 *
 * A generic N-position segmented control for choosing one value on a
 * *scale* — a set of options with an inherent order wants a control that
 * teaches the order, not a menu that hides it.
 *
 * Behaviour:
 *
 *   · Acts as a `radiogroup` with arrow-key navigation, Home/End jumps,
 *     and Space/Enter to commit. Tab-reachable as a single stop (the
 *     active segment), then arrow keys move between options — standard
 *     ARIA radiogroup semantics.
 *   · The active indicator is a single shared layout element
 *     (`motion.span layoutId`) so the move between positions is one
 *     continuous slide rather than simultaneous fades.
 *   · Hover and active states use `whileHover` / `whileTap` for tactile
 *     press feedback. No spring overshoot on the press — overshoots feel
 *     toy-like for a commitment control.
 *   · Each segment can carry an optional one-line `hint` shown in a
 *     tooltip on hover.
 *   · Honours `useReducedMotion`: the indicator still translates, but
 *     the spring transition drops to an instant snap.
 */

export interface SegmentedControlOption {
	value: string;
	label: string;
	hint?: string;
}

export interface SegmentedControlProps {
	options: SegmentedControlOption[];
	value: string;
	onChange: (next: string) => void;
	/** Accessible name for the radiogroup. */
	"aria-label"?: string;
	className?: string;
}

export function SegmentedControl({
	options,
	value,
	onChange,
	"aria-label": ariaLabel = "Options",
	className,
}: SegmentedControlProps) {
	const reduce = useReducedMotion();
	const instanceId = useId();

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			const currentIndex = options.findIndex(
				(option) => option.value === value,
			);
			const last = options.length - 1;
			let nextIndex: number | null = null;
			switch (event.key) {
				case "ArrowRight":
				case "ArrowDown":
					nextIndex = currentIndex >= last ? 0 : currentIndex + 1;
					break;
				case "ArrowLeft":
				case "ArrowUp":
					nextIndex = currentIndex <= 0 ? last : currentIndex - 1;
					break;
				case "Home":
					nextIndex = 0;
					break;
				case "End":
					nextIndex = last;
					break;
				default:
					return;
			}
			if (nextIndex === null) return;
			event.preventDefault();
			const next = options[nextIndex];
			if (next && next.value !== value) {
				onChange(next.value);
			}
		},
		[onChange, options, value],
	);

	return (
		<TooltipProvider delayDuration={150}>
			<div
				role="radiogroup"
				aria-label={ariaLabel}
				onKeyDown={handleKeyDown}
				className={cn(
					"relative inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-background/80 p-1 backdrop-blur-sm",
					"shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
					className,
				)}
			>
				{options.map((option) => {
					const active = option.value === value;
					const button = (
						<motion.button
							key={option.value}
							type="button"
							role="radio"
							aria-checked={active}
							tabIndex={active ? 0 : -1}
							data-active={active || undefined}
							onClick={() => {
								if (!active) onChange(option.value);
							}}
							whileHover={{ scale: active ? 1 : 1.02 }}
							whileTap={{ scale: 0.96 }}
							transition={{ type: "tween", duration: 0.12 }}
							className={cn(
								"relative isolate inline-flex h-7 min-w-[64px] items-center justify-center rounded-full px-3 text-[11px] font-semibold tracking-tight outline-none transition-colors",
								"focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-1 focus-visible:ring-offset-background",
								active
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{active ? (
								<motion.span
									layoutId={`segmented-control-indicator-${instanceId}`}
									transition={
										reduce
											? { duration: 0 }
											: {
													type: "spring",
													stiffness: 520,
													damping: 38,
													mass: 0.6,
												}
									}
									className="absolute inset-0 -z-10 rounded-full bg-accent ring-1 ring-inset ring-border"
								/>
							) : null}
							<span className="relative">{option.label}</span>
						</motion.button>
					);

					if (!option.hint) return button;

					return (
						<Tooltip key={option.value}>
							<TooltipTrigger asChild>{button}</TooltipTrigger>
							<TooltipContent side="bottom" className="px-2.5 py-1 text-xs">
								{option.hint}
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</TooltipProvider>
	);
}
