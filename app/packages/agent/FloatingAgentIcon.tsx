import { useCallback, useRef, useState } from "react";
import { AgentLottiePlayer } from "./AgentLottiePlayer";

export const AGENT_ICON_SIZE = 54;
const LOTTIE_SIZE = 50;
const DEFAULT_BOTTOM_OFFSET = 336;
const DRAG_THRESHOLD = 6;
const ACTIVE_SCALE = 1.2;

type AgentIconState = "default" | "dragging" | "dragEnd";

export type AgentIconPosition = {
  x: number;
  y: number;
};

type FloatingAgentIconProps = {
  containerWidth: number;
  containerHeight: number;
  topInset: number;
  bottomInset: number;
  isActive: boolean;
  isChatOpen: boolean;
  position: AgentIconPosition;
  onPositionChange: (position: AgentIconPosition) => void;
  onOpenChat: () => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getDefaultAgentPosition(
  containerWidth: number,
  containerHeight: number,
): AgentIconPosition {
  return {
    x: containerWidth - AGENT_ICON_SIZE,
    y: containerHeight - DEFAULT_BOTTOM_OFFSET - AGENT_ICON_SIZE,
  };
}

function getBounds(
  containerWidth: number,
  containerHeight: number,
  topInset: number,
  bottomInset: number,
) {
  return {
    minX: 0,
    maxX: containerWidth - AGENT_ICON_SIZE,
    minY: topInset,
    maxY: containerHeight - bottomInset - AGENT_ICON_SIZE,
  };
}

export function FloatingAgentIcon({
  containerWidth,
  containerHeight,
  topInset,
  bottomInset,
  isActive,
  isChatOpen,
  position,
  onPositionChange,
  onOpenChat,
}: FloatingAgentIconProps) {
  const [iconState, setIconState] = useState<AgentIconState>("default");
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<AgentIconPosition>({ x: 0, y: 0 });
  const pointerStartRef = useRef<AgentIconPosition>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const glowOpacity = iconState === "dragging" ? 1 : 0;
  const lottieScale = isActive ? ACTIVE_SCALE : 1;

  const constrainPosition = useCallback(
    (next: AgentIconPosition): AgentIconPosition => {
      const bounds = getBounds(
        containerWidth,
        containerHeight,
        topInset,
        bottomInset,
      );

      return {
        x: clamp(next.x, bounds.minX, bounds.maxX),
        y: clamp(next.y, bounds.minY, bounds.maxY),
      };
    },
    [bottomInset, containerHeight, containerWidth, topInset],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const parent = event.currentTarget.offsetParent as HTMLElement | null;
      if (!parent) {
        return;
      }

      const rect = parent.getBoundingClientRect();
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
      hasMovedRef.current = false;
      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      dragOffsetRef.current = {
        x: event.clientX - rect.left - position.x,
        y: event.clientY - rect.top - position.y,
      };
      setIconState("dragging");
    },
    [position.x, position.y],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDragging) {
        return;
      }

      const deltaX = event.clientX - pointerStartRef.current.x;
      const deltaY = event.clientY - pointerStartRef.current.y;
      if (
        Math.abs(deltaX) > DRAG_THRESHOLD ||
        Math.abs(deltaY) > DRAG_THRESHOLD
      ) {
        hasMovedRef.current = true;
      }

      const parent = event.currentTarget.offsetParent as HTMLElement | null;
      if (!parent) {
        return;
      }

      const rect = parent.getBoundingClientRect();
      const nextPosition = constrainPosition({
        x: event.clientX - rect.left - dragOffsetRef.current.x,
        y: event.clientY - rect.top - dragOffsetRef.current.y,
      });

      onPositionChange(nextPosition);
    },
    [constrainPosition, isDragging, onPositionChange],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDragging) {
        return;
      }

      setIsDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);

      if (!hasMovedRef.current) {
        onOpenChat();
        setIconState("default");
        return;
      }

      setIconState("dragEnd");
      window.setTimeout(() => {
        setIconState("default");
      }, 200);
    },
    [isDragging, onOpenChat],
  );

  if (isChatOpen) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Agent assistant"
      data-agent-surface="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: AGENT_ICON_SIZE,
        height: AGENT_ICON_SIZE,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        pointerEvents: "auto",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <img
          src="/bg-glow.svg"
          alt=""
          width={AGENT_ICON_SIZE}
          height={AGENT_ICON_SIZE}
          style={{
            width: AGENT_ICON_SIZE,
            height: AGENT_ICON_SIZE,
            opacity: glowOpacity,
            transition: "opacity 200ms ease",
          }}
        />
      </span>
      <span
        style={{
          position: "relative",
          width: LOTTIE_SIZE,
          height: LOTTIE_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          overflow: "visible",
          transform: `scale(${lottieScale})`,
          transition: "transform 220ms ease",
        }}
      >
        <AgentLottiePlayer />
      </span>
    </button>
  );
}
