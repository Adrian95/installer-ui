import { createFileRoute, notFound } from "@tanstack/react-router";

import { ComponentPage } from "#/components/showcase/component-page";
import { DEMOS, type DemoEntry } from "#/components/showcase/demos";
import type { RegistrySlug } from "#/components/showcase/registry";

export const Route = createFileRoute("/components/$slug")({
	loader: ({ params }) => {
		const entry = DEMOS[params.slug as RegistrySlug] as DemoEntry | undefined;
		if (!entry) throw notFound();
		return { slug: params.slug as RegistrySlug, entry };
	},
	component: ComponentRoute,
	notFoundComponent: NotFound,
});

function ComponentRoute() {
	const { slug, entry } = Route.useLoaderData();
	return (
		<ComponentPage
			slug={slug}
			title={entry.title}
			lede={entry.lede}
			source={entry.source}
			sourceFile={entry.sourceFile}
			propRows={entry.propRows}
		>
			{entry.demo}
		</ComponentPage>
	);
}

function NotFound() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
			<p className="type-kicker text-muted-foreground">404</p>
			<h1 className="type-display text-3xl">No such component</h1>
			<a
				href="/components"
				className="text-[13px] font-medium text-[var(--color-brand)] hover:underline"
			>
				Back to all components
			</a>
		</div>
	);
}
