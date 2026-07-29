import { useState, type CSSProperties } from "react";
import {
  COLORS,
  FONT,
  GRADIENTS,
  CLOSE_ICON_SIZE,
  DOCS_URL,
  FOOTER_ASSETS,
  LOGO_HEIGHT,
  LOGO_WIDTH,
  NAV_ASSETS,
  TWITTER_URL,
} from "./design-system";
import type { NavPageId } from "./navPages";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
  walletAddress?: string;
  activePage?: NavPageId | null;
  onNavigate?: (page: NavPageId) => void;
  onOpenAgent?: () => void;
  walletConnected?: boolean;
  /** >=768: hover bg; <768: no hover / no selected bg */
  enableHover?: boolean;
};

type NavItemConfig = {
  id: string;
  label: string;
  icon: string;
  page?: NavPageId;
  expandable?: boolean;
  children?: { id: string; label: string; page?: NavPageId; external?: boolean }[];
  airdrop?: boolean;
};

const NAV_ITEMS: NavItemConfig[] = [
  { id: "ai", label: "DEXless AI", icon: NAV_ASSETS.menuAi, page: "dexless_ai" },
  {
    id: "trade",
    label: "Trading",
    icon: NAV_ASSETS.menuTrading,
    page: "trade_perps",
  },
  { id: "markets", label: "Markets", icon: NAV_ASSETS.menuMarkets, page: "markets" },
  { id: "portfolio", label: "Portfolio", icon: NAV_ASSETS.menuPortfolio, page: "portfolio" },
  { id: "referrals", label: "Referrals", icon: NAV_ASSETS.menuReferrals, page: "referrals" },
  { id: "points", label: "Points", icon: NAV_ASSETS.menuPoints, page: "points" },
  { id: "vaults", label: "Vaults", icon: NAV_ASSETS.menuVaults, page: "vaults" },
  {
    id: "more",
    label: "More",
    icon: NAV_ASSETS.menuMoreDots,
    expandable: true,
    children: [
      { id: "swap", label: "Swap", page: "trade_swap" },
      { id: "docs", label: "Docs", external: true },
    ],
  },
  { id: "airdrop", label: "Airdrop", icon: NAV_ASSETS.dexlessLogo, airdrop: true, page: "airdrop" },
];

function SubItem({
  label,
  active,
  enableHover = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  enableHover?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        width: 244,
        maxWidth: "100%",
        padding: "6px 10px",
        border: "none",
        borderRadius: 4,
        background: enableHover && active ? COLORS.menuHover : "transparent",
        cursor: "pointer",
        fontFamily: FONT,
        textAlign: "left",
        boxSizing: "border-box",
      }}
      onMouseEnter={
        enableHover
          ? (e) => {
              e.currentTarget.style.background = COLORS.menuHover;
            }
          : undefined
      }
      onMouseLeave={
        enableHover
          ? (e) => {
              e.currentTarget.style.background =
                enableHover && active ? COLORS.menuHover : "transparent";
            }
          : undefined
      }
    >
      <span
        style={{
          paddingLeft: 26,
          fontSize: 16,
          fontWeight: 500,
          lineHeight: "26px",
          color: "rgba(255,255,255,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function SideNavItem({
  label,
  icon,
  expandable,
  expanded,
  active,
  enableHover = false,
  onClick,
  airdrop,
}: {
  label: string;
  icon?: string;
  expandable?: boolean;
  expanded?: boolean;
  active?: boolean;
  enableHover?: boolean;
  onClick?: () => void;
  airdrop?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "6px 10px",
        border: "none",
        borderRadius: 4,
        background: enableHover && active ? COLORS.menuHover : "transparent",
        cursor: expandable || onClick ? "pointer" : "default",
        fontFamily: FONT,
      }}
      onMouseEnter={
        enableHover
          ? (e) => {
              e.currentTarget.style.background = COLORS.menuHover;
            }
          : undefined
      }
      onMouseLeave={
        enableHover
          ? (e) => {
              e.currentTarget.style.background =
                enableHover && active ? COLORS.menuHover : "transparent";
            }
          : undefined
      }
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon ? (
          <img src={icon} alt="" style={{ width: 20, height: 20, display: "block" }} />
        ) : null}
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "26px",
            color: airdrop ? "rgba(255,255,255,0.9)" : "#ffffff",
          }}
        >
          {label}
        </span>
      </span>
      {expandable && (
        <img
          src={NAV_ASSETS.chevronDown}
          alt=""
          style={{
            width: 19,
            height: 19,
            display: "block",
            transform: expanded ? "rotate(180deg)" : undefined,
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        />
      )}
    </button>
  );
}

