import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COLORS, FONT } from "../nav/design-system";
import { useBreakpoint } from "../nav/useBreakpoint";
import {
  CHAINS,
  DEPOSIT_ADDRESS,
  DEPOSIT_TOKENS,
  ONBOARDING_ASSETS,
  type ChainId,
  type DepositTokenId,
} from "./assets";
import { OnboardingShell, PrimaryButton, SecondaryButton } from "./OnboardingShell";

export type AddFundsVariant = "wallet" | "email";

type AddFundsPanelProps = {
  /** wallet = connected-wallet deposit; email = QR / address deposit */
  variant?: AddFundsVariant;
  onDone?: () => void;
  onClose?: () => void;
};

const WALLET_ADDRESS_SHORT = "0x4555...dB1D";
/** Demo available balance for wallet deposit (USDC) */
const AVAILABLE_BALANCE = 500;

function sanitizeAmountInput(raw: string, max: number): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");
  const normalized =
    firstDot === -1
      ? cleaned
      : `${cleaned.slice(0, firstDot + 1)}${cleaned
          .slice(firstDot + 1)
          .replace(/\./g, "")}`;
  if (normalized === "" || normalized === ".") return normalized;
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n)) return "";
  if (n > max) {
    return Number.isInteger(max) ? String(max) : max.toFixed(2);
  }
  return normalized;
}

function parseAmountValue(raw: string): number {
  if (!raw || raw === ".") return 0;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function estimateGasFee(amount: number): { usd: number; eth: number } {
  if (amount <= 0) return { usd: 0, eth: 0 };
  const usd = 0.06 + amount * 0.00018 + Math.min(amount, 200) * 0.00025;
  const eth = usd / 2400;
  return { usd, eth };
}

function formatGasLabel(usd: number, eth: number): string {
  if (usd <= 0) return "≈ $0.00";
  return `≈ $${usd.toFixed(2)} (${eth.toFixed(8)}ETH)`;
}

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

function QrBlock({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        border: "2px solid transparent",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        backgroundImage: [
          "linear-gradient(#ffffff, #ffffff)",
          "linear-gradient(90deg, #7053f3 0%, #76bab2 45%, #e3ff94 98%)",
        ].join(", "),
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <img
        src={ONBOARDING_ASSETS.depositQr}
        alt="Deposit QR code"
        width={size}
        height={size}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

function EvmNetworksRow({ onViewAll }: { onViewAll: () => void }) {
  return (
    <button
      type="button"
      onClick={onViewAll}
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
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        EVM network
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: "block",
            width: 44,
            height: 16,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {ONBOARDING_ASSETS.evmNetworkIcons.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              width={16}
              height={16}
              style={{
                display: "block",
                width: 16,
                height: 16,
                borderRadius: 999,
                objectFit: "cover",
                position: "absolute",
                left: i * 7,
                top: 0,
                zIndex: i + 1,
              }}
            />
          ))}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.6)",
            whiteSpace: "nowrap",
          }}
        >
          View all
        </span>
      </span>
    </button>
  );
}

