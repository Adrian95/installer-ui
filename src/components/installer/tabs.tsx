import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useEffect, useId, useState } from "react";

import { cn } from "#/lib/utils";

// ─── Shared motion ─────────────────────────────────────

/** Snappy spring for layout animations (tab indicators, filter pills). */
const layoutSpring = {
	type: "spring" as const,
	stiffness: 500,
	damping: 30,
};

// ─── Types ─────────────────────────────────────────────

export interface TabItem {
	value: string;
	label: string;
	icon?: ReactNode;
	count?: number;
	/** Busy state for tab-local background work, e.g. a sync in progress. */
	busy?: boolean;
	content: ReactNode;
}

export interface TabsProps {
	tabs: TabItem[];
	value: string;
	onChange: (value: string) => void;
	isLoading?: boolean;
	/** Accessible label for the tablist. */
	"aria-label"?: string;
	className?: string;
}

// ─── Component ─────────────────────────────────────────

/**
 * Tabs
 *
 * Animated tab system with a layout-projected sliding underline (via
 * Framer/Motion `layoutId`) and crossfade panel transitions.
 *
 * Scoped per-instance: each mounted `Tabs` gets its own `useId()`-derived
 * `layoutId`, so multiple instances on the same page never fight over the
 * same layout projection.
 */
export function Tabs({
	tabs,
	value,
	onChange,
	isLoading = false,
	"aria-label": ariaLabel = "Tabs",
	className,
}: TabsProps) {
	const reduce = useReducedMotion();
	// Scoped per instance so two mounted copies (e.g. a desktop pane and a
	// hidden mobile pager) never share a layout projection — a shared id
	// would let one copy claim the projection and the other's indicator
	// would vanish.
	const instanceId = useId();
	// `mode="wait"` keeps the outgoing panel mounted during exit, so the
	// selected tab should track the panel that is actually visible.
	const [visibleValue, setVisibleValue] = useState(value);
	const activeContent = tabs.find((t) => t.value === value)?.content;
	const selectedContentId = `tabpanel-${instanceId}-${visibleValue}`;

	useEffect(() => {
		if (isLoading && visibleValue !== value) {
			setVisibleValue(value);
		}
	}, [isLoading, value, visibleValue]);

	useEffect(() => {
		if (!tabs.some((tab) => tab.value === visibleValue)) {
			setVisibleValue(value);
		}
	}, [tabs, value, visibleValue]);

	const handleExitComplete = useCallback(() => {
		setVisibleValue(value);
	}, [value]);

	return (
		<div className={className}>
			{isLoading ? (
				<TabsSkeleton />
			) : (
				<div className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
					<div
						className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						role="tablist"
						aria-label={ariaLabel}
					>
						{tabs.map((tab) => {
							const isSelected = visibleValue === tab.value;
							const isPendingTarget =
								value === tab.value && visibleValue !== value;
							const tabId = `tab-${instanceId}-${tab.value}`;
							return (
								<button
									key={tab.value}
									id={tabId}
									type="button"
									role="tab"
									aria-selected={isSelected}
									aria-controls={isSelected ? selectedContentId : undefined}
									aria-busy={tab.busy || undefined}
									tabIndex={isSelected ? 0 : -1}
									onClick={() => onChange(tab.value)}
									className={cn(
										"group relative inline-flex h-10 shrink-0 items-center gap-2 px-3 text-sm font-medium outline-none transition-colors duration-150",
										"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
										isSelected
											? "text-foreground"
											: isPendingTarget
												? "text-foreground/80"
												: "text-muted-foreground hover:text-foreground",
									)}
								>
									{tab.icon ? (
										<span className="inline-flex shrink-0 text-muted-foreground transition-colors group-hover:text-foreground [&_svg]:size-3.5">
											{tab.icon}
										</span>
									) : null}
									<span className="max-w-32 truncate">{tab.label}</span>
									{tab.busy ? <BusyDot /> : null}
									{tab.count !== undefined ? (
										<span
											className={cn(
												"rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums",
												isSelected
													? "bg-foreground/10 text-foreground"
													: "bg-muted text-muted-foreground",
											)}
										>
											{tab.count}
										</span>
									) : null}
									{isSelected ? (
										// Crisp 2px rule sitting exactly on the tab bar's border.
										// The layout-projected slide between tabs is the whole
										// gesture — no ornament on the indicator itself.
										<motion.div
											layoutId={`tabs-indicator-${instanceId}`}
											aria-hidden
											className="pointer-events-none absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-[var(--color-brand,currentColor)]"
											transition={reduce ? { duration: 0 } : layoutSpring}
										/>
									) : null}
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* ── Tab content ── */}
			<div className="pt-5">
				{isLoading ? (
					<TabsPanelSkeleton />
				) : (
					<AnimatePresence
						initial={false}
						mode="wait"
						onExitComplete={handleExitComplete}
					>
						<motion.div
							key={value}
							id={`tabpanel-${instanceId}-${value}`}
							role="tabpanel"
							aria-labelledby={`tab-${instanceId}-${value}`}
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
							transition={reduce ? { duration: 0 } : { duration: 0.15 }}
						>
							{activeContent}
						</motion.div>
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}

function BusyDot() {
	return (
		<span
			aria-hidden="true"
			className="relative inline-flex size-2 shrink-0 rounded-full bg-[var(--color-brand)]"
		>
			<span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-brand)] opacity-35" />
		</span>
	);
}

function TabsSkeleton() {
	return (
		<div className="border-b border-border/60">
			<div className="flex gap-1 overflow-hidden pb-px">
				{[0, 1, 2].map((index) => (
					<div key={index} className="flex h-10 min-w-24 items-center px-3">
						<div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
}

function TabsPanelSkeleton() {
	return (
		<div className="space-y-5">
			<div className="h-36 animate-pulse rounded-2xl bg-muted" />
			<div className="space-y-3">
				<div className="h-3 w-28 animate-pulse rounded bg-muted" />
				<div className="h-16 animate-pulse rounded-lg bg-muted/80" />
				<div className="h-16 animate-pulse rounded-lg bg-muted/80" />
			</div>
		</div>
	);
}
