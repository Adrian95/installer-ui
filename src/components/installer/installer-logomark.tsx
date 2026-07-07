/**
 * Animated Installer logomark — a one-shot draw-on + gradient-bloom
 * for arrival moments (app boot, gated intros, hero sections).
 *
 * Pure CSS animation (stroke-dasharray draw + fill bloom) so it plays
 * during initial paint without JS timing. `prefers-reduced-motion`
 * renders the filled glyph statically. Zero dependencies beyond React.
 */
import { useId } from "react";

import {
	INSTALLER_GRADIENT_FROM,
	INSTALLER_GRADIENT_TO,
	INSTALLER_LOGO_PATH,
	INSTALLER_LOGO_TRANSFORM,
	INSTALLER_LOGO_VIEWBOX,
} from "./logo-path";

export function InstallerLogomark({
	className,
	play = true,
	drawDurationMs = 1100,
	title,
}: {
	className?: string;
	/** false renders the final filled state with no animation. */
	play?: boolean;
	drawDurationMs?: number;
	/**
	 * Accessible name for the mark. Omit when it sits next to visible
	 * text (the SVG is then hidden from assistive tech).
	 */
	title?: string;
}) {
	const rawId = useId();
	const uid = rawId.replace(/[^a-zA-Z0-9-]/g, "");
	const gradientId = `installer-logomark-gradient-${uid}`;
	const pathClass = `installer-logomark-path-${uid}`;
	const fillDelayMs = Math.round(drawDurationMs * 0.77);
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: labelled conditionally — role="img" + <title> when `title` is set, aria-hidden otherwise; the static rule can't see through the spread.
		<svg
			viewBox={INSTALLER_LOGO_VIEWBOX}
			className={className}
			{...(title ? { role: "img" } : { "aria-hidden": true })}
		>
			{title ? <title>{title}</title> : null}
			{play ? (
				<style>{`
					.${pathClass} {
						stroke-width: 8;
						stroke-dasharray: 1;
						stroke-dashoffset: 1;
						fill-opacity: 0;
						animation:
							installer-logomark-draw ${drawDurationMs}ms cubic-bezier(0.65, 0, 0.35, 1) forwards,
							installer-logomark-fill 600ms ease-out ${fillDelayMs}ms forwards;
					}
					@keyframes installer-logomark-draw { to { stroke-dashoffset: 0; } }
					@keyframes installer-logomark-fill { to { fill-opacity: 1; } }
					@media (prefers-reduced-motion: reduce) {
						.${pathClass} {
							animation: none;
							stroke-dashoffset: 0;
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
				<path
					d={INSTALLER_LOGO_PATH}
					pathLength={1}
					className={play ? pathClass : undefined}
					stroke={`url(#${gradientId})`}
					fill={`url(#${gradientId})`}
				/>
			</g>
		</svg>
	);
}
