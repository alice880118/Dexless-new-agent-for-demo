import { useEffect, useState } from "react";
import type { LottieComponentProps } from "lottie-react";

const CHAR_SRC = "/trader-dna/agent-lottie.json";

/**
 * Lottie canvas is 1000×1000; character only fills the center.
 * Frame ~240px ≈ Figma character visual (~75px) within the 375 panel.
 */
export const AGENT_MASCOT_SIZE = 240;
/** Minimized: content render size (character + decor stay this scale) */
export const AGENT_MASCOT_MINIMIZED = 120;
/** Minimized: layout frame (smaller than content; content centered, may overflow) */
export const AGENT_MASCOT_MINIMIZED_FRAME = 64;

const DECORS = [
  {
    id: "star-purple",
    src: "/trader-dna/decor/star-purple.png",
    left: "34%",
    top: "28%",
    sizeRatio: 0.08,
    duration: "4.5s",
    delay: "0s",
  },
  {
    id: "orb",
    src: "/trader-dna/decor/orb.png",
    left: "26%",
    top: "42%",
    sizeRatio: 0.095,
    duration: "5s",
    delay: "0.8s",
  },
  {
    id: "star-white",
    src: "/trader-dna/decor/star-white.png",
    left: "64%",
    top: "48%",
    sizeRatio: 0.08,
    duration: "4.8s",
    delay: "1.4s",
  },
] as const;

const FLOAT_STYLE = `
@keyframes agentDecorFloatA {
  0% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(0, -2px, 0); }
  50% { transform: translate3d(0, -6px, 0); }
  80% { transform: translate3d(0, -2px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@keyframes agentDecorFloatB {
  0% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(0, -2.5px, 0); }
  50% { transform: translate3d(0, -7px, 0); }
  80% { transform: translate3d(0, -2.5px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@keyframes agentDecorFloatC {
  0% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(0, -2px, 0); }
  50% { transform: translate3d(0, -5.5px, 0); }
  80% { transform: translate3d(0, -2px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
`;

const FLOAT_ANIM: Record<string, string> = {
  "star-purple": "agentDecorFloatA",
  orb: "agentDecorFloatB",
  "star-white": "agentDecorFloatC",
};

type LottieComponent = React.ComponentType<LottieComponentProps>;

type AgentMascotLottieProps = {
  /** Content render size (character + decor scale) */
  size?: number;
  /**
   * Layout frame size. When smaller than `size`, content stays at `size`
   * and is centered inside the smaller frame (overflow visible).
   */
  frameSize?: number;
  width?: number;
  height?: number;
};

/** Character lottie + floating decor icons behind the agent. */
export function AgentMascotLottie({
  size = AGENT_MASCOT_SIZE,
  frameSize,
  width,
  height,
}: AgentMascotLottieProps) {
  const contentW = width ?? size;
  const contentH = height ?? size;
  const layoutW = frameSize ?? contentW;
  const layoutH = frameSize ?? contentH;
  const showDecor = contentW >= 100;
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);
  const [charData, setCharData] =
    useState<LottieComponentProps["animationData"]>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      import("lottie-react"),
      fetch(CHAR_SRC).then((r) => r.json()),
    ]).then(([lottieModule, char]) => {
      if (!active) return;
      setLottie(() => lottieModule.default);
      setCharData(char);
    });

    return () => {
      active = false;
    };
  }, []);

  if (!Lottie || !charData) {
    return (
      <span style={{ width: layoutW, height: layoutH, display: "block", flexShrink: 0 }} />
    );
  }

  return (
    <span
      style={{
        position: "relative",
        width: layoutW,
        height: layoutH,
        display: "block",
        flexShrink: 0,
        overflow: "visible",
      }}
    >
      {showDecor && <style>{FLOAT_STYLE}</style>}

      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: contentW,
          height: contentH,
          transform: "translate(-50%, -50%)",
          overflow: "visible",
        }}
      >
        {showDecor &&
          DECORS.map((d) => {
            const iconSize = Math.max(12, Math.round(contentW * d.sizeRatio));
            return (
              <img
                key={d.id}
                src={d.src}
                alt=""
                width={iconSize}
                height={iconSize}
                style={{
                  position: "absolute",
                  left: d.left,
                  top: d.top,
                  width: iconSize,
                  height: iconSize,
                  objectFit: "contain",
                  zIndex: 0,
                  pointerEvents: "none",
                  animation: `${FLOAT_ANIM[d.id]} ${d.duration} linear ${d.delay} infinite`,
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              />
            );
          })}

        <Lottie
          animationData={charData}
          loop
          autoplay
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      </span>
    </span>
  );
}
