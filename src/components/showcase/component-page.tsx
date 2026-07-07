import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { type ReactNode, useState } from "react";

import { CodeBlock } from "#/components/showcase/code-block";
import { REGISTRY, type RegistrySlug } from "#/components/showcase/registry";
import {
	REGISTRY_BASE_URL,
	SiteFooter,
	SiteHeader,
} from "#/components/showcase/site-shell";
import { cn } from "#/lib/utils";

// ── Building blocks ───────────────────────────────────────────────────────

export function Section({
	title,
	hint,
	children,
}: {
	title: string;
	hint?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="mt-16">
			<div className="flex items-baseline justify-between gap-4">
				<h2 className="type-kicker text-muted-foreground">{title}</h2>
				{hint ? (
					<span className="truncate font-mono text-[11px] text-muted-foreground/60">
						{hint}
					</span>
				) : null}
			</div>
			<div className="mt-4 space-y-4">{children}</div>
		</section>
	);
}

export function DemoSurface({
	children,
	className,
	label,
}: {
	children: ReactNode;
	className?: string;
	label?: ReactNode;
}) {
	return (
		<figure className="m-0">
			<div
				className={cn(
					"surface-card flex min-h-44 items-center justify-center rounded-lg border border-border bg-card px-6 py-12",
					className,
				)}
			>
				{children}
			</div>
			{label ? (
				<figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground/70">
					{label}
				</figcaption>
			) : null}
		</figure>
	);
}

export function Note({ children }: { children: ReactNode }) {
	return (
		<div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
			{children}
		</div>
	);
}

export const DEMO_BUTTON_CLASS =
	"inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-accent";

export function DemoButton({
	onClick,
	children,
	className,
}: {
	onClick: () => void;
	children: ReactNode;
	className?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(DEMO_BUTTON_CLASS, className)}
		>
			{children}
		</button>
	);
}

/** Remounts its render on demand so one-shot animations can replay. */
export function Replayer({
	render,
	label = "Replay",
}: {
	render: () => ReactNode;
	label?: string;
}) {
	const [generation, setGeneration] = useState(0);
	return (
		<div className="flex w-full flex-col items-center gap-8">
			<div key={generation} className="flex w-full items-center justify-center">
				{render()}
			</div>
			<DemoButton onClick={() => setGeneration((g) => g + 1)}>
				<RotateCcw className="size-3.5" aria-hidden="true" />
				{label}
			</DemoButton>
		</div>
	);
}

// ── Props table ───────────────────────────────────────────────────────────

export interface PropRow {
	name: string;
	type: string;
	defaultValue?: string;
	description: string;
}

export function PropsTable({ rows }: { rows: readonly PropRow[] }) {
	return (
		<div className="overflow-x-auto rounded-lg border border-border">
			<table className="w-full border-collapse text-left text-[13px]">
				<thead>
					<tr className="border-b border-border bg-muted/40">
						<th className="px-4 py-2.5 font-medium text-muted-foreground">
							Prop
						</th>
						<th className="px-4 py-2.5 font-medium text-muted-foreground">
							Type
						</th>
						<th className="px-4 py-2.5 font-medium text-muted-foreground">
							Default
						</th>
						<th className="px-4 py-2.5 font-medium text-muted-foreground">
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr
							key={row.name}
							className="border-b border-border align-top last:border-b-0"
						>
							<td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-foreground">
								{row.name}
							</td>
							<td className="px-4 py-3 font-mono text-xs text-muted-foreground">
								{row.type}
							</td>
							<td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
								{row.defaultValue ?? "—"}
							</td>
							<td className="min-w-56 px-4 py-3 leading-relaxed text-muted-foreground">
								{row.description}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ── Page layout ───────────────────────────────────────────────────────────

export function ComponentPage({
	slug,
	title,
	lede,
	source,
	sourceFile,
	propRows,
	children,
}: {
	slug: RegistrySlug;
	title: string;
	lede: string;
	source: string;
	sourceFile: string;
	propRows: readonly PropRow[];
	children: ReactNode;
}) {
	const index = REGISTRY.findIndex((entry) => entry.slug === slug);
	const prev = index > 0 ? REGISTRY[index - 1] : undefined;
	const next =
		index >= 0 && index < REGISTRY.length - 1 ? REGISTRY[index + 1] : undefined;

	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<SiteHeader />
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-14">
				<header className="fade-up">
					<p className="type-kicker text-muted-foreground">
						<Link
							to="/components"
							className="transition-colors hover:text-foreground"
						>
							Components
						</Link>
						<span className="mx-2 text-[var(--color-brand)]">·</span>
						{slug}
					</p>
					<h1 className="type-display mt-4 text-4xl text-foreground sm:text-5xl">
						{title}
					</h1>
					<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
						{lede}
					</p>
				</header>

				<Section title="Install" hint={`${REGISTRY_BASE_URL}/${slug}.json`}>
					<CodeBlock
						code={`npx shadcn@latest add ${REGISTRY_BASE_URL}/${slug}.json`}
					/>
				</Section>

				{children}

				<Section title="Props">
					<PropsTable rows={propRows} />
				</Section>

				<Section title="Source" hint={sourceFile}>
					<CodeBlock code={source} maxHeight={480} />
				</Section>

				<nav
					className="mt-20 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
					aria-label="Adjacent components"
				>
					{prev ? (
						<Link
							to="/components/$slug"
							params={{ slug: prev.slug }}
							className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
						>
							<span className="type-kicker text-muted-foreground">
								Previous
							</span>
							<span className="mt-1.5 block font-mono text-[13px] font-semibold text-foreground">
								{prev.name}
							</span>
						</Link>
					) : (
						<span aria-hidden="true" />
					)}
					{next ? (
						<Link
							to="/components/$slug"
							params={{ slug: next.slug }}
							className="group rounded-lg border border-border bg-card p-4 text-right transition-colors hover:bg-accent"
						>
							<span className="type-kicker text-muted-foreground">Next</span>
							<span className="mt-1.5 block font-mono text-[13px] font-semibold text-foreground">
								{next.name}
							</span>
						</Link>
					) : null}
				</nav>
			</main>
			<SiteFooter />
		</div>
	);
}
