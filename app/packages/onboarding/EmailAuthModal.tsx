import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { COLORS, FONT, MODAL_WIDTH } from "../nav/design-system";
import {
  NEW_USER_EMAIL,
  NEW_USER_CODE,
  OLD_USER_EMAIL,
  OLD_USER_CODE,
  ONBOARDING_ASSETS,
  RESEND_COOLDOWN_SEC,
} from "./assets";

export type EmailAuthStep = "email" | "code";
export type EmailUserKind = "new" | "old";

type EmailAuthModalProps = {
  step: EmailAuthStep;
  email: string;
  onEmailChange: (value: string) => void;
  onBack: () => void;
  onClose: () => void;
  onCodeVerified: (kind: EmailUserKind) => void;
  onGoToCode: (email: string) => void;
};

type EmailStatus =
  | "idle"
  | "empty"
  | "invalid"
  | "sending"
  | "send_fail"
  | "rate_limit";

type CodeStatus =
  | "idle"
  | "verifying"
  | "success"
  | "incorrect"
  | "expired"
  | "resending"
  | "resent"
  | "resend_fail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string): string {
  return value
    .trim()
    .toLowerCase()
    // Mobile keyboards / paste can insert invisible chars
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, "");
}

/** Demo accounts are bare tokens `new` / `old` (also accept local-part before @). */
function resolveDemoUserKind(email: string): EmailUserKind | null {
  const e = normalizeEmail(email);
  const local = e.includes("@") ? e.slice(0, e.indexOf("@")) : e;
  if (local === OLD_USER_EMAIL) return "old";
  if (local === NEW_USER_EMAIL) return "new";
  return null;
}

function isDemoEmail(value: string): boolean {
  return resolveDemoUserKind(value) !== null;
}

function isValidEmailInput(value: string): boolean {
  return isDemoEmail(value) || EMAIL_RE.test(value.trim());
}

const modalShell: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: MODAL_WIDTH.compact,
  background: "#0b0d12",
  borderRadius: 16,
  border: "1px solid #424242",
  padding: "28px 24px 20px",
  boxSizing: "border-box",
  fontFamily: FONT,
};

const statusText: CSSProperties = {
  margin: "8px 0 0",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "18px",
  textAlign: "center",
};

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
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
      <img src={ONBOARDING_ASSETS.close} alt="" width={14} height={14} />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={onClick}
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        width: 28,
        height: 28,
        borderRadius: 999,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <img src={ONBOARDING_ASSETS.back} alt="" width={16} height={16} />
    </button>
  );
}

function PrivyFooter() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 24,
      }}
    >
      <span style={{ fontSize: 12, color: COLORS.white40, fontWeight: 500 }}>
        Protected by
      </span>
      <img
        src={ONBOARDING_ASSETS.privy}
        alt="privy"
        style={{ display: "block", height: 14, width: "auto" }}
      />
    </div>
  );
}

function emailStatusMessage(status: EmailStatus): string | null {
  switch (status) {
    case "empty":
      return "Enter your email";
    case "invalid":
      return "Enter a valid email address.";
    case "sending":
      return "Sending code...";
    case "send_fail":
      return "Unable to send the code. Please try again.";
    case "rate_limit":
      return "Too many attempts. Please try again later.";
    default:
      return null;
  }
}

function codeStatusMessage(
  status: CodeStatus,
  countdown: number,
): { text: string; color: string } | null {
  switch (status) {
    case "verifying":
      return { text: "Verifying code...", color: COLORS.white50 };
    case "success":
      return { text: "Success!", color: COLORS.brandGreen };
    case "incorrect":
      return { text: "Incorrect code. Please try again.", color: "#ff6b6b" };
    case "expired":
      return {
        text: "This code has expired. Request a new one.",
        color: "#ff6b6b",
      };
    case "resending":
      return { text: "Resending code...", color: COLORS.white50 };
    case "resent":
      return { text: "A new code has been sent.", color: COLORS.brandGreen };
    case "resend_fail":
      return {
        text: "Unable to resend the code. Please try again.",
        color: "#ff6b6b",
      };
    default:
      if (countdown > 0) {
        return {
          text: `Resend code in ${countdown}s`,
          color: COLORS.white40,
        };
      }
      return null;
  }
}

