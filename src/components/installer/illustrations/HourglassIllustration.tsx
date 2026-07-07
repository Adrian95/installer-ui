import { motion } from "motion/react";
import { useId } from "react";

export function HourglassIllustration({ className }: { className?: string }) {
	const id = useId();

	return (
		<motion.svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			initial="idle"
			animate="idle"
		>
			<defs>
				<filter
					id={`super-bloom-${id}`}
					x="-100%"
					y="-100%"
					width="300%"
					height="300%"
				>
					<feGaussianBlur
						in="SourceGraphic"
						stdDeviation="1.5"
						result="blur1"
					/>
					<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
					<feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur3" />
					<feMerge>
						<feMergeNode in="blur3" />
						<feMergeNode in="blur2" />
						<feMergeNode in="blur1" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<linearGradient id={`radar-sweep-${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop stopColor="currentColor" stopOpacity="0.1" />
					<stop offset="1" stopColor="var(--color-brand)" stopOpacity="0.4" />
				</linearGradient>
				<linearGradient id={`glass-bg-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.05" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.01" />
				</linearGradient>
				<filter id={`noise-${id}`}>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.8"
						numOctaves="3"
						stitchTiles="stitch"
					/>
					<feColorMatrix
						type="matrix"
						values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0"
					/>
				</filter>
			</defs>

			<g strokeLinecap="round" strokeLinejoin="round">
				{/* Background Glass Plate */}
				<circle
					cx="50"
					cy="50"
					r="42"
					fill={`url(#glass-bg-${id})`}
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/30"
				/>

				{/* Radar Grid Rings */}
				<circle
					cx="50"
					cy="50"
					r="30"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeDasharray="1 3"
					className="text-muted-foreground/20"
				/>
				<circle
					cx="50"
					cy="50"
					r="15"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/10"
				/>

				{/* Crosshairs */}
				<path
					d="M50 8 L50 92 M8 50 L92 50"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/10"
				/>

				{/* Data Nodes (Healthy Deals) */}
				<circle
					cx="35"
					cy="35"
					r="1.5"
					fill="currentColor"
					className="text-muted-foreground/50"
				/>
				<circle
					cx="60"
					cy="25"
					r="1.5"
					fill="currentColor"
					className="text-muted-foreground/40"
				/>
				<circle
					cx="25"
					cy="65"
					r="1.5"
					fill="currentColor"
					className="text-muted-foreground/30"
				/>

				{/* The Radar Sweep (Hover action) */}
				<motion.path
					d="M50 50 L50 8 A 42 42 0 0 1 85 25 Z"
					fill={`url(#radar-sweep-${id})`}
					style={{ originX: "50px", originY: "50px" }}
					variants={{
						idle: { rotate: 0, opacity: 0 },
						hover: {
							rotate: 360,
							opacity: [0, 1, 1, 0],
							transition: { duration: 2, ease: "linear", repeat: Infinity },
						},
					}}
				/>
				<motion.path
					d="M50 50 L85 25"
					stroke="var(--color-brand)"
					strokeWidth="1"
					filter={`url(#super-bloom-${id})`}
					style={{ originX: "50px", originY: "50px" }}
					variants={{
						idle: { rotate: 0, opacity: 0 },
						hover: {
							rotate: 360,
							opacity: [0, 1, 1, 0],
							transition: { duration: 2, ease: "linear", repeat: Infinity },
						},
					}}
				/>

				{/* The Stale Deal (Target) */}
				<g transform="translate(65, 70)">
					{/* Target Box that pops up */}
					<motion.rect
						x="-10"
						y="-10"
						width="20"
						height="20"
						rx="3"
						stroke="var(--color-brand)"
						strokeWidth="0.5"
						fill="var(--background)"
						variants={{
							idle: { scale: 0.5, opacity: 0 },
							hover: {
								scale: 1,
								opacity: 0.8,
								transition: {
									type: "spring",
									stiffness: 200,
									damping: 15,
									delay: 0.8,
								},
							},
						}}
					/>

					{/* Target node pulsating */}
					<motion.circle
						cx="0"
						cy="0"
						r="2"
						fill="var(--color-brand)"
						filter={`url(#super-bloom-${id})`}
						variants={{
							idle: { scale: 1, opacity: 0.3 },
							hover: {
								scale: [1, 1.8, 1],
								opacity: 1,
								transition: {
									duration: 0.5,
									delay: 0.8,
									repeat: Infinity,
									repeatDelay: 1.5,
								},
							},
						}}
					/>

					{/* Warning bracket 1 */}
					<motion.path
						d="M-6 -6 L-8 -8 L-6 -10"
						stroke="var(--color-brand)"
						strokeWidth="0.5"
						fill="none"
						variants={{
							idle: { opacity: 0, x: 2, y: 2 },
							hover: { opacity: 1, x: 0, y: 0, transition: { delay: 0.9 } },
						}}
					/>

					{/* Warning bracket 2 */}
					<motion.path
						d="M6 6 L8 8 L6 10"
						stroke="var(--color-brand)"
						strokeWidth="0.5"
						fill="none"
						variants={{
							idle: { opacity: 0, x: -2, y: -2 },
							hover: { opacity: 1, x: 0, y: 0, transition: { delay: 0.9 } },
						}}
					/>
				</g>
			</g>

			{/* Noise Overlay */}
			<rect
				x="0"
				y="0"
				width="100"
				height="100"
				fill="transparent"
				filter={`url(#noise-${id})`}
				className="mix-blend-overlay opacity-50"
				pointerEvents="none"
			/>
		</motion.svg>
	);
}
