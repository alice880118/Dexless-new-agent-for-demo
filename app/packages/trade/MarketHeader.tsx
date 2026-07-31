import { COLORS, FONT } from "../nav/design-system";
import { TRADE_COLORS, type TradeLayoutMode } from "./tradeLayout";

export type MarketHeaderStats = {
  symbol: string;
  markPrice: string;
  change24h: string;
  changePositive: boolean;
  funding: string;
  indexPrice: string;
  openInterest: string;
  volume24h: string;
};

type MarketHeaderProps = {
  mode: TradeLayoutMode;
  market: MarketHeaderStats;
  /** Open market picker (drawer / preview) */
  onOpenMarkets?: () => void;
  favorited?: boolean;
  onToggleFavorite?: () => void;
};

export function MarketHeader({
  mode,
  market,
  onOpenMarkets,
  favorited = false,
  onToggleFavorite,
}: MarketHeaderProps) {
  const compact = mode === "xs";

  if (compact) {
    return (
      <div
        style={{
          flexShrink: 0,
          width: "100%",
          minHeight: 40,
          padding: "8px 12px",
          boxSizing: "border-box",
          background: TRADE_COLORS.page,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: FONT,
        }}
      >
        <button
          type="button"
          aria-label={favorited ? "Unfavorite" : "Favorite"}
          onClick={onToggleFavorite}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: onToggleFavorite ? "pointer" : "default",
            display: "inline-flex",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M8 1.6l1.76 3.56 3.93.57-2.84 2.77.67 3.91L8 10.56l-3.52 1.85.67-3.91L2.3 5.73l3.93-.57L8 1.6z"
              fill={favorited ? "#f5c518" : "transparent"}
              stroke={favorited ? "#f5c518" : "rgba(255,255,255,0.45)"}
              strokeWidth="1.2"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onOpenMarkets}
          disabled={!onOpenMarkets}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: onOpenMarkets ? "pointer" : "default",
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              lineHeight: "20px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {market.symbol}
          </span>
          <span style={{ fontSize: 10, color: COLORS.white50, lineHeight: 1 }}>
            ▾
          </span>
        </button>
        <span
          style={{
            marginLeft: 4,
            fontSize: 12,
            fontWeight: 600,
            color: market.changePositive ? "#00e49c" : "#ff41a3",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {market.change24h}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        flexShrink: 0,
        width: "100%",
        minHeight: 48,
        padding: "10px 12px",
        boxSizing: "border-box",
        background: TRADE_COLORS.page,
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: FONT,
      }}
    >
      <button
        type="button"
        onClick={onOpenMarkets}
        disabled={!onOpenMarkets}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: onOpenMarkets ? "pointer" : "default",
          fontFamily: FONT,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "20px",
            color: "#ffffff",
          }}
        >
          {market.symbol}
        </span>
        {onOpenMarkets ? (
          <span
            aria-hidden
            style={{ fontSize: 10, color: COLORS.white50, lineHeight: 1 }}
          >
            ▾
          </span>
        ) : null}
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stat label="Mark" value={market.markPrice} />
        <Stat
          label="24h"
          value={market.change24h}
          color={market.changePositive ? "#00e49c" : "#ff41a3"}
        />
        <Stat label="Funding" value={market.funding} />
        <Stat label="Index" value={market.indexPrice} />
        <Stat label="OI" value={market.openInterest} />
        <Stat label="24h Vol" value={market.volume24h} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 0 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          lineHeight: "14px",
          color: COLORS.white40,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "18px",
          color: color ?? "rgba(255,255,255,0.9)",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}
