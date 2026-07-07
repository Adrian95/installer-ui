import { ArrowRight } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { BrandButton } from "#/components/installer/brand-button";
import { InstallerLogomark } from "#/components/installer/installer-logomark";
import { Marquee } from "#/components/installer/marquee";
import { ComponentsGrid } from "#/components/showcase/registry";
import {
	GITHUB_URL,
	GitHubIcon,
	SiteFooter,
} from "#/components/showcase/site-shell";
import { ThemeToggle } from "#/components/showcase/theme";

export const Route = createFileRoute("/")({ component: Home });

const MARQUEE_WORDS = [
	"Select",
	"Combobox",
	"Dropdown menu",
	"Calendar",
	"Date picker",
	"Chips input",
	"Segmented control",
	"Tabs",
	"Toast",
	"Score ring",
	"Segment meter",
	"Confidence meter",
	"Marquee",
	"Brand button",
	"Animated number",
	"Logomark",
] as const;

function Home() {
	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<header className="sticky top-0 z-40 border-b border-transparent">
				<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
					<span className="flex items-center gap-2.5">
						<InstallerLogomark play={false} className="size-6" />
						<span className="brand-wordmark text-[15px] leading-none tracking-tight">
							Installer <span className="text-muted-foreground">UI</span>
						</span>
					</span>
					<nav className="flex items-center gap-1" aria-label="Site">
						<Link
							to="/components"
							className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Components
						</Link>
						<Link
							to="/theming"
							className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							Theming
						</Link>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub repository"
							title="GitHub"
							className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							<GitHubIcon className="size-4" />
						</a>
						<ThemeToggle />
					</nav>
				</div>
			</header>

			{/* ── Hero ─────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden border-b border-border">
				{/* Ambient brand glow */}
				<div
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-[-30%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-brand)_9%,transparent)_0%,transparent_65%)] blur-3xl"
				/>
				<div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-28">
					<InstallerLogomark
						title="Installer UI"
						className="h-16 w-16 sm:h-20 sm:w-20"
					/>
					<p className="mt-8 type-kicker text-muted-foreground">
						installer.com · design system
					</p>
					<h1 className="mt-4 type-display text-balance text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02]">
						Delightful components,
						<br />
						<span className="brand-text">ready to take.</span>
					</h1>
					<p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
						Inputs and controls on Base UI, animated brand marks, and data
						meters — lifted from Installer's internal tools, cleaned up, and
						free to copy or install through the shadcn registry.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<BrandButton href="/components" variant="solid">
							Browse components
							<ArrowRight weight="bold" className="size-4" />
						</BrandButton>
						<BrandButton href={GITHUB_URL} target="_blank" rel="noreferrer">
							<GitHubIcon className="size-4" />
							GitHub
						</BrandButton>
					</div>
				</div>

				<div className="relative border-t border-border/60 py-4">
					<Marquee durationSec={38} className="text-muted-foreground/70">
						{MARQUEE_WORDS.map((word) => (
							<span
								key={word}
								className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em]"
							>
								{word}
								<span className="inline-block size-1 rounded-full bg-[var(--color-brand)] opacity-60" />
							</span>
						))}
					</Marquee>
				</div>
			</section>

			{/* ── Components ───────────────────────────────────────────── */}
			<main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-16">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="type-kicker text-muted-foreground">The library</p>
						<h2 className="type-display mt-3 text-3xl sm:text-4xl">
							Nineteen components.
						</h2>
					</div>
					<Link
						to="/components"
						className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-[var(--color-brand)]"
					>
						All components
						<ArrowRight
							weight="bold"
							className="size-3.5 transition-transform group-hover:translate-x-0.5"
						/>
					</Link>
				</div>
				<div className="mt-8">
					<ComponentsGrid />
				</div>
			</main>

			<SiteFooter />
		</div>
	);
}
