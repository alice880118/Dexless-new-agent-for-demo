import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { DrawerDragHandle } from "./MobileDrawerChrome";
import { PctSlider, qtyFromPct } from "./PctSlider";
import { PnlModeField, type PnlFieldMode } from "./PnlModeField";
import { TRADE_COLORS } from "./tradeLayout";
import type { TpSlMode, TpSlSubmitPayload } from "./tpSlTypes";

type TpSlDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: TpSlSubmitPayload) => void;
  /** Prefill buy/sell from order panel */
  initialSide?: "buy" | "sell";
  /** Prefill Partial / Full position tab */
  initialMode?: TpSlMode;
  /** Prefill field values (edit flow) */
  initialValues?: Partial<TpSlSubmitPayload> | null;
  /** Show back chevron (manage / edit flows) */
  onBack?: () => void;
  /**
   * order = Advance from order panel (Buy/Sell)
   * position = Positions table (Long badge + Quantity slider on Partial)
   */
  variant?: "order" | "position";
};

const CHECKED = "/trade/order/select.svg";
const UNCHECKED = "/trade/order/unselect.svg";
const CARET = "/trade/order/stop-limit-caret.svg";

/** Demo position — matches TP/SL sheet header */
const POS_QTY = 0.00206;
const POS_MAX_QTY = 0.00768;
const POS_ENTRY = 62515.4;
const POS_LEVERAGE = 10;
const POS_ORDER_PRICE = "62,522.6";
const POS_LAST = "62,509.0";
const POS_MARK = "62,515.4";
const POS_UNIT = "BTC";

const BUY = "#46ccb9";
const SELL = "#ff41a3";

