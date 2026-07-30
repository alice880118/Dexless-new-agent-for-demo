import { createPortal } from "react-dom";
import { FONT } from "../nav/design-system";

type DepositSuccessToastProps = {
  /** Render fixed to the page (above agent) */
  pageLevel?: boolean;
  /** Offset from top (e.g. below top nav) */
  top?: number;
};

export function DepositSuccessToast({
  pageLevel = false,
  top = 64,
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
        gap: 8,
        width: pageLevel ? "min(360px, calc(100vw - 32px))" : undefined,
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        background: pageLevel
          ? "rgba(12,13,16,0.95)"
          : "rgba(255,255,255,0.08)",
        boxSizing: "border-box",
        boxShadow: pageLevel ? "0 8px 24px rgba(0,0,0,0.45)" : undefined,
        pointerEvents: "none",
      }}
    >
      <img
        src="/onboarding/circle-check-ready.png"
        alt=""
        width={16}
        height={16}
        style={{ display: "block", flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          lineHeight: "18px",
          color: "#ffffff",
        }}
      >
        Deposit successful
      </span>
    </div>
  );

  if (pageLevel && typeof document !== "undefined") {
    return createPortal(node, document.body);
  }
  return node;
}
