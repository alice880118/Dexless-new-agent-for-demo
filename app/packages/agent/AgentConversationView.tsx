import { useEffect, useState, type CSSProperties } from "react";
import { FONT } from "../nav/design-system";
import type { SignalAskSnapshot } from "./SignalViews";
import type { FileAttachment } from "./file-attachment";
import { FileAttachmentChip } from "./FileAttachmentChip";
import { DraftOrderCard } from "./DraftOrderCard";
import {
  DRAFT_ORDER_REPLY,
  NO_TPSL_DRAFT_ORDER,
  NO_TPSL_DRAFT_REPLY,
  PRIMARY_DRAFT_ORDER,
  SUGGESTED_STOP_LOSS,
  SUGGESTED_TAKE_PROFIT,
  TPSL_ASK_MESSAGE,
  TPSL_SUGGEST_REPLY,
  isDraftOrderQuery,
  isNoTpSlQuery,
  type DraftOrder,
} from "./draft-order";

type ProcessPhase = "idle" | "planning" | "market" | "executing" | "complete";
type TpSlSubFlow = "idle" | "analyzing" | "suggest" | "applied";

const SNAPSHOT_ASSETS = {
  icon: "/trader-dna/chat/snapshot-icon.svg",
  chevron: "/trader-dna/chat/chevron-up.svg",
} as const;

const SPINNER_BG =
  "M5.70483 13.3358C5.37875 13.7651 4.75979 13.8533 4.38478 13.466C3.67653 12.7345 3.14896 11.8415 2.8515 10.858C2.45936 9.56141 2.48721 8.17406 2.93107 6.89429C3.37493 5.61452 4.21208 4.50786 5.32281 3.73254C6.43353 2.95723 7.76096 2.55296 9.1153 2.57755C10.4696 2.60214 11.7815 3.05432 12.8634 3.86943C13.9452 4.68455 14.7417 5.82087 15.1388 7.1159C15.5359 8.41094 15.5134 9.79839 15.0744 11.0799C14.7415 12.0519 14.1818 12.9252 13.4475 13.6305C13.0587 14.004 12.4433 13.8933 12.133 13.4525C11.8228 13.0116 11.9389 12.4084 12.3021 12.0099C12.7119 11.5603 13.0281 11.0292 13.2274 10.4472C13.5329 9.55529 13.5486 8.58963 13.2722 7.68828C12.9958 6.78694 12.4415 5.99606 11.6885 5.42874C10.9355 4.86142 10.0225 4.5467 9.07986 4.52959C8.13724 4.51248 7.21335 4.79385 6.44029 5.33346C5.66722 5.87308 5.08457 6.64332 4.77564 7.53404C4.46671 8.42476 4.44733 9.39035 4.72026 10.2928C4.89836 10.8816 5.19498 11.4239 5.58822 11.8881C5.93671 12.2994 6.03091 12.9064 5.70483 13.3358Z";
const SPINNER_ARC =
  "M14.4457 9.00068C14.9848 9.00068 15.4295 9.44022 15.3478 9.97313C15.1937 10.9796 14.8016 11.9399 14.1982 12.7716C13.4029 13.8681 12.2812 14.685 10.9936 15.1055C9.70599 15.5261 8.31837 15.5288 7.02915 15.1131C5.73993 14.6975 4.61513 13.8849 3.81557 12.7915C3.01602 11.6981 2.58266 10.3799 2.57746 9.02534C2.57226 7.6708 2.99548 6.34929 3.78661 5.24977C4.57774 4.15025 5.69626 3.32903 6.98225 2.90353C7.95774 2.58076 8.9917 2.49823 9.99752 2.65643C10.5301 2.7402 10.8142 3.29717 10.6507 3.81092C10.4873 4.32468 9.93667 4.59698 9.3997 4.54873C8.79378 4.49429 8.1796 4.56381 7.59554 4.75706C6.70049 5.05321 5.922 5.62478 5.37137 6.39004C4.82074 7.15531 4.52618 8.07508 4.5298 9.01785C4.53343 9.96061 4.83504 10.8781 5.39153 11.6391C5.94802 12.4001 6.73088 12.9657 7.62818 13.255C8.52548 13.5442 9.49127 13.5424 10.3874 13.2497C11.2836 12.9569 12.0643 12.3884 12.6179 11.6252C12.9791 11.1272 13.2315 10.563 13.3634 9.96913C13.4802 9.44281 13.9066 9.00068 14.4457 9.00068Z";
