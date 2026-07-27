import { useState, type CSSProperties } from "react";
import { COLORS, FONT, NAV_ASSETS, type Breakpoint } from "./tokens";

type BottomNavItem = {
  id: string;
  label: string;
  icon: string;
  iconActive: string;
};

const ITEMS: BottomNavItem[] = [
  {
    id: "trading",
    label: "Trading",
    icon: NAV_ASSETS.bnTrading,
    iconActive: NAV_ASSETS.bnTradingActive,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: NAV_ASSETS.bnPortfolio,
    iconActive: NAV_ASSETS.bnPortfolioActive,
  },
  {
    id: "ai",
    label: "DEXless AI",
    icon: NAV_ASSETS.bnAi,
    iconActive: NAV_ASSETS.bnAiActive,
  },
  {
    id: "markets",
    label: "Markets",
    icon: NAV_ASSETS.bnMarkets,
    iconActive: NAV_ASSETS.bnMarketsActive,
  },
  {
    id: "referrals",
    label: "Referrals",
    icon: NAV_ASSETS.bnReferrals,
    iconActive: NAV_ASSETS.bnReferralsActive,
  },
];

type BottomNavBarProps = {
  breakpoint: Breakpoint;
  activeId?: string | null;
  onChange?: (id: string) => void;
  style?: CSSProperties;
};

export function BottomNavBar({
  breakpoint,
  activeId,
  onChange,
  style,
}: BottomNavBarProps) {
  const [internalActive, setInternalActive] = useState("trading");
  const active = activeId === undefined ? internalActive : activeId;
  // 768 & 390 share tablet RWD spacing
  const itemWidth = breakpoint === "390" ? 70 : 140;

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: COLORS.bottomBg,
        padding: "8px 12px",
        boxSizing: "border-box",
        fontFamily: FONT,
        ...style,
      }}
    >
      {ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setInternalActive(item.id);
              onChange?.(item.id);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              width: itemWidth,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              fontFamily: FONT,
            }}
          >
            <img
              src={isActive ? item.iconActive : item.icon}
              alt=""
              style={{
                width: 20,
                height: 20,
                display: "block",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: 0.3,
                color: isActive ? "#ffffff" : COLORS.bottomText,
                textAlign: "center",
                whiteSpace: "nowrap",
                lineHeight: "normal",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
