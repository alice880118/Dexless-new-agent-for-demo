import { useEffect, useState } from "react";
import type { LottieComponentProps } from "lottie-react";
import { FONT } from "../nav/design-system";
import { ONBOARDING_ASSETS } from "./assets";

type LottieComponent = React.ComponentType<LottieComponentProps>;

const FLOAT_CSS = `
@keyframes accountLiveTagFloatA {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -6px, 0); }
}
@keyframes accountLiveTagFloatB {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -6px, 0); }
}
`;

/** Orbit / bg rings scale inside clipped frame */
const BG_SCALE = 1.6;
/** Main character is 1.3× smaller than previous (1.6 / 1.3) */
const CHAR_SCALE = 1.6 / 1.3;

type AccountLiveHeroLottieProps = {
  /** Mobile flow uses Figma ~342×278 frame */
  tall?: boolean;
  /** Match shell / popup fill so hero has no visible block seam */
  surfaceColor?: string;
};

/** Remove opaque solid layers from bg Lottie (keep orbit rings). */
function stripSolidFills(
  data: LottieComponentProps["animationData"],
): LottieComponentProps["animationData"] {
  if (!data || typeof data !== "object") return data;
  const raw = data as { layers?: { ty?: number; nm?: string }[] };
  if (!Array.isArray(raw.layers)) return data;
  return {
    ...raw,
    layers: raw.layers.filter(
      (layer) => layer.ty !== 1 && !/solid/i.test(layer.nm ?? ""),
    ),
  };
}

/**
 * Account-live hero: bg rings + Brain character Lottie + Figma tags.
 * Welcome sits below the character (not covered).
 */
export function AccountLiveHeroLottie({
  tall = false,
  surfaceColor = "transparent",
}: AccountLiveHeroLottieProps) {
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);
  const [bgData, setBgData] =
    useState<LottieComponentProps["animationData"]>(null);
  const [brainData, setBrainData] =
    useState<LottieComponentProps["animationData"]>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      import("lottie-react"),
      fetch(ONBOARDING_ASSETS.accountLiveBg).then((r) => r.json()),
      fetch(ONBOARDING_ASSETS.accountLiveBrain).then((r) => r.json()),
    ]).then(([lottieModule, bg, brain]) => {
      if (!active) return;
      setLottie(() => lottieModule.default);
      setBgData(stripSolidFills(bg));
      setBrainData(brain);
    });
    return () => {
      active = false;
    };
  }, []);

  const height = tall ? 278 : 200;
  const welcomeTop = tall ? "calc(57% + 32px)" : "calc(55% + 32px)";
  const fadeColor = surfaceColor === "transparent" ? "#0a0b0d" : surfaceColor;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: tall ? 0 : 8,
        overflow: "hidden",
        background: surfaceColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        fontFamily: FONT,
      }}
    >
      <style>{FLOAT_CSS}</style>

      {Lottie && bgData ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: "100%",
            height: "100%",
            transform: `translate(-50%, -50%) scale(${BG_SCALE})`,
            transformOrigin: "center center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Lottie
            animationData={bgData}
            loop
            autoplay
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        </div>
      ) : null}

      {Lottie && brainData ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: "100%",
            height: "100%",
            transform: `translate(-50%, -50%) scale(${CHAR_SCALE})`,
            transformOrigin: "center center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Lottie
            animationData={brainData}
            loop
            autoplay
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        </div>
      ) : null}

      {/* Soft edge fade — clipped orbit rings (top + bottom, 12px) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 12,
          zIndex: 2,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 100%)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 12,
          zIndex: 2,
          pointerEvents: "none",
          background: `linear-gradient(0deg, ${fadeColor} 0%, transparent 100%)`,
        }}
      />

      {/* # My Trader Archetype — top-left */}
      <div
        style={{
          position: "absolute",
          left: tall ? 8 : 12,
          top: tall ? 36 : 18,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: 8,
          backgroundImage: "linear-gradient(90deg, #c9b3fd 0%, #ffffff 100%)",
          boxSizing: "border-box",
          animation: "accountLiveTagFloatA 4.2s ease-in-out infinite",
          willChange: "transform",
          backfaceVisibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 12,
            lineHeight: "18px",
            color: "#000000",
            whiteSpace: "nowrap",
          }}
        >
          # My Trader Archetype
        </span>
      </div>

      {/* Welcome — character base + 32px down; above Lottie */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: welcomeTop,
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 12px",
          height: 28,
          borderRadius: 8,
          background: "rgba(204,185,248,0.25)",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "20px",
            color: "#c9bdff",
            whiteSpace: "nowrap",
          }}
        >
          Welcome
        </span>
      </div>

      {/* # Trader DNA — bottom-right (popup: flush to frame right, +4px down) */}
      <div
        style={{
          position: "absolute",
          right: tall ? 12 : 0,
          bottom: tall ? 44 : 26,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: 8,
          background: "#000000",
          border: "1px solid #cebff1",
          boxSizing: "border-box",
          animation: "accountLiveTagFloatB 4.8s ease-in-out infinite 0.9s",
          willChange: "transform",
          backfaceVisibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 12,
            lineHeight: "18px",
            color: "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          # Trader DNA
        </span>
      </div>
    </div>
  );
}
