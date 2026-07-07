import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { MotionConfig } from "motion/react";

import { THEME_INIT_SCRIPT } from "#/components/showcase/theme";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Installer UI — animated brand components" },
			{
				name: "description",
				content:
					"Animated brand components, meters, and scenes from Installer's internal tools. Copy-paste or install via the shadcn registry.",
			},
			{ name: "theme-color", content: "#00CC33" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				{/* Set the theme class before first paint to avoid a flash. */}
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, self-authored pre-hydration theme script. */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body>
				<MotionConfig reducedMotion="user">{children}</MotionConfig>
				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
