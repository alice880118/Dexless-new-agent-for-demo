import { useCallback, useEffect, useRef, useState } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { AgentMascotLottie, AGENT_MASCOT_SIZE, AGENT_MASCOT_MINIMIZED, AGENT_MASCOT_MINIMIZED_FRAME } from "./AgentMascotLottie";
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
import type { DraftOrder } from "./draft-order";

type PanelView = "home" | "signals" | "detail" | "more" | "rename" | "chat";
type MoreTab = "history" | "drafts";

const DRAG_CLOSE_THRESHOLD = 100;
const DRAG_SCALE_RANGE = 280;
const ANIMATION_MS = 320;
/** Figma minimized sheet height (7452:90298) */
const MINIMIZED_HEIGHT = 390;
/** Distance from viewport bottom; covers bottom nav */
const SHEET_BOTTOM_PAD = 48;

const ASSETS = {
  menu: "/trader-dna/mobile/menu.png",
  openInNew: "/trader-dna/mobile/open-in-new.png",
  minimize: "/trader-dna/mobile/minimize.png",
  maximize: "/trader-dna/mobile/maximize.png",
  sparkle: "/trader-dna/mobile/sparkle.png",
  chevron: "/trader-dna/mobile/chevron.png",
  add: "/trader-dna/mobile/add.png",
  send: "/trader-dna/mobile/send.png",
} as const;

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

const SUGGESTS = [
  "Should I buy BTC right now?",
  "Find today's trending coins",
  "Suggest a low-risk trade",
] as const;

type AgentChatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  height: number;
  /** Leave bottom nav uncovered */
  bottomInset?: number;
  /** Leave top nav + extra clearance uncovered */
  topInset?: number;
  anchorX: number;
  anchorY: number;
  onTradeNow?: (signal: SignalCardData) => void;
};

function getDragScale(dragY: number): number {
  if (dragY <= 0) return 1;
  return Math.max(0, 1 - dragY / DRAG_SCALE_RANGE);
}

function IconBtn({
  ariaLabel,
  hitId,
  onClick,
  src,
  size = 24,
}: {
  ariaLabel: string;
  hitId: string;
  onClick?: () => void;
  src: string;
  size?: number;
}) {
  return (
    <button
      type="button"
      data-chat-hit={hitId}
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{ display: "block", width: size, height: size }}
      />
    </button>
  );
}

