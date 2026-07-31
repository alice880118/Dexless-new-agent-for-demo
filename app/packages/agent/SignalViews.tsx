import { useState, type CSSProperties, type ReactNode } from "react";
import { FONT, GRADIENTS } from "../nav/design-system";
import { useSignalCountdown } from "./signal-countdown";

const ASSETS = {
  clock: "/trader-dna/signal/clock-time.png",
  chevron: "/trader-dna/signal/chevron-right.png",
  signalBars: "/trader-dna/signal/signal-bars.png",
} as const;

function BackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M10 3.333L5.333 8 10 12.667"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick}
      style={{
        width: 16,
        height: 16,
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
      <BackIcon size={16} />
    </button>
  );
}

export type SignalTab = "titan" | "sage" | "vanguard";

export type SignalCardData = {
  id: string;
  symbol: string;
  side: "SHORT" | "LONG";
  timer: string;
  ttl: string;
  entry: string;
  stopLoss: string;
  stopLossPct: string;
  takeProfit: string;
  takeProfitPct: string;
  provider: string;
  rr: string;
  signalScore: string;
  signalScoreMax: string;
  indicatorNote: string;
  fundingRate: string;
  openInterest: string;
  longShortRatio: string;
  posted: string;
};

export type SignalAskSnapshot = {
  symbol: string;
  side: "SHORT" | "LONG";
  entry: string;
  stopLoss: string;
  stopLossPct: string;
  takeProfit: string;
  takeProfitPct: string;
};

export function getSignalAskPayload(card: SignalCardData): {
  message: string;
  snapshot: SignalAskSnapshot;
} {
  return {
    message: `Should I take this ${card.symbol} ${card.side} signal?`,
    snapshot: {
      symbol: card.symbol,
      side: card.side,
      entry: card.entry,
      stopLoss: card.stopLoss,
      stopLossPct: card.stopLossPct,
      takeProfit: card.takeProfit,
      takeProfitPct: card.takeProfitPct,
    },
  };
}

const TABS: { id: SignalTab; label: string }[] = [
  { id: "titan", label: "Titan" },
  { id: "sage", label: "Sage" },
  { id: "vanguard", label: "Vanguard" },
];

export const SIGNAL_CARDS: SignalCardData[] = [
  {
    id: "btc-1",
    symbol: "BTC-PERP",
    side: "SHORT",
    timer: "3:40:35",
    ttl: "TTL 240 min",
    entry: "62,104.30",
    stopLoss: "64,298.34",
    stopLossPct: "+3.53%",
    takeProfit: "57,716.23",
    takeProfitPct: "-7.07%",
    provider: "Provided by Hunt Titan · SAGE",
    rr: "2.0",
    signalScore: "60",
    signalScoreMax: "/100",
    indicatorNote: "3 of 6 indicators bearish, 0 bullish",
    fundingRate: "+0.002% · Neutral",
    openInterest: "$100,512",
    longShortRatio: "0.676 · Bearish",
    posted: "Posted 20:53 · valid 240 min",
  },
  {
    id: "btc-2",
    symbol: "BTC-PERP",
    side: "SHORT",
    timer: "2:58:12",
    ttl: "TTL 180 min",
    entry: "2,486.40",
    stopLoss: "2,565.96",
    stopLossPct: "-3.20%",
    takeProfit: "2,295.65",
    takeProfitPct: "+7.68%",
    provider: "Provided by Hunt Titan · SAGE",
    rr: "2.0",
    signalScore: "58",
    signalScoreMax: "/100",
    indicatorNote: "3 of 6 indicators bearish, 0 bullish",
    fundingRate: "+0.002% · Neutral",
    openInterest: "$100,512",
    longShortRatio: "0.676 · Bearish",
    posted: "Posted 19:12 · valid 180 min",
  },
];

const slideIn: CSSProperties = {
  animation: "signalMoveIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
};

