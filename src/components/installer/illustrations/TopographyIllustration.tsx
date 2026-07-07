import { motion } from "motion/react";
import { useId } from "react";

export function TopographyIllustration({ className }: { className?: string }) {
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
				<linearGradient id={`glass-card-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.08" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.01" />
				</linearGradient>
				<linearGradient id={`wire-${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.4" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.0" />
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
				{/* Background central wire */}
				<path
					d="M50 10 L50 90"
					stroke={`url(#wire-${id})`}
					strokeWidth="0.5"
					strokeDasharray="2 2"
				/>

				{/* 3D Glass Ledger Layers */}
				<motion.g
					variants={{
						idle: { y: -5 },
						hover: {
							y: 25,
							transition: { type: "spring", stiffness: 120, damping: 20 },
						},
					}}
				>
					{/* Bottom Layer (Oldest commit) */}
					<g transform="translate(0, 50)">
						<path
							d="M20 20 L50 30 L80 20 L50 10 Z"
							fill={`url(#glass-card-${id})`}
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/30"
						/>
						<path
							d="M50 10 L50 20 L65 15"
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/20"
						/>
						<circle
							cx="50"
							cy="20"
							r="1.5"
							fill="currentColor"
							className="text-muted-foreground/40"
						/>
					</g>
				</motion.g>

				<motion.g
					variants={{
						idle: { y: -5 },
						hover: {
							y: 10,
							transition: { type: "spring", stiffness: 120, damping: 20 },
						},
					}}
				>
					{/* Middle Layer */}
					<g transform="translate(0, 35)">
						<path
							d="M20 20 L50 30 L80 20 L50 10 Z"
							fill={`url(#glass-card-${id})`}
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/40"
						/>
						<path
							d="M50 10 L50 20 L35 15"
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/30"
						/>
						<circle
							cx="50"
							cy="20"
							r="1.5"
							fill="currentColor"
							className="text-muted-foreground/50"
						/>
					</g>
				</motion.g>

				{/* Top Layer (The New Immutable Commit) */}
				<motion.g
					variants={{
						idle: { y: -30, opacity: 0 },
						hover: {
							y: -10,
							opacity: 1,
							transition: {
								type: "spring",
								stiffness: 150,
								damping: 20,
								delay: 0.2,
							},
						},
					}}
				>
					<g transform="translate(0, 20)">
						<path
							d="M20 20 L50 30 L80 20 L50 10 Z"
							fill={`url(#glass-card-${id})`}
							stroke="var(--color-brand)"
							strokeWidth="0.5"
							strokeOpacity="0.5"
							className="text-foreground"
						/>

						{/* Data trace writing itself onto the glass */}
						<motion.path
							d="M50 10 L50 20 L65 25"
							stroke="var(--color-brand)"
							strokeWidth="1"
							filter={`url(#super-bloom-${id})`}
							variants={{
								idle: { pathLength: 0 },
								hover: {
									pathLength: 1,
									transition: { duration: 0.6, delay: 0.6, ease: "easeOut" },
								},
							}}
						/>

						{/* Glowing commit node */}
						<motion.circle
							cx="50"
							cy="20"
							r="2"
							fill="var(--color-brand)"
							filter={`url(#super-bloom-${id})`}
							variants={{
								idle: { scale: 0 },
								hover: {
									scale: 1,
									transition: {
										type: "spring",
										stiffness: 300,
										damping: 20,
										delay: 0.8,
									},
								},
							}}
						/>
					</g>
				</motion.g>

				{/* The Laser beam dropping down the central wire */}
				<motion.path
					d="M50 10 L50 40"
					stroke="var(--color-brand)"
					strokeWidth="1.5"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { pathLength: 0, opacity: 0 },
						hover: {
							pathLength: 1,
							opacity: 1,
							transition: { duration: 0.4, delay: 0.4, ease: "easeOut" },
						},
					}}
				/>

				{/* 3D Glass Ledger Layers */}
				<motion.g
					variants={{
						idle: { y: -5 },
						hover: {
							y: 20,
							transition: { type: "spring", stiffness: 120, damping: 20 },
						},
					}}
				>
					{/* Bottom Layer (Oldest commit) */}
					<g transform="translate(0, 50)">
						<path
							d="M20 20 L50 30 L80 20 L50 10 Z"
							fill={`url(#glass-card-${id})`}
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/30"
						/>
						<path
							d="M50 10 L50 20 L65 15"
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/20"
						/>
						<circle
							cx="50"
							cy="20"
							r="1.5"
							fill="currentColor"
							className="text-muted-foreground/40"
						/>
					</g>
				</motion.g>

				<motion.g
					variants={{
						idle: { y: -5 },
						hover: {
							y: 5,
							transition: { type: "spring", stiffness: 120, damping: 20 },
						},
					}}
				>
					{/* Middle Layer */}
					<g transform="translate(0, 35)">
						<path
							d="M20 20 L50 30 L80 20 L50 10 Z"
							fill={`url(#glass-card-${id})`}
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/40"
						/>
						<path
							d="M50 10 L50 20 L35 15"
							stroke="currentColor"
							strokeWidth="0.5"
							className="text-muted-foreground/30"
						/>
						<circle
							cx="50"
							cy="20"
							r="1.5"
							fill="currentColor"
							className="text-muted-foreground/50"
						/>
					</g>
				</motion.g>

				{/* Top Layer (The New Immutable Commit) */}
				<motion.g
					variants={{
						idle: { y: -20, opacity: 0 },
						hover: {
							y: -10,
							opacity: 1,
							transition: {
								type: "spring",
								stiffness: 150,
								damping: 20,
								delay: 0.2,
							},
						},
					}}
				>
					<g transform="translate(0, 20)">
						<path
							d="M20 20 L50 30 L80 20 L50 10 Z"
							fill={`url(#glass-card-${id})`}
							stroke="var(--color-brand)"
							strokeWidth="0.5"
							strokeOpacity="0.5"
							className="text-foreground"
						/>

						{/* Data trace writing itself onto the glass */}
						<motion.path
							d="M50 10 L50 20 L65 25"
							stroke="var(--color-brand)"
							strokeWidth="1"
							filter={`url(#super-bloom-${id})`}
							variants={{
								idle: { pathLength: 0 },
								hover: {
									pathLength: 1,
									transition: { duration: 0.6, delay: 0.6, ease: "easeOut" },
								},
							}}
						/>

						{/* Glowing commit node */}
						<motion.circle
							cx="50"
							cy="20"
							r="2"
							fill="var(--color-brand)"
							filter={`url(#super-bloom-${id})`}
							variants={{
								idle: { scale: 0 },
								hover: {
									scale: 1,
									transition: {
										type: "spring",
										stiffness: 300,
										damping: 20,
										delay: 0.8,
									},
								},
							}}
						/>
					</g>
				</motion.g>

				{/* The Laser beam dropping down the central wire */}
				<motion.path
					d="M50 10 L50 40"
					stroke="var(--color-brand)"
					strokeWidth="1.5"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { pathLength: 0, opacity: 0 },
						hover: {
							pathLength: 1,
							opacity: 1,
							transition: { duration: 0.4, delay: 0.4, ease: "easeOut" },
						},
					}}
				/>

				{/* Falling pulse particle */}
				<motion.circle
					cx="50"
					cy="10"
					r="1.5"
					fill="var(--background)"
					stroke="var(--color-brand)"
					strokeWidth="1"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { y: 0, opacity: 0 },
						hover: {
							y: 30,
							opacity: [0, 1, 0],
							transition: { duration: 0.6, delay: 0.4, ease: "linear" },
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