function parsePrice(raw: string): number | null {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseSigned(raw: string): number | null {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function formatPnl(n: number): string {
  return Math.abs(n) >= 100 ? n.toFixed(2) : n.toFixed(2);
}

function formatPriceLabel(n: number): string {
  return `${n.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}USDC`;
}

function kindColor(n: number | null | undefined): string | undefined {
  if (n == null) return undefined;
  return n >= 0 ? BUY : SELL;
}

function calcPnl(exit: number, isBuy: boolean, qty: number): number {
  const dir = isBuy ? 1 : -1;
  return dir * qty * (exit - POS_ENTRY);
}

function calcRoi(pnl: number, qty: number): number {
  const margin = (qty * POS_ENTRY) / POS_LEVERAGE;
  if (margin <= 0) return 0;
  return (pnl / margin) * 100;
}

/** Leave room for top nav (48px) + overlay padding */
const DESKTOP_MAX_H = "min(720px, calc(100dvh - 48px - 32px), calc(100vh - 48px - 32px))";
const MOBILE_MAX_H = "min(90dvh, calc(100dvh - 48px), calc(100vh - 48px))";

const shellBase: CSSProperties = {
  background: "#0c0d10",
  boxSizing: "border-box",
  fontFamily: FONT,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxHeight: "100%",
  overflow: "hidden",
};

/** TP/SL menu — mobile bottom sheet / desktop dialog (project modal shell) */
export function TpSlDrawer({
  open,
  onClose,
  onSubmit,
  initialSide = "buy",
  initialMode = "partial",
  initialValues = null,
  onBack,
  variant = "order",
}: TpSlDrawerProps) {
  const isMobile = useBreakpoint() === "390";
  const isPosition = variant === "position";
  const [mounted, setMounted] = useState(false);
  const [side, setSide] = useState<"buy" | "sell">(initialSide);
  const [mode, setMode] = useState<TpSlMode>(initialMode);
  const [tpLimit, setTpLimit] = useState(false);
  const [slLimit, setSlLimit] = useState(false);
  const [tpTrigger, setTpTrigger] = useState("");
  const [tpOrder, setTpOrder] = useState("");
  const [tpPnl, setTpPnl] = useState("");
  const [slTrigger, setSlTrigger] = useState("");
  const [slOrder, setSlOrder] = useState("");
  const [slPnl, setSlPnl] = useState("");
  const [pnlMode, setPnlMode] = useState<PnlFieldMode>("pnl");
  const [qtyPct, setQtyPct] = useState(34);
  const [quantity, setQuantity] = useState(() =>
    qtyFromPct(String(POS_MAX_QTY), 34),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setSide(initialValues?.side ?? initialSide);
    setMode(initialValues?.mode ?? initialMode);
    setTpLimit(Boolean(initialValues?.tpLimit));
    setSlLimit(Boolean(initialValues?.slLimit));
    setTpTrigger(initialValues?.tpTrigger ?? "");
    setTpOrder(initialValues?.tpOrder ?? "");
    setTpPnl(initialValues?.tpPnl ?? "");
    setSlTrigger(initialValues?.slTrigger ?? "");
    setSlOrder(initialValues?.slOrder ?? "");
    setSlPnl(initialValues?.slPnl ?? "");
    setPnlMode("pnl");
    if (initialValues?.quantity) {
      setQuantity(initialValues.quantity);
      const max = POS_MAX_QTY;
      const q = Number(String(initialValues.quantity).replace(/,/g, ""));
      if (Number.isFinite(q) && max > 0) {
        setQtyPct(Math.round(Math.max(0, Math.min(100, (q / max) * 100))));
      }
    } else {
      setQtyPct(34);
      setQuantity(qtyFromPct(String(POS_MAX_QTY), 34));
    }
  }, [open, initialSide, initialMode, initialValues]);

  if (!open || !mounted || typeof document === "undefined") return null;

  const isBuy = side === "buy";
  const isFull = mode === "full";
  const showTpOrder = !isFull && tpLimit;
  const showSlOrder = !isFull && slLimit;
  const qtyNum =
    parsePrice(quantity) ?? (isFull ? POS_QTY : POS_MAX_QTY * (qtyPct / 100));

  const tpExit = showTpOrder
    ? parsePrice(tpOrder) ?? parsePrice(tpTrigger)
    : parsePrice(tpTrigger);
  const slExit = showSlOrder
    ? parsePrice(slOrder) ?? parsePrice(slTrigger)
    : parsePrice(slTrigger);

  const tpPnlNum = tpExit != null ? calcPnl(tpExit, isBuy, qtyNum) : null;
  const slPnlNum = slExit != null ? calcPnl(slExit, isBuy, qtyNum) : null;
  const tpRoi = tpPnlNum != null ? calcRoi(tpPnlNum, qtyNum) : null;
  const slRoi = slPnlNum != null ? calcRoi(slPnlNum, qtyNum) : null;

  const tpPnlDisplay =
    tpPnl.trim() || (tpPnlNum != null ? formatPnl(tpPnlNum) : "");
  const slPnlDisplay =
    slPnl.trim() || (slPnlNum != null ? formatPnl(slPnlNum) : "");

  const totalTp = parseSigned(tpPnl) ?? tpPnlNum;
  const totalSl = parseSigned(slPnl) ?? slPnlNum;
  const riskReward =
    totalTp != null && totalSl != null && Math.abs(totalSl) > 0
      ? Math.abs(totalTp) / Math.abs(totalSl)
      : null;

  const handleQtyPct = (pct: number) => {
    setQtyPct(pct);
    setQuantity(qtyFromPct(String(POS_MAX_QTY), pct));
  };

  const handleQtyInput = (raw: string) => {
    setQuantity(raw);
    const q = Number(String(raw).replace(/,/g, ""));
    if (Number.isFinite(q) && POS_MAX_QTY > 0) {
      setQtyPct(Math.round(Math.max(0, Math.min(100, (q / POS_MAX_QTY) * 100))));
    }
  };

  const handleSubmit = () => {
    onSubmit?.({
      mode,
      side,
      quantity: isPosition && !isFull ? quantity : undefined,
      tpTrigger,
      tpOrder,
      tpPnl: tpPnlDisplay,
      tpLimit: showTpOrder,
      slTrigger,
      slOrder,
      slPnl: slPnlDisplay,
      slLimit: showSlOrder,
    });
    onClose();
  };

  const content = (
    <div
      style={{
        ...shellBase,
        borderRadius: isMobile ? "4px 4px 0 0" : 8,
        border: "none",
        maxWidth: isMobile ? undefined : 420,
        maxHeight: isMobile ? MOBILE_MAX_H : DESKTOP_MAX_H,
        height: isMobile ? undefined : "auto",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {isMobile ? (
        <DrawerDragHandle />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #383838",
            boxSizing: "border-box",
            flexShrink: 0,
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
            {onBack ? (
              <button
                type="button"
                aria-label="Back"
                onClick={onBack}
                style={{
                  width: 18,
                  height: 18,
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  display: "inline-flex",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/trade/tpsl/back.svg"
                  alt=""
                  width={18}
                  height={18}
                  style={{ display: "block", width: 18, height: 18 }}
                />
              </button>
            ) : null}
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 14,
                lineHeight: "18px",
                letterSpacing: "0.14px",
                color: "#ffffff",
              }}
            >
              Take Profit / Stop Profit
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 16,
              height: 16,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              flexShrink: 0,
            }}
          >
            <img
              src="/trader-dna/close.svg"
              alt=""
              width={16}
              height={16}
              style={{ display: "block", width: 16, height: 16 }}
            />
          </button>
        </div>
      )}

      <div
        className="trade-drag-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          display: "block",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            padding: isMobile ? "12px 20px 0" : "16px 20px 0",
          }}
        >
          {isMobile ? (
            <span
              style={{
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: "20px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Take Profit / Stop Profit
            </span>
          ) : null}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    height: 24,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 16,
                      fontWeight: 700,
                      lineHeight: "20px",
                      letterSpacing: "0.16px",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    ETH-PERP
                  </span>
                  {isPosition ? (
                    <span
                      style={{
                        background: isBuy
                          ? "rgba(70,204,185,0.1)"
                          : "rgba(255,65,163,0.1)",
                        borderRadius: 4,
                        padding: "1px 10px",
                        fontFamily: FONT,
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: "18px",
                        color: isBuy
                          ? "rgba(70,204,185,0.8)"
                          : "rgba(255,65,163,0.8)",
                      }}
                    >
                      {isBuy ? "Long" : "Short"}
                    </span>
                  ) : null}
                  <span
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 4,
                      padding: "1px 10px",
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: "18px",
                      color: COLORS.white50,
                    }}
                  >
                    10X
                  </span>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <InfoRow label="Quantity" value={String(POS_QTY)} />
                    <InfoRow label="Order price" value={POS_ORDER_PRICE} />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <InfoRow label="Last price" value={POS_LAST} />
                    <InfoRow label="Mark price" value={POS_MARK} />
                  </div>
                </div>
              </div>

              {!isPosition ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setSide("buy")}
                    style={{
                      flex: 1,
                      minHeight: 32,
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      background: isBuy
                        ? TRADE_COLORS.buyGrad
                        : "rgba(255,255,255,0.3)",
                      opacity: isBuy ? 1 : 0.5,
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 600,
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
                      minHeight: 32,
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      background: !isBuy
                        ? "linear-gradient(90deg, #ff41a3 0%, #be4584 100%)"
                        : "rgba(255,255,255,0.3)",
                      opacity: !isBuy ? 1 : 0.5,
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#ffffff",
                    }}
                  >
                    Sell
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              padding: "12px 20px 0",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {(
              [
                { id: "partial" as const, label: "Partial position" },
                { id: "full" as const, label: "Full position" },
              ]
            ).map((t) => {
              const active = mode === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMode(t.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: "20px",
                    color: active ? "#ffffff" : COLORS.white50,
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      width: 40,
                      height: 2,
                      background: active ? "#dbfd5c" : "transparent",
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "16px 20px 0",
            }}
          >
            {isFull ? (
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  padding: "6px 2px",
                  textAlign: "center",
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "18px",
                  letterSpacing: "-0.36px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Full-position TP/SL orders are market only
              </div>
            ) : null}

            <TpSlSection
              kind="tp"
              limit={tpLimit}
              onLimitChange={setTpLimit}
              showLimitToggle={!isFull}
              showOrderPrice={showTpOrder}
              trigger={tpTrigger}
              pnl={tpPnl}
              onPnlChange={setTpPnl}
              pnlMode={pnlMode}
              onPnlModeChange={setPnlMode}
              pnlModeSelectable
              pnlColor={
                kindColor(parseSigned(tpPnl.trim() ? tpPnl : tpPnlDisplay) ?? tpPnlNum)
              }
              order={tpOrder}
              onTrigger={setTpTrigger}
              onOrder={setTpOrder}
              helperExit={isPosition ? null : tpExit}
              helperPnl={isPosition ? null : tpPnlNum}
              helperRoi={isPosition ? null : tpRoi}
              orderTypeLabel={showTpOrder ? "Limit order" : "Market order"}
              orderPlaceholder={
                isPosition ? "Order price (USDC)" : "Order price/Limit (USDC)"
              }
            />

            <TpSlSection
              kind="sl"
              limit={slLimit}
              onLimitChange={setSlLimit}
              showLimitToggle={!isFull}
              showOrderPrice={showSlOrder}
              trigger={slTrigger}
              pnl={slPnl}
              onPnlChange={setSlPnl}
              pnlMode={pnlMode}
              onPnlModeChange={setPnlMode}
              pnlModeSelectable
              pnlColor={
                kindColor(parseSigned(slPnl.trim() ? slPnl : slPnlDisplay) ?? slPnlNum)
              }
              order={slOrder}
              onTrigger={setSlTrigger}
              onOrder={setSlOrder}
              helperExit={isPosition ? null : slExit}
              helperPnl={isPosition ? null : slPnlNum}
              helperRoi={isPosition ? null : slRoi}
              orderTypeLabel={showSlOrder ? "Limit order" : "Market order"}
              orderPlaceholder={
                isPosition ? "Order price (USDC)" : "Order price/Limit (USDC)"
              }
            />

            {isPosition && !isFull ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: "100%",
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
                  Quantity
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 44,
                    padding: "0 8px",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.05)",
                    boxSizing: "border-box",
                    width: "100%",
                    gap: 8,
                  }}
                >
                  <input
                    value={quantity}
                    onChange={(e) => handleQtyInput(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      fontFamily: FONT,
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: "18px",
                      color: "rgba(255,255,255,0.9)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  />
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
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
                      {POS_UNIT}
                    </span>
                    <img
                      src={CARET}
                      alt=""
                      width={7}
                      height={5}
                      style={{ display: "block", width: 7, height: 5 }}
                    />
                  </span>
                </div>
                <PctSlider
                  value={qtyPct}
                  onChange={handleQtyPct}
                  maxLabel="Max"
                  maxValue={String(POS_MAX_QTY)}
                  accent="#ffffff"
                />
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                paddingBottom: 16,
              }}
            >
              <EstRow
                label="Total est. TP PnL"
                value={totalTp != null ? formatPnl(totalTp) : "--"}
                unit="USDC"
                valueColor={
                  totalTp == null ? undefined : totalTp >= 0 ? BUY : SELL
                }
              />
              <EstRow
                label="Total est. SL PnL"
                value={totalSl != null ? formatPnl(totalSl) : "--"}
                unit="USDC"
                valueColor={
                  totalSl == null ? undefined : totalSl >= 0 ? BUY : SELL
                }
              />
              <EstRow
                label="Risk reward ratio"
                value={
                  riskReward != null ? riskReward.toFixed(2) : "--"
                }
                unit="%"
              />
            </div>
          </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 8,
          padding: isMobile
            ? "12px 20px calc(16px + env(safe-area-inset-bottom, 0px))"
            : "12px 20px 16px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxSizing: "border-box",
          background: "#0c0d10",
        }}
      >
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            flex: 1,
            height: 32,
            borderRadius: 999,
            border: "none",
            backgroundImage: GRADIENTS.connectBtn,
            cursor: "pointer",
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "transparent",
            cursor: "pointer",
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Take Profit / Stop Profit"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4400,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 16,
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.55)",
      }}
      onClick={onClose}
    >
      {isMobile ? (
        <style>{`
          @keyframes tpSlDrawerIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      ) : null}
      <style>{`
        .trade-drag-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .trade-drag-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? undefined : 420,
          animation: isMobile
            ? "tpSlDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
            : undefined,
        }}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
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
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "-0.36px",
          color: "rgba(255,255,255,0.8)",
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
          minWidth: 75,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function EstRow({
  label,
  value,
  unit,
  valueColor,
}: {
  label: string;
  value: string;
  unit: string;
  valueColor?: string;
}) {
  return (
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
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "-0.36px",
            color: valueColor ?? "rgba(255,255,255,0.8)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white50,
          }}
        >
          {unit}
        </span>
      </span>
    </div>
  );
}

