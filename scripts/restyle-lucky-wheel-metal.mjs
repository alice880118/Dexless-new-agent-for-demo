import fs from "fs";

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

const newWheelHtml = `<!-- ═══════════ LUCKY WHEEL ═══════════ -->
<section id="wheel" class="rv rw-panel" data-panel="wheel" style="display:flex;flex-direction:column;gap:48px;align-items:center">
  <h2 class="sec-title" style="width:100%">Lucky Wheel</h2>

  <div class="lw-stage" id="lw-stage">
    <div class="lw-bg-fx" aria-hidden="true">
      <span class="lw-trail lw-trail-a"></span>
      <span class="lw-trail lw-trail-b"></span>
      <span class="lw-trail lw-trail-c"></span>
      <span class="lw-orb lw-orb-a"></span>
      <span class="lw-orb lw-orb-b"></span>
    </div>

    <div class="lw-frame">
      <div class="lw-rot" id="wheel-rot" aria-hidden="true"></div>
      <div class="lw-rim" aria-hidden="true">
        <span class="lw-rim-metal"></span>
        <span class="lw-rim-glow"></span>
        <span class="lw-rim-bolts"></span>
      </div>
      <div class="lw-pointer" id="lw-pointer" aria-hidden="true"></div>
      <button type="button" class="lw-cta" id="spin-btn" aria-label="Spin">
        <span class="lw-cta-ring r1"></span>
        <span class="lw-cta-ring r2"></span>
        <span class="lw-cta-ring r3"></span>
        <span class="lw-cta-core"></span>
        <span class="lw-cta-label">SPIN</span>
      </button>
    </div>

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
if (wheelStart < 0 || claimStart < 0) throw new Error("markers missing");
html = html.slice(0, wheelStart) + newWheelHtml + html.slice(claimStart);

const newCss = `/* ===== LUCKY WHEEL (metal / neon green) ===== */
.lw-stage{
  --lw-neon:#b6ff2e;
  --lw-neon-dim:rgba(182,255,46,.35);
  --lw-metal:#2c2e32;
  --lw-metal-hi:#5a5d64;
  --lw-title:#e8ff6a;
  position:relative;width:1100px;height:980px;max-width:100%;
  border-radius:16px;overflow:hidden;margin:0 auto;flex:none;
  background:
    radial-gradient(ellipse 70% 55% at 50% 48%,rgba(40,60,10,.55) 0%,rgba(0,0,0,0) 70%),
    radial-gradient(circle at 50% 50%,#121212 0%,#050505 70%,#000 100%)
}
.lw-bg-fx{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.lw-trail{
  position:absolute;border-radius:999px;filter:blur(18px);opacity:.55;
  background:linear-gradient(90deg,transparent,var(--lw-neon),transparent)
}
.lw-trail-a{width:520px;height:38px;left:-40px;top:18%;transform:rotate(-28deg);animation:lwDrift 9s ease-in-out infinite}
.lw-trail-b{width:640px;height:28px;right:-80px;bottom:22%;transform:rotate(18deg);opacity:.4;animation:lwDrift 11s ease-in-out infinite reverse}
.lw-trail-c{width:420px;height:22px;left:18%;bottom:8%;transform:rotate(-8deg);opacity:.3;animation:lwDrift 13s ease-in-out infinite}
.lw-orb{
  position:absolute;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#dfff8a 0%,#7cff1a 35%,#26a017 70%,transparent 72%);
  filter:blur(1px);opacity:.85;box-shadow:0 0 28px var(--lw-neon-dim)
}
.lw-orb-a{width:72px;height:72px;left:8%;top:14%;animation:lwFloat 7s ease-in-out infinite}
.lw-orb-b{width:56px;height:56px;right:10%;bottom:16%;opacity:.7;animation:lwFloat 8.5s ease-in-out infinite reverse}
@keyframes lwDrift{0%,100%{transform:translateX(0) rotate(var(--r, -28deg))}50%{transform:translateX(24px) rotate(var(--r, -28deg))}}
@keyframes lwFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

.lw-frame{
  position:absolute;left:50%;top:52px;width:820px;height:820px;
  margin-left:-410px;z-index:1
}
.lw-rot{
  position:absolute;inset:28px;border-radius:50%;overflow:hidden;
  transform-origin:50% 50%;will-change:transform;z-index:1;
  background:#141416;
  box-shadow:inset 0 0 60px rgba(0,0,0,.85)
}
.lw-disk{
  position:absolute;inset:0;border-radius:50%;
  background:
    repeating-conic-gradient(from -30deg,
      #1c1d21 0deg 60deg,
      #15161a 60deg 120deg);
  filter:contrast(1.05)
}
.lw-spokes{
  position:absolute;inset:0;border-radius:50%;
  background:repeating-conic-gradient(from -30deg,
    transparent 0deg 59.2deg,
    rgba(180,185,195,.55) 59.2deg 60deg);
  pointer-events:none
}
.lw-edge-glow{
  position:absolute;inset:0;border-radius:50%;pointer-events:none;
  background:conic-gradient(from -30deg,
    rgba(182,255,46,.22) 0deg 60deg,
    rgba(182,255,46,.08) 60deg 360deg);
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 28px),#000 calc(100% - 18px));
  mask:radial-gradient(farthest-side,transparent calc(100% - 28px),#000 calc(100% - 18px))
}
.lw-seg{
  position:absolute;inset:0;transform-origin:50% 50%;pointer-events:none
}
.lw-prize{
  position:absolute;left:50%;top:56px;width:168px;margin-left:-84px;
  display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center
}
.lw-prize img{
  width:112px;height:88px;object-fit:contain;
  filter:drop-shadow(0 0 12px rgba(182,255,46,.25))
}
.lw-pt{
  margin:0;font-size:17px;font-weight:700;line-height:22px;color:var(--lw-title);
  text-shadow:0 0 12px rgba(232,255,106,.35)
}
.lw-ps{margin:0;font-size:13px;font-weight:500;line-height:18px;color:rgba(255,255,255,.88)}

.lw-rim{position:absolute;inset:0;z-index:3;pointer-events:none}
.lw-rim-metal{
  position:absolute;inset:0;border-radius:50%;
  background:
    radial-gradient(circle at 50% 18%,rgba(255,255,255,.18),transparent 32%),
    radial-gradient(circle at 50% 82%,rgba(0,0,0,.55),transparent 40%),
    conic-gradient(from 0deg,#3a3d44,#6a6e76,#2a2c31,#7a7e86,#3a3d44,#1e2024,#5a5e66,#3a3d44);
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 34px),#000 calc(100% - 34px));
  mask:radial-gradient(farthest-side,transparent calc(100% - 34px),#000 calc(100% - 34px));
  box-shadow:0 0 40px rgba(0,0,0,.65)
}
.lw-rim-glow{
  position:absolute;inset:30px;border-radius:50%;
  box-shadow:
    inset 0 0 0 3px rgba(182,255,46,.85),
    inset 0 0 22px rgba(182,255,46,.45),
    0 0 28px rgba(182,255,46,.28);
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 8px),#000 calc(100% - 8px));
  mask:radial-gradient(farthest-side,transparent calc(100% - 8px),#000 calc(100% - 8px))
}
.lw-rim-bolts{
  position:absolute;inset:10px;border-radius:50%;
  background:repeating-conic-gradient(from -30deg,
    transparent 0deg 58.5deg,
    #c8ccd4 58.5deg 59.2deg,
    transparent 59.2deg 60deg);
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 22px),#000 calc(100% - 10px));
  mask:radial-gradient(farthest-side,transparent calc(100% - 22px),#000 calc(100% - 10px));
  opacity:.75
}

.lw-pointer{
  position:absolute;left:50%;top:6px;width:0;height:0;z-index:6;
  margin-left:-18px;
  border-left:18px solid transparent;border-right:18px solid transparent;
  border-top:34px solid var(--lw-neon);
  filter:drop-shadow(0 0 10px var(--lw-neon)) drop-shadow(0 0 22px rgba(182,255,46,.75));
  transform-origin:50% 0%
}
.lw-pointer.tick{animation:lwTick .14s ease}
@keyframes lwTick{50%{transform:rotate(-9deg)}}

.lw-cta{
  position:absolute;left:50%;top:50%;width:188px;height:188px;z-index:7;
  margin:-94px 0 0 -94px;border:0;padding:0;border-radius:50%;cursor:pointer;
  background:
    radial-gradient(circle at 50% 42%,#2a2c30 0%,#121315 62%,#070808 100%);
  box-shadow:
    0 0 0 6px #1a1b1e,
    0 0 0 10px #4a4e56,
    0 0 0 12px #1e2024,
    0 0 36px rgba(182,255,46,.45),
    inset 0 0 24px rgba(0,0,0,.7);
  display:flex;align-items:center;justify-content:center;
  transition:transform .18s cubic-bezier(.22,.61,.36,1),box-shadow .18s ease,filter .18s ease
}
.lw-cta-ring{
  position:absolute;border-radius:50%;border:2px solid rgba(182,255,46,.55);
  box-shadow:0 0 12px rgba(182,255,46,.35);pointer-events:none
}
.lw-cta-ring.r1{inset:18px;opacity:.95}
.lw-cta-ring.r2{inset:34px;opacity:.7;border-width:1.5px}
.lw-cta-ring.r3{inset:50px;opacity:.45;border-width:1px}
.lw-cta-core{
  position:absolute;inset:64px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle at 50% 40%,rgba(182,255,46,.35),transparent 70%);
  box-shadow:inset 0 0 18px rgba(182,255,46,.25)
}
.lw-cta-label{
  position:relative;z-index:1;font-size:36px;font-weight:800;font-style:italic;line-height:1;
  color:var(--lw-neon);letter-spacing:.06em;text-transform:uppercase;
  text-shadow:0 0 18px rgba(182,255,46,.75),0 0 36px rgba(182,255,46,.4);
  pointer-events:none
}
.lw-cta:hover{transform:scale(1.04);filter:brightness(1.08)}
.lw-cta:active,.lw-cta.is-press{
  transform:scale(.9);filter:brightness(.9);
  box-shadow:
    0 0 0 6px #1a1b1e,
    0 0 0 10px #3a3e46,
    0 0 0 12px #1e2024,
    0 0 18px rgba(182,255,46,.3),
    inset 0 8px 22px rgba(0,0,0,.85);
  transition-duration:.08s
}
.lw-cta:disabled{opacity:.45;cursor:not-allowed;transform:none;filter:none}

.lw-cap{
  position:absolute;left:0;right:0;bottom:36px;z-index:5;margin:0;
  text-align:center;font-size:20px;font-weight:500;line-height:28px;
  color:rgba(255,255,255,.6);text-transform:capitalize;pointer-events:none
}
.lw-cap b{font-size:30px;font-weight:500;color:rgba(255,255,255,.85)}

.lw-win{
  position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
  display:none;flex-direction:column;align-items:center;gap:12px;
  width:min(420px,92%);padding:28px 24px;border-radius:20px;
  border:1px solid rgba(182,255,46,.45);background:rgba(0,0,0,.92);
  box-shadow:0 0 40px rgba(182,255,46,.22);text-align:center;z-index:200
}
.lw-win.show{display:flex;animation:lwWinIn .45s cubic-bezier(.22,.61,.36,1) both}
@keyframes lwWinIn{from{opacity:0;transform:translate(-50%,-46%) scale(.96)}to{opacity:1;transform:translate(-50%,-50%)}}
.lw-win-eyebrow{margin:0;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--lw-neon,#b6ff2e)}
.lw-win-title{margin:0;font-size:28px;font-weight:700;line-height:34px;color:rgba(255,255,255,.95)}
.lw-win-sub{margin:0;font-size:15px;font-weight:500;line-height:22px;color:rgba(255,255,255,.6)}
.lw-win-close{width:180px;padding:14px 24px;margin-top:8px}

@media (max-width:767px){
  #wheel{overflow:hidden;width:100%}
  #wheel .lw-stage{
    width:1100px;height:980px;max-width:none;
    transform:scale(0.32);transform-origin:top left;
    margin-bottom:-666px
  }
  #wheel .wheel-col{width:100%!important;padding:0 16px;box-sizing:border-box}
  #wheel .spin-tier{width:100%}
}

`;

const cssStart = html.indexOf("/* ===== LUCKY WHEEL");
const cssEnd = html.indexOf("/* ===== earn more spins ===== */");
if (cssStart < 0 || cssEnd < 0) throw new Error("css markers missing");
html = html.slice(0, cssStart) + newCss + html.slice(cssEnd);

const newJs = `/* ---------- lucky wheel (metal neon) ---------- */
(function(){
  var prizes=[
    {img:'/rewards/wheel/prize-iphone.png', title:'iPhone 17 Pro Max', sub:'Limited grand prize'},
    {img:'/rewards/wheel/prize-switch.png', title:'Switch 2', sub:'Limited grand prize'},
    {img:'/rewards/wheel/prize-googlx.png', title:'0.05 GOOGLX', sub:'On-chain reward'},
    {img:'/rewards/wheel/prize-usdc.png', title:'Up to 168 USDC', sub:'On-chain reward'},
    {img:'/rewards/wheel/prize-points.png', title:'50–300 Points', sub:'Guaranteed reward'},
    {img:'/rewards/wheel/prize-airpods.png', title:'AirPods Pro', sub:'Limited grand prize'}
  ];
  var wheel=document.getElementById('wheel-rot');
  if(!wheel) return;

  var html='<div class="lw-disk"></div><div class="lw-spokes"></div><div class="lw-edge-glow"></div>';
  for(var i=0;i<prizes.length;i++){
    var p=prizes[i], ang=i*60;
    html+='<div class="lw-seg" style="transform:rotate('+ang+'deg)">'+
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
console.log("ok", html.length);
