# Installer UI

A small set of delightful, self-contained React components — inputs and controls on [Base UI](https://base-ui.com), plus animated brand marks and data meters — lifted from Installer's internal tools. Install them through the shadcn registry or copy the source.

Live showcase: **[installer-ui.vercel.app](https://installer-ui.vercel.app)**

## Quick start

Install any component with the shadcn CLI. Each component that uses design tokens also pulls the **theme** item automatically, so the CSS variables land in your `globals.css` on first install — no extra step.

```bash
npx shadcn@latest add https://installer-ui.vercel.app/r/select.json
```

Or install the theme on its own first (recommended if you want the whole system up front):

```bash
npx shadcn@latest add https://installer-ui.vercel.app/r/theme.json
```

### Components

| Item | Description |
| --- | --- |
| [`theme`](https://installer-ui.vercel.app/r/theme.json) | The full token sheet — brand + neutral variables (light & dark), type utilities, keyframes. |
| **Inputs & controls** | |
| [`select`](https://installer-ui.vercel.app/r/select.json) | Single-select on Base UI with a keyboard brand rail and CSS spring open/close. |
| [`combobox`](https://installer-ui.vercel.app/r/combobox.json) | Searchable select — client or async filtering, clearable, skeleton rows. |
| [`dropdown-menu`](https://installer-ui.vercel.app/r/dropdown-menu.json) | Actions menu with icons, shortcuts, checkbox/radio items, and submenus. |
| [`calendar`](https://installer-ui.vercel.app/r/calendar.json) | react-day-picker restyled with ghost month/year selects and jump-to-today. |
| [`date-picker`](https://installer-ui.vercel.app/r/date-picker.json) | Base UI popover over the calendar — field / pill / inline variants, presets. |
| [`chips-input`](https://installer-ui.vercel.app/r/chips-input.json) | Tag input with spring chip enter/exit and de-dupe. |
| [`segmented-control`](https://installer-ui.vercel.app/r/segmented-control.json) | ARIA radiogroup with a shared-layout sliding indicator. |
| [`tabs`](https://installer-ui.vercel.app/r/tabs.json) | Sliding underline + crossfade panels, with counts and busy states. |
| **Feedback & data** | |
| [`toast`](https://installer-ui.vercel.app/r/toast.json) | Theme-syncing sonner Toaster + `toast()`. |
| [`score-ring`](https://installer-ui.vercel.app/r/score-ring.json) | Circular 0–100 dial, four sizes, spring-filled, state-colored. |
| [`segment-meter`](https://installer-ui.vercel.app/r/segment-meter.json) | Row of discrete cell meters with a four-ink grammar and assessing sweep. |
| [`confidence-meter`](https://installer-ui.vercel.app/r/confidence-meter.json) | Dense five-segment 0–1 confidence meter with a tone-coded label. |
| **Brand & motion** | |
| [`installer-logomark`](https://installer-ui.vercel.app/r/installer-logomark.json) | One-shot draw-on + gradient-bloom logomark. Pure CSS. |
| [`installer-loading`](https://installer-ui.vercel.app/r/installer-loading.json) | Full-page wait state — a comet endlessly traces the glyph. Self-contained. |
| [`copilot-mark`](https://installer-ui.vercel.app/r/copilot-mark.json) | The logomark as a presence indicator — quiet when idle, self-tracing while live. |
| [`catenary-arcs`](https://installer-ui.vercel.app/r/catenary-arcs.json) | Nested catenary arches drawing themselves on, brand gradient innermost. |
| [`marquee`](https://installer-ui.vercel.app/r/marquee.json) | Seamless infinite scroll strip with edge fade and pause-on-hover. |
| [`brand-button`](https://installer-ui.vercel.app/r/brand-button.json) | Gradient-border CTA that lifts and glows on hover. |
| [`animated-number`](https://installer-ui.vercel.app/r/animated-number.json) | rAF-eased number transitions with an injected formatter. |

Registry index: [`/r/registry.json`](https://installer-ui.vercel.app/r/registry.json)

### Copy-paste instead

Grab the source straight from [`src/components/installer/`](src/components/installer/). Peer deps by component:

- **React 19** — everything.
- **motion** — the meters, `animated-number`, `chips-input`, `segmented-control`, `tabs`, `date-picker`.
- **@base-ui/react** — `select`, `combobox`, `dropdown-menu`, `date-picker`, and the tooltip used by the meters / segmented control.
- **react-day-picker** — `calendar`, `date-picker`.
- **sonner** — `toast`.
- **@phosphor-icons/react** — the inputs and calendar.
- **Tailwind v4** (+ `clsx`, `tailwind-merge` for `cn`) — everything except the pure-CSS marks (`installer-logomark`, `installer-loading`, `marquee`, `brand-button`), which stand alone.

## Theming — you own the styling

The tokens are plain CSS variables. Installing the `theme` item (or any component that depends on it) writes them into your `globals.css` under `:root` and `.dark` — **you edit them there.** Change one line and every component follows:

```css
:root {
	--color-brand: #00cc33; /* ← your brand color; the whole system re-tints */
	--radius: 0.625rem;
	/* …neutral palette: --background, --foreground, --border, --muted-foreground, … */
}
.dark {
	--background: #111111;
	/* …dark overrides… */
}
```

No fonts are required: the UI stack falls back to Geist → system-ui, and the display stack to Geist → Inter → system-ui. (The Interstaller display face on the showcase is an Installer brand asset and is **not** distributed.) See the full sheet at [`src/styles.css`](src/styles.css) or the [Theming page](https://installer-ui.vercel.app/theming).

## Usage

```tsx
// A searchable select
import { Combobox } from "@/components/installer/combobox";

<Combobox
	value={ownerId}
	onValueChange={setOwnerId}
	items={owners}
	placeholder="Owner"
	allowClear
/>;
```

```tsx
// Full-page wait state (Next.js app/loading.tsx, or a Suspense fallback)
import { InstallerLoading } from "@/components/installer/installer-loading";

export default function Loading() {
	return <InstallerLoading kicker="Loading" />;
}
```

## Development

```bash
bun install
bun run dev      # dev server on :3000
bun run build    # registry:build + vite build
```

`bun run registry:build` regenerates `public/r/*.json` from the component source; the Vercel build runs it automatically. PRs get preview deployments via Vercel.

## License

Code is [MIT](LICENSE). The Installer name, logomark, and Interstaller font are brand assets of Installer — see the trademark notice in [LICENSE](LICENSE).
