/**
 * AnimatedNumber
 *
 * Tasteful numeric ease for any figure that changes in response to
 * a remote sync or local edit — currency, scores, coverage
 * percentages, or anything else the caller formats. Provides the
 * "the number actually moved" feedback.
 *
 * Why an effect: the rAF clock is an external system and the frame
 * callback is the only legitimate side-effect — Dan Abramov's
 * "effects sync to the outside world" carve-out. `useReducedMotion`
 * snaps instead of eases.
 *
 * The formatter is injected so one component renders currency, plain
 * integers, percentages, or anything else the caller produces.
 */

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DURATION_MS = 240;
const EASE = (t: number) => 1 - (1 - t) * (1 - t); // easeOutQuad

export interface AnimatedNumberProps {
	/** Target numeric value to interpolate toward. */
	value: number;
	/** Pure formatter — must be referentially stable. */
	format: (value: number) => string;
	className?: string;
}

export function AnimatedNumber({
	value,
	format,
	className,
}: AnimatedNumberProps) {
	const reduce = useReducedMotion();
	const [display, setDisplay] = useState(value);
	const fromRef = useRef(value);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		if (reduce) {
			fromRef.current = value;
			setDisplay(value);
			return;
		}
		const start = performance.now();
		const from = fromRef.current;
		const to = value;
		if (from === to) return;

		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / DURATION_MS);
			const next = from + (to - from) * EASE(t);
			setDisplay(next);
			if (t < 1) {
				rafRef.current = requestAnimationFrame(tick);
			} else {
				fromRef.current = to;
				rafRef.current = null;
			}
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
				fromRef.current = value;
			}
		};
	}, [value, reduce]);

	return (
		<span className={className} aria-live="polite">
			{format(display)}
		</span>
	);
}
