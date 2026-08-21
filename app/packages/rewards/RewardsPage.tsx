import { FONT } from "../nav/design-system";

/** Rewards page — embeds converted dexless-rewards layout (RWD inside iframe) */
export function RewardsPage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        minHeight: 0,
        background: "#000",
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <iframe
        title="Rewards"
        src="/rewards/page.html?v=20260821ao"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: "none",
          background: "#000",
        }}
      />
    </div>
  );
}
