import { createFileRoute } from "@tanstack/react-router";

import { CodeBlock } from "#/components/showcase/code-block";
import {
	REGISTRY_BASE_URL,
	SiteFooter,
	SiteHeader,
} from "#/components/showcase/site-shell";

export const Route = createFileRoute("/theming")({ component: Theming });

const CORE_TOKENS: { name: string; cssVar: string }[] = [
	{ name: "brand", cssVar: "--color-brand" },
	{ name: "brand-light", cssVar: "--color-brand-light" },
	{ name: "background", cssVar: "--background" },
	{ name: "foreground", cssVar: "--foreground" },
	{ name: "card", cssVar: "--card" },
	{ name: "muted", cssVar: "--muted" },
	{ name: "muted-foreground", cssVar: "--muted-foreground" },
	{ name: "accent", cssVar: "--accent" },
	{ name: "border", cssVar: "--border" },
	{ name: "primary", cssVar: "--primary" },
	{ name: "destructive", cssVar: "--destructive" },
	{ name: "ring", cssVar: "--ring" },
];

const EDIT_SNIPPET = `:root {
  --color-brand: #00CC33;   /* ← your brand; the system re-tints */
  --radius: 0.625rem;
  --background: #FAFAFA;
  --foreground: #333333;
  --border: #E0E0E0;
  --muted-foreground: #8A8A8A;
  /* …the rest of the neutral palette… */
}

.dark {
  --background: #111111;
  --foreground: #E8E8E8;
  --border: #2A2A2A;
  /* …dark overrides… */
}`;

function Theming() {
	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<SiteHeader />
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-24 pt-14">
				<header className="fade-up">
					<p className="type-kicker text-muted-foreground">Theming</p>
					<h1 className="type-display mt-4 text-4xl text-foreground sm:text-5xl">
						You own the styling.
					</h1>
					<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
						Every component is styled with plain CSS variables — no config
						object, no build step, no lock-in. Install the theme (or any
						component, which pulls it in) and the tokens land in your{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-[13px]">
							globals.css
						</code>
						, under <code>:root</code> and <code>.dark</code>, where you edit
						them freely.
					</p>
				</header>

				<section className="mt-14">
					<h2 className="type-kicker text-muted-foreground">
						Install the theme
					</h2>
					<div className="mt-4">
						<CodeBlock
							code={`npx shadcn@latest add ${REGISTRY_BASE_URL}/theme.json`}
						/>
					</div>
					<p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
						Installing any token-using component adds this automatically via{" "}
						<code>registryDependencies</code>, so you rarely need to run it
						yourself.
					</p>
				</section>

				<section className="mt-14">
					<h2 className="type-kicker text-muted-foreground">Core tokens</h2>
					<div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
						{CORE_TOKENS.map((token) => (
							<div
								key={token.cssVar}
								className="flex items-center gap-3 bg-card p-4"
							>
								<span
									className="size-8 shrink-0 rounded-md border border-border/60"
									style={{ background: `var(${token.cssVar})` }}
								/>
								<span className="min-w-0">
									<span className="block truncate font-mono text-[12px] text-foreground">
										{token.name}
									</span>
									<span className="block truncate font-mono text-[11px] text-muted-foreground">
										{token.cssVar}
									</span>
								</span>
							</div>
						))}
					</div>
					<p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
						Swatches read live from the variables on this page — toggle the
						theme in the header and watch them change.
					</p>
				</section>

				<section className="mt-14">
					<h2 className="type-kicker text-muted-foreground">Make it yours</h2>
					<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
						Change one line and the whole system follows — buttons, rings, focus
						states, meters, the lot key off the same variables.
					</p>
					<div className="mt-4">
						<CodeBlock code={EDIT_SNIPPET} />
					</div>
				</section>

				<section className="mt-14">
					<h2 className="type-kicker text-muted-foreground">
						No assets needed
					</h2>
					<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
						You don't need to add any fonts or files. The UI type stack falls
						back to Geist → system-ui and the display stack to Geist → Inter →
						system-ui, so components look right out of the box. The Interstaller
						display face used on this showcase is an Installer brand asset and
						is not distributed with the components.
					</p>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
