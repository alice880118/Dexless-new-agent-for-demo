/** Typography — Poppins (weights: 400 regular, 500 medium, 600 semibold) */
export const FONT = "'Poppins', sans-serif";

export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

export const TYPE = {
  nav: { fontSize: 14, lineHeight: "20px" },
  menuTitle: { fontSize: 14, lineHeight: "20px" },
  menuDesc: { fontSize: 12, lineHeight: "16px" },
  sideItem: { fontSize: 16, lineHeight: "26px" },
  bottomLabel: { fontSize: 10, lineHeight: "14px" },
} as const;
