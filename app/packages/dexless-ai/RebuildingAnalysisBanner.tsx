import { FONT, GRADIENTS } from "../nav/design-system";
import { EXTERNAL_VENUES, FULL_TRADE_COUNT, formatTradeCount } from "./venues";

const SKELETON_CARDS = [
  "Net PnL",
  "Behavioral Health Score",
  "Hidden Pattern",
] as const;

type Props = {
  tradeCount?: number;
};

/** Inline dashboard rebuilding status — project UI tokens (not HTML clone) */
export function RebuildingAnalysisBanner({
  tradeCount = FULL_TRADE_COUNT,
}: Props) {
  const stack = [
    { id: "dexless", icon: "/dexless-ai/dexless.png", name: "Dexless" },
    ...EXTERNAL_VENUES.slice(0, 2),
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          flexWrap: "wrap",
          minHeight: 32,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.15)",
            borderTopColor: "rgba(185,169,255,0.95)",
            animation: "dexlessAiSpin 0.8s linear infinite",
            flexShrink: 0,
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {stack.map((v, i) => (
            <img
              key={v.id}
              src={v.icon}
              alt={v.name}
              width={16}
              height={16}
              style={{
                display: "block",
                width: 16,
                height: 16,
                borderRadius: "50%",
                objectFit: "cover",
                marginLeft: i === 0 ? 0 : -6,
                background: "#0c0d10",
                boxShadow: "0 0 0 1px #0a0b0d",
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "20px",
            color: "rgba(201,189,255,0.95)",
            whiteSpace: "nowrap",
          }}
        >
          Rebuilding analysis from {formatTradeCount(tradeCount)} trades…
        </span>
        <span
          style={{
            width: 120,
            height: 3,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            flexShrink: 0,
            display: "block",
          }}
        >
          <span
            style={{
              display: "block",
              height: "100%",
              width: "40%",
              borderRadius: 999,
              background: GRADIENTS.connectBtn,
              animation: "dexlessAiSlide 1.4s ease-in-out infinite",
            }}
          />
        </span>
      </div>

      <div
        className="dexless-ai-rebuild-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          width: "100%",
        }}
      >
        {SKELETON_CARDS.map((label) => (
          <div
            key={label}
            style={{
              padding: 16,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#131519",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              boxSizing: "border-box",
              opacity: 0.7,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                display: "block",
                height: 22,
                borderRadius: 5,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
                backgroundSize: "200% 100%",
                animation: "dexlessAiShimmer 1.4s linear infinite",
              }}
            />
            <span
              style={{
                display: "block",
                height: 14,
                width: "60%",
                borderRadius: 5,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
                backgroundSize: "200% 100%",
                animation: "dexlessAiShimmer 1.4s linear infinite",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
