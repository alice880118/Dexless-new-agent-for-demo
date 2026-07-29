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
}: AgentOverlayProps) {
  const phoneMode = useFloatingAgentEntry(breakpoint);
  const bottomInset = showBottomNav ? BOTTOM_NAV_HEIGHT : 0;
  const isControlled = controlledOpen !== undefined;
  const prevPhoneModeRef = useRef(phoneMode);

  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? 1920 : window.innerWidth,
    height: typeof window === "undefined" ? 1080 : window.innerHeight,
  }));
  const [internalOpen, setInternalOpen] = useState(false);
  const [isIconActive, setIsIconActive] = useState(false);
  const [agentMinimized, setAgentMinimized] = useState(false);
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
          TOP_NAV_HEIGHT,
          height - bottomInset - AGENT_ICON_SIZE,
        );
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(Math.max(prev.y, TOP_NAV_HEIGHT), maxY),
        };
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bottomInset]);

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
      {isChatOpen ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            /* Minimized: leave bottom nav uncovered so tabs stay clickable */
            bottom: agentMinimized ? bottomInset : 0,
            zIndex: 150,
            pointerEvents: "auto",
            touchAction: "none",
            overscrollBehavior: "none",
            background: "transparent",
          }}
          onTouchMove={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onWheel={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      ) : null}
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
          topInset={TOP_NAV_HEIGHT}
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
          topInset={TOP_NAV_HEIGHT}
          bottomInset={bottomInset}
          anchorX={agentAnchorX}
          anchorY={agentAnchorY}
          onTradeNow={onTradeNow}
          onMinimizedChange={setAgentMinimized}
        />
      </div>
    </div>
  );
}
