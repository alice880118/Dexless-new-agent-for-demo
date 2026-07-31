import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { ACCOUNT } from "./demoData";
import {
  MOBILE_ORDER_TYPES,
  OrderTypeDrawer,
  type MobileOrderType,
} from "./OrderTypeDrawer";
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

type MobileOrderPanelProps = {
  onSubmit?: () => void;
  walletConnected?: boolean;
  onOpenAgentSignals?: () => void;
};

function Chevron({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckBox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        border: checked ? "none" : "1.5px solid rgba(255,255,255,0.35)",
        background: checked ? "#DBFD5C" : "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        cursor: "pointer",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      {checked ? (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

function UnitInput({
  label,
  value,
  onChange,
  unit,
  showUnit = true,
  trailing,
  onUnitClick,
  style,
  estimateKind,
  estimateMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  showUnit?: boolean;
  trailing?: ReactNode;
  onUnitClick?: () => void;
  style?: CSSProperties;
  estimateKind?: TpSlFieldKind;
  estimateMode?: TpSlInputMode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );
  const filled = value.trim().length > 0;
  const showLabel = focused || filled;
  const showTip = Boolean(estimateKind && estimateMode && focused);
  const accent =
    estimateKind === "tp"
      ? TPSL_LONG
      : estimateKind === "sl"
        ? TPSL_SHORT
        : null;
  const valueColor =
    accent && (filled || focused) ? accent : "rgba(255,255,255,0.8)";

  useEffect(() => {
    if (!showTip) {
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
  }, [showTip, value]);

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
        zIndex: showTip ? 5 : 1,
        ...style,
      }}
    >
      {showTip && estimateKind && estimateMode && anchor && typeof document !== "undefined"
        ? createPortal(
            <TpSlEstimatePopover
              kind={estimateKind}
              mode={estimateMode}
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
            outline: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            fontFamily: FONT,
            fontSize: showLabel ? 14 : 12,
            fontWeight: showLabel ? 600 : 500,
            lineHeight: showLabel ? "14px" : "18px",
            letterSpacing: showLabel ? "-0.42px" : undefined,
            color: valueColor,
          }}
        />
      </div>
      {trailing}
      {showUnit && unit ? (
        <button
          type="button"
          onClick={onUnitClick}
          style={{
            border: "none",
            background: "transparent",
            cursor: onUnitClick ? "pointer" : "default",
            display: "inline-flex",
            alignItems: "center",
            height: 24,
            padding: "0 2px",
            flexShrink: 0,
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {unit}
          <Chevron size={16} />
        </button>
      ) : null}
    </div>
  );
}


function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <circle
            key={`${r}-${c}`}
            cx={3 + c * 5}
            cy={3 + r * 5}
            r="1.2"
            fill="rgba(255,255,255,0.55)"
          />
        )),
      )}
    </svg>
  );
}

function SignalIcon({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Open signals"
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.3)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        background: "transparent",
        padding: 0,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <SignalBarsIcon size={14} />
    </button>
  );
}

function orderTypeLabel(id: MobileOrderType) {
  return MOBILE_ORDER_TYPES.find((t) => t.id === id)?.label ?? "Limit";
}

