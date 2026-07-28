import { useEffect, useRef, type CSSProperties } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { ONBOARDING_ASSETS, WC_COPY_LINK } from "./assets";

type WalletConnectModalProps = {
  onClose: () => void;
  /** Called after 1.5s dwell (successful mock connect) */
  onConnected: () => void;
};

const shell: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 360,
  background: "#1a1a1a",
  borderRadius: 24,
  padding: "20px 20px 16px",
  boxSizing: "border-box",
  fontFamily: FONT,
};

export function WalletConnectModal({
  onClose,
  onConnected,
}: WalletConnectModalProps) {
  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;

  useEffect(() => {
    const t = window.setTimeout(() => {
      onConnectedRef.current();
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(WC_COPY_LINK);
    } catch {
      // ignore
    }
  };

  return (
    <div style={shell} onClick={(e) => e.stopPropagation()}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          marginBottom: 16,
          minHeight: 28,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "22px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          WalletConnect
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            border: "none",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            color: COLORS.white60,
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: 16,
            background: "#ffffff",
            padding: 12,
            boxSizing: "border-box",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.wcQr}
            alt="WalletConnect QR Code"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Scan this QR Code with your phone
        </p>

        <button
          type="button"
          onClick={copyLink}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "transparent",
            padding: "4px 8px",
            cursor: "pointer",
            fontFamily: FONT,
            color: COLORS.white50,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <img
            src={ONBOARDING_ASSETS.wcLink}
            alt=""
            width={14}
            height={14}
            style={{ display: "block" }}
          />
          Copy link
        </button>
      </div>

      <button
        type="button"
        style={{
          marginTop: 16,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          border: "none",
          borderRadius: 14,
          background: "rgba(255,255,255,0.06)",
          cursor: "pointer",
          fontFamily: FONT,
          boxSizing: "border-box",
        }}
      >
        <img
          src={ONBOARDING_ASSETS.wcGrid}
          alt=""
          width={20}
          height={20}
          style={{ display: "block", flexShrink: 0 }}
        />
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontSize: 14,
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          All Wallets
        </span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.white50,
          }}
        >
          540+
        </span>
      </button>
    </div>
  );
}
