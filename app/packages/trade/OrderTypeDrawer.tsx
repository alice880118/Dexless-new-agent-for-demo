import { createPortal } from "react-dom";
import { FONT } from "../nav/design-system";
import {
  DrawerDragHandle,
  DrawerOptionRow,
  DRAWER_PAD,
  DRAWER_SHELL,
  DRAWER_TITLE,
} from "./MobileDrawerChrome";

export type MobileOrderType =
  | "limit"
  | "market"
  | "post_only"
  | "stop_limit"
  | "stop_market"
  | "scaled"
  | "trailing_stop";

/** Figma 7541:66775 order — Limit → Market → Post Only → Stop Limit → … */
export const MOBILE_ORDER_TYPES: {
  id: MobileOrderType;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "limit",
    label: "Limit",
    desc: "Buy or sell at a specified price or better",
    icon: "/trade/order/types/limit.svg",
  },
  {
    id: "market",
    label: "Market",
    desc: "Buy or sell immediately at the best available market price",
    icon: "/trade/order/types/market.svg",
  },
  {
    id: "post_only",
    label: "Post Only",
    desc: "Maker only. Canceled if it would execute immediately",
    icon: "/trade/order/types/post-only.svg",
  },
  {
    id: "stop_limit",
    label: "Stop Limit",
    desc: "Place a limit order when the trigger price is reached",
    icon: "/trade/order/types/stop-limit.svg",
  },
  {
    id: "stop_market",
    label: "Stop Market",
    desc: "Place a market order when the trigger price is reached",
    icon: "/trade/order/types/stop-market.svg",
  },
  {
    id: "scaled",
    label: "Scaled",
    desc: "Place multiple limit orders within a specified price range",
    icon: "/trade/order/types/scaled.svg",
  },
  {
    id: "trailing_stop",
    label: "Trailing Stop",
    desc: "Track favorable price moves and trigger on a set reversal",
    icon: "/trade/order/types/trailing-stop.svg",
  },
];

type OrderTypeDrawerProps = {
  open: boolean;
  value: MobileOrderType;
  onSelect: (id: MobileOrderType) => void;
  onClose: () => void;
};

/** Bottom drawer — Figma 7541:66775 */
export function OrderTypeDrawer({
  open,
  value,
  onSelect,
  onClose,
}: OrderTypeDrawerProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <style>{`
        @keyframes orderTypeDrawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes orderTypeDrawerBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 0,
          border: "none",
          background: "rgba(0,0,0,0.55)",
          cursor: "pointer",
          animation: "orderTypeDrawerBackdropIn 0.22s ease-out both",
        }}
      />
      <div
        role="dialog"
        aria-label="Order Type"
        className="trade-drag-scroll"
        style={{
          ...DRAWER_SHELL,
          position: "relative",
          width: "100%",
          maxHeight: "85vh",
          padding: DRAWER_PAD,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          animation:
            "orderTypeDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <DrawerDragHandle />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 24,
            flexShrink: 0,
          }}
        >
          <span style={DRAWER_TITLE}>Order Type</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
          }}
        >
          {MOBILE_ORDER_TYPES.map((t) => {
            const selected = t.id === value;
            return (
              <DrawerOptionRow
                key={t.id}
                selected={selected}
                onClick={() => {
                  onSelect(t.id);
                  onClose();
                }}
              >
                <img
                  src={t.icon}
                  alt=""
                  width={24}
                  height={18}
                  draggable={false}
                  style={{
                    display: "block",
                    width: 24,
                    height: 18,
                    minWidth: 24,
                    minHeight: 18,
                    flexShrink: 0,
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: "18px",
                      letterSpacing: "-0.42px",
                      color: "#ffffff",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {t.label}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: "18px",
                      letterSpacing: "-0.36px",
                      color: "rgba(255,255,255,0.5)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {t.desc}
                  </span>
                </div>
              </DrawerOptionRow>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
