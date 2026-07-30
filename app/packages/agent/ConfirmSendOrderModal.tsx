import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import type { DraftOrder } from "./draft-order";

type ConfirmSendOrderModalProps = {
  open: boolean;
  order: DraftOrder | null;
  onClose: () => void;
  /** Confirm → submit order */
  onConfirm: () => void;
  /** Adjust → back to agent conversation */
  onAdjust: () => void;
};

const shellBase: CSSProperties = {
  background: "#0c0d10",
  border: "1px solid #383838",
  boxSizing: "border-box",
  fontFamily: FONT,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxHeight: "100%",
  overflow: "hidden",
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
      }}
    >
      <span
        style={{
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.6)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: 600,
          fontSize: 12,
          lineHeight: "18px",
          color: "#ffffff",
          textAlign: "right",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export function ConfirmSendOrderModal({
  open,
  order,
  onClose,
  onConfirm,
  onAdjust,
}: ConfirmSendOrderModalProps) {
  const isMobile = useBreakpoint() === "390";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !order || !mounted || typeof document === "undefined") {
    return null;
  }

  const sideColor = order.side === "Long" ? "#46ccb9" : "#ff41a3";

  const content = (
    <div
      style={{
        ...shellBase,
        borderRadius: isMobile ? "8px 8px 0 0" : 8,
        maxWidth: isMobile ? undefined : 420,
        maxHeight: isMobile ? "90vh" : "min(720px, 92vh)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #383838",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "18px",
            letterSpacing: "0.14px",
            color: "#ffffff",
          }}
        >
          Confirm order
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            width: 16,
            height: 16,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "inline-flex",
            flexShrink: 0,
          }}
        >
          <img
            src="/trader-dna/close.svg"
            alt=""
            width={16}
            height={16}
            style={{ display: "block", width: 16, height: 16 }}
          />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: isMobile
            ? "16px 20px calc(16px + env(safe-area-inset-bottom, 0px))"
            : "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "18px",
                color: "#ffffff",
              }}
            >
              {order.title}
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: 12,
                lineHeight: "18px",
                color: sideColor,
              }}
            >
              {order.side}
            </span>
          </div>
          <DetailRow label="Market" value={order.market} />
          <DetailRow label="Margin" value={order.margin} />
          <DetailRow label="Leverage" value={order.leverageLine} />
          <DetailRow label="Entry" value={order.entry} />
          <DetailRow label="Take profit" value={order.takeProfit} />
          <DetailRow label="Stop loss" value={order.stopLoss} />
        </div>

        <p
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "18px",
            color: COLORS.white60,
          }}
        >
          Review your order. Confirm to submit, or adjust to go back to the
          agent.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={onConfirm}
            style={{
              width: "100%",
              minHeight: 32,
              border: "none",
              borderRadius: 999,
              padding: "6px 16px",
              cursor: "pointer",
              backgroundImage: GRADIENTS.connectBtn,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 13,
              lineHeight: "20px",
              color: "#ffffff",
            }}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onAdjust}
            style={{
              width: "100%",
              minHeight: 32,
              border: "1px solid #ffffff",
              borderRadius: 999,
              padding: "6px 16px",
              cursor: "pointer",
              background: "transparent",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 13,
              lineHeight: "20px",
              color: "#ffffff",
              opacity: 0.5,
            }}
          >
            Adjust
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm order"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 16,
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.55)",
      }}
      onClick={onClose}
    >
      {isMobile && (
        <style>{`
          @keyframes confirmOrderDrawerIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      )}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? undefined : 420,
          animation: isMobile
            ? "confirmOrderDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
            : undefined,
        }}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}
