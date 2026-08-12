import { FONT, GRADIENTS } from "../nav/design-system";
import { useSignalCountdown } from "../agent/signal-countdown";
import type { SignalCardData } from "../agent/SignalViews";
import { findMarketSignalCard } from "./data";

const ASSETS = {
  chevron: "/signal/chevron-right.svg",
  clock: "/trader-dna/signal/clock-time.png",
  close: "/trader-dna/close.svg",
} as const;

/** Compact marquee tap: simplified card sheet; view more → detail page. */
export function SignalCardPreview({
  signalId,
  onClose,
  onViewMore,
  onAskAgent,
  onTradeNow,
}: {
  signalId: string;
  onClose: () => void;
  onViewMore: () => void;
  onAskAgent: (data: SignalCardData) => void;
  onTradeNow: (data: SignalCardData) => void;
}) {
  const data = findMarketSignalCard(signalId);
  const timerLabel = useSignalCountdown(data.id, data.timer);
  const sideColor = data.side === "SHORT" ? "#ff41a3" : "#46ccb9";

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        role="dialog"
        aria-label={`${data.symbol} signal`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 16,
          borderRadius: 8,
          background: "#131519",
          border: "1px solid rgba(255,255,255,0.08)",
          boxSizing: "border-box",
          fontFamily: FONT,
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={data.icon}
              alt=""
              width={16}
              height={16}
              style={{
                display: "block",
                width: 16,
                height: 16,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "20px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {data.symbol}
            </span>
            <span
              style={{
                padding: "0 4px",
                borderRadius: 4,
                background:
                  data.side === "SHORT"
                    ? "rgba(255,65,163,0.1)"
                    : "rgba(70,204,185,0.1)",
                color: sideColor,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                textTransform: "capitalize",
              }}
            >
              {data.side === "SHORT" ? "Short" : "Long"}
            </span>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 14,
              height: 14,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={ASSETS.close}
              alt=""
              width={14}
              height={14}
              style={{ display: "block", width: 14, height: 14 }}
            />
          </button>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <img
            src={ASSETS.clock}
            alt=""
            width={13}
            height={13}
            style={{ display: "block", width: 13, height: 13 }}
          />
          {timerLabel}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PreviewRow label="Entry (limit)" value={data.entry} />
          <PreviewRow
            label="Stop loss"
            value={data.stopLoss}
            pct={data.stopLossPct}
            valueColor="#ff41a3"
          />
          <PreviewRow
            label="Take profit"
            value={data.takeProfit}
            pct={data.takeProfitPct}
            valueColor="#46ccb9"
          />
        </div>

        <button
          type="button"
          onClick={onViewMore}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            width: "100%",
            padding: "4px 8px",
            borderRadius: 8,
            border: "none",
            background: "rgba(255,255,255,0.05)",
            cursor: "pointer",
            boxSizing: "border-box",
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.3)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {`${data.sourceLabel} · Score ${data.signalScore} · R:R ${data.rr}`}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            view more
            <img
              src={ASSETS.chevron}
              alt=""
              width={16}
              height={16}
              style={{ display: "block", width: 16, height: 16 }}
            />
          </span>
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => onAskAgent(data)}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 999,
              border: "none",
              background: GRADIENTS.connectBtn,
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Ask Agent
          </button>
          <button
            type="button"
            onClick={() => onTradeNow(data)}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 999,
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Trade Now
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  pct,
  valueColor,
}: {
  label: string;
  value: string;
  pct?: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        minHeight: 24,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {pct ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              minWidth: 56,
              textAlign: "right",
            }}
          >
            {pct}
          </span>
        ) : null}
        <span
          style={{
            fontSize: pct ? 13 : 16,
            fontWeight: 600,
            color: valueColor ?? "rgba(255,255,255,0.8)",
            minWidth: pct ? 80 : undefined,
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
