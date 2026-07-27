import { useState } from "react";
import { AgentOverlay } from "../packages/agent";
import {
  BottomNavBar,
  TopNavBar,
  SiteFooter,
  getNavPageLabel,
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
  const walletConnected = walletState === "connected";

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
        onNavigate={setActivePage}
        walletState={walletState}
        onWalletStateChange={(next) => {
          setWalletState(next);
          if (next !== "connected") setAgentOpen(false);
        }}
        onOpenAgent={() => {
          if (walletConnected) setAgentOpen(true);
        }}
      />

      <main
        style={{
          height: `calc(100vh - 48px${showBottom ? " - 53px" : showFooter ? ` - ${FOOTER_HEIGHT}px` : ""})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        {activePage ? (
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
              Default: unconnected. Click Connect wallet to connect. On desktop,
              open Trade / More menus. Bottom nav shows at 768 / 390.
            </p>
          </>
        )}
      </main>

      {showBottom && (
        <BottomNavBar
          breakpoint={breakpoint}
          activeId={
            activePage === "trade_perps" || activePage === "trade_swap"
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
            if (page) setActivePage(page);
          }}
        />
      )}

      {showFooter && <SiteFooter />}

      <AgentOverlay
        breakpoint={breakpoint}
        showBottomNav={showBottom}
        isOpen={agentOpen}
        onOpenChange={setAgentOpen}
        walletConnected={walletConnected}
      />
    </div>
  );
}