const CIRCLE_CHECK =
  "M0 5C0 2.2385 2.2385 0 5 0C7.7615 0 10 2.2385 10 5C10 7.7615 7.7615 10 5 10C2.2385 10 0 7.7615 0 5ZM7.4855 2.6565C7.599 2.548 7.755 2.5005 7.904 2.5005C8.053 2.5005 8.209 2.548 8.322 2.6565C8.37596 2.70796 8.41891 2.76983 8.44826 2.83837C8.47761 2.90691 8.49274 2.98069 8.49274 3.05525C8.49274 3.12981 8.47761 3.20359 8.44826 3.27213C8.41891 3.34067 8.37596 3.40254 8.322 3.454L4.247 7.338C4.13274 7.44242 3.98354 7.50032 3.82875 7.50032C3.67396 7.50032 3.52477 7.44242 3.4105 7.338L1.6635 5.673C1.60975 5.62148 1.56697 5.55961 1.53775 5.49113C1.50853 5.42264 1.49347 5.34896 1.49347 5.2745C1.49347 5.20004 1.50853 5.12636 1.53775 5.05787C1.56697 4.98939 1.60975 4.92752 1.6635 4.876C1.77779 4.77144 1.92709 4.71345 2.082 4.71345C2.23691 4.71345 2.38621 4.77144 2.5005 4.876L3.8285 6.1415L7.4855 2.6565Z";

const slideIn: CSSProperties = {
  animation: "signalMoveIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
};

function Spinner() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        flexShrink: 0,
        animation: "agentSpinCw 1s linear infinite",
      }}
    >
      <svg
        style={{ display: "block", width: "100%", height: "100%" }}
        fill="none"
        viewBox="0 0 17.9975 17.9975"
      >
        <mask fill="white" id="agent-sp-bg">
          <path d={SPINNER_BG} />
        </mask>
        <path
          d={SPINNER_BG}
          mask="url(#agent-sp-bg)"
          stroke="#3A3A3A"
          strokeWidth="4"
        />
        <mask fill="white" id="agent-sp-arc">
          <path d={SPINNER_ARC} />
        </mask>
        <path
          d={SPINNER_ARC}
          mask="url(#agent-sp-arc)"
          stroke="url(#agent-sp-grad)"
          strokeWidth="4"
        />
        <defs>
          <linearGradient
            id="agent-sp-grad"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="9"
            x2="18"
            y2="9"
          >
            <stop offset="0%" stopColor="#C4B7FF" />
            <stop offset="45%" stopColor="#76BAB2" />
            <stop offset="98%" stopColor="#E3FF94" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CircleCheck() {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", inset: "8.33% 8.28% 8.34% 8.39%" }}>
        <svg
          style={{ display: "block", width: "100%", height: "100%" }}
          fill="none"
          viewBox="0 0 10 10"
        >
          <path
            clipRule="evenodd"
            d={CIRCLE_CHECK}
            fill="#00FFAB"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

function ChevronRight({ opacity = 0.3 }: { opacity?: number }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M8 2L4 6L8 10"
        stroke="white"
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ThinkingBubble({ name }: { name: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "10px 8px",
        flexShrink: 0,
      }}
    >
      <Spinner />
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.8)",
          textShadow: "0px 0px 4px rgba(0,0,0,0.4)",
        }}
      >
        {name} is thinking...
      </span>
    </div>
  );
}

function GradNum({ n }: { n: string }) {
  return (
    <div
      style={{
        width: 18,
        flexShrink: 0,
        background: "linear-gradient(90deg,#d9d0ff,#ffffff 62.694%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 13,
        lineHeight: "18px",
      }}
    >
      {n}
    </div>
  );
}

