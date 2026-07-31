import { useEffect, useRef, useState, type CSSProperties } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { OPEN_ORDERS, POSITIONS, type PositionRow } from "./demoData";
import { TRADE_COLORS, type TradeLayoutMode } from "./tradeLayout";
import { TpSlDrawer } from "./TpSlDrawer";
import { TpSlManageDrawer } from "./TpSlManageDrawer";
import {
  bundleFromSubmit,
  formatTpSlCell,
  type RowTpSlState,
  type TpSlMode,
  type TpSlSubmitPayload,
} from "./tpSlTypes";

/** Horizontal drag-to-scroll without visible scrollbar */
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "button, a, input, select, textarea, label, [role='button']",
        )
      ) {
        return;
      }
      active = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      el.scrollLeft = startScroll - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (moved) {
        const blockClick = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
          el.removeEventListener("click", blockClick, true);
        };
        el.addEventListener("click", blockClick, true);
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);
  return ref;
}

type PositionsPanelProps = {
  mode: TradeLayoutMode;
  /** Bump to switch to Positions tab and scroll into view */
  focusKey?: number;
};

type Tab =
  | "positions"
  | "pending"
  | "tpsl"
  | "filled"
  | "posHistory"
  | "orderHistory"
  | "liquidation"
  | "assets";

const ICON = {
  sort: "/trade/positions/sort.svg",
  share: "/trade/positions/share.svg",
  chevronRight: "/trade/positions/chevron-right.svg",
  settings: "/trade/positions/settings.svg",
  selectCaret: "/trade/positions/select-caret.svg",
  pageLeft: "/trade/positions/page-chevron-left.svg",
  pageRight: "/trade/positions/page-chevron-right.svg",
} as const;

const COL_W = 130;
const CLOSE_COL_W = 80;
const LONG = "#46ccb9";
const SHORT = "#ff41a3";
const WHITE90 = "rgba(255,255,255,0.9)";
const WHITE40 = "rgba(255,255,255,0.4)";
const WHITE80 = "rgba(255,255,255,0.8)";
const PANEL_BG = "#121419";