export function EmailAuthModal({
  step,
  email,
  onEmailChange,
  onBack,
  onClose,
  onCodeVerified,
  onGoToCode,
}: EmailAuthModalProps) {
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [sendCount, setSendCount] = useState(0);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [codeStatus, setCodeStatus] = useState<CodeStatus>("idle");
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyLock = useRef(false);
  /** Snapshot at code-step entry — avoids mobile input mutation losing `old`/`new`. */
  const emailAtCodeRef = useRef(email);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (step === "code") {
      emailAtCodeRef.current = email;
      setDigits(["", "", "", "", "", ""]);
      setCodeStatus("idle");
      setCountdown(RESEND_COOLDOWN_SEC);
      verifyLock.current = false;
      window.setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [step, email]);

  const submitEmail = (override?: string) => {
    const value = (override ?? email).trim();
    if (!value) {
      setEmailStatus("empty");
      return;
    }
    if (!isValidEmailInput(value)) {
      setEmailStatus("invalid");
      return;
    }
    if (sendCount >= 5) {
      setEmailStatus("rate_limit");
      return;
    }
    if (normalizeEmail(value) === "fail@test.com") {
      setEmailStatus("sending");
      window.setTimeout(() => setEmailStatus("send_fail"), 800);
      setSendCount((n) => n + 1);
      return;
    }
    setEmailStatus("sending");
    setSendCount((n) => n + 1);
    const normalized = normalizeEmail(value);
    emailAtCodeRef.current = normalized;
    window.setTimeout(() => {
      setEmailStatus("idle");
      onEmailChange(normalized);
      onGoToCode(normalized);
    }, 800);
  };

  const verifyCode = (code: string) => {
    if (verifyLock.current) return;
    verifyLock.current = true;
    setCodeStatus("verifying");
    window.setTimeout(() => {
      const kind =
        resolveDemoUserKind(emailAtCodeRef.current) ??
        resolveDemoUserKind(email);
      const codeOk =
        code === NEW_USER_CODE || code === OLD_USER_CODE;
      if (kind && codeOk) {
        setCodeStatus("success");
        window.setTimeout(() => onCodeVerified(kind), 700);
        return;
      }
      if (code === "000000") {
        setCodeStatus("expired");
        verifyLock.current = false;
        return;
      }
      setCodeStatus("incorrect");
      verifyLock.current = false;
    }, 700);
  };

  const onDigitChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (codeStatus === "incorrect" || codeStatus === "expired") {
      setCodeStatus("idle");
    }
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
    const joined = next.join("");
    if (joined.length === 6) verifyCode(joined);
  };

  const onDigitKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    if (pasted.length === 6) verifyCode(pasted);
    else inputRefs.current[pasted.length]?.focus();
  };

  const resendCode = () => {
    if (countdown > 0 || codeStatus === "resending") return;
    setCodeStatus("resending");
    window.setTimeout(() => {
      setCodeStatus("resent");
      setCountdown(RESEND_COOLDOWN_SEC);
      setDigits(["", "", "", "", "", ""]);
      verifyLock.current = false;
      inputRefs.current[0]?.focus();
      window.setTimeout(() => {
        setCodeStatus((s) => (s === "resent" ? "idle" : s));
      }, 1500);
    }, 800);
  };

  const emailMsg = emailStatusMessage(emailStatus);
  const codeMsg = codeStatusMessage(codeStatus, countdown);
  const isSuccess = codeStatus === "success";
  const shellStyle = modalShell;

  if (step === "email") {
    return (
      <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            paddingTop: 8,
          }}
        >
          <img
            src={ONBOARDING_ASSETS.logoMark}
            alt=""
            width={36}
            height={36}
            style={{ display: "block", objectFit: "contain" }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              lineHeight: "24px",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Log in or sign up
          </h2>

          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                height: 48,
                padding: "0 10px",
                borderRadius: 10,
                border: `1px solid ${
                  emailStatus === "invalid" || emailStatus === "empty"
                    ? "rgba(255,107,107,0.6)"
                    : "rgba(255,255,255,0.12)"
                }`,
                background: "rgba(255,255,255,0.03)",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.06)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img src={ONBOARDING_ASSETS.mail} alt="" width={14} height={14} />
              </span>
              <input
                type="text"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                spellCheck={false}
                value={email}
                placeholder="Enter your email"
                disabled={emailStatus === "sending"}
                onChange={(e) => {
                  onEmailChange(e.target.value);
                  if (emailStatus !== "idle" && emailStatus !== "sending") {
                    setEmailStatus("idle");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitEmail();
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: FONT,
                }}
              />
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    onEmailChange(OLD_USER_EMAIL);
                    submitEmail(OLD_USER_EMAIL);
                  }}
                  style={{
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 8px",
                    background: "rgba(255,255,255,0.08)",
                    color: COLORS.white50,
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: FONT,
                    cursor: "pointer",
                  }}
                >
                  old
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onEmailChange(NEW_USER_EMAIL);
                    submitEmail(NEW_USER_EMAIL);
                  }}
                  style={{
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 8px",
                    background: "rgba(255,255,255,0.08)",
                    color: COLORS.white50,
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: FONT,
                    cursor: "pointer",
                  }}
                >
                  new
                </button>
              </div>
            </div>
            {emailMsg && (
              <p
                style={{
                  ...statusText,
                  textAlign: "left",
                  color:
                    emailStatus === "sending"
                      ? COLORS.white50
                      : "#ff6b6b",
                }}
              >
                {emailMsg}
              </p>
            )}
          </div>
        </div>
        <PrivyFooter />
      </div>
    );
  }

  return (
    <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
      <BackButton
        onClick={() => {
          onBack();
          setEmailStatus("idle");
        }}
      />
      <CloseButton onClick={onClose} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          paddingTop: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={ONBOARDING_ASSETS.mail} alt="" width={22} height={22} />
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "24px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Enter confirmation code
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white60,
            textAlign: "center",
          }}
        >
          Please check{" "}
          <span style={{ color: "#ffffff", fontWeight: 600 }}>{email}</span> for
          an email from privy.io and enter your code below.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            justifyContent: "center",
          }}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              className="otp-digit-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              disabled={isSuccess || codeStatus === "verifying"}
              onChange={(e) => onDigitChange(i, e.target.value)}
              onKeyDown={(e) => onDigitKeyDown(i, e)}
              onPaste={onDigitPaste}
              onFocus={(e) => {
                // Avoid iOS scroll-into-view jumping the modal
                e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
              }}
              style={{
                width: 40,
                height: 48,
                borderRadius: 8,
                border: isSuccess
                  ? `1px solid ${COLORS.brandGreen}`
                  : codeStatus === "incorrect" || codeStatus === "expired"
                    ? "1px solid rgba(255,107,107,0.7)"
                    : "1px solid rgba(255,255,255,0.12)",
                background: isSuccess
                  ? "rgba(219,253,92,0.12)"
                  : "rgba(255,255,255,0.04)",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 600,
                textAlign: "center",
                fontFamily: FONT,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>

        {codeMsg && codeStatus !== "idle" && (
          <p style={{ ...statusText, color: codeMsg.color }}>{codeMsg.text}</p>
        )}

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: COLORS.white50,
            textAlign: "center",
          }}
        >
          Didn{"\u2019"}t get an email?{" "}
          {countdown > 0 ? (
            <span style={{ color: COLORS.white40 }}>
              Resend code in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={resendCode}
              disabled={codeStatus === "resending" || isSuccess}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Resend code
            </button>
          )}
        </p>
      </div>
      <PrivyFooter />
    </div>
  );
}
