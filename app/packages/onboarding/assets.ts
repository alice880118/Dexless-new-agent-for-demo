/** Paths under /public/onboarding */
export const ONBOARDING_ASSETS = {
  info: "/onboarding/info.png",
  /** Sign In hero for <768 mobile layout */
  infoMobile: "/onboarding/info-mobile.png",
  logo: "/nav/logo.png",
  logoWordmark: "/nav/logo.png",
  logoMark: "/onboarding/logo-mark.png",
  stepActive: "/onboarding/step-active.png",
  stepDefault: "/onboarding/step-default.png",
  stepLine: "/onboarding/step-line.png",
  stepLineActive: "/onboarding/step-line-active.png",
  circleCheck: "/onboarding/circle-check.png",
  circleCheckGreen: "/onboarding/circle-check-green.svg",
  walletIcon: "/onboarding/wallet-icon.png",
  arrowRight: "/onboarding/arrow-right.png",
  checkbox: "/onboarding/checkbox.png",
  checkboxOn: "/onboarding/checkbox-checked.png",
  spinner: "/onboarding/spinner.png",
  copy: "/onboarding/copy.png",
  copyCheck: "/onboarding/copy-check.png",
  traderDnaLive: "/onboarding/trader-dna-live.png",
  signIcon: "/onboarding/sign-icon.svg",
  close: "/onboarding/close.svg",
  back: "/onboarding/back.svg",
  mail: "/onboarding/mail.svg",
  privy: "/onboarding/privy.svg",
  arbitrum: "/onboarding/arbitrum.png",
  chevronDown: "/onboarding/chevron-down.png",
  wcQr: "/onboarding/walletconnect/qr.png",
  wcLink: "/onboarding/walletconnect/link.svg",
  wcGrid: "/onboarding/walletconnect/grid.svg",
} as const;

export const LOGO_WIDTH = 96;

/** New user registration demo */
export const NEW_USER_EMAIL = "new";
export const NEW_USER_CODE = "111111";

/** Returning user login demo — skip onboarding to Trader DNA live */
export const OLD_USER_EMAIL = "old";
export const OLD_USER_CODE = "111111";

/** @deprecated use NEW_USER_* / OLD_USER_* */
export const DEMO_EMAIL = NEW_USER_EMAIL;
export const DEMO_CODE = NEW_USER_CODE;

export const RESEND_COOLDOWN_SEC = 30;

export const WC_COPY_LINK = "https://walletconnect.com/wc?uri=demo";


export const SIGN_PAYLOAD = {
  domain: {
    name: "Orderly",
    version: "1",
    chainId: 42161,
    verifyingContract: "0xCcCCcccccccCCCCcCCCCCCCCCCCCCCCCCCCCCCC",
  },
  message: {
    brokerId: "dexless",
    orderlyKey: "ed25519:65GzjDit7tAmvrskrgu7be...",
    scope: "read,trading",
    chainId: 42161,
    timestamp: 1784531855571,
    expiration: 1816067855571,
  },
} as const;

export const DEPOSIT_ADDRESS = "0x1CB2be667f2Ffa2d3722F01D072A216A1d15F193";

export const CHAINS = [
  { id: "arbitrum", label: "Arbitrum", icon: "/onboarding/chains/arbitrum.png" },
  { id: "optimism", label: "Optimism", icon: "/onboarding/chains/optimism.png" },
  { id: "base", label: "Base", icon: "/onboarding/chains/base.png" },
  { id: "mantle", label: "Mantle", icon: "/onboarding/chains/mantle.png" },
  { id: "ethereum", label: "Ethereum", icon: "/onboarding/chains/ethereum.png" },
  { id: "sei", label: "Sei Network", icon: "/onboarding/chains/sei.png" },
  { id: "avalanche", label: "Avalanche", icon: "/onboarding/chains/avalanche.png" },
  { id: "solana", label: "Solana", icon: "/onboarding/chains/solana.png" },
] as const;

export type ChainId = (typeof CHAINS)[number]["id"];

