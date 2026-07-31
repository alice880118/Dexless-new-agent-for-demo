import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { ACCOUNT, MARKET } from "./demoData";
import { PctSlider, qtyFromPct } from "./PctSlider";
import { SignalBarsIcon } from "./SignalBarsIcon";
import { TRADE_COLORS } from "./tradeLayout";
import { TpSlDrawer } from "./TpSlDrawer";
import {
  TpSlEstimatePopover,
  TPSL_LONG,
  TPSL_SHORT,
  type TpSlFieldKind,
} from "./TpSlEstimatePopover";
import {
  TpSlSettingsPicker,
  tpSlFieldLabel,
  tpSlModeUnit,
  type TpSlInputMode,
} from "./TpSlSettingsPicker";

export type OrderSide = "buy" | "sell";

type OrderType = "limit" | "market" | "stop";

type OrderPanelProps = {
  /** Force initial side when opened from mobile CTA */
  initialSide?: OrderSide;
  /** Compact: hide outer padding when embedded in sheet */
  embedded?: boolean;
  /** Narrow mobile column (~192px) */
  compact?: boolean;
  /** When false, show Login CTA + placeholder available */
  walletConnected?: boolean;
  /** Called when primary CTA is pressed (e.g. gate to connect) */
  onSubmit?: () => void;
  /** Open agent home (Trade DNA button) */
  onOpenAgent?: () => void;
  /** Open agent Signal page (signal bars icon) */
  onOpenAgentSignals?: () => void;
  style?: CSSProperties;
};

