import fs from "fs";

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

html = html.replace(
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
  </div>`,
  `  <div class="lw-stage" id="lw-stage">
    <!-- layer order back→front: 5,4,3葉片,2,1,按鈕/SPIN,0,arrow -->
    <img class="lw-l5" src="/rewards/wheel/layer-5.png" alt="" data-layer="5" width="974" height="974">
    <img class="lw-l4" src="/rewards/wheel/layer-4.png" alt="" data-layer="4" width="854" height="854">
    <div class="lw-l3 lw-rot" id="wheel-rot" aria-hidden="true" data-layer="3"></div>
    <img class="lw-l2" src="/rewards/wheel/layer-2.png" alt="" data-layer="2" width="916" height="916">
    <img class="lw-l1" src="/rewards/wheel/layer-1.png" alt="" data-layer="1" width="846" height="846">
    <button type="button" class="lw-cta" id="spin-btn" aria-label="Spin" data-layer="btn">
      <img class="lw-cta-bg" src="/rewards/wheel/spin-btn.svg" alt="">
      <span class="lw-cta-label">SPIN</span>
    </button>
    <img class="lw-l0" src="/rewards/wheel/layer-0.png" alt="" data-layer="0" width="600" height="651">
    <img class="lw-arrow lw-pointer" id="lw-pointer" src="/rewards/wheel/layer-arrow.png" alt="" data-layer="arrow" width="166" height="156">
    <p class="lw-cap">Use <b id="spin-use">1</b> of your <b id="spin-left">3</b> available spins</p>
  </div>`
);

const cssStart = html.indexOf("/* layer z: 5 < 4 < 3 < 2 < 1 < btn < 0 < arrow */");
const cssEnd = html.indexOf(".lw-cap{");
if (cssStart < 0 || cssEnd < 0) throw new Error("css markers missing");

const newCss = `/* layer z: 5 < 4 < 3 < 2 < 1 < btn < 0 < arrow — user PNGs */
.lw-l5{
  position:absolute;left:230px;top:7px;width:974px;height:974px;
  pointer-events:none;z-index:1;object-fit:contain
}
.lw-l4{
  position:absolute;left:290px;top:67px;width:854px;height:854px;
  pointer-events:none;z-index:2;object-fit:contain
}
.lw-l3,.lw-rot{
  position:absolute;inset:0;z-index:3;
  transform-origin:717px 494px;will-change:transform
}
.lw-blades-img{
  position:absolute;left:340.5px;top:116.5px;width:753px;height:755px;
  display:block;pointer-events:none;object-fit:contain;z-index:0
}
.lw-seg{
  position:absolute;inset:0;transform-origin:717px 494px;pointer-events:none;z-index:1
}
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
  position:absolute;left:259px;top:36px;width:916px;height:916px;
  pointer-events:none;z-index:4;object-fit:contain
}
.lw-l1{
  position:absolute;left:294px;top:71px;width:846px;height:846px;
  pointer-events:none;z-index:5;object-fit:contain
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
.lw-l0{
  position:absolute;left:420px;top:172px;width:600px;height:651px;
  pointer-events:none;z-index:7;object-fit:contain;display:block
}
.lw-arrow,.lw-pointer{
  position:absolute;left:634px;top:14px;width:166px;height:156px;z-index:8;
  transform-origin:50% 70%;pointer-events:none;object-fit:contain;display:block
}
.lw-pointer.tick{animation:lwTick .14s ease}
@keyframes lwTick{50%{transform:rotate(-10deg)}}

`;

html = html.slice(0, cssStart) + newCss + html.slice(cssEnd);

const newJsBuild = `  /* layer-3 PNG blades + center-axis prizes */
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
  var html='<img class="lw-blades-img" src="/rewards/wheel/layer-3.png" alt="" width="753" height="755">';
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

const markers = [
  "  /* blades absolute (Figma 3 葉片); prizes on center-axis */",
  "  /* layer-3 PNG blades + center-axis prizes */",
  "  /* Figma 7851:31571",
];
let buildStart = -1;
for (const m of markers) {
  buildStart = html.indexOf(m);
  if (buildStart >= 0) break;
}
const oldBuildEnd = html.indexOf("  wheel.innerHTML=html;");
if (buildStart < 0 || oldBuildEnd < 0) throw new Error("js markers " + buildStart + " " + oldBuildEnd);
html =
  html.slice(0, buildStart) +
  newJsBuild +
  html.slice(oldBuildEnd + "  wheel.innerHTML=html;".length);

fs.writeFileSync(PAGE, html);
console.log("ok", html.length);
