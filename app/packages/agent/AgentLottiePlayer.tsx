import { useEffect, useState } from "react";
import type { LottieComponentProps } from "lottie-react";

const LOTTIE_SIZE = 50;

type LottieComponent = React.ComponentType<LottieComponentProps>;

export function AgentLottiePlayer() {
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);
  const [animationData, setAnimationData] =
    useState<LottieComponentProps["animationData"]>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      import("lottie-react"),
      import("./agent.json"),
    ]).then(([lottieModule, animationModule]) => {
      if (!active) {
        return;
      }

      setLottie(() => lottieModule.default);
      setAnimationData(animationModule.default);
    });

    return () => {
      active = false;
    };
  }, []);

  if (!Lottie || !animationData) {
    return (
      <span
        style={{
          width: LOTTIE_SIZE,
          height: LOTTIE_SIZE,
          display: "block",
        }}
      />
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      style={{
        width: LOTTIE_SIZE,
        height: LOTTIE_SIZE,
        display: "block",
      }}
    />
  );
}
