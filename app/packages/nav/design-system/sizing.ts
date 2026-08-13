import type { Breakpoint } from "./breakpoints";

/** Layout / component sizes */
export const NAV_HEIGHT = 48;

/** Logo frame: 112 × 24 */
export const LOGO_WIDTH = 112;
export const LOGO_HEIGHT = 24;

/** Hamburger menu icon */
export const MENU_ICON_SIZE = 28;

/** Side menu close (X) icon */
export const CLOSE_ICON_SIZE = 20;

/** Connected wallet chevron */
export const WALLET_CHEVRON = { width: 7, height: 5 } as const;

/** Docs row external-link icon */
export const EXTERNAL_LINK_SIZE = 24;

/** Site footer bar (desktop >768) */
export const FOOTER_HEIGHT = 30;

/**
 * Dialog / modal shell widths (px).
 * - compact (360): <768 — matches “Your account is live”
 * - default (418): ≥768
 */
export const MODAL_WIDTH = {
  compact: 360,
  default: 418,
} as const;

/** Modal max-width for current breakpoint */
export function getModalMaxWidth(bp: Breakpoint): number {
  return bp === "390" ? MODAL_WIDTH.compact : MODAL_WIDTH.default;
}
