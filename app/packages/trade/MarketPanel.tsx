import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT } from "../nav/design-system";
import { MARKET_LIST, type MarketListItem } from "./demoData";
import {
  MARKET_EXPANDED_W,
  MARKET_PREVIEW_W,
  MARKET_RAIL_W,
  TRADE_COLORS,
  allowsInlineMarketExpand,
  getRowHeight,
  type TradeLayoutMode,
} from "./tradeLayout";

export type MarketTab = "favorites" | "all" | "rwa" | "new" | "recent";
export type MarketSortKey = "market" | "price" | "change";
export type MarketSortDir = "asc" | "desc";

const LS_EXPANDED = "dexless-market-expanded";
const LS_FAVORITES = "dexless-market-favorites";
const LS_RECENT = "dexless-market-recent";
const LS_SORT_PREFIX = "dexless-market-sort-";

type SortState = { key: MarketSortKey; dir: MarketSortDir };

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function defaultExpanded(viewportW: number): boolean {
  return allowsInlineMarketExpand(viewportW);
}

function TokenIcon({
  item,
  size = 20,
}: {
  item: MarketListItem;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: item.iconColor,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: FONT,
        fontSize: size * 0.38,
        fontWeight: 700,
        color: "#0a0b0d",
        lineHeight: 1,
      }}
    >
      {item.base.slice(0, 2)}
    </span>
  );
}

