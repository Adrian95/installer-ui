import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { HeroScene } from "#/components/installer/hero-scene";
import { InstallerLogomark } from "#/components/installer/installer-logomark";
import { ComponentsGrid } from "#/components/showcase/registry";
import {
	GITHUB_URL,
	GitHubIcon,
	SiteFooter,
} from "#/components/showcase/site-shell";
import { ThemeToggle } from "#/components/showcase/theme";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			{/* Floating header — the hero owns the backdrop, so the bar stays transparent. */}
			<header className="absolute inset-x-0 top-0 z-40">
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

			<div className="relative h-svh max-h-[900px] min-h-[640px]">
				<HeroScene
					primaryCta={{ label: "Browse components", href: "/components" }}
				/>
			</div>

			<main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
				<section className="border-t border-border pt-16">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="type-kicker text-muted-foreground">The library</p>
							<h2 className="type-display mt-3 text-3xl text-foreground sm:text-4xl">
								Ten components, lifted from the product.
							</h2>
							<p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
								The animated marks, meters, and scenes that run inside
								Installer's internal tools — cleaned up, self-contained, and
								free to take. Copy the file or install it through the shadcn
								registry.
							</p>
						</div>
						<Link
							to="/components"
							className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors hover:text-[var(--color-brand)]"
						>
							All components
							<ArrowRight
								className="size-3.5 transition-transform group-hover:translate-x-0.5"
								aria-hidden="true"
							/>
						</Link>
					</div>

					<div className="mt-8">
						<ComponentsGrid />
					</div>
				</section>
			</main>

			<SiteFooter />
		</div>
	);
}
