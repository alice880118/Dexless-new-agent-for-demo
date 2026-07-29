import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const ANIM_MS = 200;

const fadeStyle = (mode: "in" | "out"): CSSProperties => ({
  animation:
    mode === "in"
      ? `onboardingFadeIn ${ANIM_MS}ms ease-out both`
      : `onboardingFadeOut ${ANIM_MS}ms ease-in both`,
});

/** Soft fade + slight rise when switching modal panels */
export function FadePanel({
  panelKey,
  children,
  style,
}: {
  panelKey: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const [shownKey, setShownKey] = useState(panelKey);
  const [mode, setMode] = useState<"in" | "out">("in");
  const [content, setContent] = useState(children);
  const latestChildren = useRef(children);
  latestChildren.current = children;

  useEffect(() => {
    if (panelKey === shownKey) {
      setContent(latestChildren.current);
      return;
    }
    setMode("out");
    const t = window.setTimeout(() => {
      setShownKey(panelKey);
      setContent(latestChildren.current);
      setMode("in");
    }, ANIM_MS);
    return () => window.clearTimeout(t);
  }, [panelKey, shownKey]);

  useEffect(() => {
    if (panelKey === shownKey && mode === "in") {
      setContent(children);
    }
  }, [children, panelKey, shownKey, mode]);

  return <div style={{ ...fadeStyle(mode), ...style }}>{content}</div>;
}

export const ONBOARDING_MOTION_CSS = `
@keyframes onboardingFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes onboardingFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(4px); }
}
@keyframes onboardingSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes onboardingOverlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;
