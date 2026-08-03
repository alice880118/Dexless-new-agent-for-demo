import type { CSSProperties, ReactNode } from "react";
import { FONT } from "../nav/design-system";

/** Top swipe affordance — shared by all mobile bottom drawers */
export function DrawerDragHandle() {
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 20,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 40,
          height: 4,
          borderRadius: 999,
          background: "#313338",
          display: "block",
        }}
      />
    </div>
  );
}

/** Selected indicator — Order Type / Time in force green dot */
export function DrawerSelectDot({ selected }: { selected: boolean }) {
  if (!selected) {
    return <span aria-hidden style={{ width: 5, flexShrink: 0 }} />;
  }
  return (
    <span
      aria-hidden
      style={{
        width: 5,
        height: 5,
        borderRadius: 999,
        background: "#dbfd5c",
        flexShrink: 0,
      }}
    />
  );
}

export const DRAWER_SHELL: CSSProperties = {
  background: "#0c0d10",
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  boxSizing: "border-box",
};

export const DRAWER_PAD =
  "0 20px calc(48px + env(safe-area-inset-bottom, 0px))" as const;

export const DRAWER_TITLE: CSSProperties = {
  fontFamily: FONT,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "20px",
  color: "#ffffff",
};

export const DRAWER_OPTION_SELECTED_BG = "rgba(255,255,255,0.05)";

type DrawerOptionRowProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  /** With title+desc (Order Type / TP/SL) vs single-line (TIF) */
  dense?: boolean;
};

/** Shared selectable row — selected = 5% white + green dot */
export function DrawerOptionRow({
  selected,
  onClick,
  children,
  dense,
}: DrawerOptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: dense ? "space-between" : undefined,
        gap: dense ? undefined : 8,
        width: "100%",
        minHeight: dense ? 44 : 74,
        padding: dense ? "12px 8px" : 8,
        border: "none",
        borderRadius: 6,
        background: selected ? DRAWER_OPTION_SELECTED_BG : "transparent",
        cursor: "pointer",
        textAlign: "left",
        boxSizing: "border-box",
      }}
    >
      {children}
      <DrawerSelectDot selected={selected} />
    </button>
  );
}
