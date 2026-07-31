import { createPortal } from "react-dom";
import { COLORS, FONT } from "../nav/design-system";

export type MobileOrderType =
  | "limit"
  | "market"
  | "post_only"
  | "stop_limit"
  | "stop_market"
  | "scaled"
  | "trailing_stop";

export const MOBILE_ORDER_TYPES: {
  id: MobileOrderType;
  label: string;
  desc: string;
}[] = [
  {
    id: "limit",
    label: "Limit",
    desc: "Buy or sell at a specified price or better",
  },
  {
    id: "market",
    label: "Market",
    desc: "Buy or sell immediately at the best available market price",
  },
  {
    id: "post_only",
    label: "Post Only",
    desc: "Maker only. Canceled if it would execute immediately",
  },
  {
    id: "stop_limit",
    label: "Stop Limit",
    desc: "Place a limit order when the trigger price is reached",
  },
  {
    id: "stop_market",
    label: "Stop Market",
    desc: "Place a market order when the trigger price is reached",
  },
  {
    id: "scaled",
    label: "Scaled",
    desc: "Place multiple limit orders within a specified price range",
  },
  {
    id: "trailing_stop",
    label: "Trailing Stop",
    desc: "Track favorable price moves and trigger on a set reversal",
  },
];

type OrderTypeDrawerProps = {
  open: boolean;
  value: MobileOrderType;
  onSelect: (id: MobileOrderType) => void;
  onClose: () => void;
};

/** Bottom drawer — matches project chain/deposit drawer pattern + Figma 7432:48887 */
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
        style={{
          position: "relative",
          width: "100%",
          maxHeight: "85vh",
          background: "#0c0d10",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          boxSizing: "border-box",
          padding: "20px 20px calc(48px + env(safe-area-inset-bottom, 0px))",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          animation: "orderTypeDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 24,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "20px",
              color: "#ffffff",
            }}
          >
            Order Type
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
          }}
        >
          {MOBILE_ORDER_TYPES.map((t, i) => {
            const selected = t.id === value;
            return (
              <div key={t.id}>
                {i > 0 ? (
                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.08)",
                      marginBottom: 12,
                    }}
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    onSelect(t.id);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    width: "100%",
                    padding: 8,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
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
                      }}
                    >
                      {t.label}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 11,
                        fontWeight: 500,
                        lineHeight: "16px",
                        letterSpacing: "-0.33px",
                        color: COLORS.white40,
                      }}
                    >
                      {t.desc}
                    </span>
                  </div>
                  {selected ? (
                    <span
                      aria-hidden
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 999,
                        background: "#dbfd5c",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <span style={{ width: 5, flexShrink: 0 }} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
