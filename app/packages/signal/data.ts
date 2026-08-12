import type { SignalCardData } from "../agent/SignalViews";
import { SIGNAL_CARDS } from "../agent/SignalViews";

export const MARQUEE_HEIGHT = 32;

export type MarqueeTickerItem = {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  entry: string;
  score: string;
  pnlTime: string;
  pnlPositive: boolean;
  signalId: string;
};

export const MARQUEE_ITEMS: MarqueeTickerItem[] = [
  {
    id: "m1",
    symbol: "ETH-PERP",
    side: "LONG",
    entry: "2,466.48",
    score: "74",
    pnlTime: "-1:08.12",
    pnlPositive: false,
    signalId: "eth-1",
  },
  {
    id: "m2",
    symbol: "ETH-SOL-PERP",
    side: "SHORT",
    entry: "141.82",
    score: "65",
    pnlTime: "+0:42.15",
    pnlPositive: true,
    signalId: "ethsol-1",
  },
  {
    id: "m3",
    symbol: "AVAX-PERP",
    side: "SHORT",
    entry: "34.91",
    score: "58",
    pnlTime: "-0:45.22",
    pnlPositive: false,
    signalId: "avax-1",
  },
  {
    id: "m4",
    symbol: "BTC-PERP",
    side: "SHORT",
    entry: "62,104.30",
    score: "60",
    pnlTime: "-0:22.40",
    pnlPositive: false,
    signalId: "btc-1",
  },
];

export const EXTRA_SIGNAL_CARDS: SignalCardData[] = [
  {
    id: "eth-1",
    symbol: "ETH-PERP",
    side: "LONG",
    timer: "2:15:40",
    ttl: "TTL 180 min",
    entry: "2,466.48",
    stopLoss: "2,388.20",
    stopLossPct: "-3.17%",
    takeProfit: "2,640.10",
    takeProfitPct: "+7.04%",
    provider: "Provided by Hunt Titan · SAGE",
    rr: "2.2",
    signalScore: "74",
    signalScoreMax: "/100",
    indicatorNote: "4 of 6 indicators bullish, 1 bearish",
    fundingRate: "+0.001% · Neutral",
    openInterest: "$88,240",
    longShortRatio: "1.12 · Bullish",
    posted: "Posted 18:20 · valid 180 min",
  },
  {
    id: "ethsol-1",
    symbol: "ETH-SOL-PERP",
    side: "SHORT",
    timer: "1:52:08",
    ttl: "TTL 120 min",
    entry: "141.82",
    stopLoss: "146.40",
    stopLossPct: "+3.23%",
    takeProfit: "132.10",
    takeProfitPct: "-6.85%",
    provider: "Provided by SAGE",
    rr: "2.1",
    signalScore: "65",
    signalScoreMax: "/100",
    indicatorNote: "3 of 6 indicators bearish, 1 bullish",
    fundingRate: "-0.004% · Neutral",
    openInterest: "$42,110",
    longShortRatio: "0.82 · Bearish",
    posted: "Posted 19:01 · valid 120 min",
  },
  {
    id: "avax-1",
    symbol: "AVAX-PERP",
    side: "SHORT",
    timer: "0:58:22",
    ttl: "TTL 90 min",
    entry: "34.91",
    stopLoss: "36.10",
    stopLossPct: "+3.41%",
    takeProfit: "32.40",
    takeProfitPct: "-7.19%",
    provider: "Provided by Vanguard",
    rr: "2.0",
    signalScore: "58",
    signalScoreMax: "/100",
    indicatorNote: "3 of 6 indicators bearish, 0 bullish",
    fundingRate: "+0.006% · Neutral",
    openInterest: "$21,560",
    longShortRatio: "0.71 · Bearish",
    posted: "Posted 20:10 · valid 90 min",
  },
  {
    id: "sol-1",
    symbol: "SOL-PERP",
    side: "LONG",
    timer: "1:20:10",
    ttl: "TTL 150 min",
    entry: "148.20",
    stopLoss: "143.10",
    stopLossPct: "-3.44%",
    takeProfit: "158.90",
    takeProfitPct: "+7.22%",
    provider: "Provided by Hunt Titan · SAGE",
    rr: "2.1",
    signalScore: "62",
    signalScoreMax: "/100",
    indicatorNote: "3 of 6 indicators bullish, 1 bearish",
    fundingRate: "+0.003% · Neutral",
    openInterest: "$76,400",
    longShortRatio: "1.05 · Bullish",
    posted: "Posted 17:44 · valid 150 min",
  },
  {
    id: "link-1",
    symbol: "LINK-PERP",
    side: "LONG",
    timer: "2:05:18",
    ttl: "TTL 200 min",
    entry: "14.82",
    stopLoss: "14.21",
    stopLossPct: "-4.12%",
    takeProfit: "16.10",
    takeProfitPct: "+8.64%",
    provider: "Provided by Hunt Titan",
    rr: "2.3",
    signalScore: "71",
    signalScoreMax: "/100",
    indicatorNote: "4 of 6 indicators bullish, 0 bearish",
    fundingRate: "+0.002% · Neutral",
    openInterest: "$33,890",
    longShortRatio: "1.18 · Bullish",
    posted: "Posted 16:55 · valid 200 min",
  },
];

