import { useCallback, useEffect, useRef, useState } from "react";
import { AgentChatDialog } from "./AgentChatDialog";
import { DesktopTraderDnaPanel } from "./DesktopTraderDnaPanel";
import {
  AGENT_ICON_SIZE,
  FloatingAgentIcon,
  getDefaultAgentPosition,
  type AgentIconPosition,
} from "./FloatingAgentIcon";
import { TraderDnaBadge } from "./TraderDnaBadge";
import type { Breakpoint } from "../nav/design-system";
import type { SignalCardData } from "./SignalViews";

const TOP_NAV_HEIGHT = 48;
const BOTTOM_NAV_HEIGHT = 53;

type AgentOverlayProps = {
  breakpoint: Breakpoint;
  /** Reserve space for bottom nav (768 / 390) */
  showBottomNav?: boolean;
  /** Controlled open state (e.g. from Talk to Trade DNA) */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Agent entry only after wallet connected */
  walletConnected?: boolean;
  onTradeNow?: (signal: SignalCardData) => void;
  /** Open to Signal list when agent opens */
  initialView?: "home" | "signals";
  /** Prefill home composer with this signal snapshot */
  pendingSignal?: SignalCardData | null;
  /** <768 View Position → focus trade Positions table */
  onViewTradePositions?: () => void;
  /** Top chrome height (nav + optional marquee). Defaults to nav only. */
  topChromeHeight?: number;
};

/** Floating agent icon when bottom nav is shown (768 / 390); desktop uses Trader DNA badge */
function useFloatingAgentEntry(bp: Breakpoint): boolean {
  return bp === "768" || bp === "390";
}

export function AgentOverlay({
  breakpoint,
  showBottomNav = false,
  isOpen: controlledOpen,
  onOpenChange,
  walletConnected = false,
  onTradeNow,
  initialView = "home",
  pendingSignal = null,
  onViewTradePositions,
  topChromeHeight = TOP_NAV_HEIGHT,
}: AgentOverlayProps) {
  const phoneMode = useFloatingAgentEntry(breakpoint);
  const bottomInset = showBottomNav ? BOTTOM_NAV_HEIGHT : 0;
  const topInset = topChromeHeight;
  const isControlled = controlledOpen !== undefined;
  const prevPhoneModeRef = useRef(phoneMode);

  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? 1920 : window.innerWidth,
    height: typeof window === "undefined" ? 1080 : window.innerHeight,
  }));
  const [internalOpen, setInternalOpen] = useState(false);
  const [isIconActive, setIsIconActive] = useState(false);
  const [, setAgentMinimized] = useState(false);
  const [agentPosition, setAgentPosition] = useState<AgentIconPosition>(() =>
    getDefaultAgentPosition(viewport.width, viewport.height),
  );

  const isChatOpen = walletConnected && (isControlled ? controlledOpen : internalOpen);

  const setChatOpen = useCallback(
    (open: boolean) => {
      if (!walletConnected && open) return;
      if (!isControlled) setInternalOpen(open);
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange, walletConnected],
  );

  useEffect(() => {
    if (!walletConnected) {
      setChatOpen(false);
      setIsIconActive(false);
    }
  }, [walletConnected, setChatOpen]);

  // Close chat only when floating/badge mode actually switches (not on first mount)
  useEffect(() => {
    if (prevPhoneModeRef.current === phoneMode) return;
    prevPhoneModeRef.current = phoneMode;
    setChatOpen(false);
    setIsIconActive(false);
  }, [phoneMode, setChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setIsIconActive(true);
    }
  }, [isChatOpen]);

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });
      setAgentPosition((prev) => {
        const maxX = Math.max(0, width - AGENT_ICON_SIZE);
        const maxY = Math.max(
          topInset,
          height - bottomInset - AGENT_ICON_SIZE,
        );
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(Math.max(prev.y, topInset), maxY),
        };
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bottomInset, topInset]);

  const handleOpenChat = useCallback(() => {
    setIsIconActive(true);
    window.setTimeout(() => {
      setChatOpen(true);
    }, 120);
  }, [setChatOpen]);

  const handleCloseChat = useCallback(() => {
    setChatOpen(false);
    setAgentMinimized(false);
    window.setTimeout(() => {
      setIsIconActive(false);
    }, 320);
  }, [setChatOpen]);

  useEffect(() => {
    if (!isChatOpen) setAgentMinimized(false);
  }, [isChatOpen]);

  /** Close agent when user taps outside the agent surface (<768 / phone mode). */
  useEffect(() => {
    if (!isChatOpen || !phoneMode) return;

    const isAgentSurface = (el: Element | null) =>
      Boolean(
        el?.closest?.(
          '[data-agent-surface="true"], [data-chat-hit], [data-agent-scroll]',
        ),
      );

    const onPointerDownCapture = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target || isAgentSurface(target)) return;
      setChatOpen(false);
      setAgentMinimized(false);
      window.setTimeout(() => setIsIconActive(false), 320);
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
    };
  }, [isChatOpen, phoneMode, setChatOpen]);

  const agentAnchorX = agentPosition.x + AGENT_ICON_SIZE / 2;
  const agentAnchorY = agentPosition.y + AGENT_ICON_SIZE / 2;

  if (!walletConnected) {
    return null;
  }

  if (!phoneMode) {
    return (
      <>
        <TraderDnaBadge
          hidden={isChatOpen}
          onClick={() => setChatOpen(true)}
        />
        <DesktopTraderDnaPanel
          isOpen={isChatOpen}
          onClose={() => setChatOpen(false)}
          onTradeNow={onTradeNow}
          initialView={initialView}
          pendingSignal={pendingSignal}
        />
      </>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      {/*
        No full-screen scroll lock: background trade page stays scrollable.
        Agent surfaces use pointerEvents auto; tapping background menus closes agent.
      */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <FloatingAgentIcon
          containerWidth={viewport.width}
          containerHeight={viewport.height}
          topInset={topInset}
          bottomInset={bottomInset}
          isActive={isIconActive}
          isChatOpen={isChatOpen}
          position={agentPosition}
          onPositionChange={setAgentPosition}
          onOpenChat={handleOpenChat}
        />

        <AgentChatDialog
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          width={viewport.width}
          height={viewport.height}
          topInset={topInset}
          bottomInset={bottomInset}
          anchorX={agentAnchorX}
          anchorY={agentAnchorY}
          onTradeNow={onTradeNow}
          onMinimizedChange={setAgentMinimized}
          initialView={initialView}
          pendingSignal={pendingSignal}
          onViewTradePositions={onViewTradePositions}
        />
      </div>
    </div>
  );
}
