import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { COLORS, FONT } from "../nav/design-system";
import { RECENT_TRADES } from "./demoData";
import { TRADE_COLORS, type TradeLayoutMode } from "./tradeLayout";

type OrderBookPanelProps = {
  mode: TradeLayoutMode;
  width?: number;
  /** When true, show Orderbook | Trades tabs (desktop) */
  tabbed?: boolean;
  /** Mobile: funding header, no Total col, levels follow container height */
  mobileCompact?: boolean;
};

type Level = {
  price: number;
  qty: number;
  total: number;
  prev: number;
  flash?: "up" | "down" | null;
};

const ROW_H = 24;
const ROW_GAP = 1;
const ASK = "#ff41a3";
const BID = "#46ccb9";
const MARK = "#ff9a56";
const FUND = "#ffcf1c";
const T9 = "rgba(255,255,255,0.9)";
const T5 = "rgba(255,255,255,0.5)";
const T36 = "rgba(255,255,255,0.36)";

const fmtP = (p: number) => Math.round(p).toLocaleString("en-US");
const fmtQ = (q: number) => q.toFixed(5);
const rndQty = () => 0.1 + Math.random() * 5.8;

function genLadder(mid: number, levels: number): { asks: Level[]; bids: Level[] } {
  const n = Math.max(1, levels);
  const tmp: Level[] = [];
  for (let i = 1; i <= n; i++) {
    tmp.push({ price: mid + i, qty: rndQty(), total: 0, prev: 0 });
  }
  let c = 0;
  for (const r of tmp) {
    c += r.qty;
    r.total = c;
  }
  const asks = tmp.slice().reverse();

  const tb: Level[] = [];
  for (let i = 0; i < n; i++) {
    tb.push({ price: mid - i, qty: rndQty(), total: 0, prev: 0 });
  }
  let cb = 0;
  for (const r of tb) {
    cb += r.qty;
    r.total = cb;
  }
  return { asks, bids: tb };
}

function jitterLevel(r: Level): Level {
  if (Math.random() >= 0.55) return { ...r, flash: null };
  const qty = Math.max(0.05, r.qty + (Math.random() - 0.5) * 1.8);
  return {
    ...r,
    qty,
    prev: r.qty,
    flash: qty > r.qty ? "up" : "down",
  };
}

/** Fit ask/bid row count to available book body height (mobile grows with order form). */
function levelsFromHeight(bodyH: number, midH: number): number {
  if (bodyH <= 0) return 6;
  const ladderH = Math.max(0, bodyH - midH);
  const perSide = Math.floor(ladderH / 2);
  return Math.max(
    3,
    Math.min(16, Math.floor((perSide + ROW_GAP) / (ROW_H + ROW_GAP))),
  );
}

