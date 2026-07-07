import { useEffect, useState } from "react";
import { Toaster as SonnerToaster } from "sonner";

// Re-export sonner's imperative `toast()` function so consumers can do
// `import { Toaster, toast } from "#/components/installer/toast"` and never
// touch the `sonner` package directly.
export { toast } from "sonner";

function getResolvedTheme() {
	if (typeof document === "undefined") {
		return "light" as const;
	}

	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Toaster
 *
 * A themed wrapper around sonner's `<Toaster />`. Syncs to the `dark` class
 * on `<html>` via a MutationObserver (so it follows the same theme switch
 * as the rest of the app, including toggles that happen outside React),
 * plus the OS `prefers-color-scheme` and cross-tab `storage` changes.
 *
 * Mount once near the root of the app:
 *
 *   <Toaster />
 *
 * then anywhere:
 *
 *   import { toast } from "#/components/installer/toast";
 *   toast.success("Saved");
 */
export function Toaster() {
	const [theme, setTheme] = useState<"light" | "dark">(getResolvedTheme);

	useEffect(() => {
		const syncTheme = () => setTheme(getResolvedTheme());
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const observer = new MutationObserver(syncTheme);

		syncTheme();
		observer.observe(document.documentElement, {
			attributeFilter: ["class", "data-theme"],
			attributes: true,
		});
		mediaQuery.addEventListener("change", syncTheme);
		window.addEventListener("storage", syncTheme);

		return () => {
			observer.disconnect();
			mediaQuery.removeEventListener("change", syncTheme);
			window.removeEventListener("storage", syncTheme);
		};
	}, []);

	return (
		<SonnerToaster
			closeButton
			containerAriaLabel="Notifications"
			duration={4000}
			expand={false}
			gap={12}
			offset={20}
			position="bottom-right"
			richColors
			theme={theme}
			toastOptions={{
				classNames: {
					description: "text-muted-foreground",
					toast: "border border-border bg-card text-card-foreground shadow-lg",
				},
				duration: 4000,
			}}
			visibleToasts={4}
		/>
	);
}
