import type { ReactNode } from "react";
import { FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { LogoStack } from "./LogoStack";
import {
  ALL_VENUE_COUNT,
  DEXLESS_TRADES,
  DEXLESS_VENUE,
  EXTERNAL_VENUES,
  FULL_TRADE_COUNT,
  formatTradeCount,
} from "./venues";

export type PlatformConnectionMode = "connected" | "unconnected";

type Props = {
  mode: PlatformConnectionMode;
  onManage?: () => void;
  onConnect?: () => void;
  /** Inserted between Analysis Period and venues row on <768 */
  actions?: ReactNode;
};

function AnalysisPeriodBlock({ stacked }: { stacked?: boolean }) {
  if (stacked) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          height: 32,
          padding: 0,
          boxSizing: "border-box",
          flexWrap: "nowrap",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Analysis Period
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "12px",
            letterSpacing: "-0.36px",
            color: "rgba(255,255,255,0.8)",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Feb 10, 2026 | 06:24 – 08:48 (UTC)
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        Analysis Period
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "12px",
          letterSpacing: "-0.36px",
          color: "rgba(255,255,255,0.8)",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        Feb 10, 2026 | 06:24 – 08:48 (UTC)
      </span>
    </div>
  );
}

function VenuesControls({
  connected,
  isCompact,
  onManage,
  onConnect,
}: {
  connected: boolean;
  isCompact: boolean;
  onManage?: () => void;
  onConnect?: () => void;
}) {
  const connectedLogos = [DEXLESS_VENUE, ...EXTERNAL_VENUES];

  if (connected) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: isCompact ? "flex-start" : "flex-end",
          width: isCompact ? "100%" : undefined,
        }}
      >
        {!isCompact ? (
          <>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              Data sources
            </span>
            <LogoStack logos={connectedLogos} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "12px",
                letterSpacing: "-0.36px",
                color: "rgba(255,255,255,0.8)",
                whiteSpace: "nowrap",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTradeCount(FULL_TRADE_COUNT)} trades
            </span>
          </>
        ) : null}
        <button
          type="button"
          onClick={onManage}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 8px",
            borderRadius: 999,
            border: "none",
            background: "rgba(227,231,234,0.05)",
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "12px",
              letterSpacing: "-0.36px",
              color: "rgba(255,255,255,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {isCompact ? "Across venues" : `Across ${ALL_VENUE_COUNT} venues`}
          </span>
          {isCompact ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginLeft: 20,
                flexShrink: 0,
              }}
            >
              <LogoStack logos={EXTERNAL_VENUES} />
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 4.5 6 7.5 9 4.5" />
              </svg>
            </span>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{ marginLeft: 8 }}
            >
              <path d="M3 4.5 6 7.5 9 4.5" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: isCompact ? "flex-start" : "flex-end",
        width: isCompact ? "100%" : undefined,
      }}
    >
      {!isCompact ? (
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          Data sources
        </span>
      ) : null}
      <img
        src={DEXLESS_VENUE.icon}
        alt="Dexless"
        width={16}
        height={16}
        style={{
          display: "block",
          width: 16,
          height: 16,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "12px",
          letterSpacing: "-0.36px",
          color: "rgba(255,255,255,0.8)",
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        Dexless {formatTradeCount(DEXLESS_TRADES)} trades
      </span>
      <span
        style={{
          width: 1,
          height: 8,
          background: "#4c4c4c",
          flexShrink: 0,
        }}
      />
      <button
        type="button"
        onClick={onConnect}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 8px",
          borderRadius: 999,
          border: "none",
          background: "rgba(227,231,234,0.1)",
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        <LogoStack logos={EXTERNAL_VENUES.slice(0, 2)} visible={2} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "12px",
            letterSpacing: "-0.36px",
            color: "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          Add more
        </span>
      </button>
    </div>
  );
}

/** Shared Connected / Unconnected platforms status bar (Figma 7782:85238 / 7783:85403) */
export function PlatformConnectionNav({
  mode,
  onManage,
  onConnect,
  actions,
}: Props) {
  const isCompact = useBreakpoint() === "390";
  const connected = mode === "connected";

  if (isCompact) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          padding: 0,
          fontFamily: FONT,
          boxSizing: "border-box",
        }}
      >
        <AnalysisPeriodBlock stacked />
        {actions ? actions : null}
        <VenuesControls
          connected={connected}
          isCompact
          onManage={onManage}
          onConnect={onConnect}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
        height: 32,
        padding: 0,
        flexWrap: "wrap",
        fontFamily: FONT,
        boxSizing: "border-box",
      }}
    >
      <AnalysisPeriodBlock />
      <VenuesControls
        connected={connected}
        isCompact={false}
        onManage={onManage}
        onConnect={onConnect}
      />
    </div>
  );
}
