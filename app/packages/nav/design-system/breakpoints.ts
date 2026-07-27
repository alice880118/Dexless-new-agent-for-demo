/** Breakpoints: 1920 / 1440 / 1280 / 1024 / 768 / 390 */
export type Breakpoint = "1920" | "1440" | "1280" | "1024" | "768" | "390";

export const BREAKPOINT_MIN: Record<Breakpoint, number> = {
  "1920": 1920,
  "1440": 1440,
  "1280": 1280,
  "1024": 1024,
  "768": 768,
  "390": 0,
};

export function getBreakpoint(width: number): Breakpoint {
  if (width >= 1920) return "1920";
  if (width >= 1440) return "1440";
  if (width >= 1280) return "1280";
  if (width >= 1024) return "1024";
  if (width >= 768) return "768";
  return "390";
}

/** Full desktop nav with tabs (1920 / 1440) */
export function isDesktopNav(bp: Breakpoint): boolean {
  return bp === "1920" || bp === "1440";
}

/** Compact top nav + hamburger (< 1280) */
export function showSideMenu(bp: Breakpoint): boolean {
  return bp === "1280" || bp === "1024" || bp === "768" || bp === "390";
}

/** 768 / 390 share tablet RWD layout */
export function isTabletNav(bp: Breakpoint): boolean {
  return bp === "768" || bp === "390";
}

export function showBottomNav(bp: Breakpoint): boolean {
  return bp === "768" || bp === "390";
}

/** Full-width status footer (1024 / 1280 / 1440 / 1920) */
export function showSiteFooter(bp: Breakpoint): boolean {
  return !showBottomNav(bp);
}
