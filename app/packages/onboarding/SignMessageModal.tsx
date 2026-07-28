import type { CSSProperties } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { ONBOARDING_ASSETS, SIGN_PAYLOAD } from "./assets";

type SignMessageModalProps = {
  onClose?: () => void;
  onSign?: () => void;
};

const modalShell: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 380,
  background: "#0b0d12",
  borderRadius: 16,
  padding: "28px 20px 20px",
  boxSizing: "border-box",
  fontFamily: FONT,
};

function payloadText(): string {
  const { domain, message } = SIGN_PAYLOAD;
  return [
    "domain:",
    `  name: ${domain.name}`,
    `  version: ${domain.version}`,
    `  chainId: ${domain.chainId}`,
    `  verifyingContract: ${domain.verifyingContract}`,
    "message:",
    `  brokerId: ${message.brokerId}`,
    `  orderlyKey: ${message.orderlyKey}`,
    `  scope: ${message.scope}`,
    `  chainId: ${message.chainId}`,
    `  timestamp: ${message.timestamp}`,
    `  expiration: ${message.expiration}`,
  ].join("\n");
}

export function SignMessageModal({ onClose, onSign }: SignMessageModalProps) {
  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payloadText());
    } catch {
      // ignore clipboard errors in demo
    }
  };

  const { domain, message } = SIGN_PAYLOAD;
  const valueColor = "#e8d48b";

  const row = (label: string, value: string | number, indent = false) => (
    <div style={{ paddingLeft: indent ? 12 : 0 }}>
      <span style={{ color: "#ffffff" }}>{label}: </span>
      <span style={{ color: valueColor }}>{value}</span>
    </div>
  );

  return (
    <div style={modalShell} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          borderRadius: 999,
          border: "none",
          background: "rgba(255,255,255,0.06)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <img src={ONBOARDING_ASSETS.close} alt="" width={14} height={14} />
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.signIcon}
            alt=""
            width={22}
            height={22}
            style={{ display: "block" }}
          />
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "24px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Sign message
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white60,
            textAlign: "center",
          }}
        >
          Signing this message will not cost you any fees.
        </p>

        <div
          className="sign-payload-scroll"
          style={{
            width: "100%",
            marginTop: 8,
            padding: 12,
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "18px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            boxSizing: "border-box",
            overflow: "auto",
            maxHeight: 220,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div style={{ color: "#ffffff" }}>domain:</div>
          {row("name", domain.name, true)}
          {row("version", domain.version, true)}
          {row("chainId", domain.chainId, true)}
          {row("verifyingContract", domain.verifyingContract, true)}
          <div style={{ color: "#ffffff", marginTop: 6 }}>message:</div>
          {row("brokerId", message.brokerId, true)}
          {row("orderlyKey", message.orderlyKey, true)}
          {row("scope", message.scope, true)}
          {row("chainId", message.chainId, true)}
          {row("timestamp", message.timestamp, true)}
          {row("expiration", message.expiration, true)}
        </div>

        <button
          type="button"
          onClick={copyPayload}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            color: COLORS.white50,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: FONT,
            marginTop: 4,
          }}
        >
          <img src={ONBOARDING_ASSETS.copy} alt="" width={14} height={14} />
          Copy full payload to clipboard
        </button>

        <button
          type="button"
          onClick={onSign}
          style={{
            width: "100%",
            height: 44,
            marginTop: 8,
            border: "none",
            borderRadius: 10,
            background: "rgba(255,255,255,0.1)",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: FONT,
            cursor: "pointer",
          }}
        >
          Sign and continue
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 12, color: COLORS.white40, fontWeight: 500 }}>
            Protected by
          </span>
          <img
            src={ONBOARDING_ASSETS.privy}
            alt="privy"
            style={{ display: "block", height: 14, width: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