function TabRow({
  active,
  onSelect,
}: {
  active: SignalTab;
  onSelect: (id: SignalTab) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {TABS.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: "none",
              background: selected
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.1)",
              color: selected ? "#ffffff" : "rgba(255,255,255,0.3)",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "20px",
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function SignalCard({
  data,
  onViewMore,
  onAskAgent,
  onTradeNow,
}: {
  data: SignalCardData;
  onViewMore: () => void;
  onAskAgent: () => void;
  onTradeNow: () => void;
}) {
  const sideColor = data.side === "SHORT" ? "#ff41a3" : "#00ffab";
  const timerLabel = useSignalCountdown(data.id, data.timer);
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 8,
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "12px 12px 4px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "20px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {data.symbol}
          </span>
          <span
            style={{
              alignSelf: "flex-start",
              padding: "1px 8px",
              borderRadius: 4,
              background: "rgba(255,65,163,0.05)",
              color: sideColor,
              fontSize: 12,
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
            alignItems: "flex-end",
            gap: 4,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <img
              src={ASSETS.clock}
              alt=""
              width={14}
              height={14}
              style={{ display: "block" }}
            />
            {timerLabel}
          </span>
          <span
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.13)",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {data.ttl}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "0 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Entry (limit)
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "-0.48px",
              color: "rgba(255,255,255,0.9)",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 70,
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Stop loss
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 60,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {data.stopLossPct}
              </span>
              <span
                style={{
                  width: 75,
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.42px",
                  color: "#ff41a3",
                }}
              >
                {data.stopLoss}
              </span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 70,
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Take profit
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 60,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {data.takeProfitPct}
              </span>
              <span
                style={{
                  width: 75,
                  textAlign: "right",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.42px",
                  color: "#00ffab",
                }}
              >
                {data.takeProfit}
              </span>
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {data.provider}
          </span>
          <button
            type="button"
            onClick={onViewMore}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              fontFamily: FONT,
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
            }}
          >
            view more
            <img
              src={ASSETS.chevron}
              alt=""
              width={16}
              height={16}
              style={{ display: "block", width: 16, height: 16 }}
            />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 12px 12px",
        }}
      >
        <button
          type="button"
          onClick={onAskAgent}
          style={{
            flex: 1,
            height: 32,
            border: "none",
            borderRadius: 999,
            backgroundImage: GRADIENTS.connectBtn,
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: FONT,
            cursor: "pointer",
          }}
        >
          Ask Agent
        </button>
        <button
          type="button"
          onClick={onTradeNow}
          style={{
            flex: 1,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: FONT,
            cursor: "pointer",
          }}
        >
          Trade Now
        </button>
      </div>
    </div>
  );
}