function ChipRow({
  activeChip,
  onSelect,
}: {
  activeChip: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        overflowX: "auto",
        overflowY: "visible",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        paddingBottom: 2,
        boxSizing: "border-box",
      }}
    >
      {CHIPS.map((chip) => {
        const active = activeChip === chip.id;
        const Icon = chip.Icon;
        return (
          <button
            key={chip.id}
            type="button"
            data-chat-hit={`chip-${chip.id}`}
            onClick={() => onSelect(chip.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: "8px 12px",
              borderRadius: 12,
              border: active ? "none" : "1px solid rgba(255,255,255,0.2)",
              background: active ? "rgba(255,255,255,0.1)" : "transparent",
              cursor: "pointer",
              fontFamily: FONT,
              flexShrink: 0,
              whiteSpace: "nowrap",
              boxSizing: "border-box",
              minHeight: 36,
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
  );
}

function SuggestList({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {SUGGESTS.map((text) => (
        <button
          key={text}
          type="button"
          data-chat-hit={`suggest-${text}`}
          onClick={() => onSelect(text)}
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
  );
}

/** Bottom drawer with 3 suggest questions — slides up from below. */
function SuggestDrawer({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (text: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "auto",
      }}
    >
      <button
        type="button"
        aria-label="Close suggestions"
        data-chat-hit="suggest-drawer-backdrop"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 0,
          border: "none",
          background: "rgba(0,0,0,0.35)",
          cursor: "pointer",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "12px 16px 16px",
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #2a2a2a 0%, #131519 100%)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          animation: "chipDrawerIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <SuggestList
          onSelect={(text) => {
            onSelect(text);
            onClose();
          }}
        />
      </div>
    </div>
  );
}

export function AgentChatDialog({
  isOpen,
  onClose,
  width,
  height,
  bottomInset: _bottomInset = 0,
  topInset = 48,
  anchorX,
  anchorY,
  onTradeNow,
}: AgentChatDialogProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [panelView, setPanelView] = useState<PanelView>("home");
  const [signalId, setSignalId] = useState("btc-1");
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
  const [draftFunded, setDraftFunded] = useState(false);
  const [moreTab, setMoreTab] = useState<MoreTab>("history");
  const { agentName, saveAgentName } = useAgentName();
  const pointerStartYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setDragY(0);
      setIsDragging(false);
      setIsMinimized(false);
      setActiveChip(null);
      setPanelView("home");
      setSignalId("btc-1");
      setChatMessage("I want to long BTC with 20U");
      setSignalSnapshot(null);
      setDraft("");
      setAttachment(null);
      setChatAttachment(null);
      setDepositOpen(false);
      setShowDraftBanner(false);
      setDraftFunded(false);
      setMoreTab("history");
    }
  }, [isOpen]);

  const openSignals = useCallback(() => {
    setIsMinimized(false);
    setPanelView("signals");
  }, []);

  const openMore = useCallback((tab: MoreTab = "history") => {
    setIsMinimized(false);
    setMoreTab(tab);
    setPanelView("more");
  }, []);

  const startChat = useCallback(
    (message?: string, snapshot: SignalAskSnapshot | null = null) => {
      const next = (message ?? draft).trim();
      if (!next && !attachment) return;
      setChatMessage(next);
      setSignalSnapshot(snapshot);
      setChatAttachment(attachment);
      setDraft("");
      setAttachment(null);
      setPanelView("chat");
      setChatKey((k) => k + 1);
    },
    [draft, attachment],
  );

  const handleDraftDepositApprove = useCallback(() => {
    setDepositOpen(false);
    setShowDraftBanner(true);
    setDraftFunded(true);
    setPanelView("home");
    setIsMinimized(false);
  }, []);

  const handleDraftAskAgent = useCallback((order: DraftOrder) => {
    startChat(`Review my ${order.title} draft order`);
  }, [startChat]);

  const startNewChat = useCallback(() => {
    setPanelView("home");
    setChatMessage("I want to long BTC with 20U");
    setSignalSnapshot(null);
    setDraft("");
    setAttachment(null);
    setChatAttachment(null);
    setActiveChip(null);
  }, []);

  const handleDragPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isOpen) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pointerStartYRef.current = event.clientY;
      setIsDragging(true);
    },
    [isOpen],
  );

  const handleDragPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setDragY(Math.max(0, event.clientY - pointerStartYRef.current));
    },
    [isDragging],
  );

  const finishDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setIsDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
      if (dragY >= DRAG_CLOSE_THRESHOLD) {
        onClose();
        return;
      }
      setDragY(0);
    },
    [dragY, isDragging, onClose],
  );

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
    setDragY(0);
    setPanelView((prev) => (prev === "chat" ? "chat" : "home"));
    setActiveChip(null);
  }, []);

  const handleExpand = useCallback(() => {
    setIsMinimized(false);
    setDragY(0);
  }, []);

  const topSafe = topInset / 2;
  /** Expanded: cover bottom nav (bottom 0). Minimized: reveal nav. */
  const sheetBottom = isMinimized ? SHEET_BOTTOM_PAD : 0;
  const availableHeight = Math.max(280, height - topSafe - sheetBottom);
  const expandedHeight = availableHeight;
  const panelHeight = isMinimized
    ? Math.min(MINIMIZED_HEIGHT, availableHeight)
    : expandedHeight;
  const dragScale = isOpen ? getDragScale(dragY) : 0;
  const opacity = isOpen ? Math.min(1, dragScale + 0.08) : 0;
  const dialogTop = height - sheetBottom - panelHeight;
  const originX = Math.min(Math.max(anchorX, 0), width);
  const originY = Math.min(Math.max(anchorY - dialogTop, 0), panelHeight);

  return (
    <div
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Trader DNA"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: sheetBottom,
        height: panelHeight,
        maxHeight: availableHeight,
        zIndex: 200,
        background: isMinimized
          ? "linear-gradient(180deg, #313030 0%, #131519 100%)"
          : "linear-gradient(180deg, #1b1b1b 0%, #131519 100%)",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        transform: `scale(${dragScale})`,
        transformOrigin: `${originX}px ${originY}px`,
        opacity,
        transition: isDragging
          ? "none"
          : `transform ${ANIMATION_MS}ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 220ms ease, height ${ANIMATION_MS}ms cubic-bezier(0.34, 1.2, 0.64, 1)`,
        pointerEvents: isOpen ? "auto" : "none",
        overflow: "hidden",
        touchAction: "pan-y",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT,
        boxSizing: "border-box",
      }}
    >
      {/* Drag handle — only this area can drag-minimize */}
      <div
        data-chat-hit="drag-handle"
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        style={{
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          touchAction: "none",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 999,
            background: isMinimized ? "#454648" : "#313338",
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 8,
          padding: "8px 16px",
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
            flex: isMinimized ? "0 1 auto" : 1,
          }}
        >
          {!isMinimized &&
            (panelView === "more" || panelView === "rename" ? (
              <button
                type="button"
                data-chat-hit="back-more"
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
              <IconBtn
                ariaLabel="Menu"
                hitId="menu"
                src={ASSETS.menu}
                onClick={() => openMore()}
              />
            ))}
          {isMinimized && (
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                backgroundImage: GRADIENTS.aiText,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              {agentName}
            </span>
          )}
        </div>
        {!isMinimized && (
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
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            minWidth: 0,
            flex: isMinimized ? "0 0 auto" : 1,
            marginLeft: isMinimized ? "auto" : 0,
          }}
        >
          <IconBtn
            ariaLabel="New chat"
            hitId="open-in-new"
            src={ASSETS.openInNew}
            onClick={startNewChat}
          />
          {isMinimized ? (
            <IconBtn
              ariaLabel="Expand"
              hitId="expand"
              src={ASSETS.maximize}
              onClick={handleExpand}
            />
          ) : (
            <IconBtn
              ariaLabel="Minimize"
              hitId="minimize"
              src={ASSETS.minimize}
              onClick={handleMinimize}
            />
          )}
        </div>
      </div>

      <SignalMotionStyles />

      {/* Expanded body — flex stack like reference (mascot → CTA → suggests → chips) */}
      {!isMinimized && (
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
              initialName={
                agentName === DEFAULT_AGENT_NAME ? "" : agentName
              }
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
              draftFunded={draftFunded}
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
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 16px 0",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  position: "relative",
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
                      }}
                    >
                      Would you like to check out BTC or today&apos;s trending
                      coins?
                    </p>
                    <button
                      type="button"
                      data-chat-hit="signal"
                      onClick={openSignals}
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

              <div
                style={{
                  flexShrink: 0,
                  padding: "12px 16px 0",
                  marginBottom: 12,
                  boxSizing: "border-box",
                }}
              >
                <ChipRow
                  activeChip={activeChip}
                  onSelect={(id) =>
                    setActiveChip((prev) => (prev === id ? null : id))
                  }
                />
              </div>
              <SuggestDrawer
                open={activeChip !== null}
                onClose={() => setActiveChip(null)}
                onSelect={startChat}
              />
            </>
          )}
        </div>
      )}

      {/* Minimized body — CTA + chips gap 12px; chip opens bottom drawer */}
      {isMinimized && (
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {panelView === "chat" ? (
            <AgentConversationView
              key={chatKey}
              userMessage={chatMessage}
              agentName={agentName}
              signalSnapshot={signalSnapshot}
              fileAttachment={chatAttachment}
              onDraftDeposit={() => setDepositOpen(true)}
              draftFunded={draftFunded}
            />
          ) : (
            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: 0,
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Greeting */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "25px 16px 0 19px",
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <AgentMascotLottie
                  size={AGENT_MASCOT_MINIMIZED}
                  frameSize={AGENT_MASCOT_MINIMIZED_FRAME}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "17px",
                    color: COLORS.white70,
                    maxWidth: 217,
                  }}
                >
                  Hi! How can I help you today?
                </p>
              </div>

              {/* View Signal + chips — 12px gap (Figma 361×80 group) */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: "0 16px 5px",
                  boxSizing: "border-box",
                  width: "100%",
                }}
              >
                <button
                  type="button"
                  data-chat-hit="signal"
                  onClick={openSignals}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: COLORS.menuHover,
                    cursor: "pointer",
                    fontFamily: FONT,
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
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
                  </span>
                  <img
                    src={ASSETS.chevron}
                    alt=""
                    width={16}
                    height={16}
                    style={{ display: "block", width: 16, height: 16 }}
                  />
                </button>
                <ChipRow
                  activeChip={activeChip}
                  onSelect={(id) =>
                    setActiveChip((prev) => (prev === id ? null : id))
                  }
                />
              </div>

              <SuggestDrawer
                open={activeChip !== null}
                onClose={() => setActiveChip(null)}
                onSelect={startChat}
              />
            </div>
          )}
        </div>
      )}

      {/* Input — always available except More/Rename (expanded-only features) */}
      {!( !isMinimized && (panelView === "more" || panelView === "rename") ) && (
        <div
          style={{
            padding: isMinimized ? "10px 16px 16px" : "0 16px 24px",
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
      <style>{`
        .agent-minimized-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        @keyframes chipDrawerIn {
          from { transform: translateY(100%); opacity: 0.85; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