export const ALL_SIGNAL_CARDS: SignalCardData[] = [
  ...SIGNAL_CARDS,
  ...EXTRA_SIGNAL_CARDS,
];

export function findSignalCard(id: string): SignalCardData {
  return ALL_SIGNAL_CARDS.find((c) => c.id === id) ?? ALL_SIGNAL_CARDS[0];
}

export type MarketSignalCard = SignalCardData & {
  sourceLabel: string;
  icon: string;
  priceMoved?: boolean;
  expiredLabel?: string;
};

export const MARKET_ACTIVE_SIGNALS: MarketSignalCard[] = [
  {
    ...SIGNAL_CARDS[0],
    sourceLabel: "Hunt Titan",
    icon: "/signal/btc.png",
  },
  {
    ...EXTRA_SIGNAL_CARDS[0],
    sourceLabel: "SAGE",
    icon: "/signal/eth.png",
  },
  {
    ...EXTRA_SIGNAL_CARDS[3],
    sourceLabel: "Vanguard",
    icon: "/signal/sol.png",
    priceMoved: true,
  },
  {
    ...EXTRA_SIGNAL_CARDS[1],
    sourceLabel: "SAGE",
    icon: "/signal/eth.png",
  },
  {
    ...EXTRA_SIGNAL_CARDS[2],
    sourceLabel: "Vanguard",
    icon: "/signal/avax.svg",
  },
  {
    ...EXTRA_SIGNAL_CARDS[4],
    sourceLabel: "Hunt Titan",
    icon: "/signal/link.svg",
  },
];

export const MARKET_EXPIRED_SIGNALS: MarketSignalCard[] = [
  {
    ...SIGNAL_CARDS[1],
    id: "btc-exp-1",
    symbol: "XRP-PERP",
    sourceLabel: "Hunt Titan · SAGE",
    icon: "/signal/btc.png",
    expiredLabel: "expired 12:04",
  },
  {
    ...EXTRA_SIGNAL_CARDS[0],
    id: "eth-exp-1",
    symbol: "DOGE-PERP",
    side: "SHORT",
    sourceLabel: "SAGE",
    icon: "/signal/eth.png",
    expiredLabel: "expired 09:22",
  },
  {
    ...EXTRA_SIGNAL_CARDS[3],
    id: "sol-exp-1",
    symbol: "ADA-PERP",
    side: "SHORT",
    sourceLabel: "Vanguard",
    icon: "/signal/sol.png",
    expiredLabel: "expired 08:15",
  },
];

export const SOURCE_SUMMARY = [
  { name: "Hunt Titan", signals: 42, winRate: "58%" },
  { name: "SAGE", signals: 28, winRate: "63%" },
  { name: "Vanguard", signals: 61, winRate: "51%" },
] as const;

/** Resolve signal used by Markets cards + detail modal (includes expired remaps). */
export function findMarketOrSignalCard(id: string): SignalCardData {
  const market = [...MARKET_ACTIVE_SIGNALS, ...MARKET_EXPIRED_SIGNALS].find(
    (c) => c.id === id,
  );
  if (market) return market;
  return findSignalCard(id);
}

export function findMarketSignalCard(id: string): MarketSignalCard {
  const market = [...MARKET_ACTIVE_SIGNALS, ...MARKET_EXPIRED_SIGNALS].find(
    (c) => c.id === id,
  );
  if (market) return market;
  const base = findSignalCard(id);
  const sym = base.symbol.toUpperCase();
  return {
    ...base,
    sourceLabel: base.provider.replace(/^Provided by\s+/i, ""),
    icon: sym.startsWith("ETH")
      ? "/signal/eth.png"
      : sym.startsWith("SOL")
        ? "/signal/sol.png"
        : sym.startsWith("AVAX")
          ? "/signal/avax.svg"
          : sym.startsWith("LINK")
            ? "/signal/link.svg"
            : "/signal/btc.png",
  };
}
