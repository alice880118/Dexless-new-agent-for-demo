import { useState, type CSSProperties, type ReactNode } from "react";
import { FONT, GRADIENTS } from "../nav/design-system";

const ASSETS = {
  clock: "/trader-dna/signal/clock.png",
  chevron: "/trader-dna/signal/chevron-right.png",
  signalBars: "/trader-dna/signal/signal-bars.png",
  tickSl: "/trader-dna/signal/ps-tick-sl.svg",
  tickEntry: "/trader-dna/signal/ps-tick-entry.svg",
  tickTp: "/trader-dna/signal/ps-tick-tp.svg",
} as const;

function BackIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M11.25 4.5L6.75 9l4.5 4.5"
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
        width: 18,
        height: 18,
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
      <BackIcon size={18} />
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
              width={13}
              height={13}
              style={{ display: "block" }}
            />
            {data.timer}
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
          overflowY: "auto",
          padding: "12px 13px",
          boxSizing: "border-box",
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
        className="signal-scroll"
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
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "12px 13px 12px",
          background: "#1b1b1b",
          boxSizing: "border-box",
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

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "12px 13px 0",
          boxSizing: "border-box",
          scrollbarWidth: "none",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 calc(100% - 36px), transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 calc(100% - 36px), transparent 100%)",
        }}
        className="signal-scroll"
      >
        <div
          style={{
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            boxSizing: "border-box",
            marginBottom: 12,
          }}
        >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
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
                    background: "rgba(255,65,163,0.05)",
                    color: "#ff41a3",
                    fontSize: 12,
                    fontWeight: 600,
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
                {data.timer}
              </span>
            </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Row label="Entry (limit)" value={data.entry} />
            <Row
              label="Stop loss"
              mid={data.stopLossPct}
              value={data.stopLoss}
              valueColor="#ff41a3"
            />
            <Row
              label="Take profit"
              mid={data.takeProfitPct}
              value={data.takeProfit}
              valueColor="#00ffab"
            />
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.1)",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <Metric label="R:R" value={data.rr} />
            <Metric label="TTL" value={data.ttl.replace("TTL ", "")} />
            <Metric
              label="Signal score"
              value={`${data.signalScore}`}
              suffix={data.signalScoreMax}
              align="right"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "2px 4px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <img
              src={ASSETS.signalBars}
              alt=""
              width={14}
              height={14}
              style={{ display: "block", width: 14, height: 14 }}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Price Structure
            </span>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                width: "100%",
              }}
            >
              <PriceStructureBar />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <StructureBlock
                    price={data.stopLoss}
                    pct={data.stopLossPct}
                    title="Stop Loss"
                    priceColor="#ff41a3"
                    pctColor="#96215d"
                    note="Resistance Zone 63,952 – 64,234.1"
                    noteRight="1.26x"
                  />
                  <StructureBlock
                    price={data.entry}
                    title="Entry"
                    priceColor="#ffffff"
                    note="Gap 62,104.3 – 62,192"
                    noteRight="87.70"
                  />
                </div>
                <StructureBlock
                  price={data.takeProfit}
                  pct={data.takeProfitPct.replace("-", "−").replace("+", "−")}
                  title="Take Profit"
                  priceColor="#00ffab"
                  pctColor="#2a8869"
                  note="Order Book Imbalance"
                  noteRight="0.06 < 0.67 Sell Pressure"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Market Data
            </span>
            <Row label="Funding Rate" value={data.fundingRate} compact />
            <Row label="Open Interest" value={data.openInterest} compact />
            <Row
              label="Long/Short Ratio"
              value={data.longShortRatio}
              compact
            />
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 500,
                lineHeight: "16px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              A Long/Short Ratio below 1 indicates bearish positioning and a
              higher short squeeze risk
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 8,
          padding: "12px 13px 16px",
          boxSizing: "border-box",
          background: "#1b1b1b",
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

function PriceStructureBar() {
  return (
    <div
      style={{
        position: "relative",
        width: 13,
        height: 144,
        flexShrink: 0,
      }}
    >
      <img
        src={ASSETS.tickSl}
        alt=""
        width={13}
        height={1}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          display: "block",
          width: 13,
          height: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 2,
          width: 9,
          height: 140,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 9,
            height: 52.24,
            background: "rgba(255,65,163,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 9,
            height: 9.59,
            background: "#ff41a3",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 52.24,
            width: 9,
            height: 2.09,
            background: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 54.33,
            width: 9,
            height: 85.67,
            background: "rgba(0,255,171,0.2)",
          }}
        />
      </div>
      <img
        src={ASSETS.tickEntry}
        alt=""
        width={13}
        height={1}
        style={{
          position: "absolute",
          left: 0,
          top: 55,
          display: "block",
          width: 13,
          height: 1,
        }}
      />
      <img
        src={ASSETS.tickTp}
        alt=""
        width={13}
        height={1}
        style={{
          position: "absolute",
          left: 0,
          top: 144,
          display: "block",
          width: 13,
          height: 1,
        }}
      />
    </div>
  );
}

function Row({
  label,
  mid,
  value,
  valueColor = "rgba(255,255,255,0.9)",
  compact,
}: {
  label: string;
  mid?: string;
  value: string;
  valueColor?: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: compact
            ? "rgba(255,255,255,0.5)"
            : "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {mid && (
          <span
            style={{
              width: 60,
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {mid}
          </span>
        )}
        <span
          style={{
            fontSize: compact ? 12 : 13,
            fontWeight: compact ? 600 : 500,
            color: valueColor,
            letterSpacing: "-0.39px",
            textAlign: "right",
            minWidth: mid ? 75 : undefined,
          }}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  suffix,
  align = "left",
}: {
  label: string;
  value: string;
  suffix?: string;
  align?: "left" | "right";
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        textAlign: align,
        minWidth: align === "right" ? 100 : 44,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "-0.39px",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {value}
        {suffix && (
          <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

function StructureBlock({
  price,
  pct,
  title,
  priceColor,
  pctColor,
  note,
  noteRight,
}: {
  price: string;
  pct?: string;
  title: string;
  priceColor: string;
  pctColor?: string;
  note: string;
  noteRight: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: "18px",
            color: priceColor,
          }}
        >
          {price}
        </span>
        {pct && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: pctColor ?? priceColor,
            }}
          >
            {pct}
          </span>
        )}
        <span
          style={{ fontSize: 10, fontWeight: 600, color: "#ffffff" }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.4)" }}>{note}</span>
        <span style={{ color: "rgba(255,255,255,0.8)" }}>{noteRight}</span>
      </div>
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
