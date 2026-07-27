/** 15px flame icon for quick-select chips */
export function FlameIcon({ color }: { color: string }) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden
    >
      <path
        d="M7.5 1.2C7.5 1.2 5.85 3.35 5.85 5.45C5.85 6.35 6.25 7.15 7.05 7.55C6.55 6.95 6.35 6.15 6.45 5.35C4.95 6.55 4.2 8.15 4.2 9.75C4.2 12.05 5.8 13.8 7.5 13.8C9.2 13.8 10.8 12.05 10.8 9.75C10.8 7.55 9.35 5.55 7.5 1.2Z"
        fill={color}
      />
      <path
        d="M7.5 8.55C6.75 9.25 6.35 10.15 6.45 11.05C6.85 10.65 7.35 10.45 7.9 10.45C8.35 10.45 8.75 10.6 9.05 10.9C9.25 10.25 8.85 9.35 7.5 8.55Z"
        fill={color}
        opacity={0.55}
      />
    </svg>
  );
}
