import { createFileRoute } from "@tanstack/react-router";

import { InstallerLoading } from "#/components/installer/installer-loading";

export const Route = createFileRoute("/demo/loading")({
	component: LoadingDemo,
});

function LoadingDemo() {
	return (
		<div className="h-svh w-full bg-background text-foreground">
			<InstallerLoading
				kicker="Loading workspace"
				message="Syncing your organization and session."
			/>
		</div>
	);
}