export function AddFundsPanel({
  variant = "email",
  onDone,
  onClose,
}: AddFundsPanelProps) {
  const [chainId, setChainId] = useState<ChainId>("ethereum");
  const [tokenId, setTokenId] = useState<DepositTokenId>("usdc");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tokenMenuOpen, setTokenMenuOpen] = useState(false);
  const [copiedTip, setCopiedTip] = useState(false);
  const [amount, setAmount] = useState("");
  const [gasUsd, setGasUsd] = useState(0);
  const [gasEth, setGasEth] = useState(0);
  const [depositing, setDepositing] = useState(false);
  const [depositNotice, setDepositNotice] = useState(false);
  const tipTimer = useRef<number | null>(null);
  const depositTimer = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const tokenMenuRef = useRef<HTMLDivElement | null>(null);
  const gasAnimRef = useRef<number | null>(null);
  const gasDisplayRef = useRef({ usd: 0, eth: 0 });
  const isMobile = useBreakpoint() === "390";
  const selected = CHAINS.find((c) => c.id === chainId) ?? CHAINS[4];
  const selectedToken =
    DEPOSIT_TOKENS.find((t) => t.id === tokenId) ?? DEPOSIT_TOKENS[0];
  const isWalletDesktop = !isMobile && variant === "wallet";
  const isEmailDesktop = !isMobile && variant === "email";
  const isWalletMobile = isMobile && variant === "wallet";
  const isWalletFlow = variant === "wallet";
  const amountValue = parseAmountValue(amount);
  const gasLabel = formatGasLabel(gasUsd, gasEth);

  useEffect(() => {
    if (!menuOpen || isMobile) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen, isMobile]);

  useEffect(() => {
    if (!tokenMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!tokenMenuRef.current?.contains(e.target as Node)) {
        setTokenMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [tokenMenuOpen]);

  useEffect(() => {
    return () => {
      if (tipTimer.current) window.clearTimeout(tipTimer.current);
      if (depositTimer.current) window.clearTimeout(depositTimer.current);
      if (gasAnimRef.current) window.cancelAnimationFrame(gasAnimRef.current);
    };
  }, []);

  useEffect(() => {
    const target = estimateGasFee(amountValue);
    const from = gasDisplayRef.current;
    if (gasAnimRef.current) window.cancelAnimationFrame(gasAnimRef.current);
    const start = performance.now();
    const dur = 320;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - (1 - t) ** 3;
      const usd = from.usd + (target.usd - from.usd) * e;
      const eth = from.eth + (target.eth - from.eth) * e;
      gasDisplayRef.current = { usd, eth };
      setGasUsd(usd);
      setGasEth(eth);
      if (t < 1) {
        gasAnimRef.current = window.requestAnimationFrame(tick);
      } else {
        gasAnimRef.current = null;
      }
    };
    gasAnimRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (gasAnimRef.current) window.cancelAnimationFrame(gasAnimRef.current);
    };
  }, [amountValue]);

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

  const selectToken = (id: DepositTokenId) => {
    setTokenId(id);
    setTokenMenuOpen(false);
  };

  const handleApproveDeposit = () => {
    if (!isWalletFlow || depositing) return;
    setDepositing(true);
    setDepositNotice(true);
    if (depositTimer.current) window.clearTimeout(depositTimer.current);
    depositTimer.current = window.setTimeout(() => {
      setDepositing(false);
      setDepositNotice(false);
      onDone?.();
    }, 2000);
  };

  const handleSkipDeposit = () => {
    if (depositing) return;
    onDone?.();
  };

  const title = isWalletFlow
    ? "Fund your Dexless account"
    : "Fund your Dexless wallet";

  const subtitle = isWalletFlow
    ? "Choose a network and deposit USDC from your connected wallet."
    : "Send from another wallet or exchange to the address below. Make sure you use the same network on both sides.";

  const copiedToast = !isMobile && copiedTip ? (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "calc(100% + 8px)",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(12,13,16,0.95)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxSizing: "border-box",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        width: "fit-content",
        maxWidth: "100%",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "18px",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        Address copied
      </span>
    </div>
  ) : null;

  const desktopWalletBody = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 24 : 12,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 7,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 13,
            fontWeight: 600,
            lineHeight: "18px",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.8)" }}>
            Your Web3 Wallet
          </span>
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              {WALLET_ADDRESS_SHORT}
            </span>
            <button
              type="button"
              aria-label="Copy address"
              onClick={copyAddress}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                width: 20,
                height: 20,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={ONBOARDING_ASSETS.copy20}
                alt=""
                width={20}
                height={20}
                style={{ display: "block" }}
              />
            </button>
            {copiedToast}
          </div>
        </div>

        <div ref={menuRef} style={{ position: "relative", width: "100%" }}>
          <button
            type="button"
            onClick={() => {
              setTokenMenuOpen(false);
              setMenuOpen((o) => !o);
            }}
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
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Chain
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <img
                  src={selected.icon}
                  alt=""
                  width={26}
                  height={26}
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
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.1)",
            boxSizing: "border-box",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minWidth: 0,
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Amount
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              placeholder="0.00"
              onChange={(e) =>
                setAmount(sanitizeAmountInput(e.target.value, AVAILABLE_BALANCE))
              }
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                padding: 0,
                fontFamily: FONT,
                fontSize: 24,
                fontWeight: 500,
                lineHeight: "28px",
                color: amount ? "#ffffff" : "rgba(255,255,255,0.5)",
                fontVariantNumeric: "tabular-nums",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => setAmount(String(AVAILABLE_BALANCE))}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: COLORS.brandGreen,
              }}
            >
              Max
            </button>
            <div ref={tokenMenuRef} style={{ position: "relative" }}>
              <button
                type="button"
                aria-label="Select token"
                aria-expanded={tokenMenuOpen}
                onClick={() => {
                  setMenuOpen(false);
                  setTokenMenuOpen((o) => !o);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 999,
                  border: "none",
                  background: "rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <img
                    src={selectedToken.icon}
                    alt=""
                    width={21}
                    height={21}
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
                    {selectedToken.label}
                  </span>
                </span>
                <img
                  src={ONBOARDING_ASSETS.chevronDown}
                  alt=""
                  width={16}
                  height={17}
                  style={{
                    display: "block",
                    opacity: 0.7,
                    transform: tokenMenuOpen ? "rotate(180deg)" : undefined,
                    transition: "transform 0.15s",
                  }}
                />
              </button>
              {tokenMenuOpen && !isMobile && (
                <div
                  role="listbox"
                  aria-label="Select token"
                  className="chain-menu-scroll"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 40,
                    minWidth: 200,
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
                >
                  {DEPOSIT_TOKENS.map((token) => {
                    const active = token.id === tokenId;
                    return (
                      <button
                        key={token.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => selectToken(token.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          padding: "12px 16px",
                          border: "none",
                          borderRadius: 8,
                          background: active
                            ? "rgba(255,255,255,0.08)"
                            : "transparent",
                          cursor: "pointer",
                          fontFamily: FONT,
                          textAlign: "left",
                        }}
                      >
                        <img
                          src={token.icon}
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
                            flex: 1,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.9)",
                          }}
                        >
                          {token.label}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.5)",
                            flexShrink: 0,
                          }}
                        >
                          {token.balance}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <span>Est. gas fee</span>
          <span
            style={{
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              transition: "opacity 0.15s",
            }}
          >
            {gasLabel}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.8)" }}>Available</span>
          <span style={{ display: "flex", gap: 4 }}>
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {AVAILABLE_BALANCE.toFixed(2)}
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>
              {selectedToken.label}
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  const desktopEmailBody = (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        width: "100%",
      }}
    >
      <QrBlock size={142} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Supported Networks
          </span>
          <div ref={menuRef} style={{ position: "relative", width: "100%" }}>
            <EvmNetworksRow onViewAll={() => setMenuOpen(true)} />
            {menuOpen && (
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
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            width: "100%",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Your Dexless wallet
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              boxSizing: "border-box",
              width: "100%",
              minHeight: 52,
            }}
          >
            <span
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.8)",
                fontFamily: FONT,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                wordBreak: "break-all",
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
                flexShrink: 0,
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
          {copiedToast}
        </div>
      </div>
    </div>
  );

  const mobileEmailBody = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <QrBlock size={120} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Supported Networks
        </span>
        <EvmNetworksRow onViewAll={() => setMenuOpen(true)} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Your Dexless wallet
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            boxSizing: "border-box",
            width: "100%",
            minHeight: 52,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.8)",
              fontFamily: FONT,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              wordBreak: "break-all",
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
              flexShrink: 0,
            }}
          >
            <img src={ONBOARDING_ASSETS.copy} alt="" width={21} height={21} />
          </button>
        </div>
        {copiedToast}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: isMobile ? "100%" : undefined,
        maxWidth: isMobile ? undefined : 820,
        flex: isMobile ? 1 : undefined,
        minHeight: isMobile ? 0 : undefined,
      }}
    >
      <OnboardingShell stage="funds" onClose={onClose}>
        <style>{`
          .chain-menu-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
        `}</style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 24,
            flex: 1,
            minHeight: isMobile ? 0 : 368,
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
            {isMobile ? (
              <div
                aria-hidden
                style={{
                  height: 0,
                  width: 1,
                  marginTop: -2,
                  opacity: 0,
                  pointerEvents: "none",
                  flexShrink: 0,
                }}
              />
            ) : null}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                /* Mobile: pull fund body 20px closer to progress rail */
                gap: isMobile ? 12 : 24,
                width: "100%",
              }}
            >
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
                  {title}
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
                  {subtitle}
                </p>
              </div>

              {isWalletFlow
                ? desktopWalletBody
                : isEmailDesktop
                  ? desktopEmailBody
                  : mobileEmailBody}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isWalletDesktop ? 8 : isWalletMobile ? 12 : 0,
              width: "100%",
              flexShrink: 0,
            }}
          >
            <PrimaryButton
              label={isWalletFlow ? "Approve & Deposit" : "Done"}
              loading={isWalletFlow ? depositing : false}
              onClick={isWalletFlow ? handleApproveDeposit : onDone}
            />
            {isWalletDesktop ? (
              <button
                type="button"
                onClick={handleSkipDeposit}
                disabled={depositing}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: depositing ? "default" : "pointer",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                  opacity: depositing ? 0.4 : 1,
                }}
              >
                I’ll deposit later
              </button>
            ) : null}
            {isWalletMobile ? (
              <SecondaryButton
                label="I’ll deposit later"
                onClick={handleSkipDeposit}
              />
            ) : null}
          </div>
        </div>
      </OnboardingShell>

      {depositNotice &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="status"
            style={{
              position: "fixed",
              top: isMobile ? 60 : 72,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 4500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "min(360px, calc(100vw - 32px))",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(12,13,16,0.95)",
              boxSizing: "border-box",
              boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
              pointerEvents: "none",
              fontFamily: FONT,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: "18px",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              Deposit submitted
            </span>
          </div>,
          document.body,
        )}

      {isMobile &&
        copiedTip &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="status"
            style={{
              position: "fixed",
              top: 60,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 4500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "min(360px, calc(100vw - 32px))",
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(12,13,16,0.95)",
              boxSizing: "border-box",
              boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
              pointerEvents: "none",
              fontFamily: FONT,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: "18px",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              Address copied
            </span>
          </div>,
          document.body,
        )}

      {menuOpen &&
        isMobile &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 4000,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <style>{`
              @keyframes chainDrawerIn {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              @keyframes chainDrawerBackdropIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .chain-menu-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
            `}</style>
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
              aria-label="Supported Networks"
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "85vh",
                background: "#121419",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderTop: "1px solid #424242",
                boxSizing: "border-box",
                padding:
                  "12px 12px calc(24px + env(safe-area-inset-bottom, 0px))",
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
                  fontFamily: FONT,
                }}
              >
                Supported Networks
              </p>
              <div
                className="chain-menu-scroll"
                style={{
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  maxHeight: "calc(85vh - 80px)",
                }}
              >
                <ChainList chainId={chainId} onSelect={selectChain} />
              </div>
            </div>
          </div>,
          document.body,
        )}

      {tokenMenuOpen &&
        isMobile &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 4000,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <style>{`
              @keyframes chainDrawerIn {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              @keyframes chainDrawerBackdropIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .chain-menu-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
            `}</style>
            <button
              type="button"
              aria-label="Close token menu"
              onClick={() => setTokenMenuOpen(false)}
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
              aria-label="Select token"
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "85vh",
                background: "#121419",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderTop: "1px solid #424242",
                boxSizing: "border-box",
                padding:
                  "12px 12px calc(24px + env(safe-area-inset-bottom, 0px))",
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
                  fontFamily: FONT,
                }}
              >
                Select token
              </p>
              <div
                className="chain-menu-scroll"
                style={{
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  maxHeight: "calc(85vh - 80px)",
                }}
              >
                {DEPOSIT_TOKENS.map((token) => {
                  const active = token.id === tokenId;
                  return (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => selectToken(token.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        borderRadius: 8,
                        background: active
                          ? "rgba(255,255,255,0.08)"
                          : "transparent",
                        cursor: "pointer",
                        fontFamily: FONT,
                        textAlign: "left",
                      }}
                    >
                      <img
                        src={token.icon}
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
                          flex: 1,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.9)",
                        }}
                      >
                        {token.label}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.5)",
                          flexShrink: 0,
                        }}
                      >
                        {token.balance}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
