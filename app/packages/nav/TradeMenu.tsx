import type { CSSProperties } from "react";
import { COLORS, FONT, NAV_ASSETS } from "./tokens";

type TradeMenuProps = {
  onSelect?: (id: "perps" | "swap") => void;
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

export function TradeMenu({ onSelect, style }: TradeMenuProps) {
  const items = [
    {
      id: "perps" as const,
      title: "Perps",
      desc: "High-liquidity crypto perps with up to 100x leverage",
      icon: NAV_ASSETS.menuPerps,
    },
    {
      id: "swap" as const,
      title: "Swap",
      desc: "Multi-chain swap any altcoin, memecoin, or native asset",
      icon: NAV_ASSETS.menuSwap,
    },
  ];

  return (
    <div
      style={{
        background: COLORS.menuBg,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        borderRadius: 6,
        width: 320,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item.id)}
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
                src={item.icon}
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
                {item.title}
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
              {item.desc}
            </span>
          </span>
          <img
            src={NAV_ASSETS.chevronRight}
            alt=""
            style={{ width: 17, height: 17, display: "block", flexShrink: 0 }}
          />
        </button>
      ))}
    </div>
  );
}
