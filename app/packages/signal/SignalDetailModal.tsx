import type { CSSProperties, ReactNode } from "react";
import { FONT, GRADIENTS } from "../nav/design-system";
import { useSignalCountdownState } from "../agent/signal-countdown";
import { findMarketOrSignalCard, MARKET_ACTIVE_SIGNALS } from "./data";
import type { SignalCardData } from "../agent/SignalViews";
import { PriceStructureChart } from "./PriceStructureChart";

const ASSETS = {
  close: "/trader-dna/close.svg",
} as const;

const TTL_FILL =
  "linear-gradient(90deg, #7053f3 0%, #76bab2 74.167%, #e3ff94 161.52%)";

function Divider() {
  return (
    <div
      style={{
        height: 1,
        width: "100%",
        background: "rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    />
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid rgba(227,231,234,0.1)",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.6)",
          textTransform: "capitalize",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SetupRow({
  label,
  value,
  pct,
  pctColor,
  valueColor,
}: {
  label: string;
  value: string;
  pct?: string;
  pctColor?: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: 24,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
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
              lineHeight: "18px",
              color: pctColor ?? "rgba(255,255,255,0.4)",
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
            lineHeight: "18px",
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

function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        borderRadius: 8,
        background: "rgba(255,255,255,0.05)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SignalDetailModal({
  signalId,
  onClose,
  onViewAll,
  onTradeNow,
  onAskAgent,
  asPage = false,
}: {
  signalId: string;
  onClose: () => void;
  onViewAll: () => void;
  onTradeNow: (data: SignalCardData) => void;
  onAskAgent: (data: SignalCardData) => void;
  /** Compact: render as full-page panel instead of overlay dialog */
  asPage?: boolean;
}) {
  const data = findMarketOrSignalCard(signalId);
  const { label: timerLabel, progress: ttlProgress } = useSignalCountdownState(
    data.id,
    data.timer,
  );
  const sideColor = data.side === "SHORT" ? "#ff41a3" : "#46ccb9";
  const ttlMin = data.ttl.replace(/^TTL\s+/i, "");
  const bearish = data.indicatorNote.match(/(\d+)\s+of\s+(\d+)/);
  const bearishLabel = bearish ? `${bearish[1]}/${bearish[2]}` : "3/6";
  const funding = data.fundingRate.split(" · ")[0];
  const ls = data.longShortRatio.split(" · ")[0];

  const shell = (
      <div
        role="dialog"
        aria-label={`${data.symbol} signal details`}
        onClick={asPage ? undefined : (e) => e.stopPropagation()}
        style={{
          width: asPage ? "100%" : "min(920px, 100%)",
          height: asPage ? "100%" : undefined,
          maxHeight: asPage ? "100%" : "min(860px, calc(100dvh - 32px))",
          overflow: asPage ? "hidden" : "auto",
          borderRadius: asPage ? 0 : 8,
          border: asPage ? "none" : "1px solid #383838",
          background: "#0c0d10",
          fontFamily: FONT,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #383838",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {asPage ? (
              <button
                type="button"
                aria-label="Back"
                onClick={onClose}
                style={{
                  width: 20,
                  height: 20,
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
                  src="/trade/tpsl/back.svg"
                  alt=""
                  width={18}
                  height={18}
                  style={{ display: "block", width: 18, height: 18 }}
                />
              </button>
            ) : null}
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "0.16px",
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
          {!asPage ? (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{
                width: 20,
                height: 20,
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
                width={20}
                height={20}
                style={{ display: "block", width: 20, height: 20 }}
              />
            </button>
          ) : (
            <span style={{ width: 20, flexShrink: 0 }} aria-hidden />
          )}
        </div>

        <div
          className={asPage ? "signal-detail-page-scroll" : undefined}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "16px 20px 20px",
            boxSizing: "border-box",
            ...(asPage
              ? {
                  flex: 1,
                  minHeight: 0,
                  overflow: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }
              : null),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "4px 16px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                flexShrink: 0,
              }}
            >
              TTL
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                flexShrink: 0,
                minWidth: 64,
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum" 1, "lnum" 1',
                display: "inline-block",
                textAlign: "left",
              }}
            >
              {timerLabel}
            </span>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                height: 4,
                borderRadius: 999,
                background: "rgba(227,231,234,0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, ttlProgress * 100))}%`,
                  height: "100%",
                  background: TTL_FILL,
                  transition: "width 1s linear",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {ttlMin}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1 1 280px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Panel>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "capitalize",
                  }}
                >
                  Trade Setup
                </span>
                <Divider />
                <SetupRow label="Entry (limit)" value={data.entry} />
                <SetupRow
                  label="Stop loss"
                  value={data.stopLoss}
                  pct={data.stopLossPct}
                  pctColor="#ff41a3"
                  valueColor="#ff41a3"
                />
                <SetupRow
                  label="Take profit"
                  value={data.takeProfit}
                  pct={data.takeProfitPct}
                  pctColor="#46ccb9"
                  valueColor="#46ccb9"
                />
              </Panel>

              <div style={{ display: "flex", gap: 8 }}>
                <MetricBox label="R:R" value={data.rr} />
                <MetricBox label="Score" value={data.signalScore} />
                <MetricBox
                  label={data.side === "SHORT" ? "Bearish" : "Bullish"}
                  value={bearishLabel}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid rgba(227,231,234,0.1)",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "capitalize",
                  }}
                >
                  Why This Signal
                </span>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.05)",
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: "20px",
                    backgroundImage: GRADIENTS.aiText,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  AI detected sudden overbought state on 4H interval aligned with
                  key historical resistance. Optimized entry point: OKX, no
                  slippage concerns.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(227,231,234,0.1)",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Hunt Titan · SAGE
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    7D win rate 58% · Signals: 42
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onViewAll}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: FONT,
                  }}
                >
                  View Source ›
                </button>
              </div>
            </div>

            <div
              style={{
                flex: "1 1 280px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Panel style={{ flex: 1, background: "transparent", padding: 16 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "capitalize",
                  }}
                >
                  Price Structure
                </span>
                <PriceStructureChart data={data} />
                <Divider />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Order book imbalance
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>0.06</span>
                    <span
                      style={{
                        padding: "0 4px",
                        borderRadius: 4,
                        background: "rgba(255,65,163,0.1)",
                        color: "#ff41a3",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Sell
                    </span>
                  </div>
                </div>
                {(
                  [
                    ["Funding rate", funding],
                    ["Open interest", data.openInterest],
                    ["Long / short ratio", ls],
                  ] as const
                ).map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </Panel>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: asPage ? "stretch" : "space-between",
            gap: 12,
            padding: asPage ? "12px 16px 16px" : "12px 20px 16px",
            borderTop: "1px solid #383838",
            flexWrap: asPage ? "nowrap" : "wrap",
            flexShrink: 0,
            width: "100%",
            boxSizing: "border-box",
            background: "#0c0d10",
          }}
        >
          {!asPage ? (
            <button
              type="button"
              onClick={onViewAll}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT,
              }}
            >
              View all signals ({MARKET_ACTIVE_SIGNALS.length} active)
            </button>
          ) : null}
          <div
            style={{
              display: "flex",
              gap: 8,
              width: asPage ? "100%" : undefined,
              flex: asPage ? 1 : undefined,
            }}
          >
            <button
              type="button"
              onClick={() => onAskAgent(data)}
              style={{
                flex: asPage ? 1 : undefined,
                minWidth: asPage ? 0 : 120,
                height: 36,
                padding: "0 16px",
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
                flex: asPage ? 1 : undefined,
                minWidth: asPage ? 0 : 120,
                height: 36,
                padding: "0 16px",
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

  if (asPage) {
    return (
      <>
        <style>{`
          .signal-detail-page-scroll::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>
        {shell}
      </>
    );
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      {shell}
    </div>
  );
}
