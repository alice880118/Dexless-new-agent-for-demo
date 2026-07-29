import { useState } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { ONBOARDING_ASSETS } from "./assets";
import {
  OnboardingShell,
  PrimaryButton,
  SecondaryButton,
} from "./OnboardingShell";

type SetupAccountPanelProps = {
  /** 1 = create account active, 2 = enable trading active */
  phase: 1 | 2;
  waiting?: boolean;
  skipNext?: boolean;
  onSkipNextChange?: (value: boolean) => void;
  onBack?: () => void;
  onContinue?: () => void;
  onDisconnect?: () => void;
  onClose?: () => void;
};

export function SetupAccountPanel({
  phase,
  waiting = false,
  skipNext: skipNextProp,
  onSkipNextChange,
  onBack,
  onContinue,
  onDisconnect,
  onClose,
}: SetupAccountPanelProps) {
  const [skipNextLocal, setSkipNextLocal] = useState(false);
  const skipNext = skipNextProp ?? skipNextLocal;
  const setSkipNext = (value: boolean) => {
    if (onSkipNextChange) onSkipNextChange(value);
    else setSkipNextLocal(value);
  };
  const createActive = phase === 1 && !waiting;
  const enableActive = phase === 2 || waiting;
  const isMobile = useBreakpoint() === "390";
  const cardPad = isMobile ? "8px 8px" : "8px 12px";
  const titleSize = isMobile ? 13 : 14;
  const bodySize = isMobile ? 12 : 13;

  return (
    <OnboardingShell stage="setup" onClose={onClose ?? onDisconnect}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {phase === 1 && !waiting && (
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                fontFamily: FONT,
                color: COLORS.white60,
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                width: "fit-content",
              }}
            >
              <img
                src={ONBOARDING_ASSETS.back}
                alt=""
                width={10}
                height={10}
                style={{ display: "block" }}
              />
              Back
            </button>
          )}
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
              {phase === 1 && !waiting
                ? "Create your Dexless account"
                : "Enable trading"}
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
              Takes two wallet signatures, about 30 seconds. No gas fees, and no
              funds leave your wallet.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 4 : 8,
              width: "100%",
              padding: isMobile ? 6 : 8,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                padding: cardPad,
                borderRadius: 8,
                background: createActive
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
                opacity: createActive ? 1 : 0.5,
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: titleSize,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Create account
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: bodySize,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: COLORS.white50,
                  minHeight: isMobile ? 32 : 36,
                }}
              >
                Prove you own this wallet
              </p>
            </div>
            <img
              src={ONBOARDING_ASSETS.arrowRight}
              alt=""
              width={isMobile ? 18 : 24}
              height={isMobile ? 18 : 24}
              style={{ display: "block", flexShrink: 0 }}
            />
            <div
              style={{
                flex: 1,
                minWidth: 0,
                padding: cardPad,
                borderRadius: 8,
                background: enableActive
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
                opacity: enableActive ? 1 : 0.5,
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: titleSize,
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
                  fontSize: bodySize,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: COLORS.white50,
                  minHeight: isMobile ? 32 : 36,
                }}
              >
                View positions and submit approved orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSkipNext(!skipNext)}
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
                skipNext
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
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <PrimaryButton
          label={
            waiting
              ? ""
              : `Continue — Step ${phase} of 2`
          }
          loading={waiting}
          onClick={waiting ? undefined : onContinue}
        />
        <SecondaryButton label="Disconnect wallet" onClick={onDisconnect} />
      </div>
    </OnboardingShell>
  );
}
