import { DotsThree } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";

import { AnimatedNumber } from "#/components/installer/animated-number";
import { BrandButton } from "#/components/installer/brand-button";
import { Calendar } from "#/components/installer/calendar";
import { CatenaryArcs } from "#/components/installer/catenary-arcs";
import { ChipsInput } from "#/components/installer/chips-input";
import { Combobox } from "#/components/installer/combobox";
import { ConfidenceMeter } from "#/components/installer/confidence-meter";
import { CopilotMark } from "#/components/installer/copilot-mark";
import { DatePicker } from "#/components/installer/date-picker";
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "#/components/installer/dropdown-menu";
import {
	DROPDOWN_GHOST_TRIGGER_CLASS,
	type DropdownOption,
} from "#/components/installer/dropdown-primitives";
import { InstallerLoading } from "#/components/installer/installer-loading";
import { InstallerLogomark } from "#/components/installer/installer-logomark";
import { Marquee } from "#/components/installer/marquee";
import { ScoreRing } from "#/components/installer/score-ring";
import { SegmentMeter } from "#/components/installer/segment-meter";
import { SegmentedControl } from "#/components/installer/segmented-control";
import { Select } from "#/components/installer/select";
import { Tabs } from "#/components/installer/tabs";
import { cn } from "#/lib/utils";

// ── Card previews ─────────────────────────────────────────────────────────
//
// Every preview renders the real component (or, where a live instance can't
// sit passively in a card — Toast — an exact visual match of it). Anything
// with focusable controls is wrapped in `inert` so nested interactivity
// never fights the card's own `<Link>`.

function LogomarkPreview() {
	return <InstallerLogomark play={false} className="h-11 w-11" />;
}

function LoadingPreview() {
	return (
		<div className="flex h-28 w-full items-center justify-center overflow-hidden">
			<div
				className="origin-center scale-[0.42]"
				style={{ width: 260, height: 220 }}
			>
				<InstallerLoading kicker="Loading" />
			</div>
		</div>
	);
}

function CopilotMarkPreview() {
	return (
		<div className="flex items-center gap-6">
			<CopilotMark className="size-6 text-muted-foreground" />
			<CopilotMark live className="size-6" />
		</div>
	);
}

function CatenaryPreview() {
	return <CatenaryArcs className="h-14 w-32 text-foreground" />;
}

const MARQUEE_PREVIEW_WORDS = [
	"Installer",
	"Dispatch",
	"Routing",
	"CRM",
] as const;

function MarqueePreview() {
	return (
		<div className="w-full max-w-[190px] text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
			<Marquee durationSec={9} pauseOnHover={false} gap="1.5rem">
				{MARQUEE_PREVIEW_WORDS.map((word) => (
					<span key={word} className="whitespace-nowrap">
						{word}
					</span>
				))}
			</Marquee>
		</div>
	);
}

function BrandButtonPreview() {
	return (
		<div inert className="flex origin-center scale-[0.78] items-center gap-3">
			<BrandButton variant="outline">Outline</BrandButton>
			<BrandButton variant="solid">Solid</BrandButton>
		</div>
	);
}

const previewCurrency = (value: number) =>
	value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

function AnimatedNumberPreview() {
	return (
		<AnimatedNumber
			value={48200}
			format={previewCurrency}
			className="type-display type-tabular text-3xl text-foreground"
		/>
	);
}

const SELECT_PREVIEW_OPTIONS = [
	{ value: "new", label: "New" },
	{ value: "qualified", label: "Qualified", group: "Pipeline" },
	{ value: "won", label: "Won", group: "Pipeline" },
] as const satisfies readonly DropdownOption<string>[];

function SelectPreview() {
	return (
		<div inert className="w-36">
			<Select
				value="qualified"
				onValueChange={() => {}}
				options={SELECT_PREVIEW_OPTIONS}
				placeholder="Stage"
			/>
		</div>
	);
}

const COMBOBOX_PREVIEW_ITEMS = [
	{ value: "amara", label: "Amara Chen" },
	{ value: "diego", label: "Diego Reyes" },
	{ value: "priya", label: "Priya Nair" },
] as const satisfies readonly DropdownOption<string>[];

function ComboboxPreview() {
	return (
		<div inert className="w-40">
			<Combobox
				value="diego"
				onValueChange={() => {}}
				items={COMBOBOX_PREVIEW_ITEMS}
				placeholder="Owner"
				allowClear
			/>
		</div>
	);
}

function DropdownMenuPreview() {
	return (
		<div inert>
			<DropdownMenu>
				<DropdownMenuTrigger className={DROPDOWN_GHOST_TRIGGER_CLASS}>
					<DotsThree weight="bold" className="size-4" />
					Actions
				</DropdownMenuTrigger>
			</DropdownMenu>
		</div>
	);
}

const CALENDAR_PREVIEW_MONTH = new Date(2026, 0, 1, 12);
const CALENDAR_PREVIEW_START = new Date(2020, 0, 1);
const CALENDAR_PREVIEW_END = new Date(2030, 11, 31);

