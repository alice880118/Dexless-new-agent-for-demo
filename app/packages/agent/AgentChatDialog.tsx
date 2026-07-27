import { useCallback, useEffect, useRef, useState } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { FlameIcon } from "./FlameIcon";
import { SuggestArrowIcon } from "./SuggestArrowIcon";

const DRAG_CLOSE_THRESHOLD = 100;
const DRAG_SCALE_RANGE = 280;
const ANIMATION_MS = 320;
/** Figma minimized sheet height (7452:90298) */
const MINIMIZED_HEIGHT = 390;
/** Mobile expanded max height */
const MAX_EXPANDED_HEIGHT = 758;

const ASSETS = {
  menu: "/trader-dna/mobile/menu.png",
  openInNew: "/trader-dna/mobile/open-in-new.png",
  minimize: "/trader-dna/mobile/minimize.png",
  maximize: "/trader-dna/mobile/maximize.png",
  mascot: "/trader-dna/mobile/mascot.png",
  sparkle: "/trader-dna/mobile/sparkle.png",
  chevron: "/trader-dna/mobile/chevron.png",
  add: "/trader-dna/mobile/add.png",
  send: "/trader-dna/mobile/send.png",
} as const;

const CHIPS = [
  { id: "trending", label: "Trending", color: COLORS.brandGreen },
  { id: "crypto", label: "Crypto", color: "#c9bdff" },
  { id: "analysis", label: "Analysis", color: "rgba(255,255,255,0.8)" },
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
  anchorX: number;
  anchorY: number;
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
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {CHIPS.map((chip) => {
        const active = activeChip === chip.id;
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
              border: active ? "1px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
              background: active ? COLORS.menuHover : "transparent",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            <FlameIcon color={chip.color} />
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

function SuggestList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {SUGGESTS.map((text) => (
        <button
          key={text}
          type="button"
          data-chat-hit={`suggest-${text}`}
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

function AskingBox() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 11,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.2)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <img
          src={ASSETS.add}
          alt=""
          width={27}
          height={27}
          style={{ display: "block", width: 27, height: 27, flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white40,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Tell me about your trading habits...
        </span>
      </div>
      <button
        type="button"
        data-chat-hit="send"
        aria-label="Send"
        style={{
          width: 31,
          height: 31,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={ASSETS.send}
          alt=""
          width={31}
          height={31}
          style={{ display: "block", width: 31, height: 31 }}
        />
      </button>
    </div>
  );
}

export function AgentChatDialog({
  isOpen,
  onClose,
  width,
  height,
  anchorX,
  anchorY,
}: AgentChatDialogProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const pointerStartYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setDragY(0);
      setIsDragging(false);
      setIsMinimized(false);
      setActiveChip(null);
    }
  }, [isOpen]);

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
  }, []);

  const handleExpand = useCallback(() => {
    setIsMinimized(false);
    setDragY(0);
  }, []);

  const expandedHeight = Math.min(height, MAX_EXPANDED_HEIGHT);
  const panelHeight = isMinimized ? MINIMIZED_HEIGHT : expandedHeight;
  const dragScale = isOpen ? getDragScale(dragY) : 0;
  const opacity = isOpen ? Math.min(1, dragScale + 0.08) : 0;
  const dialogTop = height - panelHeight;
  const originX = Math.min(Math.max(anchorX, 0), width);
  const originY = Math.min(Math.max(anchorY - dialogTop, 0), panelHeight);

  return (
    <div
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Trader DNA"
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-chat-hit]")) return;
        handleDragPointerDown(event);
      }}
      onPointerMove={handleDragPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: panelHeight,
        maxHeight: MAX_EXPANDED_HEIGHT,
        zIndex: 200,
        background: isMinimized
          ? "linear-gradient(180deg, #313030 0%, #121419 100%)"
          : "#1b1b1b",
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
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "default",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT,
        boxSizing: "border-box",
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
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
          justifyContent: isMinimized ? "space-between" : "space-between",
          padding: "8px 16px",
          borderBottom: "1px solid rgba(103,103,103,0.4)",
          flexShrink: 0,
        }}
      >
        {isMinimized ? (
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              backgroundImage: GRADIENTS.aiText,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Trader DNA
          </span>
        ) : (
          <>
            <IconBtn ariaLabel="Menu" hitId="menu" src={ASSETS.menu} />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                backgroundImage: GRADIENTS.aiText,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Trader DNA
            </span>
          </>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconBtn ariaLabel="Open in new" hitId="open-in-new" src={ASSETS.openInNew} />
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

      {/* Expanded body */}
      {!isMinimized && (
        <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "calc(50% - 20px)",
              transform: "translate(-50%, -50%)",
              width: 291,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 21,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
                width: "100%",
              }}
            >
              <img
                src={ASSETS.mascot}
                alt=""
                width={75}
                height={70}
                style={{ display: "block", width: 75, height: 70, objectFit: "contain" }}
              />
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
                Would you like to check out BTC or today&apos;s trending coins?
              </p>
            </div>
            <button
              type="button"
              data-chat-hit="signal"
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
                style={{ fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#ffffff" }}
              >
                Create Custom Signal
              </span>
            </button>
          </div>

          {activeChip === "trending" && (
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 48,
              }}
            >
              <SuggestList />
            </div>
          )}

          <div style={{ position: "absolute", left: 16, bottom: 5 }}>
            <ChipRow activeChip={activeChip} onSelect={setActiveChip} />
          </div>
        </div>
      )}

      {/* Minimized body (Figma 7452:90298) */}
      {isMinimized && (
        <div
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "25px 19px 0",
            }}
          >
            <img
              src={ASSETS.mascot}
              alt=""
              width={40}
              height={37}
              style={{ display: "block", width: 40, height: 37, objectFit: "contain" }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "17px",
                color: COLORS.white70,
              }}
            >
              Hi! How can I help you today?
            </p>
          </div>

          <button
            type="button"
            data-chat-hit="signal"
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: 133,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: COLORS.menuHover,
              cursor: "pointer",
              fontFamily: FONT,
              boxSizing: "border-box",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <img
                src={ASSETS.sparkle}
                alt=""
                width={18}
                height={18}
                style={{ display: "block", width: 18, height: 18 }}
              />
              <span
                style={{ fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#ffffff" }}
              >
                Create Custom Signal
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

          {activeChip === "trending" && (
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 48,
              }}
            >
              <SuggestList />
            </div>
          )}

          <div style={{ position: "absolute", left: 16, bottom: 5 }}>
            <ChipRow activeChip={activeChip} onSelect={setActiveChip} />
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "10px 16px 48px", flexShrink: 0 }}>
        <AskingBox />
      </div>
    </div>
  );
}
