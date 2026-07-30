import { createPortal } from "react-dom";
import { FONT } from "../nav/design-system";

type DepositSuccessToastProps = {
  /** Render fixed to the page (above agent) */
  pageLevel?: boolean;
  /** Offset from top (e.g. below top nav) */
  top?: number;
  /** Toast copy — no icon */
  message?: string;
};

export function DepositSuccessToast({
  pageLevel = false,
  top = 64,
  message = "Deposit submitted",
}: DepositSuccessToastProps) {
  const node = (
    <div
      role="status"
      style={{
        position: pageLevel ? "fixed" : "absolute",
        top: pageLevel ? top : 12,
        left: pageLevel ? "50%" : 16,
        right: pageLevel ? undefined : 16,
        transform: pageLevel ? "translateX(-50%)" : undefined,
        zIndex: pageLevel ? 2000 : 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: pageLevel ? "min(360px, calc(100vw - 32px))" : undefined,
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(12,13,16,0.95)",
        boxSizing: "border-box",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        pointerEvents: "none",
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          lineHeight: "18px",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        {message}
      </span>
    </div>
  );

  if (pageLevel && typeof document !== "undefined") {
    return createPortal(node, document.body);
  }
  return node;
}
