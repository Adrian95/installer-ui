/**
 * Official Installer logomark glyph as a single SVG path in a
 * 900×900 viewBox, plus the shared brand gradient stops and the
 * optical-centering transform every renderer of the glyph applies.
 *
 * Import these instead of copying values so the mark can never
 * drift between components.
 */
export const INSTALLER_LOGO_PATH =
	"M699.7,464.5c-6.6-15.8-17.3-29.3-31.1-39-14.9-10.5-32.6-16-51.3-16h-96.7l-14.9,55.2h111.5c21,0,29.3,16,31.4,21,2,4.9,7.5,22.1-7.4,37l-44.6,44.6h0c-35.6,35.6-84.8,86.6-120.8,58.6-29.7-23.1,3.7-130.1,19.4-190.5,0,0,21.5-82.7,35-134.6,42.4-162.5-58-281.6-217.3-161.5-47.4,34.4-134.9,128.3-134.9,128.3h0s-45.2,45.2-45.2,45.2c-13.2,13.2-21.8,29.7-24.9,47.6-2.9,16.6-.9,33.7,5.6,49.6,6.6,15.8,17.3,29.3,31.1,39,14.9,10.5,32.6,16,51.3,16h96.7l14.9-55.2h-111.5c-21,0-29.3-16-31.4-21-2-4.9-7.5-22.1,7.4-37l44.6-44.6h0c35.6-35.6,83.3-86.6,119.3-58.6,29.7,23.1-3.1,130.1-18.8,190.5h0s-22.7,82.7-36.2,134.6c-42.4,162.5,60.1,281.6,219.4,161.5,47.4-34.4,134.9-128.3,134.9-128.3h0s45.2-45.2,45.2-45.2c13.2-13.2,21.8-29.7,24.9-47.6,2.9-16.6.9-33.7-5.6-49.6Z";

export const INSTALLER_LOGO_VIEWBOX = "0 0 900 900";

/** Optically centers the glyph within the viewBox. */
export const INSTALLER_LOGO_TRANSFORM = "translate(44 -54)";

/** Brand gradient, top to bottom. */
export const INSTALLER_GRADIENT_FROM = "#7AFF04";
export const INSTALLER_GRADIENT_TO = "#00CC33";
