import {
	ArrowRight,
	Copy,
	DotsThreeVertical,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react";
import { type ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";

import { AnimatedNumber } from "#/components/installer/animated-number";
// Raw component sources, embedded at build time for the "Source" panel.
import animatedNumberSource from "#/components/installer/animated-number.tsx?raw";
import { BrandButton } from "#/components/installer/brand-button";
import brandButtonSource from "#/components/installer/brand-button.tsx?raw";
import { Calendar } from "#/components/installer/calendar";
import calendarSource from "#/components/installer/calendar.tsx?raw";
import { CatenaryArcs } from "#/components/installer/catenary-arcs";
import catenaryArcsSource from "#/components/installer/catenary-arcs.tsx?raw";
import { ChipsInput } from "#/components/installer/chips-input";
import chipsInputSource from "#/components/installer/chips-input.tsx?raw";
import { Combobox } from "#/components/installer/combobox";
import comboboxSource from "#/components/installer/combobox.tsx?raw";
import { ConfidenceMeter } from "#/components/installer/confidence-meter";
import confidenceMeterSource from "#/components/installer/confidence-meter.tsx?raw";
import { CopilotMark } from "#/components/installer/copilot-mark";
import copilotMarkSource from "#/components/installer/copilot-mark.tsx?raw";
import { DatePicker } from "#/components/installer/date-picker";
import datePickerSource from "#/components/installer/date-picker.tsx?raw";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/installer/dropdown-menu";
import dropdownMenuSource from "#/components/installer/dropdown-menu.tsx?raw";
import type { DropdownOption } from "#/components/installer/dropdown-primitives";
import { InstallerLoading } from "#/components/installer/installer-loading";
import installerLoadingSource from "#/components/installer/installer-loading.tsx?raw";
import { InstallerLogomark } from "#/components/installer/installer-logomark";
import installerLogomarkSource from "#/components/installer/installer-logomark.tsx?raw";
import { Marquee } from "#/components/installer/marquee";
import marqueeSource from "#/components/installer/marquee.tsx?raw";
import {
	ScoreRing,
	type ScoreRingState,
} from "#/components/installer/score-ring";
import scoreRingSource from "#/components/installer/score-ring.tsx?raw";
import {
	type MeterSegment,
	SegmentMeter,
} from "#/components/installer/segment-meter";
import segmentMeterSource from "#/components/installer/segment-meter.tsx?raw";
import {
	SegmentedControl,
	type SegmentedControlOption,
} from "#/components/installer/segmented-control";
import segmentedControlSource from "#/components/installer/segmented-control.tsx?raw";
import { Select } from "#/components/installer/select";
import selectSource from "#/components/installer/select.tsx?raw";
import { type TabItem, Tabs } from "#/components/installer/tabs";
import tabsSource from "#/components/installer/tabs.tsx?raw";
import { Toaster } from "#/components/installer/toast";
import toastSource from "#/components/installer/toast.tsx?raw";
import {
	DEMO_BUTTON_CLASS,
	DemoButton,
	DemoSurface,
	Note,
	type PropRow,
	Replayer,
	Section,
} from "#/components/showcase/component-page";
import type { RegistrySlug } from "#/components/showcase/registry";

export interface DemoEntry {
	title: string;
	lede: string;
	sourceFile: string;
	source: string;
	propRows: readonly PropRow[];
	demo: ReactNode;
}

// ── Shared demo data ────────────────────────────────────────────────────────

const usd = (value: number) =>
	value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

// ── Interactive demo widgets ────────────────────────────────────────────────

function AnimatedNumberDemo() {
	const [value, setValue] = useState(48200);
	return (
		<div className="flex flex-col items-center gap-6">
			<AnimatedNumber
				value={value}
				format={usd}
				className="type-display type-tabular text-5xl text-foreground"
			/>
			<DemoButton
				onClick={() =>
					setValue(12000 + (Math.round(value * 0.618 + 31337) % 90000))
				}
			>
				Change the number
			</DemoButton>
		</div>
	);
}

const MARQUEE_DEMO_WORDS = [
	"Installer",
	"Dispatch",
	"Routing",
	"CRM",
	"Pipeline",
	"Copilot",
] as const;

function MarqueeDemo() {
	return (
		<div className="w-full max-w-md">
			<Marquee gap="2.5rem">
				{MARQUEE_DEMO_WORDS.map((word) => (
					<span
						key={word}
						className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-1.5 text-[13px] font-medium text-foreground"
					>
						{word}
					</span>
				))}
			</Marquee>
		</div>
	);
}

function BrandButtonDemo() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<BrandButton variant="outline">Outline</BrandButton>
			<BrandButton variant="solid">
				Get started
				<ArrowRight weight="bold" className="size-3.5" />
			</BrandButton>
		</div>
	);
}

