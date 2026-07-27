import type { CSSProperties } from "react";
import {
  COLORS,
  FONT,
  FOOTER_ASSETS,
  FOOTER_HEIGHT,
  HOW_TO_TRADE_URL,
  ORDERLY_URL,
  TWITTER_URL,
} from "./design-system";

const OPERATIONAL_COLOR = "#46ccb9";

const dividerStyle: CSSProperties = {
  width: 1,
  height: 14,
  background: COLORS.white40,
  flexShrink: 0,
};

export function SiteFooter() {
  return (
    <footer
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: FOOTER_HEIGHT,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 12px",
        boxSizing: "border-box",
        background: COLORS.bottomBg,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 12,
          }}
          aria-hidden
        >
          {[3, 6, 9, 12].map((h) => (
            <span
              key={h}
              style={{
                width: 2,
                height: h,
                borderRadius: 2,
                background: OPERATIONAL_COLOR,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: OPERATIONAL_COLOR,
            whiteSpace: "nowrap",
          }}
        >
          Operational
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        <a
          href={HOW_TO_TRADE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "18px",
            color: COLORS.white60,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          How to trade on Dexless?
        </a>

        <span style={dividerStyle} aria-hidden />

        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            flexShrink: 0,
          }}
        >
          <img
            src={FOOTER_ASSETS.twitter}
            alt=""
            width={20}
            height={20}
            style={{ display: "block", width: 20, height: 20 }}
          />
        </a>

        <span style={dividerStyle} aria-hidden />

        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              color: COLORS.white60,
              whiteSpace: "nowrap",
            }}
          >
            Powered by
          </span>
          <a
            href={ORDERLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Orderly"
            style={{
              display: "flex",
              alignItems: "center",
              height: 14,
              flexShrink: 0,
            }}
          >
            <img
              src={FOOTER_ASSETS.orderly}
              alt="Orderly"
              width={45}
              style={{ display: "block", width: 45, height: "auto" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
