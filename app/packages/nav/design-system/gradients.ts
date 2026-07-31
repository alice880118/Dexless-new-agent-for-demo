/** Gradient tokens */
export const GRADIENTS = {
  /** Site-wide primary CTA fill (menus: primary button stays on the left) */
  connectBtn:
    "linear-gradient(90deg, #7053f3 0%, #76bab2 62.694%, #e3ff94 137.26%)",
  airdropBorder: "linear-gradient(90deg, #7053f3 0%, #76bab2 45%, #e3ff94 98%)",
  aiText: "linear-gradient(90deg, #cbbfff 0%, #76bab2 59.509%, #e3ff94 129.6%)",
  menuTitle: "linear-gradient(90deg, #c8bfff 0%, #e3ff94 109.18%)",
  navBase: "linear-gradient(90deg, #3b3d48 0%, #121419 8%, #121419 100%)",
} as const;

/** Connected-state glow overlays (fixed width for consistent RWD spacing) */
export const NAV_GLOW = {
  leftWidth: 56,
  rightWidth: 212,
  left: "linear-gradient(90deg, rgb(59,61,72) 0%, rgb(18,20,25) 100%)",
  rightConnected:
    "linear-gradient(90deg, transparent 0%, rgb(113,88,241) 40%, rgba(139,217,202,0.95) 78%, rgba(179,234,176,0.9) 100%)",
} as const;
