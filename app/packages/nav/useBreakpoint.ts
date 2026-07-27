import { useEffect, useState } from "react";
import { type Breakpoint, getBreakpoint } from "./tokens";

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window === "undefined" ? "1920" : getBreakpoint(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return bp;
}
