# Installer UI

Animated brand components, score meters, and hero scenes from Installer's internal tools — install them via the shadcn registry or copy-paste the source.

Live showcase: **[installer-ui.vercel.app](https://installer-ui.vercel.app)**

## Quick start

### Option A: shadcn registry

```bash
npx shadcn@latest add https://installer-ui.vercel.app/r/installer-loading.json
```

| Item | Description |
| --- | --- |
| [`installer-logomark`](https://installer-ui.vercel.app/r/installer-logomark.json) | One-shot draw-on + gradient-bloom logomark for arrival moments. Pure CSS. |
| [`installer-loading`](https://installer-ui.vercel.app/r/installer-loading.json) | Full-page wait state — a gradient comet endlessly traces the glyph. Self-contained. |
| [`hero-scene`](https://installer-ui.vercel.app/r/hero-scene.json) | "Network behind the mark" landing hero with dispatch constellation and ticker. |
| [`catenary-arcs`](https://installer-ui.vercel.app/r/catenary-arcs.json) | Nested catenary arches drawing themselves on, hairline strokes, brand gradient innermost. |
| [`copilot-mark`](https://installer-ui.vercel.app/r/copilot-mark.json) | The logomark as a presence indicator — quiet when idle, self-tracing while live. |
| [`spiced-band`](https://installer-ui.vercel.app/r/spiced-band.json) | Five discrete cell meters (0-3 per SPICED pillar) with gate ghosts and assessing sweep. |
| [`spiced-ring`](https://installer-ui.vercel.app/r/spiced-ring.json) | Circular 0-100 score ring, four sizes, spring-animated, dashed when unknown. |
| [`confidence-meter`](https://installer-ui.vercel.app/r/confidence-meter.json) | Dense 5-segment 0-1 confidence meter with tone-coded label and tooltip. |
| [`animated-number`](https://installer-ui.vercel.app/r/animated-number.json) | rAF-eased number transitions with an injected formatter. |
| [`illustrations`](https://installer-ui.vercel.app/r/illustrations.json) | Six animated SVG scene illustrations plus a barrel export. |

Registry index: [`/r/registry.json`](https://installer-ui.vercel.app/r/registry.json)

### Option B: copy-paste

Grab the source from [`src/components/installer/`](src/components/installer/). Peer deps are minimal:

- **React 19** — everything
- **motion** — `spiced-band`, `spiced-ring`, `confidence-meter`, `animated-number`, `illustrations`
- **@base-ui-components/react** — the tooltip used by `spiced-band` and `confidence-meter`
- **@phosphor-icons/react** — `hero-scene` (CTA arrow only)
- **Tailwind v4** (+ `clsx`, `tailwind-merge` for `cn`) — the meter components and `hero-scene`; the logomark, loading, and copilot components are plain CSS

### Required tokens

Components that lean on the theme expect these variables (registry installs add them for you):

```css
:root {
	--color-brand: #00CC33;
	--color-brand-light: #7AFF04;
}
```

The meters also use standard shadcn tokens (`--border`, `--muted-foreground`, `--primary`). Full token sheet: [`src/styles.css`](src/styles.css).

## Usage

### InstallerLoading — full-page wait state

```tsx
import { InstallerLoading } from "@/components/installer/installer-loading";

// React Router / Vite: as a suspense or route-pending fallback
<Suspense fallback={<InstallerLoading message="Fetching your pipeline…" />}>
	<App />
</Suspense>

// Next.js: app/loading.tsx
export default function Loading() {
	return <InstallerLoading kicker="Loading" />;
}
```

### InstallerLogomark — one-shot intro

```tsx
import { InstallerLogomark } from "@/components/installer/installer-logomark";

// Plays its draw-on once when mounted; static under prefers-reduced-motion
<InstallerLogomark className="h-16 w-16" title="Installer" />

// Static (no animation), e.g. in a header next to visible text
<InstallerLogomark className="h-6 w-6" play={false} />
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
