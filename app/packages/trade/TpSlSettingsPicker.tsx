import { createPortal } from "react-dom";
import { FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import {
  DrawerDragHandle,
  DrawerOptionRow,
  DRAWER_PAD,
  DRAWER_SHELL,
  DRAWER_TITLE,
} from "./MobileDrawerChrome";

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

/** Figma 7541:66620 — PnL / Offset / Offset% only */
export const TPSL_PNL_MODES: TpSlInputMode[] = [
  "pnl",
  "offset",
  "offset_pct",
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

/** SL PnL is always a loss — keep / coerce to a leading minus while typing. */
export function normalizeSlPnlInput(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (t === "-" || t === "+") return "-";
  const body = t.replace(/^[+-]+/, "");
  if (!body) return "-";
  return `-${body}`;
}

type TpSlSettingsPickerProps = {
  open: boolean;
  value: TpSlInputMode;
  onSelect: (id: TpSlInputMode) => void;
  onClose: () => void;
  /** Default: all modes. Pass TPSL_PNL_MODES for Figma 7541:66620. */
  modes?: readonly TpSlInputMode[];
  zIndex?: number;
};

/** Figma 7541:66620 / 7433:50069 — >768 dialog, <768 bottom drawer */
export function TpSlSettingsPicker({
  open,
  value,
  onSelect,
  onClose,
  modes,
  zIndex = 4300,
}: TpSlSettingsPickerProps) {
  const bp = useBreakpoint();
  const isDrawer = bp === "390";

  if (!open || typeof document === "undefined") return null;

  const options = modes
    ? TPSL_INPUT_MODES.filter((m) => modes.includes(m.id))
    : TPSL_INPUT_MODES;

  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="TP/SL Settings"
      onClick={(e) => e.stopPropagation()}
      className="trade-drag-scroll"
      style={{
        ...(isDrawer ? DRAWER_SHELL : {}),
        width: "100%",
        maxWidth: isDrawer ? undefined : 390,
        background: "#0c0d10",
        borderRadius: isDrawer ? undefined : 8,
        border: isDrawer ? "none" : "1px solid #383838",
        boxSizing: "border-box",
        padding: isDrawer ? DRAWER_PAD : "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: isDrawer
          ? "tpSlSettingsDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
          : undefined,
        maxHeight: isDrawer ? "85vh" : "min(720px, 92dvh)",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {isDrawer ? <DrawerDragHandle /> : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 24,
          flexShrink: 0,
        }}
      >
        <span style={DRAWER_TITLE}>TP/SL Settings</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
        }}
      >
        {options.map((m) => {
          const selected = m.id === value;
          return (
            <DrawerOptionRow
              key={m.id}
              selected={selected}
              onClick={() => {
                onSelect(m.id);
                onClose();
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
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: "18px",
                    letterSpacing: "-0.36px",
                    color: "rgba(255,255,255,0.5)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {m.desc}
                </span>
              </div>
            </DrawerOptionRow>
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
        zIndex,
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
        .trade-drag-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
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
