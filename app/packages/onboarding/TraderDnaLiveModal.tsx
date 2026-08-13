import { COLORS, FONT, MODAL_WIDTH } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { AccountLiveHeroLottie } from "./AccountLiveHeroLottie";
import { ONBOARDING_ASSETS } from "./assets";
import {
  OnboardingShell,
  PrimaryButton,
} from "./OnboardingShell";

type TraderDnaLiveModalProps = {
  /** flow = mobile full-page onboarding shell; popup = compact dialog card */
  presentation?: "flow" | "popup";
  onMeetAgent?: () => void;
  onClose?: () => void;
};

export function TraderDnaLiveModal({
  presentation,
  onMeetAgent,
  onClose,
}: TraderDnaLiveModalProps) {
  const isMobile = useBreakpoint() === "390";
  /** Compact card unless mobile new-user flow shell */
  const asFlow = presentation === "flow" && isMobile;

  const titleBlock = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        alignItems: "flex-start",
        textAlign: "left",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          lineHeight: "20px",
          color: "#ffffff",
          width: "100%",
          textAlign: "left",
        }}
      >
        Your account is live
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "20px",
          color: COLORS.white60,
          width: "100%",
          textAlign: "left",
        }}
      >
        Your agent is ready to walk you through your first trade.
      </p>
    </div>
  );

  const hero = (
    <AccountLiveHeroLottie
      tall={asFlow && isMobile}
      surfaceColor={asFlow ? "#0a0b0d" : "#0c0d10"}
    />
  );

  const actions = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <PrimaryButton label="Meet your agent" onClick={onMeetAgent} />
    </div>
  );

  if (asFlow) {
    return (
      <OnboardingShell stage="complete" onClose={onClose}>
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
            <div
              aria-hidden
              style={{
                height: 0,
                width: 1,
                marginTop: -2,
                opacity: 0,
                pointerEvents: "none",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
                width: "100%",
              }}
            >
              {titleBlock}
              {hero}
            </div>
          </div>
          {actions}
        </div>
      </OnboardingShell>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: MODAL_WIDTH.compact,
        background: "#0c0d10",
        border: "1px solid #424242",
        borderRadius: 8,
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: FONT,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "14px 20px",
          borderBottom: "1px solid #424242",
          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "20px",
            letterSpacing: "0.16px",
            color: "#ffffff",
            textAlign: "left",
            width: "100%",
            paddingRight: onClose ? 28 : 0,
          }}
        >
          Your account is live
        </h2>
        {onClose ? (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
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
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 24,
          padding: "16px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        {hero}
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white60,
            textAlign: "left",
          }}
        >
          Your agent is ready to walk you through your first trade.
        </p>
        {actions}
      </div>
    </div>
  );
}