function PlanningStepsCard({
  steps,
  phaseSteps,
  label,
}: {
  steps: string[];
  phaseSteps: number;
  label: string;
}) {
  const visible = steps.slice(0, Math.max(phaseSteps, 1));
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        padding: 8,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: visible.length ? 8 : 0,
        }}
      >
        <span
          style={{
            background:
              "linear-gradient(90deg,#d9d0ff,#85d7cd 62.694%,#e3ff94 109.18%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "18px",
          }}
        >
          {label}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-90deg)",
          }}
        >
          <ChevronRight />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {visible.map((step, i) => (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              opacity: i === 0 ? 0.8 : i === 1 ? 0.5 : 0.3,
              flexShrink: 0,
            }}
          >
            <GradNum n={`0${i + 1}`} />
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: 13,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.57)",
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollapsedProcessCard({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        padding: 8,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CircleCheck />
          <div style={{ transform: "rotate(180deg)" }}>
            <ChevronRight opacity={0.8} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightRow({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 4,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 2px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 4,
            height: 4,
            background: "#9e73e3",
            flexShrink: 0,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

function ActionRow({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        padding: "6px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
      <div style={{ transform: "rotate(180deg)" }}>
        <ChevronRight opacity={0.8} />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(255,255,255,0.1)",
        width: "100%",
        flexShrink: 0,
      }}
    />
  );
}

function AnalysisResults() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "18px",
            color: "#e2cfff",
          }}
        >
          Analysis Results
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Multiple emotional trading signals have been detected.
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          You plan to open a 20 USDT BTC long position. Based on your recent
          trading behavior, this trade appears to be driven more by emotion than
          by a well-defined trading strategy.
        </p>
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 14,
            lineHeight: "18px",
            color: "#e2cfff",
          }}
        >
          Key Insights
        </p>
        <InsightRow
          title="Trading Recommendation"
          body="Consider staying on the sidelines and waiting for a stronger entry opportunity."
        />
        <InsightRow
          title="Market Condition"
          body="BTC momentum is currently weakening."
        />
      </div>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Next Steps
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ActionRow label="View Optimal Entry Zones" />
          <ActionRow label="Wait for Breakout Confirmation" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 8px 8px",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          4:15 PM
        </span>
      </div>
    </div>
  );
}

function SnapshotField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "stretch",
        width: "100%",
        flex: "1 0 0",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "16px",
          color: "rgba(255,255,255,0.5)",
          width: "100%",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "16px",
          color: "rgba(255,255,255,0.8)",
          width: "100%",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SignalSnapshotCard({
  snapshot,
}: {
  snapshot: SignalAskSnapshot;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxSizing: "border-box",
        width: 221,
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 4,
          width: "100%",
          margin: 0,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: "1 0 0",
            minWidth: 0,
          }}
        >
          <img
            src={SNAPSHOT_ASSETS.icon}
            alt=""
            width={14}
            height={14}
            style={{ display: "block", flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 12,
              lineHeight: "16px",
              color: "rgba(255,255,255,0.5)",
              flex: "1 0 0",
              minWidth: 0,
              textAlign: "left",
            }}
          >
            Signal snapshot
          </span>
        </div>
        <img
          src={SNAPSHOT_ASSETS.chevron}
          alt=""
          width={12}
          height={12}
          style={{
            display: "block",
            marginTop: 2,
            flexShrink: 0,
            transform: expanded ? "none" : "rotate(180deg)",
            transition: "transform 160ms ease",
          }}
        />
      </button>
      {expanded && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 8,
            width: "100%",
            alignSelf: "stretch",
          }}
        >
          <SnapshotField
            label="Pair"
            value={`${snapshot.symbol} · ${snapshot.side}`}
          />
          <SnapshotField label="Entry" value={snapshot.entry} />
          <SnapshotField
            label="Stop loss"
            value={`${snapshot.stopLoss} · ${snapshot.stopLossPct}`}
          />
          <SnapshotField
            label="Take profit"
            value={`${snapshot.takeProfit} · ${snapshot.takeProfitPct}`}
          />
        </div>
      )}
    </div>
  );
}

function DraftOrderResults({
  reply,
  order,
  funded,
  onDeposit,
  onAddTakeProfit,
  onAddStopLoss,
}: {
  reply: string;
  order: DraftOrder;
  funded?: boolean;
  onDeposit?: () => void;
  onAddTakeProfit?: () => void;
  onAddStopLoss?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 12,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 8,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {reply}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 12,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Just now
          </span>
        </div>
      </div>
      <DraftOrderCard
        order={order}
        mode={funded ? "ready" : "deposit"}
        onDeposit={onDeposit}
        onSendOrder={() => undefined}
        onModify={() => undefined}
        onAddTakeProfit={onAddTakeProfit}
        onAddStopLoss={onAddStopLoss}
      />
    </div>
  );
}

