import fs from "fs";
import sharp from "sharp";

const html = fs.readFileSync(
  "D:/Alice/git/0727_nav/public/rewards/page.html",
  "utf8",
);
const m = html.match(/var ART=\{[\s\S]*?\};\s*\/\* clockwise/);
const block = m[0];
const keys = ["purple", "green", "teal", "pink", "tan", "yellow", "blue"];
for (const k of keys) {
  const re = new RegExp(
    k + "\\s*:\\[[\\s\\S]*?,\\s*([\\d.]+)\\s*,\\s*([\\d.]+)\\s*,\\s*([\\d.]+)\\s*\\]",
  );
  const mm = block.match(re);
  console.log(k, mm ? [+mm[1], +mm[2], +mm[3]] : "fail");
}

// process blades to transparent
const bladeDir = "D:/Alice/git/0727_nav/public/rewards/blades";
const files = fs.readdirSync(bladeDir).filter((f) => f.endsWith(".png"));
for (const f of files) {
  const input = `${bladeDir}/${f}`;
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] <= 20 && data[i + 1] <= 20 && data[i + 2] <= 20) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(input);
  const meta = await sharp(input).metadata();
  console.log("blade", f, meta.width, meta.height, meta.hasAlpha);
}
