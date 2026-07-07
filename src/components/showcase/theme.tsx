import { Moon, Sun } from "lucide-react";

export const THEME_STORAGE_KEY = "installer-ui-theme";

/**
 * Runs before hydration (inlined in <head>) so the `dark` class is on
 * <html> before first paint — no theme flash. Falls back to the OS
 * preference when nothing is stored.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
	THEME_STORAGE_KEY,
)});var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

/**
 * Flips the `dark` class on <html> and persists the choice. The sun /
 * moon icons are swapped purely with CSS (`dark:` variants), so the
 * button renders identically on server and client — no hydration
 * mismatch, no mounted-state dance.
 */
export function ThemeToggle() {
	const toggle = () => {
		if (typeof document === "undefined") return;
		const dark = document.documentElement.classList.toggle("dark");
		try {
			localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
		} catch {
			// Storage unavailable — the toggle still works for the session.
		}
	};

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label="Toggle theme"
			title="Toggle theme"
			className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
		>
			<Sun className="size-4 dark:hidden" aria-hidden="true" />
			<Moon className="hidden size-4 dark:block" aria-hidden="true" />
		</button>
	);
}
