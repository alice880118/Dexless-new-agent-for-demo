import type { CSSProperties } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { ONBOARDING_ASSETS } from "./assets";
import { PrimaryButton } from "./OnboardingShell";

type EnableTradingPanelProps = {
  waiting?: boolean;
  rememberMe?: boolean;
  onRememberMeChange?: (value: boolean) => void;
  onClose?: () => void;
  onContinue?: () => void;
  onDisconnect?: () => void;
};

/** Figma 7526:83099 — standalone Enable trading (return wallet) */
const shell: CSSProperties = {
  width: "100%",
  maxWidth: 418,
  background: "#0c0d10",
  border: "1px solid #424242",
  borderRadius: 8,
  overflow: "hidden",
  boxSizing: "border-box",
  fontFamily: FONT,
};

export function EnableTradingPanel({
  waiting = false,
  rememberMe = false,
  onRememberMeChange,
  onClose,
  onContinue,
  onDisconnect,
}: EnableTradingPanelProps) {
  return (
    <div style={shell} onClick={(e) => e.stopPropagation()}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          padding: "14px 20px",
          borderBottom: "1px solid #424242",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: 0,
            flex: 1,
            minWidth: 0,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "20px",
            letterSpacing: "0.16px",
            color: "#ffffff",
          }}
        >
          Enable trading
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.close}
            alt=""
            width={20}
            height={20}
            style={{ display: "block" }}
          />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "16px 20px 20px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <p
          style={{
            margin: 0,
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white60,
          }}
        >
          Your previous access has expired, you will receive a signature request
          to enable trading. Signing is free and will not send a transaction.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              minHeight: 78,
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              boxSizing: "border-box",
            }}
          >
            <img
              src={ONBOARDING_ASSETS.circleCheckGreen}
              alt=""
              width={16}
              height={16}
              style={{ display: "block", flexShrink: 0 }}
            />
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Enable trading
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: COLORS.white50,
                }}
              >
                Enable secure access to our API for lightning fast trading
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRememberMeChange?.(!rememberMe)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            <img
              src={
                rememberMe
                  ? ONBOARDING_ASSETS.checkboxOn
                  : ONBOARDING_ASSETS.checkbox
              }
              alt=""
              width={20}
              height={20}
              style={{ display: "block" }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "14px",
                letterSpacing: "-0.42px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Remember me
            </span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <PrimaryButton
            label={waiting ? "" : "Enable trading"}
            loading={waiting}
            onClick={waiting ? undefined : onContinue}
          />
          <button
            type="button"
            onClick={onDisconnect ?? onClose}
            style={{
              width: "100%",
              minHeight: 40,
              padding: "0 16px",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 999,
              background: "transparent",
              cursor: "pointer",
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "20px",
              color: COLORS.white60,
              boxSizing: "border-box",
            }}
          >
            Disconnect wallet
          </button>
        </div>
      </div>
    </div>
  );
}
