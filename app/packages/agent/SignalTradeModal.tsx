import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { FONT } from "../nav/design-system";
import { useSignalCountdown } from "./signal-countdown";
import type { SignalCardData } from "./SignalViews";

const ASSETS = {
  close: "/trader-dna/close.svg",
  clock: "/trader-dna/signal/clock-time.png",
} as const;

/** Figma 7452:138834 — Signal card anchored to Trade order panel. */
export function SignalTradeModal({
  data,
  onClose,
  /** <768: force label/value text to 13px */
  dense = false,
}: {
  data: SignalCardData;
  onClose: () => void;
  dense?: boolean;
}) {
  const timerLabel = useSignalCountdown(data.id, data.timer);
  const titleSize = dense ? 13 : 14;
  const symbolSize = dense ? 13 : 16;
  const labelSize = dense ? 13 : 12;
  const valueSize = dense ? 13 : 16;
  const rowValueSize = dense ? 13 : 14;
  const badgeSize = dense ? 13 : 12;

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onDragPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: offset.x,
        origY: offset.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [offset.x, offset.y],
  );

  const onDragPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    setOffset({
      x: d.origX + (e.clientX - d.startX),
      y: d.origY + (e.clientY - d.startY),
    });
  }, []);

  const onDragPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  useEffect(() => {
    setOffset({ x: 0, y: 0 });
  }, [data.id]);

  return (
    <div
      role="dialog"
      aria-label="Signal"
      data-signal-trade-card
      onPointerDown={onDragPointerDown}
      onPointerMove={onDragPointerMove}
      onPointerUp={onDragPointerUp}
      onPointerCancel={onDragPointerUp}
      style={{
        width: "100%",
        maxWidth: dense ? undefined : 360,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 0",
        borderRadius: 8,
        border: "1px solid #717171",
        background: "#121419",
        fontFamily: FONT,
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        position: "relative",
        zIndex: 30,
        overflow: "visible",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0 12px 4px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: titleSize,
                fontWeight: 600,
                lineHeight: dense ? "18px" : "20px",
                color: "#ffffff",
              }}
            >
              Signal
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{
                width: 14,
                height: 14,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={ASSETS.close}
                alt=""
                width={14}
                height={14}
                style={{ display: "block", width: 14, height: 14 }}
              />
            </button>
          </div>
          <div
            style={{
              height: 1,
              width: "100%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: symbolSize,
                fontWeight: 700,
                lineHeight: dense ? "18px" : "20px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {data.symbol}
            </span>
            <span
              style={{
                padding: "1px 8px",
                borderRadius: 4,
                background: "rgba(255,65,163,0.05)",
                color: "#ff41a3",
                fontSize: badgeSize,
                fontWeight: 600,
                lineHeight: "18px",
              }}
            >
              {data.side}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: labelSize,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum" 1, "lnum" 1',
                minWidth: dense ? 72 : 78,
                justifyContent: "flex-end",
              }}
            >
              <img
                src={ASSETS.clock}
                alt=""
                width={14}
                height={14}
                style={{ display: "block", flexShrink: 0 }}
              />
              {timerLabel}
            </span>
            <span
              style={{
                padding: "2px 6px",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.13)",
                fontSize: badgeSize,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {data.ttl}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "0 12px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: labelSize,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Entry (limit)
          </span>
          <span
            style={{
              fontSize: valueSize,
              fontWeight: 600,
              lineHeight: dense ? "18px" : "20px",
              letterSpacing: dense ? undefined : "-0.48px",
              color: "rgba(255,255,255,0.9)",
              fontVariantNumeric: "tabular-nums lining-nums",
            }}
          >
            {data.entry}
          </span>
        </div>
        <div
          style={{
            height: 1,
            width: "100%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span
              style={{
                width: dense ? undefined : 70,
                fontSize: labelSize,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Stop loss
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: dense ? undefined : 60,
                  fontSize: labelSize,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {data.stopLossPct}
              </span>
              <span
                style={{
                  width: dense ? undefined : 75,
                  textAlign: "right",
                  fontSize: rowValueSize,
                  fontWeight: 600,
                  lineHeight: dense ? "18px" : "12px",
                  letterSpacing: dense ? undefined : "-0.42px",
                  color: "#ff41a3",
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {data.stopLoss}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span
              style={{
                width: dense ? undefined : 70,
                fontSize: labelSize,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Take profit
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: dense ? undefined : 60,
                  fontSize: labelSize,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {data.takeProfitPct}
              </span>
              <span
                style={{
                  width: dense ? undefined : 75,
                  textAlign: "right",
                  fontSize: rowValueSize,
                  fontWeight: 600,
                  lineHeight: dense ? "18px" : "12px",
                  letterSpacing: dense ? undefined : "-0.42px",
                  color: "#00ffab",
                  fontVariantNumeric: "tabular-nums lining-nums",
                }}
              >
                {data.takeProfit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
