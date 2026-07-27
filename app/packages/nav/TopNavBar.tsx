import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { MoreMenu } from "./MoreMenu";
import { SideMenu } from "./SideMenu";
import { TradeMenu } from "./TradeMenu";
import {
  COLORS,
  FONT,
  GRADIENTS,
  LOGO_HEIGHT,
  LOGO_WIDTH,
  MENU_ICON_SIZE,
  NAV_ASSETS,
  NAV_GLOW,
  DOCS_URL,
  isDesktopNav,
  isTabletNav,
  showSideMenu,
  type Breakpoint,
} from "./tokens";
import {
  isTradePage,
  type NavPageId,
} from "./navPages";

export type WalletState = "unconnected" | "connected";
export type OpenMenu = "trade" | "more" | null;

type TopNavBarProps = {
  breakpoint: Breakpoint;
  walletState?: WalletState;
  onWalletStateChange?: (state: WalletState) => void;
  walletAddress?: string;
  totalAssets?: string;
  activePage?: NavPageId | null;
  onNavigate?: (page: NavPageId) => void;
  onOpenAgent?: () => void;
};

function IconBox({
  children,
  size = 20,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

function NavIcon({ src, size = 20, alt = "" }: { src: string; size?: number; alt?: string }) {
  return (
    <IconBox size={size}>
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }}
      />
    </IconBox>
  );
}

function Divider({ height = 28 }: { height?: number }) {
  return (
    <span style={{ width: 1, height, background: COLORS.white20, flexShrink: 0 }} />
  );
}

function BorderedIconButton({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: 8,
        border: `1px solid ${COLORS.white10}`,
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

function NavLink({
  label,
  active = false,
  hasChevron = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  hasChevron?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: active ? 600 : 500,
          lineHeight: "20px",
          color: active ? COLORS.brandGreen : COLORS.white40,
          whiteSpace: "nowrap",
          paddingRight: hasChevron ? 2 : 0,
        }}
      >
        {label}
      </span>
      {hasChevron && (
        <IconBox size={18}>
          <img
            src={NAV_ASSETS.chevronDown}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "contain",
              filter: active
                ? "brightness(0) saturate(100%) invert(91%) sepia(47%) saturate(567%) hue-rotate(26deg) brightness(103%) contrast(101%)"
                : undefined,
            }}
          />
        </IconBox>
      )}
    </button>
  );
}

function AirdropButton({
  active = false,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      style={{
        padding: 1,
        borderRadius: 999,
        backgroundImage: GRADIENTS.airdropBorder,
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "4px 8px",
          borderRadius: 999,
          border: "none",
          background: "#121419",
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        <img
          src={NAV_ASSETS.dexlessLogo}
          alt=""
          style={{ width: 18, height: 18, display: "block" }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: active ? 600 : 500,
            lineHeight: "20px",
            color: active ? COLORS.brandGreen : "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          Airdrop
        </span>
      </button>
    </div>
  );
}

function TotalAssetsBlock({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: COLORS.white60,
          whiteSpace: "nowrap",
        }}
      >
        Total assets
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "12px",
            letterSpacing: "-0.36px",
            color: "#ffffff",
            fontFeatureSettings: '"lnum" 1, "tnum" 1',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: COLORS.white50,
            marginLeft: 2,
          }}
        >
          USDC
        </span>
      </div>
    </div>
  );
}