function StarIcon({
  active,
  size = 14,
}: {
  active: boolean;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 1.6l1.76 3.56 3.93.57-2.84 2.77.67 3.91L8 10.56l-3.52 1.85.67-3.91L2.3 5.73l3.93-.57L8 1.6z"
        fill={active ? "#f5c518" : "transparent"}
        stroke={active ? "#f5c518" : "rgba(255,255,255,0.35)"}
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CollapseIcon({ expand }: { expand: boolean }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
      {expand ? (
        <path
          d="M3 7h8M8 4l3 3-3 3"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M11 7H3M6 4L3 7l3 3"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

type MarketListBodyProps = {
  mode: TradeLayoutMode;
  variant: "full" | "compact";
  selectedId: string;
  favorites: Set<string>;
  recentIds: string[];
  tab: MarketTab;
  onTabChange: (tab: MarketTab) => void;
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortState;
  onSortChange: (next: SortState) => void;
  onToggleFavorite: (id: string) => void;
  onSelect: (item: MarketListItem) => void;
  showHeader?: boolean;
  title?: string;
  onCollapse?: () => void;
  onClose?: () => void;
};

function MarketListBody({
  mode,
  variant,
  selectedId,
  favorites,
  recentIds,
  tab,
  onTabChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onToggleFavorite,
  onSelect,
  showHeader = true,
  title = "Markets",
  onCollapse,
  onClose,
}: MarketListBodyProps) {
  const rowH = getRowHeight(mode);
  const compactCols = variant === "compact";

  const filtered = useMemo(() => {
    let list = MARKET_LIST.slice();
    if (tab === "favorites") {
      list = list.filter((m) => favorites.has(m.id));
    } else if (tab === "rwa") {
      list = list.filter((m) => m.category === "rwa");
    } else if (tab === "new") {
      list = list.filter((m) => m.isNew);
    } else if (tab === "recent") {
      list = recentIds
        .map((id) => list.find((m) => m.id === id))
        .filter(Boolean) as MarketListItem[];
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.symbol.toLowerCase().includes(q) ||
          m.base.toLowerCase().includes(q),
      );
    }

    const dir = sort.dir === "asc" ? 1 : -1;
    list = list.slice().sort((a, b) => {
      if (sort.key === "price") return (a.priceNum - b.priceNum) * dir;
      if (sort.key === "change") return (a.changePct - b.changePct) * dir;
      return a.symbol.localeCompare(b.symbol) * dir;
    });
    return list;
  }, [tab, favorites, recentIds, search, sort]);

  const tabs: { id: MarketTab; label: ReactNode }[] = [
    {
      id: "favorites",
      label: <StarIcon active={tab === "favorites"} size={12} />,
    },
    { id: "all", label: "All" },
    {
      id: "rwa",
      label: (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          RWA
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: TRADE_COLORS.green,
              lineHeight: 1,
            }}
          >
            New
          </span>
        </span>
      ),
    },
    { id: "new", label: "New" },
    { id: "recent", label: "Recent" },
  ];

  const cycleSort = (key: MarketSortKey) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, dir: "desc" });
    }
  };

  const sortMark = (key: MarketSortKey) =>
    sort.key === key ? (sort.dir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        background: TRADE_COLORS.panel,
        fontFamily: FONT,
        boxSizing: "border-box",
      }}
    >
      {showHeader && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            flexShrink: 0,
            borderBottom: `1px solid ${TRADE_COLORS.border}`,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#ffffff",
              lineHeight: "18px",
            }}
          >
            {title}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {onCollapse && (
              <button
                type="button"
                aria-label="Collapse markets"
                onClick={onCollapse}
                style={iconBtnStyle}
              >
                <CollapseIcon expand={false} />
              </button>
            )}
            {onClose && (
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                style={{
                  ...iconBtnStyle,
                  fontSize: 16,
                  color: COLORS.white50,
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ padding: "8px 10px 0", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 32,
            padding: "0 10px",
            borderRadius: 8,
            background: TRADE_COLORS.inputBg,
            border: `1px solid ${TRADE_COLORS.border}`,
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: 12, color: COLORS.white40 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 500,
              color: "#ffffff",
            }}
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              style={{
                border: "none",
                background: "transparent",
                color: COLORS.white40,
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "8px 8px 4px",
          flexShrink: 0,
          overflowX: "auto",
        }}
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              style={{
                border: "none",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                background: active
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 600,
                color: active ? "#ffffff" : COLORS.white50,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {!compactCols && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 64px 56px",
            gap: 4,
            padding: "4px 12px",
            flexShrink: 0,
          }}
        >
          <SortHead
            label={`Market${sortMark("market")}`}
            align="left"
            onClick={() => cycleSort("market")}
          />
          <SortHead
            label={`Price${sortMark("price")}`}
            align="right"
            onClick={() => cycleSort("price")}
          />
          <SortHead
            label={`24h%${sortMark("change")}`}
            align="right"
            onClick={() => cycleSort("change")}
          />
        </div>
      )}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: 16,
              fontSize: 12,
              color: COLORS.white40,
              textAlign: "center",
            }}
          >
            No markets
          </div>
        ) : (
          filtered.map((item) => {
            const selected = item.id === selectedId;
            const up = item.changePct >= 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                style={{
                  display: "grid",
                  gridTemplateColumns: compactCols
                    ? "16px 20px minmax(0,1fr)"
                    : "16px 20px minmax(96px,1fr) 64px 56px",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  minHeight: rowH,
                  padding: compactCols ? "8px 12px" : "4px 12px",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: selected
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  boxSizing: "border-box",
                  fontFamily: FONT,
                }}
              >
                <span
                  role="presentation"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 16,
                    height: 16,
                  }}
                >
                  <StarIcon active={favorites.has(item.id)} size={12} />
                </span>
                <TokenIcon item={item} size={20} />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#ffffff",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.symbol}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 600,
                        lineHeight: "14px",
                        padding: "0 4px",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.08)",
                        color: COLORS.white60,
                      }}
                    >
                      {item.leverage}
                    </span>
                  </div>
                  {!compactCols && (
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: COLORS.white40,
                        marginTop: 1,
                      }}
                    >
                      Vol {item.volume}
                    </div>
                  )}
                </div>
                {!compactCols && (
                  <>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.price}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: up ? TRADE_COLORS.green : TRADE_COLORS.red,
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.change24h}
                    </span>
                  </>
                )}
                {compactCols && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: up ? TRADE_COLORS.green : TRADE_COLORS.red,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item.change24h}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SortHead({
  label,
  align,
  onClick,
}: {
  label: string;
  align: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: 500,
        color: COLORS.white40,
        textAlign: align,
      }}
    >
      {label}
    </button>
  );
}

const iconBtnStyle: CSSProperties = {
  border: "none",
  background: "rgba(255,255,255,0.06)",
  borderRadius: 6,
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
};

