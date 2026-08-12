import type { Breakpoint } from "../nav/design-system";

/** Layout tokens derived from dexless-perp-rwd-plan.md */

export type TradeLayoutMode = "xs" | "md" | "lg" | "xl" | "2xl";

/** Desktop trade shell — do not compress below this width (horizontal scroll instead). */
export const DESKTOP_TRADE_MIN_W = 1280;

export function getTradeLayoutMode(bp: Breakpoint): TradeLayoutMode {
  if (bp === "390") return "xs";
  if (bp === "768") return "md";
  if (bp === "1024") return "lg";
  if (bp === "1920") return "2xl";
  return "xl"; // 1280 / 1440
}

export function getBookWidth(mode: TradeLayoutMode): number {
  if (mode === "lg") return 240;
  if (mode === "md") return 280;
  return 280;
}

export function getOrderWidth(mode: TradeLayoutMode): number {
  if (mode === "lg") return 300;
  return 320;
}

export function getGutter(mode: TradeLayoutMode): number {
  return mode === "xs" ? 8 : 4;
}

export function getPageMargin(mode: TradeLayoutMode): number {
  return mode === "xs" ? 8 : 4;
}

/** Chart min height by viewport height (plan §七) */
export function getChartMinHeight(viewportH: number): number {
  if (viewportH < 720) return 280;
  if (viewportH < 900) return 360;
  return 440;
}

/** Row height density token */
export function getRowHeight(mode: TradeLayoutMode): number {
  if (mode === "xs") return 40;
  if (mode === "md" || mode === "lg") return 32;
  return 28;
}

/** Market list column widths (dexless-market-panel-plan) */
export const MARKET_RAIL_W = 56;
export const MARKET_EXPANDED_W = 300;
export const MARKET_PREVIEW_W = 360;

/** Inline expand only when viewport is wide enough (≥1600) */
export function allowsInlineMarketExpand(viewportW: number): boolean {
  return viewportW >= 1600;
}

/**
 * Layout slot width for the market column.
 * XS: none. MD: always rail (expand opens popover).
 * Wider: rail, or 300 when inline-expanded.
 */
export function getMarketSlotWidth(
  mode: TradeLayoutMode,
  expanded: boolean,
  viewportW: number,
): number {
  if (mode === "xs") return 0;
  if (mode === "md") return MARKET_RAIL_W;
  if (expanded && allowsInlineMarketExpand(viewportW)) {
    return MARKET_EXPANDED_W;
  }
  return MARKET_RAIL_W;
}

/** Mobile trade frame (Figma 7446:54879) — min sizes */
export const MOBILE_TRADE = {
  frameW: 390,
  chartH: 382,
  midH: 493,
  orderW: 212,
  bookW: 169,
} as const;

export const TRADE_COLORS = {
  panel: "#131519",
  page: "#0a0b0d",
  buyGrad: "linear-gradient(90deg, #46ccb9 32.213%, #00e49c 100%)",
  sellMuted: "rgba(255,255,255,0.3)",
  midAccent: "#a78bfa",
  inputBg: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)",
  green: "#00e49c",
  red: "#ff41a3",
} as const;
