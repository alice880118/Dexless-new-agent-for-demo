export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export type FileAttachment = {
  id: string;
  /** First two words of the basename, with ellipsis when truncated */
  label: string;
  /** Uppercase extension, e.g. PDF */
  ext: string;
  /** Original file name */
  fileName: string;
  size: number;
};

/** Parse display label (first two words) + extension from a file name. */
export function parseFileAttachmentMeta(fileName: string): {
  label: string;
  ext: string;
} {
  const trimmed = fileName.trim();
  const dot = trimmed.lastIndexOf(".");
  const base = dot > 0 ? trimmed.slice(0, dot) : trimmed;
  const ext =
    dot > 0 && dot < trimmed.length - 1
      ? trimmed.slice(dot + 1).toUpperCase()
      : "FILE";
  const words = base.split(/[\s._-]+/).filter(Boolean);
  const two = words.slice(0, 2).join(" ");
  const label =
    words.length > 2 || base.length > two.length + 1
      ? `${two}...`
      : two || base || "File";
  return { label, ext };
}

export function createFileAttachment(file: File): FileAttachment | null {
  if (file.size > MAX_UPLOAD_BYTES) return null;
  const { label, ext } = parseFileAttachmentMeta(file.name);
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    label,
    ext,
    fileName: file.name,
    size: file.size,
  };
}
