/**
 * Tooltip built on Base UI (@base-ui-components/react), exposing the
 * familiar shadcn API surface: Tooltip / TooltipTrigger /
 * TooltipContent / TooltipProvider.
 */
import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip";
import type * as React from "react";

import { cn } from "#/lib/utils";

function TooltipProvider({
	delayDuration = 150,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider> & {
	delayDuration?: number;
}) {
	return <TooltipPrimitive.Provider delay={delayDuration} {...props} />;
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger({
	asChild,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger> & {
	asChild?: boolean;
}) {
	if (asChild) {
		return (
			<TooltipPrimitive.Trigger
				render={children as React.ReactElement<Record<string, unknown>>}
				{...props}
			/>
		);
	}
	return (
		<TooltipPrimitive.Trigger {...props}>{children}</TooltipPrimitive.Trigger>
	);
}

function TooltipContent({
	className,
	side = "top",
	sideOffset = 6,
	align = "center",
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	align?: "start" | "center" | "end";
}) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
			>
				<TooltipPrimitive.Popup
					className={cn(
						"z-50 max-w-xs rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
						"data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
						"data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
						"transition-[transform,opacity] duration-150",
						className,
					)}
					{...props}
				>
					{children}
				</TooltipPrimitive.Popup>
			</TooltipPrimitive.Positioner>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
