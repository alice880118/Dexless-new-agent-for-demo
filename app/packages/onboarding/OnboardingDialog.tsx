import { useEffect, useState, type CSSProperties } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { LOGO_WIDTH, ONBOARDING_ASSETS } from "./assets";
import { AddFundsPanel } from "./AddFundsPanel";
import { EmailAuthModal, type EmailAuthStep } from "./EmailAuthModal";
import { FadePanel, ONBOARDING_MOTION_CSS } from "./motion";
import { ReferralCodePanel } from "./ReferralCodePanel";
import { SetupAccountPanel } from "./SetupAccountPanel";
import { SignMessageModal } from "./SignMessageModal";
import { TraderDnaLiveModal } from "./TraderDnaLiveModal";
import { WalletConnectModal } from "./WalletConnectModal";

type FlowStep =
  | "sign-in"
  | EmailAuthStep
  | "wallet-connect"
  | "referral"
  | "setup"
  | "sign"
  | "funds"
  | "trader-dna-live";

type OnboardingDialogProps = {
  open: boolean;
  onClose: () => void;
  onConnectWallet?: () => void;
  onComplete?: (options?: { openAgent?: boolean }) => void;
  /** Leave top/bottom nav uncovered by blur overlay */
  topInset?: number;
  bottomInset?: number;
};

const panelHeight = 479;

const orLineStyle: CSSProperties = {
  flex: 1,
  height: 1,
  minWidth: 1,
  background: "rgba(255,255,255,0.15)",
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  zIndex: 150,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  boxSizing: "border-box",
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  fontFamily: FONT,
};

