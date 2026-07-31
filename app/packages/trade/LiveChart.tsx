import type { CSSProperties } from "react";

type LiveChartProps = {
  /** Optional absolute path override */
  src?: string;
  style?: CSSProperties;
};

/** Embeds public/trade/tradingview-live-chart.html — fills parent, RWD inside iframe */
export function LiveChart({
  src = "/trade/tradingview-live-chart.html",
  style,
}: LiveChartProps) {
  return (
    <iframe
      title="Live chart"
      src={src}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        border: "none",
        display: "block",
        background: "#0b0b10",
        ...style,
      }}
    />
  );
}