export function SignalListView({
  onViewMore,
  onBack,
  onAskAgent,
  onTradeNow,
}: {
  onViewMore: (id: string) => void;
  onBack: () => void;
  onAskAgent: (id: string) => void;
  onTradeNow: (id: string) => void;
}) {
  const [tab, setTab] = useState<SignalTab>("titan");

  return (
    <div
      style={{
        ...slideIn,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: FONT,
        background: "#1b1b1b",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "12px 13px 12px",
          background: "#1b1b1b",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <BackButton onClick={onBack} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "#ffffff",
            }}
          >
            Signal
          </span>
        </div>
        <TabRow active={tab} onSelect={setTab} />
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "#1b1b1b",
        }}
      >
        {/* Fade under fixed Signal + tabs when list scrolls */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 28,
            background:
              "linear-gradient(180deg, #1b1b1b 0%, rgba(27,27,27,0) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "12px 13px 28px",
            boxSizing: "border-box",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            touchAction: "pan-y",
            overscrollBehavior: "contain",
          }}
          className="signal-scroll"
          data-agent-scroll
        >
          {SIGNAL_CARDS.map((card) => (
            <SignalCard
              key={card.id}
              data={card}
              onViewMore={() => onViewMore(card.id)}
              onAskAgent={() => onAskAgent(card.id)}
              onTradeNow={() => onTradeNow(card.id)}
            />
          ))}
          <div
            style={{
              marginTop: "auto",
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                lineHeight: "16px",
                letterSpacing: "-0.33px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              This strategy is provided by a third party
            </span>
          </div>
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 48,
            background:
              "linear-gradient(180deg, rgba(19,21,25,0) 0%, #131519 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

export function SignalDetailView({
  signalId,
  onBack,
  onAskAgent,
  onTradeNow,
}: {
  signalId: string;
  onBack: () => void;
  onAskAgent: () => void;
  onTradeNow: () => void;
}) {
  const data =
    SIGNAL_CARDS.find((c) => c.id === signalId) ?? SIGNAL_CARDS[0];
  const timerLabel = useSignalCountdown(data.id, data.timer);
  const sideColor = data.side === "SHORT" ? "#ff41a3" : "#46ccb9";
  const fundingParts = data.fundingRate.split(" · ");
  const lsParts = data.longShortRatio.split(" · ");
  const takeProfitPct = data.takeProfitPct.startsWith("-")
    ? data.takeProfitPct
    : data.takeProfitPct.replace("+", "-");

  const cardSurface = "rgba(255,255,255,0.05)";

  return (
    <div
      style={{
        ...slideIn,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: FONT,
        overflow: "hidden",
        background: "#1b1b1b",
        padding: "12px 13px 0",
      }}
    >
      {/* One continuous card: sticky BTC nav + scroll body (no seam when scrolled) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          borderRadius: 8,
          background: cardSurface,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Fixed header: back + symbol — same surface as Price Structure */}
        <div
          style={{
            flexShrink: 0,
            padding: "12px 12px 0",
            boxSizing: "border-box",
            background: cardSurface,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
              paddingBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                type="button"
                aria-label="Back"
                onClick={onBack}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  width: 16,
                  height: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <BackIcon size={16} />
              </button>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {data.symbol}
              </span>
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: 4,
                  background:
                    data.side === "SHORT"
                      ? "rgba(255,65,163,0.05)"
                      : "rgba(70,204,185,0.05)",
                  color: sideColor,
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "18px",
                }}
              >
                {data.side}
              </span>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <img
                src={ASSETS.clock}
                alt=""
                width={13}
                height={13}
                style={{ display: "block" }}
              />
              {timerLabel}
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "0 12px 88px",
              boxSizing: "border-box",
              scrollbarWidth: "none",
              touchAction: "pan-y",
              overscrollBehavior: "contain",
              background: cardSurface,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
            className="signal-scroll"
            data-agent-scroll
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                paddingTop: 8,
              }}
            >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Price Structure
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                width: "100%",
              }}
            >
              <PriceStructureRow
                accent="#ff41a3"
                title="Stop loss"
                pct={data.stopLossPct}
                pctColor="#be4584"
                price={data.stopLoss}
                priceColor="#ff41a3"
                note="Resistance Zone 63,952 – 64,234.1"
                noteRight="1.26x"
              />
              <div
                style={{
                  height: 1,
                  width: "100%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <PriceStructureRow
                accent="rgba(255,255,255,0.6)"
                title="Entry (limit)"
                price={data.entry}
                priceColor="#ffffff"
                note="Gap 62,104.3 – 62,192"
                noteRight="87.70"
              />
              <div
                style={{
                  height: 1,
                  width: "100%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <PriceStructureRow
                accent="#46ccb9"
                title="Take profit"
                pct={takeProfitPct}
                pctColor="#32aa99"
                price={data.takeProfit}
                priceColor="#46ccb9"
                note="Order Book Imbalance 0.06 < 0.67"
                noteRight="Sell Pressure"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                width: "100%",
              }}
            >
              <DetailMetric label="R:R" value={data.rr} />
              <DetailMetric
                label="TTL"
                value={data.ttl.replace(/^TTL\s+/i, "")}
              />
              <DetailMetric
                label="Signal score"
                value={data.signalScore}
                suffix={data.signalScoreMax}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <img
                src={ASSETS.signalBars}
                alt=""
                width={14}
                height={14}
                style={{ display: "block", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {data.indicatorNote}
              </span>
            </div>
          </div>

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
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Market Data
            </span>
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
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: 12,
                  boxSizing: "border-box",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      width: "100%",
                    }}
                  >
                    <MarketDataRow
                      label="Funding Rate"
                      value={fundingParts[0] ?? data.fundingRate}
                      hint={fundingParts[1]}
                    />
                    <MarketDataRow
                      label="Open Interest"
                      value={data.openInterest}
                    />
                    <MarketDataRow
                      label="Long/Short Ratio"
                      value={lsParts[0] ?? data.longShortRatio}
                      hint={lsParts[1]}
                    />
                  </div>
                  <div
                    style={{
                      height: 1,
                      width: "100%",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: "18px",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    A Long/Short Ratio below 1 indicates bearish positioning and
                    a higher short squeeze risk
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <span>Hunt Titan · SAGE</span>
                <span>{data.posted}</span>
              </div>
            </div>
          </div>
          </div>

          {/* Fixed CTAs — fade into page bg below card */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "40px 16px 16px",
              boxSizing: "border-box",
              background:
                "linear-gradient(180deg, rgba(27,27,27,0) 0%, #1b1b1b 45%, #1b1b1b 100%)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                width: "100%",
                pointerEvents: "auto",
              }}
            >
              <button
                type="button"
                onClick={onAskAgent}
                style={{
                  flex: 1,
                  height: 32,
                  border: "none",
                  borderRadius: 999,
                  backgroundImage: GRADIENTS.connectBtn,
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: FONT,
                  cursor: "pointer",
                }}
              >
                Ask Agent
              </button>
              <button
                type="button"
                onClick={onTradeNow}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: FONT,
                  cursor: "pointer",
                }}
              >
                Trade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceStructureRow({
  accent,
  title,
  pct,
  pctColor,
  price,
  priceColor,
  note,
  noteRight,
}: {
  accent: string;
  title: string;
  pct?: string;
  pctColor?: string;
  price: string;
  priceColor: string;
  note: string;
  noteRight: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        paddingLeft: 8,
        borderLeft: `2px solid ${accent}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {pct ? (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                color: pctColor ?? priceColor,
                whiteSpace: "nowrap",
              }}
            >
              {pct}
            </span>
          ) : null}
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "18px",
              color: priceColor,
              textAlign: "right",
              minWidth: pct ? 71 : undefined,
              whiteSpace: "nowrap",
            }}
          >
            {price}
          </span>
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.4)" }}>{note}</span>
        <span style={{ color: "rgba(255,255,255,0.6)" }}>{noteRight}</span>
      </div>
    </div>
  );
}

function DetailMetric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 8,
        borderRadius: 6,
        background: "rgba(255,255,255,0.05)",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
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
          fontSize: 14,
          fontWeight: suffix ? 600 : 500,
          lineHeight: "12px",
          letterSpacing: "-0.42px",
          color: "rgba(255,255,255,0.8)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {suffix ? (
          <span
            style={{
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {suffix}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function MarketDataRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
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
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "18px",
            letterSpacing: "-0.36px",
            color: "rgba(255,255,255,0.8)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {hint ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {hint}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function SignalMotionStyles(): ReactNode {
  return (
    <style>{`
      @keyframes signalMoveIn {
        from { opacity: 0; transform: translateX(18px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes moreMoveIn {
        from { opacity: 0; transform: translateX(-18px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .signal-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
    `}</style>
  );
}
