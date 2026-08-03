import { createPortal } from "react-dom";
import { FONT } from "../nav/design-system";
import {
  DrawerDragHandle,
  DrawerOptionRow,
  DRAWER_PAD,
  DRAWER_SHELL,
  DRAWER_TITLE,
} from "./MobileDrawerChrome";

export type TimeInForce = "gtc" | "ioc" | "fok";

export const TIME_IN_FORCE_OPTIONS: {
  id: TimeInForce;
  label: string;
}[] = [
  { id: "gtc", label: "GTC" },
  { id: "ioc", label: "IOC" },
  { id: "fok", label: "FOK" },
];

type TimeInForceDrawerProps = {
  open: boolean;
  value: TimeInForce;
  onSelect: (id: TimeInForce) => void;
  onClose: () => void;
};

/** Mobile TIF picker — title Time in force, options GTC / IOC / FOK */
export function TimeInForceDrawer({
  open,
  value,
  onSelect,
  onClose,
}: TimeInForceDrawerProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <style>{`
        @keyframes tifDrawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes tifDrawerBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 0,
          border: "none",
          background: "rgba(0,0,0,0.55)",
          cursor: "pointer",
          animation: "tifDrawerBackdropIn 0.22s ease-out both",
        }}
      />
      <div
        role="dialog"
        aria-label="Time in force"
        style={{
          ...DRAWER_SHELL,
          position: "relative",
          width: "100%",
          padding: DRAWER_PAD,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          animation: "tifDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <DrawerDragHandle />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 24,
            flexShrink: 0,
          }}
        >
          <span style={DRAWER_TITLE}>Time in force</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          {TIME_IN_FORCE_OPTIONS.map((opt) => {
            const selected = opt.id === value;
            return (
              <DrawerOptionRow
                key={opt.id}
                selected={selected}
                dense
                onClick={() => {
                  onSelect(opt.id);
                  onClose();
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "#ffffff",
                  }}
                >
                  {opt.label}
                </span>
              </DrawerOptionRow>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
