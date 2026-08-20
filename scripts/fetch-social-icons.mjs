import fs from "fs";
import sharp from "sharp";

const dir = "D:/Alice/git/0727_nav/public/rewards/missions";
const urls = {
  "social-x.png":
    "https://www.figma.com/api/mcp/asset/5ed2c075-6ff6-41b3-9ca7-5f019e1c0750.png",
  "social-tg.png":
    "https://www.figma.com/api/mcp/asset/cb03f5e2-2046-4c18-9229-b66bd23d1b93.png",
  "social-share.png":
    "https://www.figma.com/api/mcp/asset/8ab97227-2c76-45fb-9f24-40a2b6d2a313.png",
};

fs.mkdirSync(dir, { recursive: true });

for (const [name, url] of Object.entries(urls)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name} ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = `${dir}/${name}`;
  // Prefer Figma export; if no alpha, punch near-white corners only via threshold on mostly-white pixels
  let img = sharp(buf).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  // Only clear near-pure white (bg), keep bright metal highlights that aren't pure white RGB equal high
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // flat white/light gray bg: high luminance + low chroma
    if (min >= 248 && max - min <= 8) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);
  const m = await sharp(dest).metadata();
  console.log(name, m.width, m.height, m.hasAlpha, m.size);
}
