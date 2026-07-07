import { createFileRoute } from "@tanstack/react-router";

import { ComponentsGrid } from "#/components/showcase/registry";
import { SiteFooter, SiteHeader } from "#/components/showcase/site-shell";

export const Route = createFileRoute("/components/")({ component: Components });

function Components() {
	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<SiteHeader />
			<main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-14">
				<header className="fade-up">
					<p className="type-kicker text-muted-foreground">Components</p>
					<h1 className="type-display mt-4 text-4xl text-foreground sm:text-5xl">
						The library
					</h1>
					<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
						Ten self-contained components — animated marks, qualification
						meters, and full-bleed scenes. Every one installs through the shadcn
						registry or copies straight out of the source.
					</p>
				</header>
				<div className="mt-12">
					<ComponentsGrid />
				</div>
			</main>
			<SiteFooter />
		</div>
	);
}
