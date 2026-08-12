import { useRef, type ChangeEvent } from "react";
import { FONT } from "../nav/design-system";
import {
  createFileAttachment,
  MAX_UPLOAD_BYTES,
  type FileAttachment,
} from "./file-attachment";
import { FileAttachmentChip } from "./FileAttachmentChip";
import type { SignalAskSnapshot } from "./SignalViews";

const ASSETS = {
  add: "/trader-dna/add.png",
  send: "/trader-dna/send.png",
  close: "/trader-dna/chat/file-close.svg",
  signal: "/trader-dna/signal/clock-time.png",
} as const;

function SignalContextChip({
  snapshot,
  onRemove,
}: {
  snapshot: SignalAskSnapshot;
  onRemove?: () => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: 8,
        padding: 8,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        boxSizing: "border-box",
        maxWidth: "100%",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 0,
          flex: 1,
          fontFamily: FONT,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            lineHeight: "14px",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Signal snapshot
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            lineHeight: "16px",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {snapshot.symbol} · {snapshot.side}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            lineHeight: "14px",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Entry {snapshot.entry} · SL {snapshot.stopLoss} · TP {snapshot.takeProfit}
        </span>
      </div>
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove signal"
          data-chat-hit="signal-remove"
          onClick={onRemove}
          style={{
            width: 12,
            height: 12,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <img
            src={ASSETS.close}
            alt=""
            width={8}
            height={8}
            style={{ display: "block" }}
          />
        </button>
      ) : null}
    </div>
  );
}

export function AskingBox({
  value,
  onChange,
  onSend,
  attachment,
  onAttachmentChange,
  signalContext = null,
  onSignalContextChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  attachment: FileAttachment | null;
  onAttachmentChange: (file: FileAttachment | null) => void;
  signalContext?: SignalAskSnapshot | null;
  onSignalContextChange?: (next: SignalAskSnapshot | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePick = () => fileRef.current?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const next = createFileAttachment(file);
    if (!next) {
      window.alert(
        `File must be ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB or smaller.`,
      );
      return;
    }
    onAttachmentChange(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {signalContext ? (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <SignalContextChip
            snapshot={signalContext}
            onRemove={
              onSignalContextChange
                ? () => onSignalContextChange(null)
                : undefined
            }
          />
        </div>
      ) : null}
      {attachment && (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <FileAttachmentChip
            file={attachment}
            onRemove={() => onAttachmentChange(null)}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 11,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.2)",
          boxSizing: "border-box",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            flex: 1,
          }}
        >
          <button
            type="button"
            data-chat-hit="upload"
            aria-label="Upload file"
            onClick={handlePick}
            style={{
              width: 27,
              height: 27,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={ASSETS.add}
              alt=""
              width={27}
              height={27}
              style={{ display: "block", width: 27, height: 27 }}
            />
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={handleFileChange}
          />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={
              signalContext
                ? "Ask about this signal..."
                : "Tell me about your trading habits..."
            }
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.9)",
              fontFamily: FONT,
            }}
          />
        </div>
        <button
          type="button"
          data-chat-hit="send"
          aria-label="Send"
          onClick={onSend}
          style={{
            width: 31,
            height: 31,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={ASSETS.send}
            alt=""
            width={31}
            height={31}
            style={{ display: "block", width: 31, height: 31 }}
          />
        </button>
      </div>
    </div>
  );
}
