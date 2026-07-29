import { FONT } from "../nav/design-system";
import type { SignalCardData } from "./SignalViews";

const ASSETS = {
  close: "/trader-dna/signal/trade-close.svg",
  clock: "/trader-dna/signal/clock.png",
} as const;

/** Figma 7452:138834 — Signal summary card on Trade page center. */
export function SignalTradeModal({
  data,
  onClose,
}: {
  data: SignalCardData;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="Signal"
      style={{
        width: "100%",
        maxWidth: 360,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 0",
        borderRadius: 8,
        border: "1px solid #717171",
        background: "#121419",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0 12px 4px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: "#ffffff",
              }}
            >
              Signal
            </span>
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
              <span
                style={{
                  position: "relative",
                  display: "block",
                  width: 20,
                  height: 20,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: "16.27% 16.64% 17.01% 16.6%",
                  }}
                >
                  <img
                    src={ASSETS.close}
                    alt=""
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </span>
              </span>
            </button>
          </div>
          <div
            style={{
              height: 1,
              width: "100%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "20px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {data.symbol}
            </span>
            <span
              style={{
                padding: "1px 8px",
                borderRadius: 4,
                background: "rgba(255,65,163,0.05)",
                color: "#ff41a3",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
              }}
            >
              {data.side}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <img
                src={ASSETS.clock}
                alt=""
                width={13}
                height={13}
                style={{ display: "block" }}
              />
              {data.timer}
            </span>
            <span
              style={{
                padding: "2px 6px",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.13)",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {data.ttl}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "0 12px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Entry (limit)
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.48px",
              color: "rgba(255,255,255,0.9)",
              fontVariantNumeric: "tabular-nums lining-nums",
            }}
          >
            {data.entry}
          </span>
        </div>
        <div
          style={{
            height: 1,
            width: "100%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span
              style={{
                width: 70,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Stop loss
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 60,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {data.stopLossPct}
              </span>
              <span
                style={{
                  width: 75,
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "12px",
                  letterSpacing: "-0.42px",
                  color: "#ff41a3",
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {data.stopLoss}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span
              style={{
                width: 70,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Take profit
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 60,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {data.takeProfitPct}
              </span>
              <span
                style={{
                  width: 75,
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "12px",
                  letterSpacing: "-0.42px",
                  color: "#00ffab",
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {data.takeProfit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