function Chevron({ size = 7 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 7 5" fill="none" aria-hidden>
      <path d="M1 1.2L3.5 3.8L6 1.2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: 999,
        border: selected
          ? `4px solid ${TRADE_COLORS.midAccent}`
          : "1px solid rgba(255,255,255,0.4)",
        boxSizing: "border-box",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        border: checked ? "none" : "1.5px solid rgba(255,255,255,0.35)",
        background: checked ? "#DBFD5C" : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {checked ? (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none" aria-hidden>
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

function TpSlPriceField({
  label,
  value,
  onChange,
  unit,
  onUnitClick,
  kind,
  mode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnitClick?: () => void;
  kind: TpSlFieldKind;
  mode: TpSlInputMode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );
  const filled = value.trim().length > 0;
  const showLabel = focused || filled;
  const accent = kind === "tp" ? TPSL_LONG : TPSL_SHORT;
  const valueColor = filled || focused ? accent : "rgba(255,255,255,0.8)";

  useEffect(() => {
    if (!focused) {
      setAnchor(null);
      return;
    }
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setAnchor({ top: r.top, left: r.left });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [focused, value]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 6,
        height: 44,
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        width: "100%",
        gap: 8,
        overflow: "visible",
        zIndex: focused ? 5 : 1,
      }}
    >
      {focused && anchor && typeof document !== "undefined"
        ? createPortal(
            <TpSlEstimatePopover
              kind={kind}
              mode={mode}
              value={value}
              anchorRect={anchor}
            />,
            document.body,
          )
        : null}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: showLabel ? 2 : 0,
          padding: showLabel ? "4px 0" : 0,
          boxSizing: "border-box",
        }}
      >
        {showLabel ? (
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
            {label}
          </span>
        ) : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={showLabel ? "" : label}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            outline: "none",
            fontFamily: FONT,
            fontSize: showLabel ? 14 : 12,
            fontWeight: showLabel ? 600 : 500,
            lineHeight: showLabel ? "14px" : "18px",
            letterSpacing: showLabel ? "-0.42px" : undefined,
            color: valueColor,
          }}
        />
      </div>
      <button
        type="button"
        onClick={onUnitClick}
        style={{
          border: "none",
          background: "transparent",
          padding: "0 2px",
          cursor: onUnitClick ? "pointer" : "default",
          display: "inline-flex",
          alignItems: "center",
          height: 24,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {unit}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 6.5L8 10.5L12 6.5"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function FieldBox({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: TRADE_COLORS.inputBg,
        borderRadius: 6,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const labelMuted: CSSProperties = {
  margin: 0,
  fontFamily: FONT,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "18px",
  color: COLORS.white50,
};

const valueText: CSSProperties = {
  margin: 0,
  fontFamily: FONT,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: "20px",
  color: "rgba(255,255,255,0.9)",
};

export function OrderPanel({
  initialSide = "buy",
  embedded = false,
  compact = false,
  walletConnected = true,
  onSubmit,
  onOpenAgent,
  onOpenAgentSignals,
  style,
}: OrderPanelProps) {
  const [side, setSide] = useState<OrderSide>(initialSide);
  const [orderType, setOrderType] = useState<OrderType>("limit");
  const [price, setPrice] = useState("3,303.3");
  const [qty, setQty] = useState("12");
  const [orderSize, setOrderSize] = useState("39,639.6");
  const [pct, setPct] = useState(0);
  const [midActive, setMidActive] = useState(true);
  const [tpSlOn, setTpSlOn] = useState(false);
  const [tpSlAdvancedOpen, setTpSlAdvancedOpen] = useState(false);
  const [tpSlSettingsOpen, setTpSlSettingsOpen] = useState(false);
  const [tpSlInputMode, setTpSlInputMode] = useState<TpSlInputMode>("price");
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");
  const [reduceOnly, setReduceOnly] = useState(false);
  const [tif, setTif] = useState<"post" | "ioc" | "fok" | null>(null);
  const [orderConfirm, setOrderConfirm] = useState(true);
  const [hidden, setHidden] = useState(false);

  const isBuy = side === "buy";
  const ctaLabel = !walletConnected
    ? "Login"
    : isBuy
      ? "Buy / Long"
      : "Sell / Short";
  const ctaBg = !walletConnected
    ? GRADIENTS.connectBtn
    : isBuy
      ? TRADE_COLORS.buyGrad
      : "linear-gradient(90deg, #ff41a3 0%, #be4584 100%)";

  const setPctAndQty = (next: number) => {
    setPct(next);
    setQty(qtyFromPct(ACCOUNT.maxBuy, next));
  };

  return (
    <div
      style={{
        width: "100%",
        height: compact ? "100%" : "auto",
        background: TRADE_COLORS.panel,
        borderRadius: embedded || compact ? 0 : 4,
        padding: compact ? "6px 8px 8px" : embedded ? "12px 12px 16px" : 12,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 6 : 12,
        fontFamily: FONT,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Buy / Sell — logged out: both muted gray */}
      <div style={{ display: "flex", gap: compact ? 6 : 8, width: "100%" }}>
        <button
          type="button"
          onClick={() => setSide("buy")}
          style={{
            flex: 1,
            height: compact ? 32 : 40,
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "20px",
            color: "#ffffff",
            background:
              !walletConnected || !isBuy
                ? TRADE_COLORS.sellMuted
                : TRADE_COLORS.buyGrad,
            opacity: !walletConnected ? 1 : isBuy ? 1 : 0.5,
          }}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          style={{
            flex: 1,
            height: compact ? 32 : 40,
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "20px",
            color: "#ffffff",
            background:
              !walletConnected || isBuy
                ? TRADE_COLORS.sellMuted
                : "linear-gradient(90deg, #ff41a3 0%, #be4584 100%)",
            opacity: !walletConnected ? 1 : !isBuy ? 1 : 0.5,
          }}
        >
          Sell
        </button>
      </div>

      {/* Margin / Trade DNA — Figma 7537:111017 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              style={{
                width: 78,
                height: 24,
                padding: "2px 8px",
                borderRadius: 6,
                border: "none",
                background: "rgba(255,255,255,0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxSizing: "border-box",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Cross
              <img
                src="/trade/order/chevron-down.svg"
                alt=""
                width={16}
                height={16}
                style={{
                  display: "block",
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  objectFit: "contain",
                }}
              />
            </button>
            <button
              type="button"
              style={{
                width: 78,
                height: 24,
                padding: "2px 8px",
                borderRadius: 6,
                border: "none",
                background: "rgba(255,255,255,0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxSizing: "border-box",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              75x
              <img
                src="/trade/order/chevron-down.svg"
                alt=""
                width={16}
                height={16}
                style={{
                  display: "block",
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  objectFit: "contain",
                }}
              />
            </button>
          </div>
          {walletConnected ? (
            <div
              style={{
                position: "relative",
                borderRadius: 999,
                padding: 1,
                flexShrink: 0,
                overflow: "hidden",
                isolation: "isolate",
                lineHeight: 0,
              }}
            >
              <style>{`
                @keyframes tradeDnaBorderSpin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 999,
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "220%",
                    height: "220%",
                    marginLeft: "-110%",
                    marginTop: "-110%",
                    background:
                      "conic-gradient(from 0deg, transparent 0%, transparent 45%, #7053F3 55%, #85D7CD 70%, #E3FF94 85%, transparent 100%)",
                    animation: "tradeDnaBorderSpin 3s linear infinite",
                  }}
                />
              </div>
              <button
                type="button"
                aria-label="Open Trader DNA"
                onClick={() => onOpenAgent?.()}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  margin: 0,
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: "none",
                  background: "#121419",
                  cursor: onOpenAgent ? "pointer" : "default",
                  boxSizing: "border-box",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/trade/order/trade-dna-sparkle.svg"
                  alt=""
                  width={13}
                  height={13}
                  style={{
                    display: "block",
                    width: 13,
                    height: 13,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: "18px",
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Trade DNA
                </span>
              </button>
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {(
                [
                  { id: "limit", label: "Limit" },
                  { id: "market", label: "Market" },
                  { id: "stop", label: "Stop Limit" },
                ] as const
              ).map((t) => {
                const active = orderType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOrderType(t.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: "18px",
                      color: active
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {t.label}
                    {t.id === "stop" ? (
                      <img
                        src="/trade/order/stop-limit-caret.svg"
                        alt=""
                        width={7}
                        height={5}
                        style={{
                          display: "block",
                          width: 7,
                          height: 5,
                          flexShrink: 0,
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Open signals"
              onClick={() => onOpenAgentSignals?.()}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.3)",
                background: "transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: onOpenAgentSignals ? "pointer" : "default",
                padding: 0,
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            >
              <SignalBarsIcon size={16} />
            </button>
          </div>
          <div style={{ position: "relative", width: "100%", height: 2 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 1,
                background: "rgba(227,231,234,0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left:
                  orderType === "limit" ? 0 : orderType === "market" ? 48 : 112,
                bottom: 0,
                width: orderType === "stop" ? 72 : 30,
                height: 2,
                borderRadius: 4,
                background: "rgba(255,255,255,0.9)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Available */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontFamily: FONT,
          fontSize: 12,
          lineHeight: "18px",
        }}
      >
        <span style={{ fontWeight: 500, color: COLORS.white50 }}>Available</span>
        <span style={{ display: "flex", gap: 2 }}>
          <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
            {walletConnected ? ACCOUNT.available : "--"}
          </span>
          <span style={{ fontWeight: 500, color: COLORS.white50 }}>USDC</span>
        </span>
      </div>

      {/* Price / Qty / Size */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        <FieldBox style={{ padding: "8px 12px", height: 56, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
              <span style={labelMuted}>Price</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  ...valueText,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  padding: 0,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
                flexShrink: 0,
              }}
            >
              <span style={labelMuted}>USDC</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setMidActive(false)}
                  style={{
                    border: "none",
                    borderRadius: 4,
                    padding: "2px 8px",
                    height: 20,
                    background: !midActive ? "rgba(255,255,255,0.15)" : "transparent",
                    color: COLORS.white50,
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  BBO
                </button>
                <button
                  type="button"
                  onClick={() => setMidActive(true)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 600,
                    color: midActive ? TRADE_COLORS.midAccent : COLORS.white50,
                    cursor: "pointer",
                  }}
                >
                  Mid
                </button>
              </div>
            </div>
          </div>
        </FieldBox>

        <div style={{ display: "flex", gap: 4, width: "100%" }}>
          <FieldBox style={{ flex: 1, padding: "8px 12px", minWidth: 0 }}>
            <span style={labelMuted}>Qty</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                style={{
                  ...valueText,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: 48,
                  padding: 0,
                }}
              />
              <span style={{ ...labelMuted, marginLeft: "auto" }}>{MARKET.base}</span>
            </div>
          </FieldBox>
          <FieldBox style={{ flex: 1, padding: "8px 12px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={labelMuted}>Order size≈</span>
              <Chevron size={7} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
              <input
                value={orderSize}
                onChange={(e) => setOrderSize(e.target.value)}
                style={{
                  ...valueText,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  flex: 1,
                  minWidth: 0,
                  padding: 0,
                }}
              />
              <span style={labelMuted}>USDC</span>
            </div>
          </FieldBox>
        </div>
      </div>

      {/* Slider — Figma 7445:96302 */}
      <PctSlider
        value={pct}
        onChange={setPctAndQty}
        maxLabel={isBuy ? "Max buy" : "Max sell"}
        maxValue={ACCOUNT.maxBuy}
        accent={isBuy ? "#46ccb9" : "#ff41a3"}
      />

      {/* CTA */}
      <button
        type="button"
        onClick={() => onSubmit?.()}
        style={{
          width: "100%",
          height: 40,
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          backgroundImage: ctaBg,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          lineHeight: "20px",
          color: "#ffffff",
        }}
      >
        {ctaLabel}
      </button>

      {/* Est / Fees */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONT,
            fontSize: 12,
            lineHeight: "18px",
          }}
        >
          <span style={{ color: COLORS.white50, fontWeight: 500 }}>Est. liq. price</span>
          <span style={{ display: "flex", gap: 2 }}>
            <span style={{ color: COLORS.white50, fontWeight: 500 }}>----</span>
            <span style={{ color: COLORS.white50, fontWeight: 500 }}>USDC</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONT,
            fontSize: 12,
            lineHeight: "18px",
          }}
        >
          <span style={{ color: COLORS.white50, fontWeight: 500 }}>Fees</span>
          <span style={{ color: COLORS.white50, fontWeight: 500 }}>
            Taker 1% | Maker 1%
          </span>
        </div>
        <div
          style={{
            height: 1,
            width: "100%",
            background: "rgba(255,255,255,0.1)",
            marginTop: 6,
          }}
        />
      </div>

      {/* TP/SL — Figma 7445:97970 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setTpSlOn(!tpSlOn)}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CheckBox checked={tpSlOn} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              TP/SL
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTpSlOn(true);
              setTpSlAdvancedOpen(true);
            }}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              color: "#DBFD5C",
            }}
          >
            Advanced
              <img
              src="/trade/order/advanced-gear.svg"
              alt=""
              width={14}
              height={14}
              style={{
                display: "block",
                width: 14,
                height: 14,
                minWidth: 14,
                minHeight: 14,
                flexShrink: 0,
                objectFit: "contain",
              }}
            />
          </button>
        </div>

        {tpSlOn ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 24,
                padding: "2px 8px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.1)",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
                boxSizing: "border-box",
                width: "fit-content",
              }}
            >
              Cross
            </span>
            <TpSlPriceField
              label={tpSlFieldLabel(tpSlInputMode, "tp")}
              value={tpPrice}
              onChange={setTpPrice}
              unit={tpSlModeUnit(tpSlInputMode)}
              onUnitClick={() => setTpSlSettingsOpen(true)}
              kind="tp"
              mode={tpSlInputMode}
            />
            <TpSlPriceField
              label={tpSlFieldLabel(tpSlInputMode, "sl")}
              value={slPrice}
              onChange={setSlPrice}
              unit={tpSlModeUnit(tpSlInputMode)}
              onUnitClick={() => setTpSlSettingsOpen(true)}
              kind="sl"
              mode={tpSlInputMode}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => setReduceOnly(!reduceOnly)}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CheckBox checked={reduceOnly} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Reduce only
            </span>
          </button>
        </div>

        {!compact ? (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: TRADE_COLORS.inputBg,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {(
                [
                  { id: "post" as const, label: "Post only" },
                  { id: "ioc" as const, label: "IOC" },
                  { id: "fok" as const, label: "FOK" },
                ]
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setTif(tif === r.id ? null : r.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 500,
                    color: COLORS.white50,
                  }}
                >
                  <RadioDot selected={tif === r.id} />
                  {r.label}
                </button>
              ))}
            </div>
            <span style={{ color: TRADE_COLORS.midAccent, fontSize: 14 }} aria-hidden>
              ♟
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setOrderConfirm(!orderConfirm)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 500,
                color: COLORS.white50,
              }}
            >
              <CheckBox checked={orderConfirm} />
              Order confirm
            </button>
            <button
              type="button"
              onClick={() => setHidden(!hidden)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 500,
                color: COLORS.white50,
              }}
            >
              <CheckBox checked={hidden} />
              Hidden
            </button>
          </div>
        </div>
        ) : null}
      </div>

      <TpSlSettingsPicker
        open={tpSlSettingsOpen}
        value={tpSlInputMode}
        onSelect={setTpSlInputMode}
        onClose={() => setTpSlSettingsOpen(false)}
      />

      <TpSlDrawer
        open={tpSlAdvancedOpen}
        variant="order"
        initialSide={side}
        initialMode="full"
        initialValues={{
          mode: "full",
          tpTrigger: tpPrice,
          slTrigger: slPrice,
        }}
        onClose={() => setTpSlAdvancedOpen(false)}
        onSubmit={(payload) => {
          if (payload.tpTrigger) setTpPrice(payload.tpTrigger);
          if (payload.slTrigger) setSlPrice(payload.slTrigger);
          setTpSlOn(true);
          setTpSlAdvancedOpen(false);
        }}
      />
    </div>
  );
}
