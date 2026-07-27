/** 18px right-arrow for suggest question rows */
export function SuggestArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden
    >
      <path
        d="M3.75 9H14.25"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.5 5.25L14.25 9L10.5 12.75"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
