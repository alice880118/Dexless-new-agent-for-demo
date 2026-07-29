import { useEffect, useState, type CSSProperties } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import { LOGO_WIDTH, ONBOARDING_ASSETS } from "./assets";
import { AddFundsPanel } from "./AddFundsPanel";
import { EmailAuthModal, type EmailAuthStep } from "./EmailAuthModal";
import { EnableTradingPanel } from "./EnableTradingPanel";
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
  | "enable-trading"
  | "funds"
  | "trader-dna-live";

type OnboardingDialogProps = {
  open: boolean;
  onClose: () => void;
  onConnectWallet?: () => void;
  /** Disconnect wallet — reset to default unconnected Connect wallet state */
  onDisconnect?: () => void;
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
  overflow: "auto",
  overscrollBehavior: "contain",
};

export function OnboardingDialog({
  open,
  onClose,
  onConnectWallet: _onConnectWallet,
  onDisconnect,
  onComplete,
  topInset = 48,
  bottomInset = 0,
}: OnboardingDialogProps) {
  const breakpoint = useBreakpoint();
  /** <768 only — 390 breakpoint */
  const isMobile = breakpoint === "390";
  const [step, setStep] = useState<FlowStep>("sign-in");
  const [email, setEmail] = useState("");
  const [setupPhase, setSetupPhase] = useState<1 | 2>(1);
  const [waitingSig, setWaitingSig] = useState(false);
  const [signRound, setSignRound] = useState<1 | 2>(1);
  /** Wallet QC path: show setup steps but skip SignMessageModal */
  const [skipSignatures, setSkipSignatures] = useState(false);
  /** Wallet return visit: after enable → trader-dna (no add funds) */
  const [walletReturnVisit, setWalletReturnVisit] = useState(false);
  const [skipSetupNext, setSkipSetupNext] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("sign-in");
      setEmail("");
      setSetupPhase(1);
      setWaitingSig(false);
      setSignRound(1);
      setSkipSignatures(false);
      setWalletReturnVisit(false);
      // Keep skipSetupNext in memory for same-session return visit;
      // full page refresh resets to default.
    }
  }, [open]);

  useEffect(() => {
    try {
      window.localStorage.removeItem("dexless-skip-setup-next");
    } catch {
      // ignore
    }
  }, []);

  const persistSkipSetupNext = (value: boolean) => {
    setSkipSetupNext(value);
  };

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const keepViewport = () => {
      window.scrollTo(0, 0);
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        window.setTimeout(keepViewport, 0);
        window.setTimeout(keepViewport, 100);
        window.setTimeout(keepViewport, 300);
      }
    };

    window.addEventListener("scroll", keepViewport, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    keepViewport();

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.removeEventListener("scroll", keepViewport);
      document.removeEventListener("focusin", onFocusIn);
    };
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
    setWalletReturnVisit(false);
    setStep("setup");
  };

  const goWalletFirstConnect = () => {
    setSetupPhase(1);
    setWaitingSig(false);
    setSignRound(1);
    setSkipSignatures(true);
    setWalletReturnVisit(false);
    setStep("referral");
  };

  const goWalletReturnConnect = () => {
    if (skipSetupNext) {
      setSkipSignatures(false);
      setWalletReturnVisit(false);
      setStep("trader-dna-live");
      return;
    }
    setWaitingSig(false);
    setSkipSignatures(true);
    setWalletReturnVisit(true);
    setStep("enable-trading");
  };

  const openSign = (round: 1 | 2) => {
    setSignRound(round);
    setWaitingSig(false);
    setStep("sign");
  };

  const finishSetupAfterEnable = () => {
    setWaitingSig(false);
    if (walletReturnVisit) {
      setStep("trader-dna-live");
      return;
    }
    setStep("funds");
  };

  /** Wallet Enable trading CTA: 50% CTA + spinner, then banner after 2s */
  const handleEnableTradingCta = () => {
    if (waitingSig) return;
    setWaitingSig(true);
    window.setTimeout(() => {
      setWaitingSig(false);
      setStep("trader-dna-live");
    }, 2000);
  };

  const handleSetupContinue = () => {
    if (skipSignatures) {
      if (setupPhase === 1) {
        if (waitingSig) return;
        // Create account CTA → loading → Enable trading (auto loading → funds)
        setWaitingSig(true);
        window.setTimeout(() => {
          setSetupPhase(2);
          setWaitingSig(true);
          window.setTimeout(() => {
            setWaitingSig(false);
            finishSetupAfterEnable();
          }, 1200);
        }, 1200);
        return;
      }
      return;
    }
    openSign(setupPhase);
  };

  const handleSetupDisconnect = () => {
    setSkipSignatures(false);
    setWalletReturnVisit(false);
    setSetupPhase(1);
    setWaitingSig(false);
    setSignRound(1);
    setStep("sign-in");
    if (onDisconnect) onDisconnect();
    else onClose();
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
    step === "enable-trading" ||
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
    const authActions = (
      <>
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
              fontSize: isMobile ? 18 : 20,
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
              height: isMobile ? 36 : 40,
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
            fontSize: isMobile ? 12 : 13,
            fontWeight: 500,
            lineHeight: isMobile ? "16px" : "18px",
            color: COLORS.white40,
          }}
        >
          By continuing, you agree to the Terms of Service and Risk Disclosure.
        </p>
      </>
    );

    if (isMobile) {
      panel = (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: 360,
            maxHeight: "100%",
            borderRadius: 12,
            overflow: "hidden",
            background: "#08080c",
            boxSizing: "border-box",
            border: "1px solid #424242",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 3,
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
          <div
            style={{
              position: "relative",
              flexShrink: 0,
              height: 168,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "20px 20px 16px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <img
              src={ONBOARDING_ASSETS.infoMobile}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center right",
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
                gap: 6,
                width: "100%",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.64)",
                }}
              >
                Trade Smarter with Dexless AI
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: "rgba(255,255,255,0.376)",
                }}
              >
                Understands your trading behavior
              </p>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "20px 20px 16px",
              boxSizing: "border-box",
              background: "#08080c",
              overflowY: "auto",
            }}
          >
            {authActions}
          </div>
        </div>
      );
    } else {
      panel = (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: 800,
            minHeight: panelHeight,
            borderRadius: 12,
            overflow: "hidden",
            background: "#08080c",
            boxSizing: "border-box",
            border: "1px solid #424242",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 3,
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
            {authActions}
          </div>
        </div>
      );
    }
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
            setWaitingSig(false);
            setSkipSignatures(true);
            setWalletReturnVisit(true);
            setStep("enable-trading");
            return;
          }
          setStep("referral");
        }}
      />
    );
  } else if (step === "wallet-connect") {
    panel = (
      <WalletConnectModal
        onClose={onClose}
        skipSetupNext={skipSetupNext}
        onFirstConnect={goWalletFirstConnect}
        onReturnConnect={goWalletReturnConnect}
      />
    );
  } else if (step === "referral") {
    panel = (
      <ReferralCodePanel
        onApply={goSetup}
        onSkip={goSetup}
        onClose={onClose}
      />
    );
  } else if (step === "setup") {
    panel = (
      <SetupAccountPanel
        phase={setupPhase}
        waiting={waitingSig}
        skipNext={skipSetupNext}
        onSkipNextChange={persistSkipSetupNext}
        onBack={() => setStep("referral")}
        onContinue={handleSetupContinue}
        onDisconnect={handleSetupDisconnect}
        onClose={onClose}
      />
    );
  } else if (step === "enable-trading") {
    panel = (
      <EnableTradingPanel
        waiting={waitingSig}
        rememberMe={skipSetupNext}
        onRememberMeChange={persistSkipSetupNext}
        onClose={onClose}
        onDisconnect={handleSetupDisconnect}
        onContinue={handleEnableTradingCta}
      />
    );
  } else if (step === "sign") {
    panel = (
      <SignMessageModal
        onClose={onClose}
        onSign={handleSigned}
      />
    );
  } else if (step === "funds") {
    panel = (
      <AddFundsPanel
        onDone={() => setStep("trader-dna-live")}
        onClose={onClose}
      />
    );
  } else if (step === "trader-dna-live") {
    panel = (
      <TraderDnaLiveModal
        onExplore={() => finish(true)}
        onClose={onClose}
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
        alignItems: "center",
        justifyContent: "center",
        animation: "onboardingOverlayIn 0.22s ease-out both",
      }}
      className="onboarding-dialog"
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
        /* Prevent mobile / DevTools device-mode focus zoom on inputs */
        @media (max-width: 767px) {
          .onboarding-dialog input:not(.referral-code-input),
          .onboarding-dialog textarea,
          .onboarding-dialog select {
            font-size: 16px !important;
          }
          .onboarding-dialog input.referral-code-input {
            font-size: 14px !important;
          }
        }
      `}</style>
      <FadePanel
        panelKey={panelKey}
        style={{
          width: "100%",
          maxWidth: isMobile ? 360 : undefined,
          maxHeight: "100%",
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {panel}
      </FadePanel>
    </div>
  );
}
