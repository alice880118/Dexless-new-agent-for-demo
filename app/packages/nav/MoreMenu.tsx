import type { CSSProperties } from "react";
import { COLORS, FONT, NAV_ASSETS } from "./tokens";

type MoreMenuProps = {
  onSelect?: (id: "docs") => void;
  style?: CSSProperties;
};

export function MoreMenu({ onSelect, style }: MoreMenuProps) {
  return (
    <div
      style={{
        background: COLORS.menuBg,
        display: "flex",
        flexDirection: "column",
        padding: 12,
        borderRadius: 6,
        width: 300,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => onSelect?.("docs")}
        style={{
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
        }}
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
