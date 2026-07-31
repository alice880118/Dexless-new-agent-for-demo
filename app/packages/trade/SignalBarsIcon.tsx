/** Four ascending filled signal bars — matches trade order signal asset. */
export function SignalBarsIcon({
  size = 16,
  color = "rgba(255,255,255,0.9)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: "block", width: size, height: size, flexShrink: 0 }}
    >
      <rect x="2" y="10" width="2.5" height="4" rx="0.5" fill={color} />
      <rect x="5.5" y="7.5" width="2.5" height="6.5" rx="0.5" fill={color} />
      <rect x="9" y="5" width="2.5" height="9" rx="0.5" fill={color} />
      <rect x="12.5" y="2.5" width="2.5" height="11.5" rx="0.5" fill={color} />
    </svg>
  );
}