function TpSlSuggestResults({
  onApply,
  onSkip,
}: {
  onApply: () => void;
  onSkip: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 12,
        flexShrink: 0,
        padding: 8,
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {TPSL_SUGGEST_REPLY}
      </p>
      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        <button
          type="button"
          onClick={onApply}
          style={{
            flex: 1,
            height: 32,
            border: "none",
            borderRadius: 999,
            backgroundImage:
              "linear-gradient(90deg, #7053f3 0%, #76bab2 62.694%, #e3ff94 137.26%)",
            color: "#ffffff",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{
            flex: 1,
            height: 32,
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            background: "transparent",
            color: "#ffffff",
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          No
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          Just now
        </span>
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingLeft: 40,
        width: "100%",
        boxSizing: "border-box",
        gap: 2,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "8px 12px",
          borderRadius: "16px 16px 2px 16px",
          maxWidth: 292,
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 13,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {text}
        </p>
      </div>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 12,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Just now
      </span>
    </div>
  );
}

export function AgentConversationView({
  userMessage = "I want to long BTC with 20U",
  agentName = "Trader DNA",
  signalSnapshot,
  fileAttachment,
  onDraftDeposit,
  draftFunded = false,
}: {
  userMessage?: string;
  agentName?: string;
  signalSnapshot?: SignalAskSnapshot | null;
  fileAttachment?: FileAttachment | null;
  onDraftDeposit?: () => void;
  draftFunded?: boolean;
}) {
  const isNoTpSl = isNoTpSlQuery(userMessage);
  const isDraftFlow = isDraftOrderQuery(userMessage);
  const [phase, setPhase] = useState<ProcessPhase>("planning");
  const [phaseSteps, setPhaseSteps] = useState(0);
  const [hasInitialResult, setHasInitialResult] = useState(false);
  const [draftOrder, setDraftOrder] = useState<DraftOrder>(() =>
    isNoTpSl ? NO_TPSL_DRAFT_ORDER : PRIMARY_DRAFT_ORDER,
  );
  const [tpSlFlow, setTpSlFlow] = useState<TpSlSubFlow>("idle");
  const [askMessage, setAskMessage] = useState<string | null>(null);

  useEffect(() => {
    setPhase("planning");
    setPhaseSteps(0);
    setHasInitialResult(false);
    setTpSlFlow("idle");
    setAskMessage(null);
    setDraftOrder(isNoTpSlQuery(userMessage) ? NO_TPSL_DRAFT_ORDER : PRIMARY_DRAFT_ORDER);
  }, [userMessage, signalSnapshot, fileAttachment]);

  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;
    const ts: number[] = [];
    const later = (cb: () => void, d: number) =>
      ts.push(window.setTimeout(cb, d));
    if (phase === "planning") {
      later(() => setPhaseSteps(1), 350);
      later(() => setPhaseSteps(2), 750);
      later(() => setPhaseSteps(3), 1150);
      later(() => {
        setPhase("market");
        setPhaseSteps(0);
      }, 1650);
    } else if (phase === "market") {
      later(() => setPhaseSteps(1), 350);
      later(() => setPhaseSteps(2), 750);
      later(() => setPhaseSteps(3), 1150);
      later(() => {
        setPhase("executing");
        setPhaseSteps(0);
      }, 1650);
    } else if (phase === "executing") {
      [1, 2, 3, 4, 5].forEach((s, i) =>
        later(() => setPhaseSteps(s), 350 + i * 380),
      );
      later(() => {
        setPhase("complete");
        setPhaseSteps(0);
        setHasInitialResult(true);
        setTpSlFlow((prev) => (prev === "analyzing" ? "suggest" : prev));
      }, 2450);
    }
    return () => ts.forEach((id) => window.clearTimeout(id));
  }, [phase]);

  const startTpSlAsk = () => {
    if (tpSlFlow !== "idle") return;
    setAskMessage(TPSL_ASK_MESSAGE);
    setTpSlFlow("analyzing");
    setPhase("planning");
    setPhaseSteps(0);
  };

  const applyTpSl = () => {
    setDraftOrder((prev) => ({
      ...prev,
      takeProfit: SUGGESTED_TAKE_PROFIT,
      stopLoss: SUGGESTED_STOP_LOSS,
    }));
    setTpSlFlow("applied");
  };

  const skipTpSl = () => {
    setTpSlFlow("idle");
    setAskMessage(null);
  };

  const showAskTurn =
    Boolean(askMessage) &&
    (tpSlFlow === "analyzing" ||
      tpSlFlow === "suggest" ||
      tpSlFlow === "applied");
  const analyzingAsk = tpSlFlow === "analyzing" && phase !== "complete";
  const showSuggest = tpSlFlow === "suggest" && phase === "complete";
  const canAddTpSl =
    isNoTpSl && tpSlFlow === "idle" && !draftOrder.takeProfit && !draftOrder.stopLoss;
  const draftReply =
    isNoTpSl && !draftOrder.takeProfit ? NO_TPSL_DRAFT_REPLY : DRAFT_ORDER_REPLY;
  const showInitialProcess = !hasInitialResult;

  return (
    <div
      style={{
        ...slideIn,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        padding: "20px 16px 8px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: FONT,
        scrollbarWidth: "none",
      }}
      className="signal-scroll"
    >
      <style>{`
        @keyframes agentSpinCw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            paddingLeft: 40,
            width: "100%",
            boxSizing: "border-box",
            gap: 2,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "8px 12px",
              borderRadius: "16px 16px 2px 16px",
              maxWidth: 292,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {userMessage ? (
              <p
                style={{
                  margin: 0,
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize: 13,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {userMessage}
              </p>
            ) : null}
            {fileAttachment && (
              <FileAttachmentChip file={fileAttachment} />
            )}
          </div>
          {signalSnapshot && (
            <SignalSnapshotCard snapshot={signalSnapshot} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 12,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Just now
          </span>
        </div>
      </div>

      {showInitialProcess && phase === "planning" && (
        <>
          <PlanningStepsCard
            label="Planning..."
            phaseSteps={phaseSteps}
            steps={[
              "Analyzing today's BTC market...",
              "Retrieving key cryptocurrency market data...",
              "Leverage condition analysis...",
            ]}
          />
          <div style={{ paddingRight: 64 }}>
            <ThinkingBubble name={agentName} />
          </div>
        </>
      )}

      {showInitialProcess && (phase === "market" || phase === "executing") && (
        <>
          <CollapsedProcessCard label="Plan" />
          <PlanningStepsCard
            label="Market Analysis..."
            phaseSteps={phase === "executing" ? 3 : phaseSteps}
            steps={[
              "Analyze Today's BTC Market",
              "Retrieving key cryptocurrency market data",
              "Leverage condition analysis",
            ]}
          />
          <div style={{ paddingRight: 64 }}>
            <ThinkingBubble name={agentName} />
          </div>
        </>
      )}

      {hasInitialResult && (
        <>
          <CollapsedProcessCard label="Plan" />
          <CollapsedProcessCard label="Market Analysis" />
          {isDraftFlow ? (
            <DraftOrderResults
              reply={draftReply}
              order={draftOrder}
              funded={draftFunded}
              onDeposit={onDraftDeposit}
              onAddTakeProfit={canAddTpSl ? startTpSlAsk : undefined}
              onAddStopLoss={canAddTpSl ? startTpSlAsk : undefined}
            />
          ) : (
            <AnalysisResults />
          )}
        </>
      )}

      {showAskTurn && askMessage ? <UserBubble text={askMessage} /> : null}

      {analyzingAsk && phase === "planning" && (
        <>
          <PlanningStepsCard
            label="Planning..."
            phaseSteps={phaseSteps}
            steps={[
              "Reviewing draft order risk...",
              "Estimating Take Profit levels...",
              "Estimating Stop Loss levels...",
            ]}
          />
          <div style={{ paddingRight: 64 }}>
            <ThinkingBubble name={agentName} />
          </div>
        </>
      )}

      {analyzingAsk && (phase === "market" || phase === "executing") && (
        <>
          <CollapsedProcessCard label="Plan" />
          <PlanningStepsCard
            label="Risk Analysis..."
            phaseSteps={phase === "executing" ? 3 : phaseSteps}
            steps={[
              "Review draft order risk",
              "Estimate Take Profit levels",
              "Estimate Stop Loss levels",
            ]}
          />
          <div style={{ paddingRight: 64 }}>
            <ThinkingBubble name={agentName} />
          </div>
        </>
      )}

      {showSuggest && (
        <TpSlSuggestResults onApply={applyTpSl} onSkip={skipTpSl} />
      )}
    </div>
  );
}
