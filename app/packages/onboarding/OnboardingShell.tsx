import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { LOGO_WIDTH, ONBOARDING_ASSETS } from "./assets";

export type OnboardingStage = "referral" | "setup" | "funds" | "complete";

type StepState = "active" | "done" | "todo";

type OnboardingShellProps = {
  stage: OnboardingStage;
  /** Setup sub-step: 1 = create account, 2 = enable trading */
  setupPhase?: 1 | 2;
  children: ReactNode;
  onClose?: () => void;
};

function ShellCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 2,
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
      <img
        src={ONBOARDING_ASSETS.close}
        alt=""
        width={14}
        height={14}
        style={{ display: "block" }}
      />
    </button>
  );
}

function stepState(stage: OnboardingStage, id: OnboardingStage): StepState {
  if (stage === "complete") return "done";
  const order: OnboardingStage[] = ["referral", "setup", "funds"];
  const current = order.indexOf(stage);
  const target = order.indexOf(id);
  if (target < 0 || current < 0) return "todo";
  if (target < current) return "done";
  if (target === current) return "active";
  return "todo";
}

function HelpLink({ centered = false }: { centered?: boolean }) {
  return (
    <a
      href="https://discord.com/invite/Pm9fy2MWH4"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        display: centered ? "block" : undefined,
        width: centered ? "100%" : undefined,
        textAlign: centered ? "center" : "left",
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
    </a>
  );
}

function StepItem({
  label,
  state,
  lineActive,
  showLine,
}: {
  label: string;
  state: StepState;
  lineActive?: boolean;
  showLine: boolean;
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
          gap: 8,
          opacity: state === "todo" || state === "done" ? 0.5 : 1,
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
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      {showLine && (
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
      )}
    </>
  );
}

const BAR_TRACK = "rgba(255,255,255,0.2)";
const BAR_REFERRAL =
  "linear-gradient(90deg, #7053f3 0%, #76bab2 96.35%)";
const BAR_REFERRAL_DONE =
  "linear-gradient(90deg, rgba(112,83,243,0.5) 0%, rgba(118,186,178,0.5) 96.35%)";
const BAR_SETUP =
  "linear-gradient(90deg, #76bab2 0%, #e3ff94 98.52%)";
const BAR_SETUP_DONE =
  "linear-gradient(90deg, rgba(118,186,178,0.5) 0%, rgba(227,255,148,0.5) 98.52%)";
const BAR_FUNDS =
  "linear-gradient(90deg, #e3ff94 0%, #dbfd5c 98.52%)";

/** Mobile (<768): Figma — 3 segmented step bars */
function MobileStepProgress({
  stage,
  setupPhase = 1,
}: {
  stage: OnboardingStage;
  setupPhase?: 1 | 2;
}) {
  const steps: { id: OnboardingStage; label: string }[] = [
    { id: "referral", label: "Referral code" },
    { id: "setup", label: "Set up account" },
    { id: "funds", label: "Add funds" },
  ];
  const activeIndex =
    stage === "complete" ? 3 : steps.findIndex((s) => s.id === stage);

  const barFill = (i: number): { full?: string; partial?: string; opacity?: number } => {
    if (stage === "complete") {
      if (i === 0) return { full: BAR_REFERRAL_DONE };
      if (i === 1) return { full: BAR_SETUP_DONE };
      return { full: BAR_FUNDS, opacity: 0.5 };
    }
    if (stage === "referral") {
      if (i === 0) return { full: BAR_REFERRAL };
      return {};
    }
    if (stage === "setup") {
      if (i === 0) return { full: BAR_REFERRAL_DONE };
      if (i === 1) {
        return setupPhase === 2
          ? { full: BAR_SETUP }
          : { partial: BAR_SETUP };
      }
      return {};
    }
    // funds
    if (i === 0) return { full: BAR_REFERRAL_DONE };
    if (i === 1) return { full: BAR_SETUP_DONE };
    return { full: BAR_FUNDS };
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {steps.map((step, i) => {
          const active = i === activeIndex;
          const done = i < activeIndex;
          return (
            <div
              key={step.id}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: done || stage === "complete" ? "flex-start" : "center",
                gap: 4,
                minWidth: 0,
                opacity: active ? 1 : 0.5,
              }}
            >
              {done || stage === "complete" ? (
                <img
                  src={ONBOARDING_ASSETS.progressCheck}
                  alt=""
                  width={11}
                  height={11}
                  style={{
                    display: "block",
                    width: 11,
                    height: 11,
                    flexShrink: 0,
                  }}
                />
              ) : null}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: active
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {steps.map((step, i) => {
          const fill = barFill(i);
          return (
            <div
              key={step.id}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                background: BAR_TRACK,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {fill.full ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    backgroundImage: fill.full,
                    opacity: fill.opacity ?? 1,
                  }}
                />
              ) : null}
              {fill.partial ? (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "52%",
                    borderRadius: 999,
                    backgroundImage: fill.partial,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepList({
  referral,
  setup,
  funds,
}: {
  referral: StepState;
  setup: StepState;
  funds: StepState;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <StepItem
        label="Referral code"
        state={referral}
        showLine
        lineActive={referral === "done"}
      />
      <StepItem
        label="Set up account"
        state={setup}
        showLine
        lineActive={setup === "done"}
      />
      <StepItem label="Add funds" state={funds} showLine={false} />
    </div>
  );
}

export function OnboardingShell({
  stage,
  setupPhase = 1,
  children,
  onClose,
}: OnboardingShellProps) {
  const breakpoint = useBreakpoint();
  /** <768 only */
  const isMobile = breakpoint === "390";
  const referral = stepState(stage, "referral");
  const setup = stepState(stage, "setup");
  const funds = stepState(stage, "funds");
  /** Desktop: hide close from Referral → Add funds */
  const showClose =
    Boolean(onClose) &&
    (isMobile || stage === "complete");

  const shellStyle: CSSProperties = isMobile
    ? {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        background: "#0a0b0d",
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
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 40,
            paddingTop: 55,
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: "calc(48px + env(safe-area-inset-bottom, 0px))",
            boxSizing: "border-box",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            scrollPaddingBottom:
              "calc(48px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <MobileStepProgress stage={stage} setupPhase={setupPhase} />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 28,
              flex: 1,
              minHeight: 0,
            }}
          >
            {children}
          </div>
          <div
            style={{
              marginTop: 8,
              flexShrink: 0,
              paddingBottom: 12,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HelpLink centered />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
      {showClose && onClose ? <ShellCloseButton onClick={onClose} /> : null}
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
