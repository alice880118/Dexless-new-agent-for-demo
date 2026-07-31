import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { FONT } from "../nav/design-system";

const STOPS = [0, 25, 50, 75, 100] as const;
const TEAL = "#46ccb9";
const TRACK = "rgba(255,255,255,0.15)";
const DOT = "#0a0b0d";

type PctSliderProps = {
  value: number;
  onChange: (pct: number) => void;
  maxLabel?: string;
  maxValue: string;
  accent?: string;
};

/** Figma 7445:96302 — pct slider with teal fill + max label */
export function PctSlider({
  value,
  onChange,
  maxLabel = "Max buy",
  maxValue,
  accent = TEAL,
}: PctSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = Math.max(0, Math.min(100, value));

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      onChange(Math.round(Math.max(0, Math.min(100, raw))));
    },
    [onChange],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        fontFamily: FONT,
      }}
    >
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        style={{
          position: "relative",
          height: 12,
          width: "100%",
          cursor: "pointer",
          touchAction: "none",
          userSelect: "none",
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
            background: TRACK,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 5,
            height: 2,
            width: `${pct}%`,
            borderRadius: 1,
            background: accent,
          }}
        />
        {STOPS.map((s) => {
          const active = pct >= s;
          return (
            <button
              key={s}
              type="button"
              aria-label={`${s}%`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(s);
              }}
              style={{
                position: "absolute",
                left: `calc(${s}% - 4px)`,
                top: 2,
                width: 8,
                height: 8,
                borderRadius: 999,
                border: `1.5px solid ${active || s === 0 ? accent : "rgba(255,255,255,0.25)"}`,
                background: active && s > 0 && s < pct ? accent : DOT,
                padding: 0,
                cursor: "pointer",
                boxSizing: "border-box",
                zIndex: 1,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            left: `calc(${pct}% - 6px)`,
            top: 0,
            width: 12,
            height: 12,
            borderRadius: 999,
            border: `2px solid ${accent}`,
            background: DOT,
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          lineHeight: "18px",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontWeight: 600, color: accent }}>{pct}%</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {maxLabel}
          </span>
          <span style={{ fontWeight: 600, color: accent }}>{maxValue}</span>
        </span>
      </div>
    </div>
  );
}

export function qtyFromPct(maxBuy: string, pct: number): string {
  const max = Number(String(maxBuy).replace(/,/g, ""));
  if (!Number.isFinite(max) || max <= 0) return "0";
  const q = (max * Math.max(0, Math.min(100, pct))) / 100;
  if (q === 0) return "0";
  if (q >= 1) return q.toFixed(2);
  return q.toFixed(5);
}
