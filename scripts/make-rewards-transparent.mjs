import fs from "fs";
import sharp from "sharp";

async function removeNearBlack(input, output, threshold = 18) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);

  const meta = await sharp(output).metadata();
  console.log(
    "wrote",
    output,
    meta.width,
    "x",
    meta.height,
    "hasAlpha",
    meta.hasAlpha,
  );
}

const dir = "D:/Alice/git/0727_nav/public/rewards";
await removeNearBlack(`${dir}/cup-src.png`, `${dir}/cup.png`, 22);
await removeNearBlack(`${dir}/popup-gift.png`, `${dir}/popup-gift.png`, 18);
await removeNearBlack(
  `${dir}/starter-badge.png`,
  `${dir}/starter-badge.png`,
  18,
);

// also check originals
for (const f of ["cup.png", "popup-gift.png", "starter-badge.png"]) {
  const m = await sharp(`${dir}/${f}`).metadata();
  console.log(f, m.format, m.hasAlpha, m.size);
}
