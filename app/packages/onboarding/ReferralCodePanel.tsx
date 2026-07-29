import { useState } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { ONBOARDING_ASSETS } from "./assets";
import {
  OnboardingShell,
  PrimaryButton,
  SecondaryButton,
} from "./OnboardingShell";

type ReferralCodePanelProps = {
  onApply?: (code: string) => void;
  onSkip?: () => void;
  onClose?: () => void;
};

export function ReferralCodePanel({
  onApply,
  onSkip,
  onClose,
}: ReferralCodePanelProps) {
  const [code, setCode] = useState("");
  const canApply = code.trim().length > 0;
  const isMobile = useBreakpoint() === "390";

  return (
    <OnboardingShell stage="referral" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              lineHeight: "20px",
              color: "#ffffff",
            }}
          >
            Have a referral code?
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "20px",
              color: COLORS.white60,
            }}
          >
            No code? No worries—you can add one later on the Referral page.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 8,
            width: "100%",
            padding: isMobile ? "8px 10px" : "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.walletIcon}
            alt=""
            width={isMobile ? 32 : 39}
            height={isMobile ? 32 : 39}
            style={{ display: "block", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? 13 : 14,
                fontWeight: 600,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Dexless Wallet
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                color: COLORS.white40,
              }}
            >
              0x1CB2...F193
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <img
              src={ONBOARDING_ASSETS.circleCheck}
              alt=""
              width={12}
              height={12}
            />
            <span
              style={{
                fontSize: isMobile ? 12 : 13,
                fontWeight: 600,
                lineHeight: "18px",
                color: COLORS.brandGreen,
                whiteSpace: "nowrap",
              }}
            >
              Wallet created
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label
            style={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Referral code
          </label>
          <input
            type="text"
            value={code}
            placeholder="Enter your referral code..."
            onChange={(e) => setCode(e.target.value)}
            className="referral-code-input"
            style={{
              width: "100%",
              height: 44,
              padding: "6px 12px",
              border: "none",
              borderRadius: 6,
              background: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "18px",
              fontFamily: FONT,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <PrimaryButton
          label="Apply"
          disabled={!canApply}
          onClick={() => {
            if (!canApply) return;
            onApply?.(code.trim());
          }}
        />
        <SecondaryButton label="Skip for Now" onClick={onSkip} />
      </div>
    </OnboardingShell>
  );
}
