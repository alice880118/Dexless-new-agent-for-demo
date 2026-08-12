import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { FONT, GRADIENTS } from "../nav/design-system";
import { useSignalCountdown } from "../agent/signal-countdown";
import type { SignalCardData } from "../agent/SignalViews";
import {
  MARKET_ACTIVE_SIGNALS,
  MARKET_EXPIRED_SIGNALS,
  SOURCE_SUMMARY,
  type MarketSignalCard,
} from "./data";
import { FilterNumberField, FigmaRangeSlider } from "./FilterControls";
import {
  SignalFiltersDrawer,
  type SignalFilterState,
} from "./SignalFiltersDrawer";
import { SignalDetailModal } from "./SignalDetailModal";

const ASSETS = {
  chevron: "/signal/chevron-right.svg",
  warn: "/signal/warn.svg",
  clock: "/trader-dna/signal/clock-time.png",
} as const;

type MarketsTab = "markets" | "funding" | "signal";

const DEFAULT_FILTERS: SignalFilterState = {
  sources: { titan: false, sage: false, vanguard: false },
  dirs: { long: false, short: false },
  scoreMin: 0,
  rrMin: 0,
  symbolQuery: "",
};

const CHECKBOX_ASSETS = {
  select: "/signal/select.svg",
  unselect: "/signal/unselect.svg",
} as const;

function Checkbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        height: 20,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: FONT,
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "18px",
      }}
    >
      <img
        src={checked ? CHECKBOX_ASSETS.select : CHECKBOX_ASSETS.unselect}
        alt=""
        width={16}
        height={16}
        style={{ display: "block", width: 16, height: 16, flexShrink: 0 }}
      />
      {label}
    </button>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
          textTransform: "capitalize",
        }}
      >
        {title}
      </span>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        width: "100%",
        background: "rgba(227,231,234,0.1)",
        flexShrink: 0,
      }}
    />
  );
}

function Row({
  label,
  value,
  valueColor,
  pct,
}: {
  label: string;
  value: string;
  valueColor?: string;
  pct?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        minHeight: 24,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textAlign: "right",
        }}
      >
        {pct ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.4)",
              minWidth: 56,
            }}
          >
            {pct}
          </span>
        ) : null}
        <span
          style={{
            fontSize: pct ? 13 : 16,
            fontWeight: 600,
            lineHeight: "18px",
            color: valueColor ?? "rgba(255,255,255,0.8)",
            minWidth: pct ? 80 : undefined,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function ControlChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        height: 28,
        padding: "4px 10px",
        borderRadius: 6,
        border: "none",
        background: "rgba(255,255,255,0.05)",
        color: "rgba(255,255,255,0.6)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONT,
        lineHeight: "18px",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label}
      <span
        aria-hidden
        style={{
          width: 0,
          height: 0,
          borderLeft: "3.5px solid transparent",
          borderRight: "3.5px solid transparent",
          borderTop: "5px solid rgba(255,255,255,0.6)",
          marginLeft: 2,
        }}
      />
    </button>
  );
}

/** Figma 7773:187982 / 188041 — active count pill */
function ActivePill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 8px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.1)",
        color: "#dbfd5c",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "18px",
        fontFamily: FONT,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/** Figma 7773:188015 / 188044 — muted outline pill */
function MutedPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 6px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.2)",
        boxSizing: "border-box",
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "18px",
        fontFamily: FONT,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Remove ${label} filter`}
      onClick={onRemove}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: 28,
        height: 28,
        padding: "0 12px",
        borderRadius: 99,
        border: "none",
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "16px",
        fontFamily: FONT,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <span style={{ lineHeight: "16px" }}>{label}</span>
      <img
        src="/signal/close.svg"
        alt=""
        width={8}
        height={8}
        style={{
          display: "block",
          width: 8,
          height: 8,
          flexShrink: 0,
          opacity: 0.7,
        }}
      />
    </button>
  );
}

function SignalMarketCard({
  data,
  expired,
  stacked,
  onAskAgent,
  onTradeNow,
  onViewMore,
}: {
  data: MarketSignalCard;
  expired?: boolean;
  /** Mobile IA: side on its own row */
  stacked?: boolean;
  onAskAgent: () => void;
  onTradeNow?: () => void;
  onViewMore: () => void;
}) {
  const timerLabel = useSignalCountdown(data.id, data.timer);
  const sideColor = data.side === "SHORT" ? "#ff41a3" : "#46ccb9";
  const muted = expired ? 0.5 : 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
        padding: 16,
        borderRadius: 8,
        background: "#131519",
        boxSizing: "border-box",
        minHeight: stacked ? undefined : 250,
        fontFamily: FONT,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: muted }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={data.icon}
              alt=""
              width={16}
              height={16}
              style={{
                display: "block",
                width: 16,
                height: 16,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: stacked ? 16 : 14,
                fontWeight: 700,
                lineHeight: "20px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {data.symbol}
            </span>
            {!stacked ? (
              <span
                style={{
                  padding: "0 4px",
                  borderRadius: 4,
                  background:
                    data.side === "SHORT"
                      ? "rgba(255,65,163,0.1)"
                      : "rgba(70,204,185,0.1)",
                  color: sideColor,
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "18px",
                  textTransform: "capitalize",
                }}
              >
                {data.side === "SHORT" ? "Short" : "Long"}
              </span>
            ) : null}
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            {!expired ? (
              <img
                src={ASSETS.clock}
                alt=""
                width={13}
                height={13}
                style={{ display: "block", width: 13, height: 13 }}
              />
            ) : null}
            {expired ? data.expiredLabel ?? "expired" : timerLabel}
          </span>
        </div>

        {stacked ? (
          <span
            style={{
              alignSelf: "flex-start",
              padding: "0 4px",
              borderRadius: 4,
              background:
                data.side === "SHORT"
                  ? "rgba(255,65,163,0.1)"
                  : "rgba(70,204,185,0.1)",
              color: sideColor,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              textTransform: "capitalize",
            }}
          >
            {data.side === "SHORT" ? "Short" : "Long"}
          </span>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Row label="Entry (limit)" value={data.entry} />
          <div
            style={{
              height: 1,
              width: "100%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Row
              label="Stop loss"
              value={data.stopLoss}
              pct={data.stopLossPct}
              valueColor="#ff41a3"
            />
            <Row
              label="Take profit"
              value={data.takeProfit}
              pct={data.takeProfitPct}
              valueColor="#46ccb9"
            />
          </div>
        </div>

        {data.priceMoved && !expired && !stacked ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 6,
              background: "rgba(227,184,70,0.08)",
            }}
          >
            <img
              src={ASSETS.warn}
              alt=""
              width={14}
              height={14}
              style={{ display: "block", width: 14, height: 14, marginTop: 2 }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#e3b846" }}>
                Price Moved
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Market Entry Lowers R/R
              </span>
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            width: "100%",
            padding: "4px 8px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {`${data.sourceLabel} · Score ${data.signalScore} · R:R ${data.rr}`}
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
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              fontFamily: FONT,
              flexShrink: 0,
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

      <div style={{ display: "flex", gap: 12, opacity: muted }}>
        <button
          type="button"
          onClick={onAskAgent}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 999,
            border: "none",
            background: GRADIENTS.connectBtn,
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "16px",
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          Ask Agent
        </button>
        {!expired ? (
          <button
            type="button"
            onClick={onTradeNow}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 999,
              border: "none",
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "16px",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Trade Now
          </button>
        ) : (
          <button
            type="button"
            onClick={onAskAgent}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 999,
              border: "none",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "16px",
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Ask Agent
          </button>
        )}
      </div>
    </div>
  );
}

function applyFilters(
  list: MarketSignalCard[],
  f: SignalFilterState,
): MarketSignalCard[] {
  const anySource =
    f.sources.titan || f.sources.sage || f.sources.vanguard;
  const anyDir = f.dirs.long || f.dirs.short;

  return list.filter((s) => {
    if (
      f.symbolQuery &&
      !s.symbol.toLowerCase().includes(f.symbolQuery.toLowerCase())
    ) {
      return false;
    }
    if (anyDir) {
      if (s.side === "LONG" && !f.dirs.long) return false;
      if (s.side === "SHORT" && !f.dirs.short) return false;
    }
    if (Number(s.signalScore) < f.scoreMin) return false;
    if (Number(s.rr) < f.rrMin) return false;
    if (anySource) {
      const src = s.sourceLabel.toLowerCase();
      const hitTitan = src.includes("titan");
      const hitSage = src.includes("sage");
      const hitVanguard = src.includes("vanguard");
      const ok =
        (hitTitan && f.sources.titan) ||
        (hitSage && f.sources.sage) ||
        (hitVanguard && f.sources.vanguard);
      if (!ok) return false;
    }
    return true;
  });
}

function countActiveFilterChips(f: SignalFilterState): number {
  let n = 0;
  if (f.sources.titan) n += 1;
  if (f.sources.sage) n += 1;
  if (f.sources.vanguard) n += 1;
  if (f.dirs.long) n += 1;
  if (f.dirs.short) n += 1;
  if (f.scoreMin > 0) n += 1;
  if (f.rrMin > 0) n += 1;
  if (f.symbolQuery.trim()) n += 1;
  return n;
}

export function MarketsPage({
  initialTab = "signal",
  compact = false,
  walletConnected = false,
  detailSignalId = null,
  onCloseDetail,
  signalTabFocusKey = 0,
  onOpenSignal,
  onTradeNow,
  onAskAgent,
  onConnectRequest,
}: {
  initialTab?: MarketsTab;
  /** <768 mobile / tablet layout */
  compact?: boolean;
  walletConnected?: boolean;
  /** Compact: show signal detail as full page instead of modal */
  detailSignalId?: string | null;
  onCloseDetail?: () => void;
  /** Bump to force switch to Signal tab (e.g. marquee icon) */
  signalTabFocusKey?: number;
  onOpenSignal: (signalId: string) => void;
  onTradeNow: (data: SignalCardData) => void;
  onAskAgent: (data: SignalCardData) => void;
  onConnectRequest?: () => void;
}) {
  const signalAllowed = walletConnected;
  const [tab, setTab] = useState<MarketsTab>(
    signalAllowed ? initialTab : "markets",
  );
  const [listTab, setListTab] = useState<"active" | "expired">("active");
  const [filters, setFilters] = useState<SignalFilterState>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<SignalFilterState>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!signalAllowed && tab === "signal") setTab("markets");
  }, [signalAllowed, tab]);

  useEffect(() => {
    if (detailSignalId && compact && signalAllowed) setTab("signal");
  }, [detailSignalId, compact, signalAllowed]);

  useEffect(() => {
    if (signalTabFocusKey > 0 && signalAllowed) setTab("signal");
  }, [signalTabFocusKey, signalAllowed]);

  const tabs: { id: MarketsTab; label: string }[] = [
    { id: "markets", label: "Markets" },
    { id: "funding", label: "Funding" },
    ...(signalAllowed ? [{ id: "signal" as const, label: "Signal" }] : []),
  ];

  const filterActive = useMemo(
    () => applyFilters(MARKET_ACTIVE_SIGNALS, filters),
    [filters],
  );

  const draftCount = useMemo(
    () => applyFilters(MARKET_ACTIVE_SIGNALS, draft).length,
    [draft],
  );

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDraft(DEFAULT_FILTERS);
  };

  const chipCount = countActiveFilterChips(filters);

  const pageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#0a0b0d",
    color: "#fff",
    fontFamily: FONT,
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const hideScrollCss = compact
    ? `
    .signal-markets-scroll::-webkit-scrollbar,
    .signal-markets-tabs::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  `
    : "";

  return (
    <div style={pageStyle}>
      {hideScrollCss ? <style>{hideScrollCss}</style> : null}
      {!(compact && detailSignalId) ? (
      <div
        className={compact ? "signal-markets-tabs" : undefined}
        style={{
          width: "100%",
          maxWidth: compact ? undefined : 1440,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: compact ? 16 : 20,
          padding: compact ? "10px 16px 0" : "12px 24px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          boxSizing: "border-box",
          overflowX: compact ? "auto" : undefined,
          scrollbarWidth: compact ? "none" : undefined,
          msOverflowStyle: compact ? "none" : undefined,
        }}
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                padding: "0 0 10px",
                border: "none",
                background: "transparent",
                color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                fontFamily: FONT,
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      ) : null}

      {tab !== "signal" && !(compact && detailSignalId) ? (
        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 1440,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.45)",
            fontSize: 16,
          }}
        >
          {tab === "markets" ? "Markets overview (demo)" : "Funding rates (demo)"}
        </div>
      ) : !signalAllowed ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={onConnectRequest}
            style={{
              height: 40,
              padding: "0 20px",
              borderRadius: 8,
              border: "none",
              background: GRADIENTS.connectBtn,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Connect wallet to view Signals
          </button>
        </div>
      ) : compact ? (
        detailSignalId ? (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SignalDetailModal
              signalId={detailSignalId}
              asPage
              onClose={() => onCloseDetail?.()}
              onViewAll={() => onCloseDetail?.()}
              onAskAgent={(signal) => {
                onCloseDetail?.();
                onAskAgent(signal);
              }}
              onTradeNow={(signal) => {
                onCloseDetail?.();
                onTradeNow(signal);
              }}
            />
          </div>
        ) : (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            overflowY: "auto",
            padding: "14px 16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxSizing: "border-box",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="signal-markets-scroll"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#fff",
                }}
              >
                Signals
              </span>
              <ActivePill label={`${filterActive.length} active`} />
            </div>
            <button
              type="button"
              onClick={() => {
                setDraft(filters);
                setFilterOpen(true);
              }}
              style={{
                height: 28,
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: FONT,
                lineHeight: "18px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              Filters
              {chipCount > 0 ? (
                <span
                  style={{
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {chipCount}
                </span>
              ) : null}
              <span
                aria-hidden
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "3.5px solid transparent",
                  borderRight: "3.5px solid transparent",
                  borderTop: "5px solid rgba(255,255,255,0.6)",
                  marginLeft: 2,
                }}
              />
            </button>
          </div>

          {chipCount > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
                width: "100%",
                minHeight: 28,
                overflow: "visible",
                boxSizing: "border-box",
              }}
            >
              {filters.sources.titan ? (
                <FilterChip
                  label="Titan"
                  onRemove={() =>
                    setFilters((f) => ({
                      ...f,
                      sources: { ...f.sources, titan: false },
                    }))
                  }
                />
              ) : null}
              {filters.sources.sage ? (
                <FilterChip
                  label="Sage"
                  onRemove={() =>
                    setFilters((f) => ({
                      ...f,
                      sources: { ...f.sources, sage: false },
                    }))
                  }
                />
              ) : null}
              {filters.sources.vanguard ? (
                <FilterChip
                  label="Vanguard"
                  onRemove={() =>
                    setFilters((f) => ({
                      ...f,
                      sources: { ...f.sources, vanguard: false },
                    }))
                  }
                />
              ) : null}
              {filters.dirs.long ? (
                <FilterChip
                  label="Long"
                  onRemove={() =>
                    setFilters((f) => ({ ...f, dirs: { ...f.dirs, long: false } }))
                  }
                />
              ) : null}
              {filters.dirs.short ? (
                <FilterChip
                  label="Short"
                  onRemove={() =>
                    setFilters((f) => ({
                      ...f,
                      dirs: { ...f.dirs, short: false },
                    }))
                  }
                />
              ) : null}
              {filters.scoreMin > 0 ? (
                <FilterChip
                  label={`≥${filters.scoreMin}`}
                  onRemove={() => setFilters((f) => ({ ...f, scoreMin: 0 }))}
                />
              ) : null}
              {filters.rrMin > 0 ? (
                <FilterChip
                  label={`R:R ≥${filters.rrMin.toFixed(1)}`}
                  onRemove={() => setFilters((f) => ({ ...f, rrMin: 0 }))}
                />
              ) : null}
              {filters.symbolQuery.trim() ? (
                <FilterChip
                  label={filters.symbolQuery.trim()}
                  onRemove={() => setFilters((f) => ({ ...f, symbolQuery: "" }))}
                />
              ) : null}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT,
              }}
            >
              win rate
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 8,
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.05)",
                boxSizing: "border-box",
              }}
            >
              {SOURCE_SUMMARY.map((s) => (
                <div
                  key={s.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: "16px",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: FONT,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.name}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: "20px",
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: FONT,
                    }}
                  >
                    {s.winRate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {(
              [
                { id: "active" as const, label: "All signals" },
                { id: "expired" as const, label: "Expired signals" },
              ] as const
            ).map((t) => {
              const on = listTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setListTab(t.id)}
                  style={{
                    padding: "0 0 10px",
                    border: "none",
                    borderBottom: on
                      ? "2px solid #ffffff"
                      : "2px solid transparent",
                    background: "transparent",
                    color: on ? "#ffffff" : "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    fontWeight: on ? 600 : 500,
                    cursor: "pointer",
                    fontFamily: FONT,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(listTab === "active" ? filterActive : MARKET_EXPIRED_SIGNALS).map(
                (card) => (
                  <SignalMarketCard
                    key={card.id}
                    data={card}
                    expired={listTab === "expired"}
                    stacked
                    onAskAgent={() => onAskAgent(card)}
                    onTradeNow={
                      listTab === "active"
                        ? () => onTradeNow(card)
                        : undefined
                    }
                    onViewMore={() => onOpenSignal(card.id)}
                  />
                ),
              )}
            </div>
          </section>

          <SignalFiltersDrawer
            open={filterOpen}
            draft={draft}
            resultCount={draftCount}
            onChange={setDraft}
            onClear={() => setDraft(DEFAULT_FILTERS)}
            onClose={() => setFilterOpen(false)}
            onApply={() => {
              setFilters(draft);
              setFilterOpen(false);
            }}
          />
        </div>
        )
      ) : (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "8px 24px 24px",
            boxSizing: "border-box",
            gap: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              padding: "8px 0",
              flexShrink: 0,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#ffffff",
                }}
              >
                Signals
              </h1>
              <ActivePill label={`${filterActive.length} active`} />
              <MutedPill label="12 expired in 24h" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ControlChip label="Sort: Latest" />
              <ControlChip label="Time Range: 24h" />
              <button
                type="button"
                style={{
                  height: 28,
                  padding: "0 16px",
                  borderRadius: 999,
                  border: "none",
                  background: GRADIENTS.connectBtn,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                Set Notification
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <aside
              style={{
                width: 200,
                flexShrink: 0,
                padding: "0 16px 16px 0",
                borderRight: "1px solid rgba(227,231,234,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                overflowY: "auto",
                overflowX: "visible",
                boxSizing: "border-box",
              }}
            >
              <FilterSection title="Symbol">
                <input
                  value={filters.symbolQuery}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, symbolQuery: e.target.value }))
                  }
                  placeholder="search"
                  style={{
                    width: "100%",
                    height: 36,
                    padding: "6px 10px",
                    borderRadius: 4,
                    border: "none",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: FONT,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </FilterSection>
              <Divider />
              <FilterSection title="Signal Source">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Checkbox
                    checked={filters.sources.titan}
                    label="Titan"
                    onChange={() =>
                      setFilters((f) => ({
                        ...f,
                        sources: { ...f.sources, titan: !f.sources.titan },
                      }))
                    }
                  />
                  <Checkbox
                    checked={filters.sources.sage}
                    label="Sage"
                    onChange={() =>
                      setFilters((f) => ({
                        ...f,
                        sources: { ...f.sources, sage: !f.sources.sage },
                      }))
                    }
                  />
                  <Checkbox
                    checked={filters.sources.vanguard}
                    label="Vanguard"
                    onChange={() =>
                      setFilters((f) => ({
                        ...f,
                        sources: {
                          ...f.sources,
                          vanguard: !f.sources.vanguard,
                        },
                      }))
                    }
                  />
                </div>
              </FilterSection>
              <Divider />
              <FilterSection title="Direction">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Checkbox
                    checked={filters.dirs.long}
                    label="Long"
                    onChange={() =>
                      setFilters((f) => ({
                        ...f,
                        dirs: { ...f.dirs, long: !f.dirs.long },
                      }))
                    }
                  />
                  <Checkbox
                    checked={filters.dirs.short}
                    label="Short"
                    onChange={() =>
                      setFilters((f) => ({
                        ...f,
                        dirs: { ...f.dirs, short: !f.dirs.short },
                      }))
                    }
                  />
                </div>
              </FilterSection>
              <Divider />
              <FilterSection title="Signal Score">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                    overflow: "visible",
                  }}
                >
                  <FilterNumberField
                    value={filters.scoreMin}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(scoreMin) => setFilters((f) => ({ ...f, scoreMin }))}
                  />
                  <FigmaRangeSlider
                    min={0}
                    max={100}
                    step={1}
                    value={filters.scoreMin}
                    onChange={(scoreMin) => setFilters((f) => ({ ...f, scoreMin }))}
                    minLabel="0"
                    maxLabel="100"
                  />
                </div>
              </FilterSection>
              <Divider />
              <FilterSection title="R : R">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                    overflow: "visible",
                  }}
                >
                  <FilterNumberField
                    value={filters.rrMin}
                    min={0}
                    max={1.5}
                    step={0.1}
                    onChange={(rrMin) => setFilters((f) => ({ ...f, rrMin }))}
                  />
                  <FigmaRangeSlider
                    min={0}
                    max={1.5}
                    step={0.1}
                    value={filters.rrMin}
                    onChange={(rrMin) => setFilters((f) => ({ ...f, rrMin }))}
                    minLabel="0"
                    maxLabel="1.5"
                  />
                </div>
              </FilterSection>
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  alignSelf: "flex-start",
                  cursor: "pointer",
                  color: "#c9bdff",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: FONT,
                  lineHeight: "18px",
                }}
              >
                Clear all filters
              </button>
            </aside>

            <div
              style={{
                flex: 1,
                minWidth: 0,
                overflowY: "auto",
                paddingLeft: 16,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 12,
                  width: "100%",
                }}
              >
                {SOURCE_SUMMARY.map((s) => (
                  <div
                    key={s.name}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid rgba(227,231,234,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{s.name}</span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {s.signals} signals
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        7D win rate
                      </span>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          letterSpacing: "-0.6px",
                          lineHeight: "20px",
                        }}
                      >
                        {s.winRate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {(
                  [
                    { id: "active" as const, label: "All signals" },
                    { id: "expired" as const, label: "Expired signals" },
                  ] as const
                ).map((t) => {
                  const on = listTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setListTab(t.id)}
                      style={{
                        padding: "0 0 10px",
                        border: "none",
                        borderBottom: on
                          ? "2px solid #ffffff"
                          : "2px solid transparent",
                        background: "transparent",
                        color: on ? "#ffffff" : "rgba(255,255,255,0.5)",
                        fontSize: 14,
                        fontWeight: on ? 600 : 500,
                        cursor: "pointer",
                        fontFamily: FONT,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 12,
                    width: "100%",
                  }}
                >
                  {(listTab === "active"
                    ? filterActive
                    : MARKET_EXPIRED_SIGNALS
                  ).map((card) => (
                    <SignalMarketCard
                      key={card.id}
                      data={card}
                      expired={listTab === "expired"}
                      onAskAgent={() => onAskAgent(card)}
                      onTradeNow={
                        listTab === "active"
                          ? () => onTradeNow(card)
                          : undefined
                      }
                      onViewMore={() => onOpenSignal(card.id)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
