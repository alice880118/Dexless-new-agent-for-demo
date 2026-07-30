import { useEffect, useRef, useState, type CSSProperties } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { AgentMascotLottie, AGENT_MASCOT_SIZE } from "./AgentMascotLottie";
import { FlameIcon } from "./FlameIcon";
import { AnalysisChipIcon, CryptoChipIcon } from "./ChipIcons";
import { SuggestArrowIcon } from "./SuggestArrowIcon";
import {
  SignalDetailView,
  SignalListView,
  SignalMotionStyles,
  getSignalAskPayload,
  SIGNAL_CARDS,
  type SignalAskSnapshot,
  type SignalCardData,
} from "./SignalViews";
import { MoreView, RenameView } from "./MoreViews";
import { AgentConversationView } from "./AgentConversationView";
import { AskingBox } from "./AskingBox";
import type { FileAttachment } from "./file-attachment";
import { useAgentName } from "./useAgentName";
import { DEFAULT_AGENT_NAME } from "./agent-name";
import { DepositSelectModal } from "./DepositSelectModal";
import { DepositSuccessToast } from "./DepositSuccessToast";
import { ConfirmSendOrderModal } from "./ConfirmSendOrderModal";
import type { DraftOrder } from "./draft-order";

type PanelView = "home" | "signals" | "detail" | "more" | "rename" | "chat";
type MoreTab = "history" | "drafts";

const PANEL_W = 375;
const PANEL_H = 830;

const ASSETS = {
  menu: "/trader-dna/menu.png",
  openInNew: "/trader-dna/open-in-new.png",
  close: "/trader-dna/close.svg",
  sparkle: "/trader-dna/sparkle.png",
  add: "/trader-dna/add.png",
  send: "/trader-dna/send.png",
} as const;

const SUGGESTS = [
  "Should I buy BTC right now?",
  "Find today's trending coins",
  "Suggest a low-risk trade",
] as const;

const CHIPS = [
  {
    id: "trending",
    label: "Trending",
    color: COLORS.brandGreen,
    Icon: FlameIcon,
  },
  {
    id: "crypto",
    label: "Crypto",
    color: "#c9bdff",
    Icon: CryptoChipIcon,
  },
  {
    id: "analysis",
    label: "Analysis",
    color: "rgba(255,255,255,0.8)",
    Icon: AnalysisChipIcon,
  },
] as const;

type DesktopTraderDnaPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onTradeNow?: (signal: SignalCardData) => void;
};

