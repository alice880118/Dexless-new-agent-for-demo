import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS, MODAL_WIDTH } from "../nav/design-system";
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

/** Steps that remain overlay modals (mobile portal + desktop card) */
type ModalFlowStep =
  | "email"
  | "code"
  | "wallet-connect"
  | "sign"
  | "enable-trading";

type PageFlowStep = Exclude<FlowStep, ModalFlowStep>;

function isModalFlowStep(step: FlowStep): step is ModalFlowStep {
  return (
    step === "email" ||
    step === "code" ||
    step === "wallet-connect" ||
    step === "sign" ||
    step === "enable-trading"
  );
}

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

const overlayStyleDesktop: CSSProperties = {
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

const pageStyleMobile: CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 250,
  display: "flex",
  flexDirection: "column",
  padding: 0,
  boxSizing: "border-box",
  background: "#0a0b0d",
  fontFamily: FONT,
  overflow: "hidden",
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
  /** Last non-modal page step — shown under sign / enable-trading on mobile */
  const [lastPageStep, setLastPageStep] = useState<PageFlowStep>("sign-in");
  const [email, setEmail] = useState("");
  const [setupPhase, setSetupPhase] = useState<1 | 2>(1);
  const [waitingSig, setWaitingSig] = useState(false);
  const [signRound, setSignRound] = useState<1 | 2>(1);
  /** Wallet QC path: show setup steps but skip SignMessageModal */
  const [skipSignatures, setSkipSignatures] = useState(false);
  /** Wallet return visit: after enable → trader-dna (no add funds) */
  const [walletReturnVisit, setWalletReturnVisit] = useState(false);
  /** New-user auth path — drives Add funds desktop variant */
  const [authMethod, setAuthMethod] = useState<"wallet" | "email">("email");
  /** Old / return user: account-live as compact popup (not onboarding shell) */
  const [liveAsPopup, setLiveAsPopup] = useState(false);
  const [skipSetupNext, setSkipSetupNext] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep("sign-in");
      setLastPageStep("sign-in");
      setEmail("");
      setSetupPhase(1);
      setWaitingSig(false);
      setSignRound(1);
      setSkipSignatures(false);
      setWalletReturnVisit(false);
      setAuthMethod("email");
      setLiveAsPopup(false);
      setKeyboardOffset(0);
      // Keep skipSetupNext in memory for same-session return visit;
      // full page refresh resets to default.
    }
  }, [open]);

  useEffect(() => {
    if (!isModalFlowStep(step)) {
      setLastPageStep(step);
    }
  }, [step]);

  useEffect(() => {
    try {
      window.localStorage.removeItem("dexless-skip-setup-next");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!open || !isMobile) return;
    // When email/code modal is open, skip page keyboard padding —
    // the modal is positioned with visualViewport instead (avoids jump).
    if (
      step === "email" ||
      step === "code" ||
      step === "wallet-connect" ||
      step === "sign" ||
      step === "enable-trading" ||
      step === "trader-dna-live"
    ) {
      setKeyboardOffset(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    let raf = 0;
    const update = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const covered = Math.max(
          0,
          window.innerHeight - vv.height - vv.offsetTop,
        );
        setKeyboardOffset(covered > 80 ? covered : 0);
      });
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      window.cancelAnimationFrame(raf);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open, isMobile, step]);

  const persistSkipSetupNext = (value: boolean) => {
    setSkipSetupNext(value);
  };

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  /** Pin mobile modal to visualViewport so keyboard open/OTP focus doesn't bounce the sheet */
  const [modalViewport, setModalViewport] = useState(() => ({
    top: 0,
    height: typeof window === "undefined" ? 800 : window.innerHeight,
  }));

  useEffect(() => {
    if (!open || !isMobile || !isModalFlowStep(step)) return;
    const vv = window.visualViewport;
    if (!vv) return;
    let raf = 0;
    const update = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        setModalViewport({
          top: vv.offsetTop,
          height: vv.height,
        });
      });
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      window.cancelAnimationFrame(raf);
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open, isMobile, step]);

  if (!open) return null;

  const finish = (openAgent = false) => {
    onComplete?.({ openAgent });
    onClose();
  };

  /** Show “Your account is live” — do not mark wallet connected yet (avoids Connect history racing) */
  const goTraderDnaLive = (asPopup = false) => {
    setLiveAsPopup(asPopup);
    setLastPageStep("trader-dna-live");
    setStep("trader-dna-live");
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
    setAuthMethod("wallet");
    setStep("referral");
  };

  const goWalletReturnConnect = () => {
    if (skipSetupNext) {
      setSkipSignatures(false);
      setWalletReturnVisit(false);
      goTraderDnaLive(true);
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
      goTraderDnaLive(true);
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
      goTraderDnaLive(true);
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

  const renderSignIn = (): ReactNode => {
    const authButtons = (
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
          onClick={() => {
            setAuthMethod("email");
            setStep("email");
          }}
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
    );

    const legalText = (
      <p
        style={{
          margin: 0,
          width: "100%",
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          color: COLORS.white40,
          textAlign: isMobile ? "center" : "left",
        }}
      >
        By continuing, you agree to the Terms of Service and Risk Disclosure.
      </p>
    );

    if (isMobile) {
      return (
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
            background: "#000000",
            boxSizing: "border-box",
            paddingTop: 16,
            paddingBottom: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              padding: "0 24px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                flexShrink: 0,
                background: "#000000",
                gap: 16,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 342,
                  height: "min(220px, 34vh)",
                  minHeight: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={ONBOARDING_ASSETS.infoMobile}
                  alt=""
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center center",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div
                style={{
                  width: 248,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 600,
                    lineHeight: "24px",
                    color: "#ffffff",
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                width: "100%",
                maxWidth: 342,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "auto",
                paddingTop: 24,
                paddingBottom: 48,
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  width: "100%",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    width: "100%",
                    fontSize: 18,
                    fontWeight: 600,
                    lineHeight: "20px",
                    color: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  Sign In
                </p>
                {authButtons}
              </div>
              {legalText}
            </div>
          </div>
        </div>
      );
    }

    return (
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              maxWidth: 342,
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
          <div style={{ width: "100%", maxWidth: 342 }}>{authButtons}</div>
          <div style={{ width: "100%", maxWidth: 342 }}>{legalText}</div>
        </div>
      </div>
    );
  };

  const renderPageStep = (pageStep: PageFlowStep): ReactNode => {
    if (pageStep === "sign-in") return renderSignIn();
    if (pageStep === "referral") {
      return (
        <ReferralCodePanel
          onApply={goSetup}
          onSkip={goSetup}
          onClose={onClose}
        />
      );
    }
    if (pageStep === "setup") {
      return (
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
    }
    if (pageStep === "trader-dna-live") {
      return (
        <TraderDnaLiveModal
          presentation={liveAsPopup ? "popup" : "flow"}
          onMeetAgent={() => finish(true)}
          onClose={onClose}
        />
      );
    }
    return (
      <AddFundsPanel
        variant={authMethod}
        onDone={() => goTraderDnaLive(false)}
        onClose={onClose}
      />
    );
  };

  const renderModalStep = (modalStep: ModalFlowStep): ReactNode => {
    if (modalStep === "email" || modalStep === "code") {
      return (
        <EmailAuthModal
          step={modalStep}
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
            setAuthMethod("email");
            setStep("referral");
          }}
        />
      );
    }
    if (modalStep === "wallet-connect") {
      return (
        <WalletConnectModal
          onClose={onClose}
          skipSetupNext={skipSetupNext}
          onFirstConnect={goWalletFirstConnect}
          onReturnConnect={goWalletReturnConnect}
        />
      );
    }
    if (modalStep === "enable-trading") {
      return (
        <EnableTradingPanel
          waiting={waitingSig}
          rememberMe={skipSetupNext}
          onRememberMeChange={persistSkipSetupNext}
          onClose={onClose}
          onDisconnect={handleSetupDisconnect}
          onContinue={handleEnableTradingCta}
        />
      );
    }
    return (
      <SignMessageModal onClose={onClose} onSign={handleSigned} />
    );
  };

  const showMobileModal = isMobile && isModalFlowStep(step);
  const showLivePopupMobile =
    isMobile && step === "trader-dna-live" && liveAsPopup;
  const pageStepForRender: PageFlowStep = showMobileModal
    ? lastPageStep
    : isModalFlowStep(step)
      ? "sign-in"
      : step;

  const panelKey =
    pageStepForRender === "setup"
      ? `setup-${setupPhase}`
      : showMobileModal
        ? `page-${pageStepForRender}`
        : step === "sign"
          ? `sign-${signRound}`
          : step;

  const pagePanel = showMobileModal
    ? renderPageStep(lastPageStep)
    : isModalFlowStep(step)
      ? renderModalStep(step)
      : renderPageStep(step);

  const motionCss = `
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
            font-size: 16px !important;
          }
          .onboarding-dialog input.referral-code-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
            opacity: 1;
          }
          .onboarding-dialog input.otp-digit-input {
            font-size: 16px !important;
          }
        }
      `;

  const mobileModalPortal =
    showMobileModal &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          step === "sign"
            ? "Sign message"
            : step === "enable-trading"
              ? "Enable trading"
              : step === "wallet-connect"
                ? "WalletConnect"
                : step === "code"
                  ? "Enter verification code"
                  : "Log in or sign up"
        }
        className="onboarding-dialog"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: modalViewport.top,
          height: modalViewport.height,
          zIndex: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          boxSizing: "border-box",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          fontFamily: FONT,
          overflow: "hidden",
          overscrollBehavior: "contain",
          touchAction: "manipulation",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{motionCss}</style>
        <div
          style={{
            width: "100%",
            maxWidth: MODAL_WIDTH.compact,
            maxHeight: "100%",
            overflow: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {renderModalStep(step)}
        </div>
      </div>,
      document.body,
    );

  const livePopupPortal =
    showLivePopupMobile &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your account is live"
        className="onboarding-dialog"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          boxSizing: "border-box",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          fontFamily: FONT,
          overflow: "hidden",
          overscrollBehavior: "contain",
          touchAction: "manipulation",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{motionCss}</style>
        <div
          style={{
            width: "100%",
            maxWidth: MODAL_WIDTH.compact,
            maxHeight: "100%",
            overflow: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <TraderDnaLiveModal
            presentation="popup"
            onMeetAgent={() => finish(true)}
            onClose={onClose}
          />
        </div>
      </div>,
      document.body,
    );

  if (isMobile) {
    if (showLivePopupMobile) {
      return <>{livePopupPortal}</>;
    }
    return (
      <>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            step === "trader-dna-live"
              ? "Your account is live"
              : "Onboarding"
          }
          style={{
            ...pageStyleMobile,
            /* Above floating agent (zIndex 1000) so banner is not covered */
            zIndex: step === "trader-dna-live" ? 1100 : 250,
            top: topInset,
            paddingBottom: keyboardOffset > 0 ? keyboardOffset : 0,
          }}
          className="onboarding-dialog"
        >
          <style>{motionCss}</style>
          <FadePanel
            panelKey={panelKey}
            style={{
              width: "100%",
              height: "100%",
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            {pagePanel}
          </FadePanel>
        </div>
        {mobileModalPortal}
      </>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding"
      style={{
        ...overlayStyleDesktop,
        zIndex: step === "trader-dna-live" ? 1100 : 150,
        top: topInset,
        bottom: bottomInset,
        alignItems: keyboardOffset > 0 ? "flex-start" : "center",
        justifyContent: "center",
        paddingTop: keyboardOffset > 0 ? 8 : 16,
        paddingBottom:
          keyboardOffset > 0 ? Math.max(8, keyboardOffset - bottomInset) : 16,
        animation: "onboardingOverlayIn 0.22s ease-out both",
      }}
      className="onboarding-dialog"
      onClick={() => {
        if (!lockedSteps) onClose();
      }}
    >
      <style>{motionCss}</style>
      <FadePanel
        panelKey={panelKey}
        style={{
          width: "100%",
          maxHeight: "100%",
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {pagePanel}
      </FadePanel>
    </div>
  );
}
