import { Link } from "@tanstack/react-router";

import { InstallerLogomark } from "#/components/installer/installer-logomark";
import { ThemeToggle } from "#/components/showcase/theme";
import { cn } from "#/lib/utils";

export const GITHUB_URL = "https://github.com/Adrian95/installer-ui";
export const REGISTRY_BASE_URL = "https://installer-ui.vercel.app/r";

export function GitHubIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
		</svg>
	);
}

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
			<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
				<Link
					to="/"
					className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
				>
					<InstallerLogomark play={false} className="size-6" />
					<span className="brand-wordmark text-[15px] leading-none tracking-tight">
						Installer <span className="text-muted-foreground">UI</span>
					</span>
				</Link>
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
	);
}

export function SiteFooter({ className }: { className?: string }) {
	return (
		<footer className={cn("border-t border-border", className)}>
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<p className="max-w-md">
					Code is MIT-licensed. The Installer logomark and brand assets remain
					the property of Installer.com.
				</p>
				<p className="shrink-0">
					Built by{" "}
					<a
						href="https://installer.com"
						target="_blank"
						rel="noreferrer"
						className="font-medium text-foreground transition-colors hover:text-[var(--color-brand)]"
					>
						Installer
					</a>
				</p>
			</div>
		</footer>
	);
}