type MarketPanelProps = {
  mode: TradeLayoutMode;
  viewportW: number;
  selectedId: string;
  onSelectMarket: (item: MarketListItem) => void;
  /** External open request (header symbol / etc.) */
  pickerOpen: boolean;
  onPickerOpenChange: (open: boolean) => void;
};

export function MarketPanel({
  mode,
  viewportW,
  selectedId,
  onSelectMarket,
  pickerOpen,
  onPickerOpenChange,
}: MarketPanelProps) {
  const inlineOk = allowsInlineMarketExpand(viewportW);
  const [expanded, setExpanded] = useState(() =>
    typeof window === "undefined"
      ? false
      : readJson(LS_EXPANDED, defaultExpanded(viewportW)),
  );
  const [favorites, setFavorites] = useState<Set<string>>(() =>
    typeof window === "undefined"
      ? new Set()
      : new Set(readJson<string[]>(LS_FAVORITES, ["eth", "btc"])),
  );
  const [recentIds, setRecentIds] = useState<string[]>(() =>
    typeof window === "undefined"
      ? []
      : readJson<string[]>(LS_RECENT, ["eth", "btc", "sol"]),
  );
  const [tab, setTab] = useState<MarketTab>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>(() =>
    typeof window === "undefined"
      ? { key: "market", dir: "asc" }
      : readJson(LS_SORT_PREFIX + "all", {
          key: "market" as MarketSortKey,
          dir: "asc" as MarketSortDir,
        }),
  );
  const [railPreview, setRailPreview] = useState(false);
  const [tooltip, setTooltip] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const showColumn = mode !== "xs";
  const slotExpanded = expanded && inlineOk && mode !== "md";
  const slotW = showColumn
    ? slotExpanded
      ? MARKET_EXPANDED_W
      : MARKET_RAIL_W
    : 0;

  /** Preview / drawer visibility */
  const showOverlayPicker =
    pickerOpen ||
    railPreview ||
    (expanded && !inlineOk && mode !== "xs" && !slotExpanded);

  useEffect(() => {
    writeJson(LS_EXPANDED, expanded);
  }, [expanded]);

  useEffect(() => {
    writeJson(LS_FAVORITES, Array.from(favorites));
  }, [favorites]);

  useEffect(() => {
    writeJson(LS_RECENT, recentIds);
  }, [recentIds]);

  useEffect(() => {
    writeJson(LS_SORT_PREFIX + tab, sort);
  }, [tab, sort]);

  useEffect(() => {
    const saved = readJson<SortState | null>(LS_SORT_PREFIX + tab, null);
    if (saved?.key) setSort(saved);
    else setSort({ key: "market", dir: "asc" });
  }, [tab]);

  useEffect(() => {
    if (!pickerOpen && !railPreview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onPickerOpenChange(false);
        setRailPreview(false);
        if (!inlineOk) setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pickerOpen, railPreview, onPickerOpenChange, inlineOk]);

  const handleSelect = (item: MarketListItem) => {
    onSelectMarket(item);
    setRecentIds((prev) => [
      item.id,
      ...prev.filter((id) => id !== item.id),
    ].slice(0, 12));
    onPickerOpenChange(false);
    setRailPreview(false);
    if (!inlineOk && mode !== "xs") setExpanded(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExpandToggle = () => {
    if (slotExpanded) {
      setExpanded(false);
      return;
    }
    if (inlineOk && mode !== "md") {
      setExpanded(true);
      onPickerOpenChange(false);
      setRailPreview(false);
      return;
    }
    // Open overlay instead of pushing layout
    setExpanded(true);
    setRailPreview(true);
    onPickerOpenChange(true);
  };

  const listProps: Omit<MarketListBodyProps, "variant" | "showHeader"> = {
    mode,
    selectedId,
    favorites,
    recentIds,
    tab,
    onTabChange: setTab,
    search,
    onSearchChange: setSearch,
    sort,
    onSortChange: setSort,
    onToggleFavorite: toggleFavorite,
    onSelect: handleSelect,
  };

  const rail = showColumn ? (
    <div
      ref={rootRef}
      style={{
        width: slotW,
        flexShrink: 0,
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        background: TRADE_COLORS.panel,
        borderRight: `1px solid ${TRADE_COLORS.border}`,
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "width 0.18s ease",
      }}
    >
      {slotExpanded ? (
        <MarketListBody
          {...listProps}
          variant="full"
          showHeader
          onCollapse={() => setExpanded(false)}
        />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 0",
              flexShrink: 0,
              borderBottom: `1px solid ${TRADE_COLORS.border}`,
            }}
          >
            <button
              type="button"
              aria-label="Expand markets"
              onClick={handleExpandToggle}
              style={iconBtnStyle}
            >
              <CollapseIcon expand />
            </button>
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {MARKET_LIST.map((item) => {
              const up = item.changePct >= 0;
              const selected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={`${item.symbol} · ${item.price}`}
                  onClick={() => {
                    setRailPreview(true);
                    onPickerOpenChange(true);
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      id: item.id,
                      x: rect.right + 6,
                      y: rect.top + rect.height / 2,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    width: "100%",
                    minHeight: getRowHeight(mode) + 8,
                    padding: "6px 4px",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: selected
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <TokenIcon item={item} size={20} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      lineHeight: "14px",
                      color: up ? TRADE_COLORS.green : TRADE_COLORS.red,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item.changePct >= 0 ? "+" : ""}
                    {item.changePct.toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  ) : null;

  const previewPanel = (
    <div
      style={{
        width: "100%",
        maxWidth: mode === "xs" ? "100%" : MARKET_PREVIEW_W,
        height: mode === "xs" ? "100%" : "min(72vh, 560px)",
        maxHeight: mode === "xs" ? "100%" : "min(72vh, 560px)",
        borderRadius: mode === "xs" ? 0 : 12,
        overflow: "hidden",
        border:
          mode === "xs" ? "none" : `1px solid ${TRADE_COLORS.border}`,
        boxShadow:
          mode === "xs" ? "none" : "0 16px 48px rgba(0,0,0,0.45)",
        background: TRADE_COLORS.panel,
      }}
    >
      <MarketListBody
        {...listProps}
        variant="full"
        showHeader
        title="Markets"
        onClose={() => {
          onPickerOpenChange(false);
          setRailPreview(false);
          if (!inlineOk) setExpanded(false);
        }}
      />
    </div>
  );

  const overlay =
    showOverlayPicker && typeof document !== "undefined"
      ? createPortal(
          mode === "xs" ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Markets"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 3500,
                display: "flex",
                flexDirection: "column",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
              onClick={() => {
                onPickerOpenChange(false);
                setRailPreview(false);
              }}
            >
              <div
                style={{
                  marginTop: 48,
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  background: TRADE_COLORS.panel,
                  borderRadius: "12px 12px 0 0",
                  overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {previewPanel}
              </div>
            </div>
          ) : (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Markets"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 3500,
                background: "transparent",
              }}
              onClick={() => {
                onPickerOpenChange(false);
                setRailPreview(false);
                if (!inlineOk) setExpanded(false);
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: showColumn
                    ? (rootRef.current?.getBoundingClientRect().right ??
                        MARKET_RAIL_W) + 4
                    : 12,
                  top: Math.max(
                    56,
                    rootRef.current?.getBoundingClientRect().top ?? 56,
                  ),
                  width: MARKET_PREVIEW_W,
                  maxWidth: "calc(100vw - 24px)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {previewPanel}
              </div>
            </div>
          ),
          document.body,
        )
      : null;

  const tip =
    tooltip && typeof document !== "undefined"
      ? createPortal(
          (() => {
            const item = MARKET_LIST.find((m) => m.id === tooltip.id);
            if (!item) return null;
            return (
              <div
                style={{
                  position: "fixed",
                  left: tooltip.x,
                  top: tooltip.y,
                  transform: "translateY(-50%)",
                  zIndex: 3600,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: "#1c1f26",
                  border: `1px solid ${TRADE_COLORS.border}`,
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                {item.symbol}
                <span
                  style={{
                    marginLeft: 8,
                    color: COLORS.white60,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {item.price}
                </span>
              </div>
            );
          })(),
          document.body,
        )
      : null;

  return (
    <>
      {rail}
      {overlay}
      {tip}
    </>
  );
}
