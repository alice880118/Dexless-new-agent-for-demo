import { useEffect, useState } from "react";
import type { LottieComponentProps } from "lottie-react";
import { FONT } from "../nav/design-system";

const BADGE_WIDTH = 70;
const LOTTIE_SIZE = 58;

type LottieComponent = React.ComponentType<LottieComponentProps>;

type TraderDnaBadgeProps = {
  onClick?: () => void;
  hidden?: boolean;
};

export function TraderDnaBadge({ onClick, hidden = false }: TraderDnaBadgeProps) {
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);
  const [animationData, setAnimationData] =
    useState<LottieComponentProps["animationData"]>(null);

  useEffect(() => {
    let active = true;

    Promise.all([import("lottie-react"), fetch("/trader-dna.json").then((r) => r.json())]).then(
      ([lottieModule, data]) => {
        if (!active) return;
        setLottie(() => lottieModule.default);
        setAnimationData(data);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <style>{`
        @keyframes traderDnaGradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: -200% 50%; }
        }
      `}</style>
      <button
        type="button"
        aria-label="Open Trader DNA"
        onClick={onClick}
        style={{
          position: "fixed",
          right: 24,
          bottom: 40,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: BADGE_WIDTH,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            width: LOTTIE_SIZE,
            height: LOTTIE_SIZE,
            display: "block",
          }}
        >
          {Lottie && animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE, display: "block" }}
            />
          ) : null}
        </span>
        <span
          style={{
            marginTop: -4,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 12,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            backgroundImage:
              "linear-gradient(90deg, #BFB1FF 0%, #E3FF94 50%, #BFB1FF 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: "traderDnaGradientFlow 2s linear infinite",
          }}
        >
          Trader DNA
        </span>
      </button>
    </>
  );
}
