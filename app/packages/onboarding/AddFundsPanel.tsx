import { useEffect, useRef, useState } from "react";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import {
  CHAINS,
  DEPOSIT_ADDRESS,
  ONBOARDING_ASSETS,
  type ChainId,
} from "./assets";
import { OnboardingShell, PrimaryButton } from "./OnboardingShell";

type AddFundsPanelProps = {
  onDone?: () => void;
  onClose?: () => void;
};

function ChainList({
  chainId,
  onSelect,
}: {
  chainId: ChainId;
  onSelect: (id: ChainId) => void;
}) {
  return (
    <>
      {CHAINS.map((chain) => {
        const active = chain.id === chainId;
        return (
          <button
            key={chain.id}
            type="button"
            onClick={() => onSelect(chain.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "12px 16px",
              border: "none",
              borderRadius: 8,
              background: active ? "rgba(255,255,255,0.08)" : "transparent",
              cursor: "pointer",
              fontFamily: FONT,
              textAlign: "left",
            }}
          >
            <img
              src={chain.icon}
              alt=""
              width={20}
              height={20}
              style={{
                display: "block",
                borderRadius: 999,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {chain.label}
            </span>
          </button>
        );
      })}
    </>
  );
}

export function AddFundsPanel({ onDone, onClose }: AddFundsPanelProps) {
  const [chainId, setChainId] = useState<ChainId>("ethereum");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedTip, setCopiedTip] = useState(false);
  const tipTimer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useBreakpoint() === "390";

  const selected = CHAINS.find((c) => c.id === chainId) ?? CHAINS[4];

  useEffect(() => {
    if (!menuOpen || isMobile) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen, isMobile]);

  useEffect(() => {
    return () => {
      if (tipTimer.current) window.clearTimeout(tipTimer.current);
    };
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    } catch {
      // ignore
    }
    setCopiedTip(true);
    if (tipTimer.current) window.clearTimeout(tipTimer.current);
    tipTimer.current = window.setTimeout(() => setCopiedTip(false), 1800);
  };

  const selectChain = (id: ChainId) => {
    setChainId(id);
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: isMobile ? 360 : 820,
      }}
    >
      {copiedTip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 10,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          <img
            src={ONBOARDING_ASSETS.copyCheck}
            alt=""
            width={16}
            height={16}
            style={{ display: "block", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "18px",
              color: "#ffffff",
            }}
          >
            Address copied successfully
          </span>
        </div>
      )}

      <OnboardingShell stage="funds" onClose={onClose}>
        <style>{`
          .chain-menu-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
          @keyframes chainDrawerIn {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes chainDrawerBackdropIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
              Add funds to make your first trade
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
              Choose a network, then transfer funds from another wallet or
              exchange.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              ref={menuRef}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "relative",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Deposit Network
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  height: 44,
                  padding: "4px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Chain
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <img
                      src={selected.icon}
                      alt=""
                      width={18}
                      height={18}
                      style={{
                        display: "block",
                        borderRadius: 999,
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {selected.label}
                    </span>
                  </span>
                  <img
                    src={ONBOARDING_ASSETS.chevronDown}
                    alt=""
                    width={16}
                    height={17}
                    style={{
                      display: "block",
                      transform: menuOpen ? "rotate(180deg)" : undefined,
                      transition: "transform 0.15s",
                    }}
                  />
                </span>
              </button>

              {menuOpen && !isMobile && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    zIndex: 30,
                    background: COLORS.menuBg,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: 4,
                    boxSizing: "border-box",
                    maxHeight: 240,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                  }}
                  className="chain-menu-scroll"
                >
                  <ChainList chainId={chainId} onSelect={selectChain} />
                </div>
              )}

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: COLORS.brandGreen,
                }}
              >
                Select the same network in the wallet you’re sending from.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Deposit Address
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  height: 44,
                  padding: "6px 12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: FONT,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {DEPOSIT_ADDRESS}
                </span>
                <button
                  type="button"
                  aria-label="Copy address"
                  onClick={copyAddress}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    display: "inline-flex",
                  }}
                >
                  <img
                    src={ONBOARDING_ASSETS.copy}
                    alt=""
                    width={21}
                    height={21}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <PrimaryButton label="Done" onClick={onDone} />
      </OnboardingShell>

      {menuOpen && isMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            aria-label="Close chain menu"
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              margin: 0,
              padding: 0,
              border: "none",
              background: "rgba(0,0,0,0.55)",
              cursor: "pointer",
              animation: "chainDrawerBackdropIn 0.22s ease-out both",
            }}
          />
          <div
            role="dialog"
            aria-label="Select chain"
            style={{
              position: "relative",
              width: "100%",
              maxHeight: "70vh",
              background: "#121419",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderTop: "1px solid #424242",
              boxSizing: "border-box",
              padding: "12px 12px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              animation:
                "chainDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 999,
                background: "rgba(255,255,255,0.2)",
                alignSelf: "center",
                marginBottom: 4,
              }}
            />
            <p
              style={{
                margin: "0 4px 4px",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: "#ffffff",
              }}
            >
              Select network
            </p>
            <div
              className="chain-menu-scroll"
              style={{
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                maxHeight: "calc(70vh - 80px)",
              }}
            >
              <ChainList chainId={chainId} onSelect={selectChain} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