export function TopNavBar({
  breakpoint,
  walletState: controlledWallet,
  onWalletStateChange,
  walletAddress = "0x4555...dB1D",
  totalAssets,
  activePage = null,
  onNavigate,
  onOpenAgent,
}: TopNavBarProps) {
  const [internalWallet, setInternalWallet] = useState<WalletState>("unconnected");
  const walletState = controlledWallet ?? internalWallet;
  const setWalletState = (next: WalletState) => {
    if (controlledWallet === undefined) setInternalWallet(next);
    onWalletStateChange?.(next);
  };

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const desktop = isDesktopNav(breakpoint);
  // 390 follows 768 RWD layout
  const tablet = isTabletNav(breakpoint);
  const compact = showSideMenu(breakpoint);
  const isConnected = walletState === "connected";
  const assetsLabel = totalAssets ?? (isConnected ? "11,844,543.89" : "-");

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setSideMenuOpen(false);
    setOpenMenu(null);
  }, [breakpoint]);

  useEffect(() => {
    document.body.style.overflow = sideMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sideMenuOpen]);

  const toggleMenu = (menu: OpenMenu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleConnect = () => {
    setWalletState(isConnected ? "unconnected" : "connected");
    setOpenMenu(null);
  };

  const goTo = (page: NavPageId) => {
    onNavigate?.(page);
    setOpenMenu(null);
    setSideMenuOpen(false);
  };

  const tradeActive = isTradePage(activePage) || openMenu === "trade";
  const moreActive = openMenu === "more";
  const tradeLabel =
    activePage === "trade_swap"
      ? "Swap"
      : activePage === "trade_perps"
        ? "Perps"
        : "Trade";

  const barStyle: CSSProperties = {
    position: "relative",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    width: "100%",
    margin: "0 auto",
    padding: "4px 12px",
    boxSizing: "border-box",
    fontFamily: FONT,
    background: "#121419",
  };

  const walletButton = isConnected ? (
    <button
      type="button"
      onClick={handleConnect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        border: "none",
        borderRadius: 6,
        background: "transparent",
        cursor: "pointer",
        padding: "0 2px",
        height: 32,
        minHeight: 32,
        fontFamily: FONT,
        position: "relative",
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "20px",
          color: "#ffffff",
          whiteSpace: "nowrap",
        }}
      >
        {walletAddress}
      </span>
      <img
        src={NAV_ASSETS.walletChevron}
        alt=""
        width={7}
        height={5}
        style={{
          width: 7,
          height: 5,
          display: "block",
          flexShrink: 0,
        }}
      />
    </button>
  ) : (
    <button
      type="button"
      onClick={handleConnect}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 32,
        minHeight: 32,
        padding: "0 16px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        backgroundImage: GRADIENTS.connectBtn,
        fontFamily: FONT,
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "20px",
          color: "rgba(255,255,255,0.9)",
          whiteSpace: "nowrap",
        }}
      >
        Connect wallet
      </span>
    </button>
  );

  const menuButton = (
    <button
      type="button"
      onClick={() => setSideMenuOpen(true)}
      style={{
        width: MENU_ICON_SIZE,
        height: MENU_ICON_SIZE,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <NavIcon src={NAV_ASSETS.menu} size={MENU_ICON_SIZE} alt="Menu" />
    </button>
  );

  return (
    <>
      <header ref={navRef} style={barStyle}>
        {/* Fixed-width left glow — same spacing on every RWD */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: NAV_GLOW.leftWidth,
            backgroundImage: NAV_GLOW.left,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Fixed-width right glow — only when connected, same spacing on every RWD */}
        {isConnected && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: NAV_GLOW.rightWidth,
              backgroundImage: NAV_GLOW.rightConnected,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* Left: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {tablet ? (
            <img
              src={NAV_ASSETS.logoIcon}
              alt="DEXLESS"
              style={{ width: 22, height: 22, display: "block" }}
            />
          ) : (
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
          )}
        </div>

        {/* Center: Desktop tabs */}
        {desktop && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginLeft: 60,
              position: "relative",
              zIndex: 1,
              flex: 1,
            }}
          >
            <button
              type="button"
              onClick={() => goTo("dexless_ai")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              <style>{`
                @keyframes dexlessAiGradientFlow {
                  0% { background-position: 0% 50%; }
                  100% { background-position: -200% 50%; }
                }
              `}</style>
              <img
                src={NAV_ASSETS.sparkle}
                alt=""
                style={{ width: 14, height: 14, display: "block" }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "20px",
                  whiteSpace: "nowrap",
                  backgroundImage:
                    "linear-gradient(90deg, #cbbfff 0%, #76bab2 50%, #e3ff94 100%, #cbbfff 100%)",
                  backgroundSize: activePage === "dexless_ai" ? "200% 100%" : "100% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  animation:
                    activePage === "dexless_ai"
                      ? "dexlessAiGradientFlow 2s linear infinite"
                      : undefined,
                }}
              >
                DEXless AI
              </span>
            </button>

            <div style={{ position: "relative" }}>
              <NavLink
                label={tradeLabel}
                hasChevron
                active={tradeActive}
                onClick={() => toggleMenu("trade")}
              />
              {openMenu === "trade" && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    left: 0,
                    zIndex: 300,
                  }}
                >
                  <TradeMenu
                    onSelect={(id) =>
                      goTo(id === "perps" ? "trade_perps" : "trade_swap")
                    }
                  />
                </div>
              )}
            </div>

            <NavLink
              label="Markets"
              active={activePage === "markets"}
              onClick={() => goTo("markets")}
            />
            <NavLink
              label="Portfolio"
              active={activePage === "portfolio"}
              onClick={() => goTo("portfolio")}
            />
            <NavLink
              label="Referrals"
              active={activePage === "referrals"}
              onClick={() => goTo("referrals")}
            />
            <NavLink
              label="Vaults"
              active={activePage === "vaults"}
              onClick={() => goTo("vaults")}
            />
            <NavLink
              label="Points"
              active={activePage === "points"}
              onClick={() => goTo("points")}
            />

            <div style={{ position: "relative" }}>
              <NavLink
                label="More"
                hasChevron
                active={moreActive}
                onClick={() => toggleMenu("more")}
              />
              {openMenu === "more" && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    left: 0,
                    zIndex: 300,
                  }}
                >
                  <MoreMenu
                    onSelect={() => {
                      window.open(DOCS_URL, "_blank", "noopener,noreferrer");
                      setOpenMenu(null);
                    }}
                  />
                </div>
              )}
            </div>

            <Divider height={16} />
            <AirdropButton
              active={activePage === "airdrop"}
              onClick={() => goTo("airdrop")}
            />
          </div>
        )}

        {/* Right section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tablet ? 8 : 16,
            marginLeft: desktop ? 0 : "auto",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* 1280 compact right */}
          {compact && !tablet && breakpoint === "1280" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <TotalAssetsBlock label={assetsLabel} />
                <button
                  type="button"
                  style={{
                    width: 20,
                    height: 20,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <NavIcon src={NAV_ASSETS.more} />
                </button>
              </div>
              <Divider />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <NavIcon src={NAV_ASSETS.rwd} />
                <NavIcon src={NAV_ASSETS.language} />
                <NavIcon src={NAV_ASSETS.personal} />
              </div>
              <Divider />
              <NavIcon src={NAV_ASSETS.arbitrum} />
              <Divider />
            </>
          )}

          {/* 1024 compact right */}
          {compact && !tablet && breakpoint === "1024" && (
            <>
              <button
                type="button"
                style={{
                  width: 20,
                  height: 20,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <NavIcon src={NAV_ASSETS.more} />
              </button>
              <NavIcon src={NAV_ASSETS.rwd} />
              <NavIcon src={NAV_ASSETS.arbitrum} />
              <Divider />
            </>
          )}

          {/* 768 / 390 tablet right (shared RWD) */}
          {tablet && (
            <>
              <BorderedIconButton>
                <NavIcon src={NAV_ASSETS.rwd} />
              </BorderedIconButton>
              <BorderedIconButton>
                <NavIcon src={NAV_ASSETS.arbitrum} />
              </BorderedIconButton>
              <BorderedIconButton>
                <NavIcon src={NAV_ASSETS.language} />
              </BorderedIconButton>
            </>
          )}

          {/* Desktop right (1920/1440) */}
          {desktop && (
            <>
              <TotalAssetsBlock label={assetsLabel} />
              <button
                type="button"
                style={{
                  width: 20,
                  height: 20,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <NavIcon src={NAV_ASSETS.more} />
              </button>
              <Divider />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <NavIcon src={NAV_ASSETS.rwd} />
                <NavIcon src={NAV_ASSETS.language} />
                <NavIcon src={NAV_ASSETS.personal} />
              </div>
              <Divider />
              <NavIcon src={NAV_ASSETS.arbitrum} />
              <Divider />
            </>
          )}

          {walletButton}
          {compact && menuButton}
        </div>
      </header>

      {compact && (
        <SideMenu
          open={sideMenuOpen}
          onClose={() => setSideMenuOpen(false)}
          walletAddress={walletAddress}
          activePage={activePage}
          onNavigate={goTo}
          onOpenAgent={onOpenAgent}
          walletConnected={isConnected}
        />
      )}
    </>
  );
}
