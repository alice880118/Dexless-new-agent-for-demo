import { useState, type ReactNode } from "react";
import { FONT, FONT_WEIGHT, GRADIENTS } from "../nav/design-system";
import { DexlessDialogShell } from "./DexlessDialogShell";
import { LogoStack } from "./LogoStack";
import {
  ALL_VENUE_COUNT,
  DEXLESS_TRADES,
  DEXLESS_VENUE,
  EXTERNAL_VENUES,
  EXTERNAL_VENUE_TRADES,
  FULL_TRADE_COUNT,
  formatTradeCount,
} from "./venues";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When true, external venues are already included in analysis */
  includesExternal?: boolean;
};

const ROW_SHELL = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px",
  borderRadius: 8,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.05)",
  boxSizing: "border-box" as const,
};

/** Data sources detail (dialog ≥768 / drawer <768) — Figma 7782:85264 */
export function DataSourcesModal({
  open,
  onClose,
  includesExternal = true,
}: Props) {
  const [venuesExpanded, setVenuesExpanded] = useState(false);

  const lede: ReactNode = includesExternal ? (
    <>
      Your analysis includes{" "}
      <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
        {formatTradeCount(FULL_TRADE_COUNT)} trades
      </span>{" "}
      across {ALL_VENUE_COUNT} venues.
    </>
  ) : (
    <>
      {formatTradeCount(EXTERNAL_VENUE_TRADES)} trades on {EXTERNAL_VENUES.length}{" "}
      venues aren&apos;t in this analysis — they&apos;d sharpen your leverage and
      exit-timing read.
    </>
  );

  return (
    <DexlessDialogShell
      open={open}
      onClose={onClose}
      titleId="dexless-ai-data-sources-title"
      title="Data sources"
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
          {lede}
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
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
            }}
          >
            <div style={ROW_SHELL}>
              <img
                src={DEXLESS_VENUE.icon}
                alt=""
                width={26}
                height={26}
                style={{
                  display: "block",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  background: "#0c0d10",
                }}
              />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {DEXLESS_VENUE.name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: "18px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Jan 2026 – now
                </span>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.9)",
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTradeCount(DEXLESS_TRADES)}
              </span>
            </div>

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
              aria-expanded={venuesExpanded}
              onClick={() => setVenuesExpanded((v) => !v)}
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
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.9)",
                  whiteSpace: "nowrap",
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
                    transform: venuesExpanded ? "rotate(180deg)" : undefined,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path d="M4 6.5 8 10.5 12 6.5" />
                </svg>
              </span>
            </button>
            {venuesExpanded ? (
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
              Last synced 4 min ago
            </p>

            <button
              type="button"
              onClick={onClose}
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
              Done
            </button>
          </div>
        </div>
      </div>
    </DexlessDialogShell>
  );
}