const SELECT_OPTIONS = [
	{ value: "new", label: "New" },
	{ value: "contacted", label: "Contacted" },
	{ value: "qualified", label: "Qualified", group: "Pipeline" },
	{ value: "proposal", label: "Proposal", group: "Pipeline" },
	{ value: "won", label: "Won", group: "Pipeline" },
] as const satisfies readonly DropdownOption<string>[];

function SelectDemo() {
	const [value, setValue] = useState<string | null>("qualified");
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="w-64">
				<Select
					value={value}
					onValueChange={setValue}
					options={SELECT_OPTIONS}
					placeholder="Pick a stage"
				/>
			</div>
			<DemoButton onClick={() => setValue(null)}>
				Clear (show placeholder)
			</DemoButton>
		</div>
	);
}

const COMBOBOX_ITEMS = [
	{ value: "amara", label: "Amara Chen" },
	{ value: "diego", label: "Diego Reyes" },
	{ value: "priya", label: "Priya Nair" },
	{ value: "jonas", label: "Jonas Weber" },
	{ value: "hana", label: "Hana Kobayashi" },
	{ value: "malik", label: "Malik Johnson" },
	{ value: "sofia", label: "Sofia Rossi" },
	{ value: "arjun", label: "Arjun Patel" },
] as const satisfies readonly DropdownOption<string>[];

function ComboboxDemo() {
	const [value, setValue] = useState<string | null>("diego");
	return (
		<div className="w-72">
			<Combobox
				value={value}
				onValueChange={setValue}
				items={COMBOBOX_ITEMS}
				placeholder="Owner"
				searchPlaceholder="Search people…"
				allowClear
			/>
		</div>
	);
}

function DropdownMenuDemo() {
	const [starred, setStarred] = useState(true);
	const [density, setDensity] = useState("comfortable");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={DEMO_BUTTON_CLASS}>
				<DotsThreeVertical weight="bold" className="size-4" />
				Actions
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Deal</DropdownMenuLabel>
				<DropdownMenuItem icon={<PencilSimple />} shortcut="⌘E">
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem icon={<Copy />} shortcut="⌘D">
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem
					checked={starred}
					onCheckedChange={setStarred}
				>
					Starred
				</DropdownMenuCheckboxItem>
				<DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
					<DropdownMenuRadioItem value="comfortable">
						Comfortable density
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="compact">
						Compact density
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" icon={<Trash />}>
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function CalendarDemo() {
	const [date, setDate] = useState<Date | undefined>(() => new Date());
	const startMonth = useMemo(() => {
		const now = new Date();
		return new Date(now.getFullYear() - 3, 0, 1);
	}, []);
	const endMonth = useMemo(() => {
		const now = new Date();
		return new Date(now.getFullYear() + 3, 11, 31);
	}, []);
	return (
		<div className="flex flex-col items-center gap-4">
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				captionLayout="dropdown"
				startMonth={startMonth}
				endMonth={endMonth}
			/>
			<p className="text-xs text-muted-foreground">
				{date
					? date.toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						})
					: "No date selected"}
			</p>
		</div>
	);
}

function DatePickerDemo() {
	const [value, setValue] = useState<Date | null>(() => new Date());
	return (
		<div className="flex flex-col items-center gap-6">
			<div className="w-56">
				<DatePicker
					value={value}
					onChange={setValue}
					placeholder="Close date"
				/>
			</div>
			<DatePicker
				value={value}
				onChange={setValue}
				variant="pill"
				placeholder="Due date"
			/>
		</div>
	);
}

function ChipsInputDemo() {
	const [tags, setTags] = useState<string[]>(["saas", "enterprise"]);
	return (
		<div className="w-72">
			<ChipsInput
				value={tags}
				onChange={setTags}
				placeholder="Add a tag…"
				aria-label="Tags"
			/>
		</div>
	);
}

