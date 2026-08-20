import fs from "fs";
import sharp from "sharp";

const dir = "D:/Alice/git/0727_nav/public/rewards";
const page = `${dir}/page.html`;

/** Near-black → alpha for cup (jpeg masquerading as png). */
async function cupToTransparent(src, dest, thr = 22) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] <= thr && data[i + 1] <= thr && data[i + 2] <= thr) {
      data[i + 3] = 0;
    }
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);
  const m = await sharp(dest).metadata();
  console.log("cup.png", m.width, m.height, "alpha", m.hasAlpha, "bytes", m.size);
}

await cupToTransparent(`${dir}/cup-src-new.png`, `${dir}/cup.png`);

let html = fs.readFileSync(page, "utf8");

/* Figma 7837:36033 — each blade asset is upright 260.988×226.248;
   outer AABB sizes are rotation bounds only, do NOT stretch to them. */
const ART = `{
    purple:['/rewards/blades/purple.svg', 0, 260.988, 226.248],
    green :['/rewards/blades/green.svg', 0, 260.988, 226.248],
    teal  :['/rewards/blades/teal.svg', 0, 260.988, 226.248],
    pink  :['/rewards/blades/pink.svg', 0, 260.988, 226.248],
    tan   :['/rewards/blades/tan.svg', 0, 260.988, 226.248],
    yellow:['/rewards/blades/yellow.svg', 0, 260.988, 226.248],
    blue  :['/rewards/blades/blue.svg', 0, 260.988, 226.248]
  }`;

if (!/var ART=\{[\s\S]*?\};\s*\/\* clockwise/.test(html)) {
  console.error("ART block not found");
  process.exit(1);
}
html = html.replace(/var ART=\{[\s\S]*?\};\s*\/\* clockwise/, `var ART=${ART};\n  /* clockwise`);

/* Prefer contain so SVG aspect is preserved (boxes already match viewBox). */
html = html.replace(
  /.petal .pt img\{width:100%;height:100%;object-fit:[^;]+;display:block\}/,
  ".petal .pt img{width:100%;height:100%;object-fit:contain;display:block}",
);

/* Ensure viewport */
html = html.replace(
  '<meta name="viewport" content="width=1920">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
);

/* Tablet band 768–1023: tighten type to match nav design-system scales */
if (!html.includes("/* tablet 768 */")) {
  html = html.replace(
    "@media (max-width:1024px){",
    `@media (max-width:1279px){
  .page{gap:72px}
  .hero-h{font-size:clamp(22px,2.8vw,28px)!important}
  .hero-n{font-size:clamp(48px,5vw,64px)!important}
  .sec-title{font-size:clamp(22px,2.6vw,28px)!important}
  .sub-title{font-size:clamp(18px,2.2vw,22px)!important}
  .navpill a{font-size:14px;line-height:20px}
}
/* tablet 768 */
@media (max-width:1024px){`,
  );
}

fs.writeFileSync(page, html);
console.log("ART fixed to upright 260.988x226.248");
console.log("viewport", html.includes("device-width"));
console.log("petal contain", html.includes("object-fit:contain;display:block"));