export function OnboardingDialog({
  open,
  onClose,
  onConnectWallet: _onConnectWallet,
  onComplete,
  topInset = 48,
  bottomInset = 0,
}: OnboardingDialogProps) {
  const [step, setStep] = useState<FlowStep>("sign-in");
  const [email, setEmail] = useState("");
  const [setupPhase, setSetupPhase] = useState<1 | 2>(1);
  const [waitingSig, setWaitingSig] = useState(false);
  const [signRound, setSignRound] = useState<1 | 2>(1);

  useEffect(() => {
    if (!open) {
      setStep("sign-in");
      setEmail("");
      setSetupPhase(1);
      setWaitingSig(false);
      setSignRound(1);
    }
  }, [open]);

  if (!open) return null;

  const finish = (openAgent = false) => {
    onComplete?.({ openAgent });
    onClose();
  };

  const goSetup = () => {
    setSetupPhase(1);
    setWaitingSig(false);
    setSignRound(1);
    setStep("setup");
  };

  const openSign = (round: 1 | 2) => {
    setSignRound(round);
    setWaitingSig(false);
    setStep("sign");
  };

  const handleSetupContinue = () => {
    openSign(setupPhase);
  };

  const handleSetupDisconnect = () => {
    openSign(setupPhase);
  };

  const handleSigned = () => {
    if (signRound === 1) {
      setSetupPhase(2);
      setStep("setup");
      setWaitingSig(true);
      window.setTimeout(() => {
        setWaitingSig(false);
        openSign(2);
      }, 2000);
      return;
    }
    setStep("funds");
  };

  const lockedSteps =
    step === "referral" ||
    step === "setup" ||
    step === "sign" ||
    step === "funds" ||
    step === "wallet-connect" ||
    step === "trader-dna-live";

  const panelKey =
    step === "setup"
      ? `setup-${setupPhase}`
      : step === "sign"
        ? `sign-${signRound}`
        : step;

  let panel = null;
  if (step === "sign-in") {
    panel = (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: 800,
            minHeight: panelHeight,
            borderRadius: 12,
            overflow: "hidden",
            background: "#08080c",
            boxSizing: "border-box",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              position: "relative",
              flex: "1 0 0",
              minWidth: 280,
              minHeight: panelHeight,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "40px 24px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <img
              src={ONBOARDING_ASSETS.info}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
            <img
              src={ONBOARDING_ASSETS.logo}
              alt="DEXLESS"
              style={{
                position: "relative",
                zIndex: 1,
                display: "block",
                width: LOGO_WIDTH,
                height: "auto",
                objectFit: "contain",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxWidth: 248,
                width: "100%",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: "28px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Trade Smarter with Dexless AI
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.47)",
                }}
              >
                Understands your trading behavior
              </p>
            </div>
          </div>

          <div
            style={{
              flex: "1 0 0",
              minWidth: 280,
              minHeight: panelHeight,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              padding: "0 24px",
              boxSizing: "border-box",
              background: "#08080c",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "#ffffff",
                }}
              >
                Sign In
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: COLORS.white60,
                }}
              >
                Choose one to continue. You can link both methods later.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                width: "100%",
              }}
            >
              <button
                type="button"
                onClick={() => setStep("wallet-connect")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 44,
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  backgroundImage: GRADIENTS.connectBtn,
                  fontFamily: FONT,
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "#ffffff",
                  }}
                >
                  Connect Wallet
                </span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  height: 40,
                  width: "100%",
                }}
              >
                <span style={orLineStyle} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: COLORS.white50,
                    flexShrink: 0,
                  }}
                >
                  Or
                </span>
                <span style={orLineStyle} />
              </div>

              <button
                type="button"
                onClick={() => setStep("email")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 44,
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.8)",
                  fontFamily: FONT,
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "#000000",
                  }}
                >
                  Continue with Email
                </span>
              </button>
            </div>

            <p
              style={{
                margin: 0,
                width: "100%",
                fontSize: 13,
                fontWeight: 500,
                lineHeight: "18px",
                color: COLORS.white40,
              }}
            >
              By continuing, you agree to the Terms of Service and Risk
              Disclosure.
            </p>
          </div>
        </div>
    );
  } else if (step === "email" || step === "code") {
    panel = (
      <EmailAuthModal
        step={step}
        email={email}
        onEmailChange={setEmail}
        onBack={() => setStep("email")}
        onClose={onClose}
        onGoToCode={(nextEmail) => {
          setEmail(nextEmail);
          setStep("code");
        }}
        onCodeVerified={(kind) => {
          if (kind === "old") {
            setStep("trader-dna-live");
            return;
          }
          setStep("referral");
        }}
      />
    );
  } else if (step === "wallet-connect") {
    panel = (
      <WalletConnectModal
        onClose={() => setStep("sign-in")}
        onConnected={() => setStep("trader-dna-live")}
      />
    );
  } else if (step === "referral") {
    panel = <ReferralCodePanel onApply={goSetup} onSkip={goSetup} />;
  } else if (step === "setup") {
    panel = (
      <SetupAccountPanel
        phase={setupPhase}
        waiting={waitingSig}
        onBack={() => setStep("referral")}
        onContinue={handleSetupContinue}
        onDisconnect={handleSetupDisconnect}
      />
    );
  } else if (step === "sign") {
    panel = (
      <SignMessageModal
        onClose={() => {
          setStep("setup");
          setWaitingSig(false);
        }}
        onSign={handleSigned}
      />
    );
  } else if (step === "funds") {
    panel = <AddFundsPanel onDone={() => setStep("trader-dna-live")} />;
  } else if (step === "trader-dna-live") {
    panel = (
      <TraderDnaLiveModal
        onExplore={() => finish(true)}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding"
      style={{
        ...overlayStyle,
        top: topInset,
        bottom: bottomInset,
        animation: "onboardingOverlayIn 0.22s ease-out both",
      }}
      onClick={() => {
        if (!lockedSteps) onClose();
      }}
    >
      <style>{`
        ${ONBOARDING_MOTION_CSS}
        .sign-payload-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sign-payload-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      <FadePanel panelKey={panelKey}>{panel}</FadePanel>
    </div>
  );
}
