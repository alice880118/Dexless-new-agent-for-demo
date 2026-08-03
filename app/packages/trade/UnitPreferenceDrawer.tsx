import { createPortal } from "react-dom";
import { FONT } from "../nav/design-system";
import {
  DrawerDragHandle,
  DrawerSelectDot,
  DRAWER_OPTION_SELECTED_BG,
  DRAWER_PAD,
  DRAWER_SHELL,
  DRAWER_TITLE,
} from "./MobileDrawerChrome";

/** How quantity is entered / displayed */
export type QtyUnitPref =
  | "base"
  | "order_size"
  | "initial_margin";

export function qtyUnitLabel(pref: QtyUnitPref, base: string): string {
  if (pref === "base") return base;
  return "USDC";
}

export function qtyFieldLabel(pref: QtyUnitPref): string {
  if (pref === "order_size") return "Order size";
  if (pref === "initial_margin") return "Initial margin";
  return "Quantity";
}

export function qtyPrefIsQuote(pref: QtyUnitPref): boolean {
  return pref === "order_size" || pref === "initial_margin";
}

type UnitPreferenceDrawerProps = {
  open: boolean;
  value: QtyUnitPref;
  baseSymbol: string;
  quoteSymbol?: string;
  onSelect: (pref: QtyUnitPref) => void;
  onClose: () => void;
};

/** Figma 7433:50547 — Unit Preference */
export function UnitPreferenceDrawer({
  open,
  value,
  baseSymbol,
  quoteSymbol = "USDC",
  onSelect,
  onClose,
}: UnitPreferenceDrawerProps) {
  if (!open || typeof document === "undefined") return null;

  const quoteSelected = qtyPrefIsQuote(value);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <style>{`
        @keyframes unitPrefDrawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes unitPrefDrawerBackdropIn {
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
          animation: "unitPrefDrawerBackdropIn 0.22s ease-out both",
        }}
      />
      <div
        role="dialog"
        aria-label="Unit Preference"
        style={{
          ...DRAWER_SHELL,
          position: "relative",
          width: "100%",
          padding: DRAWER_PAD,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          animation:
            "unitPrefDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
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
          <span style={DRAWER_TITLE}>Unit Preference</span>
        </div>

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
            onClick={() => {
              onSelect("base");
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 8,
              background:
                value === "base" ? DRAWER_OPTION_SELECTED_BG : "transparent",
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
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {baseSymbol}
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: "16px",
                  letterSpacing: "-0.33px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Display the order size in {baseSymbol}.
              </span>
            </div>
            <DrawerSelectDot selected={value === "base"} />
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background: quoteSelected
                ? DRAWER_OPTION_SELECTED_BG
                : "transparent",
              boxSizing: "border-box",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onSelect(
                  value === "initial_margin" ? "initial_margin" : "order_size",
                );
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 4,
                width: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
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
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {quoteSymbol}
                </span>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 500,
                    lineHeight: "16px",
                    letterSpacing: "-0.33px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Display the order size in {quoteSymbol}, with the option to
                  enter the initial margin amount.
                </span>
              </div>
              <DrawerSelectDot selected={quoteSelected} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {(
                [
                  { id: "order_size" as const, label: "Order Size" },
                  { id: "initial_margin" as const, label: "Initial margin" },
                ] as const
              ).map((opt) => {
                const checked = value === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelect(opt.id);
                      onClose();
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={
                        checked
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
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: "18px",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
