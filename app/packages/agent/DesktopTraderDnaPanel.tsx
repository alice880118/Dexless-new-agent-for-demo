import { useEffect, useState, type CSSProperties } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { FlameIcon } from "./FlameIcon";
import { SuggestArrowIcon } from "./SuggestArrowIcon";

const PANEL_W = 375;
const PANEL_H = 830;

const ASSETS = {
  menu: "/trader-dna/menu.png",
  openInNew: "/trader-dna/open-in-new.png",
  close: "/trader-dna/close.png",
  mascot: "/trader-dna/mascot.png",
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
  { id: "trending", label: "Trending", color: COLORS.brandGreen },
  { id: "crypto", label: "Crypto", color: "#c9bdff" },
  { id: "analysis", label: "Analysis", color: "rgba(255,255,255,0.8)" },
] as const;

type DesktopTraderDnaPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DesktopTraderDnaPanel({ isOpen, onClose }: DesktopTraderDnaPanelProps) {
  const [activeChip, setActiveChip] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setActiveChip(null);
  }, [isOpen]);

  if (!isOpen) return null;

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
    pointerEvents: "auto",
    fontFamily: FONT,
    boxSizing: "border-box",
  };

  return (
    <div role="dialog" aria-label="Trader DNA" style={panelStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 8px",
          borderBottom: "1px solid rgba(103,103,103,0.4)",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          aria-label="Menu"
          style={{
            width: 24,
            height: 24,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <img src={ASSETS.menu} alt="" width={24} height={24} style={{ display: "block", width: 24, height: 24 }} />
        </button>
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            aria-label="Open in new"
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
            }}
          >
            <img src={ASSETS.close} alt="" width={24} height={24} style={{ display: "block", width: 24, height: 24 }} />
          </button>
        </div>
      </div>

      {/* Body */}
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
            position: "absolute",
            left: 42,
            right: 42,
            top: "33%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
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
          style={{
            position: "absolute",
            left: "50%",
            top: "53%",
            transform: "translateX(-50%)",
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
          <img src={ASSETS.sparkle} alt="" width={18} height={18} style={{ display: "block", width: 18, height: 18 }} />
          <span style={{ fontSize: 12, fontWeight: 600, lineHeight: "18px", color: "#ffffff" }}>
            Create Custom Signal
          </span>
        </button>

        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 48,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {activeChip === "trending" &&
            SUGGESTS.map((text) => (
              <button
                key={text}
                type="button"
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

        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {CHIPS.map((chip) => {
            const active = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveChip(chip.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "8px 12px",
                  borderRadius: 12,
                  border: active
                    ? "1px solid #ffffff"
                    : "1px solid rgba(255,255,255,0.2)",
                  background: "transparent",
                  opacity: active ? 1 : 0.5,
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
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 16px",
          flexShrink: 0,
        }}
      >
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
            aria-label="Send"
            style={{
              width: 31,
              height: 31,
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
              src={ASSETS.send}
              alt=""
              width={31}
              height={31}
              style={{ display: "block", width: 31, height: 31 }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
