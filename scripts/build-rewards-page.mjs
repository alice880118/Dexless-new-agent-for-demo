import fs from "fs";

const src = "c:/Users/user/Downloads/dexless-rewards.html";
const out = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(src, "utf8");

const heroNew = `
<section class="hero-sec" id="rewards">
  <div class="wrap">
    <div class="hero" style="position:relative;width:1434px;height:519px;background:#000;overflow:hidden">
      <img class="hero-bg-img" src="/rewards/hero-bg.png" alt=""
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:1" />
      <div class="d fc trophy-wrap" style="left:565px;top:-8px;width:478px;height:537px;z-index:3">
        <img class="trophy-img" src="/rewards/cup.png" alt="Trophy" width="406" height="477"
          style="width:406px;height:477px;object-fit:contain;object-position:bottom;display:block" />
      </div>
      <div class="d" style="left:0;bottom:0;width:1434px;height:112px;background:linear-gradient(to top,#000 24.163%,rgba(0,0,0,0) 91.627%);pointer-events:none;z-index:4"></div>
      <div class="d" style="left:0;top:0;width:1434px;height:116px;background:linear-gradient(to bottom,#000 0%,rgba(0,0,0,0) 100%);pointer-events:none;z-index:4"></div>
      <div class="d" style="left:0;top:0;width:260px;height:519px;background:linear-gradient(to right,#000,rgba(0,0,0,0));pointer-events:none;z-index:4"></div>
      <div class="d" style="right:0;top:0;width:189px;height:519px;background:linear-gradient(to left,#000,rgba(0,0,0,0));pointer-events:none;z-index:4"></div>
      <div class="d hero-copy" style="left:117px;top:69px;width:530px;display:flex;flex-direction:column;gap:54px;align-items:flex-start;z-index:5">
        <div class="tagchip">Volume Race + ROI Masters</div>
        <div style="display:flex;flex-direction:column;gap:10px;width:100%">
          <p class="hero-h">Genesis Trading Competition</p>
          <p class="hero-n">6,666 USDC</p>
        </div>
        <div style="display:flex;gap:24px;align-items:center">
          <button class="btn btn-p" style="width:200px;padding:12px 28px;line-height:20px">Trade Now</button>
          <button class="btn btn-g" style="padding:12px 28px;line-height:20px">View prize breakdown</button>
        </div>
      </div>
      <div class="d hero-cd" style="left:995px;top:292px;width:392px;display:flex;flex-direction:column;gap:18px;align-items:center;z-index:5">
        <div style="display:flex;flex-direction:column;gap:21px;width:100%;text-align:center">
          <p style="font-size:16px;font-weight:700;line-height:24px;color:var(--w80);text-transform:capitalize">Challenge ends in</p>
          <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
            <div class="cd-box on"><b id="cd-d">13</b><span>Days</span></div>
            <div class="cd-box"><b id="cd-h">23</b><span>Hrs</span></div>
            <div class="cd-box"><b id="cd-m">59</b><span>Min</span></div>
            <div class="cd-box" style="background:transparent"><b id="cd-s">59</b><span>Sec</span></div>
          </div>
        </div>
        <p style="font-size:18px;font-weight:500;line-height:24px;text-align:center;opacity:.5;background:linear-gradient(90deg,rgba(255,255,255,.81),rgba(255,255,255,.9));-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 16px rgba(0,0,0,.8)">Top 50 rewarded on each.</p>
      </div>
    </div>
  </div>
</section>
`;

const heroRe = /<!-- ═+ HERO ═+ -->[\s\S]*?(?=<!-- ═+ NAV ═+)/;
if (!heroRe.test(html)) {
  console.error("hero block not found");
  process.exit(1);
}
html = html.replace(heroRe, `${heroNew}\n`);

const trophyCss = `
/* trophy motion */
@keyframes trophyFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes trophyWiggle{0%{transform:rotate(0deg)}20%{transform:rotate(-10deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(6deg)}100%{transform:rotate(0deg)}}
.trophy-wrap{animation:trophyFloat 3.2s ease-in-out infinite;transform-origin:50% 80%;cursor:pointer}
.trophy-wrap .trophy-img{transform-origin:50% 80%;display:block}
.trophy-wrap.enter .trophy-img,.trophy-wrap:hover .trophy-img{animation:trophyWiggle .7s ease}
.trophy-wrap:hover{animation-play-state:paused}
body{min-width:0!important;overflow-x:auto}
.page{align-items:center}
`;

html = html.replace("</style>\n</head>", `${trophyCss}</style>\n</head>`);
html = html.replace(
  /\.trophy\{animation:fa 8s ease-in-out infinite\}/,
  "/* old trophy float replaced */",
);

html = html.replaceAll(
  "https://www.figma.com/api/mcp/asset/96f6e06c-2b10-4863-888a-d43973478f75.png",
  "/rewards/starter.png",
);
html = html.replaceAll(
  "https://www.figma.com/api/mcp/asset/dbb663bc-e5e7-499e-b3c7-8e1d73794773.png",
  "/rewards/gift-phone.png",
);
html = html.replaceAll(
  "https://www.figma.com/api/mcp/asset/c4f5b5b3-4c73-46fc-9d0f-3c98bf112584.png",
  "/rewards/hero-banner.png",
);
html = html.replaceAll(
  "https://www.figma.com/api/mcp/asset/b8c2f30b-1ff9-4577-b3ae-eb61f50a136b.png",
  "/rewards/first-trade-gift.png",
);

const enterScript = `
<script>
(function(){
  var t=document.querySelector('.trophy-wrap');
  if(!t) return;
  t.classList.add('enter');
  setTimeout(function(){ t.classList.remove('enter'); }, 800);
})();
</script>
`;
html = html.replace("</body>", `${enterScript}</body>`);

fs.writeFileSync(out, html);
console.log("wrote", out, fs.statSync(out).size);
console.log("hero-bg", html.includes("/rewards/hero-bg.png"));
console.log("cup", html.includes("/rewards/cup.png"));
