import { motion } from "motion/react";
import { useId } from "react";

export function CatalystIllustration({ className }: { className?: string }) {
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
				<linearGradient id={`ai-core-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="var(--color-brand)" stopOpacity="0.2" />
					<stop offset="1" stopColor="var(--color-brand)" stopOpacity="0.02" />
				</linearGradient>
				<linearGradient id={`glass-field-${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop stopColor="currentColor" stopOpacity="0.08" />
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
				{/* Background Tech UI grid */}
				<path
					d="M40 10 L40 90 M60 10 L60 90"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeDasharray="1 3"
					className="text-muted-foreground/10"
				/>

				{/* LEFT: AI Core (Hexagon) */}
				<motion.g
					style={{ originX: "25px", originY: "50px" }}
					variants={{
						idle: { rotate: 0 },
						hover: {
							rotate: 90,
							transition: { type: "spring", stiffness: 60, damping: 20 },
						},
					}}
				>
					<polygon
						points="25,30 40,40 40,60 25,70 10,60 10,40"
						fill={`url(#ai-core-${id})`}
						stroke="var(--color-brand)"
						strokeWidth="0.5"
						strokeOpacity="0.5"
					/>
					<circle
						cx="25"
						cy="50"
						r="10"
						fill="currentColor"
						fillOpacity="0.05"
						stroke="var(--color-brand)"
						strokeWidth="0.5"
						strokeOpacity="0.3"
					/>
					<circle
						cx="25"
						cy="50"
						r="3"
						fill="var(--color-brand)"
						filter={`url(#super-bloom-${id})`}
					/>

					{/* Pulsing ring inside core */}
					<motion.circle
						cx="25"
						cy="50"
						r="8"
						stroke="var(--color-brand)"
						strokeWidth="1"
						fill="none"
						filter={`url(#super-bloom-${id})`}
						variants={{
							idle: { scale: 0.5, opacity: 0 },
							hover: {
								scale: 1.5,
								opacity: [0, 0.5, 0],
								transition: {
									duration: 1.5,
									repeat: Infinity,
									ease: "easeOut",
									delay: 0.2,
								},
							},
						}}
					/>
				</motion.g>

				{/* The Data Path */}
				<path
					d="M40 50 C 50 50 50 35 60 35"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeDasharray="2 2"
					fill="none"
					className="text-muted-foreground/20"
				/>
				<path
					d="M40 50 C 50 50 50 65 60 65"
					stroke="currentColor"
					strokeWidth="0.5"
					strokeDasharray="2 2"
					fill="none"
					className="text-muted-foreground/20"
				/>

				{/* The Travelling Data Packet 1 */}
				<motion.circle
					cx="0"
					cy="0"
					r="2.5"
					fill="var(--color-brand)"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { x: 40, y: 50, opacity: 0 },
						hover: {
							opacity: [0, 1, 1, 0],
							x: [40, 50, 50, 60],
							y: [50, 50, 35, 35],
							transition: { duration: 0.8, ease: "easeInOut", delay: 0.3 },
						},
					}}
				/>

				{/* The Travelling Data Packet 2 */}
				<motion.circle
					cx="0"
					cy="0"
					r="2.5"
					fill="var(--color-brand)"
					filter={`url(#super-bloom-${id})`}
					variants={{
						idle: { x: 40, y: 50, opacity: 0 },
						hover: {
							opacity: [0, 1, 1, 0],
							x: [40, 50, 50, 60],
							y: [50, 50, 65, 65],
							transition: { duration: 0.8, ease: "easeInOut", delay: 0.5 },
						},
					}}
				/>

				{/* RIGHT: CRM UI Fields */}

				{/* Field 1 */}
				<g transform="translate(60, 28)">
					<rect
						width="25"
						height="14"
						rx="2"
						fill={`url(#glass-field-${id})`}
						stroke="currentColor"
						strokeWidth="0.5"
						className="text-muted-foreground/30"
					/>
					<path
						d="M5 7 L12 7"
						stroke="currentColor"
						strokeWidth="1"
						className="text-muted-foreground/50"
					/>

					{/* Update State */}
					<motion.rect
						width="25"
						height="14"
						rx="2"
						fill="none"
						stroke="var(--color-brand)"
						strokeWidth="1"
						variants={{
							idle: { opacity: 0 },
							hover: { opacity: 1, transition: { duration: 0.2, delay: 1.1 } },
						}}
					/>
					<motion.path
						d="M15 7 L20 7"
						stroke="var(--color-brand)"
						strokeWidth="1.5"
						filter={`url(#super-bloom-${id})`}
						variants={{
							idle: { pathLength: 0, opacity: 0 },
							hover: {
								pathLength: 1,
								opacity: 1,
								transition: { duration: 0.3, delay: 1.1 },
							},
						}}
					/>
				</g>

				{/* Field 2 */}
				<g transform="translate(60, 58)">
					<rect
						width="25"
						height="14"
						rx="2"
						fill={`url(#glass-field-${id})`}
						stroke="currentColor"
						strokeWidth="0.5"
						className="text-muted-foreground/30"
					/>
					<path
						d="M5 7 L10 7"
						stroke="currentColor"
						strokeWidth="1"
						className="text-muted-foreground/50"
					/>

					{/* Update State */}
					<motion.rect
						width="25"
						height="14"
						rx="2"
						fill="none"
						stroke="var(--color-brand)"
						strokeWidth="1"
						variants={{
							idle: { opacity: 0 },
							hover: { opacity: 1, transition: { duration: 0.2, delay: 1.3 } },
						}}
					/>
					<motion.path
						d="M13 7 L20 7"
						stroke="var(--color-brand)"
						strokeWidth="1.5"
						filter={`url(#super-bloom-${id})`}
						variants={{
							idle: { pathLength: 0, opacity: 0 },
							hover: {
								pathLength: 1,
								opacity: 1,
								transition: { duration: 0.3, delay: 1.3 },
							},
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
