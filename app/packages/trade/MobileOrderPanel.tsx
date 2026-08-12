import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { ACCOUNT, MARKET } from "./demoData";
import {
  MOBILE_ORDER_TYPES,
  OrderTypeDrawer,
  type MobileOrderType,
} from "./OrderTypeDrawer";
import {
  TimeInForceDrawer,
  type TimeInForce,
} from "./TimeInForceDrawer";
import {
  UnitPreferenceDrawer,
  qtyFieldLabel,
  qtyPrefIsQuote,
  qtyUnitLabel,
  type QtyUnitPref,
} from "./UnitPreferenceDrawer";
import { OrderConfirmModal, type OrderConfirmData } from "./OrderConfirmModal";
import { AdvancedGearIcon } from "./AdvancedGearIcon";
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
  normalizeSlPnlInput,
  tpSlFieldLabel,
  tpSlModeUnit,
  type TpSlInputMode,
} from "./TpSlSettingsPicker";

type MobileOrderPanelProps = {
  onSubmit?: () => void;
  walletConnected?: boolean;
  onOpenAgentSignals?: () => void;
  signalPrefill?: import("./OrderPanel").SignalOrderPrefill | null;
  signalPrefillKey?: number;
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
        width: 16,
        height: 16,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={checked ? "/trade/order/select.svg" : "/trade/order/unselect.svg"}
        alt=""
        width={16}
        height={16}
        draggable={false}
        style={{
          display: "block",
          width: 16,
          height: 16,
          minWidth: 16,
          minHeight: 16,
          objectFit: "contain",
        }}
      />
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
  footer,
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
  /** Below the field — e.g. Qty≈ conversion */
  footer?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );
  const filled = value.trim().length > 0;
  const showLabel = focused || filled;
  const showTip = Boolean(estimateKind && estimateMode && focused);
  const useAccent = Boolean(estimateKind) && estimateMode !== "price";
  const accent =
    estimateKind === "tp"
      ? TPSL_LONG
      : estimateKind === "sl"
        ? TPSL_SHORT
        : null;
  const valueColor =
    useAccent && accent && (filled || focused)
      ? accent
      : "rgba(255,255,255,0.8)";

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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: footer ? 4 : 0,
        width: "100%",
        ...style,
      }}
    >
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
        }}
      >
        {showTip &&
        estimateKind &&
        estimateMode &&
        anchor &&
        typeof document !== "undefined"
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
      {footer}
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

function OrderOptionsMenu({
  open,
  orderConfirm,
  hideFromBook,
  hideDisabled,
  onToggleConfirm,
  onToggleHide,
  onClose,
}: {
  open: boolean;
  orderConfirm: boolean;
  hideFromBook: boolean;
  /** When TP/SL is on — only Show order confirmation is selectable */
  hideDisabled?: boolean;
  onToggleConfirm: () => void;
  onToggleHide: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  if (!open) return null;

  const item = (
    checked: boolean,
    label: string,
    onClick: () => void,
    disabled?: boolean,
  ) => (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        border: "none",
        background: "transparent",
        padding: "8px 12px",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        boxSizing: "border-box",
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "18px",
        color: disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <img
        src={
          checked && !disabled
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
          opacity: disabled ? 0.4 : 1,
        }}
      />
      {label}
    </button>
  );

  return (
    <div
      ref={ref}
      role="menu"
      style={{
        position: "absolute",
        right: 0,
        bottom: "calc(100% + 6px)",
        zIndex: 30,
        minWidth: 240,
        padding: "4px 0",
        borderRadius: 8,
        background: "#131519",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        boxSizing: "border-box",
      }}
    >
      {item(
        orderConfirm,
        "Show order confirmation window",
        onToggleConfirm,
      )}
      {item(
        hideFromBook,
        "Hide order from order book",
        onToggleHide,
        hideDisabled,
      )}
    </div>
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
  signalPrefill = null,
  signalPrefillKey = 0,
}: MobileOrderPanelProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<MobileOrderType>("limit");
  const [typeOpen, setTypeOpen] = useState(false);
  const [tifOpen, setTifOpen] = useState(false);
  const [tif, setTif] = useState<TimeInForce>("gtc");
  const [unitPrefOpen, setUnitPrefOpen] = useState(false);
  const [qtyUnitPref, setQtyUnitPref] = useState<QtyUnitPref>("base");
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
  const [marginMode, setMarginMode] = useState<"cross" | "isolated">("cross");
  const [tpSlPosMode, setTpSlPosMode] = useState<"full" | "partial">("full");
  const [orderConfirm, setOrderConfirm] = useState(true);
  const [orderConfirmOpen, setOrderConfirmOpen] = useState(false);
  const [disableOrderConfirmPref, setDisableOrderConfirmPref] = useState(false);
  const [hideFromBook, setHideFromBook] = useState(false);
  const [orderOptsOpen, setOrderOptsOpen] = useState(false);

  useEffect(() => {
    if (!signalPrefill || signalPrefillKey <= 0) return;
    setSide(signalPrefill.side);
    setOrderType("limit");
    setPrice(signalPrefill.price);
    setTpSl(true);
    setTpSlInputMode("price");
    setTpPrice(signalPrefill.tpPrice);
    setSlPrice(signalPrefill.slPrice);
  }, [signalPrefill, signalPrefillKey]);

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

  const currentOrderTypeLabel = orderTypeLabel(orderType);

  const buildConfirmData = (): OrderConfirmData => ({
    symbol: MARKET.symbol,
    base: MARKET.base,
    iconSrc: "/onboarding/chains/ethereum.png",
    orderTypeLabel: currentOrderTypeLabel,
    side,
    quantity: qty || "0",
    price: orderType === "market" ? "Market" : price || MARKET.markPrice,
    quote: MARKET.quote,
    estTotal:
      qty && price
        ? String(
            (
              Number(String(qty).replace(/,/g, "")) *
              Number(String(price).replace(/,/g, "") || 0)
            ).toFixed(2),
          )
        : "0",
  });

  const handleCtaClick = () => {
    if (!walletConnected) {
      onSubmit?.();
      return;
    }
    if (orderConfirm) {
      setDisableOrderConfirmPref(false);
      setOrderConfirmOpen(true);
      return;
    }
    onSubmit?.();
  };

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
  const showGtc = orderType === "limit";

  const markPx =
    Number(String(MARKET.markPrice).replace(/,/g, "")) || 1;
  const qtyNum = Number(String(qty).replace(/,/g, "")) || 0;
  const qtyAsBase = qtyPrefIsQuote(qtyUnitPref)
    ? qtyNum / markPx
    : qtyNum;
  const qtyBaseLabel =
    qtyAsBase > 0
      ? qtyAsBase >= 1
        ? qtyAsBase.toFixed(4)
        : qtyAsBase.toFixed(5).replace(/0+$/, "").replace(/\.$/, "")
      : "0";

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
          <MiniSelect
            label={marginMode === "cross" ? "Cross" : "Isolated"}
            onClick={() =>
              setMarginMode((m) => (m === "cross" ? "isolated" : "cross"))
            }
            compact
          />
          <MiniSelect label="100X" compact />
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
          label={qtyFieldLabel(qtyUnitPref)}
          value={qty}
          onChange={setQty}
          unit={qtyUnitLabel(qtyUnitPref, "BTC")}
          onUnitClick={() => setUnitPrefOpen(true)}
          footer={
            qtyPrefIsQuote(qtyUnitPref) ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 4,
                  padding: "0 2px",
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
                  Qty≈
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: "12px",
                      letterSpacing: "-0.36px",
                      color: "rgba(255,255,255,0.9)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {qtyBaseLabel}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: "18px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    BTC
                  </span>
                </span>
              </div>
            ) : null
          }
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
        onClick={handleCtaClick}
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
                    opacity: reduceOnly ? 0.4 : 1,
                    pointerEvents: reduceOnly ? "none" : "auto",
                  }}
                >
                  <CheckBox
                    checked={tpSl}
                    onChange={() => {
                      if (tpSl) {
                        setTpSl(false);
                        return;
                      }
                      setTpSl(true);
                      setReduceOnly(false);
                      setHideFromBook(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tpSl) {
                        setTpSl(false);
                        return;
                      }
                      setTpSl(true);
                      setReduceOnly(false);
                      setHideFromBook(false);
                    }}
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
                    setReduceOnly(false);
                    setHideFromBook(false);
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
                    color: "rgba(255,255,255,0.5)",
                    opacity: reduceOnly ? 0.4 : 1,
                  }}
                >
                  Advanced
                  <AdvancedGearIcon size={12} />
                </button>
              </div>
              {tpSl ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ width: "fit-content" }}>
                    <MiniSelect
                      label={
                        tpSlPosMode === "full"
                          ? "Full position"
                          : "Partial position"
                      }
                      onClick={() =>
                        setTpSlPosMode((m) =>
                          m === "full" ? "partial" : "full",
                        )
                      }
                      fit
                    />
                  </div>
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
                    onChange={(v) =>
                      setSlPrice(
                        tpSlInputMode === "pnl" ? normalizeSlPnlInput(v) : v,
                      )
                    }
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
                cursor: tpSl ? "not-allowed" : "pointer",
                opacity: tpSl ? 0.4 : 1,
                pointerEvents: tpSl ? "none" : "auto",
              }}
            >
              <CheckBox
                checked={reduceOnly}
                onChange={() => {
                  if (reduceOnly) {
                    setReduceOnly(false);
                    return;
                  }
                  setReduceOnly(true);
                  setTpSl(false);
                }}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                position: "relative",
              }}
            >
              {showGtc ? (
                <button
                  type="button"
                  onClick={() => setTifOpen(true)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>TIF</span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {tif.toUpperCase()}
                    <Chevron size={14} />
                  </span>
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Order options"
                aria-expanded={orderOptsOpen}
                onClick={() => setOrderOptsOpen((o) => !o)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                }}
              >
                <GridIcon />
              </button>
              <OrderOptionsMenu
                open={orderOptsOpen}
                orderConfirm={orderConfirm}
                hideFromBook={hideFromBook}
                hideDisabled={tpSl}
                onToggleConfirm={() => setOrderConfirm((v) => !v)}
                onToggleHide={() => {
                  if (tpSl) return;
                  setHideFromBook((v) => !v);
                }}
                onClose={() => setOrderOptsOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>

      <OrderConfirmModal
        open={orderConfirmOpen}
        data={orderConfirmOpen ? buildConfirmData() : null}
        disableConfirmChecked={disableOrderConfirmPref}
        onDisableConfirmChange={setDisableOrderConfirmPref}
        onCancel={() => setOrderConfirmOpen(false)}
        onConfirm={() => {
          if (disableOrderConfirmPref) setOrderConfirm(false);
          setOrderConfirmOpen(false);
          onSubmit?.();
        }}
      />
      <OrderTypeDrawer
        open={typeOpen}
        value={orderType}
        onSelect={setOrderType}
        onClose={() => setTypeOpen(false)}
      />
      <TimeInForceDrawer
        open={tifOpen}
        value={tif}
        onSelect={setTif}
        onClose={() => setTifOpen(false)}
      />
      <UnitPreferenceDrawer
        open={unitPrefOpen}
        value={qtyUnitPref}
        baseSymbol="BTC"
        quoteSymbol={MARKET.quote}
        onSelect={setQtyUnitPref}
        onClose={() => setUnitPrefOpen(false)}
      />
      <TpSlSettingsPicker
        open={tpSlSettingsOpen}
        value={tpSlInputMode}
        onSelect={(id) => {
          setTpSlInputMode(id);
          if (id === "pnl") {
            setSlPrice((prev) =>
              prev.trim() ? normalizeSlPnlInput(prev) : prev,
            );
          }
        }}
        onClose={() => setTpSlSettingsOpen(false)}
      />
      <TpSlDrawer
        open={tpSlAdvancedOpen}
        variant="order"
        initialSide={side}
        initialMode={tpSlPosMode}
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

function MiniSelect({
  label,
  onClick,
  compact,
  fit,
}: {
  label: string;
  onClick?: () => void;
  compact?: boolean;
  /** Width follows label (Full / Partial position) */
  fit?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: compact || fit ? undefined : 1,
        width: fit ? "fit-content" : compact ? 78 : undefined,
        minWidth: fit ? undefined : compact ? 78 : 0,
        height: 24,
        padding: "2px 8px",
        borderRadius: 6,
        border: "none",
        background: "rgba(255,255,255,0.1)",
        cursor: onClick ? "pointer" : "default",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: fit ? "flex-start" : "space-between",
        gap: fit ? 12 : 4,
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 600,
        color: "rgba(255,255,255,0.8)",
        boxSizing: "border-box",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <Chevron size={14} />
    </button>
  );
}
