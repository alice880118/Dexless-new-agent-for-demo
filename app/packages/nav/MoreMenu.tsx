import type { CSSProperties } from "react";
import { COLORS, FONT, NAV_ASSETS } from "./tokens";

type MoreMenuProps = {
  onSelect?: (id: "docs" | "swap") => void;
  style?: CSSProperties;
};

const itemBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  width: "100%",
  minWidth: 90,
  padding: 8,
  borderRadius: 8,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: FONT,
  boxSizing: "border-box",
};

export function MoreMenu({ onSelect, style }: MoreMenuProps) {
  return (
    <div
      style={{
        background: COLORS.menuBg,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        borderRadius: 6,
        width: 300,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => onSelect?.("swap")}
        style={itemBase}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.menuHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img
              src={NAV_ASSETS.menuSwap}
              alt=""
              style={{ width: 16, height: 16, display: "block", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: "#ffffff",
              }}
            >
              Swap
            </span>
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              color: COLORS.white40,
            }}
          >
            Multi-chain swap any altcoin, memecoin, or native asset
          </span>
        </span>
        <img
          src={NAV_ASSETS.chevronRight}
          alt=""
          style={{ width: 16, height: 16, display: "block", flexShrink: 0 }}
        />
      </button>

      <button
        type="button"
        onClick={() => onSelect?.("docs")}
        style={itemBase}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.menuHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
            minWidth: 0,
          }}
        >
          <img
            src={NAV_ASSETS.menuDocs}
            alt=""
            style={{ width: 16, height: 16, display: "block", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "#ffffff",
            }}
          >
            Docs
          </span>
        </span>
        <img
          src={NAV_ASSETS.externalLink}
          alt=""
          style={{ width: 24, height: 24, display: "block", flexShrink: 0 }}
        />
      </button>
    </div>
  );
}
