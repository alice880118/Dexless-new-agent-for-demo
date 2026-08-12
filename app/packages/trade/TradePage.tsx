import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SignalTradeModal, type SignalCardData } from "../agent";
import { DepositSuccessToast } from "../agent/DepositSuccessToast";
import { COLORS, FONT, useBreakpoint } from "../nav";
import { ChartPanel } from "./ChartPanel";
import { MARKET, MARKET_LIST, type MarketListItem } from "./demoData";
import { MarketHeader } from "./MarketHeader";
import { MarketPanel } from "./MarketPanel";
import { MobileOrderPanel } from "./MobileOrderPanel";
import { OrderBookPanel } from "./OrderBookPanel";
import { OrderPanel, type OrderSide, type SignalOrderPrefill } from "./OrderPanel";
import { PositionsPanel } from "./PositionsPanel";
import {
  TRADE_COLORS,
  MOBILE_TRADE,
  getBookWidth,
  getChartMinHeight,
  getGutter,
  getOrderWidth,
  getPageMargin,
  getTradeLayoutMode,
  DESKTOP_TRADE_MIN_W,
} from "./tradeLayout";

type TradePageProps = {
  walletConnected?: boolean;
  onConnectRequest?: () => void;
  /** Open agent home (Trade DNA) */
  onOpenAgent?: () => void;
  /** Open agent Signal list (requires wallet) */
  onOpenAgentSignals?: () => void;
  /** Bump to focus Positions table (mobile agent View Position) */
  positionsFocusKey?: number;
  /** Signal card from agent Trade Now — floats on/beside order panel */
  tradeSignal?: SignalCardData | null;
  onCloseTradeSignal?: () => void;
};

function toHeaderMarket(item: MarketListItem) {
  return {
    symbol: item.symbol,
    markPrice: item.price,
    change24h: item.change24h,
    changePositive: item.changePct >= 0,
    funding: MARKET.funding,
    indexPrice: item.price,
    openInterest: MARKET.openInterest,
    volume24h: item.volume.replace(/^\$/, ""),
  };
}

function signalToPrefill(signal: SignalCardData): SignalOrderPrefill {
  return {
    side: signal.side === "LONG" ? "buy" : "sell",
    price: signal.entry,
    tpPrice: signal.takeProfit,
    slPrice: signal.stopLoss,
  };
}

