import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const dir = "public/rewards/wheel";
fs.mkdirSync(dir, { recursive: true });

const assets = {
  "glow.svg": "https://www.figma.com/api/mcp/asset/b2a29d3c-b18c-42ab-8d03-b9a23baacf15.svg",
  "rim-base.svg": "https://www.figma.com/api/mcp/asset/651cf265-a68c-497c-afff-4abcdd2adb3c.svg",
  "blade-0.svg": "https://www.figma.com/api/mcp/asset/964ba824-256e-4642-8c8f-d31fffc01dee.svg",
  "blade-1.svg": "https://www.figma.com/api/mcp/asset/0315aeb2-b40f-4ef6-9f29-113182f74c27.svg",
  "blade-2.svg": "https://www.figma.com/api/mcp/asset/4f2b0ae4-1e24-4160-a0de-635a869cba6d.svg",
  "blade-3.svg": "https://www.figma.com/api/mcp/asset/41f7dce1-5c94-48e1-bef4-7afbd02414ce.svg",
  "blade-4.svg": "https://www.figma.com/api/mcp/asset/47c39075-aa5f-4cc9-8dc9-102c1f9b6e13.svg",
  "blade-5.svg": "https://www.figma.com/api/mcp/asset/2a4ef227-8274-4ca7-b3d6-394370fabed6.svg",
  "rim-inner.svg": "https://www.figma.com/api/mcp/asset/dcad41ad-0d1c-450e-976e-cf5cfac9f36d.svg",
  "rim-out.svg": "https://www.figma.com/api/mcp/asset/5f272fdc-583f-4b54-989d-71cacee5d642.svg",
  "spin-btn.svg": "https://www.figma.com/api/mcp/asset/43330e70-9174-4c09-9868-ce6a8a905065.svg",
  "lights-top.svg": "https://www.figma.com/api/mcp/asset/204c48e8-d07b-492b-8089-bcef8503931d.svg",
  "lights-bot.svg": "https://www.figma.com/api/mcp/asset/c5f63076-c56a-4691-a662-ab21c4737ca2.svg",
  "pointer.svg": "https://www.figma.com/api/mcp/asset/5dd2797b-33ca-473f-9077-3786cf3af199.svg",
  "spark-l.svg": "https://www.figma.com/api/mcp/asset/b6b79650-cb21-4865-a43a-3d00640dc200.svg",
  "spark-r.svg": "https://www.figma.com/api/mcp/asset/1f73a9d5-d05b-4355-932a-b52b9b14daa6.svg",
  "prize-iphone.png": "https://www.figma.com/api/mcp/asset/2235fd99-4e2f-48d6-bfd0-38bf3eafd677.png",
  "prize-switch.png": "https://www.figma.com/api/mcp/asset/2a0a4f71-ff11-4e77-9fff-85836163456a.png",
  "prize-airpods.png": "https://www.figma.com/api/mcp/asset/5c5f3a3c-9128-4f6c-b536-1a44fce3df7f.png",
  "prize-googlx.png": "https://www.figma.com/api/mcp/asset/3fe0f4b0-e982-4057-b325-f6f8e1034e18.png",
  "prize-usdc.png": "https://www.figma.com/api/mcp/asset/294ba449-dcdb-49b0-9d24-4f34cdc96d2d.png",
  "prize-points.png": "https://www.figma.com/api/mcp/asset/b0b8eb4a-7514-4585-af0a-3390fb38688c.png",
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

const newWheelHtml = `<!-- ═══════════ LUCKY WHEEL ═══════════ -->
<section id="wheel" class="rv rw-panel" data-panel="wheel" style="display:flex;flex-direction:column;gap:48px;align-items:center">
  <h2 class="sec-title" style="width:100%">Lucky Wheel</h2>

  <div class="lw-grand">
    <p class="lw-grand-label">Grand prize</p>
    <p class="lw-grand-name tg">iPhone 17 Pro Max</p>
  </div>

  <div class="lw-stage" id="lw-stage">
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
  </div>

  <div class="lw-win" id="win" role="status" aria-live="polite">
    <p class="lw-win-eyebrow">恭喜獲獎</p>
    <p class="lw-win-title" id="win-title">You won!</p>
    <p class="lw-win-sub" id="win-sub"></p>
    <button type="button" class="btn btn-p lw-win-close" id="win-close">Awesome</button>
  </div>

  <!-- earn more spins -->
  <div class="wheel-col" style="display:flex;flex-direction:column;gap:28px;width:1434px">
    <h3 class="sub-title">Earn more spins</h3>
    <div style="display:flex;gap:24px">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="spin-tier"><div><p class="st-t">$10,000 daily volume</p><p class="st-s">1 spin</p></div><div class="pill pill-prog">In progress</div></div>
        <div class="spin-tier"><div><p class="st-t">$50,000 daily volume</p><p class="st-s">3 spins</p></div><div class="pill pill-lock">Locked</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="spin-tier"><div><p class="st-t">$100,000 daily volume</p><p class="st-s">5 spins</p></div><div class="pill pill-lock">Locked</div></div>
        <div class="spin-tier"><div><p class="st-t">$500,000 daily volume</p><p class="st-s">15 spins daily maximum</p></div><div class="pill pill-lock">Locked</div></div>
      </div>
    </div>
  </div>
</section>

`;

const wheelStart = html.indexOf("<!-- ═══════════ LUCKY WHEEL");
const claimStart = html.indexOf("<!-- ═══════════ FLOATING CLAIM");
if (wheelStart < 0 || claimStart < 0) throw new Error("wheel/claim markers missing");
html = html.slice(0, wheelStart) + newWheelHtml + html.slice(claimStart);

const newCss = `/* ===== LUCKY WHEEL (Figma 7851:31752) ===== */
.lw-grand{
  display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;text-align:center
}
.lw-grand-label{
  margin:0;font-size:24px;font-weight:600;line-height:28px;color:var(--w60);text-transform:capitalize
}
.lw-grand-name{
  margin:0;font-size:44px;font-weight:600;font-style:italic;line-height:48px;text-transform:capitalize
}

.lw-stage{
  position:relative;width:1434px;height:1047px;max-width:100%;
  border-radius:16px;overflow:hidden;background:#000;margin:0 auto;flex:none
}
.lw-glow{
  position:absolute;left:311px;top:95px;width:812px;height:812px;
  pointer-events:none;z-index:0;opacity:.95
}
.lw-rot{
  position:absolute;left:294px;top:78px;width:846px;height:846px;
  transform-origin:50% 50%;will-change:transform;z-index:1
}
.lw-seg{
  position:absolute;inset:0;transform-origin:50% 50%;pointer-events:none
}
.lw-blade{
  position:absolute;left:50%;top:50%;width:362px;height:360px;
  margin-left:-181px;margin-top:-360px;object-fit:contain;
  transform-origin:50% 100%
}
.lw-prize{
  position:absolute;left:50%;top:72px;width:170px;margin-left:-85px;
  display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center
}
.lw-prize img{
  width:164px;height:110px;object-fit:contain;
  filter:drop-shadow(0 0 14px rgba(219,253,92,.2))
}
.lw-pt{margin:0;font-size:20px;font-weight:600;line-height:23px;color:var(--green);white-space:nowrap}
.lw-ps{margin:0;font-size:14px;font-weight:500;line-height:18px;color:rgba(255,255,255,.6);opacity:.8}
.lw-rim-inner{
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
  position:absolute;left:655px;top:28px;width:125px;height:125px;z-index:6;
  transform-origin:50% 70%;pointer-events:none
}
.lw-pointer-img{position:absolute;inset:0;width:125px;height:125px;transform:rotate(180deg)}
.lw-spark{position:absolute;width:14px;height:14px}
.lw-spark-l{left:20px;top:32px}
.lw-spark-r{right:20px;top:33px;transform:scaleX(-1)}
.lw-pointer.tick{animation:lwTick .14s ease}
@keyframes lwTick{50%{transform:rotate(-10deg)}}

.lw-cta{
  position:absolute;left:613px;top:397px;width:208px;height:208px;z-index:7;
  border:0;padding:0;background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:transform .18s cubic-bezier(.22,.61,.36,1),filter .18s ease
}
.lw-cta-bg{position:absolute;inset:-43%;width:186%;height:186%;max-width:none;pointer-events:none}
.lw-cta-label{
  position:relative;z-index:1;font-size:41px;font-weight:700;font-style:italic;line-height:64px;
  background:radial-gradient(circle at 50% 50%,#fff 0%,#f6ffd6 25%,#edfeae 50%,#e4fe85 75%,#dbfd5c 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  text-transform:uppercase;letter-spacing:.02em;pointer-events:none
}
.lw-cta:hover{transform:scale(1.03);filter:brightness(1.06)}
.lw-cta:active,.lw-cta.is-press{
  transform:scale(.92);filter:brightness(.92);
  transition-duration:.08s
}
.lw-cta:disabled{opacity:.45;cursor:not-allowed;transform:none;filter:none}
.lw-cap{
  position:absolute;left:0;right:0;top:997px;z-index:5;margin:0;
  text-align:center;font-size:20px;font-weight:500;line-height:28px;
  color:rgba(255,255,255,.6);text-transform:capitalize;pointer-events:none
}
.lw-cap b{font-size:30px;font-weight:500;color:rgba(255,255,255,.8)}

.lw-win{
  position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
  display:none;flex-direction:column;align-items:center;gap:12px;
  width:min(420px,92%);padding:28px 24px;border-radius:20px;
  border:1px solid rgba(201,189,255,.55);background:rgba(0,0,0,.92);
  box-shadow:0 0 40px rgba(219,253,92,.22);text-align:center;z-index:200
}
.lw-win.show{display:flex;animation:lwWinIn .45s cubic-bezier(.22,.61,.36,1) both}
@keyframes lwWinIn{from{opacity:0;transform:translate(-50%,-46%) scale(.96)}to{opacity:1;transform:translate(-50%,-50%)}}
.lw-win-eyebrow{margin:0;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green)}
.lw-win-title{margin:0;font-size:28px;font-weight:700;line-height:34px;color:rgba(255,255,255,.95)}
.lw-win-sub{margin:0;font-size:15px;font-weight:500;line-height:22px;color:rgba(255,255,255,.6)}
.lw-win-close{width:180px;padding:14px 24px;margin-top:8px}

@media (max-width:767px){
  .lw-grand-label{font-size:14px;line-height:20px}
  .lw-grand-name{font-size:22px;line-height:28px}
  #wheel{overflow:hidden;width:100%}
  #wheel .lw-stage{
    width:1434px;height:1047px;max-width:none;
    transform:scale(0.26);transform-origin:top left;
    margin-bottom:-775px
  }
  #wheel .wheel-col{width:100%!important;padding:0 16px;box-sizing:border-box}
  #wheel .spin-tier{width:100%}
}

`;

const cssStart = html.indexOf("/* ===== LUCKY WHEEL");
const cssEnd = html.indexOf("/* ===== earn more spins ===== */");
if (cssStart < 0 || cssEnd < 0) throw new Error("css markers missing");
html = html.slice(0, cssStart) + newCss + html.slice(cssEnd);

const newJs = `/* ---------- lucky wheel (Figma 7851:31752) ---------- */
(function(){
  /* clockwise from top (12 o'clock) */
  var prizes=[
    {blade:'/rewards/wheel/blade-1.svg', img:'/rewards/wheel/prize-iphone.png', title:'iPhone 17 Pro Max', sub:'Limited grand prize'},
    {blade:'/rewards/wheel/blade-2.svg', img:'/rewards/wheel/prize-points.png', title:'50–300 Points', sub:'Guaranteed reward pool'},
    {blade:'/rewards/wheel/blade-5.svg', img:'/rewards/wheel/prize-airpods.png', title:'AirPods Pro', sub:'Limited grand prize'},
    {blade:'/rewards/wheel/blade-4.svg', img:'/rewards/wheel/prize-usdc.png', title:'Up to 168 USDC', sub:'On-chain reward'},
    {blade:'/rewards/wheel/blade-3.svg', img:'/rewards/wheel/prize-switch.png', title:'Switch 2', sub:'Limited grand prize'},
    {blade:'/rewards/wheel/blade-0.svg', img:'/rewards/wheel/prize-googlx.png', title:'0.05 GOOGLX', sub:'On-chain reward'}
  ];
  var wheel=document.getElementById('wheel-rot');
  if(!wheel) return;
  var html='';
  for(var i=0;i<prizes.length;i++){
    var p=prizes[i], ang=i*60;
    html+='<div class="lw-seg" style="transform:rotate('+ang+'deg)">'+
      '<img class="lw-blade" src="'+p.blade+'" alt="">'+
      '<div class="lw-prize">'+
        '<img src="'+p.img+'" alt="">'+
        '<p class="lw-pt">'+p.title+'</p>'+
        '<p class="lw-ps">'+p.sub+'</p>'+
      '</div>'+
    '</div>';
  }
  wheel.innerHTML=html;

  var rot=0, last=-1, spinning=false, left=3;
  var btn=document.getElementById('spin-btn');
  var win=document.getElementById('win');
  var winTitle=document.getElementById('win-title');
  var winSub=document.getElementById('win-sub');
  var winClose=document.getElementById('win-close');
  var pointer=document.getElementById('lw-pointer');
  var leftEl=document.getElementById('spin-left');
  var SPIN_MS=5200;

  function easeInOutCubic(t){
    return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  }

  function animateRot(from,to,ms,done){
    var t0=performance.now();
    function frame(now){
      var p=Math.min(1,(now-t0)/ms);
      var e=easeInOutCubic(p);
      var cur=from+(to-from)*e;
      wheel.style.transform='rotate('+cur+'deg)';
      if(p<1) requestAnimationFrame(frame);
      else { rot=to; done&&done(); }
    }
    requestAnimationFrame(frame);
  }

  function press(){
    btn.classList.add('is-press');
    setTimeout(function(){ btn.classList.remove('is-press'); },140);
  }

  function showWin(prize){
    if(winTitle) winTitle.textContent='You won '+prize.title+'!';
    if(winSub) winSub.textContent=prize.sub;
    win.classList.add('show');
  }

  if(winClose) winClose.addEventListener('click', function(){ win.classList.remove('show'); });

  btn.addEventListener('click', function(){
    if(spinning||left<=0) return;
    press();
    spinning=true; btn.disabled=true; win.classList.remove('show');

    var t; do{ t=Math.floor(Math.random()*prizes.length); }while(t===last && prizes.length>1);
    last=t;

    var cur=((rot%360)+360)%360;
    var want=((-t*60)%360+360)%360;
    var delta=((want-cur)+360)%360 + 360*6;
    var target=rot+delta;

    var ticks=setInterval(function(){
      if(!pointer) return;
      pointer.classList.remove('tick'); void pointer.offsetWidth; pointer.classList.add('tick');
    },220);

    animateRot(rot, target, SPIN_MS, function(){
      clearInterval(ticks);
      if(pointer) pointer.classList.remove('tick');
      spinning=false;
      left--; if(leftEl) leftEl.textContent=String(left);
      var pop=document.getElementById('claim-count');
      if(pop) pop.textContent=String((+pop.textContent||0)+1);
      showWin(prizes[t]);
      if(left<=0){
        btn.disabled=true;
        var label=btn.querySelector('.lw-cta-label');
        if(label) label.textContent='DONE';
      }else{
        btn.disabled=false;
      }
    });
  });
})();

`;

const jsStart = html.indexOf("/* ---------- lucky wheel");
const jsEnd = html.indexOf("/* ---------- scroll reveal + nav ---------- */");
if (jsStart < 0 || jsEnd < 0) throw new Error("js markers missing");
html = html.slice(0, jsStart) + newJs + html.slice(jsEnd);

fs.writeFileSync(PAGE, html);
console.log("patched", html.length);
