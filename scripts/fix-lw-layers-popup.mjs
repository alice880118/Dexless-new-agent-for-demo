import fs from "fs";

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

/* 1) HTML layer order + names matching Figma 5→arrow */
html = html.replace(
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
  </div>`,
  `  <div class="lw-stage" id="lw-stage">
    <!-- Figma layer order back→front: 5,4,3葉片,2,1,按鈕,SPIN,0,arrow -->
    <img class="lw-l5" src="/rewards/wheel/glow.svg" alt="" data-layer="5">
    <img class="lw-l4" src="/rewards/wheel/rim-base.svg" alt="" data-layer="4">
    <div class="lw-l3 lw-rot" id="wheel-rot" aria-hidden="true" data-layer="3"></div>
    <img class="lw-l2" src="/rewards/wheel/rim-inner.svg" alt="" data-layer="2">
    <img class="lw-l1" src="/rewards/wheel/rim-out.svg" alt="" data-layer="1">
    <button type="button" class="lw-cta" id="spin-btn" aria-label="Spin" data-layer="btn">
      <img class="lw-cta-bg" src="/rewards/wheel/spin-btn.svg" alt="">
      <span class="lw-cta-label">SPIN</span>
    </button>
    <div class="lw-l0" data-layer="0" aria-hidden="true">
      <img class="lw-lights-t" src="/rewards/wheel/lights-top.svg" alt="">
      <img class="lw-lights-b" src="/rewards/wheel/lights-bot.svg" alt="">
    </div>
    <div class="lw-arrow lw-pointer" id="lw-pointer" data-layer="arrow">
      <img class="lw-pointer-img" src="/rewards/wheel/pointer.svg" alt="">
      <img class="lw-spark lw-spark-l" src="/rewards/wheel/spark-l.svg" alt="">
      <img class="lw-spark lw-spark-r" src="/rewards/wheel/spark-r.svg" alt="">
    </div>
    <p class="lw-cap">Use <b id="spin-use">1</b> of your <b id="spin-left">3</b> available spins</p>
  </div>`
);

html = html.replace(
  `<img src="/rewards/claim/close.svg" alt="" width="32" height="32">`,
  `<img src="/rewards/claim/close.svg" alt="" width="24" height="24">`
);

/* 2) Replace wheel CSS mid-section through cta disabled */
const cssStart = html.indexOf(".lw-glow{");
const cssEnd = html.indexOf(".lw-cap{");
if (cssStart < 0 || cssEnd < 0) throw new Error("lw css markers missing");

const newCss = `/* layer z: 5 < 4 < 3 < 2 < 1 < btn < 0 < arrow */
.lw-l5{
  position:absolute;left:311px;top:88px;width:812px;height:812px;
  pointer-events:none;z-index:1;opacity:.95
}
.lw-l4{
  position:absolute;left:290px;top:67px;width:854px;height:854px;
  pointer-events:none;z-index:2
}
.lw-l3,.lw-rot{
  position:absolute;inset:0;z-index:3;
  transform-origin:717px 494px;will-change:transform
}
.lw-blades{
  position:absolute;left:346px;top:122px;width:743.4px;height:744px;
  pointer-events:none;z-index:0
}
.lw-blade{position:absolute;display:block;max-width:none;pointer-events:none}
.lw-seg{
  position:absolute;inset:0;transform-origin:717px 494px;pointer-events:none;z-index:1
}
/* center-axis prize slot (12 o'clock), then rotate with segment */
.lw-prize{
  position:absolute;left:632px;top:158px;width:169px;
  display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;
  transform-origin:85px 336px;pointer-events:none
}
.lw-prize img{
  width:164px;height:110px;object-fit:contain;flex:none;
  filter:drop-shadow(0 0 14px rgba(219,253,92,.2))
}
.lw-pt{margin:0;font-size:20px;font-weight:600;line-height:23px;color:var(--green);white-space:nowrap}
.lw-ps{margin:0;font-size:14px;font-weight:500;line-height:18px;color:rgba(255,255,255,.6);opacity:.8;max-width:160px}
.lw-l2{
  position:absolute;left:311px;top:88px;width:813px;height:813px;
  pointer-events:none;z-index:4
}
.lw-l1{
  position:absolute;left:294px;top:71px;width:846px;height:846px;
  pointer-events:none;z-index:5
}
.lw-cta{
  position:absolute;left:613px;top:390px;width:208px;height:208px;z-index:6;
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
.lw-cta:hover{transform:scale(1.03);filter:brightness(1.05)}
.lw-cta:active,.lw-cta.is-press{
  transform:scale(.94);filter:brightness(.72);
  transition-duration:.08s
}
.lw-cta.is-spinning{filter:brightness(.78);cursor:wait}
.lw-cta.is-done{filter:brightness(.55);cursor:not-allowed}
.lw-cta:disabled{cursor:not-allowed;transform:none}
.lw-l0{position:absolute;inset:0;pointer-events:none;z-index:7}
.lw-lights-t{
  position:absolute;left:420px;top:171.7px;width:600px;height:56.5px
}
.lw-lights-b{
  position:absolute;left:426px;top:760.3px;width:592px;height:62.5px;transform:scaleY(-1)
}
.lw-arrow,.lw-pointer{
  position:absolute;left:655px;top:21px;width:125px;height:125px;z-index:8;
  transform-origin:50% 70%;pointer-events:none
}
.lw-pointer-img{position:absolute;inset:0;width:125px;height:125px;transform:rotate(180deg)}
.lw-spark{position:absolute;width:14px;height:14px}
.lw-spark-l{left:20px;top:32px}
.lw-spark-r{right:20px;top:33px;transform:scaleX(-1)}
.lw-pointer.tick{animation:lwTick .14s ease}
@keyframes lwTick{50%{transform:rotate(-10deg)}}

`;

html = html.slice(0, cssStart) + newCss + html.slice(cssEnd);

/* Fix leftover old rim/cta rules if still present after .lw-cap */
/* Remove duplicate .lw-rim-* / old .lw-cta if any remain before .lw-cap - already replaced through .lw-cap */

/* 3) Popup CSS */
const rcStart = html.indexOf("/* ===== Ready to claim modal");
const rcEnd = html.indexOf("/* ===== floating claim popup ===== */");
if (rcStart < 0 || rcEnd < 0) throw new Error("rc css missing");

html =
  html.slice(0, rcStart) +
  `/* ===== Ready to claim modal (Figma 7850:31541 / 7850:31542) ===== */
.rc-overlay{
  position:fixed;inset:0;z-index:220;display:flex;align-items:center;justify-content:center;
  padding:24px;box-sizing:border-box;
  background:rgba(0,0,0,.55);backdrop-filter:blur(2px)
}
.rc-overlay[hidden]{display:none!important}
.rc-dialog{
  position:relative;width:min(560px,100%);
  display:flex;flex-direction:column;align-items:flex-end;gap:8px
}
.rc-close{
  width:24px;height:24px;padding:0;border:0;background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;flex:none;opacity:.85
}
.rc-close:hover{opacity:1}
.rc-close img{width:24px;height:24px;display:block}
.rc-panel{
  width:100%;box-sizing:border-box;background:#202020;border-radius:16px;
  padding:24px;display:flex;flex-direction:column;gap:24px;align-items:stretch
}
.rc-head{display:flex;flex-direction:column;gap:7px;width:100%}
.rc-title{margin:0;font-size:18px;font-weight:600;line-height:26px;color:var(--w90)}
.rc-sub{margin:0;font-size:13px;font-weight:500;line-height:20px;color:var(--w60);text-transform:capitalize}
.rc-list{display:flex;flex-direction:column;gap:16px;width:100%}
.rc-row{
  display:flex;align-items:center;gap:16px;width:100%;box-sizing:border-box;
  background:rgba(255,255,255,.05);border-radius:12px;padding:8px 16px
}
.rc-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.rc-name{margin:0;font-size:16px;font-weight:600;line-height:20px;color:var(--w90)}
.rc-desc{margin:0;font-size:13px;font-weight:500;line-height:20px;color:var(--w50);text-transform:capitalize}
.rc-name-mob,.rc-desc-mob{display:none}
.rc-claim{
  flex:none;padding:12px 16px;border-radius:999px;font-size:14px;font-weight:600;line-height:12px;
  text-transform:capitalize;border:0;cursor:pointer
}
.rc-claim:disabled,.rc-row.is-claimed .rc-claim{
  opacity:.45;cursor:default;filter:none;transform:none
}
.rc-row.is-claimed .rc-claim{pointer-events:none}

@media (max-width:767px){
  .rc-overlay{padding:16px;align-items:center}
  .rc-dialog{width:min(343px,100%)}
  .rc-close{width:24px;height:24px}
  .rc-close img{width:24px;height:24px}
  .rc-panel{padding:16px;gap:24px}
  .rc-head{gap:8px}
  .rc-title{font-size:16px;line-height:26px}
  .rc-sub{font-size:12px;line-height:18px}
  .rc-row{padding:4px 12px;gap:16px}
  .rc-name{font-size:14px;line-height:20px}
  .rc-name-desk,.rc-desc-desk{display:none}
  .rc-name-mob,.rc-desc-mob{display:block}
  .rc-desc{font-size:13px;line-height:20px}
  .rc-claim{height:32px;padding:4px 12px;font-size:12px;line-height:20px;filter:none}
}

` +
  html.slice(rcEnd);

/* 4) JS: center-axis prizes + spin without opacity */
const newJsBuild = `  /* blades absolute (Figma 3 葉片); prizes on center-axis */
  var blades=[
    {src:'/rewards/wheel/blade-10.svg', left:0, top:58.717, w:349.845, h:306.688},
    {src:'/rewards/wheel/blade-12.svg', left:197.181, top:0, w:349.708, h:344.01},
    {src:'/rewards/wheel/blade-02.svg', left:393.204, top:59.717, w:349.845, h:306.688},
    {src:'/rewards/wheel/blade-08.svg', left:0.646, top:377.4, w:348.958, h:308.456},
    {src:'/rewards/wheel/blade-06.svg', left:197.181, top:400, w:349.708, h:344.01},
    {src:'/rewards/wheel/blade-04.svg', left:394.445, top:377.4, w:348.958, h:308.456}
  ];
  var prizes=[
    {img:'/rewards/wheel/prize-iphone.png', title:'iPhone 17 Pro Max', sub:'Limited grand prize', ang:0},
    {img:'/rewards/wheel/prize-points.png', title:'50–300 Points', sub:'Guaranteed reward pool', ang:60},
    {img:'/rewards/wheel/prize-airpods.png', title:'AirPods Pro', sub:'Limited grand prize', ang:120},
    {img:'/rewards/wheel/prize-usdc.png', title:'Up to 168 USDC', sub:'On-chain reward', ang:180},
    {img:'/rewards/wheel/prize-switch.png', title:'Switch 2', sub:'Limited grand prize', ang:240},
    {img:'/rewards/wheel/prize-googlx.png', title:'0.05 GOOGLX', sub:'On-chain reward', ang:300}
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
    var p=prizes[i], ang=p.ang;
    html+='<div class="lw-seg" style="transform:rotate('+ang+'deg)">'+
      '<div class="lw-prize" style="transform:rotate('+(-ang)+'deg)">'+
        '<img src="'+p.img+'" alt="" width="164" height="110">'+
        '<p class="lw-pt">'+p.title+'</p>'+
        '<p class="lw-ps">'+p.sub+'</p>'+
      '</div>'+
    '</div>';
  }
  wheel.innerHTML=html;
`;

const oldBuildStart = html.indexOf("  /* Figma 7851:31571");
const altStart = html.indexOf("  /* blades absolute");
const buildStart = oldBuildStart >= 0 ? oldBuildStart : html.indexOf("  /* Figma 7851:32259");
const oldBuildEnd = html.indexOf("  wheel.innerHTML=html;");
if (buildStart < 0 || oldBuildEnd < 0) throw new Error("js build missing " + buildStart + " " + oldBuildEnd);
html =
  html.slice(0, buildStart) +
  newJsBuild +
  html.slice(oldBuildEnd + "  wheel.innerHTML=html;".length);

/* spin press: is-spinning instead of disabled opacity */
html = html.replace(
  `  function press(){
    btn.classList.add('is-press');
    setTimeout(function(){ btn.classList.remove('is-press'); },140);
  }`,
  `  function press(){
    btn.classList.add('is-press');
    setTimeout(function(){ btn.classList.remove('is-press'); },140);
  }`
);

html = html.replace(
  `    press();
    spinning=true; btn.disabled=true; win.classList.remove('show');`,
  `    press();
    spinning=true; btn.classList.add('is-spinning'); win.classList.remove('show');`
);

html = html.replace(
  `      spinning=false;
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
      }`,
  `      spinning=false;
      btn.classList.remove('is-spinning');
      left--; if(leftEl) leftEl.textContent=String(left);
      var pop=document.getElementById('claim-count');
      if(pop) pop.textContent=String((+pop.textContent||0)+1);
      showWin(prizes[t]);
      if(left<=0){
        btn.classList.add('is-done');
        btn.disabled=true;
        var label=btn.querySelector('.lw-cta-label');
        if(label) label.textContent='DONE';
      }`
);

/* mobile stage scale still references old class names? check */
html = html.replace(
  `#wheel .lw-stage{
    width:1434px;height:1047px;max-width:none;
    transform:scale(0.26);transform-origin:top left;
    margin-bottom:-775px
  }`,
  `#wheel .lw-stage{
    width:1434px;height:1047px;max-width:none;
    transform:scale(0.26);transform-origin:top left;
    margin-bottom:-775px
  }`
);

fs.writeFileSync(PAGE, html);
console.log("patched", html.length);
