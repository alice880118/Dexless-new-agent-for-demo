import { useEffect, useState } from "react";
import { type Breakpoint, getBreakpoint } from "./tokens";

/** Prefer layout viewport used by CSS media queries (DevTools device mode safe). */
function readViewportWidth(): number {
  if (typeof window === "undefined") return 1920;
  return Math.round(window.visualViewport?.width ?? window.innerWidth);
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    getBreakpoint(readViewportWidth()),
  );

  useEffect(() => {
    const onChange = () => setBp(getBreakpoint(readViewportWidth()));
    onChange();

    window.addEventListener("resize", onChange);
    window.visualViewport?.addEventListener("resize", onChange);

    // matchMedia tracks DevTools device emulation more reliably than resize alone
    const mqs = [
      window.matchMedia("(max-width: 767px)"),
      window.matchMedia("(max-width: 1023px)"),
      window.matchMedia("(max-width: 1279px)"),
      window.matchMedia("(max-width: 1439px)"),
      window.matchMedia("(max-width: 1919px)"),
    ];
    mqs.forEach((mq) => mq.addEventListener("change", onChange));

    return () => {
      window.removeEventListener("resize", onChange);
      window.visualViewport?.removeEventListener("resize", onChange);
      mqs.forEach((mq) => mq.removeEventListener("change", onChange));
    };
  }, []);

  return bp;
}
