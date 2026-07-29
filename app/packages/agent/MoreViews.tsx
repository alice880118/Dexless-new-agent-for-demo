import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { FONT, GRADIENTS } from "../nav/design-system";

const ASSETS = {
  search: "/trader-dna/more/search.svg",
  clear: "/trader-dna/more/clear.svg",
  moreDots: "/trader-dna/more/more-dots.svg",
  chevron: "/trader-dna/more/chevron-right.svg",
} as const;

const SWIPE_DELETE_W = 72;

type ConversationItem = {
  id: string;
  title: string;
  time: string;
  group: "Today" | "Yesterday" | "May 20";
  active?: boolean;
};

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: "c1",
    title: "I want to long BTC with 20U",
    time: "May 22, 16:00",
    group: "Today",
    active: true,
  },
  {
    id: "c2",
    title: "ETH Breakout Analysis",
    time: "May 22 · 14:18",
    group: "Today",
  },
  {
    id: "c3",
    title: "Portfolio Emotional Review",
    time: "May 21 · 09:12",
    group: "Yesterday",
  },
  {
    id: "c4",
    title: "Market Thesis - ETH",
    time: "May 21 · 20:44",
    group: "Yesterday",
  },
  {
    id: "c5",
    title: "SOL Risk Review",
    time: "May 21 · 21:17",
    group: "Yesterday",
  },
  {
    id: "c6",
    title: "Trade Journal - BTC",
    time: "May 20 · 10:15",
    group: "May 20",
  },
];

const GROUP_ORDER: ConversationItem["group"][] = [
  "Today",
  "Yesterday",
  "May 20",
];

const slideIn: CSSProperties = {
  animation: "moreMoveIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
};

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

function ConversationBody({
  row,
}: {
  row: ConversationItem;
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.8)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {row.title}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {row.time}
      </div>
    </div>
  );
}

function SwipeDeleteRow({
  row,
  open,
  onOpen,
  onClose,
  onDelete,
}: {
  row: ConversationItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const baseOffset = useRef(0);
  const axis = useRef<"x" | "y" | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    setOffset(open ? -SWIPE_DELETE_W : 0);
  }, [open]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    baseOffset.current = open ? -SWIPE_DELETE_W : 0;
    axis.current = null;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (axis.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (axis.current !== "x") return;
    e.preventDefault();
    const next = Math.min(0, Math.max(-SWIPE_DELETE_W, baseOffset.current + dx));
    setOffset(next);
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (axis.current === "x") {
      if (offset < -SWIPE_DELETE_W / 2) {
        setOffset(-SWIPE_DELETE_W);
        onOpen();
      } else {
        setOffset(0);
        onClose();
      }
    }
    axis.current = null;
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={onDelete}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: SWIPE_DELETE_W,
          margin: 0,
          padding: 0,
          border: "none",
          background: "#ff41a3",
          color: "#ffffff",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: FONT,
          cursor: "pointer",
        }}
      >
        Delete
      </button>
      <div
        data-chat-hit="swipe-row"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 6,
          minHeight: 60,
          padding: 12,
          boxSizing: "border-box",
          background: "#1b1b1b",
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? "none" : "transform 180ms ease",
          touchAction: "pan-y",
          cursor: "grab",
        }}
      >
        <ConversationBody row={row} />
        {row.active && (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 8,
              border: "1px solid #00ffab",
              color: "#00ffab",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              flexShrink: 0,
            }}
          >
            Active
          </span>
        )}
      </div>
    </div>
  );
}

