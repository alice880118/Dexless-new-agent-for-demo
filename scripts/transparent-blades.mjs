import fs from "fs";
import sharp from "sharp";

const bladeDir = "D:/Alice/git/0727_nav/public/rewards/blades";
const files = fs.readdirSync(bladeDir).filter((f) => /^blade-\d+\.png$/.test(f));

for (const f of files) {
  const input = `${bladeDir}/${f}`;
  const tmp = `${bladeDir}/_${f}`;
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] <= 22 && data[i + 1] <= 22 && data[i + 2] <= 22) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(tmp);
  fs.renameSync(tmp, input);
  const meta = await sharp(input).metadata();
  console.log(f, meta.width, "x", meta.height, "alpha", meta.hasAlpha);
}
