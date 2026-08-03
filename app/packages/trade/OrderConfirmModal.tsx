import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { DrawerDragHandle } from "./MobileDrawerChrome";

export type OrderConfirmData = {
  symbol: string;
  base: string;
  iconSrc?: string;
  orderTypeLabel: string;
  side: "buy" | "sell";
  quantity: string;
  price: string;
  quote: string;
  estTotal: string;
};

type OrderConfirmModalProps = {
  open: boolean;
  data: OrderConfirmData | null;
  disableConfirmChecked?: boolean;
  onDisableConfirmChange?: (v: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

function OrderTag({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "buy" | "sell";
}) {
  const bg =
    tone === "buy"
      ? "rgba(70,204,185,0.2)"
      : tone === "sell"
        ? "rgba(255,65,163,0.2)"
        : "rgba(255,255,255,0.1)";
  const color =
    tone === "buy"
      ? "#46ccb9"
      : tone === "sell"
        ? "#ff41a3"
        : "rgba(255,255,255,0.7)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 22,
        padding: "0 8px",
        borderRadius: 999,
        background: bg,
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "18px",
        color,
        boxSizing: "border-box",
      }}
    >
      {label}
    </span>
  );
}

function Row({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          color: COLORS.white50,
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 4,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.9)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {unit ? (
          <span style={{ fontWeight: 500, color: COLORS.white50 }}>{unit}</span>
        ) : null}
      </span>
    </div>
  );
}

/** Order confirm dialog — desktop centered / mobile bottom sheet */
export function OrderConfirmModal({
  open,
  data,
  disableConfirmChecked = false,
  onDisableConfirmChange,
  onCancel,
  onConfirm,
}: OrderConfirmModalProps) {
  const bp = useBreakpoint();
  const isDrawer = bp === "390";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !data || !mounted || typeof document === "undefined") return null;

  const sideLabel = data.side === "buy" ? "Buy" : "Sell";
  const sideTone = data.side === "buy" ? "buy" : "sell";

  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order confirm"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: isDrawer ? undefined : 360,
        background: "#0c0d10",
        borderRadius: isDrawer ? "4px 4px 0 0" : 12,
        border: isDrawer ? "none" : "1px solid #383838",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT,
        animation: isDrawer
          ? "orderConfirmIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
          : undefined,
      }}
    >
      {isDrawer ? <DrawerDragHandle /> : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isDrawer ? "8px 20px 16px" : "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "20px",
            color: "#ffffff",
          }}
        >
          Order confirm
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onCancel}
          style={{
            width: 24,
            height: 24,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
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
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "16px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minWidth: 0,
            }}
          >
            <img
              src={data.iconSrc ?? "/onboarding/chains/ethereum.png"}
              alt=""
              width={24}
              height={24}
              style={{
                display: "block",
                width: 24,
                height: 24,
                borderRadius: 999,
                flexShrink: 0,
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {data.base}
            </span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <OrderTag label={data.orderTypeLabel} tone="neutral" />
            <OrderTag label={sideLabel} tone={sideTone} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
          }}
        >
          <Row label="Order Qty." value={data.quantity} />
          <Row label="Price" value={data.price} unit={data.quote} />
          <Row label="Est. Total" value={data.estTotal} unit={data.quote} />
        </div>

        <button
          type="button"
          onClick={() =>
            onDisableConfirmChange?.(!disableConfirmChecked)
          }
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            alignSelf: "flex-start",
          }}
        >
          <img
            src={
              disableConfirmChecked
                ? "/trade/order/select.svg"
                : "/trade/order/unselect.svg"
            }
            alt=""
            width={16}
            height={16}
            draggable={false}
            style={{
              display: "block",
              width: 16,
              height: 16,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: COLORS.white50,
            }}
          >
            Disable order confirmation
          </span>
        </button>

        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              height: 40,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              background: "rgba(255,255,255,0.1)",
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              height: 40,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              backgroundImage: GRADIENTS.connectBtn,
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5600,
        display: "flex",
        alignItems: isDrawer ? "flex-end" : "center",
        justifyContent: "center",
        padding: isDrawer ? 0 : 16,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes orderConfirmIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 0,
          border: "none",
          background: "rgba(0,0,0,0.55)",
          cursor: "pointer",
        }}
      />
      <div style={{ position: "relative", width: isDrawer ? "100%" : "auto" }}>
        {panel}
      </div>
    </div>,
    document.body,
  );
}