export function MoreView({
  onRename,
}: {
  onRename: () => void;
}) {
  const isNarrow = useIsNarrow();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searching, setSearching] = useState(false);
  const [items, setItems] = useState(INITIAL_CONVERSATIONS);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [swipeId, setSwipeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setDebounced("");
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = window.setTimeout(() => {
      setDebounced(query.trim());
      setSearching(false);
    }, 320);
    return () => window.clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debounced) return items;
    const q = debounced.toLowerCase();
    return items.filter((c) => c.title.toLowerCase().includes(q));
  }, [items, debounced]);

  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      rows: filtered.filter((c) => c.group === group),
    })).filter((g) => g.rows.length > 0);
  }, [filtered]);

  const deleteConversation = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
    setMenuId(null);
    setSwipeId(null);
  };

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
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "16px 16px 24px",
          boxSizing: "border-box",
          scrollbarWidth: "none",
        }}
        className="signal-scroll"
        onClick={() => {
          setMenuId(null);
          setSwipeId(null);
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            background: "rgba(255,255,255,0.05)",
            cursor: "pointer",
            fontFamily: FONT,
            boxSizing: "border-box",
            textAlign: "left",
            marginBottom: 16,
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Rename Trader DNA
            </span>
            <span
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Change your companion&apos;s name
            </span>
          </span>
          <img
            src={ASSETS.chevron}
            alt=""
            width={12}
            height={12}
            style={{
              display: "block",
              transform: "rotate(180deg)",
              flexShrink: 0,
            }}
          />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 34,
            padding: "0 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            boxSizing: "border-box",
            marginBottom: 16,
            gap: 6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={ASSETS.search}
            alt=""
            width={16}
            height={16}
            style={{ display: "block", flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.8)",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              fontFamily: FONT,
            }}
          />
          {searching && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                flexShrink: 0,
                animation: "moreSearchPulse 900ms ease-in-out infinite",
              }}
            >
              Searching…
            </span>
          )}
          {query.length > 0 && !searching && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              style={{
                width: 13,
                height: 13,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "inline-flex",
                flexShrink: 0,
              }}
            >
              <img
                src={ASSETS.clear}
                alt=""
                width={13}
                height={13}
                style={{ display: "block" }}
              />
            </button>
          )}
        </div>

        {grouped.length === 0 && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              paddingTop: 24,
            }}
          >
            No conversations found
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {grouped.map(({ group, rows }) => (
            <div
              key={group}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {group}
              </span>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {rows.map((row) =>
                  isNarrow && !row.active ? (
                    <div
                      key={row.id}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SwipeDeleteRow
                        row={row}
                        open={swipeId === row.id}
                        onOpen={() => setSwipeId(row.id)}
                        onClose={() =>
                          setSwipeId((prev) =>
                            prev === row.id ? null : prev,
                          )
                        }
                        onDelete={() => deleteConversation(row.id)}
                      />
                    </div>
                  ) : (
                    <div
                      key={row.id}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        minHeight: 60,
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.05)",
                        boxSizing: "border-box",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ConversationBody row={row} />
                      {row.active ? (
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 8,
                            border: "1px solid #00ffab",
                            color: "#00ffab",
                            fontSize: 12,
                            fontWeight: 600,
                            lineHeight: "18px",
                            flexShrink: 0,
                          }}
                        >
                          Active
                        </span>
                      ) : (
                        !isNarrow && (
                          <button
                            type="button"
                            aria-label="More actions"
                            onClick={() =>
                              setMenuId((prev) =>
                                prev === row.id ? null : row.id,
                              )
                            }
                            style={{
                              width: 20,
                              height: 20,
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
                            <img
                              src={ASSETS.moreDots}
                              alt=""
                              width={15}
                              height={3}
                              style={{ display: "block" }}
                            />
                          </button>
                        )
                      )}
                      {!isNarrow && menuId === row.id && (
                        <div
                          style={{
                            position: "absolute",
                            right: 12,
                            top: 44,
                            zIndex: 5,
                            width: "fit-content",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "#232323",
                            overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => deleteConversation(row.id)}
                            style={{
                              width: "fit-content",
                              padding: "10px 12px",
                              border: "none",
                              background: "transparent",
                              color: "#ff41a3",
                              fontSize: 12,
                              fontWeight: 600,
                              fontFamily: FONT,
                              cursor: "pointer",
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes moreSearchPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function RenameView({
  onBack,
  onCancel,
  initialName = "",
  onSave,
}: {
  onBack: () => void;
  onCancel: () => void;
  initialName?: string;
  onSave?: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const canSave = name.trim().length > 0;

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
          flex: 1,
          minHeight: 0,
          padding: "16px 13px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "20px",
            color: "#ffffff",
            marginBottom: 4,
          }}
        >
          Rename Trader DNA
        </div>
        <p
          style={{
            margin: "0 0 24px",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.6)",
            maxWidth: 296,
          }}
        >
          This name will be used for future insights and interactions.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              boxSizing: "border-box",
              gap: 8,
            }}
          >
            <input
              value={name}
              maxLength={15}
              onChange={(e) => setName(e.target.value.slice(0, 15))}
              placeholder="Give me a name..."
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                fontSize: 12,
                fontWeight: 500,
                lineHeight: "18px",
                fontFamily: FONT,
              }}
            />
            {name.length > 0 && (
              <button
                type="button"
                aria-label="Clear name"
                onClick={() => setName("")}
                style={{
                  width: 13,
                  height: 13,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                }}
              >
                <img
                  src={ASSETS.clear}
                  alt=""
                  width={13}
                  height={13}
                  style={{ display: "block" }}
                />
              </button>
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
              textAlign: "right",
            }}
          >
            {name.length}/15
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onSave?.(name.trim());
              onBack();
            }}
            style={{
              flex: 1,
              height: 32,
              border: "none",
              borderRadius: 16,
              backgroundImage: GRADIENTS.connectBtn,
              opacity: canSave ? 1 : 0.5,
              color: "rgba(255,255,255,0.9)",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: canSave ? "pointer" : "default",
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 16,
              border: "1px solid #5d5d5d",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
