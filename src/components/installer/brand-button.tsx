/**
 * BrandButton — a CTA with a gradient border that stays crisp on any
 * surface (padding-box fill + border-box gradient), lifting and
 * glowing in the brand color on hover. Renders as a <button> by
 * default, or an <a> when `href` is set.
 *
 * Self-contained: scoped CSS keyed off the brand tokens
 * (--color-brand, --color-brand-light) with hex fallbacks, so it works
 * even before the theme sheet is installed.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
	children: ReactNode;
	/** Solid fills the pill; outline keeps the gradient as a border only. */
	variant?: "outline" | "solid";
	className?: string;
};

type ButtonProps = CommonProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
		href?: undefined;
	};

type AnchorProps = CommonProps & {
	href: string;
	target?: string;
	rel?: string;
};

export function BrandButton(props: ButtonProps | AnchorProps) {
	const { children, variant = "outline", className } = props;
	const cls = ["brand-button", `brand-button--${variant}`, className ?? ""]
		.filter(Boolean)
		.join(" ");

	const content = (
		<>
			<span className="brand-button__label">{children}</span>
			<style>{BRAND_BUTTON_CSS}</style>
		</>
	);

	if ("href" in props && props.href !== undefined) {
		return (
			<a
				href={props.href}
				target={props.target}
				rel={props.rel}
				className={cls}
			>
				{content}
			</a>
		);
	}

	const { children: _c, variant: _v, className: _cn, ...rest } = props;
	return (
		<button type="button" className={cls} {...rest}>
			{content}
		</button>
	);
}

const BRAND_BUTTON_CSS = `
.brand-button {
  --bb-from: var(--color-brand-light, #7AFF04);
  --bb-to: var(--color-brand, #00CC33);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.75rem;
  padding: 0 1.5rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 550;
  line-height: 1;
  cursor: pointer;
  border-radius: 0.625rem;
  border: 2px solid transparent;
  color: var(--foreground, #111);
  text-decoration: none;
  transition: box-shadow 0.3s ease, transform 0.2s ease, color 0.2s ease;
}
.brand-button--outline {
  background:
    linear-gradient(var(--background, #fff), var(--background, #fff)) padding-box,
    linear-gradient(to bottom, var(--bb-from), var(--bb-to)) border-box;
}
.brand-button--solid {
  border-color: transparent;
  color: #05230d;
  background: linear-gradient(to bottom, var(--bb-from), var(--bb-to)) border-box;
}
.brand-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 32px -8px var(--color-brand, #00CC33);
}
.brand-button:active {
  transform: translateY(0);
}
.brand-button:focus-visible {
  outline: 2px solid var(--color-brand, #00CC33);
  outline-offset: 2px;
}
.brand-button__label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
@media (prefers-reduced-motion: reduce) {
  .brand-button { transition: none; }
  .brand-button:hover { transform: none; }
}
`;