export function TradePage({
  walletConnected = false,
  onConnectRequest,
  onOpenAgent,
  onOpenAgentSignals,
  positionsFocusKey = 0,
  tradeSignal = null,
  onCloseTradeSignal,
}: TradePageProps) {
  const bp = useBreakpoint();
  const mode = getTradeLayoutMode(bp);
  const gutter = getGutter(mode);
  const margin = getPageMargin(mode);
  const bookW = getBookWidth(mode);
  const orderW = getOrderWidth(mode);

  const [viewportH, setViewportH] = useState(
    typeof window === "undefined" ? 900 : window.innerHeight,
  );
  const [viewportW, setViewportW] = useState(
    typeof window === "undefined" ? 1920 : window.innerWidth,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<OrderSide>("buy");
  const [selectedId, setSelectedId] = useState("btc");
  const [marketPickerOpen, setMarketPickerOpen] = useState(false);
  const [favorited, setFavorited] = useState(true);
  const [signalPrefillKey, setSignalPrefillKey] = useState(0);
  const signalPrefill = tradeSignal ? signalToPrefill(tradeSignal) : null;
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const orderToastTimerRef = useRef<number | null>(null);

  const handleOrderSubmit = () => {
    if (!walletConnected) {
      onConnectRequest?.();
      return;
    }
    setShowOrderSuccess(true);
    if (orderToastTimerRef.current) {
      window.clearTimeout(orderToastTimerRef.current);
    }
    orderToastTimerRef.current = window.setTimeout(() => {
      setShowOrderSuccess(false);
      orderToastTimerRef.current = null;
    }, 3200);
  };

  useEffect(() => {
    if (!tradeSignal) return;
    setSignalPrefillKey((k) => k + 1);
  }, [tradeSignal]);

  useEffect(() => {
    return () => {
      if (orderToastTimerRef.current) {
        window.clearTimeout(orderToastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setViewportH(window.innerHeight);
      setViewportW(window.innerWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const chartMinH = getChartMinHeight(viewportH);
  /** Tablet (768): Buy/Sell sheet. Mobile (<768): inline order panel per Figma */
  const useSheet = mode === "md";
  const hideScrollCss = `
    .trade-drag-scroll {
      scrollbar-width: none;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
    }
    .trade-drag-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    .trade-mobile-scroll {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .trade-mobile-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  `;

  const selectedItem = useMemo(
    () => MARKET_LIST.find((m) => m.id === selectedId) ?? MARKET_LIST[0],
    [selectedId],
  );
  const headerMarket = toHeaderMarket(selectedItem);

  const openSheet = (side: OrderSide) => {
    if (!walletConnected) {
      onConnectRequest?.();
      return;
    }
    setSheetSide(side);
    setSheetOpen(true);
  };

  const handleSelectMarket = (item: MarketListItem) => {
    setSelectedId(item.id);
  };

  const isDesktopTrade = mode === "lg" || mode === "xl" || mode === "2xl";

  return (
    <div
      className={mode === "xs" ? "trade-mobile-scroll" : undefined}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        minWidth:
          mode === "xs"
            ? MOBILE_TRADE.frameW
            : isDesktopTrade
              ? DESKTOP_TRADE_MIN_W
              : undefined,
        display: "flex",
        flexDirection: "column",
        background: TRADE_COLORS.page,
        fontFamily: FONT,
        boxSizing: "border-box",
        overflow:
          mode === "xs"
            ? "auto"
            : isDesktopTrade
              ? "auto"
              : tradeSignal
                ? "visible"
                : "hidden",
        WebkitOverflowScrolling: mode === "xs" ? "touch" : undefined,
        position: "relative",
        overscrollBehavior: mode === "xs" ? "contain" : undefined,
      }}
    >
      <style>{hideScrollCss}</style>
      <MarketHeader
        mode={mode}
        market={headerMarket}
        onOpenMarkets={() => setMarketPickerOpen(true)}
        favorited={favorited}
        onToggleFavorite={() => setFavorited((v) => !v)}
      />

      <div
        style={{
          flex: mode === "xs" ? "none" : 1,
          minHeight: 0,
          display: "flex",
          gap: 0,
          overflow:
            mode === "xs" ? "visible" : tradeSignal ? "visible" : "hidden",
        }}
      >
        <MarketPanel
          mode={mode}
          viewportW={viewportW}
          selectedId={selectedId}
          onSelectMarket={handleSelectMarket}
          pickerOpen={marketPickerOpen}
          onPickerOpenChange={setMarketPickerOpen}
        />

        <div
          className={mode === "xs" ? "trade-mobile-scroll" : undefined}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow:
              mode === "xs" ? "visible" : tradeSignal ? "visible" : "hidden",
          }}
        >
          {mode === "xs" ? (
            <XsLayout
              walletConnected={walletConnected}
              onConnectRequest={onConnectRequest}
              onOrderSubmit={handleOrderSubmit}
              onOpenAgentSignals={onOpenAgentSignals}
              positionsFocusKey={positionsFocusKey}
              tradeSignal={tradeSignal}
              onCloseTradeSignal={onCloseTradeSignal}
              signalPrefill={signalPrefill}
              signalPrefillKey={signalPrefillKey}
            />
          ) : mode === "md" ? (
            <MdLayout
              chartMinH={chartMinH}
              margin={margin}
              bookW={bookW}
              bottomPad={64}
              positionsFocusKey={positionsFocusKey}
              tradeSignal={tradeSignal}
              onCloseTradeSignal={onCloseTradeSignal}
            />
          ) : (
            <DesktopLayout
              mode={mode}
              gutter={gutter}
              margin={margin}
              bookW={bookW}
              orderW={orderW}
              walletConnected={walletConnected}
              onConnectRequest={onConnectRequest}
              onOrderSubmit={handleOrderSubmit}
              onOpenAgent={onOpenAgent}
              onOpenAgentSignals={onOpenAgentSignals}
              positionsFocusKey={positionsFocusKey}
              tradeSignal={tradeSignal}
              onCloseTradeSignal={onCloseTradeSignal}
              signalPrefill={signalPrefill}
              signalPrefillKey={signalPrefillKey}
            />
          )}
        </div>
      </div>

      {useSheet && (
        <FixedBuySellBar
          onBuy={() => openSheet("buy")}
          onSell={() => openSheet("sell")}
        />
      )}

      {useSheet && sheetOpen && typeof document !== "undefined"
        ? createPortal(
            <OrderSheet
              side={sheetSide}
              onClose={() => setSheetOpen(false)}
              walletConnected={walletConnected}
              onConnectRequest={onConnectRequest}
              onOrderSubmit={handleOrderSubmit}
            />,
            document.body,
          )
        : null}

      {showOrderSuccess ? (
        <DepositSuccessToast
          pageLevel
          top={52}
          message="Order created successfully"
        />
      ) : null}
    </div>
  );
}

function XsLayout({
  walletConnected,
  onConnectRequest,
  onOrderSubmit,
  onOpenAgentSignals,
  positionsFocusKey = 0,
  tradeSignal = null,
  onCloseTradeSignal,
  signalPrefill = null,
  signalPrefillKey = 0,
}: {
  walletConnected: boolean;
  onConnectRequest?: () => void;
  onOrderSubmit?: () => void;
  onOpenAgentSignals?: () => void;
  positionsFocusKey?: number;
  tradeSignal?: SignalCardData | null;
  onCloseTradeSignal?: () => void;
  signalPrefill?: SignalOrderPrefill | null;
  signalPrefillKey?: number;
}) {
  const [chartCollapsed, setChartCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: MOBILE_TRADE.frameW,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: chartCollapsed ? "auto" : MOBILE_TRADE.chartH,
          minHeight: chartCollapsed ? undefined : MOBILE_TRADE.chartH,
          width: "100%",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <ChartPanel
          minHeight={MOBILE_TRADE.chartH}
          mobile
          onCollapsedChange={setChartCollapsed}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          minHeight: MOBILE_TRADE.midH,
          alignItems: "stretch",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: MOBILE_TRADE.bookW,
            flexShrink: 0,
            alignSelf: "stretch",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <OrderBookPanel mode="xs" mobileCompact />
        </div>
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: MOBILE_TRADE.orderW,
            minHeight: MOBILE_TRADE.midH,
            overflow: "visible",
          }}
        >
          <MobileOrderPanel
            walletConnected={walletConnected}
            onSubmit={onOrderSubmit ?? (() => onConnectRequest?.())}
            onOpenAgentSignals={onOpenAgentSignals}
            signalPrefill={signalPrefill}
            signalPrefillKey={signalPrefillKey}
          />
          {tradeSignal ? (
            <div
              style={{
                position: "absolute",
                left: 4,
                right: 4,
                top: 8,
                zIndex: 30,
                pointerEvents: "none",
              }}
            >
              <div style={{ pointerEvents: "auto" }}>
                <SignalTradeModal
                  data={tradeSignal}
                  dense
                  onClose={() => onCloseTradeSignal?.()}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <PositionsPanel mode="xs" focusKey={positionsFocusKey} />
    </div>
  );
}

function MdLayout({
  chartMinH,
  margin,
  bookW,
  bottomPad,
  positionsFocusKey = 0,
  tradeSignal = null,
  onCloseTradeSignal,
}: {
  chartMinH: number;
  margin: number;
  bookW: number;
  bottomPad: number;
  positionsFocusKey?: number;
  tradeSignal?: SignalCardData | null;
  onCloseTradeSignal?: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        padding: `0 ${margin}px ${bottomPad}px`,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, minHeight: chartMinH }}>
          <ChartPanel minHeight={chartMinH} />
        </div>
        <OrderBookPanel mode="md" width={bookW} tabbed />
      </div>
      <PositionsPanel mode="md" focusKey={positionsFocusKey} />
      {tradeSignal ? (
        <div
          style={{
            position: "absolute",
            right: margin,
            top: 12,
            width: "min(360px, calc(100% - 24px))",
            zIndex: 40,
          }}
        >
          <SignalTradeModal
            data={tradeSignal}
            dense
            onClose={() => onCloseTradeSignal?.()}
          />
        </div>
      ) : null}
    </div>
  );
}

function DesktopLayout({
  mode,
  gutter,
  margin,
  bookW,
  orderW,
  walletConnected,
  onConnectRequest,
  onOrderSubmit,
  onOpenAgent,
  onOpenAgentSignals,
  positionsFocusKey = 0,
  tradeSignal = null,
  onCloseTradeSignal,
  signalPrefill = null,
  signalPrefillKey = 0,
}: {
  mode: "lg" | "xl" | "2xl";
  gutter: number;
  margin: number;
  bookW: number;
  orderW: number;
  walletConnected: boolean;
  onConnectRequest?: () => void;
  onOrderSubmit?: () => void;
  onOpenAgent?: () => void;
  onOpenAgentSignals?: () => void;
  positionsFocusKey?: number;
  tradeSignal?: SignalCardData | null;
  onCloseTradeSignal?: () => void;
  signalPrefill?: SignalOrderPrefill | null;
  signalPrefillKey?: number;
}) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        padding: `0 ${margin}px ${margin}px`,
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 0,
          flexShrink: 0,
          alignItems: "stretch",
          minHeight: 0,
          overflow: "visible",
          position: "relative",
          zIndex: tradeSignal ? 5 : undefined,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <ChartPanel minHeight={0} />
        </div>
        <div
          style={{
            width: bookW,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <OrderBookPanel mode={mode} width={bookW} tabbed={false} />
        </div>
        <div
          style={{
            position: "relative",
            width: orderW,
            flexShrink: 0,
            alignSelf: "flex-start",
            overflow: "visible",
          }}
        >
          <OrderPanel
            walletConnected={walletConnected}
            onSubmit={onOrderSubmit ?? (() => onConnectRequest?.())}
            onOpenAgent={onOpenAgent}
            onOpenAgentSignals={onOpenAgentSignals}
            signalPrefill={signalPrefill}
            signalPrefillKey={signalPrefillKey}
          />
          {tradeSignal ? (
            <div
              style={{
                position: "absolute",
                right: "100%",
                top: 0,
                marginRight: gutter,
                width: 360,
                zIndex: 40,
              }}
            >
              <SignalTradeModal
                data={tradeSignal}
                onClose={() => onCloseTradeSignal?.()}
              />
            </div>
          ) : null}
        </div>
      </div>
      {/* Table body scrolls/clips; pagination stays at panel bottom */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          maxHeight: 362,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PositionsPanel mode={mode} focusKey={positionsFocusKey} />
      </div>
    </div>
  );
}

function FixedBuySellBar({
  onBuy,
  onSell,
}: {
  onBuy: () => void;
  onSell: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        padding: "8px 12px calc(8px + env(safe-area-inset-bottom, 0px))",
        background:
          "linear-gradient(180deg, rgba(10,11,13,0) 0%, #0a0b0d 28%, #0a0b0d 100%)",
        display: "flex",
        gap: 8,
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={onBuy}
        style={{
          flex: 1,
          height: 40,
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          backgroundImage: TRADE_COLORS.buyGrad,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          color: "#ffffff",
        }}
      >
        Buy
      </button>
      <button
        type="button"
        onClick={onSell}
        style={{
          flex: 1,
          height: 40,
          border: "none",
          borderRadius: 999,
          cursor: "pointer",
          backgroundImage: "linear-gradient(90deg, #ff41a3 0%, #be4584 100%)",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 13,
          color: "#ffffff",
        }}
      >
        Sell
      </button>
    </div>
  );
}

function OrderSheet({
  side,
  onClose,
  walletConnected,
  onConnectRequest,
  onOrderSubmit,
}: {
  side: OrderSide;
  onClose: () => void;
  walletConnected: boolean;
  onConnectRequest?: () => void;
  onOrderSubmit?: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.55)",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes tradeOrderSheetIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div
        style={{
          maxHeight: "min(90dvh, 90vh)",
          overflow: "hidden",
          borderRadius: "12px 12px 0 0",
          background: TRADE_COLORS.panel,
          animation:
            "tradeOrderSheetIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Place order
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: COLORS.white50,
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
        <OrderPanel
          key={side}
          initialSide={side}
          embedded
          walletConnected={walletConnected}
          onSubmit={() => {
            onOrderSubmit?.();
            if (walletConnected) onClose();
          }}
        />
      </div>
    </div>
  );
}
