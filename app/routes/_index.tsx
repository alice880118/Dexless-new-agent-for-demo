import { useState } from "react";
import { AgentOverlay, SignalTradeModal, type SignalCardData } from "../packages/agent";
import { OnboardingDialog } from "../packages/onboarding";
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
  const [activePage, setActivePage] = useState<NavPageId | null>(null);
  const [agentOpen, setAgentOpen] = useState(false);
  const [walletState, setWalletState] = useState<WalletState>("unconnected");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [tradeSignal, setTradeSignal] = useState<SignalCardData | null>(null);
  const walletConnected = walletState === "connected";
  const isMobile = breakpoint === "390";
  /** Mobile onboarding is full-page and covers bottom nav */
  const hideBottomForOnboarding = isMobile && onboardingOpen;
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
        minHeight: "100vh",
        background: "#0a0b0d",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <TopNavBar
        breakpoint={breakpoint}
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          if (!isTradePage(page)) setTradeSignal(null);
        }}
        walletState={walletState}
        onWalletStateChange={(next) => {
          setWalletState(next);
          if (next !== "connected") setAgentOpen(false);
        }}
        onConnectRequest={() => setOnboardingOpen(true)}
        onOpenAgent={() => {
          if (walletConnected) setAgentOpen(true);
        }}
      />

      <main
        style={{
          height: `calc(100vh - 48px${
            showBottom && !hideBottomForOnboarding
              ? " - 53px"
              : showFooter
                ? ` - ${FOOTER_HEIGHT}px`
                : ""
          })`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        {tradeSignal && isTradePage(activePage) ? (
          <SignalTradeModal
            data={tradeSignal}
            onClose={() => setTradeSignal(null)}
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
            if (page) {
              setActivePage(page);
              if (!isTradePage(page)) setTradeSignal(null);
            }
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
            window.setTimeout(() => setAgentOpen(true), 0);
          }
        }}
      />

      <AgentOverlay
        breakpoint={breakpoint}
        showBottomNav={showBottom}
        isOpen={agentOpen}
        onOpenChange={setAgentOpen}
        walletConnected={walletConnected}
        onTradeNow={(signal) => {
          setTradeSignal(signal);
          setActivePage("trade_perps");
          setAgentOpen(false);
        }}
      />
    </div>
  );
}
