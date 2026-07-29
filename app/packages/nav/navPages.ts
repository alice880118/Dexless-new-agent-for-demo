export type NavPageId =
  | "dexless_ai"
  | "trade_perps"
  | "trade_swap"
  | "markets"
  | "referrals"
  | "vaults"
  | "points"
  | "more_docs"
  | "airdrop"
  | "portfolio";

const PAGE_TITLES: Record<NavPageId, string> = {
  dexless_ai: "DEXless_AI",
  trade_perps: "Trade_Perps",
  trade_swap: "Trade_Swap",
  markets: "Markets",
  referrals: "Referrals",
  vaults: "Vaults",
  points: "Points",
  more_docs: "More_Docs",
  airdrop: "Airdrop",
  portfolio: "Portfolio",
};

export function getNavPageLabel(id: NavPageId): string {
  return `${PAGE_TITLES[id]} page`;
}

export function isTradePage(id: NavPageId | null | undefined): boolean {
  return id === "trade_perps";
}

export function isMorePage(id: NavPageId | null | undefined): boolean {
  return id === "more_docs" || id === "trade_swap";
}