export function OrderBookPanel({
  mode,
  width,
  tabbed: _tabbed = false,
  mobileCompact = false,
}: OrderBookPanelProps) {
  void _tabbed;
  const mobile = mobileCompact || mode === "xs";
  const showTabs = !mobile;
  const showTotal = !mobile;

  const [tab, setTab] = useState<"book" | "trades">("book");
  const [levels, setLevels] = useState(mobile ? 6 : 11);
  const [mid, setMid] = useState(111855);
  const [lastMid, setLastMid] = useState(111855);
  const [asks, setAsks] = useState<Level[]>(() => genLadder(111855, 11).asks);
  const [bids, setBids] = useState<Level[]>(() => genLadder(111855, 11).bids);
  const [fundSec, setFundSec] = useState(7 * 3600 + 42 * 60 + 1);

  const bodyRef = useRef<HTMLDivElement>(null);
  const midRef = useRef(mid);
  const levelsRef = useRef(levels);
  midRef.current = mid;
  levelsRef.current = levels;

  const applyLevels = useCallback((n: number) => {
    if (n === levelsRef.current) return;
    levelsRef.current = n;
    setLevels(n);
    const ladder = genLadder(midRef.current, n);
    setAsks(ladder.asks);
    setBids(ladder.bids);
  }, []);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const midH = mobile ? 36 : 32;
    const measure = () => applyLevels(levelsFromHeight(el.clientHeight, midH));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLevels, mobile, showTabs, tab]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const levelsN = levelsRef.current;
      const m = midRef.current;

      if (Math.random() < 0.3) {
        const nextMid = m + (Math.random() < 0.5 ? 1 : -1);
        setLastMid(m);
        setMid(nextMid);
        midRef.current = nextMid;
        const ladder = genLadder(nextMid, levelsN);
        setAsks(ladder.asks);
        setBids(ladder.bids);
        return;
      }

      setAsks((prevAsks) => {
        const asksN = prevAsks.map((r) => jitterLevel(r));
        let c = 0;
        for (let i = asksN.length - 1; i >= 0; i--) {
          c += asksN[i].qty;
          asksN[i].total = c;
        }
        return asksN;
      });
      setBids((prevBids) => {
        const bidsN = prevBids.map((r) => jitterLevel(r));
        let cb = 0;
        for (const r of bidsN) {
          cb += r.qty;
          r.total = cb;
        }
        return bidsN;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFundSec((s) => (s > 0 ? s - 1 : 8 * 3600));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const fundH = String(Math.floor(fundSec / 3600)).padStart(2, "0");
  const fundM = String(Math.floor((fundSec % 3600) / 60)).padStart(2, "0");
  const fundS = String(fundSec % 60).padStart(2, "0");

  const midPrice = mid + 0.1;
  const markPrice = mid + 1.1;
  const up = mid >= lastMid;
  const spreadPct = ((markPrice - midPrice) / midPrice) * 100;
  const maxAsk = asks[0]?.total ?? 1;
  const maxBid = bids[bids.length - 1]?.total ?? 1;

  const showBook = !showTabs || tab === "book";

  return (
    <div
      style={{
        width: width ?? "100%",
        maxWidth: mobile ? undefined : 300,
        flexShrink: 0,
        minWidth: 0,
        height: "100%",
        minHeight: mobile ? 0 : 200,
        background: TRADE_COLORS.panel,
        borderRadius: mobile ? 0 : 6,
        border: "none",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: FONT,
        paddingTop: 4,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {mobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: T5,
              textDecoration: "underline dotted",
              textUnderlineOffset: 2,
            }}
          >
            Pred. funding rate
          </span>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: FUND }}>
              0.0053%
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: T36 }}>
              {` in ${fundH}:${fundM}:${fundS}`}
            </span>
          </div>
        </div>
      ) : showTabs ? (
        <>
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "8px 16px 0",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {(
              [
                { id: "book" as const, label: "Orderbook" },
                { id: "trades" as const, label: "Trades" },
              ]
            ).map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "0 0 8px",
                    cursor: "pointer",
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    color: active ? T9 : T5,
                    borderBottom: active
                      ? "2px solid rgba(255,255,255,0.9)"
                      : "2px solid transparent",
                    borderRadius: active ? "4px 4px 0 0" : 0,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div
            style={{
              height: 1,
              background: "rgba(227,231,234,0.1)",
              flexShrink: 0,
            }}
          />
        </>
      ) : null}

      {showBook ? (
        <>
          {!mobile ? (
            <div style={{ display: "flex", padding: "0 12px 4px", flexShrink: 0 }}>
              <GroupPill />
            </div>
          ) : null}

          <ColHead showTotal={showTotal} padX={mobile ? 8 : 12} />

          {/* Asks + mid + bids: height drives visible levels */}
          <div
            ref={bodyRef}
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: ROW_GAP,
                overflow: "hidden",
              }}
            >
              {asks.map((r) => (
                <BookRow
                  key={`a-${r.price}`}
                  level={r}
                  side="ask"
                  maxTotal={maxAsk}
                  showTotal={showTotal}
                  padX={mobile ? 8 : 12}
                />
              ))}
            </div>

            <MidRow
              last={`${fmtP(mid)}.1`}
              mark={`${fmtP(mid + 1)}.1`}
              up={up}
              spreadPct={spreadPct}
              showSpread={!mobile}
              padX={mobile ? 8 : 12}
              large={!mobile}
            />

            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: ROW_GAP,
                overflow: "hidden",
              }}
            >
              {bids.map((r) => (
                <BookRow
                  key={`b-${r.price}`}
                  level={r}
                  side="bid"
                  maxTotal={maxBid}
                  showTotal={showTotal}
                  padX={mobile ? 8 : 12}
                />
              ))}
            </div>
          </div>

          {mobile ? (
            <div style={{ display: "flex", padding: 8, flexShrink: 0 }}>
              <GroupPill />
            </div>
          ) : null}
        </>
      ) : (
        <TradesView />
      )}
    </div>
  );
}

function GroupPill() {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 6,
        height: 22,
        padding: "2px 8px",
        fontSize: 12,
        fontWeight: 600,
        color: T9,
        cursor: "pointer",
        minWidth: 84,
        border: "none",
        fontFamily: FONT,
      }}
    >
      <span>1</span>
      <span style={{ fontSize: 9, opacity: 0.7 }}>▼</span>
    </button>
  );
}

