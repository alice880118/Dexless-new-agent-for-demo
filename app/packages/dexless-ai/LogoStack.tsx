import type { CSSProperties } from "react";
import { FONT, FONT_WEIGHT } from "../nav/design-system";

export type LogoStackItem = {
  id: string;
  icon: string;
  name: string;
};

type Props = {
  logos: readonly LogoStackItem[];
  /** Visible logo count before +N overflow (default 3) */
  visible?: number;
  size?: number;
  overlap?: number;
  ringColor?: string;
};

/** Overlapping venue logos — max `visible` icons, then grey +N chip */
export function LogoStack({
  logos,
  visible = 3,
  size = 16,
  overlap = 9,
  ringColor = "#0c0d10",
}: Props) {
  const shown = logos.slice(0, visible);
  const rest = logos.length - shown.length;
  const overflowFontSize = Math.max(7, Math.round(size * 0.55) - 1);

  const imgStyle = (i: number): CSSProperties => ({
    display: "block",
    width: size,
    height: size,
    borderRadius: "50%",
    objectFit: "cover",
    marginLeft: i === 0 ? 0 : -overlap,
    flexShrink: 0,
    background: ringColor,
    boxShadow: `0 0 0 1px ${ringColor}`,
  });

  return (
    <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
      {shown.map((logo, i) => (
        <img
          key={logo.id}
          src={logo.icon}
          alt={logo.name}
          width={size}
          height={size}
          style={imgStyle(i)}
        />
      ))}
      {rest > 0 ? (
        <span
          aria-label={`${rest} more`}
          style={{
            display: "grid",
            placeItems: "center",
            width: size,
            height: size,
            marginLeft: shown.length === 0 ? 0 : -overlap,
            borderRadius: "50%",
            background: "#3a3a3a",
            boxShadow: `0 0 0 1px ${ringColor}`,
            color: "rgba(255,255,255,0.65)",
            fontFamily: FONT,
            fontSize: overflowFontSize,
            fontWeight: FONT_WEIGHT.medium,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  );
}
