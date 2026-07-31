import { useState } from "react";
import { AgentOverlay, type SignalCardData } from "../packages/agent";
import { OnboardingDialog } from "../packages/onboarding";
import { TradePage } from "../packages/trade";
import {
  BottomNavBar,
  TopNavBar,
  SiteFooter,
  getNavPageLabel,
  isTradePage,
  showBottomNav,
  showSiteFooter,
  FOOTER_HEIGHT,
  useBreakpoint,
  type NavPageId,
  type WalletState,
} from "../packages/nav";

export function IndexPage() {
  const breakpoint = useBreakpoint();
  const showBottom = showBottomNav(breakpoint);
  const showFooter = showSiteFooter(breakpoint);
  const [activePage, setActivePage] = useState<NavPageId | null>("trade_perps");
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInitialView, setAgentInitialView] = useState<"home" | "signals">(
    "home",
  );
  const [walletState, setWalletState] = useState<WalletState>("unconnected");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [tradeSignal, setTradeSignal] = useState<SignalCardData | null>(null);
  const [positionsFocusKey, setPositionsFocusKey] = useState(0);
  const walletConnected = walletState === "connected";
  const isMobile = breakpoint === "390";
  /** Mobile onboarding is full-page and covers bottom nav */
  const hideBottomForOnboarding = isMobile && onboardingOpen;
  const showTradePage = isTradePage(activePage);
  const openOnboarding = () => setOnboardingOpen(true);
  const openAgent = (view: "home" | "signals" = "home") => {
    if (!walletConnected) {
      openOnboarding();
      return;
    }
    setTradeSignal(null);
    setAgentInitialView(view);
    setAgentOpen(true);
  };
  const closeTradeSignal = () => setTradeSignal(null);
  const navigateTo = (page: NavPageId) => {
    setActivePage(page);
    setOnboardingOpen(false);
    if (!isTradePage(page)) setTradeSignal(null);
  };
  const bottomInset =
    hideBottomForOnboarding
      ? 0
      : showBottom
        ? 53
        : showFooter
          ? FOOTER_HEIGHT
          : 0;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0b0d",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <TopNavBar
        breakpoint={breakpoint}
        activePage={activePage}
        onNavigate={navigateTo}
        walletState={walletState}
        onWalletStateChange={(next) => {
          setWalletState(next);
          if (next !== "connected") setAgentOpen(false);
        }}
        onConnectRequest={openOnboarding}
        onOpenAgent={() => openAgent("home")}
      />

      <main
        style={{
          height: `calc(100dvh - 48px${
            showBottom && !hideBottomForOnboarding
              ? " - 53px"
              : showFooter
                ? ` - ${FOOTER_HEIGHT}px`
                : ""
          })`,
          display: "flex",
          flexDirection: "column",
          alignItems: showTradePage ? "stretch" : "center",
          justifyContent: showTradePage ? "flex-start" : "center",
          gap: showTradePage ? 0 : 12,
          padding: showTradePage ? 0 : 24,
          boxSizing: "border-box",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {showTradePage ? (
          <TradePage
            walletConnected={walletConnected}
            onConnectRequest={openOnboarding}
            onOpenAgent={() => openAgent("home")}
            onOpenAgentSignals={() => openAgent("signals")}
            positionsFocusKey={positionsFocusKey}
            tradeSignal={tradeSignal}
            onCloseTradeSignal={closeTradeSignal}
          />
        ) : activePage ? (
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 600,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            {getNavPageLabel(activePage)}
          </p>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
              Layout width breakpoint
            </p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>{breakpoint}px</p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                maxWidth: 420,
                lineHeight: 1.5,
              }}
            >
              Default: unconnected. Click Connect wallet to open onboarding.
              On desktop, open Trade / More menus. Bottom nav shows at 768 / 390.
            </p>
          </>
        )}
      </main>

      {showBottom && !hideBottomForOnboarding && (
        <BottomNavBar
          breakpoint={breakpoint}
          activeId={
            activePage === "trade_perps"
              ? "trading"
              : activePage === "dexless_ai"
                ? "ai"
                : activePage === "markets" ||
                    activePage === "referrals" ||
                    activePage === "portfolio"
                  ? activePage
                  : null
          }
          onChange={(id) => {
            const map: Record<string, NavPageId> = {
              trading: "trade_perps",
              portfolio: "portfolio",
              markets: "markets",
              referrals: "referrals",
              ai: "dexless_ai",
            };
            const page = map[id];
            if (page) navigateTo(page);
          }}
        />
      )}

      {showFooter && <SiteFooter />}

      <OnboardingDialog
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        topInset={48}
        bottomInset={bottomInset}
        onConnectWallet={() => {
          setWalletState("connected");
          setOnboardingOpen(false);
        }}
        onDisconnect={() => {
          setWalletState("unconnected");
          setOnboardingOpen(false);
        }}
        onComplete={(options) => {
          setWalletState("connected");
          if (options?.openAgent) {
            window.setTimeout(() => openAgent("home"), 0);
          }
        }}
      />

      <AgentOverlay
        breakpoint={breakpoint}
        showBottomNav={showBottom}
        isOpen={agentOpen}
        onOpenChange={(open) => {
          setAgentOpen(open);
          if (open) setTradeSignal(null);
          if (!open) setAgentInitialView("home");
        }}
        walletConnected={walletConnected}
        initialView={agentInitialView}
        onTradeNow={(signal) => {
          setTradeSignal(signal);
          setActivePage("trade_perps");
          setAgentOpen(false);
          setAgentInitialView("home");
        }}
        onViewTradePositions={() => {
          setActivePage("trade_perps");
          setTradeSignal(null);
          setAgentOpen(false);
          setAgentInitialView("home");
          setPositionsFocusKey((k) => k + 1);
        }}
      />
    </div>
  );
}