function ColHead({
  showTotal,
  padX,
}: {
  showTotal: boolean;
  padX: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: 24,
        padding: `0 ${padX}px`,
        flexShrink: 0,
      }}
    >
      <span style={{ ...headStyle, width: 72 }}>Price(USDC)</span>
      <span
        style={{
          ...headStyle,
          marginLeft: "auto",
          textAlign: "right",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        Qty(BTC)
        <span style={{ fontSize: 8, color: T5 }}>▼</span>
      </span>
      {showTotal ? (
        <span style={{ ...headStyle, width: 92, textAlign: "right" }}>
          Total(BTC)
        </span>
      ) : null}
    </div>
  );
}

const headStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: T5,
  fontFamily: FONT,
};

function BookRow({
  level,
  side,
  maxTotal,
  showTotal,
  padX,
}: {
  level: Level;
  side: "ask" | "bid";
  maxTotal: number;
  showTotal: boolean;
  padX: number;
}) {
  const barW = 8 + (level.total / Math.max(maxTotal, 1e-9)) * 92;
  const flashBg =
    level.flash == null
      ? "transparent"
      : side === "ask"
        ? level.flash === "up"
          ? "rgba(255,65,163,0.28)"
          : "rgba(255,65,163,0.14)"
        : level.flash === "up"
          ? "rgba(70,204,185,0.28)"
          : "rgba(70,204,185,0.14)";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: ROW_H,
        flexShrink: 0,
        padding: `0 ${padX}px`,
        background: flashBg,
        transition: "background 0.6s ease-out",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: `${barW}%`,
          pointerEvents: "none",
          background:
            side === "ask"
              ? "linear-gradient(90deg,#fb8aff,#ff41a3)"
              : "linear-gradient(90deg,#00ffab 0%,#00ffab 50%,#0ef3ff 100%)",
          opacity: side === "ask" ? 0.15 : 0.2,
          transition: "width 0.5s ease",
        }}
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: 72,
          fontSize: 12,
          fontWeight: 600,
          color: side === "ask" ? ASK : BID,
          letterSpacing: "-0.36px",
        }}
      >
        {fmtP(level.price)}
      </span>
      <span
        style={{
          position: "relative",
          zIndex: 1,
          marginLeft: "auto",
          textAlign: "right",
          width: 80,
          fontSize: 12,
          fontWeight: 600,
          color: T9,
          letterSpacing: "-0.36px",
        }}
      >
        {fmtQ(level.qty)}
      </span>
      {showTotal ? (
        <span
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "right",
            width: 92,
            fontSize: 12,
            fontWeight: 600,
            color: T9,
            letterSpacing: "-0.36px",
          }}
        >
          {fmtQ(level.total)}
        </span>
      ) : null}
    </div>
  );
}

function MidRow({
  last,
  mark,
  up,
  spreadPct,
  showSpread,
  padX,
  large,
}: {
  last: string;
  mark: string;
  up: boolean;
  spreadPct: number;
  showSpread: boolean;
  padX: number;
  large: boolean;
}) {
  const lastColor = up ? BID : ASK;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: large ? `2px ${padX}px` : `6px ${padX}px`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontSize: large ? 16 : 12,
              fontWeight: 600,
              lineHeight: large ? "28px" : undefined,
              color: lastColor,
              letterSpacing: "-0.36px",
            }}
          >
            {last}
          </span>
          <span
            style={{
              fontSize: large ? 11 : 9,
              color: lastColor,
            }}
          >
            {up ? "▲" : "▼"}
          </span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: MARK,
              transform: "rotate(45deg)",
              opacity: 0.9,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: large ? 14 : 12,
              fontWeight: 600,
              color: MARK,
              letterSpacing: "-0.36px",
            }}
          >
            {mark}
          </span>
        </span>
      </div>
      {showSpread ? (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: T5,
            letterSpacing: "-0.3px",
          }}
        >
          {spreadPct.toFixed(4)}%
        </span>
      ) : null}
    </div>
  );
}

function TradesView() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: "8px 12px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          fontSize: 11,
          fontWeight: 500,
          color: COLORS.white40,
          padding: "4px 0",
        }}
      >
        <span>Price</span>
        <span style={{ textAlign: "right" }}>Size</span>
        <span style={{ textAlign: "right" }}>Time</span>
      </div>
      {RECENT_TRADES.map((t) => (
        <div
          key={`${t.time}-${t.price}-${t.size}`}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            height: ROW_H,
            alignItems: "center",
            fontSize: 12,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ color: t.side === "buy" ? BID : ASK }}>{t.price}</span>
          <span style={{ textAlign: "right", color: "rgba(255,255,255,0.8)" }}>
            {t.size}
          </span>
          <span style={{ textAlign: "right", color: COLORS.white50 }}>{t.time}</span>
        </div>
      ))}
    </div>
  );
}
