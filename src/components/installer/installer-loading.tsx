/**
 * Installer loading scene — an indefinite wait state built from the
 * logomark: a gradient comet endlessly traces the glyph outline while
 * the fill breathes on the same clock, so it holds up for an unknown
 * wait.
 *
 * Where `InstallerLogomark` is a one-shot draw-on for arrival moments,
 * this loops. Pure CSS; the only animated properties are
 * stroke-dashoffset, fill-opacity, opacity, and transform. The scene
 * fades in after a short delay so fast loads never flash it, and
 * `prefers-reduced-motion` renders the filled glyph statically.
 *
 * Self-contained: no Tailwind or app CSS required. Theme hooks:
 *   --installer-brand          glow tint        (default #00CC33)
 *   --installer-loading-muted  text/ghost color (default: currentColor mix)
 */
import { useId } from "react";

import {
	INSTALLER_GRADIENT_FROM,
	INSTALLER_GRADIENT_TO,
	INSTALLER_LOGO_PATH,
	INSTALLER_LOGO_TRANSFORM,
	INSTALLER_LOGO_VIEWBOX,
} from "./logo-path";

export function InstallerLoading({
	kicker = "Loading",
	message,
	className,
}: {
	/** Short uppercase label under the mark. */
	kicker?: string;
	/** Optional supporting sentence under the kicker. */
	message?: string;
	className?: string;
}) {
	const rawId = useId();
	const uid = rawId.replace(/[^a-zA-Z0-9-]/g, "");
	const gradientId = `installer-loading-grad-${uid}`;

	return (
		<div
			className={
				className ? `installer-loading ${className}` : "installer-loading"
			}
		>
			<style>{INSTALLER_LOADING_CSS}</style>

			{/* Brand glow, breathing at half the trace tempo */}
			<div aria-hidden className="installer-loading-glow" />

			<svg
				viewBox={INSTALLER_LOGO_VIEWBOX}
				className="installer-loading-mark"
				role="img"
				aria-label="Loading"
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor={INSTALLER_GRADIENT_FROM} />
						<stop offset="1" stopColor={INSTALLER_GRADIENT_TO} />
					</linearGradient>
				</defs>
				<g transform={INSTALLER_LOGO_TRANSFORM}>
					{/* Ghost outline — the destination the comet keeps tracing */}
					<path
						d={INSTALLER_LOGO_PATH}
						pathLength={1}
						fill="none"
						stroke="currentColor"
						strokeWidth={6}
						className="installer-loading-ghost"
					/>
					{/* Gradient fill swelling once per revolution */}
					<path
						d={INSTALLER_LOGO_PATH}
						className="installer-loading-fill"
						fill={`url(#${gradientId})`}
					/>
					{/* The comet */}
					<path
						d={INSTALLER_LOGO_PATH}
						pathLength={1}
						fill="none"
						stroke={`url(#${gradientId})`}
						strokeWidth={12}
						strokeLinecap="round"
						className="installer-loading-comet"
					/>
				</g>
			</svg>

			<div className="installer-loading-copy">
				<p className="installer-loading-kicker">{kicker}</p>
				{message ? (
					<p className="installer-loading-message">{message}</p>
				) : null}
			</div>
		</div>
	);
}

const INSTALLER_LOADING_CSS = `
.installer-loading {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 4rem 1.5rem;
  opacity: 0;
  animation: installer-loading-enter 500ms ease-out 250ms forwards;
}
@keyframes installer-loading-enter { to { opacity: 1; } }

.installer-loading-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  margin: auto;
  height: 18rem;
  width: 18rem;
  border-radius: 9999px;
  background: radial-gradient(
    circle at center,
    color-mix(in srgb, var(--installer-brand, #00CC33) 10%, transparent) 0%,
    transparent 70%
  );
  filter: blur(40px);
  animation: installer-loading-glow 4.8s ease-in-out infinite;
}
@keyframes installer-loading-glow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
}

.installer-loading-mark {
  position: relative;
  height: clamp(4.5rem, 14vh, 6.5rem);
  width: auto;
}

.installer-loading-ghost {
  opacity: 0.18;
}

.installer-loading-comet {
  stroke-dasharray: 0.14 0.86;
  animation: installer-loading-trace 2.4s linear infinite;
}
@keyframes installer-loading-trace {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -1; }
}

.installer-loading-fill {
  fill-opacity: 0.05;
  animation: installer-loading-breathe 2.4s ease-in-out infinite;
}
@keyframes installer-loading-breathe {
  0%, 100% { fill-opacity: 0.05; }
  50% { fill-opacity: 0.12; }
}

.installer-loading-copy {
  position: relative;
  margin-top: 1.75rem;
  max-width: 28rem;
  text-align: center;
}
.installer-loading-copy > * + * { margin-top: 0.5rem; }

.installer-loading-kicker {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--installer-loading-muted, color-mix(in srgb, currentColor 55%, transparent));
}

.installer-loading-message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.625;
  color: var(--installer-loading-muted, color-mix(in srgb, currentColor 55%, transparent));
}

@media (prefers-reduced-motion: reduce) {
  .installer-loading { opacity: 1; animation: none; }
  .installer-loading-comet { animation: none; opacity: 0; }
  .installer-loading-fill { animation: none; fill-opacity: 1; }
  .installer-loading-glow { animation: none; }
}
`;
