import { useState } from "react";
import { AgentOverlay, type SignalCardData } from "../packages/agent";
import { OnboardingDialog } from "../packages/onboarding";
import { TradePage } from "../packages/trade";
import {
  SignalMarquee,
  SignalDetailModal,
  SignalCardPreview,
  MarketsPage,
  MARQUEE_HEIGHT,
} from "../packages/signal";
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
  /** Desktop shell keeps a normal panel width — scroll horizontally instead of squashing. */
  const desktopMinW =
    breakpoint === "390" || breakpoint === "768" ? undefined : 1280;
  const [activePage, setActivePage] = useState<NavPageId | null>("trade_perps");
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInitialView, setAgentInitialView] = useState<"home" | "signals">(
    "home",
  );
  const [agentPendingSignal, setAgentPendingSignal] =
    useState<SignalCardData | null>(null);
  const [walletState, setWalletState] = useState<WalletState>("unconnected");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [tradeSignal, setTradeSignal] = useState<SignalCardData | null>(null);
  const [positionsFocusKey, setPositionsFocusKey] = useState(0);
  const [detailSignalId, setDetailSignalId] = useState<string | null>(null);
  const [marqueePreviewId, setMarqueePreviewId] = useState<string | null>(null);
  const [signalTabFocusKey, setSignalTabFocusKey] = useState(0);
  const walletConnected = walletState === "connected";
  const isMobile = breakpoint === "390";
  const isCompactMarkets = breakpoint === "390" || breakpoint === "768";
  /** Mobile onboarding is full-page and covers bottom nav */
  const hideBottomForOnboarding = isMobile && onboardingOpen;
  const showTradePage = isTradePage(activePage);
  const showMarketsPage = activePage === "markets";
  const showSignalChrome = walletConnected;
  const chromeTop = 48 + (showSignalChrome ? MARQUEE_HEIGHT : 0);
  const openOnboarding = () => setOnboardingOpen(true);
  const openAgent = (
    view: "home" | "signals" = "home",
    signal: SignalCardData | null = null,
  ) => {
    if (!walletConnected) {
      openOnboarding();
      return;
    }
    setTradeSignal(null);
    setDetailSignalId(null);
    setMarqueePreviewId(null);
    setAgentPendingSignal(signal);
    setAgentInitialView(view);
    setAgentOpen(true);
  };
  const closeTradeSignal = () => setTradeSignal(null);
  const navigateTo = (page: NavPageId) => {
    setActivePage(page);
    setOnboardingOpen(false);
    if (!isTradePage(page)) setTradeSignal(null);
    if (page !== "markets") setDetailSignalId(null);
  };
  const goToMarketsSignals = () => {
    setMarqueePreviewId(null);
    setDetailSignalId(null);
    setSignalTabFocusKey((k) => k + 1);
    navigateTo("markets");
  };
  const openSignalDetail = (id: string) => {
    setMarqueePreviewId(null);
    setDetailSignalId(id);
    if (isCompactMarkets) navigateTo("markets");
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
        minWidth: desktopMinW,
        background: "#0a0b0d",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
        overflowX: desktopMinW ? "auto" : undefined,
      }}
    >
      <TopNavBar
        breakpoint={breakpoint}
        activePage={activePage}
        onNavigate={navigateTo}
        walletState={walletState}
        onWalletStateChange={(next) => {
          setWalletState(next);
          if (next !== "connected") {
            setAgentOpen(false);
            setDetailSignalId(null);
            setMarqueePreviewId(null);
            setTradeSignal(null);
          }
        }}
        onConnectRequest={openOnboarding}
        onOpenAgent={() => openAgent("home")}
      />

      {showSignalChrome ? (
        <SignalMarquee
          breakpoint={breakpoint}
          onSelectSignal={(id) => {
            if (isCompactMarkets) setMarqueePreviewId(id);
            else setDetailSignalId(id);
          }}
          onViewAll={goToMarketsSignals}
        />
      ) : null}

      <main
        style={{
          height: `calc(100dvh - ${chromeTop}px${
            showBottom && !hideBottomForOnboarding
              ? " - 53px - env(safe-area-inset-bottom, 0px)"
              : showFooter
                ? ` - ${FOOTER_HEIGHT}px`
                : ""
          })`,
          display: "flex",
          flexDirection: "column",
          alignItems:
            showTradePage || showMarketsPage ? "stretch" : "center",
          justifyContent:
            showTradePage || showMarketsPage ? "flex-start" : "center",
          gap: showTradePage || showMarketsPage ? 0 : 12,
          padding: showTradePage || showMarketsPage ? 0 : 24,
          boxSizing: "border-box",
          overflow: "hidden",
          minHeight: 0,
          minWidth: desktopMinW,
          width: "100%",
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
        ) : showMarketsPage ? (
          <MarketsPage
            compact={isCompactMarkets}
            walletConnected={walletConnected}
            onConnectRequest={openOnboarding}
            detailSignalId={isCompactMarkets ? detailSignalId : null}
            onCloseDetail={() => setDetailSignalId(null)}
            signalTabFocusKey={signalTabFocusKey}
            onOpenSignal={(id) => openSignalDetail(id)}
            onTradeNow={(signal) => {
              setDetailSignalId(null);
              setTradeSignal(signal);
              setActivePage("trade_perps");
            }}
            onAskAgent={(signal) => openAgent("home", signal)}
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
        topInset={chromeTop}
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

      {marqueePreviewId && showSignalChrome && isCompactMarkets ? (
        <SignalCardPreview
          signalId={marqueePreviewId}
          onClose={() => setMarqueePreviewId(null)}
          onViewMore={() => openSignalDetail(marqueePreviewId)}
          onAskAgent={(signal) => {
            setMarqueePreviewId(null);
            openAgent("home", signal);
          }}
          onTradeNow={(signal) => {
            setMarqueePreviewId(null);
            setTradeSignal(signal);
            setActivePage("trade_perps");
          }}
        />
      ) : null}

      {detailSignalId && showSignalChrome && !isCompactMarkets ? (
        <SignalDetailModal
          signalId={detailSignalId}
          onClose={() => setDetailSignalId(null)}
          onViewAll={goToMarketsSignals}
          onTradeNow={(signal) => {
            setDetailSignalId(null);
            setTradeSignal(signal);
            setActivePage("trade_perps");
          }}
          onAskAgent={(signal) => {
            setDetailSignalId(null);
            openAgent("home", signal);
          }}
        />
      ) : null}

      <AgentOverlay
        breakpoint={breakpoint}
        showBottomNav={showBottom}
        isOpen={agentOpen}
        onOpenChange={(open) => {
          setAgentOpen(open);
          if (open) setTradeSignal(null);
          if (!open) {
            setAgentInitialView("home");
            setAgentPendingSignal(null);
          }
        }}
        walletConnected={walletConnected}
        initialView={agentInitialView}
        pendingSignal={agentPendingSignal}
        topChromeHeight={chromeTop}
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
