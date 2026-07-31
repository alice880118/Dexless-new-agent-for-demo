export const MARKET = {
  symbol: "ETH-PERP",
  base: "ETH",
  quote: "USDC",
  markPrice: "3,303.30",
  change24h: "+2.14%",
  changePositive: true,
  funding: "0.0100%",
  indexPrice: "3,302.80",
  openInterest: "128.4M",
  volume24h: "412.6M",
} as const;

export type MarketListItem = {
  id: string;
  symbol: string;
  base: string;
  leverage: string;
  price: string;
  /** Numeric price for sort */
  priceNum: number;
  change24h: string;
  changePct: number;
  volume: string;
  volumeNum: number;
  category: "crypto" | "rwa";
  isNew?: boolean;
  /** Hex for fallback icon badge */
  iconColor: string;
};

export const MARKET_LIST: MarketListItem[] = [
  {
    id: "eth",
    symbol: "ETH-PERP",
    base: "ETH",
    leverage: "50x",
    price: "3,303.30",
    priceNum: 3303.3,
    change24h: "+2.14%",
    changePct: 2.14,
    volume: "$412.6M",
    volumeNum: 412.6,
    category: "crypto",
    iconColor: "#627eea",
  },
  {
    id: "btc",
    symbol: "BTC-PERP",
    base: "BTC",
    leverage: "50x",
    price: "111,855",
    priceNum: 111855,
    change24h: "-0.82%",
    changePct: -0.82,
    volume: "$1.24B",
    volumeNum: 1240,
    category: "crypto",
    iconColor: "#f7931a",
  },
  {
    id: "sol",
    symbol: "SOL-PERP",
    base: "SOL",
    leverage: "40x",
    price: "178.42",
    priceNum: 178.42,
    change24h: "+4.61%",
    changePct: 4.61,
    volume: "$286.1M",
    volumeNum: 286.1,
    category: "crypto",
    iconColor: "#9945ff",
  },
  {
    id: "arb",
    symbol: "ARB-PERP",
    base: "ARB",
    leverage: "25x",
    price: "0.8421",
    priceNum: 0.8421,
    change24h: "+1.05%",
    changePct: 1.05,
    volume: "$54.2M",
    volumeNum: 54.2,
    category: "crypto",
    isNew: true,
    iconColor: "#28a0f0",
  },
  {
    id: "bonk",
    symbol: "1000BONK-PERP",
    base: "1000BONK",
    leverage: "100x",
    price: "0.02841",
    priceNum: 0.02841,
    change24h: "+12.40%",
    changePct: 12.4,
    volume: "$98.7M",
    volumeNum: 98.7,
    category: "crypto",
    isNew: true,
    iconColor: "#f2a900",
  },
  {
    id: "op",
    symbol: "OP-PERP",
    base: "OP",
    leverage: "25x",
    price: "1.9240",
    priceNum: 1.924,
    change24h: "-3.12%",
    changePct: -3.12,
    volume: "$41.8M",
    volumeNum: 41.8,
    category: "crypto",
    iconColor: "#ff0420",
  },
  {
    id: "link",
    symbol: "LINK-PERP",
    base: "LINK",
    leverage: "25x",
    price: "14.620",
    priceNum: 14.62,
    change24h: "+0.48%",
    changePct: 0.48,
    volume: "$62.4M",
    volumeNum: 62.4,
    category: "crypto",
    iconColor: "#2a5ada",
  },
  {
    id: "xau",
    symbol: "XAU-PERP",
    base: "XAU",
    leverage: "20x",
    price: "2,418.50",
    priceNum: 2418.5,
    change24h: "+0.32%",
    changePct: 0.32,
    volume: "$88.0M",
    volumeNum: 88,
    category: "rwa",
    isNew: true,
    iconColor: "#d4af37",
  },
  {
    id: "xag",
    symbol: "XAG-PERP",
    base: "XAG",
    leverage: "20x",
    price: "31.240",
    priceNum: 31.24,
    change24h: "-0.55%",
    changePct: -0.55,
    volume: "$22.1M",
    volumeNum: 22.1,
    category: "rwa",
    iconColor: "#c0c0c0",
  },
  {
    id: "doge",
    symbol: "DOGE-PERP",
    base: "DOGE",
    leverage: "50x",
    price: "0.1842",
    priceNum: 0.1842,
    change24h: "+6.20%",
    changePct: 6.2,
    volume: "$170.3M",
    volumeNum: 170.3,
    category: "crypto",
    iconColor: "#c2a633",
  },
];

