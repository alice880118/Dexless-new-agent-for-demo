import { createPortal } from "react-dom";
import { FONT, GRADIENTS } from "../nav/design-system";
import {
  DrawerDragHandle,
  DRAWER_PAD,
  DRAWER_SHELL,
  DRAWER_TITLE,
} from "../trade/MobileDrawerChrome";
import { FigmaRangeSlider } from "./FilterControls";

export type SignalFilterState = {
  sources: { titan: boolean; sage: boolean; vanguard: boolean };
  dirs: { long: boolean; short: boolean };
  scoreMin: number;
  rrMin: number;
  symbolQuery: string;
};

type Props = {
  open: boolean;
  draft: SignalFilterState;
  resultCount: number;
  onChange: (next: SignalFilterState) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
};

function SourceRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 40,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: FONT,
        color: "rgba(255,255,255,0.85)",
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {label}
      <img
        src={checked ? "/signal/select.svg" : "/signal/unselect.svg"}
        alt=""
        width={16}
        height={16}
        style={{
          display: "block",
          width: 16,
          height: 16,
          flexShrink: 0,
          marginLeft: 2,
        }}
      />
    </button>
  );
}

/** Mobile Signal filters bottom drawer — IA <768 */
export function SignalFiltersDrawer({
  open,
  draft,
  resultCount,
  onChange,
  onClear,
  onApply,
  onClose,
}: Props) {
  if (!open || typeof document === "undefined") return null;

  const set = (patch: Partial<SignalFilterState>) =>
    onChange({ ...draft, ...patch });

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <style>{`
        @keyframes signalFilterDrawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        style={{
          flex: 1,
          border: "none",
          background: "rgba(0,0,0,0.5)",
          cursor: "pointer",
          padding: 0,
        }}
      />
      <div
        role="dialog"
        aria-label="Filters"
        style={{
          ...DRAWER_SHELL,
          maxHeight: "min(92dvh, 720px)",
          display: "flex",
          flexDirection: "column",
          animation: "signalFilterDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <DrawerDragHandle />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 20px 12px",
            flexShrink: 0,
          }}
        >
          <span style={DRAWER_TITLE}>Filters</span>
          <button
            type="button"
            onClick={onClear}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT,
            }}
          >
            Clear all
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: DRAWER_PAD,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxSizing: "border-box",
          }}
        >
          <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT,
              }}
            >
              Symbol
            </span>
            <div
              style={{
                height: 40,
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 12px",
                boxSizing: "border-box",
              }}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.45)" />
                <path d="M9.5 9.5L12 12" stroke="rgba(255,255,255,0.45)" strokeLinecap="round" />
              </svg>
              <input
                value={draft.symbolQuery}
                onChange={(e) => set({ symbolQuery: e.target.value })}
                placeholder="Search symbol"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#fff",
                  fontSize: 13,
                  fontFamily: FONT,
                }}
              />
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT,
              }}
            >
              Signal Source
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <SourceRow
                label="Titan"
                checked={draft.sources.titan}
                onToggle={() =>
                  set({
                    sources: { ...draft.sources, titan: !draft.sources.titan },
                  })
                }
              />
              <SourceRow
                label="Sage"
                checked={draft.sources.sage}
                onToggle={() =>
                  set({
                    sources: { ...draft.sources, sage: !draft.sources.sage },
                  })
                }
              />
              <SourceRow
                label="Vanguard"
                checked={draft.sources.vanguard}
                onToggle={() =>
                  set({
                    sources: {
                      ...draft.sources,
                      vanguard: !draft.sources.vanguard,
                    },
                  })
                }
              />
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                fontFamily: FONT,
              }}
            >
              Direction
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {(
                [
                  { key: "long" as const, label: "Long" },
                  { key: "short" as const, label: "Short" },
                ] as const
              ).map((d) => {
                const on = draft.dirs[d.key];
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() =>
                      set({ dirs: { ...draft.dirs, [d.key]: !draft.dirs[d.key] } })
                    }
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 8,
                      border: on
                        ? "1px solid rgba(255,255,255,0.35)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: on
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                      color: on ? "#fff" : "rgba(255,255,255,0.5)",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: FONT,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                }}
              >
                Signal Score
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: FONT,
                }}
              >
                ≥ {draft.scoreMin}
              </span>
            </div>
            <FigmaRangeSlider
              min={0}
              max={100}
              step={1}
              value={draft.scoreMin}
              onChange={(scoreMin) => set({ scoreMin })}
              minLabel="0"
              maxLabel="100"
              fullWidth
            />
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: FONT,
                }}
              >
                R : R
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: FONT,
                }}
              >
                ≥ {draft.rrMin.toFixed(1)}
              </span>
            </div>
            <FigmaRangeSlider
              min={0}
              max={1.5}
              step={0.1}
              value={draft.rrMin}
              onChange={(rrMin) => set({ rrMin })}
              minLabel="0"
              maxLabel="1.5"
              fullWidth
            />
          </section>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <button
              type="button"
              onClick={onApply}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 10,
                border: "none",
                background: GRADIENTS.connectBtn,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT,
                cursor: "pointer",
              }}
            >
              Show {resultCount} Signals
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
