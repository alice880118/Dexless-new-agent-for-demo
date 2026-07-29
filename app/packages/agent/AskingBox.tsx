import { useRef, type ChangeEvent } from "react";
import { FONT } from "../nav/design-system";
import {
  createFileAttachment,
  MAX_UPLOAD_BYTES,
  type FileAttachment,
} from "./file-attachment";
import { FileAttachmentChip } from "./FileAttachmentChip";

const ASSETS = {
  add: "/trader-dna/add.png",
  send: "/trader-dna/send.png",
} as const;

export function AskingBox({
  value,
  onChange,
  onSend,
  attachment,
  onAttachmentChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  attachment: FileAttachment | null;
  onAttachmentChange: (file: FileAttachment | null) => void;
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
            placeholder="Tell me about your trading habits..."
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