function CalendarPreview() {
	return (
		<div className="flex h-28 w-full items-center justify-center overflow-hidden">
			<div inert className="origin-center scale-[0.44]" style={{ width: 300 }}>
				<Calendar
					mode="single"
					selected={CALENDAR_PREVIEW_MONTH}
					defaultMonth={CALENDAR_PREVIEW_MONTH}
					captionLayout="dropdown"
					startMonth={CALENDAR_PREVIEW_START}
					endMonth={CALENDAR_PREVIEW_END}
				/>
			</div>
		</div>
	);
}

function DatePickerPreview() {
	return (
		<div inert className="w-40">
			<DatePicker value={CALENDAR_PREVIEW_MONTH} onChange={() => {}} />
		</div>
	);
}

function ChipsInputPreview() {
	return (
		<div inert className="w-44">
			<ChipsInput value={["saas", "enterprise"]} onChange={() => {}} />
		</div>
	);
}

const SEGMENTED_PREVIEW_OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
];

function SegmentedControlPreview() {
	return (
		<div inert>
			<SegmentedControl
				options={SEGMENTED_PREVIEW_OPTIONS}
				value="week"
				onChange={() => {}}
				aria-label="Preview"
			/>
		</div>
	);
}

const TABS_PREVIEW_ITEMS = [
	{ value: "overview", label: "Overview", content: <span /> },
	{ value: "activity", label: "Activity", content: <span />, count: 3 },
	{ value: "notes", label: "Notes", content: <span /> },
];

function TabsPreview() {
	return (
		<div inert className="h-28 w-full max-w-[220px] overflow-hidden">
			<Tabs
				tabs={TABS_PREVIEW_ITEMS}
				value="activity"
				onChange={() => {}}
				aria-label="Preview"
			/>
		</div>
	);
}

/** Static twin of `<Toaster/>` + `toast.success(...)` — mounting the real
 * imperative toast on every card view would fire a real notification each
 * time the grid renders, which is not the point of a card preview. */
function ToastPreview() {
	return (
		<div className="flex w-48 items-start gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3 text-left shadow-lg">
			<CheckCircle
				className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
				aria-hidden="true"
			/>
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="truncate text-[13px] font-medium text-card-foreground">
					Deal updated
				</span>
				<span className="truncate text-[11px] text-muted-foreground">
					Stage moved to Qualified
				</span>
			</div>
		</div>
	);
}

function ScoreRingPreview() {
	return (
		<div className="flex items-end gap-5">
			<ScoreRing score={22} state="low" size="sm" />
			<ScoreRing score={58} state="medium" size="md" />
			<ScoreRing score={87} state="high" size="md" />
		</div>
	);
}

const SEGMENT_METER_PREVIEW = [
	{ key: "s", label: "Situation", short: "S", value: 3 },
	{ key: "p", label: "Pain", short: "P", value: 1 },
	{ key: "i", label: "Impact", short: "I", value: 0 },
	{ key: "c", label: "Critical event", short: "C", value: undefined },
];

function SegmentMeterPreview() {
	return (
		<div inert className="w-32">
			<SegmentMeter segments={SEGMENT_METER_PREVIEW} activeKey="s" />
		</div>
	);
}

function ConfidenceMeterPreview() {
	return (
		<div inert className="flex flex-col items-start gap-2.5">
			<ConfidenceMeter value={0.45} />
			<ConfidenceMeter value={0.93} />
		</div>
	);
}

// ── Registry ──────────────────────────────────────────────────────────────

export type Category =
	| "Brand & motion"
	| "Inputs & controls"
	| "Feedback & data";

