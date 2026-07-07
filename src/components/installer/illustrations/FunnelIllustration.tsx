import { motion } from "motion/react";
import { useId } from "react";

export function FunnelIllustration({ className }: { className?: string }) {
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
					<feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur1" />
					<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
					<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur3" />
					<feMerge>
						<feMergeNode in="blur3" />
						<feMergeNode in="blur2" />
						<feMergeNode in="blur1" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<linearGradient id={`glass-panel-${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.08" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.01" />
				</linearGradient>
				<linearGradient id={`brand-glass-${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop stopColor="var(--color-brand)" stopOpacity="0.4" />
					<stop offset="1" stopColor="var(--color-brand)" stopOpacity="0.0" />
				</linearGradient>
				<linearGradient id={`grid-fade-${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.2" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0" />
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

			{/* Sub-grid for ultra-high-precision aesthetic */}
			<g stroke={`url(#grid-fade-${id})`} strokeWidth="0.25">
				{[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pos) => (
					<path key={`v-${pos}`} d={`M${pos} 10 L${pos} 90`} />
				))}
				{[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pos) => (
					<path key={`h-${pos}`} d={`M10 ${pos} L90 ${pos}`} />
				))}
			</g>

			{/* Base Axis & Container */}
			<rect
				x="5"
				y="5"
				width="90"
				height="90"
				rx="8"
				fill="currentColor"
				fillOpacity="0.02"
				stroke="currentColor"
				strokeWidth="0.5"
				className="text-muted-foreground/30"
			/>
			<path
				d="M15 85 L85 85"
				stroke="currentColor"
				strokeWidth="0.5"
				className="text-muted-foreground/50"
			/>

			{/* Pillar 1: Pipeline */}
			<motion.g
				variants={{
					idle: { y: 0 },
					hover: {
						y: -5,
						transition: {
							type: "spring",
							stiffness: 200,
							damping: 20,
							delay: 0.1,
						},
					},
				}}
			>
				<rect
					x="20"
					y="50"
					width="14"
					height="35"
					rx="3"
					fill={`url(#glass-panel-${id})`}
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/40"
				/>
				<path
					d="M22 53 L32 53"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/30"
				/>
			</motion.g>

			{/* Pillar 2: Best Case */}
			<motion.g
				variants={{
					idle: { y: 0 },
					hover: {
						y: -10,
						transition: {
							type: "spring",
							stiffness: 200,
							damping: 20,
							delay: 0.2,
						},
					},
				}}
			>
				<rect
					x="43"
					y="40"
					width="14"
					height="45"
					rx="3"
					fill={`url(#glass-panel-${id})`}
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/40"
				/>
				<path
					d="M45 43 L55 43"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/30"
				/>
			</motion.g>

			{/* Pillar 3: Commit (Brand glowing) */}
			<motion.g
				variants={{
					idle: { y: 0, opacity: 0.8 },
					hover: {
						y: -15,
						opacity: 1,
						transition: {
							type: "spring",
							stiffness: 200,
							damping: 20,
							delay: 0.3,
						},
					},
				}}
			>
				{/* Glass Background */}
				<rect
					x="66"
					y="25"
					width="14"
					height="60"
					rx="3"
					fill={`url(#brand-glass-${id})`}
				/>

				{/* Hard illuminated border */}
				<motion.rect
					x="66"
					y="25"
					width="14"
					height="60"
					rx="3"
					fill="none"
					stroke="var(--color-brand)"
					strokeWidth="1"
					variants={{
						idle: { strokeOpacity: 0.3 },
						hover: { strokeOpacity: 1, transition: { duration: 0.5 } },
					}}
				/>

				{/* The Core value line inside the pillar */}
				<motion.path
					d="M68 28 L78 28"
					stroke="var(--color-brand)"
					strokeWidth="1"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { opacity: 0 },
						hover: { opacity: 1, transition: { duration: 0.4, delay: 0.5 } },
					}}
				/>
			</motion.g>

			{/* The Confidence Interval Curve (Trendline) */}
			<motion.path
				d="M27 48 C 38 48 40 38 50 38 C 60 38 65 25 73 25"
				stroke="var(--color-brand)"
				strokeWidth="1.5"
				fill="none"
				strokeLinecap="round"
				filter={`url(#super-bloom-${id})`}
				variants={{
					idle: { pathLength: 0, opacity: 0 },
					hover: {
						pathLength: 1,
						opacity: 1,
						transition: {
							duration: 1.2,
							delay: 0.5,
							type: "spring",
							bounce: 0,
						},
					},
				}}
			/>

			{/* Tooltip / Data Node hovering over the commit */}
			<motion.g
				variants={{
					idle: { y: 0, opacity: 0, scale: 0.8 },
					hover: {
						y: -15,
						opacity: 1,
						scale: 1,
						transition: {
							type: "spring",
							stiffness: 300,
							damping: 25,
							delay: 0.8,
						},
					},
				}}
			>
				<rect
					x="58"
					y="10"
					width="30"
					height="12"
					rx="6"
					fill="var(--background)"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/50"
				/>
				{/* Text representation inside tooltip */}
				<circle
					cx="63"
					cy="16"
					r="2"
					fill="var(--color-brand)"
					filter={`url(#super-bloom-${id})`}
				/>
				<path
					d="M68 15 L82 15"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					className="text-foreground"
				/>
				<path
					d="M68 18 L76 18"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="round"
					className="text-muted-foreground"
				/>
			</motion.g>

			{/* Global Texture overlay for the ultimate Apple Pro feel */}
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
