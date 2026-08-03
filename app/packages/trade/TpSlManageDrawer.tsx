import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { DrawerDragHandle } from "./MobileDrawerChrome";
import type { PnlFieldMode } from "./PnlModeField";
import {
  TPSL_PNL_MODES,
  TpSlSettingsPicker,
  type TpSlInputMode,
} from "./TpSlSettingsPicker";
import type { RowTpSlState, TpSlBundle, TpSlMode } from "./tpSlTypes";

type TpSlManageDrawerProps = {
  open: boolean;
  onClose: () => void;
  initialTab?: TpSlMode;
  state: RowTpSlState;
  onAddNew: () => void;
  onEditPartial: (id: string) => void;
  onDeletePartial: (id: string) => void;
  onCancelAll: () => void;
  onOpenFull: () => void;
};

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

const TP_BADGE = "#1be9a8";
const SL_BADGE = "#ff41a3";

/** Partial overview / Full entry — Figma 7427:53988 / 7427:54711 */
export function TpSlManageDrawer({
  open,
  onClose,
  initialTab = "partial",
  state,
  onAddNew,
  onEditPartial,
  onDeletePartial,
  onCancelAll,
  onOpenFull,
}: TpSlManageDrawerProps) {
  const isMobile = useBreakpoint() === "390";
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<TpSlMode>(initialTab);
  const [estMode, setEstMode] = useState<PnlFieldMode>("pnl");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTab(initialTab);
    setEstMode("pnl");
  }, [open, initialTab]);

  if (!open || !mounted || typeof document === "undefined") return null;

  const content = (
    <div
      style={{
        ...shellBase,
        borderRadius: isMobile ? "4px 4px 0 0" : 8,
        border: "none",
        maxWidth: isMobile ? undefined : 420,
        maxHeight: isMobile
          ? "min(90dvh, 90vh)"
          : "min(720px, 92dvh, 92vh)",
        paddingBottom: isMobile
          ? "calc(16px + env(safe-area-inset-bottom, 0px))"
          : 0,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {isMobile ? <DrawerDragHandle /> : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: isMobile ? "0 20px 0" : "20px 20px 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            height: 24,
          }}
        >
          <button
            type="button"
            aria-label="Back"
            onClick={onClose}
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
          <span
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "20px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Take Profit / Stop Profit
          </span>
        </div>

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
                letterSpacing: "0.16px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              ETH-PERP
            </span>
            <span
              style={{
                background: "rgba(70,204,185,0.1)",
                borderRadius: 4,
                padding: "1px 10px",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(70,204,185,0.8)",
              }}
            >
              Long
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 4,
                padding: "1px 10px",
                fontSize: 12,
                fontWeight: 600,
                color: COLORS.white50,
              }}
            >
              10X
            </span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <InfoRow label="Quantity" value="0.00206" />
              <InfoRow label="Order price" value="62,522.6" />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <InfoRow label="Last price" value="62,509.0" />
              <InfoRow label="Mark price" value="62,515.4" />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "12px 20px 0",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          flexShrink: 0,
        }}
      >
        {(
          [
            { id: "partial" as const, label: "Partial position" },
            { id: "full" as const, label: "Full position" },
          ]
        ).map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                if (t.id === "full") {
                  onOpenFull();
                  return;
                }
                setTab(t.id);
              }}
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

      {tab === "partial" ? (
        <div
          className="trade-drag-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "16px 20px 20px",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={onAddNew}
              style={{
                height: 28,
                padding: "0 16px",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
                backgroundImage: GRADIENTS.connectBtn,
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              Add new
            </button>
            <button
              type="button"
              onClick={onCancelAll}
              style={{
                height: 28,
                padding: "0 16px",
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
                background: "rgba(255,255,255,0.2)",
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Cancel all
            </button>
          </div>

          {state.partial.length === 0 ? (
            <div
              style={{
                padding: "24px 0",
                textAlign: "center",
                color: COLORS.white50,
                fontSize: 12,
              }}
            >
              No partial TP/SL yet
            </div>
          ) : (
            state.partial.map((entry, i) => (
              <div key={entry.id}>
                {i > 0 ? (
                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.1)",
                      margin: "16px 0",
                    }}
                  />
                ) : null}
                <PartialCard
                  entry={entry}
                  estMode={estMode}
                  onEstModeChange={setEstMode}
                  onEdit={() => onEditPartial(entry.id)}
                  onDelete={() => onDeletePartial(entry.id)}
                />
              </div>
            ))
          )}
        </div>
      ) : null}
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
        zIndex: 4300,
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
          @keyframes tpSlManageIn {
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
        .trade-drag-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? undefined : 420,
          animation: isMobile
            ? "tpSlManageIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
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
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#ffffff",
          letterSpacing: "-0.36px",
          fontVariantNumeric: "tabular-nums",
          minWidth: 75,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Badge({ kind }: { kind: "TP" | "SL" }) {
  const isTp = kind === "TP";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 31,
        minWidth: 31,
        height: 18,
        padding: 0,
        boxSizing: "border-box",
        borderRadius: 4,
        background: isTp ? "rgba(27,233,168,0.2)" : "rgba(255,65,163,0.2)",
        color: isTp ? TP_BADGE : SL_BADGE,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.36px",
        lineHeight: "18px",
        textAlign: "center",
        alignSelf: "flex-start",
        flexShrink: 0,
      }}
    >
      {kind}
    </span>
  );
}

