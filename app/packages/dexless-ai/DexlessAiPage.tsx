import { useEffect, useState } from "react";
import { FONT, FONT_WEIGHT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { AddTradingHistoryModal } from "./AddTradingHistoryModal";
import { ConnectHistoryModal } from "./ConnectHistoryModal";
import { DataSourcesModal } from "./DataSourcesModal";
import {
  PlatformConnectionNav,
  type PlatformConnectionMode,
} from "./PlatformConnectionNav";
import { RebuildingAnalysisBanner } from "./RebuildingAnalysisBanner";
import { FULL_TRADE_COUNT } from "./venues";

type HistoryMode = "full" | "dexless-only";

type Props = {
  walletConnected?: boolean;
  onConnectWallet?: () => void;
  /** Agent panel open — Connect history waits until it closes */
  agentOpen?: boolean;
  /** While onboarding (e.g. Your account is live) is open, defer Connect history */
  deferConsent?: boolean;
};

/** Dexless AI page — centered shell max 1434px */
export function DexlessAiPage({
  walletConnected = false,
  onConnectWallet,
  agentOpen = false,
  deferConsent = false,
}: Props) {
  const [historyMode, setHistoryMode] = useState<HistoryMode | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [addSourcesOpen, setAddSourcesOpen] = useState(false);
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  // Session-only: disconnect resets the Dexless AI flow
  useEffect(() => {
    if (!walletConnected) {
      setHistoryMode(null);
      setConsentOpen(false);
      setAddSourcesOpen(false);
      setDataSourcesOpen(false);
      setLoading(false);
      setRebuilding(false);
    }
  }, [walletConnected]);

  // Connect history only after onboarding done AND agent closed (while on this page)
  useEffect(() => {
    if (!walletConnected || deferConsent || agentOpen) {
      if (deferConsent || agentOpen) setConsentOpen(false);
      return;
    }
    if (historyMode !== null || loading || rebuilding) return;

    const timer = window.setTimeout(() => {
      setConsentOpen(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    walletConnected,
    deferConsent,
    agentOpen,
    historyMode,
    loading,
    rebuilding,
  ]);

  const isCompact = useBreakpoint() === "390";

  const connectionMode: PlatformConnectionMode =
    historyMode === "full" ? "connected" : "unconnected";

  const showPanelContent = historyMode !== null && !loading;

  const runFirstChoice = (mode: HistoryMode) => {
    setConsentOpen(false);
    setLoading(true);
    window.setTimeout(() => {
      setHistoryMode(mode);
      setLoading(false);
    }, 1400);
  };

  const runAddAndRebuild = () => {
    setAddSourcesOpen(false);
    setRebuilding(true);
    window.setTimeout(() => {
      setHistoryMode("full");
      setRebuilding(false);
    }, 2200);
  };

  const ctaRow = !rebuilding ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: isCompact ? "100%" : undefined,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        style={{
          height: 32,
          flex: isCompact ? 1 : undefined,
          padding: "0 16px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.5)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: "18px",
          fontFamily: FONT,
          cursor: "pointer",
        }}
      >
        Today&apos;s Brief
      </button>
      <button
        type="button"
        onClick={() => {
          setHistoryMode(null);
          setConsentOpen(true);
        }}
        style={{
          height: 32,
          minHeight: 32,
          flex: isCompact ? 1 : undefined,
          padding: "0 16px",
          borderRadius: 999,
          border: "none",
          background: GRADIENTS.connectBtn,
          color: "rgba(255,255,255,0.9)",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: "20px",
          fontFamily: FONT,
          cursor: "pointer",
        }}
      >
        New Analysis
      </button>
    </div>
  ) : null;

  if (!walletConnected) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          fontFamily: FONT,
        }}
      >
        <button
          type="button"
          onClick={() => onConnectWallet?.()}
          style={{
            height: 40,
            padding: "0 20px",
            borderRadius: 8,
            border: "none",
            background: GRADIENTS.connectBtn,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          Connect wallet to view Dexless AI
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        fontFamily: FONT,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="dexless-ai-page-scroll"
    >
      <style>{`
        .dexless-ai-page-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
        @keyframes dexlessAiSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes dexlessAiSlide {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(320%); }
        }
        @keyframes dexlessAiShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 900px) {
          .dexless-ai-rebuild-cards {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {showPanelContent || rebuilding ? (
        <div
          style={{
            width: "100%",
            maxWidth: 1434,
            padding: "8px 16px 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Dexless AI Nav — Figma 7782:84176 */}
          <div
            style={{
              display: "flex",
              alignItems: isCompact ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              padding: "8px 0 0",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Trading Behavioral Analysis
            </h1>
            {!isCompact ? ctaRow : null}
          </div>

          {rebuilding ? (
            <RebuildingAnalysisBanner tradeCount={FULL_TRADE_COUNT} />
          ) : (
            <PlatformConnectionNav
              mode={connectionMode}
              actions={isCompact ? ctaRow : undefined}
              onManage={() => setDataSourcesOpen(true)}
              onConnect={() => setAddSourcesOpen(true)}
            />
          )}
        </div>
      ) : null}

      <ConnectHistoryModal
        open={consentOpen && !loading && !rebuilding}
        onUseFullHistory={() => runFirstChoice("full")}
        onUseDexlessOnly={() => runFirstChoice("dexless-only")}
      />

      <AddTradingHistoryModal
        open={addSourcesOpen && !loading && !rebuilding}
        onClose={() => setAddSourcesOpen(false)}
        onAddAndRebuild={runAddAndRebuild}
      />

      <DataSourcesModal
        open={dataSourcesOpen && !loading && !rebuilding}
        onClose={() => setDataSourcesOpen(false)}
        includesExternal={historyMode === "full"}
      />

      {loading ? (
        <div
          role="status"
          aria-label="Loading"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "rgba(10,11,13,0.72)",
            fontFamily: FONT,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, #7053f3 0%, #76bab2 45%, #e3ff94 75%, transparent 100%)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
              animation: "dexlessAiSpin 0.8s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: FONT_WEIGHT.medium,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Preparing your AI Brain…
          </span>
        </div>
      ) : null}
    </div>
  );
}