const SEGMENTED_OPTIONS: SegmentedControlOption[] = [
	{ value: "day", label: "Day", hint: "Last 24 hours" },
	{ value: "week", label: "Week", hint: "Last 7 days" },
	{ value: "month", label: "Month", hint: "Last 30 days" },
];

function SegmentedControlDemo() {
	const [value, setValue] = useState("week");
	return (
		<SegmentedControl
			options={SEGMENTED_OPTIONS}
			value={value}
			onChange={setValue}
			aria-label="Timeframe"
		/>
	);
}

function TabsDemo() {
	const [value, setValue] = useState("overview");
	const tabs: TabItem[] = [
		{
			value: "overview",
			label: "Overview",
			content: (
				<p className="text-sm leading-relaxed text-muted-foreground">
					Deal summary, owner, and the next best action.
				</p>
			),
		},
		{
			value: "activity",
			label: "Activity",
			count: 6,
			content: (
				<p className="text-sm leading-relaxed text-muted-foreground">
					Six logged touches this week — two calls, three emails, one meeting.
				</p>
			),
		},
		{
			value: "notes",
			label: "Notes",
			content: (
				<p className="text-sm leading-relaxed text-muted-foreground">
					Internal notes, visible to the team only.
				</p>
			),
		},
	];
	return (
		<Tabs
			tabs={tabs}
			value={value}
			onChange={setValue}
			aria-label="Deal detail"
		/>
	);
}

function ToastDemo() {
	return (
		<div className="flex flex-col items-center gap-4">
			<Toaster />
			<div className="flex flex-wrap items-center justify-center gap-2">
				<DemoButton onClick={() => toast.success("Deal moved to Qualified")}>
					Success
				</DemoButton>
				<DemoButton onClick={() => toast.error("Could not save changes")}>
					Error
				</DemoButton>
				<DemoButton onClick={() => toast.message("Synced with HubSpot")}>
					Message
				</DemoButton>
			</div>
		</div>
	);
}

const SCORE_RING_STATES: {
	score: number;
	state: ScoreRingState;
	note: string;
}[] = [
	{ score: 0, state: "unknown", note: "unknown" },
	{ score: 24, state: "low", note: "low" },
	{ score: 58, state: "medium", note: "medium" },
	{ score: 87, state: "high", note: "high" },
];

const SEGMENT_METER_DEMO: MeterSegment[] = [
	{ key: "situation", label: "Situation", short: "S", value: 3 },
	{ key: "pain", label: "Pain", short: "P", value: 2 },
	{ key: "impact", label: "Impact", short: "I", value: 0 },
	{
		key: "critical",
		label: "Critical event",
		short: "C",
		value: 1,
		ghostTo: 3,
	},
	{ key: "decision", label: "Decision", short: "D", value: undefined },
];

function SegmentMeterDemo() {
	const [active, setActive] = useState<string | null>("pain");
	const [assessing, setAssessing] = useState(false);
	return (
		<div className="flex w-full flex-col items-center gap-8">
			<div className="w-full max-w-sm">
				<SegmentMeter
					segments={SEGMENT_METER_DEMO}
					activeKey={active}
					assessing={assessing}
					onSegmentClick={(key) =>
						setActive((cur) => (cur === key ? null : key))
					}
				/>
			</div>
			<div className="flex flex-wrap items-center justify-center gap-2">
				<DemoButton onClick={() => setActive(null)}>Clear active</DemoButton>
				<DemoButton onClick={() => setAssessing((a) => !a)}>
					{assessing ? "Stop assessing" : "Run assessment sweep"}
				</DemoButton>
			</div>
			<p className="text-xs text-muted-foreground">
				Click a segment to focus it. Impact reads a measured zero (red sliver);
				Critical event shows ghost potential to 3; Decision is unscored.
			</p>
		</div>
	);
}

function ConfidenceMeterDemo() {
	const [value, setValue] = useState(0.62);
	return (
		<div className="flex flex-col items-center gap-6">
			<ConfidenceMeter value={value} />
			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				value={value}
				aria-label="Confidence value"
				onChange={(e) => setValue(Number(e.target.value))}
				className="w-56 accent-[var(--color-brand)]"
			/>
		</div>
	);
}

