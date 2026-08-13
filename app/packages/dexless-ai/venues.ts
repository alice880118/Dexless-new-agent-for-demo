export type VenueSource = {
  id: string;
  name: string;
  icon: string;
  trades: number;
};

/** Dexless platform — demo trade count */
export const DEXLESS_VENUE: VenueSource = {
  id: "dexless",
  name: "Dexless",
  icon: "/dexless-ai/dexless.png",
  trades: 343,
};

export const DEXLESS_TRADES = DEXLESS_VENUE.trades;

/** Six external venues — logos in /public/dexless-ai/ */
export const EXTERNAL_VENUES: VenueSource[] = [
  { id: "okx", name: "OKX", icon: "/dexless-ai/okx.png", trades: 86 },
  { id: "binance", name: "Binance", icon: "/dexless-ai/binance.png", trades: 160 },
  { id: "bingx", name: "BingX", icon: "/dexless-ai/bingx.png", trades: 54 },
  { id: "mexc", name: "MEXC", icon: "/dexless-ai/mexc.png", trades: 76 },
  { id: "bybit", name: "Bybit", icon: "/dexless-ai/bybit.png", trades: 120 },
  { id: "ourbit", name: "Ourbit", icon: "/dexless-ai/ourbit.png", trades: 46 },
];

export const EXTERNAL_VENUE_TRADES = EXTERNAL_VENUES.reduce(
  (sum, v) => sum + v.trades,
  0,
);

/** Dexless + all external venues */
export const FULL_TRADE_COUNT = DEXLESS_TRADES + EXTERNAL_VENUE_TRADES;

/** External exchanges only (excludes Dexless) — e.g. “542 trades on 6 venues” */
export const EXTERNAL_VENUE_COUNT = EXTERNAL_VENUES.length;

/** Dexless + external — e.g. “Across 7 venues” / full-analysis copy */
export const ALL_VENUE_COUNT = 1 + EXTERNAL_VENUE_COUNT;

export function formatTradeCount(n: number): string {
  return n.toLocaleString("en-US");
}
