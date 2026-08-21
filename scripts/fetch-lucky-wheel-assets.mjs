import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const h = fs.readFileSync("public/rewards/page.html", "utf8");
const start = h.indexOf("<!-- ═══════════ LUCKY WHEEL");
const end = h.indexOf("<!-- ═══════════ FLOATING CLAIM");
console.log("wheel html start", start, "end", end);
console.log(h.slice(start, start + 2800));

const assets = {
  "glow.svg": "https://www.figma.com/api/mcp/asset/1df655a7-e586-4148-8054-45c69d24fbbe.svg",
  "blade-0.svg": "https://www.figma.com/api/mcp/asset/c4d3e977-34eb-478a-84e8-7d743c346ab6.svg",
  "blade-1.svg": "https://www.figma.com/api/mcp/asset/ae786aa4-ba9d-4dcb-bfe4-1c52841367c3.svg",
  "blade-2.svg": "https://www.figma.com/api/mcp/asset/6133b33c-8815-4a40-976f-7bb9d7c1d6a8.svg",
  "blade-3.svg": "https://www.figma.com/api/mcp/asset/dc37f2de-ddc9-4010-bffc-a95c8f9205d9.svg",
  "blade-4.svg": "https://www.figma.com/api/mcp/asset/391904ce-ad2d-496b-96c8-88e2cdae7017.svg",
  "blade-5.svg": "https://www.figma.com/api/mcp/asset/1656704f-e45f-4961-a058-de92bca48d63.svg",
  "rim-inner.svg": "https://www.figma.com/api/mcp/asset/aab1a96d-8308-4a02-9612-693e093a22c1.svg",
  "rim-out.svg": "https://www.figma.com/api/mcp/asset/ae65b66c-b693-418a-9f17-39c4e5215493.svg",
  "spin-btn.svg": "https://www.figma.com/api/mcp/asset/93959cec-9a7e-46ab-8420-57df1e2e45bb.svg",
  "lights-top.svg": "https://www.figma.com/api/mcp/asset/66f5ca2b-ef38-4056-81bc-a73472e3a960.svg",
  "lights-bot.svg": "https://www.figma.com/api/mcp/asset/066dadde-4a2d-4c31-bf76-6a6d0b226890.svg",
  "pointer.svg": "https://www.figma.com/api/mcp/asset/80404961-df49-44e2-98a5-d53cb0cd11fa.svg",
  "spark-l.svg": "https://www.figma.com/api/mcp/asset/7d22c7b1-5556-49ea-bb36-075ad0b5a63f.svg",
  "spark-r.svg": "https://www.figma.com/api/mcp/asset/a7bf5bf0-9813-4a2c-be78-b802ba064536.svg",
  "prize-iphone.png": "https://www.figma.com/api/mcp/asset/b12188da-8e3b-473f-9ee6-8458eec1eb92.png",
  "prize-airpods.png": "https://www.figma.com/api/mcp/asset/767327f4-327b-41fa-ab53-ae6fb21dcca3.png",
  "prize-points.png": "https://www.figma.com/api/mcp/asset/e0550504-43c5-4747-b148-59065a97d5f9.png",
  "prize-usdc.png": "https://www.figma.com/api/mcp/asset/23412209-6357-42ae-9f27-c6febdf6097b.png",
  "prize-googlx.png": "https://www.figma.com/api/mcp/asset/862a8db7-df75-48e1-a45d-ed04df4deae0.png",
  "prize-switch.png": "https://www.figma.com/api/mcp/asset/b20f9a69-f292-4f6e-9fac-6d9550a9ee41.png",
};

const dir = "public/rewards/wheel";
fs.mkdirSync(dir, { recursive: true });

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchBuf(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

for (const [name, url] of Object.entries(assets)) {
  const buf = await fetchBuf(url);
  fs.writeFileSync(path.join(dir, name), buf);
  console.log("ok", name, buf.length);
}
