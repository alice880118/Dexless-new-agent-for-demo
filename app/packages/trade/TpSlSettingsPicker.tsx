import { createPortal } from "react-dom";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";

export type TpSlInputMode =
  | "price"
  | "pnl"
  | "offset"
  | "offset_pct";

export const TPSL_INPUT_MODES: {
  id: TpSlInputMode;
  label: string;
  desc: string;
}[] = [
  {
    id: "price",
    label: "Price",
    desc: "Set take-profit and stop-loss based on the asset price.",
  },
  {
    id: "pnl",
    label: "PnL",
    desc: "Set take-profit and stop-loss based on profit or loss.",
  },
  {
    id: "offset",
    label: "Offset (Entry Price)",
    desc: "Enter the price difference from the entry price. The system will calculate the target price.",
  },
  {
    id: "offset_pct",
    label: "Offset (Entry Price %)",
    desc: "Enter the percentage difference from the entry price. The system will calculate the target price.",
  },
];

export function tpSlModeLabel(mode: TpSlInputMode): string {
  return TPSL_INPUT_MODES.find((m) => m.id === mode)?.label ?? "Price";
}

/** Field label in order TP/SL inputs (Figma tip screens) */
export function tpSlFieldLabel(
  mode: TpSlInputMode,
  kind: "tp" | "sl",
): string {
  if (mode === "offset") return "Offset(From entry)";
  if (mode === "offset_pct") return "Offset(From entry)%";
  return kind === "tp" ? "TP" : "SL";
}

export function tpSlModeUnit(mode: TpSlInputMode): string {
  if (mode === "offset_pct") return "%";
  if (mode === "pnl") return "USDC";
  return "USDC";
}

type TpSlSettingsPickerProps = {
  open: boolean;
  value: TpSlInputMode;
  onSelect: (id: TpSlInputMode) => void;
  onClose: () => void;
};

/** Figma 7433:50069 — >768 dialog, <768 bottom drawer */
export function TpSlSettingsPicker({
  open,
  value,
  onSelect,
  onClose,
}: TpSlSettingsPickerProps) {
  const bp = useBreakpoint();
  const isDrawer = bp === "390";

  if (!open || typeof document === "undefined") return null;

  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="TP/SL Settings"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: isDrawer ? undefined : 390,
        background: "#0c0d10",
        borderRadius: isDrawer ? "4px 4px 0 0" : 8,
        border: isDrawer ? "none" : "1px solid #383838",
        boxSizing: "border-box",
        padding: isDrawer
          ? "20px 20px calc(48px + env(safe-area-inset-bottom, 0px))"
          : "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: isDrawer
          ? "tpSlSettingsDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
          : undefined,
        maxHeight: isDrawer ? "85vh" : "min(720px, 92dvh)",
        overflow: "auto",
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
          TP/SL Settings
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        {TPSL_INPUT_MODES.map((m) => {
          const selected = m.id === value;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelect(m.id);
                onClose();
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 4,
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: selected
                  ? "1px solid rgba(255,255,255,0.6)"
                  : "1px solid transparent",
                background: "rgba(255,255,255,0.05)",
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
                  {m.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 500,
                    lineHeight: "16px",
                    letterSpacing: "-0.33px",
                    color: COLORS.white40,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {m.desc}
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
                    marginTop: 6,
                  }}
                />
              ) : (
                <span style={{ width: 5, flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4300,
        display: "flex",
        alignItems: isDrawer ? "flex-end" : "center",
        justifyContent: "center",
        padding: isDrawer ? 0 : 16,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes tpSlSettingsDrawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes tpSlSettingsBackdropIn {
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
          animation: "tpSlSettingsBackdropIn 0.22s ease-out both",
        }}
      />
      <div style={{ position: "relative", width: isDrawer ? "100%" : "auto" }}>
        {panel}
      </div>
    </div>,
    document.body,
  );
}