export function SideMenu({
  open,
  onClose,
  walletAddress = "0x4555…db1d",
  activePage = null,
  onNavigate,
  onOpenAgent,
  walletConnected = false,
  enableHover = false,
}: SideMenuProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    trade: false,
    more: false,
  });

  if (!open) return null;

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const panelStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    zIndex: 1200,
    background: "#0c0d10",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT,
    overflow: "hidden",
  };

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          background: "rgba(0,0,0,0.5)",
        }}
      />
      <aside style={panelStyle}>
        <style>{`
          .side-menu-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
        `}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            flexShrink: 0,
          }}
        >
          <img
            src={NAV_ASSETS.logo}
            alt="DEXLESS"
            style={{
              width: LOGO_WIDTH,
              height: LOGO_HEIGHT,
              minWidth: LOGO_WIDTH,
              minHeight: LOGO_HEIGHT,
              display: "block",
              objectFit: "contain",
            }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{
              width: CLOSE_ICON_SIZE,
              height: CLOSE_ICON_SIZE,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={NAV_ASSETS.menuClose}
              alt="Close"
              style={{
                width: CLOSE_ICON_SIZE,
                height: CLOSE_ICON_SIZE,
                display: "block",
              }}
            />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "0 12px 12px",
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="side-menu-scroll"
        >
          {walletConnected && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                marginTop: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src={NAV_ASSETS.menuAccount}
                  alt=""
                  style={{ width: 24, height: 24, display: "block", opacity: 0.8 }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "20px",
                      color: "#ffffff",
                    }}
                  >
                    {walletAddress}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "20px",
                      color: COLORS.white50,
                    }}
                  >
                    ID: 0x...5d68
                  </div>
                </div>
              </div>
              <img
                src={NAV_ASSETS.menuSwapAccount}
                alt=""
                style={{ width: 15, height: 15, display: "block" }}
              />
            </div>
          )}

          {walletConnected && (
            <button
              type="button"
              onClick={() => {
                onOpenAgent?.();
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                width: "100%",
                padding: "6px 8px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                backgroundImage: GRADIENTS.connectBtn,
                fontFamily: FONT,
              }}
            >
              <img
                src={NAV_ASSETS.menuTradeDna}
                alt=""
                style={{ width: 18, height: 18, display: "block" }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#ffffff",
                }}
              >
                Talk to Trade DNA
              </span>
            </button>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: walletConnected ? 0 : 12,
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isOpen = !!expanded[item.id];
              const parentActive =
                !!item.page && activePage === item.page;
              return (
                <div key={item.id} style={{ width: "100%" }}>
                  <SideNavItem
                    label={item.label}
                    icon={item.icon}
                    expandable={item.expandable}
                    expanded={isOpen}
                    active={parentActive}
                    enableHover={enableHover}
                    airdrop={item.airdrop}
                    onClick={() => {
                      if (item.expandable) {
                        toggle(item.id);
                        return;
                      }
                      if (item.page) onNavigate?.(item.page);
                    }}
                  />
                  {item.expandable && isOpen && item.children && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      {item.children.map((child) => (
                        <SubItem
                          key={child.id}
                          label={child.label}
                          active={
                            !!child.page && activePage === child.page
                          }
                          enableHover={enableHover}
                          onClick={() => {
                            if (child.external) {
                              window.open(
                                DOCS_URL,
                                "_blank",
                                "noopener,noreferrer",
                              );
                              onClose();
                              return;
                            }
                            if (child.page) onNavigate?.(child.page);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              width: "100%",
              height: 1,
              background: COLORS.white10,
              flexShrink: 0,
            }}
          />

          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "6px 10px",
              border: "none",
              borderRadius: 4,
              background: "transparent",
              cursor: "pointer",
              fontFamily: FONT,
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: COLORS.white70,
              }}
            >
              Dexless Support
            </span>
          </button>

          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "6px 10px",
              border: "none",
              borderRadius: 4,
              background: "transparent",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: COLORS.white70,
              }}
            >
              Language
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: COLORS.white70,
              }}
            >
              English
              <img
                src={NAV_ASSETS.chevronDown}
                alt=""
                style={{
                  width: 19,
                  height: 19,
                  display: "block",
                  transform: "rotate(-90deg)",
                }}
              />
            </span>
          </button>
        </div>

        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12, color: COLORS.white50, whiteSpace: "nowrap" }}>
            How to trade on Dexless?
          </span>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              flexShrink: 0,
            }}
          >
            <img
              src={FOOTER_ASSETS.twitter}
              alt=""
              width={24}
              height={24}
              style={{ display: "block", width: 24, height: 24, objectFit: "contain" }}
            />
          </a>
        </div>
      </aside>
    </>
  );
}