export function MobileOrderPanel({
  onSubmit,
  walletConnected = true,
  onOpenAgentSignals,
}: MobileOrderPanelProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<MobileOrderType>("limit");
  const [typeOpen, setTypeOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const [tpSl, setTpSl] = useState(false);
  const [tpSlAdvancedOpen, setTpSlAdvancedOpen] = useState(false);
  const [tpSlSettingsOpen, setTpSlSettingsOpen] = useState(false);
  const [tpSlInputMode, setTpSlInputMode] = useState<TpSlInputMode>("price");
  const [tpPrice, setTpPrice] = useState("");
  const [slPrice, setSlPrice] = useState("");
  const [reduceOnly, setReduceOnly] = useState(false);
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [trigger, setTrigger] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [orderCount, setOrderCount] = useState("");
  const [callback, setCallback] = useState("");

  const isBuy = side === "buy";
  const setPctAndQty = (next: number) => {
    setPct(next);
    setQty(qtyFromPct(ACCOUNT.maxBuy, next));
  };
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

  const showPriceRow =
    orderType === "limit" || orderType === "post_only";
  const showTrigger =
    orderType === "stop_limit" ||
    orderType === "stop_market" ||
    orderType === "trailing_stop";
  const showLimitPrice = orderType === "stop_limit";
  const showScaled = orderType === "scaled";
  const showTpSl =
    orderType === "limit" ||
    orderType === "market" ||
    orderType === "post_only";
  const showGtc = orderType === "limit" || orderType === "post_only";

  const muted: CSSProperties = {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: "18px",
    color: COLORS.white50,
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: TRADE_COLORS.panel,
        padding: 10,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: FONT,
        overflow: "visible",
      }}
    >
      {/* Buy / Sell — logged out: both muted gray */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setSide("buy")}
          style={{
            flex: 1,
            height: 32,
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            background:
              !walletConnected || !isBuy
                ? "rgba(255,255,255,0.3)"
                : TRADE_COLORS.buyGrad,
            opacity: !walletConnected ? 1 : isBuy ? 1 : 0.5,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 11,
            color: "#ffffff",
          }}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          style={{
            flex: 1,
            height: 32,
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            background:
              !walletConnected || isBuy
                ? "rgba(255,255,255,0.3)"
                : "linear-gradient(90deg, #ff41a3 0%, #be4584 100%)",
            opacity: !walletConnected ? 1 : !isBuy ? 1 : 0.5,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 11,
            color: "#ffffff",
          }}
        >
          Sell
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <MiniSelect label="Cross" />
          <MiniSelect label="100X" />
          <SignalIcon onClick={onOpenAgentSignals} />
        </div>

        <button
          type="button"
          onClick={() => setTypeOpen(true)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {orderTypeLabel(orderType)}
          </span>
          <Chevron />
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={muted}>Available</span>
          <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              {walletConnected ? ACCOUNT.available : "--"}
            </span>
            <span style={muted}>USDC</span>
          </span>
        </div>

        {showPriceRow ? (
          <div style={{ display: "flex", gap: 4, height: 44 }}>
            <UnitInput
              label="Price (USDC)"
              value={price}
              onChange={setPrice}
              showUnit={false}
              style={{ flex: 1, minWidth: 0 }}
              trailing={
                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#dbfd5c",
                    padding: "0 2px",
                    flexShrink: 0,
                  }}
                >
                  Mid
                </button>
              }
            />
            <button
              type="button"
              style={{
                width: 44,
                height: 44,
                border: "none",
                borderRadius: 6,
                background: "rgba(227,231,234,0.05)",
                cursor: "pointer",
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 500,
                color: COLORS.white50,
                flexShrink: 0,
              }}
            >
              BBO
            </button>
          </div>
        ) : null}

        {showTrigger ? (
          <UnitInput
            label="Trigger Price (USDC)"
            value={trigger}
            onChange={setTrigger}
            showUnit={false}
          />
        ) : null}

        {showLimitPrice ? (
          <UnitInput
            label="Limit Price (USDC)"
            value={limitPrice}
            onChange={setLimitPrice}
            showUnit={false}
          />
        ) : null}

        {showScaled ? (
          <>
            <UnitInput
              label="Start Price (USDC)"
              value={startPrice}
              onChange={setStartPrice}
              showUnit={false}
            />
            <UnitInput
              label="End Price (USDC)"
              value={endPrice}
              onChange={setEndPrice}
              showUnit={false}
            />
            <UnitInput
              label="Total orders"
              value={orderCount}
              onChange={setOrderCount}
              showUnit={false}
            />
          </>
        ) : null}

        {orderType === "trailing_stop" ? (
          <UnitInput
            label="Callback rate %"
            value={callback}
            onChange={setCallback}
            showUnit={false}
          />
        ) : null}

        <UnitInput
          label="Quantity"
          value={qty}
          onChange={setQty}
          unit="BTC"
        />
      </div>

      <PctSlider
        value={pct}
        onChange={setPctAndQty}
        maxLabel={isBuy ? "Max buy" : "Max sell"}
        maxValue={ACCOUNT.maxBuy}
        accent={isBuy ? "#46ccb9" : "#ff41a3"}
      />

      <button
        type="button"
        onClick={() => onSubmit?.()}
        style={{
          width: "100%",
          height: 32,
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          backgroundImage: ctaBg,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        {ctaLabel}
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: 20,
              alignItems: "center",
            }}
          >
            <span style={{ ...muted, opacity: 0.5 }}>Est. liq. price</span>
            <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.white50,
                }}
              >
                --
              </span>
              <span style={{ ...muted, opacity: 0.5 }}>USDC</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: 20,
              alignItems: "center",
            }}
          >
            <span style={{ ...muted, opacity: 0.5 }}>Fees</span>
            <span
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <span style={{ ...muted, opacity: 0.5 }}>Taker</span>
              <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                0.1%
              </span>
              <span
                style={{
                  width: 1,
                  height: 10,
                  background: "rgba(255,255,255,0.2)",
                }}
              />
              <span style={{ ...muted, opacity: 0.5 }}>Maker</span>
              <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                0.1%
              </span>
            </span>
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {showTpSl ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <CheckBox checked={tpSl} onChange={() => setTpSl(!tpSl)} />
                  <button
                    type="button"
                    onClick={() => setTpSl(!tpSl)}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    TP/SL
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTpSl(true);
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
              {tpSl ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                      color: "rgba(255,255,255,0.8)",
                      boxSizing: "border-box",
                      width: "fit-content",
                    }}
                  >
                    Cross
                  </span>
                  <UnitInput
                    label={tpSlFieldLabel(tpSlInputMode, "tp")}
                    value={tpPrice}
                    onChange={setTpPrice}
                    unit={tpSlModeUnit(tpSlInputMode)}
                    onUnitClick={() => setTpSlSettingsOpen(true)}
                    estimateKind="tp"
                    estimateMode={tpSlInputMode}
                  />
                  <UnitInput
                    label={tpSlFieldLabel(tpSlInputMode, "sl")}
                    value={slPrice}
                    onChange={setSlPrice}
                    unit={tpSlModeUnit(tpSlInputMode)}
                    onUnitClick={() => setTpSlSettingsOpen(true)}
                    estimateKind="sl"
                    estimateMode={tpSlInputMode}
                  />
                </div>
              ) : null}
            </>
          ) : null}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              <CheckBox
                checked={reduceOnly}
                onChange={() => setReduceOnly(!reduceOnly)}
              />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Reduce only
              </span>
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {showGtc ? (
                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                    padding: 0,
                  }}
                >
                  GTC
                  <Chevron size={14} />
                </button>
              ) : null}
              <GridIcon />
            </div>
          </div>
        </div>
      </div>

      <OrderTypeDrawer
        open={typeOpen}
        value={orderType}
        onSelect={setOrderType}
        onClose={() => setTypeOpen(false)}
      />
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
          setTpSl(true);
          setTpSlAdvancedOpen(false);
        }}
      />
    </div>
  );
}

function MiniSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        flex: 1,
        minWidth: 0,
        height: 24,
        padding: "2px 8px",
        borderRadius: 6,
        border: "none",
        background: "rgba(255,255,255,0.1)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 600,
        color: "rgba(255,255,255,0.8)",
        boxSizing: "border-box",
      }}
    >
      {label}
      <Chevron size={14} />
    </button>
  );
}
