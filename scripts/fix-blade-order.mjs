import fs from "fs";

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

/* Update blade CSS: absolute Figma layout, no tip-centered rotate */
html = html.replace(
  `.lw-seg{
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
}`,
  `.lw-blades{
  position:absolute;left:50%;top:50%;width:743.4px;height:744px;
  margin-left:-371.7px;margin-top:-372px;pointer-events:none;z-index:0
}
.lw-blade{
  position:absolute;display:block;max-width:none;pointer-events:none
}
.lw-seg{
  position:absolute;inset:0;transform-origin:50% 50%;pointer-events:none;z-index:1
}
.lw-prize{
  position:absolute;left:50%;top:72px;width:170px;margin-left:-85px;
  display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center
}`
);

const newJsBuild = `  /* Figma 7851:32259 — blades already oriented; place by absolute coords */
  var blades=[
    {src:'/rewards/wheel/blade-12.svg', left:197.181, top:0, w:349.708, h:344.01},
    {src:'/rewards/wheel/blade-02.svg', left:393.204, top:59.717, w:349.845, h:306.688},
    {src:'/rewards/wheel/blade-04.svg', left:394.445, top:377.4, w:348.958, h:308.456},
    {src:'/rewards/wheel/blade-06.svg', left:197.181, top:400, w:349.708, h:344.01},
    {src:'/rewards/wheel/blade-08.svg', left:0.646, top:377.4, w:348.958, h:308.456},
    {src:'/rewards/wheel/blade-10.svg', left:0, top:58.717, w:349.845, h:306.688}
  ];
  /* clockwise prizes from 12 o'clock */
  var prizes=[
    {img:'/rewards/wheel/prize-iphone.png', title:'iPhone 17 Pro Max', sub:'Limited grand prize'},
    {img:'/rewards/wheel/prize-points.png', title:'50–300 Points', sub:'Guaranteed reward pool'},
    {img:'/rewards/wheel/prize-airpods.png', title:'AirPods Pro', sub:'Limited grand prize'},
    {img:'/rewards/wheel/prize-usdc.png', title:'Up to 168 USDC', sub:'On-chain reward'},
    {img:'/rewards/wheel/prize-switch.png', title:'Switch 2', sub:'Limited grand prize'},
    {img:'/rewards/wheel/prize-googlx.png', title:'0.05 GOOGLX', sub:'On-chain reward'}
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
`;

const oldBuildStart = html.indexOf("  /* clockwise from top (12 o'clock) */");
const oldBuildEnd = html.indexOf("  wheel.innerHTML=html;");
if (oldBuildStart < 0 || oldBuildEnd < 0) throw new Error("js build markers missing");
html =
  html.slice(0, oldBuildStart) +
  newJsBuild +
  html.slice(oldBuildEnd + "  wheel.innerHTML=html;".length);

fs.writeFileSync(PAGE, html);
console.log("blade layout fixed");

// verify files
for (const n of ["blade-12","blade-02","blade-04","blade-06","blade-08","blade-10"]) {
  const p = `public/rewards/wheel/${n}.svg`;
  console.log(n, fs.existsSync(p) ? fs.statSync(p).size : "MISSING");
}
