import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONT, isTabletNav } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { LOGO_WIDTH, ONBOARDING_ASSETS } from "./assets";

export type OnboardingStage = "referral" | "setup" | "funds";

type StepState = "active" | "done" | "todo";

type OnboardingShellProps = {
  stage: OnboardingStage;
  children: ReactNode;
};

function stepState(stage: OnboardingStage, id: OnboardingStage): StepState {
  const order: OnboardingStage[] = ["referral", "setup", "funds"];
  const current = order.indexOf(stage);
  const target = order.indexOf(id);
  if (target < current) return "done";
  if (target === current) return "active";
  return "todo";
}

function HelpLink() {
  return (
    <button
      type="button"
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        textAlign: "left",
        fontSize: 13,
        fontWeight: 500,
        lineHeight: "20px",
        color: COLORS.white60,
        textDecoration: "underline",
        cursor: "pointer",
        fontFamily: FONT,
      }}
    >
      Need help?
    </button>
  );
}

function StepItem({
  label,
  state,
  lineActive,
  showLine,
  horizontal,
}: {
  label: string;
  state: StepState;
  lineActive?: boolean;
  showLine: boolean;
  horizontal?: boolean;
}) {
  const icon =
    state === "done"
      ? ONBOARDING_ASSETS.circleCheck
      : state === "active"
        ? ONBOARDING_ASSETS.stepActive
        : ONBOARDING_ASSETS.stepDefault;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: horizontal ? 6 : 8,
          opacity: state === "todo" || state === "done" ? 0.5 : 1,
          flexShrink: horizontal ? 1 : 0,
          minWidth: 0,
        }}
      >
        <img
          src={icon}
          alt=""
          width={12}
          height={12}
          style={{ display: "block", flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: horizontal ? 12 : 14,
            fontWeight: 600,
            lineHeight: horizontal ? "16px" : "18px",
            color: "rgba(255,255,255,0.8)",
            whiteSpace: horizontal ? "normal" : "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      {showLine &&
        (horizontal ? (
          <div
            style={{
              flex: 1,
              minWidth: 8,
              maxWidth: 20,
              height: 0,
              borderTop: `1.5px dashed ${
                lineActive ? COLORS.brandGreen : "rgba(255,255,255,0.25)"
              }`,
              opacity: lineActive ? 0.9 : 0.5,
              alignSelf: "center",
            }}
          />
        ) : (
          <div style={{ width: 12, height: 28, position: "relative" }}>
            <img
              src={
                lineActive
                  ? ONBOARDING_ASSETS.stepLineActive
                  : ONBOARDING_ASSETS.stepLine
              }
              alt=""
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
    </>
  );
}

function StepList({
  referral,
  setup,
  funds,
  horizontal,
}: {
  referral: StepState;
  setup: StepState;
  funds: StepState;
  horizontal?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        alignItems: horizontal ? "center" : "stretch",
        gap: horizontal ? 4 : 2,
        width: horizontal ? "100%" : undefined,
      }}
    >
      <StepItem
        label="Referral code"
        state={referral}
        showLine
        lineActive={referral === "done"}
        horizontal={horizontal}
      />
      <StepItem
        label="Set up account"
        state={setup}
        showLine
        lineActive={setup === "done"}
        horizontal={horizontal}
      />
      <StepItem
        label="Add funds"
        state={funds}
        showLine={false}
        horizontal={horizontal}
      />
    </div>
  );
}

export function OnboardingShell({ stage, children }: OnboardingShellProps) {
  const breakpoint = useBreakpoint();
  const isMobile = isTabletNav(breakpoint);
  const referral = stepState(stage, "referral");
  const setup = stepState(stage, "setup");
  const funds = stepState(stage, "funds");

  const shellStyle: CSSProperties = isMobile
    ? {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 360,
        minHeight: 0,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #424242",
        backgroundImage: "linear-gradient(180deg, #010101 0%, #252931 100%)",
        boxSizing: "border-box",
        fontFamily: FONT,
      }
    : {
        position: "relative",
        display: "flex",
        width: "100%",
        maxWidth: 820,
        minHeight: 480,
        borderRadius: 12,
        overflow: "visible",
        border: "1px solid #424242",
        backgroundImage: "linear-gradient(180deg, #010101 0%, #252931 100%)",
        boxSizing: "border-box",
        fontFamily: FONT,
      };

  if (isMobile) {
    return (
      <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "20px 20px 0",
            boxSizing: "border-box",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.logoWordmark}
            alt="DEXLESS"
            style={{
              display: "block",
              width: LOGO_WIDTH,
              height: "auto",
              objectFit: "contain",
            }}
          />
          <div
            style={{
              width: "100%",
              padding: "12px 10px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxSizing: "border-box",
            }}
          >
            <StepList
              referral={referral}
              setup={setup}
              funds={funds}
              horizontal
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            padding: "20px 20px 16px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 24,
              flex: 1,
              minHeight: 320,
            }}
          >
            {children}
          </div>
          <div style={{ marginTop: 16 }}>
            <HelpLink />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
      <aside
        style={{
          width: 210,
          flexShrink: 0,
          background: "#08080c",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 24,
          boxSizing: "border-box",
          borderRadius: "12px 0 0 12px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <img
            src={ONBOARDING_ASSETS.logoWordmark}
            alt="DEXLESS"
            style={{
              display: "block",
              width: LOGO_WIDTH,
              height: "auto",
              objectFit: "contain",
            }}
          />
          <StepList referral={referral} setup={setup} funds={funds} />
        </div>
        <HelpLink />
      </aside>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 64px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 482,
            minHeight: 368,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function PrimaryButton({
  label,
  onClick,
  loading,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const dimmed = Boolean(loading || disabled);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={dimmed}
      style={{
        width: "100%",
        height: 40,
        border: "none",
        borderRadius: 999,
        cursor: dimmed ? "default" : "pointer",
        backgroundImage: dimmed
          ? "linear-gradient(90deg, rgba(112,83,243,0.5) 0%, rgba(118,186,178,0.5) 62.694%, rgba(227,255,148,0.5) 137.26%)"
          : "linear-gradient(90deg, #7053f3 0%, #76bab2 62.694%, #e3ff94 137.26%)",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      {loading && (
        <img
          src={ONBOARDING_ASSETS.spinner}
          alt=""
          width={16}
          height={16}
          style={{
            display: "block",
            animation: "onboardingSpin 0.8s linear infinite",
          }}
        />
      )}
      {label}
    </button>
  );
}

export function SecondaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        height: 40,
        border: "1px solid #ffffff",
        borderRadius: 999,
        cursor: "pointer",
        background: "transparent",
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: FONT,
        opacity: 0.5,
      }}
    >
      {label}
    </button>
  );
}