export const REGISTRY = [
	{
		slug: "installer-logomark",
		name: "InstallerLogomark",
		href: "/components/installer-logomark",
		category: "Brand & motion",
		description:
			"One-shot draw-on logomark with a gradient bloom, for arrival moments.",
		preview: LogomarkPreview,
	},
	{
		slug: "installer-loading",
		name: "InstallerLoading",
		href: "/components/installer-loading",
		category: "Brand & motion",
		description:
			"Looping loading scene — a gradient comet endlessly traces the glyph.",
		preview: LoadingPreview,
	},
	{
		slug: "copilot-mark",
		name: "CopilotMark",
		href: "/components/copilot-mark",
		category: "Brand & motion",
		description:
			"The logomark as a status indicator — quiet at rest, tracing while live.",
		preview: CopilotMarkPreview,
	},
	{
		slug: "catenary-arcs",
		name: "CatenaryArcs",
		href: "/components/catenary-arcs",
		category: "Brand & motion",
		description:
			"Four nested catenary arches, hairline-drawn, innermost in the gradient.",
		preview: CatenaryPreview,
	},
	{
		slug: "marquee",
		name: "Marquee",
		href: "/components/marquee",
		category: "Brand & motion",
		description:
			"Seamless, edge-faded infinite scroller for logos, words, or chips.",
		preview: MarqueePreview,
	},
	{
		slug: "brand-button",
		name: "BrandButton",
		href: "/components/brand-button",
		category: "Brand & motion",
		description:
			"CTA with a crisp gradient border, lifting and glowing brand-green on hover.",
		preview: BrandButtonPreview,
	},
	{
		slug: "animated-number",
		name: "AnimatedNumber",
		href: "/components/animated-number",
		category: "Brand & motion",
		description:
			"Tasteful numeric ease for figures that change — bring your own formatter.",
		preview: AnimatedNumberPreview,
	},
	{
		slug: "select",
		name: "Select",
		href: "/components/select",
		category: "Inputs & controls",
		description:
			"Commit one value from a known, small set — arrow-and-typeahead, no search.",
		preview: SelectPreview,
	},
	{
		slug: "combobox",
		name: "Combobox",
		href: "/components/combobox",
		category: "Inputs & controls",
		description:
			"Searchable single-value picker for large or dynamic sets — owner, account, tag.",
		preview: ComboboxPreview,
	},
	{
		slug: "dropdown-menu",
		name: "DropdownMenu",
		href: "/components/dropdown-menu",
		category: "Inputs & controls",
		description:
			"Verbs on a subject — actions, checkboxes, radio groups, and submenus.",
		preview: DropdownMenuPreview,
	},
	{
		slug: "calendar",
		name: "Calendar",
		href: "/components/calendar",
		category: "Inputs & controls",
		description:
			"react-day-picker themed to the Installer grammar — dropdown month/year nav.",
		preview: CalendarPreview,
	},
	{
		slug: "date-picker",
		name: "DatePicker",
		href: "/components/date-picker",
		category: "Inputs & controls",
		description: "A Calendar behind a field trigger, with presets and clear.",
		preview: DatePickerPreview,
	},
	{
		slug: "chips-input",
		name: "ChipsInput",
		href: "/components/chips-input",
		category: "Inputs & controls",
		description:
			"Free text becomes removable chips — Enter, comma, or blur to commit.",
		preview: ChipsInputPreview,
	},
	{
		slug: "segmented-control",
		name: "SegmentedControl",
		href: "/components/segmented-control",
		category: "Inputs & controls",
		description:
			"An N-position control for a value with inherent order, sliding indicator.",
		preview: SegmentedControlPreview,
	},
	{
		slug: "tabs",
		name: "Tabs",
		href: "/components/tabs",
		category: "Inputs & controls",
		description:
			"Layout-projected sliding underline with crossfade panels and busy states.",
		preview: TabsPreview,
	},
	{
		slug: "toast",
		name: "Toast",
		href: "/components/toast",
		category: "Feedback & data",
		description:
			"Themed sonner wrapper — success, error, and message notifications.",
		preview: ToastPreview,
	},
	{
		slug: "score-ring",
		name: "ScoreRing",
		href: "/components/score-ring",
		category: "Feedback & data",
		description:
			"Circular 0–100 score in four sizes, colored by qualification state.",
		preview: ScoreRingPreview,
	},
	{
		slug: "segment-meter",
		name: "SegmentMeter",
		href: "/components/segment-meter",
		category: "Feedback & data",
		description:
			"Discrete per-segment cell meters with weak/ghost/active states, battery-style.",
		preview: SegmentMeterPreview,
	},
	{
		slug: "confidence-meter",
		name: "ConfidenceMeter",
		href: "/components/confidence-meter",
		category: "Feedback & data",
		description: "Calibrated 0–1 confidence as a dense five-segment meter.",
		preview: ConfidenceMeterPreview,
	},
] as const satisfies ReadonlyArray<{
	slug: string;
	name: string;
	href: string;
	category: Category;
	description: string;
	preview: () => React.JSX.Element;
}>;

export type RegistryEntry = (typeof REGISTRY)[number];
export type RegistrySlug = RegistryEntry["slug"];

const CATEGORY_ORDER: readonly Category[] = [
	"Brand & motion",
	"Inputs & controls",
	"Feedback & data",
];

// ── Grid ──────────────────────────────────────────────────────────────────

export function ComponentsGrid() {
	return (
		<div className="space-y-14">
			{CATEGORY_ORDER.map((category) => (
				<section key={category}>
					<h2 className="type-kicker text-muted-foreground">{category}</h2>
					<div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
						{REGISTRY.filter((entry) => entry.category === category).map(
							(entry) => {
								const Preview = entry.preview;
								return (
									<Link
										key={entry.slug}
										to="/components/$slug"
										params={{ slug: entry.slug }}
										className="group relative flex flex-col bg-background p-6 transition-colors hover:bg-card"
									>
										<div
											inert
											className={cn(
												"flex h-28 items-center justify-center overflow-hidden text-foreground",
											)}
										>
											<Preview />
										</div>
										<div className="mt-5 flex items-center justify-between gap-3">
											<h3 className="font-mono text-[13px] font-semibold text-foreground">
												{entry.name}
											</h3>
											<ArrowRight
												className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
												aria-hidden="true"
											/>
										</div>
										<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
											{entry.description}
										</p>
									</Link>
								);
							},
						)}
					</div>
				</section>
			))}
		</div>
	);
}
