/**
 * Marquee — a seamless, infinitely scrolling strip. Renders its
 * children twice into a track that translates -50% and loops with no
 * visible seam; the edges fade out under a mask so content never pops
 * in or out. Pauses on hover, and holds still under
 * `prefers-reduced-motion`.
 *
 * Self-contained: scoped CSS, no Tailwind or app tokens required.
 * Theme hook: --marquee-gap (default 2rem) for the spacing between
 * repeated children.
 */
import { type CSSProperties, type ReactNode, useId } from "react";

export function Marquee({
	children,
	durationSec = 32,
	direction = "left",
	pauseOnHover = true,
	fade = true,
	gap = "2rem",
	className,
}: {
	children: ReactNode;
	/** Seconds for one full pass. Larger = slower. */
	durationSec?: number;
	direction?: "left" | "right";
	pauseOnHover?: boolean;
	/** Fade the leading and trailing edges. */
	fade?: boolean;
	/** Space between the repeated content. */
	gap?: string;
	className?: string;
}) {
	const rawId = useId();
	const uid = rawId.replace(/[^a-zA-Z0-9-]/g, "");
	const rootClass = `marquee-${uid}`;

	return (
		<div
			className={[
				rootClass,
				"marquee",
				fade ? "marquee--fade" : "",
				pauseOnHover ? "marquee--pause" : "",
				className ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			style={{ "--marquee-gap": gap } as CSSProperties}
		>
			<style>{`
				.${rootClass} .marquee__track {
					animation: marquee-scroll-${uid} ${durationSec}s linear infinite;
					animation-direction: ${direction === "right" ? "reverse" : "normal"};
				}
				@keyframes marquee-scroll-${uid} {
					to { transform: translateX(-50%); }
				}
			`}</style>
			<div className="marquee__track" aria-hidden="true">
				<div className="marquee__group">{children}</div>
				<div className="marquee__group">{children}</div>
			</div>
			<style>{MARQUEE_CSS}</style>
		</div>
	);
}

const MARQUEE_CSS = `
.marquee {
  position: relative;
  overflow: hidden;
  width: 100%;
}
.marquee--fade {
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.marquee__track {
  display: flex;
  width: max-content;
  flex-wrap: nowrap;
}
.marquee--pause:hover .marquee__track {
  animation-play-state: paused;
}
.marquee__group {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--marquee-gap, 2rem);
  padding-right: var(--marquee-gap, 2rem);
}
@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none !important; transform: none; }
}
`;
