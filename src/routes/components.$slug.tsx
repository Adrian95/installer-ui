import { createFileRoute, notFound } from "@tanstack/react-router";

import { ComponentPage } from "#/components/showcase/component-page";
import { DEMOS } from "#/components/showcase/demos";
import type { RegistrySlug } from "#/components/showcase/registry";

export const Route = createFileRoute("/components/$slug")({
	// Only the slug crosses the loader boundary — it must stay
	// JSON-serializable for client hydration. The demo entry (which
	// holds React elements) is looked up in the component, never
	// returned from the loader.
	loader: ({ params }) => {
		if (!(params.slug in DEMOS)) throw notFound();
		return { slug: params.slug as RegistrySlug };
	},
	component: ComponentRoute,
	notFoundComponent: NotFound,
});

function ComponentRoute() {
	const { slug } = Route.useLoaderData();
	const entry = DEMOS[slug];
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
