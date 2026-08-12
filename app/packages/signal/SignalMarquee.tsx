import { useState, type CSSProperties } from "react";
import { FONT, GRADIENTS } from "../nav/design-system";
import type { Breakpoint } from "../nav/design-system";
import { MARQUEE_HEIGHT, MARQUEE_ITEMS, type MarqueeTickerItem } from "./data";

const ASSETS = {
  dot: "/signal/dot.svg",
  chevron: "/signal/chevron.svg",
  signal: "/signal/marquee-signal.svg",
} as const;

const ACTIVE_BADGE =
  "linear-gradient(90deg, #7053f3 0%, #76bab2 74.167%, #e3ff94 161.52%)";

function TickerItem({
  item,
  onClick,
}: {
  item: MarqueeTickerItem;
  onClick: () => void;
}) {
  const sideColor = item.side === "LONG" ? "#46ccb9" : "#ff41a3";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        fontFamily: FONT,
        whiteSpace: "nowrap",
      }}
    >
      <img
        src={ASSETS.dot}
        alt=""
        width={4}
        height={4}
        style={{ display: "block", width: 4, height: 4, flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "18px",
          color: "#ffffff",
        }}
      >
        {item.symbol}
      </span>
      <span
        style={{
          padding: "0 4px",
          borderRadius: 4,
          background: "rgba(227,231,234,0.05)",
          color: sideColor,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "18px",
        }}
      >
        {item.side}
      </span>
      <span
        style={{
          width: 1,
          height: 11,
          background: "#464646",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          letterSpacing: "-0.36px",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, lineHeight: "12px" }}>
          Entry
        </span>
        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, lineHeight: "12px" }}>
          {item.entry}
        </span>
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          letterSpacing: "-0.36px",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 400, lineHeight: "12px" }}>
          Score
        </span>
        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, lineHeight: "12px" }}>
          {item.score}
        </span>
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "12px",
          letterSpacing: "-0.36px",
          color: item.pnlPositive ? "#46ccb9" : "#ff41a3",
          fontVariantNumeric: "tabular-nums",
          minWidth: 52,
          display: "inline-block",
          textAlign: "right",
        }}
      >
        {item.pnlTime}
      </span>
      <span
        style={{
          padding: "2px 6px",
          borderRadius: 4,
          background: ACTIVE_BADGE,
          color: "#ffffff",
          fontSize: 10,
          fontWeight: 600,
          lineHeight: "normal",
        }}
      >
        ACTIVE
      </span>
    </button>
  );
}

export function SignalMarquee({
  breakpoint,
  onSelectSignal,
  onViewAll,
}: {
  breakpoint: Breakpoint;
  onSelectSignal: (signalId: string) => void;
  onViewAll: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const under768 = breakpoint === "390" || breakpoint === "768";
  const pauseOnHover = !under768;
  const trackItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const trackStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 32,
    width: "max-content",
    animation: under768
      ? "signalMarqueeScroll 80s linear infinite"
      : "signalMarqueeScroll 40s linear infinite",
    animationPlayState: paused ? "paused" : "running",
  };

  return (
    <div
      style={{
        height: MARQUEE_HEIGHT,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: under768 ? "0 12px" : "0 16px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "linear-gradient(90deg, #1b1b1b 0%, #2a2a2a 50%, #1b1b1b 100%)",
        fontFamily: FONT,
        overflow: "hidden",
      }}
      onMouseEnter={() => {
        if (pauseOnHover) setPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setPaused(false);
      }}
    >
      <style>{`
        @keyframes signalMarqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: under768 ? 10 : 20,
          overflow: "hidden",
        }}
      >
        {under768 ? (
          <button
            type="button"
            aria-label="Open signals"
            onClick={onViewAll}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxSizing: "border-box",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <img
              src={ASSETS.signal}
              alt=""
              width={14}
              height={14}
              style={{ display: "block", width: 14, height: 14 }}
            />
          </button>
        ) : (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "2px 8px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                backgroundImage: GRADIENTS.aiText,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              LIVE SIGNALS
            </span>
            <span
              style={{
                width: 1,
                height: 11,
                background: "rgba(227,231,234,0.1)",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "12px",
                letterSpacing: "-0.36px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              16
            </span>
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0, overflow: "hidden", position: "relative" }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 28,
              zIndex: 2,
              pointerEvents: "none",
              background:
                "linear-gradient(90deg, #1f1f1f 0%, rgba(31,31,31,0) 100%)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 28,
              zIndex: 2,
              pointerEvents: "none",
              background:
                "linear-gradient(270deg, #1f1f1f 0%, rgba(31,31,31,0) 100%)",
            }}
          />
          <div style={trackStyle}>
            {trackItems.map((item, idx) => (
              <TickerItem
                key={`${item.id}-${idx}`}
                item={item}
                onClick={() => onSelectSignal(item.signalId)}
              />
            ))}
          </div>
        </div>
      </div>

      {!under768 && (
        <button
          type="button"
          onClick={onViewAll}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            flexShrink: 0,
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            All signals
          </span>
          <img
            src={ASSETS.chevron}
            alt=""
            width={12}
            height={12}
            style={{ display: "block", width: 12, height: 12 }}
          />
        </button>
      )}
    </div>
  );
}
