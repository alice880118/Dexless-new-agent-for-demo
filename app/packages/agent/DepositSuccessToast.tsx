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
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: pageLevel ? "max-content" : undefined,
        maxWidth: pageLevel ? "calc(100vw - 32px)" : undefined,
        padding: "6px 12px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.4)",
        background: "#191919",
        boxSizing: "border-box",
        pointerEvents: "none",
        fontFamily: FONT,
      }}
    >
      <img
        src="/signal/order-success-check.png"
        alt=""
        width={16}
        height={16}
        style={{
          display: "block",
          width: 16,
          height: 16,
          flexShrink: 0,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          lineHeight: "18px",
          color: "#ffffff",
          textAlign: "center",
          whiteSpace: "nowrap",
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