export function PositionsPanel({ mode, focusKey = 0 }: PositionsPanelProps) {
  const [tab, setTab] = useState<Tab>("positions");
  const rootRef = useRef<HTMLDivElement>(null);
  const [hideOther, setHideOther] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowTpSl, setRowTpSl] = useState<Record<number, RowTpSlState>>({});
  const [activeRow, setActiveRow] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<TpSlMode>("partial");
  const [formInitial, setFormInitial] = useState<Partial<TpSlSubmitPayload> | null>(
    null,
  );
  const [editPartialId, setEditPartialId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const mobile = mode === "xs";

  useEffect(() => {
    if (!focusKey) return;
    setTab("positions");
    window.requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [focusKey]);

  const openAdd = (rowIndex: number, modeTab: TpSlMode) => {
    setActiveRow(rowIndex);
    setFormMode(modeTab);
    setFormInitial(null);
    setEditPartialId(null);
    setFormOpen(true);
  };

  const openManage = (rowIndex: number, modeTab: TpSlMode) => {
    setActiveRow(rowIndex);
    if (modeTab === "full") {
      const full = rowTpSl[rowIndex]?.full;
      setFormMode("full");
      setFormInitial(
        full
          ? {
              mode: "full",
              tpTrigger: full.tp?.trigger ?? "",
              tpOrder: full.tp?.order ?? "",
              tpPnl: full.tp?.pnl ?? "",
              tpLimit: Boolean(full.tp?.limit),
              slTrigger: full.sl?.trigger ?? "",
              slOrder: full.sl?.order ?? "",
              slPnl: full.sl?.pnl ?? "",
              slLimit: Boolean(full.sl?.limit),
            }
          : { mode: "full" },
      );
      setEditPartialId(null);
      setManageOpen(false);
      setFormOpen(true);
      return;
    }
    setManageOpen(true);
  };

  const handleSubmit = (payload: TpSlSubmitPayload) => {
    const qty =
      payload.quantity?.trim() ||
      POSITIONS[activeRow]?.size ||
      "0.00206";
    setRowTpSl((prev) => {
      const cur: RowTpSlState = prev[activeRow] ?? { partial: [] };
      if (payload.mode === "full") {
        return {
          ...prev,
          [activeRow]: {
            ...cur,
            full: bundleFromSubmit(payload, qty, cur.full?.id),
          },
        };
      }
      if (editPartialId) {
        return {
          ...prev,
          [activeRow]: {
            ...cur,
            partial: cur.partial.map((p) =>
              p.id === editPartialId
                ? bundleFromSubmit(payload, qty, editPartialId)
                : p,
            ),
          },
        };
      }
      return {
        ...prev,
        [activeRow]: {
          ...cur,
          partial: [...cur.partial, bundleFromSubmit(payload, qty)],
        },
      };
    });
    setFormOpen(false);
    setEditPartialId(null);
    setFormInitial(null);
  };

  const desktopTabs: { id: Tab; label: string }[] = [
    { id: "positions", label: `Positions(${POSITIONS.length})` },
    { id: "pending", label: "Pending" },
    { id: "tpsl", label: "TP/SL" },
    { id: "filled", label: "Filled" },
    { id: "posHistory", label: "Position history" },
    { id: "orderHistory", label: "Order history" },
    { id: "liquidation", label: "Liquidation" },
    { id: "assets", label: "Assets" },
  ];

  const mobileTabs: { id: Tab; label: string }[] = [
    { id: "positions", label: `Positions (${POSITIONS.length})` },
    { id: "pending", label: "Pending" },
    { id: "tpsl", label: "TP/SL" },
    { id: "orderHistory", label: "History" },
    { id: "liquidation", label: "Liquidation" },
  ];

  const tabs = mobile ? mobileTabs : desktopTabs;

  return (
    <div
      ref={rootRef}
      data-trade-positions
      style={{
        width: "100%",
        flex: mobile ? undefined : 1,
        flexShrink: mobile ? 0 : 1,
        height: mobile ? undefined : "100%",
        minHeight: mobile ? undefined : 0,
        maxHeight: mobile ? undefined : "100%",
        background: mobile ? TRADE_COLORS.panel : PANEL_BG,
        borderRadius: mobile ? 0 : 4,
        border: "none",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: mobile ? "visible" : "hidden",
        fontFamily: FONT,
      }}
    >
      {mobile ? (
        <MobileTabBar tabs={tabs} tab={tab} onTab={setTab} />
      ) : (
        <DesktopTabBar
          tabs={tabs}
          tab={tab}
          onTab={setTab}
          hideOther={hideOther}
          onHideOther={setHideOther}
        />
      )}

      <div
        style={{
          flex: mobile ? "none" : 1,
          minHeight: 0,
          overflow: mobile ? "visible" : "hidden",
          display: "flex",
          flexDirection: "column",
          padding: mobile ? 0 : 0,
          boxSizing: "border-box",
          background: mobile ? TRADE_COLORS.panel : PANEL_BG,
        }}
      >
        {tab === "positions" && mobile && (
          <MobilePositionCards
            rowTpSl={rowTpSl}
            onAddTpSl={openAdd}
            onEditTpSl={openManage}
          />
        )}
        {tab === "positions" && !mobile && (
          <DesktopPositionsTable
            page={page}
            rowsPerPage={rowsPerPage}
            onPage={setPage}
            onRowsPerPage={setRowsPerPage}
            rowTpSl={rowTpSl}
            onAddTpSl={openAdd}
            onEditTpSl={openManage}
          />
        )}

        {tab === "pending" &&
          (mobile ? (
            <EmptyHint text="No pending orders" />
          ) : (
            <DesktopPendingTable />
          ))}

        {(tab === "tpsl" ||
          tab === "filled" ||
          tab === "posHistory" ||
          tab === "orderHistory" ||
          tab === "liquidation" ||
          tab === "assets") && (
          <EmptyHint
            text={
              tab === "tpsl"
                ? "No TP/SL orders"
                : tab === "filled"
                  ? "No filled orders"
                  : tab === "posHistory"
                    ? "No position history"
                    : tab === "orderHistory"
                      ? "No order history"
                      : tab === "liquidation"
                        ? "No liquidations"
                        : "No assets"
            }
          />
        )}
      </div>

      <TpSlDrawer
        open={formOpen}
        variant="position"
        initialSide={
          POSITIONS[activeRow]?.side === "Short" ? "sell" : "buy"
        }
        initialMode={formMode}
        initialValues={formInitial}
        onBack={
          formMode === "partial" && manageOpen
            ? () => setFormOpen(false)
            : formMode === "full"
              ? () => setFormOpen(false)
              : undefined
        }
        onSubmit={handleSubmit}
        onClose={() => {
          setFormOpen(false);
          setEditPartialId(null);
          setFormInitial(null);
        }}
      />

      <TpSlManageDrawer
        open={manageOpen}
        initialTab="partial"
        state={rowTpSl[activeRow] ?? { partial: [] }}
        onClose={() => setManageOpen(false)}
        onAddNew={() => {
          setFormMode("partial");
          setFormInitial(null);
          setEditPartialId(null);
          setFormOpen(true);
        }}
        onEditPartial={(id) => {
          const entry = (rowTpSl[activeRow]?.partial ?? []).find(
            (p) => p.id === id,
          );
          if (!entry) return;
          setEditPartialId(id);
          setFormMode("partial");
          setFormInitial({
            mode: "partial",
            quantity: entry.quantity,
            tpTrigger: entry.tp?.trigger ?? "",
            tpOrder: entry.tp?.order ?? "",
            tpPnl: entry.tp?.pnl ?? "",
            tpLimit: Boolean(entry.tp?.limit),
            slTrigger: entry.sl?.trigger ?? "",
            slOrder: entry.sl?.order ?? "",
            slPnl: entry.sl?.pnl ?? "",
            slLimit: Boolean(entry.sl?.limit),
          });
          setFormOpen(true);
        }}
        onDeletePartial={(id) => {
          setRowTpSl((prev) => {
            const cur = prev[activeRow] ?? { partial: [] };
            return {
              ...prev,
              [activeRow]: {
                ...cur,
                partial: cur.partial.filter((p) => p.id !== id),
              },
            };
          });
        }}
        onCancelAll={() => {
          setRowTpSl((prev) => {
            const cur = prev[activeRow] ?? { partial: [] };
            return {
              ...prev,
              [activeRow]: { ...cur, partial: [] },
            };
          });
        }}
        onOpenFull={() => {
          setManageOpen(false);
          openManage(activeRow, "full");
        }}
      />
    </div>
  );
}

function DesktopTabBar({
  tabs,
  tab,
  onTab,
  hideOther,
  onHideOther,
}: {
  tabs: { id: Tab; label: string }[];
  tab: Tab;
  onTab: (t: Tab) => void;
  hideOther: boolean;
  onHideOther: (v: boolean) => void;
}) {
  const tabsRef = useDragScroll<HTMLDivElement>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "10px 20px 0",
        flexShrink: 0,
        background: PANEL_BG,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 24,
          gap: 12,
        }}
      >
        <div
          ref={tabsRef}
          className="trade-drag-scroll"
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            overflowX: "auto",
            minWidth: 0,
            flex: 1,
            cursor: "grab",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTab(t.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "0 0 10px",
                  marginBottom: -11,
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontSize: 12,
                  lineHeight: "20px",
                  fontWeight: active ? 700 : 500,
                  color: active ? WHITE90 : WHITE40,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  borderBottom: active
                    ? `2px solid ${WHITE90}`
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
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: hideOther
                  ? "none"
                  : "1.5px solid rgba(255,255,255,0.35)",
                background: hideOther ? "#DBFD5C" : "transparent",
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {hideOther ? (
                <svg width="9" height="7" viewBox="0 0 10 8" fill="none" aria-hidden>
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </span>
            <input
              type="checkbox"
              checked={hideOther}
              onChange={(e) => onHideOther(e.target.checked)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              Hide other symbols
            </span>
          </label>
          <button
            type="button"
            aria-label="Settings"
            style={{
              border: "none",
              background: "transparent",
              width: 32,
              height: 25,
              padding: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={ICON.settings}
              alt=""
              width={32}
              height={25}
              style={{ display: "block", width: 32, height: 25 }}
            />
          </button>
        </div>
      </div>

      <div
        style={{
          height: 1,
          width: "100%",
          background: "rgba(227,231,234,0.1)",
        }}
      />
    </div>
  );
}

function MobileTabBar({
  tabs,
  tab,
  onTab,
}: {
  tabs: { id: Tab; label: string }[];
  tab: Tab;
  onTab: (t: Tab) => void;
}) {
  const tabsRef = useDragScroll<HTMLDivElement>();
  return (
    <div
      ref={tabsRef}
      className="trade-drag-scroll trade-mobile-scroll"
      style={{
        display: "flex",
        gap: 12,
        padding: "8px 12px 0",
        flexShrink: 0,
        overflowX: "auto",
        cursor: "grab",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            style={{
              border: "none",
              background: "transparent",
              padding: "0 0 8px",
              cursor: "pointer",
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: active ? 600 : 500,
              color: active ? "#ffffff" : COLORS.white50,
              borderBottom: active
                ? "2px solid #ffffff"
                : "2px solid transparent",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function DesktopPositionsTable({
  page,
  rowsPerPage,
  onPage,
  onRowsPerPage,
  rowTpSl,
  onAddTpSl,
  onEditTpSl,
}: {
  page: number;
  rowsPerPage: number;
  onPage: (p: number) => void;
  onRowsPerPage: (n: number) => void;
  rowTpSl: Record<number, RowTpSlState>;
  onAddTpSl: (rowIndex: number, mode: TpSlMode) => void;
  onEditTpSl: (rowIndex: number, mode: TpSlMode) => void;
}) {
  const totalPages = Math.max(2, Math.ceil(Math.max(POSITIONS.length, 1) / rowsPerPage));
  const rows = page === 1 ? POSITIONS.slice(0, rowsPerPage) : [];
  const scrollRef = useDragScroll<HTMLDivElement>();

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          padding: "0 20px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          ref={scrollRef}
          className="trade-drag-scroll"
          style={{
            overflowX: "auto",
            overflowY: "auto",
            height: "100%",
            paddingRight: CLOSE_COL_W,
            boxSizing: "border-box",
            cursor: "grab",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ minWidth: COL_W * 9 }}>
            <HeaderRow />
            <div
              style={{
                height: 1,
                background: "rgba(227,231,234,0.05)",
              }}
            />
            {rows.map((p, i) => (
              <PositionRowView
                key={`${p.market}-${p.side}-${i}`}
                row={p}
                rowIndex={i}
                tpSl={rowTpSl[i]}
                onAddTpSl={onAddTpSl}
                onEditTpSl={onEditTpSl}
              />
            ))}
          </div>
        </div>

        <CloseColumn rows={rows} />
      </div>

      <div
        style={{
          flexShrink: 0,
          width: "100%",
          padding: "0 20px",
          boxSizing: "border-box",
          background: PANEL_BG,
        }}
      >
        <PaginationBar
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPage={onPage}
          onRowsPerPage={onRowsPerPage}
        />
      </div>
    </div>
  );
}

function HeaderRow() {
  const headers: { label: string; sort?: boolean }[] = [
    { label: "Symbol", sort: true },
    { label: "Quantity", sort: true },
    { label: "Avg. open", sort: true },
    { label: "Mark price", sort: true },
    { label: "Liq. price", sort: true },
    { label: "Unrealized PnL", sort: true },
    { label: "Full TP/SL" },
    { label: "Partial TP/SL" },
    { label: "Notional", sort: true },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        paddingRight: 27,
        boxSizing: "border-box",
      }}
    >
      {headers.map((h) => (
        <div
          key={h.label}
          style={{
            width: COL_W,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: WHITE40,
              whiteSpace: "nowrap",
            }}
          >
            {h.label}
          </span>
          {h.sort ? (
            <img
              src={ICON.sort}
              alt=""
              width={12}
              height={12}
              style={{ display: "block", width: 12, height: 12 }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function TpSlCell({
  label,
  mode,
  rowIndex,
  tpSl,
  onAddTpSl,
  onEditTpSl,
  alignEnd,
}: {
  label?: string;
  mode: TpSlMode;
  rowIndex: number;
  tpSl?: RowTpSlState;
  onAddTpSl: (rowIndex: number, mode: TpSlMode) => void;
  onEditTpSl: (rowIndex: number, mode: TpSlMode) => void;
  alignEnd?: boolean;
}) {
  const bundle =
    mode === "full" ? tpSl?.full : tpSl?.partial?.[0] ?? undefined;
  const text = formatTpSlCell(bundle);

  if (!text) {
    return (
      <button
        type="button"
        onClick={() => onAddTpSl(rowIndex, mode)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 700,
          color: WHITE90,
          textAlign: alignEnd ? "right" : "left",
        }}
      >
        {label ?? "Add"}
      </button>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        maxWidth: "100%",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "-0.36px",
          color: WHITE90,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </span>
      <button
        type="button"
        aria-label={`Edit ${mode} TP/SL`}
        onClick={() => onEditTpSl(rowIndex, mode)}
        style={{
          width: 14,
          height: 14,
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          display: "inline-flex",
          flexShrink: 0,
        }}
      >
        <img
          src="/trade/tpsl/edit.svg"
          alt=""
          width={14}
          height={14}
          style={{ display: "block", width: 14, height: 14 }}
        />
      </button>
    </div>
  );
}

function PositionRowView({
  row,
  rowIndex,
  tpSl,
  onAddTpSl,
  onEditTpSl,
}: {
  row: PositionRow;
  rowIndex: number;
  tpSl?: RowTpSlState;
  onAddTpSl: (rowIndex: number, mode: TpSlMode) => void;
  onEditTpSl: (rowIndex: number, mode: TpSlMode) => void;
}) {
  const isLong = row.side === "Long";
  const sideColor = isLong ? LONG : SHORT;
  const barBg = isLong
    ? "linear-gradient(180deg, #46ccb9 32.213%, #00e49c 100%)"
    : "linear-gradient(0deg, #f34ea3 0.294%, #cc55bc 99.706%)";

  const cellNum: CSSProperties = {
    width: COL_W,
    flexShrink: 0,
    height: 36,
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "-0.36px",
    color: WHITE90,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        paddingRight: 27,
        borderBottom: "1px solid rgba(227,231,234,0.05)",
        boxSizing: "border-box",
        opacity: row.dimmed ? 0.5 : 1,
      }}
    >
      <div
        style={{
          width: COL_W,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 3,
            height: 36,
            flexShrink: 0,
            background: barBg,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: WHITE90,
              whiteSpace: "nowrap",
            }}
          >
            {row.market}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 3,
              padding: "2px 4px",
              alignSelf: "flex-start",
              height: 16,
              boxSizing: "border-box",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                lineHeight: "12px",
                color: WHITE40,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {row.marginMode} {row.leverage}
            </span>
            <img
              src={ICON.chevronRight}
              alt=""
              width={3}
              height={7}
              style={{
                display: "block",
                width: 3,
                height: 7,
                flexShrink: 0,
                objectFit: "contain",
              }}
            />
          </span>
        </div>
      </div>

      <div style={{ ...cellNum, color: sideColor }}>{row.size}</div>
      <div style={cellNum}>{row.entry}</div>
      <div style={cellNum}>{row.mark}</div>
      <div style={cellNum}>{row.liq}</div>

      <div
        style={{
          width: COL_W,
          flexShrink: 0,
          height: 36,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "-0.36px",
            color: sideColor,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {row.pnl} ({row.pnlPct})
        </span>
        <button
          type="button"
          aria-label="Share"
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            width: 14,
            height: 14,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={ICON.share}
            alt=""
            width={14}
            height={14}
            style={{ display: "block", width: 14, height: 14 }}
          />
        </button>
      </div>

      <div style={cellNum}>
        <TpSlCell
          mode="full"
          rowIndex={rowIndex}
          tpSl={tpSl}
          onAddTpSl={onAddTpSl}
          onEditTpSl={onEditTpSl}
        />
      </div>
      <div style={cellNum}>
        <TpSlCell
          mode="partial"
          rowIndex={rowIndex}
          tpSl={tpSl}
          onAddTpSl={onAddTpSl}
          onEditTpSl={onEditTpSl}
        />
      </div>
      <div style={cellNum}>{row.notional}</div>
    </div>
  );
}

function CloseColumn({ rows }: { rows: PositionRow[] }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: CLOSE_COL_W + 69,
        height: 40 + rows.length * 44,
        maxHeight: "100%",
        pointerEvents: "none",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          width: 69,
          height: 40 + Math.min(rows.length, 3) * 44,
          background:
            "linear-gradient(90deg, rgba(19,21,25,0) 4.7%, #131519 66.1%)",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: CLOSE_COL_W,
          background: "#131519",
          display: "flex",
          flexDirection: "column",
          pointerEvents: "auto",
        }}
      >
        <div style={{ height: 40, flexShrink: 0 }} />
        {rows.map((p, i) => (
          <div
            key={`${p.market}-close-${i}`}
            style={{
              height: 44,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              boxSizing: "border-box",
            }}
          >
            <button
              type="button"
              style={{
                width: 64,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 50,
                background: "transparent",
                padding: 4,
                cursor: "pointer",
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 600,
                lineHeight: "16px",
                color: "rgba(255,255,255,0.6)",
                whiteSpace: "nowrap",
              }}
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  rowsPerPage,
  onPage,
  onRowsPerPage,
}: {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPage: (p: number) => void;
  onRowsPerPage: (n: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 0",
        boxSizing: "border-box",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "20px",
            letterSpacing: "0.12px",
            color: WHITE80,
          }}
        >
          Rows per page
        </span>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            height: 24,
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "-0.36px",
              color: WHITE80,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {rowsPerPage}
          </span>
          <img
            src={ICON.selectCaret}
            alt=""
            width={7}
            height={5}
            style={{ display: "block", width: 7, height: 5 }}
          />
          <select
            value={rowsPerPage}
            onChange={(e) => {
              onRowsPerPage(Number(e.target.value));
              onPage(1);
            }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              width: "100%",
            }}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
          flexShrink: 0,
          marginLeft: "auto",
        }}
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(Math.max(1, page - 1))}
          style={{
            border: "none",
            background: "transparent",
            height: 24,
            width: 24,
            padding: 0,
            borderRadius: 4,
            cursor: page <= 1 ? "default" : "pointer",
            opacity: page <= 1 ? 0.4 : 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={ICON.pageLeft}
            alt=""
            width={16}
            height={16}
            style={{ display: "block", width: 16, height: 16 }}
          />
        </button>
        {pages.map((p) => {
          const active = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              style={{
                border: "none",
                width: 24,
                height: 24,
                borderRadius: 4,
                cursor: "pointer",
                background: active
                  ? "rgba(201,189,255,0.3)"
                  : "transparent",
                color: active ? "#ffffff" : COLORS.white50,
                fontFamily: FONT,
                fontSize: 12,
                lineHeight: "24px",
                padding: 0,
              }}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          style={{
            border: "none",
            background: "transparent",
            height: 24,
            width: 24,
            padding: 0,
            borderRadius: 4,
            cursor: page >= totalPages ? "default" : "pointer",
            opacity: page >= totalPages ? 0.4 : 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={ICON.pageRight}
            alt=""
            width={16}
            height={16}
            style={{ display: "block", width: 16, height: 16 }}
          />
        </button>
      </div>
    </div>
  );
}

function DesktopPendingTable() {
  return (
    <div style={{ padding: "0 20px", overflow: "auto", flex: 1, minHeight: 0 }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <thead>
          <tr style={{ color: WHITE40, fontWeight: 500, textAlign: "left" }}>
            <Th>Market</Th>
            <Th>Side</Th>
            <Th>Type</Th>
            <Th>Price</Th>
            <Th>Size</Th>
            <Th>Filled</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {OPEN_ORDERS.map((o) => (
            <tr key={`${o.market}-${o.price}`} style={{ height: 44 }}>
              <Td>{o.market}</Td>
              <Td color={o.side === "Buy" ? LONG : SHORT}>{o.side}</Td>
              <Td>{o.type}</Td>
              <Td>{o.price}</Td>
              <Td>{o.size}</Td>
              <Td>{o.filled}</Td>
              <Td>{o.status}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 24,
        textAlign: "center",
        fontSize: 12,
        color: COLORS.white40,
      }}
    >
      {text}
    </div>
  );
}

function MobilePositionCards({
  rowTpSl,
  onAddTpSl,
  onEditTpSl,
}: {
  rowTpSl: Record<number, RowTpSlState>;
  onAddTpSl: (rowIndex: number, mode: TpSlMode) => void;
  onEditTpSl: (rowIndex: number, mode: TpSlMode) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 12, color: COLORS.white50 }}>
            Unrealized PnL (USDT)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: SHORT,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              -9.78
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#cd1b77",
                background: "rgba(255,65,163,0.1)",
                padding: "2px 4px",
                borderRadius: 4,
              }}
            >
              -326.68%
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: COLORS.white50 }}>Notional</div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: WHITE90,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            50.46
          </div>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: COLORS.white50,
            width: "100%",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              border: "none",
              background: "#DBFD5C",
              boxSizing: "border-box",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="9" height="7" viewBox="0 0 10 8" fill="none" aria-hidden>
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="checkbox"
            defaultChecked
            style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          />
          Hide other symbols
        </label>
      </div>

      {POSITIONS.map((p, i) => (
        <div
          key={`${p.market}-${p.side}-${i}`}
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            opacity: p.dimmed ? 0.5 : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: WHITE90 }}>
                {p.market}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: p.side === "Long" ? LONG : SHORT,
                    background:
                      p.side === "Long"
                        ? "rgba(70,204,185,0.1)"
                        : "rgba(255,65,163,0.1)",
                    padding: "0 4px",
                    borderRadius: 4,
                  }}
                >
                  {p.side}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.white40,
                    background: "rgba(255,255,255,0.05)",
                    padding: "0 4px",
                    borderRadius: 4,
                  }}
                >
                  {p.leverage}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: COLORS.white50 }}>
                Unrealized PnL (USDT)
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: p.pnlPositive ? LONG : SHORT,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {p.pnl}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              fontSize: 12,
            }}
          >
            <Metric label="Qty" value={p.size} />
            <Metric label="Margin(USDC)" value={p.margin} />
            <Metric label="Notional(USDC)" value={p.notional} align="right" />
            <Metric label="Avg. open" value={p.entry} />
            <Metric label="Mark price" value={p.mark} />
            <Metric label="Liq. price" value={p.liq} align="right" />
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 12, color: COLORS.white50 }}>Full TP/SL</span>
              <TpSlCell
                label="Add"
                mode="full"
                rowIndex={i}
                tpSl={rowTpSl[i]}
                onAddTpSl={onAddTpSl}
                onEditTpSl={onEditTpSl}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "flex-end",
              }}
            >
              <span style={{ fontSize: 12, color: COLORS.white50 }}>
                Partial TP/SL
              </span>
              <TpSlCell
                label="Add"
                mode="partial"
                rowIndex={i}
                tpSl={rowTpSl[i]}
                onAddTpSl={onAddTpSl}
                onEditTpSl={onEditTpSl}
                alignEnd
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" style={closeBtnStyle}>
              Limit close
            </button>
            <button type="button" style={closeBtnStyle}>
              Market close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string;
  align?: "left" | "right";
}) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontSize: 12, color: COLORS.white50, marginBottom: 2 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: WHITE90,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const closeBtnStyle: CSSProperties = {
  flex: 1,
  border: "none",
  background: "rgba(255,255,255,0.1)",
  borderRadius: 6,
  padding: "6px 16px",
  cursor: "pointer",
  fontFamily: FONT,
  fontSize: 11,
  fontWeight: 500,
  color: "rgba(255,255,255,0.6)",
};

function Th({ children }: { children: string }) {
  return (
    <th
      style={{
        padding: "6px 12px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        position: "sticky",
        top: 0,
        background: PANEL_BG,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  color,
}: {
  children: string;
  color?: string;
}) {
  return (
    <td
      style={{
        padding: "4px 12px",
        color: color ?? "rgba(255,255,255,0.85)",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}
