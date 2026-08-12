import { useEffect, useId, useMemo, useState } from "react";
import type { SignalCardData } from "../agent/SignalViews";

type ChartSpec = {
  lo: number;
  hi: number;
  slN: number;
  entryN: number;
  tpN: number;
  nowN: number;
  zone: [number, number];
  zoneLabel: string;
  keys: number[];
  axis: string[];
  cls: "short" | "long";
  last: string;
  chg: string;
  chgUp: boolean;
};

function parsePrice(v: string): number {
  return Number(String(v).replace(/,/g, ""));
}

function fmt(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const BTC_KEYS = [
  0.3, 0.41, 0.35, 0.54, 0.71, 0.92, 0.96, 0.79, 0.63, 0.55, 0.68, 0.86, 0.94,
  0.9, 0.72, 0.58, 0.51, 0.63, 0.81, 0.95, 0.97, 0.85, 0.67, 0.55, 0.43,
];

const ETH_KEYS = [
  0.74, 0.61, 0.45, 0.28, 0.17, 0.24, 0.36, 0.3, 0.19, 0.15, 0.26, 0.38, 0.34,
  0.21, 0.16, 0.29, 0.45, 0.53, 0.46, 0.37, 0.47, 0.57, 0.51, 0.45, 0.42,
];

const AXIS = ["07:00", "08:00", "09:00", "10:00", "11:00"];

function buildSpec(data: SignalCardData): ChartSpec {
  const entryN = parsePrice(data.entry);
  const slN = parsePrice(data.stopLoss);
  const tpN = parsePrice(data.takeProfit);
  const isShort = data.side === "SHORT";

  if (data.symbol.includes("BTC") && isShort) {
    return {
      lo: 60900,
      hi: 64260,
      slN,
      entryN,
      tpN,
      nowN: 62340.1,
      zone: [63952, 64234.1],
      zoneLabel: "Resistance 63,952 – 64,234",
      keys: [...BTC_KEYS],
      axis: AXIS,
      cls: "short",
      last: "62,340.10",
      chg: "−0.82%",
      chgUp: false,
    };
  }
  if (data.symbol.includes("ETH") && !isShort) {
    return {
      lo: 2436,
      hi: 2542,
      slN,
      entryN,
      tpN,
      nowN: 2479.8,
      zone: [2452, 2472],
      zoneLabel: "Support 2,452 – 2,472",
      keys: [...ETH_KEYS],
      axis: AXIS,
      cls: "long",
      last: "2,479.80",
      chg: "+1.24%",
      chgUp: true,
    };
  }

  const mid = entryN;
  const span = Math.max(Math.abs(slN - entryN), Math.abs(tpN - entryN), mid * 0.02);
  const lo = isShort ? mid - span * 0.55 : mid - span * 0.7;
  const hi = isShort ? mid + span * 0.95 : mid + span * 0.55;
  const nowN = isShort ? entryN + span * 0.08 : entryN - span * 0.05;
  const zone: [number, number] = isShort
    ? [slN - span * 0.08, slN - span * 0.02]
    : [slN + span * 0.02, slN + span * 0.12];
  const chgAbs = ((nowN - entryN) / entryN) * 100;
  const chgUp = chgAbs >= 0;

  return {
    lo,
    hi,
    slN,
    entryN,
    tpN,
    nowN,
    zone,
    zoneLabel: isShort
      ? `Resistance ${fmt(zone[0])} – ${fmt(zone[1])}`
      : `Support ${fmt(zone[0])} – ${fmt(zone[1])}`,
    keys: isShort ? [...BTC_KEYS] : [...ETH_KEYS],
    axis: AXIS,
    cls: isShort ? "short" : "long",
    last: fmt(nowN),
    chg: `${chgUp ? "+" : "−"}${Math.abs(chgAbs).toFixed(2)}%`,
    chgUp,
  };
}

/** Port of signal-detail-943.html drawChart + live tick simulation. */
export function PriceStructureChart({ data }: { data: SignalCardData }) {
  const gradId = useId().replace(/:/g, "");
  const base = useMemo(() => buildSpec(data), [data]);
  const [tick, setTick] = useState(0);
  const [tf, setTf] = useState("4H");

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 900);
    return () => window.clearInterval(id);
  }, [data.id]);

  const live = useMemo(() => {
    const wave = Math.sin(tick * 0.85) * 0.012 + Math.cos(tick * 0.41) * 0.006;
    const keys = base.keys.map((k, i) => {
      if (i < base.keys.length - 3) return k;
      return Math.min(0.99, Math.max(0.01, k + wave * (i - base.keys.length + 4)));
    });
    const nowN = base.nowN * (1 + wave * 0.35);
    const chgAbs = ((nowN - base.entryN) / base.entryN) * 100;
    const chgUp = chgAbs >= 0;
    return {
      ...base,
      keys,
      nowN,
      last: fmt(nowN),
      chg: `${chgUp ? "+" : "−"}${Math.abs(chgAbs).toFixed(2)}%`,
      chgUp,
    };
  }, [base, tick]);

  const svg = useMemo(
    () => buildChartSvg(live, `ttlg-${gradId}`, tick),
    [live, gradId, tick],
  );

  return (
    <div
      style={{
        border: "1px solid #232529",
        borderRadius: 11,
        background: "#0c0d0f",
        padding: "11px 12px 6px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: 3, marginBottom: 9 }}>
        {(["15m", "1H", "4H", "1D", "1W"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTf(t)}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              color: tf === t ? "#fff" : "#5f646a",
              padding: "3px 8px",
              borderRadius: 5,
              border: "none",
              background: tf === t ? "#1e2125" : "transparent",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div
        style={{ width: "100%" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

function buildChartSvg(c: ChartSpec, gradId: string, tick: number): string {
  let seed = 11 + (tick % 7);
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const W = 420;
  const H = 260;
  const padT = 12;
  const padB = 24;
  const axisW = 60;
  const plotW = W - axisW;
  const span = Math.max(c.slN, c.tpN, c.hi) - Math.min(c.slN, c.tpN, c.lo);
  const yMax = Math.max(c.slN, c.tpN, c.hi) + span * 0.05;
  const yMin = Math.min(c.slN, c.tpN, c.lo) - span * 0.05;
  const y = (p: number) => padT + ((yMax - p) / (yMax - yMin)) * (H - padT - padB);
  const n = c.keys.length;
  const candArea = plotW * 0.78;
  const step = candArea / n;
  const bw = Math.min(step * 0.62, 8);
  const px = (k: number) => c.lo + k * (c.hi - c.lo);
  const s: string[] = [];

  const levels = [
    { p: c.slN, col: "#ff41a3", nm: "Stop loss", dash: "5 4" as string | null },
    { p: c.tpN, col: "#35d0b8", nm: "Take profit", dash: "5 4" as string | null },
    { p: c.entryN, col: "#f5c451", nm: "Entry (limit)", dash: "6 4" as string | null },
    { p: c.nowN, col: "#7b61ff", nm: null as string | null, dash: null as string | null },
  ];
  const taken = levels.map((l) => y(l.p));

  s.push(`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto">`);
  s.push(`<defs><linearGradient id="${gradId}" x1="0" x2="1">
    <stop offset="0" stop-color="rgba(123,97,255,.15)"/><stop offset="1" stop-color="rgba(123,97,255,.02)"/></linearGradient></defs>`);

  const rough = (yMax - yMin) / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const stepP =
    [1, 2, 2.5, 5, 10].map((m) => m * mag).find((v) => v >= rough) || mag * 10;
  for (let p = Math.ceil(yMin / stepP) * stepP; p < yMax; p += stepP) {
    const gy = y(p);
    s.push(
      `<line x1="0" y1="${gy}" x2="${plotW}" y2="${gy}" stroke="rgba(255,255,255,.045)"/>`,
    );
    if (taken.every((t) => Math.abs(t - gy) > 13)) {
      s.push(
        `<text x="${plotW + 7}" y="${gy + 3.4}" fill="#5f646a" font-family="Poppins" font-size="10">${fmt(p)}</text>`,
      );
    }
  }

  s.push(
    `<rect x="${candArea}" y="${padT}" width="${plotW - candArea}" height="${H - padT - padB}" fill="url(#${gradId})"/>`,
  );
  s.push(
    `<line x1="${candArea}" y1="${padT}" x2="${candArea}" y2="${H - padB}" stroke="rgba(123,97,255,.4)" stroke-dasharray="2 3"/>`,
  );

  const zT = y(c.zone[1]);
  const zB = y(c.zone[0]);
  const zc = c.cls === "short" ? "255,65,163" : "53,208,184";
  s.push(
    `<rect x="0" y="${zT}" width="${plotW}" height="${Math.max(1, zB - zT)}" fill="rgba(${zc},.07)"/>`,
  );
  s.push(
    `<line x1="0" y1="${zT}" x2="${plotW}" y2="${zT}" stroke="rgba(${zc},.26)"/>`,
  );
  s.push(
    `<line x1="0" y1="${zB}" x2="${plotW}" y2="${zB}" stroke="rgba(${zc},.26)"/>`,
  );
  s.push(
    `<text x="${plotW - 5}" y="${(zT + zB) / 2 + 3}" fill="#7a8087" font-family="Poppins" font-size="10" text-anchor="end">${c.zoneLabel}</text>`,
  );

  for (let i = 0; i < n; i++) {
    const o = px(i === 0 ? c.keys[0] : c.keys[i - 1]);
    const cl = px(c.keys[i]);
    const wick = (c.hi - c.lo) * 0.03;
    const hi = Math.max(o, cl) + wick * (0.35 + rnd());
    const lo = Math.min(o, cl) - wick * (0.35 + rnd());
    const x = i * step + step / 2;
    const col = cl >= o ? "#35d0b8" : "#ff41a3";
    s.push(
      `<line x1="${x}" y1="${y(hi)}" x2="${x}" y2="${y(lo)}" stroke="${col}" stroke-width="1.2"/>`,
    );
    s.push(
      `<rect x="${x - bw / 2}" y="${y(Math.max(o, cl))}" width="${bw}" height="${Math.max(1.6, Math.abs(y(o) - y(cl)))}" fill="${col}" rx="1"/>`,
    );
  }

  levels.forEach((l) => {
    const yy = y(l.p);
    if (l.dash && l.nm) {
      s.push(
        `<line x1="0" y1="${yy}" x2="${plotW}" y2="${yy}" stroke="${l.col}" stroke-width="1.2" stroke-dasharray="${l.dash}"/>`,
      );
      const w = l.nm.length * 4.7 + 8;
      s.push(
        `<rect x="2" y="${yy - 13}" width="${w}" height="12" rx="2.5" fill="#0c0d0f" opacity=".82"/>`,
      );
      s.push(
        `<text x="6" y="${yy - 4}" fill="${l.col}" font-family="Poppins" font-size="10">${l.nm}</text>`,
      );
      s.push(
        `<rect x="${plotW + 3}" y="${yy - 8}" width="${axisW - 6}" height="16" rx="3" fill="${l.col}"/>`,
      );
      s.push(
        `<text x="${plotW + 7}" y="${yy + 3.6}" fill="#0a0b0c" font-family="Poppins" font-size="10" font-weight="700">${fmt(l.p)}</text>`,
      );
    } else {
      const lastX = (n - 1) * step + step / 2;
      const pulse = 0.18 + (Math.sin(tick * 0.9) + 1) * 0.1;
      s.push(
        `<line x1="0" y1="${yy}" x2="${plotW}" y2="${yy}" stroke="${l.col}" stroke-width="1"/>`,
      );
      s.push(
        `<circle cx="${lastX}" cy="${yy}" r="6.5" fill="#9d8bff" opacity="${pulse}"/>`,
      );
      s.push(
        `<circle cx="${lastX}" cy="${yy}" r="3.2" fill="#9d8bff"/>`,
      );
      s.push(
        `<rect x="${plotW + 3}" y="${yy - 8}" width="${axisW - 6}" height="16" rx="3" fill="${l.col}"/>`,
      );
      s.push(
        `<text x="${plotW + 7}" y="${yy + 3.6}" fill="#fff" font-family="Poppins" font-size="10" font-weight="700">${fmt(l.p)}</text>`,
      );
    }
  });

  s.push(
    `<line x1="0" y1="${H - padB}" x2="${plotW}" y2="${H - padB}" stroke="rgba(255,255,255,.07)"/>`,
  );
  c.axis.forEach((t, i) => {
    const x = i * (candArea / (c.axis.length - 1));
    s.push(
      `<text x="${Math.min(Math.max(x, 13), candArea)}" y="${H - 8}" fill="#5f646a" font-family="Poppins" font-size="10" text-anchor="middle">${t}</text>`,
    );
  });
  s.push("</svg>");
  return s.join("");
}
