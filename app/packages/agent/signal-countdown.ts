import { useEffect, useState } from "react";

type TimerStart = {
  startMs: number;
  initialSec: number;
};

/** Module-level starts so list ↔ detail share the same countdown. */
const timerStarts = new Map<string, TimerStart>();

export function parseTimerToSeconds(timer: string): number {
  const parts = timer.split(":").map((p) => Number(p));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Number(parts[0]) || 0;
}

export function formatSecondsToTimer(total: number): string {
  const t = Math.max(0, Math.floor(total));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useSignalCountdownState(
  id: string,
  initialTimer: string,
): {
  label: string;
  remainingSec: number;
  initialSec: number;
  /** 1 → full time left; 0 → expired */
  progress: number;
} {
  const [now, setNow] = useState(() => Date.now());

  if (!timerStarts.has(id)) {
    timerStarts.set(id, {
      startMs: Date.now(),
      initialSec: parseTimerToSeconds(initialTimer),
    });
  }

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, [id]);

  const start = timerStarts.get(id)!;
  const elapsed = Math.floor((now - start.startMs) / 1000);
  const remainingSec = Math.max(0, start.initialSec - elapsed);
  const progress =
    start.initialSec > 0 ? remainingSec / start.initialSec : 0;

  return {
    label: formatSecondsToTimer(remainingSec),
    remainingSec,
    initialSec: start.initialSec,
    progress,
  };
}

export function useSignalCountdown(id: string, initialTimer: string): string {
  return useSignalCountdownState(id, initialTimer).label;
}
