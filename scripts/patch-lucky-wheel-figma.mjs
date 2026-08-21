import fs from "fs";

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

const newWheelHtml = `<!-- ═══════════ LUCKY WHEEL ═══════════ -->
<section id="wheel" class="rv rw-panel" data-panel="wheel" style="display:flex;flex-direction:column;gap:48px;align-items:center">
  <h2 class="sec-title" style="width:100%">Lucky Wheel</h2>

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
    <p class="lw-win-eyebrow">Congratulations</p>
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
if (wheelStart < 0 || claimStart < 0) {
  throw new Error("wheel/claim markers not found");
}
html = html.slice(0, wheelStart) + newWheelHtml + html.slice(claimStart);

const newCss = `/* ===== LUCKY WHEEL (Figma 2:815) ===== */
.lw-stage{
  position:relative;width:1434px;height:1080px;max-width:100%;
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
  margin-left:-181px;margin-top:-360px;opacity:.55;object-fit:contain;
  transform-origin:50% 100%
}
.lw-prize{
  position:absolute;left:50%;top:92px;width:170px;margin-left:-85px;
  display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;
  transform-origin:50% 331px
}
.lw-prize img{
  width:150px;height:100px;object-fit:contain;
  filter:drop-shadow(0 0 18px rgba(255,255,255,.25))
}
.lw-pt{margin:0;font-size:18px;font-weight:600;line-height:23px;color:rgba(255,255,255,.9)}
.lw-ps{margin:0;font-size:14px;font-weight:500;line-height:18px;color:rgba(255,255,255,.6);opacity:.8}
.lw-rim-inner{
  position:absolute;left:310.6px;top:94.6px;width:813px;height:813px;
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
  position:absolute;left:598px;top:382px;width:238px;height:238px;z-index:7;
  border:0;padding:0;background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:transform .18s cubic-bezier(.22,.61,.36,1),filter .18s ease
}
.lw-cta-bg{position:absolute;inset:-38%;width:176%;height:176%;max-width:none;pointer-events:none}
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
  display:none;flex-direction:column;align-items:center;gap:12px;
  width:min(420px,92%);padding:28px 24px;border-radius:20px;
  border:1px solid rgba(201,189,255,.55);background:rgba(0,0,0,.82);
  box-shadow:0 0 40px rgba(219,253,92,.18);text-align:center;z-index:20
}
.lw-win.show{display:flex;animation:lwWinIn .45s cubic-bezier(.22,.61,.36,1) both}
@keyframes lwWinIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
.lw-win-eyebrow{margin:0;font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(219,253,92,.9)}
.lw-win-title{margin:0;font-size:28px;font-weight:700;line-height:34px;color:rgba(255,255,255,.95)}
.lw-win-sub{margin:0;font-size:15px;font-weight:500;line-height:22px;color:rgba(255,255,255,.6)}
.lw-win-close{width:180px;padding:14px 24px;margin-top:8px}

@media (max-width:767px){
  .lw-stage{width:100%;height:auto;aspect-ratio:1434/1080;transform:none}
  .lw-stage > *{transform-origin:top left}
  /* scale via font-size trick avoided; use zoom-like width 100% with absolute children in % */
}

`;

/* Replace old LUCKY WHEEL css block through prize pool css */
const cssStart = html.indexOf("/* ===== LUCKY WHEEL ===== */");
const cssEnd = html.indexOf("/* ===== earn more spins ===== */");
if (cssStart < 0 || cssEnd < 0) throw new Error("css markers missing");
html = html.slice(0, cssStart) + newCss + html.slice(cssEnd);

const newJs = `/* ---------- lucky wheel (Figma 2:815) ---------- */
(function(){
  var prizes=[
    {blade:'/rewards/wheel/blade-0.svg', img:'/rewards/wheel/prize-iphone.png', title:'iPhone 17 Pro Max', sub:'Limited grand prize'},
    {blade:'/rewards/wheel/blade-5.svg', img:'/rewards/wheel/prize-switch.png', title:'Switch 2', sub:'Limited grand prize'},
    {blade:'/rewards/wheel/blade-4.svg', img:'/rewards/wheel/prize-googlx.png', title:'0.05 GOOGLX', sub:'On-chain reward'},
    {blade:'/rewards/wheel/blade-1.svg', img:'/rewards/wheel/prize-usdc.png', title:'Up to 168 USDC', sub:'On-chain reward'},
    {blade:'/rewards/wheel/blade-2.svg', img:'/rewards/wheel/prize-points.png', title:'50–300 Points', sub:'Guaranteed reward'},
    {blade:'/rewards/wheel/blade-3.svg', img:'/rewards/wheel/prize-airpods.png', title:'AirPods Pro', sub:'Limited grand prize'}
  ];
  var wheel=document.getElementById('wheel-rot');
  if(!wheel) return;
  var html='';
  for(var i=0;i<prizes.length;i++){
    var p=prizes[i], ang=i*60;
    html+='<div class="lw-seg" style="transform:rotate('+ang+'deg)">'+
      '<img class="lw-blade" src="'+p.blade+'" alt="">'+
      '<div class="lw-prize" style="transform:rotate('+(-ang)+'deg)">'+
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

    /* pointer at top; segment i center is at i*60. Bring segment to top = -i*60 */
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

const jsStart = html.indexOf("/* ---------- lucky wheel ---------- */");
const jsEnd = html.indexOf("/* ---------- scroll reveal + nav ---------- */");
if (jsStart < 0 || jsEnd < 0) throw new Error("js markers missing");
html = html.slice(0, jsStart) + newJs + html.slice(jsEnd);

/* Remove obsolete stage-wrap/wheel petal rules still used elsewhere? stage-wrap still used? check */
/* Keep .stage-wrap for other potential uses; old .wheel/.petal can stay or be removed - leave harmless */

fs.writeFileSync(PAGE, html);
console.log("patched page.html", html.length);
