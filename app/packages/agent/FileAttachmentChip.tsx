import { FONT } from "../nav/design-system";
import type { FileAttachment } from "./file-attachment";

const CLOSE_SRC = "/trader-dna/chat/file-close.svg";

/** Figma 7525:83086 — file chip in composer / conversation. */
export function FileAttachmentChip({
  file,
  onRemove,
}: {
  file: FileAttachment;
  onRemove?: () => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        borderRadius: 6,
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        boxSizing: "border-box",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: 10,
          lineHeight: "12px",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        <span style={{ color: "#ffffff" }}>{file.label}</span>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>{file.ext}</span>
      </div>
      {onRemove && (
        <button
          type="button"
          aria-label="Remove file"
          data-chat-hit="file-remove"
          onClick={onRemove}
          style={{
            width: 12,
            height: 12,
            padding: 0,
            border: "none",
            borderRadius: 999,
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={CLOSE_SRC}
            alt=""
            width={8}
            height={8}
            style={{ display: "block" }}
          />
        </button>
      )}
    </div>
  );
}
