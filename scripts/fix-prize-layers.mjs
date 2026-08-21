import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const dir = "public/rewards/wheel";
fs.mkdirSync(dir, { recursive: true });

const assets = {
  "blade-10.svg": "https://www.figma.com/api/mcp/asset/954efc32-d886-4c22-b8d9-6bd0cdb3c0e4.svg",
  "blade-12.svg": "https://www.figma.com/api/mcp/asset/f4ddcb23-3079-47da-bf01-8c694bc651f5.svg",
  "blade-02.svg": "https://www.figma.com/api/mcp/asset/bd066d1e-c5a8-44a4-98bd-d70699c2aa55.svg",
  "blade-08.svg": "https://www.figma.com/api/mcp/asset/cb542993-92b0-455e-91ad-d01d79dfa454.svg",
  "blade-06.svg": "https://www.figma.com/api/mcp/asset/d87e664d-eef9-49d4-b61a-8d6f46711c1c.svg",
  "blade-04.svg": "https://www.figma.com/api/mcp/asset/b64a9f52-c1fa-4c00-875e-76b56da11a17.svg",
  "rim-inner.svg": "https://www.figma.com/api/mcp/asset/52d11e8c-6fda-4383-935d-051a8e00e3a5.svg",
  "rim-out.svg": "https://www.figma.com/api/mcp/asset/f9266ce4-6ade-421c-bd26-04f0dd2ea32e.svg",
  "rim-base.svg": "https://www.figma.com/api/mcp/asset/0c62b228-eb93-4cb2-bcae-37bb09793593.svg",
  "spin-btn.svg": "https://www.figma.com/api/mcp/asset/7d82f223-9377-434d-9027-d2a7684272fa.svg",
  "lights-top.svg": "https://www.figma.com/api/mcp/asset/f78b4b05-5506-4916-9682-f612e00a02bd.svg",
  "lights-bot.svg": "https://www.figma.com/api/mcp/asset/d204df7b-3020-4e76-8e08-33f3a20e93b6.svg",
  "pointer.svg": "https://www.figma.com/api/mcp/asset/d6914298-76c2-4529-8d07-7e529e3405f6.svg",
  "spark-l.svg": "https://www.figma.com/api/mcp/asset/030285a8-0b93-40a4-bdb5-c0c2200c7b6f.svg",
  "spark-r.svg": "https://www.figma.com/api/mcp/asset/94d1e714-2b2d-4cf4-8a8d-293780834001.svg",
};

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

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

/* HTML: add rim-base for layer order; keep structure */
html = html.replace(
  `  <div class="lw-stage" id="lw-stage">
    <img class="lw-glow" src="/rewards/wheel/glow.svg" alt="">
    <div class="lw-rot" id="wheel-rot" aria-hidden="true"></div>
    <img class="lw-rim-inner" src="/rewards/wheel/rim-inner.svg" alt="">
    <img class="lw-rim-out" src="/rewards/wheel/rim-out.svg" alt="">
    <img class="lw-lights-t" src="/rewards/wheel/lights-top.svg" alt="">
    <img class="lw-lights-b" src="/rewards/wheel/lights-bot.svg" alt="">
    <div class="lw-pointer" id="lw-pointer">
      <img class="lw-pointer-img" src="/rewards/wheel/pointer.svg" alt="">
      <img class="lw-spark lw-spark-l" src="/rewards/wheel/spark-l.svg" alt="">
      <img class="lw-spark lw-spark-r" src="/rewards/wheel/spark-r.svg" alt="">
    </div>
    <button type="button" class="lw-cta" id="spin-btn" aria-label="Spin">
      <img class="lw-cta-bg" src="/rewards/wheel/spin-btn.svg" alt="">
      <span class="lw-cta-label">SPIN</span>
    </button>
    <p class="lw-cap">Use <b id="spin-use">1</b> of your <b id="spin-left">3</b> available spins</p>
  </div>`,
  `  <div class="lw-stage" id="lw-stage">
    <img class="lw-glow" src="/rewards/wheel/glow.svg" alt="">
    <img class="lw-rim-base" src="/rewards/wheel/rim-base.svg" alt="">
    <div class="lw-rot" id="wheel-rot" aria-hidden="true"></div>
    <img class="lw-rim-inner" src="/rewards/wheel/rim-inner.svg" alt="">
    <img class="lw-rim-out" src="/rewards/wheel/rim-out.svg" alt="">
    <img class="lw-lights-t" src="/rewards/wheel/lights-top.svg" alt="">
    <img class="lw-lights-b" src="/rewards/wheel/lights-bot.svg" alt="">
    <div class="lw-pointer" id="lw-pointer">
      <img class="lw-pointer-img" src="/rewards/wheel/pointer.svg" alt="">
      <img class="lw-spark lw-spark-l" src="/rewards/wheel/spark-l.svg" alt="">
      <img class="lw-spark lw-spark-r" src="/rewards/wheel/spark-r.svg" alt="">
    </div>
    <button type="button" class="lw-cta" id="spin-btn" aria-label="Spin">
      <img class="lw-cta-bg" src="/rewards/wheel/spin-btn.svg" alt="">
      <span class="lw-cta-label">SPIN</span>
    </button>
    <p class="lw-cap">Use <b id="spin-use">1</b> of your <b id="spin-left">3</b> available spins</p>
  </div>`
);

