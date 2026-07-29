import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { LOGO_WIDTH, ONBOARDING_ASSETS } from "./assets";

export type OnboardingStage = "referral" | "setup" | "funds";

type StepState = "active" | "done" | "todo";

type OnboardingShellProps = {
  stage: OnboardingStage;
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

/** Mobile (<768): Figma progress — labels + continuous track with green fill */
function MobileStepProgress({ stage }: { stage: OnboardingStage }) {
  const steps: { id: OnboardingStage; label: string; align: "left" | "center" | "right" }[] = [
    { id: "referral", label: "Referral code", align: "left" },
    { id: "setup", label: "Set up account", align: "center" },
    { id: "funds", label: "Add funds", align: "right" },
  ];
  const activeIndex = steps.findIndex((s) => s.id === stage);
  const progressPct = ((activeIndex + 1) / steps.length) * 100;

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          display: "flex",
          width: "100%",
          marginBottom: 9,
        }}
      >
        {steps.map((step, i) => (
          <span
            key={step.id}
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              textAlign: step.align,
              color: "rgba(255,255,255,0.8)",
              opacity: i === activeIndex ? 1 : 0.5,
            }}
          >
            {step.label}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.3)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${progressPct}%`,
            borderRadius: 999,
            background: COLORS.brandGreen,
          }}
        />
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
  children,
  onClose,
}: OnboardingShellProps) {
  const breakpoint = useBreakpoint();
  /** <768 only */
  const isMobile = breakpoint === "390";
  const referral = stepState(stage, "referral");
  const setup = stepState(stage, "setup");
  const funds = stepState(stage, "funds");

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
            gap: stage === "setup" ? 60 : 16,
            padding: "70px 24px 16px",
            boxSizing: "border-box",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <MobileStepProgress stage={stage} />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 28,
              flex: 1,
              minHeight: 320,
            }}
          >
            {children}
          </div>
          <div style={{ marginTop: 8 }}>
            <HelpLink />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
      {onClose ? <ShellCloseButton onClick={onClose} /> : null}
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
