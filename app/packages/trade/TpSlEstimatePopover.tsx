import type { CSSProperties } from "react";
import { FONT } from "../nav/design-system";
import type { TpSlInputMode } from "./TpSlSettingsPicker";

const BUY = "#46ccb9";
const SELL = "#ff41a3";

/** Demo entry / size for estimate preview (matches order-panel TP/SL tip) */
export const TPSL_EST_ENTRY = 30303.3;
export const TPSL_EST_QTY = 0.001;
export const TPSL_EST_LEVERAGE = 10;

export type TpSlFieldKind = "tp" | "sl";

export function isOffsetMode(mode: TpSlInputMode): boolean {
  return mode === "offset" || mode === "offset_pct";
}

function parseNum(raw: string): number | null {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatSigned(n: number, digits = 2): string {
  const abs = Math.abs(n).toFixed(digits);
  return n >= 0 ? `+${abs}` : `-${abs}`;
}

export type TpSlEstimate = {
  priceLabel: string;
  roiLabel: string;
  pnlLabel: string;
};

/** Compute tip values from current input + mode (demo math). */
export function computeTpSlEstimate(
  mode: TpSlInputMode,
  kind: TpSlFieldKind,
  raw: string,
  entry = TPSL_EST_ENTRY,
  qty = TPSL_EST_QTY,
  leverage = TPSL_EST_LEVERAGE,
): TpSlEstimate {
  const input = parseNum(raw);
  const isTp = kind === "tp";

  let exit = entry;
  if (input != null) {
    if (mode === "price") {
      exit = Math.abs(input);
    } else if (mode === "pnl") {
      exit = entry + (isTp ? 1 : -1) * (Math.abs(input) / Math.max(qty, 1e-9));
    } else if (mode === "offset") {
      exit = entry + (isTp ? 1 : -1) * Math.abs(input);
    } else {
      exit = entry * (1 + ((isTp ? 1 : -1) * Math.abs(input)) / 100);
    }
  } else {
    exit = isTp ? entry * 1.08 : entry * 0.92;
  }

  // Keep TP tip positive / SL tip negative in demo styling
  const tipPnl =
    input != null
      ? (isTp ? 1 : -1) * Math.abs(qty * (exit - entry))
      : isTp
        ? 2.62
        : -2.62;
  const margin = (qty * entry) / leverage;
  const roi =
    input != null && margin > 0
      ? (tipPnl / margin) * 100
      : isTp
        ? 116.58
        : -116.58;

  return {
    priceLabel: `${formatPrice(exit)} USDC`,
    roiLabel: `${formatSigned(roi)}%`,
    pnlLabel: `${formatSigned(tipPnl)} USDC`,
  };
}

type TpSlEstimatePopoverProps = {
  kind: TpSlFieldKind;
  mode: TpSlInputMode;
  value: string;
  /** When set, card is fixed above this rect (avoids overflow clip) */
  anchorRect?: { top: number; left: number } | null;
};

/** Figma 7445:97460 — data 2 / data 3 tip above TP/SL input */
export function TpSlEstimatePopover({
  kind,
  mode,
  value,
  anchorRect,
}: TpSlEstimatePopoverProps) {
  const isLong = kind === "tp";
  const accent = isLong ? BUY : SELL;
  const showOffsetTip = isOffsetMode(mode);
  const showPriceTip = mode === "price";
  const est = computeTpSlEstimate(mode, kind, value);

  /** Price-mode Est. PnL — 盈綠／虧粉 by sign */
  const pricePnlNum = Number(
    String(est.pnlLabel).replace(/[^0-9.\-]/g, ""),
  );
  const pricePnlLabel = Number.isFinite(pricePnlNum)
    ? `${pricePnlNum < 0 ? "-" : ""}${Math.abs(pricePnlNum).toFixed(2)} USDC`
    : est.pnlLabel;
  const pricePnlColor =
    Number.isFinite(pricePnlNum) && pricePnlNum < 0 ? SELL : BUY;

  const row = (label: string, val: string, valColor: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
      }}
    >
      <span
        style={{
          width: label === "Price" ? 45 : undefined,
          flexShrink: 0,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "16px",
          color: "rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: label === "Price" ? 500 : 600,
          lineHeight: "12px",
          letterSpacing: "-0.36px",
          color: valColor,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {val}
      </span>
    </div>
  );

  const card: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    width: "max-content",
    minWidth: 157,
    padding: 8,
    borderRadius: 6,
    background: "#131519",
    border: "1px solid rgba(255,255,255,0.2)",
    boxSizing: "border-box",
    pointerEvents: "none",
  };

  const shell: CSSProperties = anchorRect
    ? {
        position: "fixed",
        left: anchorRect.left,
        top: anchorRect.top,
        transform: "translateY(calc(-100% - 4px))",
        zIndex: 5200,
        ...card,
      }
    : {
        position: "absolute",
        left: 0,
        bottom: "calc(100% + 4px)",
        zIndex: 40,
        ...card,
      };

  return (
    <div style={shell} aria-hidden>
      {showOffsetTip ? (
        <>
          {row("Price", est.priceLabel, "rgba(255,255,255,0.9)")}
          {row("Est. ROI", est.roiLabel, accent)}
          {row("Est. PnL", est.pnlLabel, accent)}
        </>
      ) : showPriceTip ? (
        <>
          {row("Est. PnL", pricePnlLabel, pricePnlColor)}
          {row("Price", est.priceLabel, "rgba(255,255,255,0.9)")}
        </>
      ) : (
        <>
          {row("Est. ROI", est.roiLabel, accent)}
          {row("Price", est.priceLabel, "rgba(255,255,255,0.9)")}
        </>
      )}
    </div>
  );
}

export const TPSL_LONG = BUY;
export const TPSL_SHORT = SELL;