/* Replace CSS for rot/blades/prizes/layers */
const cssOldStart = html.indexOf(".lw-glow{");
const cssOldEnd = html.indexOf(".lw-rim-inner{");
if (cssOldStart < 0 || cssOldEnd < 0) throw new Error("css block missing");

const newMidCss = `.lw-glow{
  position:absolute;left:311px;top:95px;width:812px;height:812px;
  pointer-events:none;z-index:0;opacity:.95
}
.lw-rim-base{
  position:absolute;left:290px;top:74px;width:854px;height:854px;
  pointer-events:none;z-index:1
}
/* rotates: blades + prizes only (Figma prizes sit above blades, under chrome) */
.lw-rot{
  position:absolute;inset:0;z-index:2;
  transform-origin:717px 501px;will-change:transform
}
.lw-blades{
  position:absolute;left:346px;top:129px;width:743.4px;height:744px;
  pointer-events:none;z-index:0
}
.lw-blade{
  position:absolute;display:block;max-width:none;pointer-events:none
}
/* Figma absolute prize slots — not radial/center-axis */
.lw-prize{
  position:absolute;z-index:1;
  display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;
  pointer-events:none
}
.lw-prize img{
  width:164px;height:110px;object-fit:contain;flex:none;
  filter:drop-shadow(0 0 14px rgba(219,253,92,.2))
}
.lw-pt{margin:0;font-size:20px;font-weight:600;line-height:23px;color:var(--green);white-space:nowrap}
.lw-ps{margin:0;font-size:14px;font-weight:500;line-height:18px;color:rgba(255,255,255,.6);opacity:.8;max-width:160px}
`;

html = html.slice(0, cssOldStart) + newMidCss + html.slice(cssOldEnd);

/* bump z-index on chrome layers */
html = html.replace(
  `.lw-rim-inner{
  position:absolute;left:311px;top:95px;width:813px;height:813px;
  pointer-events:none;z-index:2
}
.lw-rim-out{
  position:absolute;left:294px;top:78px;width:846px;height:846px;
  pointer-events:none;z-index:3
}
.lw-lights-t{
  position:absolute;left:420px;top:178.7px;width:600px;height:56.5px;
  pointer-events:none;z-index:4
}
.lw-lights-b{
  position:absolute;left:426px;top:767.3px;width:592px;height:62.5px;
  pointer-events:none;z-index:4;transform:scaleY(-1)
}
.lw-pointer{
  position:absolute;left:655px;top:28px;width:125px;height:125px;z-index:6;`,
  `.lw-rim-inner{
  position:absolute;left:311px;top:95px;width:813px;height:813px;
  pointer-events:none;z-index:3
}
.lw-rim-out{
  position:absolute;left:294px;top:78px;width:846px;height:846px;
  pointer-events:none;z-index:4
}
.lw-lights-t{
  position:absolute;left:420px;top:178.7px;width:600px;height:56.5px;
  pointer-events:none;z-index:5
}
.lw-lights-b{
  position:absolute;left:426px;top:767.3px;width:592px;height:62.5px;
  pointer-events:none;z-index:5;transform:scaleY(-1)
}
.lw-pointer{
  position:absolute;left:655px;top:28px;width:125px;height:125px;z-index:8;`
);

