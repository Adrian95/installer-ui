import { useId } from "react";

import { cn } from "#/lib/utils";
import {
	INSTALLER_GRADIENT_FROM,
	INSTALLER_GRADIENT_TO,
	INSTALLER_LOGO_PATH,
	INSTALLER_LOGO_TRANSFORM,
	INSTALLER_LOGO_VIEWBOX,
} from "./logo-path";

// ──────────────────────────────────────────────────────────────
//  CopilotMark — the Installer logomark as a presence indicator.
//
//  Concept: the mark IS the status. Idle it sits quiet in the text
//  color, indistinguishable from typography. The moment something
//  is working, it becomes a brand-gradient line perpetually tracing
//  its own glyph — the marketing draw-on moment, miniaturized into
//  a living indicator. No stars, no dot triples; one mark, two
//  states.
//
//  Green stays a surgical accent: it only ever appears while
//  something is actually happening.
// ──────────────────────────────────────────────────────────────

export function CopilotMark({
	live = false,
	className,
}: {
	/** True while something is thinking or streaming. */
	live?: boolean;
	className?: string;
}) {
	const rawId = useId();
	const uid = rawId.replace(/[^a-zA-Z0-9-]/g, "");
	const gradientId = `copilot-mark-gradient-${uid}`;
	const pathClass = `copilot-mark-path-${uid}`;

	return (
		<svg
			aria-hidden="true"
			viewBox={INSTALLER_LOGO_VIEWBOX}
			className={cn("size-3 shrink-0", className)}
		>
			{live ? (
				<style>{`
					.${pathClass} {
						stroke-width: 56;
						stroke-linecap: round;
						stroke-dasharray: 0.72 0.28;
						fill-opacity: 0.14;
						animation: copilot-mark-trace 1.9s linear infinite;
					}
					@keyframes copilot-mark-trace {
						to { stroke-dashoffset: -1; }
					}
					@media (prefers-reduced-motion: reduce) {
						.${pathClass} {
							animation: none;
							stroke-dasharray: none;
							fill-opacity: 1;
						}
					}
				`}</style>
			) : null}
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={INSTALLER_GRADIENT_FROM} />
					<stop offset="1" stopColor={INSTALLER_GRADIENT_TO} />
				</linearGradient>
			</defs>
			<g transform={INSTALLER_LOGO_TRANSFORM}>
				{live ? (
					<path
						d={INSTALLER_LOGO_PATH}
						pathLength={1}
						className={pathClass}
						stroke={`url(#${gradientId})`}
						fill={`url(#${gradientId})`}
					/>
				) : (
					<path d={INSTALLER_LOGO_PATH} fill="currentColor" />
				)}
			</g>
		</svg>
	);
}
