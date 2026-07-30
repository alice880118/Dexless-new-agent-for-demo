/** Paths under /public/onboarding */
export const ONBOARDING_ASSETS = {
  info: "/onboarding/info.png",
  /** Sign In hero for <768 mobile layout */
  infoMobile: "/onboarding/sign-in-hero-mobile.png",
  logo: "/nav/logo.png",
  logoWordmark: "/nav/logo.png",
  logoMark: "/onboarding/logo-mark.png",
  stepActive: "/onboarding/step-active.png",
  stepDefault: "/onboarding/step-default.png",
  stepLine: "/onboarding/step-line.png",
  stepLineActive: "/onboarding/step-line-active.png",
  circleCheck: "/onboarding/circle-check.svg",
  circleCheckGreen: "/onboarding/circle-check-green.svg",
  circleCheckReady: "/onboarding/circle-check-ready.png",
  circleCheckReady12: "/onboarding/circle-check-ready-12.svg",
  circleCheckTeal: "/onboarding/circle-check-teal.png",
  progressCheck: "/onboarding/progress-check.svg",
  stepDoneCheck: "/onboarding/step-done-check.svg",
  stepConnector: "/onboarding/step-connector.svg",
  stepConnectorDone: "/onboarding/step-connector-done.svg",
  depositQr: "/onboarding/deposit-qr.png",
  evmNetworkIcons: [
    "/onboarding/evm-icons/1.png",
    "/onboarding/evm-icons/2.png",
    "/onboarding/evm-icons/3.png",
    "/onboarding/evm-icons/4.png",
    "/onboarding/evm-icons/5.png",
  ] as const,
  walletIcon: "/onboarding/wallet-icon.svg",
  arrowRight: "/onboarding/arrow-right.png",
  checkbox: "/onboarding/checkbox.png",
  checkboxOn: "/onboarding/checkbox-checked.png",
  spinner: "/onboarding/spinner.png",
  copy: "/onboarding/copy.png",
  copy20: "/onboarding/copy-20.svg",
  copyCheck: "/onboarding/copy-check.png",
  traderDnaLive: "/onboarding/trader-dna-live.png",
  accountLiveHero: "/onboarding/account-live-hero.png",
  accountLiveBg: "/onboarding/account-live-bg.json",
  accountLiveBrain: "/onboarding/account-live-brain.json",
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

/** Wallet Add funds — deposit token picker */
export const DEPOSIT_TOKENS = [
  {
    id: "usdc",
    label: "USDC",
    icon: "/onboarding/tokens/usdc.png",
    balance: "0.000000",
  },
  {
    id: "usdt",
    label: "USDT",
    icon: "/onboarding/tokens/usdt.png",
    balance: "0.000000",
  },
  {
    id: "yusd",
    label: "YUSD",
    icon: "/onboarding/tokens/yusd.png",
    balance: "0.00000000",
  },
  {
    id: "bnb",
    label: "BNB",
    icon: "/onboarding/tokens/bnb.png",
    balance: "0.00000000",
  },
  {
    id: "usd1",
    label: "USD1",
    icon: "/onboarding/tokens/usd1.png",
    balance: "0.00000000",
  },
] as const;

export type DepositTokenId = (typeof DEPOSIT_TOKENS)[number]["id"];