export function DesktopTraderDnaPanel({
  isOpen,
  onClose,
  onTradeNow,
}: DesktopTraderDnaPanelProps) {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [panelView, setPanelView] = useState<PanelView>("home");
  const [signalId, setSignalId] = useState<string>("btc-1");
  const [chatMessage, setChatMessage] = useState(
    "I want to long BTC with 20U",
  );
  const [signalSnapshot, setSignalSnapshot] =
    useState<SignalAskSnapshot | null>(null);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);
  const [chatAttachment, setChatAttachment] =
    useState<FileAttachment | null>(null);
  const [chatKey, setChatKey] = useState(0);
  const [depositOpen, setDepositOpen] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftDepositPhase, setDraftDepositPhase] = useState<
    "idle" | "confirming" | "ready" | "submitted"
  >("idle");
  const [showDepositSuccess, setShowDepositSuccess] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState<DraftOrder | null>(null);
  const [moreTab, setMoreTab] = useState<MoreTab>("history");
  const depositTimerRef = useRef<number | null>(null);
  const orderToastTimerRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const { agentName, saveAgentName } = useAgentName();

  const openMore = (tab: MoreTab = "history") => {
    setMoreTab(tab);
    setPanelView("more");
  };

  const startChat = (
    message?: string,
    snapshot: SignalAskSnapshot | null = null,
  ) => {
    const next = (message ?? draft).trim();
    if (!next && !attachment) return;
    setChatMessage(next);
    setSignalSnapshot(snapshot);
    setChatAttachment(attachment);
    setDraft("");
    setAttachment(null);
    setPanelView("chat");
    setChatKey((k) => k + 1);
  };

  const handleDraftDepositApprove = () => {
    setDepositOpen(false);
    setDraftDepositPhase("confirming");
    setShowDepositSuccess(false);
    if (depositTimerRef.current) {
      window.clearTimeout(depositTimerRef.current);
    }
    depositTimerRef.current = window.setTimeout(() => {
      setDraftDepositPhase("ready");
      setShowDepositSuccess(true);
      setShowDraftBanner(true);
      depositTimerRef.current = window.setTimeout(() => {
        setShowDepositSuccess(false);
        depositTimerRef.current = null;
      }, 3200);
    }, 3000);
  };

  const handleDraftAskAgent = (order: DraftOrder) => {
    startChat(`Review my ${order.title} draft order`);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveChip(null);
      setDepositOpen(false);
      setShowDepositSuccess(false);
      setShowOrderSuccess(false);
      setConfirmOrder(null);
      setVisible(true);
      setEntered(false);
      const id = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setEntered(true));
      });
      return () => window.cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = window.setTimeout(() => setVisible(false), 220);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (depositTimerRef.current) {
        window.clearTimeout(depositTimerRef.current);
      }
      if (orderToastTimerRef.current) {
        window.clearTimeout(orderToastTimerRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  const panelStyle: CSSProperties = {
    position: "fixed",
    right: 24,
    bottom: 40,
    width: PANEL_W,
    height: Math.min(PANEL_H, typeof window !== "undefined" ? window.innerHeight - 72 : PANEL_H),
    maxHeight: "calc(100vh - 72px)",
    zIndex: 1100,
    display: "flex",
    flexDirection: "column",
    background: "#1b1b1b",
    border: "1px solid #343538",
    borderRadius: 12,
    overflow: "hidden",
    pointerEvents: isOpen ? "auto" : "none",
    fontFamily: FONT,
    boxSizing: "border-box",
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
    transition:
      "opacity 240ms ease-out, transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "opacity, transform",
  };

  return (
    <div role="dialog" aria-label="Trader DNA" style={panelStyle}>
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          columnGap: 8,
          padding: "16px 16px 8px",
          borderBottom: "1px solid rgba(103,103,103,0.4)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            minWidth: 0,
          }}
        >
          {panelView === "more" || panelView === "rename" ? (
            <button
              type="button"
              aria-label="Back"
              onClick={() =>
                setPanelView(panelView === "rename" ? "more" : "home")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              <img
                src="/trader-dna/more/back-chevron.svg"
                alt=""
                width={18}
                height={18}
                style={{
                  display: "block",
                  transform: "rotate(-90deg) scaleY(-1)",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {panelView === "rename" ? "Back More" : "More"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              aria-label="Menu"
              onClick={() => openMore()}
              style={{
                width: 24,
                height: 24,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <img
                src={ASSETS.menu}
                alt=""
                width={24}
                height={24}
                style={{ display: "block", width: 24, height: 24 }}
              />
            </button>
          )}
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "20px",
            backgroundImage: GRADIENTS.aiText,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            whiteSpace: "nowrap",
            visibility:
              panelView === "more" || panelView === "rename"
                ? "hidden"
                : "visible",
          }}
        >
          {agentName}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            minWidth: 0,
          }}
        >
          <button
            type="button"
            aria-label="New chat"
            onClick={() => {
              setPanelView("home");
              setChatMessage("I want to long BTC with 20U");
              setSignalSnapshot(null);
              setDraft("");
              setAttachment(null);
              setChatAttachment(null);
              setActiveChip(null);
            }}
            style={{
              width: 24,
              height: 24,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={ASSETS.openInNew}
              alt=""
              width={24}
              height={24}
              style={{ display: "block", width: 24, height: 24 }}
            />
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 24,
              height: 24,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "relative",
                display: "block",
                width: 24,
                height: 24,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: "16.27% 16.64% 17.01% 16.6%",
                }}
              >
                <img
                  src={ASSETS.close}
                  alt=""
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </span>
            </span>
          </button>
        </div>
      </div>

      <SignalMotionStyles />

      {/* Body */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: panelView === "home" ? "flex" : "block",
          flexDirection: "column",
        }}
      >
        {panelView === "more" && (
          <MoreView
            onRename={() => setPanelView("rename")}
            initialTab={moreTab}
            onAskAgent={handleDraftAskAgent}
          />
        )}
        {panelView === "rename" && (
          <RenameView
            initialName={agentName === DEFAULT_AGENT_NAME ? "" : agentName}
            onSave={saveAgentName}
            onBack={() => setPanelView("more")}
            onCancel={() => setPanelView("more")}
          />
        )}
        {panelView === "chat" && (
          <AgentConversationView
            key={chatKey}
            userMessage={chatMessage}
            agentName={agentName}
            signalSnapshot={signalSnapshot}
            fileAttachment={chatAttachment}
            onDraftDeposit={() => setDepositOpen(true)}
            onSendOrder={(order) => setConfirmOrder(order)}
            onPlaceAnother={() => {
              setDraftDepositPhase("idle");
              startChat("I want to long BTC with 20U");
            }}
            onAdjustTpSl={() => {
              setDraftDepositPhase("idle");
              startChat("Adjust my take profit and stop loss");
            }}
            draftDepositPhase={draftDepositPhase}
          />
        )}
        {panelView === "signals" && (
          <SignalListView
            onBack={() => setPanelView("home")}
            onViewMore={(id) => {
              setSignalId(id);
              setPanelView("detail");
            }}
            onAskAgent={(id) => {
              const card =
                SIGNAL_CARDS.find((c) => c.id === id) ?? SIGNAL_CARDS[0];
              const payload = getSignalAskPayload(card);
              setSignalId(id);
              startChat(payload.message, payload.snapshot);
            }}
            onTradeNow={(id) => {
              const card =
                SIGNAL_CARDS.find((c) => c.id === id) ?? SIGNAL_CARDS[0];
              onTradeNow?.(card);
            }}
          />
        )}
        {panelView === "detail" && (
          <SignalDetailView
            signalId={signalId}
            onBack={() => setPanelView("signals")}
            onAskAgent={() => {
              const card =
                SIGNAL_CARDS.find((c) => c.id === signalId) ??
                SIGNAL_CARDS[0];
              const payload = getSignalAskPayload(card);
              startChat(payload.message, payload.snapshot);
            }}
            onTradeNow={() => {
              const card =
                SIGNAL_CARDS.find((c) => c.id === signalId) ??
                SIGNAL_CARDS[0];
              onTradeNow?.(card);
            }}
          />
        )}
        {panelView === "home" && (
          <>
            {/* Hero: lottie + prompt + CTA — upper area (Figma ~top 228) */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 42px",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {showDraftBanner && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    right: 16,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: 8,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontWeight: 600,
                      fontSize: 13,
                      lineHeight: "17px",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    You have 2 draft orders
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openMore("drafts")}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                        fontFamily: FONT,
                        fontWeight: 500,
                        fontSize: 13,
                        lineHeight: "17px",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      aria-label="Dismiss draft orders banner"
                      onClick={() => setShowDraftBanner(false)}
                      style={{
                        width: 15,
                        height: 15,
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src="/trader-dna/close.svg"
                        alt=""
                        width={15}
                        height={15}
                        style={{
                          display: "block",
                          width: 15,
                          height: 15,
                          opacity: 0.7,
                        }}
                      />
                    </button>
                  </span>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                  maxWidth: 291,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <AgentMascotLottie size={AGENT_MASCOT_SIZE} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    marginTop: -24,
                    transform: "translateY(-24px)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "17px",
                      color: COLORS.white60,
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    Would you like to check out BTC or today&apos;s trending
                    coins?
                  </p>

                  <button
                    type="button"
                    onClick={() => setPanelView("signals")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "8px 12px",
                      border: "none",
                      borderRadius: 12,
                      backgroundImage: GRADIENTS.connectBtn,
                      cursor: "pointer",
                      fontFamily: FONT,
                    }}
                  >
                    <img
                      src={ASSETS.sparkle}
                      alt=""
                      width={18}
                      height={18}
                      style={{ display: "block", width: 18, height: 18 }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: "18px",
                        color: "#ffffff",
                      }}
                    >
                      View Signal
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chips pinned to bottom; suggests overlay above so hero stays put */}
            <div
              style={{
                position: "relative",
                flexShrink: 0,
                padding: "0 16px 5px",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              {activeChip !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: "100%",
                    marginBottom: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    width: "auto",
                    animation:
                      "desktopChipSuggestIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both",
                  }}
                >
                  {SUGGESTS.map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => startChat(text)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        background: COLORS.menuHover,
                        cursor: "pointer",
                        fontFamily: FONT,
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          lineHeight: "18px",
                          color: COLORS.white70,
                        }}
                      >
                        {text}
                      </span>
                      <SuggestArrowIcon size={18} />
                    </button>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {CHIPS.map((chip) => {
                  const active = activeChip === chip.id;
                  const Icon = chip.Icon;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() =>
                        setActiveChip((prev) =>
                          prev === chip.id ? null : chip.id,
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        padding: "8px 12px",
                        borderRadius: 12,
                        border: active
                          ? "none"
                          : "1px solid rgba(255,255,255,0.2)",
                        background: active
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                        cursor: "pointer",
                        fontFamily: FONT,
                      }}
                    >
                      <Icon color={chip.color} />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          lineHeight: "18px",
                          color: chip.color,
                        }}
                      >
                        {chip.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <style>{`
              @keyframes desktopChipSuggestIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </>
        )}
      </div>

      {/* Input */}
      {panelView !== "more" && panelView !== "rename" && (
        <div
          style={{
            padding: "10px 16px",
            flexShrink: 0,
          }}
        >
          <AskingBox
            value={draft}
            onChange={setDraft}
            onSend={() => startChat()}
            attachment={attachment}
            onAttachmentChange={setAttachment}
          />
        </div>
      )}
      <DepositSelectModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onApprove={handleDraftDepositApprove}
      />
      <ConfirmSendOrderModal
        open={confirmOrder !== null}
        order={confirmOrder}
        onClose={() => setConfirmOrder(null)}
        onAdjust={() => setConfirmOrder(null)}
        onConfirm={() => {
          setConfirmOrder(null);
          setDraftDepositPhase("submitted");
          setShowDraftBanner(false);
          setShowOrderSuccess(true);
          setShowDepositSuccess(false);
          if (orderToastTimerRef.current) {
            window.clearTimeout(orderToastTimerRef.current);
          }
          orderToastTimerRef.current = window.setTimeout(() => {
            setShowOrderSuccess(false);
            orderToastTimerRef.current = null;
          }, 3200);
        }}
      />
      {showDepositSuccess ? (
        <DepositSuccessToast pageLevel top={60} />
      ) : null}
      {showOrderSuccess ? (
        <DepositSuccessToast
          pageLevel
          top={60}
          message="Order submitted"
        />
      ) : null}
    </div>
  );
}
