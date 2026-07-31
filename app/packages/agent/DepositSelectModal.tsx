import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";

type DepositSelectModalProps = {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
};

const shellBase: CSSProperties = {
  background: "#0c0d10",
  border: "1px solid #383838",
  boxSizing: "border-box",
  fontFamily: FONT,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxHeight: "100%",
  overflow: "hidden",
};

function SelectField({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 10px",
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.05)",
        boxSizing: "border-box",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <img
          src={icon}
          alt=""
          width={18}
          height={18}
          style={{ display: "block", borderRadius: 999, objectFit: "cover" }}
        />
        <span
          style={{
            fontWeight: 600,
            fontSize: 12,
            lineHeight: "18px",
            color: "#ffffff",
          }}
        >
          {label}
        </span>
      </span>
      <img
        src="/onboarding/chevron-down.png"
        alt=""
        width={14}
        height={14}
        style={{ display: "block", opacity: 0.7 }}
      />
    </div>
  );
}

function MetricRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span
        style={{
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
        <span
          style={{
            fontWeight: 600,
            fontSize: 12,
            lineHeight: "12px",
            color: "#ffffff",
            letterSpacing: "-0.36px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "12px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "-0.36px",
          }}
        >
          {unit}
        </span>
      </span>
    </div>
  );
}

export function DepositSelectModal({
  open,
  onClose,
  onApprove,
}: DepositSelectModalProps) {
  const isMobile = useBreakpoint() === "390";
  const [qty, setQty] = useState("3");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQty("3");
  }, [open]);

  if (!open || !mounted || typeof document === "undefined") return null;

  const content = (
    <div
      style={{
        ...shellBase,
        borderRadius: isMobile ? "8px 8px 0 0" : 8,
        maxWidth: isMobile ? undefined : 420,
        /* dvh avoids in-app browser chrome clipping the sheet footer CTA */
        maxHeight: isMobile
          ? "min(90dvh, 90vh)"
          : "min(720px, 92dvh, 92vh)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #383838",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "18px",
            letterSpacing: "0.14px",
            color: "#ffffff",
          }}
        >
          Deposit to Dexless Account
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            width: 16,
            height: 16,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "inline-flex",
            flexShrink: 0,
          }}
        >
          <img
            src="/trader-dna/close.svg"
            alt=""
            width={16}
            height={16}
            style={{ display: "block", width: 16, height: 16 }}
          />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "12px 20px 0",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {(["Deposit", "Withdraw", "Transfer"] as const).map((tab) => {
          const active = tab === "Deposit";
          return (
            <div
              key={tab}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: active ? "#ffffff" : COLORS.white50,
                }}
              >
                {tab}
              </span>
              {active && (
                <span
                  style={{
                    width: 40,
                    height: 2,
                    background: COLORS.brandGreen,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "18px",
              color: COLORS.white60,
            }}
          >
            From
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
                fontSize: 12,
                lineHeight: "18px",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.8)" }}>
                Your Web3 Wallet
              </span>
              <span style={{ color: COLORS.white60 }}>0x7Bc2...6E12</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <SelectField
                icon="/trader-dna/draft/usdc.png"
                label="USDC"
              />
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  color: COLORS.white60,
                  flexShrink: 0,
                }}
              >
                on
              </span>
              <SelectField
                icon="/onboarding/chains/ethereum.png"
                label="Ethereum"
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontWeight: 500,
                fontSize: 13,
                lineHeight: "18px",
                color: COLORS.white60,
              }}
            >
              Quantity
            </span>
            <div
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                boxSizing: "border-box",
              }}
            >
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                }}
              />
              <button
                type="button"
                onClick={() => setQty("3")}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#e2fd7d",
                }}
              >
                Max
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                lineHeight: "18px",
              }}
            >
              <span style={{ fontWeight: 500, color: COLORS.white40 }}>$2.99</span>
              <span>
                <span style={{ fontWeight: 500, color: COLORS.white40 }}>
                  Available{" "}
                </span>
                <span style={{ fontWeight: 600, color: COLORS.white60 }}>3</span>
                <span style={{ fontWeight: 500, color: COLORS.white40 }}>
                  {" "}
                  USDC
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            width: "100%",
          }}
        >
          <span
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.15)",
            }}
          />
          <span
            style={{
              width: 24,
              height: 24,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.brandGreen,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            ↓
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.15)",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "18px",
              color: COLORS.white60,
            }}
          >
            To
          </p>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: 12,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Your Dexless Account
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontWeight: 500,
                fontSize: 13,
                lineHeight: "18px",
                color: COLORS.white60,
              }}
            >
              Quantity
            </span>
            <div
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.05)",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontWeight: 600,
                  fontSize: 14,
                  color: COLORS.white60,
                }}
              >
                {qty || "0"}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: COLORS.white50,
                  opacity: 0.5,
                  padding: "4px 8px",
                }}
              >
                USDC
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "18px",
                color: COLORS.white40,
              }}
            >
              Est. gas fee ≈ $0.14 (0.00007099ETH)
            </p>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.05)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <MetricRow label="Collateral ratio" value="100.00" unit="%" />
          <MetricRow
            label="Collateral contribution"
            value="2.99847"
            unit="USDC"
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              LTV
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              0 % → 0 %
            </span>
          </div>
        </div>
      </div>

      {/* Sticky footer CTA — stays above in-app / browser bottom chrome */}
      <div
        style={{
          flexShrink: 0,
          padding: isMobile
            ? "12px 20px calc(16px + env(safe-area-inset-bottom, 0px) + 24px)"
            : "12px 20px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "#0c0d10",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onApprove}
          style={{
            width: "100%",
            minHeight: 32,
            border: "none",
            borderRadius: 999,
            padding: "6px 16px",
            cursor: "pointer",
            backgroundImage: GRADIENTS.connectBtn,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "20px",
            color: "#ffffff",
          }}
        >
          Approve & Deposit
        </button>
      </div>
    </div>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Deposit to Dexless Account"
      data-agent-surface="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 16,
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.55)",
      }}
      onClick={onClose}
    >
      {isMobile && (
        <style>{`
          @keyframes draftDepositDrawerIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      )}
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? undefined : 420,
          animation: isMobile
            ? "draftDepositDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
            : undefined,
        }}
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}
