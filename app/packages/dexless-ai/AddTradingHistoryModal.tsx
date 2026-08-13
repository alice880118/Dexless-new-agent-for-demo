import { useState } from "react";
import { FONT, FONT_WEIGHT, GRADIENTS } from "../nav/design-system";
import { DexlessDialogShell } from "./DexlessDialogShell";
import { LogoStack } from "./LogoStack";
import {
  DEXLESS_TRADES,
  EXTERNAL_VENUES,
  EXTERNAL_VENUE_TRADES,
  FULL_TRADE_COUNT,
  formatTradeCount,
} from "./venues";

type Props = {
  open: boolean;
  onClose: () => void;
  onAddAndRebuild: () => void;
};

/** Return-flow — Add trading history (dialog ≥768 / drawer <768) */
export function AddTradingHistoryModal({
  open,
  onClose,
  onAddAndRebuild,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <DexlessDialogShell
      open={open}
      onClose={onClose}
      titleId="dexless-ai-add-history-title"
      title="Add trading history"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "16px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Adding these will rebuild your Trader DNA from{" "}
          <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
            {formatTradeCount(FULL_TRADE_COUNT)} trades
          </span>{" "}
          instead of {formatTradeCount(DEXLESS_TRADES)}.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
          }}
        >
          <div
            style={{
              borderRadius: 8,
              border: "none",
              background: "rgba(255,255,255,0.05)",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: 12,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: FONT,
                boxSizing: "border-box",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.9)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTradeCount(EXTERNAL_VENUE_TRADES)} trades on{" "}
                {EXTERNAL_VENUES.length} venues
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <LogoStack logos={EXTERNAL_VENUES} />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: expanded ? "rotate(180deg)" : undefined,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="M4 6.5 8 10.5 12 6.5" />
                </svg>
              </span>
            </button>
            {expanded ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: "0 12px 12px",
                }}
              >
                {EXTERNAL_VENUES.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      lineHeight: "18px",
                    }}
                  >
                    <img
                      src={v.icon}
                      alt=""
                      width={18}
                      height={18}
                      style={{
                        display: "block",
                        width: 18,
                        height: 18,
                        borderRadius: 99,
                        objectFit: "cover",
                        flexShrink: 0,
                        background: "#0c0d10",
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 500,
                      }}
                    >
                      {v.name}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatTradeCount(v.trades)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: "100%",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Read-only history. No signature, no access to funds. Change anytime in
              Settings.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
              }}
            >
              <button
                type="button"
                onClick={onAddAndRebuild}
                style={{
                  width: "100%",
                  height: 40,
                  border: "none",
                  borderRadius: 999,
                  background: GRADIENTS.connectBtn,
                  color: "#fff",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: FONT_WEIGHT.medium,
                  lineHeight: "20px",
                  cursor: "pointer",
                }}
              >
                Add and rebuild
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: "100%",
                  height: 40,
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: FONT_WEIGHT.medium,
                  lineHeight: "20px",
                  cursor: "pointer",
                }}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </DexlessDialogShell>
  );
}