function FilledField({
  label,
  value,
  onChange,
  placeholder,
  valueColor,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder: string;
  valueColor?: string;
  readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const filled = value.trim().length > 0;
  const showLabel = focused || filled;

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        width: "100%",
        height: 44,
        minHeight: 44,
        maxHeight: 44,
        flexShrink: 0,
        alignSelf: "stretch",
        boxSizing: "border-box",
        borderRadius: 6,
        border: "none",
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: showLabel ? 2 : 0,
        padding: showLabel ? "4px 8px" : "0 8px",
        fontFamily: FONT,
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
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      ) : null}
      {readOnly ? (
        <span
          style={{
            fontFamily: FONT,
            fontSize: showLabel ? 14 : 12,
            fontWeight: showLabel ? 600 : 500,
            lineHeight: showLabel ? "14px" : "18px",
            letterSpacing: showLabel ? "-0.42px" : undefined,
            color: valueColor ?? (filled ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)"),
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {filled ? value : placeholder}
        </span>
      ) : (
        <input
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={showLabel ? "" : placeholder}
          style={{
            width: "100%",
            height: showLabel ? 14 : 18,
            minHeight: showLabel ? 14 : 18,
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
            color: valueColor ?? "rgba(255,255,255,0.9)",
            fontVariantNumeric: "tabular-nums",
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

function HelperText({
  exit,
  pnl,
  roi,
  orderTypeLabel,
  accent,
}: {
  exit: number;
  pnl: number;
  roi: number;
  orderTypeLabel: string;
  accent: string;
}) {
  const muted: CSSProperties = {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: "18px",
    color: "rgba(255,255,255,0.4)",
  };
  const emph: CSSProperties = {
    ...muted,
    color: "rgba(255,255,255,0.7)",
  };
  const accentStyle: CSSProperties = {
    ...muted,
    color: accent,
  };
  return (
    <p style={{ ...muted, margin: 0 }}>
      <span>When the mark price reaches </span>
      <span style={emph}>{formatPriceLabel(exit)}</span>
      <span>, it will trigger a </span>
      <span style={emph}>{orderTypeLabel}</span>
      <span>, and estimated PnL will be </span>
      <span style={accentStyle}>
        {formatPnl(pnl)}USDC
      </span>
      <span> and ROI is </span>
      <span style={accentStyle}>
        {roi >= 0 ? "" : "-"}
        {Math.abs(roi).toFixed(2)}%
      </span>
      <span>.</span>
    </p>
  );
}

function TpSlSection({
  kind,
  limit,
  onLimitChange,
  showLimitToggle,
  showOrderPrice,
  trigger,
  pnl,
  onPnlChange,
  pnlMode = "pnl",
  onPnlModeChange,
  pnlModeSelectable = false,
  pnlColor,
  order,
  onTrigger,
  onOrder,
  helperExit,
  helperPnl,
  helperRoi,
  orderTypeLabel,
  orderPlaceholder = "Order price/Limit (USDC)",
}: {
  kind: "tp" | "sl";
  limit: boolean;
  onLimitChange: (v: boolean) => void;
  showLimitToggle: boolean;
  showOrderPrice: boolean;
  trigger: string;
  pnl: string;
  onPnlChange?: (v: string) => void;
  pnlMode?: PnlFieldMode;
  onPnlModeChange?: (m: PnlFieldMode) => void;
  pnlModeSelectable?: boolean;
  pnlColor?: string;
  order: string;
  onTrigger: (v: string) => void;
  onOrder: (v: string) => void;
  helperExit: number | null;
  helperPnl: number | null;
  helperRoi: number | null;
  orderTypeLabel: string;
  orderPlaceholder?: string;
}) {
  const isTp = kind === "tp";
  const accent = isTp ? BUY : SELL;
  const title = isTp ? "Take profit" : "Stop loss";
  const showHelper =
    helperExit != null && helperPnl != null && helperRoi != null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              borderLeft: `2px solid ${accent}`,
              paddingLeft: 8,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {title}
            </span>
          </div>
          {showLimitToggle ? (
            <button
              type="button"
              onClick={() => onLimitChange(!limit)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <img
                src={limit ? CHECKED : UNCHECKED}
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
                Limit
              </span>
            </button>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <FilledField
              label="Trigger price (USDC)"
              placeholder="Trigger price (USDC)"
              value={trigger}
              onChange={onTrigger}
            />
            {pnlModeSelectable && onPnlChange && onPnlModeChange ? (
              <PnlModeField
                mode={pnlMode}
                onModeChange={onPnlModeChange}
                value={pnl}
                onChange={onPnlChange}
                valueColor={pnlColor}
              />
            ) : (
              <FilledField
                label="PnL"
                placeholder="PnL"
                value={pnl}
                valueColor={pnlColor}
                readOnly
              />
            )}
          </div>
          {showOrderPrice ? (
            <div style={{ display: "flex", gap: 4, width: "100%" }}>
              <FilledField
                label={orderPlaceholder}
                placeholder={orderPlaceholder}
                value={order}
                onChange={onOrder}
              />
            </div>
          ) : null}
        </div>
      </div>

      {showHelper ? (
        <HelperText
          exit={helperExit}
          pnl={helperPnl}
          roi={helperRoi}
          orderTypeLabel={orderTypeLabel}
          accent={accent}
        />
      ) : null}
    </div>
  );
}