function Metric({
  label,
  value,
  unit,
  valueColor,
}: {
  label: string;
  value: string;
  unit?: string;
  valueColor?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "16px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "18px",
            color: valueColor ?? "rgba(255,255,255,0.9)",
          }}
        >
          {value}
        </span>
        {unit ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {unit}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function estLabel(mode: PnlFieldMode): string {
  if (mode === "offset") return "Est.Offset";
  if (mode === "offset_pct") return "Est.Offset %";
  return "Est.PnL";
}

function EstModeMetric({
  mode,
  onModeChange,
  value,
  valueColor,
}: {
  mode: PnlFieldMode;
  onModeChange: (m: PnlFieldMode) => void;
  value: string;
  valueColor?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "flex-end",
      }}
    >
      <button
        type="button"
        aria-label="Select estimate mode"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "16px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {estLabel(mode)}
        <img
          src="/trade/order/unit-caret.svg"
          alt=""
          width={12}
          height={12}
          style={{ display: "block", width: 12, height: 12 }}
        />
      </button>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          lineHeight: "18px",
          color: valueColor ?? "rgba(255,255,255,0.9)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <TpSlSettingsPicker
        open={open}
        value={mode}
        modes={TPSL_PNL_MODES}
        zIndex={5500}
        onSelect={(id: TpSlInputMode) => {
          if (id === "price") return;
          onModeChange(id);
        }}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

function LegBlock({
  kind,
  trigger,
  order,
  pnl,
  estMode,
  onEstModeChange,
}: {
  kind: "TP" | "SL";
  trigger?: string;
  order?: string;
  pnl?: string;
  estMode: PnlFieldMode;
  onEstModeChange: (m: PnlFieldMode) => void;
}) {
  if (!trigger) return null;
  const isTp = kind === "TP";
  const orderLabel = order && order.length > 0 ? order : "Market";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Badge kind={kind} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <Metric
          label="Trigger price (Market)"
          value={trigger}
          unit="USDC"
        />
        <Metric label="Order price" value={orderLabel} />
        <EstModeMetric
          mode={estMode}
          onModeChange={onEstModeChange}
          value={pnl || "--"}
          valueColor={isTp ? TP_BADGE : SL_BADGE}
        />
      </div>
    </div>
  );
}

function PartialCard({
  entry,
  estMode,
  onEstModeChange,
  onEdit,
  onDelete,
}: {
  entry: TpSlBundle;
  estMode: PnlFieldMode;
  onEstModeChange: (m: PnlFieldMode) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Quantity
        </span>
        <span style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {entry.quantity}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            ETH
          </span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <LegBlock
          kind="TP"
          trigger={entry.tp?.trigger}
          order={entry.tp?.order}
          pnl={entry.tp?.pnl}
          estMode={estMode}
          onEstModeChange={onEstModeChange}
        />
        <LegBlock
          kind="SL"
          trigger={entry.sl?.trigger}
          order={entry.sl?.order}
          pnl={entry.sl?.pnl}
          estMode={estMode}
          onEstModeChange={onEstModeChange}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onEdit}
          style={{
            flex: 1,
            height: 28,
            border: "none",
            borderRadius: 6,
            background: "rgba(255,255,255,0.1)",
            cursor: "pointer",
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          style={{
            flex: 1,
            height: 28,
            border: "none",
            borderRadius: 6,
            background: "rgba(255,255,255,0.1)",
            cursor: "pointer",
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
