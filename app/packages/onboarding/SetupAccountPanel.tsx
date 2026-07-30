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

function StepCircle({
  n,
  state,
}: {
  n: 1 | 2;
  state: "active" | "done" | "todo";
}) {
  if (state === "done") {
    return (
      <img
        src={ONBOARDING_ASSETS.stepDoneCheck}
        alt=""
        width={24}
        height={24}
        style={{ display: "block", width: 24, height: 24, flexShrink: 0 }}
      />
    );
  }

  const active = state === "active";
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 999,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: active ? COLORS.brandGreen : "rgba(255,255,255,0.1)",
        border: active
          ? `1px solid ${COLORS.brandGreen}`
          : "1px solid rgba(255,255,255,0.6)",
        opacity: active ? 1 : 0.5,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "18px",
          color: active ? "#000000" : "rgba(255,255,255,0.8)",
          fontFamily: FONT,
        }}
      >
        {n}
      </span>
    </div>
  );
}

function StepCard({
  title,
  body,
  state,
}: {
  title: string;
  body: string;
  state: "active" | "done" | "todo";
}) {
  const active = state === "active";
  return (
    <div
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: 8,
        boxSizing: "border-box",
        background: "rgba(255,255,255,0.1)",
        border: active ? "1px solid rgba(219,253,92,0.5)" : "1px solid transparent",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: "18px",
          color: active
            ? "rgba(255,255,255,0.8)"
            : "rgba(255,255,255,0.6)",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          color: active
            ? "rgba(255,255,255,0.5)"
            : "rgba(255,255,255,0.4)",
        }}
      >
        {body}
      </p>
    </div>
  );
}

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
  const setupPhase: 1 | 2 = enableActive ? 2 : 1;
  const createState = createActive ? "active" : "done";
  const enableState = enableActive ? "active" : "todo";

  const cardPad = "8px 12px";
  const titleSize = 14;
  const bodySize = 13;

  const stepCardsDesktop = (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 8,
        width: "100%",
        padding: 8,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: cardPad,
          borderRadius: 8,
          background: createActive ? "rgba(255,255,255,0.05)" : "transparent",
          opacity: createActive ? 1 : 0.5,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
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
            flex: 1,
          }}
        >
          Prove you own this wallet
        </p>
      </div>
      <img
        src={ONBOARDING_ASSETS.arrowRight}
        alt=""
        width={14}
        height={14}
        style={{
          display: "block",
          flexShrink: 0,
          width: 14,
          height: 14,
          objectFit: "contain",
          alignSelf: "center",
        }}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: cardPad,
          borderRadius: 8,
          background: enableActive ? "rgba(255,255,255,0.05)" : "transparent",
          opacity: enableActive ? 1 : 0.5,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
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
            flex: 1,
          }}
        >
          View positions and submit approved orders.
        </p>
      </div>
    </div>
  );

  const stepCardsMobile = (
    <div
      style={{
        display: "flex",
        gap: 10,
        width: "100%",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <StepCircle n={1} state={createState} />
        <img
          src={
            enableActive
              ? ONBOARDING_ASSETS.stepConnectorDone
              : ONBOARDING_ASSETS.stepConnector
          }
          alt=""
          width={12}
          height={34}
          style={{ display: "block", width: 12, height: 34 }}
        />
        <StepCircle n={2} state={enableState} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <StepCard
          title="Create account"
          body="Prove you own this wallet"
          state={createState}
        />
        <StepCard
          title="Enable trading"
          body="View positions and submit approved orders."
          state={enableState}
        />
      </div>
    </div>
  );

  const skipCheckbox = (
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
        Skip setup next time
      </span>
    </button>
  );

  const backButton = (
    <button
      type="button"
      onClick={onBack}
      aria-hidden={!createActive}
      tabIndex={createActive ? 0 : -1}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: createActive ? "pointer" : "default",
        fontFamily: FONT,
        color: COLORS.white60,
        fontSize: 13,
        fontWeight: 500,
        lineHeight: "18px",
        width: "fit-content",
        opacity: createActive ? 1 : 0,
        pointerEvents: createActive ? "auto" : "none",
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
  );

  const titleBlock = (
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
        {createActive ? "Set up your Dexless account" : "Enable trading"}
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
  );

  return (
    <OnboardingShell
      stage="setup"
      setupPhase={setupPhase}
      onClose={onClose ?? onDisconnect}
    >
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
            {backButton}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                /* Enable trading: pull cards 20px closer to progress rail */
                gap: enableActive ? 12 : 32,
                width: "100%",
              }}
            >
              {titleBlock}
              {stepCardsMobile}
            </div>
            {skipCheckbox}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PrimaryButton
              label={waiting ? "" : `Continue — Step ${phase} of 2`}
              loading={waiting}
              onClick={waiting ? undefined : onContinue}
            />
            <SecondaryButton
              label="Disconnect wallet"
              onClick={onDisconnect}
            />
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {phase === 1 && !waiting ? backButton : null}
              {titleBlock}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stepCardsDesktop}
              {skipCheckbox}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PrimaryButton
              label={waiting ? "" : `Continue — Step ${phase} of 2`}
              loading={waiting}
              onClick={waiting ? undefined : onContinue}
            />
            <SecondaryButton
              label="Disconnect wallet"
              onClick={onDisconnect}
            />
          </div>
        </>
      )}
    </OnboardingShell>
  );
}
