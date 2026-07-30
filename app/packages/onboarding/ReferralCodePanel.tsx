import { useRef, useState } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const ensureInputVisible = () => {
    if (!isMobile) return;
    const el = inputRef.current;
    if (!el) return;
    window.setTimeout(() => {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 50);
    window.setTimeout(() => {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 320);
  };

  const walletReadyBorder = GRADIENTS.airdropBorder;
  /** Opaque base so gradient border does not bleed through white 5% fill */
  const walletReadyFill =
    "linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)), #0a0b0d";

  const walletCardDesktop = (
    <div
      style={{
        width: "100%",
        borderRadius: 8,
        padding: 1,
        boxSizing: "border-box",
        backgroundImage: walletReadyBorder,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: 12,
          borderRadius: 7,
          background: walletReadyFill,
          boxSizing: "border-box",
        }}
      >
      <img
        src={ONBOARDING_ASSETS.walletIcon}
        alt=""
        width={39}
        height={39}
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
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Your wallet is ready
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            Dexless Wallet
          </span>
          <span
            aria-hidden
            style={{
              width: 1,
              height: 10,
              background: "#454545",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            0x1CB2...F193
          </span>
        </div>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
          padding: "4px 8px",
          borderRadius: 999,
          background: "rgba(3,152,134,0.2)",
        }}
      >
        <img
          src={ONBOARDING_ASSETS.circleCheckTeal}
          alt=""
          width={13}
          height={13}
          style={{ display: "block", width: 13, height: 13 }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: "18px",
            color: "#46ccb9",
            whiteSpace: "nowrap",
          }}
        >
          Ready
        </span>
      </div>
      </div>
    </div>
  );

  /** Figma 7527:88752 — mobile wallet ready card */
  const walletCardMobile = (
    <div
      style={{
        width: "100%",
        borderRadius: 12,
        padding: 1,
        boxSizing: "border-box",
        backgroundImage: walletReadyBorder,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          padding: "8px 12px",
          borderRadius: 11,
          background: walletReadyFill,
          boxSizing: "border-box",
        }}
      >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Dexless Wallet
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                lineHeight: "18px",
                color: "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              Your wallet is ready
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              0x4555...dB1D
            </p>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
            padding: "4px 8px",
            borderRadius: 999,
            background: "rgba(3,152,134,0.2)",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.circleCheckTeal}
            alt=""
            width={13}
            height={13}
            style={{ display: "block", width: 13, height: 13 }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "18px",
              color: "#46ccb9",
              whiteSpace: "nowrap",
            }}
          >
            Ready
          </span>
        </div>
      </div>
      </div>
    </div>
  );

  const referralInput = (
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
        ref={inputRef}
        type="text"
        value={code}
        placeholder="Enter your referral code..."
        onChange={(e) => setCode(e.target.value)}
        onFocus={ensureInputVisible}
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
  );

  return (
    <OnboardingShell stage="referral" onClose={onClose}>
      {isMobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 24,
            flex: 1,
            minHeight: 0,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: "100%",
            }}
          >
            {walletCardMobile}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
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
                  No code? No worries—you can add one later on the Referral
                  page.
                </p>
              </div>
              {referralInput}
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
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
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
            {walletCardDesktop}
            {referralInput}
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
        </>
      )}
    </OnboardingShell>
  );
}
