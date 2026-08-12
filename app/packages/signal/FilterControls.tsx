import { useCallback, useRef, type CSSProperties } from "react";
import { FONT } from "../nav/design-system";

/** Figma 7773:182653 — ring thumb on 20% white track, end labels below. */
export function FigmaRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
  fullWidth = false,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
  fullWidth?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const thumb = 12;
      const usable = Math.max(1, rect.width - thumb);
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left - thumb / 2) / usable),
      );
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(Number(Math.min(max, Math.max(min, snapped)).toFixed(2)));
    },
    [max, min, onChange, step],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: fullWidth ? "100%" : "100%",
        maxWidth: fullWidth ? undefined : 168,
      }}
    >
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          setFromClientX(e.clientX);
        }}
        style={{
          position: "relative",
          width: "100%",
          height: 12,
          cursor: "pointer",
          touchAction: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 5,
            height: 2,
            borderRadius: 1,
            background: "rgba(255,255,255,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 5,
            height: 2,
            borderRadius: 1,
            width: `calc(${pct / 100} * (100% - 12px) + 6px)`,
            maxWidth: "100%",
            background: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            /* Keep thumb fully inside track so value=0 is not clipped */
            left: `calc(${pct / 100} * (100% - 12px))`,
            top: 0,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#131519",
            border: "2px solid #ffffff",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: FONT,
          }}
        >
          {minLabel}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: FONT,
          }}
        >
          {maxLabel}
        </span>
      </div>
    </div>
  );
}

/** Editable value field synced with slider (desktop sidebar). */
export function FilterNumberField({
  value,
  min,
  max,
  step,
  prefix = "",
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  onChange: (v: number) => void;
}) {
  const display =
    step < 1 ? value.toFixed(1) : String(Math.round(value));

  const fieldStyle: CSSProperties = {
    width: "100%",
    height: 36,
    padding: "0 8px",
    borderRadius: 6,
    border: "none",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: FONT,
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={display}
      aria-label={prefix ? `${prefix} ${display}` : display}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isNaN(n)) return;
        onChange(Number(Math.min(max, Math.max(min, n)).toFixed(step < 1 ? 1 : 0)));
      }}
      style={fieldStyle}
    />
  );
}
