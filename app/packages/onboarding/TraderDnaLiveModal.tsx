import type { CSSProperties } from "react";
import { COLORS, FONT, GRADIENTS } from "../nav/design-system";
import { ONBOARDING_ASSETS } from "./assets";

const ASSETS = {
  preview: "/onboarding/trader-dna-live.png",
} as const;

type TraderDnaLiveModalProps = {
  onExplore?: () => void;
  onClose?: () => void;
};

const shell: CSSProperties = {
  width: "100%",
  maxWidth: 360,
  background: "#0c0d10",
  border: "1px solid #424242",
  borderRadius: 8,
  overflow: "hidden",
  boxSizing: "border-box",
  fontFamily: FONT,
};

export function TraderDnaLiveModal({
  onExplore,
  onClose,
}: TraderDnaLiveModalProps) {
  return (
    <div style={shell} onClick={(e) => e.stopPropagation()}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 20px",
          borderBottom: "1px solid #424242",
          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "20px",
            letterSpacing: "0.16px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          Trader DNA is Live!
        </h2>
        {onClose ? (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={ONBOARDING_ASSETS.close}
              alt=""
              width={20}
              height={20}
              style={{ display: "block" }}
            />
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "16px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 147,
            borderRadius: 8,
            overflow: "hidden",
            background: "#000000",
          }}
        >
          <img
            src={ASSETS.preview}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center bottom",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.14px",
              color: "#ffffff",
            }}
          >
            Meet Your AI Trading Agent
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "18px",
              color: COLORS.white60,
            }}
          >
            Understand your trading habits, performance, and risk through
            personalized analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={onExplore}
          style={{
            width: "100%",
            height: 40,
            padding: "0 16px",
            border: "none",
            borderRadius: 999,
            cursor: "pointer",
            backgroundImage: GRADIENTS.connectBtn,
            fontFamily: FONT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "20px",
              color: "#ffffff",
            }}
          >
            Explore Now
          </span>
        </button>
      </div>
    </div>
  );
}
