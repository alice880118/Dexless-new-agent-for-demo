import { useState, type CSSProperties } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { LiveChart } from "./LiveChart";
import { TRADE_COLORS } from "./tradeLayout";

type ChartPanelProps = {
  minHeight: number;
  /** Mobile trade page: Chart / Trades / Data tabs */
  mobile?: boolean;
  /** Notify parent when chart body collapses (mobile) so layout can lift */
  onCollapsedChange?: (collapsed: boolean) => void;
};

type MainTab = "chart" | "trades" | "data";

type TradeRow = {
  time: string;
  price: string;
  qty: string;
  side: "buy" | "sell";
};

const TRADE_ROWS: TradeRow[] = [
  { time: "08:16:48", price: "0.4322", qty: "5.41322", side: "sell" },
  { time: "07:23:44", price: "0.4327", qty: "10.57691", side: "buy" },
  { time: "09:02:15", price: "0.4501", qty: "7.89012", side: "sell" },
  { time: "06:45:30", price: "0.4219", qty: "12.34567", side: "buy" },
  { time: "05:30:00", price: "0.4550", qty: "11.23456", side: "buy" },
  { time: "10:15:00", price: "0.4678", qty: "8.76543", side: "sell" },
  { time: "11:05:12", price: "0.4380", qty: "9.87654", side: "sell" },
  { time: "11:05:12", price: "0.4380", qty: "9.87654", side: "sell" },
  { time: "12:30:45", price: "0.4902", qty: "6.54321", side: "buy" },
  { time: "12:30:45", price: "0.4902", qty: "6.54321", side: "buy" },
];

const DATA_ROWS: TradeRow[] = [
  { time: "13:01:22", price: "111,855", qty: "0.42000", side: "buy" },
  { time: "13:01:18", price: "111,852", qty: "1.10500", side: "sell" },
  { time: "13:01:05", price: "111,860", qty: "0.25000", side: "buy" },
  { time: "13:00:51", price: "111,848", qty: "2.80000", side: "sell" },
  { time: "13:00:40", price: "111,855", qty: "0.66000", side: "buy" },
  { time: "13:00:33", price: "111,840", qty: "1.45000", side: "sell" },
  { time: "13:00:21", price: "111,862", qty: "0.88000", side: "buy" },
  { time: "13:00:12", price: "111,835", qty: "3.12000", side: "sell" },
  { time: "12:59:58", price: "111,870", qty: "0.31000", side: "buy" },
  { time: "12:59:44", price: "111,828", qty: "1.92000", side: "sell" },
];

export function ChartPanel({
  minHeight,
  mobile = false,
  onCollapsedChange,
}: ChartPanelProps) {
  const [mainTab, setMainTab] = useState<MainTab>("chart");
  const [collapsed, setCollapsed] = useState(false);
  const showBody = !mobile || !collapsed;
  const showChart = !mobile || mainTab === "chart";

  const setCollapsedAndNotify = (next: boolean) => {
    setCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: mobile && collapsed ? undefined : minHeight,
        height: mobile && collapsed ? "auto" : "100%",
        background: mobile ? TRADE_COLORS.page : "#0b0b10",
        border: "none",
        borderRadius: mobile ? 0 : 4,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {mobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            paddingTop: 8,
            background: TRADE_COLORS.page,
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
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                paddingLeft: 12,
              }}
            >
              {(
                [
                  { id: "chart" as const, label: "Chart" },
                  { id: "trades" as const, label: "Trades" },
                  { id: "data" as const, label: "Data" },
                ]
              ).map((t) => {
                const active = mainTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setMainTab(t.id);
                      setCollapsedAndNotify(false);
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 6,
                      fontFamily: FONT,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        lineHeight: "18px",
                        color: active
                          ? "rgba(255,255,255,0.9)"
                          : COLORS.white50,
                      }}
                    >
                      {t.label}
                    </span>
                    <span
                      style={{
                        height: 2,
                        width: "100%",
                        borderRadius: 4,
                        background: active
                          ? "rgba(255,255,255,0.9)"
                          : "transparent",
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label={collapsed ? "Expand" : "Collapse"}
              onClick={() => setCollapsedAndNotify(!collapsed)}
              style={{
                border: "none",
                background: "transparent",
                padding: "0 12px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 28,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
                style={{
                  transform: collapsed ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s ease",
                }}
              >
                <path
                  d="M5 12.5L10 7.5L15 12.5"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div
            style={{
              height: 1,
              width: "100%",
              background: "rgba(227,231,234,0.1)",
            }}
          />
        </div>
      ) : null}

      {showBody ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
            background: TRADE_COLORS.panel,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {mobile && mainTab === "trades" ? (
            <TradesList rows={TRADE_ROWS} />
          ) : mobile && mainTab === "data" ? (
            <TradesList rows={DATA_ROWS} />
          ) : showChart ? (
            <LiveChart />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TradesList({ rows }: { rows: TradeRow[] }) {
  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 24,
    padding: "0 12px",
    flexShrink: 0,
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: "18px",
    color: COLORS.white50,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: TRADE_COLORS.panel,
      }}
    >
      <div style={headerStyle}>
        <span style={{ width: 72 }}>Time</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 228,
            maxWidth: "62%",
          }}
        >
          <span style={{ width: 80, textAlign: "right" }}>Price(USDC)</span>
          <span style={{ width: 92, textAlign: "right" }}>Qty(BTC)</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          paddingBottom: 4,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {rows.map((r, i) => {
          const color =
            r.side === "buy" ? TRADE_COLORS.green : TRADE_COLORS.red;
          return (
            <div
              key={`${r.time}-${r.price}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 24,
                padding: "0 12px",
                flexShrink: 0,
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                letterSpacing: "-0.36px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span style={{ width: 72, color: "rgba(255,255,255,0.9)" }}>
                {r.time}
              </span>
              <span style={{ width: 80, textAlign: "right", color }}>
                {r.price}
              </span>
              <span style={{ width: 92, textAlign: "right", color }}>
                {r.qty}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