// ── Registry of demos, keyed by slug ────────────────────────────────────────

export const DEMOS: Record<RegistrySlug, DemoEntry> = {
	"installer-logomark": {
		title: "Installer Logomark",
		lede: "The Installer glyph that draws itself on, then blooms into the brand gradient. A one-shot arrival moment for app boots, gated intros, and hero sections.",
		sourceFile: "components/installer/installer-logomark.tsx",
		source: installerLogomarkSource,
		propRows: [
			{
				name: "className",
				type: "string",
				description: "Sizing / color classes for the <svg>.",
			},
			{
				name: "play",
				type: "boolean",
				defaultValue: "true",
				description: "false renders the final filled state with no animation.",
			},
			{
				name: "drawDurationMs",
				type: "number",
				defaultValue: "1100",
				description: "Length of the stroke draw-on.",
			},
			{
				name: "title",
				type: "string",
				description: "Accessible name; when omitted the mark is aria-hidden.",
			},
		],
		demo: (
			<>
				<Section title="Draw-on">
					<DemoSurface label="Press replay to watch the draw-on + gradient bloom.">
						<Replayer
							render={() => (
								<InstallerLogomark
									title="Installer"
									className="h-28 w-28 text-foreground"
								/>
							)}
						/>
					</DemoSurface>
				</Section>
				<Section title="Static">
					<DemoSurface label="play={false} — the resting mark, no animation.">
						<InstallerLogomark play={false} className="h-20 w-20" />
					</DemoSurface>
				</Section>
			</>
		),
	},
	"installer-loading": {
		title: "Installer Loading",
		lede: "An indefinite wait state built from the logomark — a gradient comet endlessly traces the glyph while the fill breathes on the same clock. Pure CSS, zero dependencies.",
		sourceFile: "components/installer/installer-loading.tsx",
		source: installerLoadingSource,
		propRows: [
			{
				name: "kicker",
				type: "string",
				defaultValue: '"Loading"',
				description: "Short uppercase label under the mark.",
			},
			{
				name: "message",
				type: "string",
				description: "Optional supporting sentence.",
			},
			{
				name: "className",
				type: "string",
				description: "Extra classes on the root.",
			},
		],
		demo: (
			<Section title="Preview" hint="fills its container">
				<DemoSurface
					className="min-h-80 p-0"
					label={
						<>
							Drop it into any full-height container.{" "}
							<a
								href="/demo/loading"
								className="font-medium text-foreground underline decoration-border underline-offset-2 hover:text-[var(--color-brand)]"
							>
								Open full screen ↗
							</a>
						</>
					}
				>
					<div className="h-80 w-full">
						<InstallerLoading
							kicker="Loading workspace"
							message="Syncing your organization and session."
						/>
					</div>
				</DemoSurface>
			</Section>
		),
	},
	"copilot-mark": {
		title: "Copilot Mark",
		lede: "The logomark as a status indicator: flat and quiet at rest, tracing its own outline in the brand gradient while live. Sits inline next to copy at any size.",
		sourceFile: "components/installer/copilot-mark.tsx",
		source: copilotMarkSource,
		propRows: [
			{
				name: "live",
				type: "boolean",
				defaultValue: "false",
				description: "true animates the gradient trace.",
			},
			{
				name: "className",
				type: "string",
				description: "Sizing / color classes.",
			},
		],
		demo: (
			<Section title="Idle vs. live">
				<DemoSurface>
					<div className="flex items-center gap-12">
						<div className="flex flex-col items-center gap-3">
							<CopilotMark className="size-9 text-muted-foreground" />
							<span className="type-meta text-muted-foreground">Idle</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<CopilotMark live className="size-9" />
							<span className="type-meta text-muted-foreground">Live</span>
						</div>
					</div>
				</DemoSurface>
			</Section>
		),
	},
	"catenary-arcs": {
		title: "Catenary Arcs",
		lede: "Four nested catenary arches — the curve a chain makes hanging under its own weight — drawn outermost-first, the innermost carrying the brand gradient. A quiet ornament for empty states.",
		sourceFile: "components/installer/catenary-arcs.tsx",
		source: catenaryArcsSource,
		propRows: [
			{
				name: "className",
				type: "string",
				description: "Sizing / color classes.",
			},
			{
				name: "drawDurationMs",
				type: "number",
				defaultValue: "1200",
				description: "Length of the draw-on.",
			},
		],
		demo: (
			<Section title="Draw-on">
				<DemoSurface label="Outermost arch first; the innermost lands in the gradient.">
					<Replayer
						render={() => (
							<CatenaryArcs className="h-24 w-64 text-foreground" />
						)}
					/>
				</DemoSurface>
			</Section>
		),
	},
	marquee: {
		title: "Marquee",
		lede: "A seamless, infinitely scrolling strip. Children render twice into a track that loops with no visible seam, fading at the edges so content never pops in or out. Pauses on hover.",
		sourceFile: "components/installer/marquee.tsx",
		source: marqueeSource,
		propRows: [
			{
				name: "children",
				type: "ReactNode",
				description: "Content to repeat.",
			},
			{
				name: "durationSec",
				type: "number",
				defaultValue: "32",
				description: "Seconds for one full pass. Larger = slower.",
			},
			{
				name: "direction",
				type: '"left" | "right"',
				defaultValue: '"left"',
				description: "Scroll direction.",
			},
			{
				name: "pauseOnHover",
				type: "boolean",
				defaultValue: "true",
				description: "Pauses the track while the pointer is over it.",
			},
			{
				name: "fade",
				type: "boolean",
				defaultValue: "true",
				description: "Fades the leading and trailing edges.",
			},
			{
				name: "gap",
				type: "string",
				defaultValue: '"2rem"',
				description: "Space between repeated children.",
			},
		],
		demo: (
			<Section title="Hover to pause">
				<DemoSurface>
					<MarqueeDemo />
				</DemoSurface>
			</Section>
		),
	},
	"brand-button": {
		title: "Brand Button",
		lede: "A CTA with a gradient border that stays crisp on any surface, lifting and glowing brand-green on hover. Renders a <button> by default, or an <a> when href is set.",
		sourceFile: "components/installer/brand-button.tsx",
		source: brandButtonSource,
		propRows: [
			{
				name: "variant",
				type: '"outline" | "solid"',
				defaultValue: '"outline"',
				description:
					"Solid fills the pill; outline keeps the gradient as a border.",
			},
			{
				name: "href",
				type: "string",
				description: "Renders an <a> instead of a <button> when set.",
			},
			{
				name: "className",
				type: "string",
				description: "Extra classes.",
			},
		],
		demo: (
			<Section title="Outline & solid">
				<DemoSurface>
					<BrandButtonDemo />
				</DemoSurface>
			</Section>
		),
	},
	"animated-number": {
		title: "Animated Number",
		lede: "A tasteful numeric ease for figures that change — currency, scores, coverage. Bring your own formatter; it snaps instead of easing under reduced-motion.",
		sourceFile: "components/installer/animated-number.tsx",
		source: animatedNumberSource,
		propRows: [
			{
				name: "value",
				type: "number",
				description: "Target value to interpolate toward.",
			},
			{
				name: "format",
				type: "(n: number) => string",
				description: "Pure formatter — must be referentially stable.",
			},
			{ name: "className", type: "string", description: "Typography classes." },
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<AnimatedNumberDemo />
				</DemoSurface>
			</Section>
		),
	},
	select: {
		title: "Select",
		lede: "Commit one value from a known, small, stable set — stage, status, priority. Built on Base UI Select with a fully-wired, data-driven API. Non-searchable by design; reach for Combobox when the set is large or dynamic.",
		sourceFile: "components/installer/select.tsx",
		source: selectSource,
		propRows: [
			{
				name: "value",
				type: "TValue | null",
				description: "The committed value, or null to show the placeholder.",
			},
			{
				name: "onValueChange",
				type: "(value: TValue) => void",
				description: "Fires when a new option is committed.",
			},
			{
				name: "options",
				type: "DropdownOption<TValue>[]",
				description:
					"Consecutive options sharing a `group` render under one label.",
			},
			{
				name: "placeholder",
				type: "string",
				description: "Shown when value is null.",
			},
			{
				name: "intent",
				type: '"field" | "ghost" | "bare"',
				defaultValue: '"field"',
				description: "Trigger chrome — form row, toolbar chip, or unstyled.",
			},
			{
				name: "density",
				type: '"compact" | "comfortable"',
				defaultValue: '"comfortable"',
				description: "Row height in the popup.",
			},
		],
		demo: (
			<>
				<Section title="Interactive">
					<DemoSurface>
						<SelectDemo />
					</DemoSurface>
				</Section>
				<Note>
					Ships alongside <code>dropdown-primitives.ts</code> — the shared
					surface, item, and trigger recipe used by <code>Select</code>,{" "}
					<code>Combobox</code>, and <code>DropdownMenu</code>.
				</Note>
			</>
		),
	},
	combobox: {
		title: "Combobox",
		lede: "Searchable single-value picker for owner, account, contact, tag — anywhere the set is large, dynamic, or the user already knows the name. Input-first: focus lands in a search box, arrow keys walk the list, Enter commits.",
		sourceFile: "components/installer/combobox.tsx",
		source: comboboxSource,
		propRows: [
			{
				name: "value",
				type: "TValue | null",
				description: "The committed value.",
			},
			{
				name: "onValueChange",
				type: "(value: TValue | null) => void",
				description: "Fires on commit, or null on clear.",
			},
			{
				name: "items",
				type: "DropdownOption<TValue>[]",
				description: "The searchable set.",
			},
			{
				name: "allowClear",
				type: "boolean",
				defaultValue: "false",
				description: "Renders an inline × that clears the selection.",
			},
			{
				name: "isSearching",
				type: "boolean",
				defaultValue: "false",
				description: "Shows a spinner for server-driven search.",
			},
			{
				name: "searchPlaceholder",
				type: "string",
				description: "Placeholder for the search input row.",
			},
		],
		demo: (
			<Section title="Searchable">
				<DemoSurface>
					<ComboboxDemo />
				</DemoSurface>
			</Section>
		),
	},
	"dropdown-menu": {
		title: "Dropdown Menu",
		lede: "The unified action-menu surface — verbs on a subject: archive, duplicate, delete, switch workspace. Built on Base UI Menu with typeahead, roving focus, submenu nesting, and focus-return on close.",
		sourceFile: "components/installer/dropdown-menu.tsx",
		source: dropdownMenuSource,
		propRows: [
			{
				name: "DropdownMenuItem.icon",
				type: "ReactNode",
				description: "Small glyph in front of the label.",
			},
			{
				name: "DropdownMenuItem.shortcut",
				type: "ReactNode",
				description: "Right-aligned kbd hint.",
			},
			{
				name: "DropdownMenuItem.variant",
				type: '"default" | "destructive"',
				defaultValue: '"default"',
				description: "Destructive tints the row red.",
			},
			{
				name: "DropdownMenuCheckboxItem.checked",
				type: "boolean",
				description: "Controlled checked state.",
			},
			{
				name: "DropdownMenuRadioGroup.value",
				type: "string",
				description: "Controlled selected radio value.",
			},
		],
		demo: (
			<Section title="Actions, checkbox, radio group">
				<DemoSurface>
					<DropdownMenuDemo />
				</DemoSurface>
			</Section>
		),
	},
	calendar: {
		title: "Calendar",
		lede: "react-day-picker themed to the Installer grammar — a real <table> grid, ghost-button month/year dropdowns, and power-user keyboard hooks (t/. for today, Shift+PageUp/Down for year jumps).",
		sourceFile: "components/installer/calendar.tsx",
		source: calendarSource,
		propRows: [
			{
				name: "mode",
				type: '"single" | "multiple" | "range"',
				description: "Selection mode, passed through to react-day-picker.",
			},
			{
				name: "selected / onSelect",
				type: "Date | undefined, (date) => void",
				description: "Controlled selection for single mode.",
			},
			{
				name: "captionLayout",
				type: '"dropdown" | "label" | "dropdown-months" | "dropdown-years"',
				defaultValue: '"dropdown"',
				description: "Month/year caption style.",
			},
			{
				name: "startMonth / endMonth",
				type: "Date",
				description: "Bounds for the dropdown navigation.",
			},
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<CalendarDemo />
				</DemoSurface>
			</Section>
		),
	},
	"date-picker": {
		title: "Date Picker",
		lede: "A Calendar behind a popover trigger, with quick presets and a clear action. Three trigger variants share a vocabulary but tune for their surface — form row, pill, or dense inline cell.",
		sourceFile: "components/installer/date-picker.tsx",
		source: datePickerSource,
		propRows: [
			{
				name: "value",
				type: "Date | null | undefined",
				description: "The selected date.",
			},
			{
				name: "onChange",
				type: "(value: Date | null) => void",
				description: "Fires on selection, preset pick, or clear.",
			},
			{
				name: "variant",
				type: '"field" | "pill" | "inline"',
				defaultValue: '"field"',
				description: "Trigger chrome for the surface it sits in.",
			},
			{
				name: "allowClear",
				type: "boolean",
				defaultValue: "true",
				description: "Shows a Clear action in the footer.",
			},
			{
				name: "presets",
				type: "DatePickerPreset[]",
				description:
					"Quick-pick buttons — defaults to Today / Tomorrow / Next week.",
			},
		],
		demo: (
			<>
				<Section title="Field">
					<DemoSurface>
						<DatePickerDemo />
					</DemoSurface>
				</Section>
			</>
		),
	},
	"chips-input": {
		title: "Chips Input",
		lede: "Free text becomes removable chips. Enter or comma commits the current text; Backspace on an empty field removes the last chip. De-dupes case-insensitively.",
		sourceFile: "components/installer/chips-input.tsx",
		source: chipsInputSource,
		propRows: [
			{
				name: "value",
				type: "readonly string[]",
				description: "The committed chips.",
			},
			{
				name: "onChange",
				type: "(next: string[]) => void",
				description: "Fires on add, remove, or dedupe.",
			},
			{
				name: "placeholder",
				type: "string",
				description: "Shown only while there are no chips yet.",
			},
			{
				name: "disabled",
				type: "boolean",
				defaultValue: "false",
				description: "Disables the field and chip removal.",
			},
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<ChipsInputDemo />
				</DemoSurface>
			</Section>
		),
	},
	"segmented-control": {
		title: "Segmented Control",
		lede: "An N-position control for choosing one value on a scale — a radiogroup with arrow-key navigation and a single continuous sliding indicator between positions.",
		sourceFile: "components/installer/segmented-control.tsx",
		source: segmentedControlSource,
		propRows: [
			{
				name: "options",
				type: "{ value, label, hint? }[]",
				description: "Ordered options; hint shows in a tooltip on hover.",
			},
			{
				name: "value",
				type: "string",
				description: "The selected option's value.",
			},
			{
				name: "onChange",
				type: "(next: string) => void",
				description: "Fires on commit.",
			},
			{
				name: "aria-label",
				type: "string",
				defaultValue: '"Options"',
				description: "Accessible name for the radiogroup.",
			},
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<SegmentedControlDemo />
				</DemoSurface>
			</Section>
		),
	},
	tabs: {
		title: "Tabs",
		lede: "Animated tab system with a layout-projected sliding underline and crossfade panel transitions. Scoped per-instance so multiple mounted copies never fight over the same layout projection.",
		sourceFile: "components/installer/tabs.tsx",
		source: tabsSource,
		propRows: [
			{
				name: "tabs",
				type: "TabItem[]",
				description: "{ value, label, icon?, count?, busy?, content }.",
			},
			{
				name: "value / onChange",
				type: "string, (value) => void",
				description: "Controlled selected tab.",
			},
			{
				name: "isLoading",
				type: "boolean",
				defaultValue: "false",
				description: "Renders a skeleton tab bar and panel.",
			},
		],
		demo: (
			<Section title="Interactive" hint="one tab carries a count">
				<DemoSurface>
					<div className="w-full max-w-md">
						<TabsDemo />
					</div>
				</DemoSurface>
			</Section>
		),
	},
	toast: {
		title: "Toast",
		lede: "A themed wrapper around sonner's Toaster, synced to the app's dark-mode class, OS color scheme, and cross-tab theme changes. Mount once near the root; call toast() anywhere.",
		sourceFile: "components/installer/toast.tsx",
		source: toastSource,
		propRows: [
			{
				name: "toast.success(message)",
				type: "(message: string) => void",
				description: "Brand-tinted success toast.",
			},
			{
				name: "toast.error(message)",
				type: "(message: string) => void",
				description: "Destructive-tinted error toast.",
			},
			{
				name: "toast.message(message)",
				type: "(message: string) => void",
				description: "Neutral informational toast.",
			},
		],
		demo: (
			<Section title="Fire a toast">
				<DemoSurface>
					<ToastDemo />
				</DemoSurface>
			</Section>
		),
	},
	"score-ring": {
		title: "Score Ring",
		lede: "A circular 0–100 indicator that spring-fills on mount, in four sizes and four states. When unknown, the ring stays empty and suppresses the number so it never reads as a real zero.",
		sourceFile: "components/installer/score-ring.tsx",
		source: scoreRingSource,
		propRows: [
			{ name: "score", type: "number", description: "0–100 value." },
			{
				name: "state",
				type: '"unknown" | "low" | "medium" | "high"',
				description: "Drives the stroke color.",
			},
			{
				name: "size",
				type: '"xs" | "sm" | "md" | "lg"',
				defaultValue: '"sm"',
				description: "One of four fixed sizes.",
			},
			{
				name: "showLabel",
				type: "boolean",
				defaultValue: "true",
				description: "Renders the number in the center.",
			},
		],
		demo: (
			<>
				<Section title="By state">
					<DemoSurface>
						<div className="flex items-end gap-10">
							{SCORE_RING_STATES.map((r) => (
								<div key={r.note} className="flex flex-col items-center gap-3">
									<ScoreRing score={r.score} state={r.state} size="lg" />
									<span className="type-meta text-muted-foreground">
										{r.note}
									</span>
								</div>
							))}
						</div>
					</DemoSurface>
				</Section>
				<Section title="By size">
					<DemoSurface>
						<div className="flex items-end gap-8">
							<ScoreRing score={72} state="medium" size="xs" />
							<ScoreRing score={72} state="medium" size="sm" />
							<ScoreRing score={72} state="medium" size="md" />
							<ScoreRing score={72} state="medium" size="lg" />
						</div>
					</DemoSurface>
				</Section>
			</>
		),
	},
	"segment-meter": {
		title: "Segment Meter",
		lede: "A row of discrete cell meters, one column per segment — battery gauges you read at a glance. A four-ink grammar carries the state: filled, weak-segment alarm, active bay, and dashed/unscored or ghost potential.",
		sourceFile: "components/installer/segment-meter.tsx",
		source: segmentMeterSource,
		propRows: [
			{
				name: "segments",
				type: "MeterSegment[]",
				description: "{ key, label, short?, value?, ghostTo? } per column.",
			},
			{
				name: "max",
				type: "number",
				defaultValue: "3",
				description: "Cells per column.",
			},
			{
				name: "weakThreshold",
				type: "number",
				defaultValue: "1",
				description: "Values at or below this read as the red alarm.",
			},
			{
				name: "activeKey",
				type: "string | null",
				description: "Highlights one segment's bay.",
			},
			{
				name: "assessing",
				type: "boolean",
				defaultValue: "false",
				description: "Sweeps a brand sheen while a scoring pass runs.",
			},
		],
		demo: (
			<Section title="Interactive">
				<DemoSurface>
					<SegmentMeterDemo />
				</DemoSurface>
			</Section>
		),
	},
	"confidence-meter": {
		title: "Confidence Meter",
		lede: "A calibrated 0–1 confidence read as five segments, bucketed from Very low to Very high, with amber warning tones at the bottom of the range. Handles the null / not-yet-scored state.",
		sourceFile: "components/installer/confidence-meter.tsx",
		source: confidenceMeterSource,
		propRows: [
			{
				name: "value",
				type: "number | null | undefined",
				description: "0–1 confidence, or null for the empty state.",
			},
			{
				name: "compact",
				type: "boolean",
				defaultValue: "false",
				description: "Hides the numeric label; meter only.",
			},
			{ name: "className", type: "string", description: "Extra classes." },
		],
		demo: (
			<>
				<Section title="Interactive">
					<DemoSurface>
						<ConfidenceMeterDemo />
					</DemoSurface>
				</Section>
				<Section title="States">
					<DemoSurface>
						<div className="flex flex-col items-start gap-3">
							<ConfidenceMeter value={0.18} />
							<ConfidenceMeter value={0.66} />
							<ConfidenceMeter value={0.95} />
							<ConfidenceMeter value={null} />
						</div>
					</DemoSurface>
				</Section>
			</>
		),
	},
};
