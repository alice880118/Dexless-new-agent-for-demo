import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { FONT, getModalMaxWidth } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { DrawerDragHandle } from "../trade/MobileDrawerChrome";

type Props = {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
  /** When false: no backdrop dismiss, close button, or drag handle — must use CTA */
  dismissible?: boolean;
};

/** Desktop centered dialog / <768 bottom drawer — Dexless AI sheets */
export function DexlessDialogShell({
  open,
  onClose,
  titleId,
  title,
  children,
  dismissible = true,
}: Props) {
  const bp = useBreakpoint();
  const isDrawer = bp === "390";
  const modalMaxWidth = getModalMaxWidth(bp);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      onClick={dismissible ? onClose : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5600,
        display: "flex",
        flexDirection: "column",
        justifyContent: isDrawer ? "flex-end" : "center",
        alignItems: isDrawer ? "stretch" : "center",
        padding: isDrawer ? 0 : "24px 16px",
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.55)",
      }}
    >
      <style>{`
        @keyframes dexlessDrawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isDrawer ? undefined : modalMaxWidth,
          maxHeight: isDrawer ? "90dvh" : undefined,
          background: "#0c0d10",
          border: isDrawer ? "none" : "1px solid #383838",
          borderRadius: isDrawer ? "4px 4px 0 0" : 8,
          display: "flex",
          flexDirection: "column",
          boxShadow: isDrawer ? undefined : "0 24px 64px rgba(0,0,0,0.55)",
          fontFamily: FONT,
          boxSizing: "border-box",
          overflow: "auto",
          overscrollBehavior: "contain",
          animation: isDrawer
            ? "dexlessDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
            : undefined,
          paddingBottom: isDrawer
            ? "calc(16px + env(safe-area-inset-bottom, 0px))"
            : undefined,
        }}
      >
        {isDrawer && dismissible ? <DrawerDragHandle /> : null}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: isDrawer && dismissible ? "8px 20px 14px" : "14px 20px",
            borderBottom: "1px solid #383838",
            flexShrink: 0,
          }}
        >
          <h2
            id={titleId}
            style={{
              flex: 1,
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.16px",
              lineHeight: "20px",
              color: "#fff",
            }}
          >
            {title}
          </h2>
          {dismissible ? (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              style={{
                width: 20,
                height: 20,
                flexShrink: 0,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
