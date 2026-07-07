import { motion } from "motion/react";
import { useId } from "react";

export function AscentIllustration({ className }: { className?: string }) {
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
				<linearGradient id={`glass-quote-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.1" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.02" />
				</linearGradient>
				<linearGradient id={`glass-quote-bg-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.04" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.01" />
				</linearGradient>
				<filter id={`noise-${id}`}>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
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
				{/* Background Grid */}
				<path
					d="M20 10 L20 90 M80 10 L80 90 M10 20 L90 20 M10 80 L90 80"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeDasharray="1 4"
					className="text-muted-foreground/10"
				/>

				{/* Version History Stack (Background Card) */}
				<motion.g
					variants={{
						idle: { x: 0, y: 0, rotate: 0 },
						hover: {
							x: 5,
							y: -5,
							rotate: 2,
							transition: { type: "spring", stiffness: 100, damping: 20 },
						},
					}}
				>
					<rect
						x="25"
						y="15"
						width="45"
						height="60"
						rx="4"
						fill={`url(#glass-quote-bg-${id})`}
						stroke="currentColor"
						strokeWidth="0.5"
						className="text-muted-foreground/20"
					/>
				</motion.g>

				{/* Primary Quote Document */}
				<motion.g
					variants={{
						idle: { x: 0, y: 0 },
						hover: {
							x: -5,
							y: 5,
							transition: { type: "spring", stiffness: 100, damping: 20 },
						},
					}}
				>
					<rect
						x="25"
						y="15"
						width="45"
						height="60"
						rx="4"
						fill={`url(#glass-quote-${id})`}
						stroke="currentColor"
						strokeWidth="0.5"
						className="text-muted-foreground/40"
					/>

					{/* Header */}
					<path
						d="M32 25 L45 25 M32 29 L40 29"
						stroke="currentColor"
						strokeWidth="1"
						className="text-muted-foreground/50"
					/>

					{/* Line Items */}
					<rect
						x="30"
						y="38"
						width="35"
						height="6"
						rx="1"
						fill="currentColor"
						fillOpacity="0.05"
						stroke="currentColor"
						strokeWidth="0.5"
						className="text-muted-foreground/20"
					/>
					<path
						d="M32 41 L42 41 M55 41 L62 41"
						stroke="currentColor"
						strokeWidth="0.5"
						className="text-muted-foreground/40"
					/>

					{/* The Dynamic Line Item */}
					<motion.rect
						x="30"
						y="48"
						width="35"
						height="6"
						rx="1"
						variants={{
							idle: {
								fill: "currentColor",
								fillOpacity: 0.05,
								stroke: "currentColor",
								strokeOpacity: 0.2,
							},
							hover: {
								fill: "var(--color-brand)",
								fillOpacity: 0.1,
								stroke: "var(--color-brand)",
								strokeOpacity: 0.8,
								transition: { duration: 0.3, delay: 0.7 },
							},
						}}
						strokeWidth="0.5"
						className="text-muted-foreground/20"
					/>
					<motion.path
						d="M32 51 L45 51 M58 51 L62 51"
						strokeWidth="0.5"
						variants={{
							idle: { stroke: "currentColor", opacity: 0.5 },
							hover: {
								stroke: "var(--color-brand)",
								opacity: 1,
								filter: `url(#super-bloom-${id})`,
								transition: { duration: 0.3, delay: 0.7 },
							},
						}}
						className="text-muted-foreground"
					/>

					{/* Footer / Total */}
					<path
						d="M30 62 L65 62"
						stroke="currentColor"
						strokeWidth="0.5"
						strokeDasharray="1 2"
						className="text-muted-foreground/30"
					/>
					<motion.path
						d="M50 67 L65 67"
						strokeWidth="1.5"
						variants={{
							idle: { stroke: "currentColor", opacity: 0.5 },
							hover: {
								stroke: "var(--color-brand)",
								opacity: 1,
								filter: `url(#super-bloom-${id})`,
								transition: { duration: 0.3, delay: 0.9 },
							},
						}}
						className="text-foreground"
					/>
				</motion.g>

				{/* Collaborator Cursor (Apple Pro Style) */}
				<motion.g
					variants={{
						idle: { x: 75, y: 75, opacity: 0 },
						hover: {
							x: [75, 45, 42],
							y: [75, 55, 52],
							opacity: [0, 1, 1],
							transition: {
								x: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 },
								y: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 },
								opacity: { duration: 0.3, delay: 0.2 },
							},
						},
					}}
				>
					{/* The Pointer */}
					<path
						d="M0 0 L0 10 L3 7.5 L5 11.5 L6.5 11 L4.5 7 L8 6.5 Z"
						fill="var(--color-brand)"
						stroke="var(--background)"
						strokeWidth="1"
					/>

					{/* The Name Tag */}
					<rect
						x="8"
						y="8"
						width="22"
						height="6"
						rx="2"
						fill="var(--color-brand)"
					/>
					<path
						d="M11 11 L27 11"
						stroke="var(--background)"
						strokeWidth="0.5"
					/>
				</motion.g>

				{/* Hover Click Ripple */}
				<motion.circle
					cx="42"
					cy="52"
					r="8"
					stroke="var(--color-brand)"
					strokeWidth="0.5"
					fill="none"
					variants={{
						idle: { scale: 0, opacity: 0 },
						hover: {
							scale: 1.5,
							opacity: [0, 1, 0],
							transition: { duration: 0.5, delay: 0.6 },
						},
					}}
				/>
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
