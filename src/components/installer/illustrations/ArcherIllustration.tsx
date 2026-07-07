import { motion } from "motion/react";
import { useId } from "react";

export function ArcherIllustration({ className }: { className?: string }) {
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
				<linearGradient id={`grad-ring-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.4" />
					<stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
				</linearGradient>
				<linearGradient id={`brand-core-${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop stopColor="var(--color-brand)" stopOpacity="1" />
					<stop offset="1" stopColor="var(--color-brand)" stopOpacity="0.5" />
				</linearGradient>
				<filter id={`noise-${id}`}>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="1.2"
						numOctaves="2"
						stitchTiles="stitch"
					/>
					<feColorMatrix
						type="matrix"
						values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0"
					/>
				</filter>
			</defs>

			<g strokeLinecap="round" strokeLinejoin="round">
				{/* Background Conduit */}
				<path
					d="M10 50 L90 50"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeDasharray="1 3"
					className="text-muted-foreground/30"
				/>

				{/* The Core Hub */}
				<circle cx="50" cy="50" r="28" fill="var(--background)" />
				<circle
					cx="50"
					cy="50"
					r="28"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/20"
				/>
				<circle
					cx="50"
					cy="50"
					r="18"
					fill="currentColor"
					fillOpacity="0.02"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/10"
				/>

				{/* Outer Qualification Ring (Pain) */}
				<motion.g
					style={{ originX: "50px", originY: "50px" }}
					variants={{
						idle: { rotate: -45 },
						hover: {
							rotate: 0,
							transition: {
								type: "spring",
								stiffness: 150,
								damping: 15,
								delay: 0.1,
							},
						},
					}}
				>
					<path
						d="M50 22 A 28 28 0 1 1 22 50"
						stroke={`url(#grad-ring-${id})`}
						strokeWidth="1"
						fill="none"
					/>
					<path
						d="M50 20 L50 24 M78 50 L82 50"
						stroke="currentColor"
						strokeWidth="1"
						className="text-muted-foreground/50"
					/>
				</motion.g>

				{/* Middle Qualification Ring (Impact) */}
				<motion.g
					style={{ originX: "50px", originY: "50px" }}
					variants={{
						idle: { rotate: 90 },
						hover: {
							rotate: 0,
							transition: {
								type: "spring",
								stiffness: 150,
								damping: 15,
								delay: 0.2,
							},
						},
					}}
				>
					<path
						d="M50 32 A 18 18 0 1 1 32 50"
						stroke="currentColor"
						strokeWidth="1"
						className="text-muted-foreground/40"
						fill="none"
					/>
					<circle
						cx="68"
						cy="50"
						r="2"
						fill="currentColor"
						className="text-foreground"
					/>
				</motion.g>

				{/* Inner Qualification Ring (Critical Event) */}
				<motion.g
					style={{ originX: "50px", originY: "50px" }}
					variants={{
						idle: { rotate: -120 },
						hover: {
							rotate: 0,
							transition: {
								type: "spring",
								stiffness: 150,
								damping: 15,
								delay: 0.3,
							},
						},
					}}
				>
					<path
						d="M50 40 A 10 10 0 0 1 60 50"
						stroke="var(--color-brand)"
						strokeWidth="1"
						fill="none"
					/>
					<path
						d="M40 50 A 10 10 0 0 1 50 40"
						stroke="currentColor"
						strokeWidth="1"
						className="text-muted-foreground/30"
						fill="none"
					/>
				</motion.g>

				{/* The Core Ignition */}
				<circle
					cx="50"
					cy="50"
					r="4"
					fill="var(--background)"
					stroke="currentColor"
					strokeWidth="0.5"
					className="text-muted-foreground/40"
				/>

				<motion.circle
					cx="50"
					cy="50"
					r="2"
					fill={`url(#brand-core-${id})`}
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { scale: 0.5, opacity: 0.2 },
						hover: {
							scale: 1.5,
							opacity: 1,
							transition: {
								type: "spring",
								stiffness: 300,
								damping: 20,
								delay: 0.6,
							},
						},
					}}
				/>

				{/* The Pipeline Laser (Unlocks when rings align) */}
				<motion.path
					d="M50 50 L95 50"
					stroke="var(--color-brand)"
					strokeWidth="1.5"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { pathLength: 0, opacity: 0 },
						hover: {
							pathLength: 1,
							opacity: 1,
							transition: { duration: 0.5, ease: "easeOut", delay: 0.7 },
						},
					}}
				/>

				{/* Final stage node confirming success */}
				<motion.circle
					cx="90"
					cy="50"
					r="3"
					fill="var(--background)"
					stroke="var(--color-brand)"
					strokeWidth="1"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { scale: 0, opacity: 0 },
						hover: {
							scale: 1,
							opacity: 1,
							transition: {
								type: "spring",
								stiffness: 400,
								damping: 25,
								delay: 1.1,
							},
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
