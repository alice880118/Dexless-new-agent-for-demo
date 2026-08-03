import { useRef, useState } from "react";
import { FONT } from "../nav/design-system";
import {
  TPSL_PNL_MODES,
  TpSlSettingsPicker,
  type TpSlInputMode,
} from "./TpSlSettingsPicker";

export type PnlFieldMode = "pnl" | "offset" | "offset_pct";

export const PNL_FIELD_MODES: {
  id: PnlFieldMode;
  menuLabel: string;
  menuSub?: string;
  inputLabel: string;
  unit: string;
}[] = [
  { id: "pnl", menuLabel: "PnL", inputLabel: "PnL", unit: "USDC" },
  {
    id: "offset",
    menuLabel: "Offset",
    menuSub: "(From entry)",
    inputLabel: "Offset",
    unit: "USDC",
  },
  {
    id: "offset_pct",
    menuLabel: "Offset",
    menuSub: "(From entry)%",
    inputLabel: "Offset %",
    unit: "%",
  },
];

function modeMeta(mode: PnlFieldMode) {
  return PNL_FIELD_MODES.find((m) => m.id === mode) ?? PNL_FIELD_MODES[0];
}

type PnlModeFieldProps = {
  mode: PnlFieldMode;
  onModeChange: (mode: PnlFieldMode) => void;
  value: string;
  onChange: (v: string) => void;
  valueColor?: string;
};

/** Figma 7541:66613 field + 7541:66620 settings picker */
export function PnlModeField({
  mode,
  onModeChange,
  value,
  onChange,
  valueColor,
}: PnlModeFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filled = value.trim().length > 0;
  const showInputLabel = focused || filled;
  const meta = modeMeta(mode);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        flex: "1 1 0",
        minWidth: 0,
        width: "100%",
        height: 44,
        minHeight: 44,
        maxHeight: 44,
        flexShrink: 0,
        boxSizing: "border-box",
        borderRadius: 6,
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: "0 8px",
        fontFamily: FONT,
        zIndex: focused ? 6 : 1,
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: showInputLabel ? 2 : 0,
          padding: showInputLabel ? "4px 0" : 0,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {showInputLabel ? (
          <span
            style={{
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 500,
              lineHeight: "16px",
              color: "rgba(255,255,255,0.5)",
              pointerEvents: "none",
            }}
          >
            {meta.inputLabel}
          </span>
        ) : meta.menuSub ? (
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
              pointerEvents: "none",
            }}
          >
            <span>{meta.menuLabel}</span>
            <span>{meta.menuSub}</span>
          </span>
        ) : (
          <span
            style={{
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
              pointerEvents: "none",
            }}
          >
            {meta.menuLabel}
          </span>
        )}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            fontFamily: FONT,
            fontSize: showInputLabel ? 14 : 12,
            fontWeight: showInputLabel ? 600 : 500,
            lineHeight: showInputLabel ? "14px" : "18px",
            letterSpacing: showInputLabel ? "-0.42px" : undefined,
            color: showInputLabel
              ? (valueColor ?? "rgba(255,255,255,0.9)")
              : "transparent",
            caretColor: valueColor ?? "rgba(255,255,255,0.9)",
            fontVariantNumeric: "tabular-nums",
            position: showInputLabel ? "relative" : "absolute",
            inset: showInputLabel ? undefined : 0,
            height: showInputLabel ? undefined : "100%",
            opacity: 1,
            cursor: "text",
          }}
        />
      </div>

      <button
        type="button"
        aria-label="Select PnL mode"
        aria-expanded={settingsOpen}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          setSettingsOpen(true);
        }}
        style={{
          border: "none",
          background: "transparent",
          padding: "0 2px",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          height: 24,
          flexShrink: 0,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {meta.unit}
        <img
          src="/trade/order/unit-caret.svg"
          alt=""
          width={16}
          height={16}
          style={{ display: "block", width: 16, height: 16 }}
        />
      </button>

      <TpSlSettingsPicker
        open={settingsOpen}
        value={mode}
        modes={TPSL_PNL_MODES}
        zIndex={5500}
        onSelect={(id: TpSlInputMode) => {
          if (id === "price") return;
          onModeChange(id);
        }}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