html = html.replace(
  `.lw-cta{
  position:absolute;left:613px;top:397px;width:208px;height:208px;z-index:7;`,
  `.lw-cta{
  position:absolute;left:613px;top:397px;width:208px;height:208px;z-index:9;`
);

html = html.replace(
  `.lw-cap{
  position:absolute;left:0;right:0;top:997px;z-index:5;margin:0;`,
  `.lw-cap{
  position:absolute;left:0;right:0;top:983px;z-index:5;margin:0;`
);

const newJsBuild = `  /* Figma 7851:31571 / 7851:31568 — absolute blades + prizes */
  var blades=[
    {src:'/rewards/wheel/blade-10.svg', left:0, top:58.717, w:349.845, h:306.688},
    {src:'/rewards/wheel/blade-12.svg', left:197.181, top:0, w:349.708, h:344.01},
    {src:'/rewards/wheel/blade-02.svg', left:393.204, top:59.717, w:349.845, h:306.688},
    {src:'/rewards/wheel/blade-08.svg', left:0.646, top:377.4, w:348.958, h:308.456},
    {src:'/rewards/wheel/blade-06.svg', left:197.181, top:400, w:349.708, h:344.01},
    {src:'/rewards/wheel/blade-04.svg', left:394.445, top:377.4, w:348.958, h:308.456}
  ];
  /* stage coords from Figma (not radial center-axis) */
  var prizes=[
    {img:'/rewards/wheel/prize-iphone.png', title:'iPhone 17 Pro Max', sub:'Limited grand prize', left:632, top:165, w:169, h:167, ang:0},
    {img:'/rewards/wheel/prize-points.png', title:'50–300 Points', sub:'Guaranteed reward pool', left:844, top:292, w:169, h:185, ang:60},
    {img:'/rewards/wheel/prize-airpods.png', title:'AirPods Pro', sub:'Limited grand prize', left:856, top:524, w:164, h:170, ang:120},
    {img:'/rewards/wheel/prize-usdc.png', title:'Up to 168 USDC', sub:'On-chain reward', left:632, top:654, w:169, h:167, ang:180},
    {img:'/rewards/wheel/prize-switch.png', title:'Switch 2', sub:'Limited grand prize', left:420, top:524, w:169, h:167, ang:240},
    {img:'/rewards/wheel/prize-googlx.png', title:'0.05 GOOGLX', sub:'On-chain reward', left:421, top:307, w:164, h:170, ang:300}
  ];
  var wheel=document.getElementById('wheel-rot');
  if(!wheel) return;
  var html='<div class="lw-blades">';
  for(var b=0;b<blades.length;b++){
    var bl=blades[b];
    html+='<img class="lw-blade" src="'+bl.src+'" alt="" style="left:'+bl.left+'px;top:'+bl.top+'px;width:'+bl.w+'px;height:'+bl.h+'px">';
  }
  html+='</div>';
  for(var i=0;i<prizes.length;i++){
    var p=prizes[i];
    html+='<div class="lw-prize" data-ang="'+p.ang+'" style="left:'+p.left+'px;top:'+p.top+'px;width:'+p.w+'px">'+
      '<img src="'+p.img+'" alt="" width="164" height="110">'+
      '<p class="lw-pt">'+p.title+'</p>'+
      '<p class="lw-ps">'+p.sub+'</p>'+
    '</div>';
  }
  wheel.innerHTML=html;
`;

const oldBuildStart = html.indexOf("  /* Figma 7851:32259");
const oldBuildEnd = html.indexOf("  wheel.innerHTML=html;");
if (oldBuildStart < 0 || oldBuildEnd < 0) {
  // try alternate marker
  const alt = html.indexOf("  /* clockwise from top");
  console.log("markers", oldBuildStart, oldBuildEnd, alt);
  throw new Error("js build markers missing");
}
html =
  html.slice(0, oldBuildStart) +
  newJsBuild +
  html.slice(oldBuildEnd + "  wheel.innerHTML=html;".length);

fs.writeFileSync(PAGE, html);
console.log("patched ok", html.length);
