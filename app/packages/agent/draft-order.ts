export type DraftOrder = {
  id: string;
  title: string;
  market: string;
  side: "Long" | "Short";
  margin: string;
  leverageLine: string;
  entry: string;
  takeProfit: string;
  stopLoss: string;
  listSummary: string;
  time: string;
  balanceLine?: string;
  minRequiredLine?: string;
};

export const DRAFT_ORDER_REPLY =
  "Based on the current market, I’ve drafted a BTC-PERP order with 3× leverage and a 50 USDC position. Let me know what you’d like to adjust.";

export const NO_TPSL_DRAFT_REPLY =
  "Based on the current market, I’ve drafted a BTC-PERP order with 3× leverage and a 50 USDC position — Take Profit and Stop Loss are not set yet. Tap ADD to let me suggest levels.";

export const TPSL_ASK_MESSAGE =
  "Can you help me set Take Profit and Stop Loss for this BTC-PERP draft order?";

export const TPSL_SUGGEST_REPLY =
  "Based on current volatility and your 3× leverage, I suggest Take Profit at 120,800 (+12 USDC) and Stop Loss at 107,380 (−6 USDC). Apply these to your draft order?";

export const SUGGESTED_TAKE_PROFIT = "120,800 · +12 USDC";
export const SUGGESTED_STOP_LOSS = "107,380 · −6 USDC";

export const PRIMARY_DRAFT_ORDER: DraftOrder = {
  id: "btc-draft-1",
  title: "BTC Long",
  market: "BTC-PERP",
  side: "Long",
  margin: "50 USDC",
  leverageLine: "3× · 150 USDC position",
  entry: "Market · Est. 111,855",
  takeProfit: "120,800 · +12 USDC",
  stopLoss: "107,380 · −6 USDC",
  listSummary: "20 USDC margin · 3× · Market",
  time: "May 22, 16:00",
  balanceLine: "Current balance: 0 USDC",
  minRequiredLine: "Minimum required: 10 USDC",
};

export const NO_TPSL_DRAFT_ORDER: DraftOrder = {
  ...PRIMARY_DRAFT_ORDER,
  takeProfit: "",
  stopLoss: "",
};

export const DEMO_DRAFT_ORDERS: DraftOrder[] = [
  {
    id: "eth-draft-1",
    title: "ETH Long",
    market: "ETH-PERP",
    side: "Long",
    margin: "12 USDC",
    leverageLine: "10× · 120 USDC position",
    entry: "Market · Est. 3,420",
    takeProfit: "3,680 · +8 USDC",
    stopLoss: "3,290 · −4 USDC",
    listSummary: "12 USDC margin · 10× · Market",
    time: "May 22, 18:26",
    balanceLine: "Current balance: 0 USDC",
    minRequiredLine: "Minimum required: 10 USDC",
  },
  {
    ...PRIMARY_DRAFT_ORDER,
    id: "btc-draft-1",
    listSummary: "20 USDC margin · 3× · Market",
  },
];

export function isNoTpSlQuery(message: string): boolean {
  return /no\s*tp\s*\/?\s*sl/i.test(message.trim());
}

export function isDraftOrderQuery(message: string): boolean {
  const text = message.trim();
  return /draft\s*order/i.test(text) || isNoTpSlQuery(text);
}
