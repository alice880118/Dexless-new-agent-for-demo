import type { CSSProperties, ReactNode } from "react";
import { FONT } from "../nav/design-system";
import type { DraftOrder } from "./draft-order";

const BUY = "#46ccb9";
const SELL = "#ff41a3";

type DraftOrderCardProps = {
  order: DraftOrder;
  /** Chat deposit flow vs post-deposit CTAs vs More detail CTAs */
  mode?: "deposit" | "ready" | "actions";
  onDeposit?: () => void;
  onAskAgent?: () => void;
  onSendOrder?: () => void;
  onModify?: () => void;
  onEdit?: () => void;
  onAddTakeProfit?: () => void;
  onAddStopLoss?: () => void;
};

function Row({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 13,
          lineHeight: "18px",
          color: "rgba(255,255,255,0.6)",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

const valueStyle: CSSProperties = {
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "12px",
  color: "#ffffff",
  textAlign: "right",
  letterSpacing: "-0.39px",
  fontVariantNumeric: "tabular-nums",
};

const addBtnStyle: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  background: "rgba(255,255,255,0.06)",
  padding: "2px 10px",
  cursor: "pointer",
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "18px",
  color: "#ffffff",
};

export function DraftOrderCard({
  order,
  mode = "deposit",
  onDeposit,
  onAskAgent,
  onSendOrder,
  onModify,
  onEdit,
  onAddTakeProfit,
  onAddStopLoss,
}: DraftOrderCardProps) {
  return (
    <div
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxSizing: "border-box",
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "12px 12px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 12,
            lineHeight: "18px",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Draft Order
        </span>
        <button
          type="button"
          onClick={onEdit}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: onEdit ? "pointer" : "default",
            fontFamily: FONT,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: 12,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Edit in order form
          </span>
          <img
            src="/trader-dna/draft/chevron.svg"
            alt=""
            width={18}
            height={18}
            style={{
              display: "block",
              transform: "rotate(-90deg)",
            }}
          />
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "0 12px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <Row label="Market">
            <span style={{ ...valueStyle, fontWeight: 600 }}>{order.market}</span>
          </Row>
          <Row label="Side">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "1px 8px",
                borderRadius: 4,
                background: "rgba(70,204,185,0.05)",
                fontWeight: 600,
                fontSize: 12,
                lineHeight: "18px",
                color: BUY,
              }}
            >
              {order.side}
            </span>
          </Row>
          <Row label="Margin">
            <span style={valueStyle}>{order.margin}</span>
          </Row>
          <Row label="Leverage">
            <span style={valueStyle}>{order.leverageLine}</span>
          </Row>
          <Row label="Entry">
            <span style={valueStyle}>{order.entry}</span>
          </Row>
          <Row label="Take Profit">
            {order.takeProfit ? (
              <span style={{ ...valueStyle, color: BUY }}>
                {order.takeProfit}
              </span>
            ) : (
              <button
                type="button"
                onClick={onAddTakeProfit}
                style={addBtnStyle}
              >
                ADD
              </button>
            )}
          </Row>
          <Row label="Stop Loss">
            {order.stopLoss ? (
              <span style={{ ...valueStyle, color: SELL }}>
                {order.stopLoss}
              </span>
            ) : (
              <button
                type="button"
                onClick={onAddStopLoss}
                style={addBtnStyle}
              >
                ADD
              </button>
            )}
          </Row>
        </div>

        {(mode === "deposit" || mode === "ready") && (
          <div
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.05)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {mode === "ready" ? (
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: 12,
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                You can review and modify before submission.
                <br />
                No order will be sent until you confirm.
              </p>
            ) : (
              <>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Deposit to Submit
                </p>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {order.balanceLine ?? "Current balance: 0 USDC"}
                  <br />
                  {order.minRequiredLine ?? "Minimum required: 10 USDC"}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "4px 12px 12px",
          boxSizing: "border-box",
        }}
      >
        {mode === "deposit" ? (
          <>
            <button
              type="button"
              onClick={onDeposit}
              style={{
                width: "100%",
                height: 32,
                border: "none",
                borderRadius: 999,
                background: "#6f51f6",
                color: "#ffffff",
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 11,
                lineHeight: "18px",
                cursor: "pointer",
              }}
            >
              Deposit
            </button>
            <p
              style={{
                margin: 0,
                textAlign: "center",
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "18px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Your draft order will be saved in full.
            </p>
          </>
        ) : mode === "ready" ? (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button
              type="button"
              onClick={onSendOrder}
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
                lineHeight: "18px",
                cursor: "pointer",
              }}
            >
              Send Order
            </button>
            <button
              type="button"
              onClick={onModify}
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
                lineHeight: "18px",
                cursor: "pointer",
              }}
            >
              Modify
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button
              type="button"
              onClick={onAskAgent}
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
                lineHeight: "18px",
                cursor: "pointer",
              }}
            >
              Ask agent
            </button>
            <button
              type="button"
              onClick={onSendOrder}
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
                lineHeight: "18px",
                cursor: "pointer",
              }}
            >
              Send Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