export const ACCOUNT = {
  available: "285.05",
  maxBuy: "0.00768",
} as const;

export type BookLevel = {
  price: string;
  size: string;
  total: string;
  depth: number; // 0–1 fill bar
};

export const ASKS: BookLevel[] = [
  { price: "3,305.20", size: "12.40", total: "48.2", depth: 0.85 },
  { price: "3,304.80", size: "8.10", total: "35.8", depth: 0.7 },
  { price: "3,304.40", size: "5.60", total: "27.7", depth: 0.55 },
  { price: "3,304.00", size: "9.20", total: "22.1", depth: 0.45 },
  { price: "3,303.60", size: "4.80", total: "12.9", depth: 0.3 },
  { price: "3,303.40", size: "3.10", total: "8.1", depth: 0.2 },
];

export const BIDS: BookLevel[] = [
  { price: "3,303.20", size: "6.50", total: "6.5", depth: 0.25 },
  { price: "3,302.90", size: "11.20", total: "17.7", depth: 0.4 },
  { price: "3,302.50", size: "7.80", total: "25.5", depth: 0.55 },
  { price: "3,302.10", size: "14.30", total: "39.8", depth: 0.7 },
  { price: "3,301.70", size: "9.60", total: "49.4", depth: 0.8 },
  { price: "3,301.20", size: "18.40", total: "67.8", depth: 0.95 },
];

export type TradeTick = {
  price: string;
  size: string;
  time: string;
  side: "buy" | "sell";
};

export const RECENT_TRADES: TradeTick[] = [
  { price: "3,303.30", size: "0.42", time: "12:04:21", side: "buy" },
  { price: "3,303.25", size: "1.10", time: "12:04:18", side: "sell" },
  { price: "3,303.40", size: "0.25", time: "12:04:12", side: "buy" },
  { price: "3,303.10", size: "2.80", time: "12:04:05", side: "sell" },
  { price: "3,303.35", size: "0.66", time: "12:03:58", side: "buy" },
  { price: "3,303.00", size: "1.45", time: "12:03:51", side: "sell" },
];

export type PositionRow = {
  market: string;
  side: "Long" | "Short";
  size: string;
  entry: string;
  mark: string;
  liq: string;
  pnl: string;
  pnlPct: string;
  pnlPositive: boolean;
  margin: string;
  funding: string;
  notional: string;
  marginMode: string;
  leverage: string;
  /** Soften row (Figma dimmed sample) */
  dimmed?: boolean;
};

/** Desktop Positions table demo (Figma 6296:35819) */
export const POSITIONS: PositionRow[] = [
  {
    market: "HYPE-PERP",
    side: "Long",
    size: "0.4",
    entry: "50.000",
    mark: "39.395",
    liq: "----",
    pnl: "-3.26",
    pnlPct: "-326.68%",
    pnlPositive: false,
    margin: "16.82",
    funding: "-0.12",
    notional: "16.82",
    marginMode: "Cross",
    leverage: "20X",
  },
  {
    market: "HYPE-PERP",
    side: "Short",
    size: "0.4",
    entry: "50.000",
    mark: "39.395",
    liq: "----",
    pnl: "-3.26",
    pnlPct: "-326.68%",
    pnlPositive: false,
    margin: "16.82",
    funding: "+0.04",
    notional: "16.82",
    marginMode: "Cross",
    leverage: "20X",
  },
  {
    market: "HYPE-PERP",
    side: "Short",
    size: "0.4",
    entry: "50.000",
    mark: "39.395",
    liq: "----",
    pnl: "-3.26",
    pnlPct: "-326.68%",
    pnlPositive: false,
    margin: "16.82",
    funding: "+0.02",
    notional: "16.82",
    marginMode: "Cross",
    leverage: "20X",
    dimmed: true,
  },
];

export type OpenOrderRow = {
  market: string;
  side: "Buy" | "Sell";
  type: string;
  price: string;
  size: string;
  filled: string;
  status: string;
};

export const OPEN_ORDERS: OpenOrderRow[] = [
  {
    market: "ETH-PERP",
    side: "Buy",
    type: "Limit",
    price: "3,250.00",
    size: "1.00",
    filled: "0.00",
    status: "Open",
  },
];
