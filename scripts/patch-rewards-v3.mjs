import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

// --- 1) Cup already updated on disk; ensure src ---
html = html.replace(/src="\/rewards\/cup\.png"/g, 'src="/rewards/cup.png"');

// --- 2) Fix ART to Figma exact sizes/angles + SVG assets ---
const ART = `{
    purple:['/rewards/blades/purple.svg', 0, 260.988, 226.248],
    green :['/rewards/blades/green.svg', 30.03, 339.177, 326.484],
    teal  :['/rewards/blades/teal.svg', 60.21, 326.022, 338.909],
    pink  :['/rewards/blades/pink.svg', -31.04, 340.274, 328.418],
    tan   :['/rewards/blades/yellow.svg', -61.71, 322.915, 337.041],
    yellow:['/rewards/blades/tan.svg', -92.45, 237.193, 270.417],
    blue  :['/rewards/blades/blue.svg', 91.15, 231.437, 265.473]
  }`;
html = html.replace(/var ART=\{[\s\S]*?\};\s*\/\* clockwise/, `var ART=${ART};\n  /* clockwise`);

// petal img fill (not contain) — match Figma bbox
html = html.replace(
  ".petal .pt img{width:100%;height:100%;object-fit:contain;background:transparent}",
  ".petal .pt img{width:100%;height:100%;object-fit:fill;display:block}",
);
html = html.replace(
  " .petal .pt img{width:100%;height:100%;object-fit:contain;background:transparent}",
  ".petal .pt img{width:100%;height:100%;object-fit:fill;display:block}",
);

// --- 3) Viewport + RWD CSS + mobile page panels ---
if (!html.includes('name="viewport"')) {
  html = html.replace(
    '<meta name="viewport" content="width=1920">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
  );
}

const rwdCss = `
/* ===== RWD (align with app breakpoints: 768 / 390) ===== */
html{scroll-behavior:smooth}
body{min-width:0!important}
.wrap{width:min(1434px,100%);margin:0 auto;padding:0 16px;box-sizing:border-box}
.hero{width:100%!important;max-width:1434px;height:auto!important;min-height:360px;aspect-ratio:1434/519}
.hero .d.hero-copy{left:4%!important;top:12%!important;width:min(530px,52%)!important;gap:24px!important}
.hero .d.hero-cd{left:auto!important;right:3%!important;top:auto!important;bottom:8%!important;width:min(392px,42%)!important}
.hero-h{font-size:clamp(22px,3.2vw,36px)!important;line-height:1.25!important}
.hero-n{font-size:clamp(40px,6vw,80px)!important;line-height:1!important}
.navbar{height:auto;padding:8px 0;margin-top:-40px!important}
.navpill{flex-wrap:nowrap;overflow-x:auto;max-width:100%;scrollbar-width:none;gap:4px;padding:8px 10px}
.navpill::-webkit-scrollbar{display:none}
.navpill a{padding:12px 18px;font-size:14px;line-height:20px;white-space:nowrap}
.sec-title{font-size:clamp(22px,3vw,32px)!important;line-height:1.2!important}
.sub-title{font-size:clamp(18px,2.4vw,24px)!important;line-height:1.25!important}
.sub-desc{font-size:14px!important;line-height:22px!important}
.page{gap:80px;padding-bottom:80px;width:100%}
.card-today,.mini,.tablecard,.infocard,.stage{width:100%!important;max-width:1434px}
.card-today{height:auto!important;min-height:280px;flex-wrap:wrap;padding:20px!important}
.stage{height:auto!important;min-height:420px;aspect-ratio:1434/650}
.claim{right:16px}

@media (max-width:1024px){
  .page{gap:64px}
  .hero .d.hero-copy{gap:18px!important}
  .btn{font-size:14px}
}

@media (max-width:767px){
  body{overflow-x:hidden}
  .page{gap:0;padding-bottom:24px;min-height:100dvh}
  .hero-sec{padding-top:16px}
  .hero{min-height:420px;aspect-ratio:auto;height:auto!important;padding-bottom:24px}
  .hero-bg-img{object-position:center top}
  .trophy-wrap{left:50%!important;top:8%!important;width:min(280px,70%)!important;height:auto!important;margin-left:0!important;aspect-ratio:478/537}
  .trophy-wrap .trophy-img{width:100%!important;height:auto!important}
  .hero .d.hero-copy{
    left:16px!important;right:16px!important;top:auto!important;bottom:120px!important;
    width:auto!important;gap:16px!important;z-index:6
  }
  .hero .d.hero-cd{
    left:16px!important;right:16px!important;bottom:16px!important;top:auto!important;
    width:auto!important;gap:12px!important
  }
  .hero-h{font-size:22px!important;line-height:28px!important;font-weight:500}
  .hero-n{font-size:40px!important;line-height:44px!important}
  .tagchip{font-size:13px;padding:6px 12px}
  .cd-box{width:64px;padding:8px 10px}
  .cd-box b{font-size:18px}
  .cd-box span{font-size:12px}
  .navbar{
    position:sticky;top:0;z-index:60;margin-top:0!important;
    background:rgba(0,0,0,.72);backdrop-filter:blur(12px);
    padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)
  }
  .navpill{width:calc(100% - 24px);justify-content:flex-start}
  .navpill a{padding:10px 14px;font-size:13px;line-height:18px}
  .sec-title{font-size:22px!important;line-height:28px!important;font-weight:600}
  .sub-title{font-size:18px!important;line-height:24px!important;font-weight:600}
  .sub-desc{font-size:13px!important;line-height:20px!important;font-weight:500;padding:0 8px}
  .claim{right:12px;top:72px;transform:scale(.86);transform-origin:top right}

  /* mobile: tab = page switch (no long scroll) */
  .rw-panel{display:none!important;padding:16px 0 32px;min-height:calc(100dvh - 64px)}
  .rw-panel.is-active{display:flex!important;flex-direction:column;align-items:center;gap:28px;width:100%}
  .hero-sec.rw-panel.is-active{display:block!important}
  .stack48.rw-panel.is-active{gap:28px}
  #today.rw-panel{width:100%}
}

@media (max-width:390px){
  .hero{min-height:460px}
  .hero-n{font-size:36px!important}
  .navpill a{padding:10px 12px;font-size:12px}
  .claim{transform:scale(.78)}
}
`;

if (!html.includes("RWD (align with app breakpoints")) {
  html = html.replace(
    "body{min-width:0!important;overflow-x:auto}\n.page{align-items:center}",
    "body{min-width:0!important;overflow-x:auto}\n.page{align-items:center}" + rwdCss,
  );
}

// Mark panels for mobile page switch
const panelMap = [
  ['<section class="hero-sec" id="rewards">', '<section class="hero-sec rw-panel is-active" id="rewards" data-panel="rewards">'],
  ['<section class="stack48 rv" id="today">', '<section class="stack48 rv rw-panel is-active" id="today" data-panel="rewards">'],
  ['<section id="ntb" class="rv"', '<section id="ntb" class="rv rw-panel" data-panel="ntb"'],
  ['<section id="missions" class="rv"', '<section id="missions" class="rv rw-panel" data-panel="missions"'],
  ['<section id="competition" class="rv"', '<section id="competition" class="rv rw-panel" data-panel="competition"'],
  ['id="wheel" class="rv"', 'id="wheel" class="rv rw-panel" data-panel="wheel"'],
];
for (const [a, b] of panelMap) {
  if (html.includes(a) && !html.includes(b)) html = html.replace(a, b);
}

// Update nav script for mobile page mode — inject after sliding indicator script start
const mobileNavPatch = `
(function(){
  var MQ=window.matchMedia('(max-width:767px)');
  var links=[].slice.call(document.querySelectorAll('.navpill a'));
  var panels=[].slice.call(document.querySelectorAll('.rw-panel'));

  function panelIdFromHash(href){
    var id=(href||'').replace('#','');
    if(id==='rewards' || id==='today') return 'rewards';
    return id;
  }

  function showPanel(id){
    var pid=panelIdFromHash(id);
    panels.forEach(function(p){
      var on=p.getAttribute('data-panel')===pid;
      p.classList.toggle('is-active', on);
    });
    links.forEach(function(a){
      a.classList.toggle('on', panelIdFromHash(a.getAttribute('href'))===pid);
    });
    window.scrollTo(0,0);
    // notify indicator
    var active=document.querySelector('.navpill a.on');
    if(active) active.dispatchEvent(new Event('rw-activate'));
  }

  function isMobile(){ return MQ.matches; }

  links.forEach(function(a){
    a.addEventListener('click', function(e){
      if(!isMobile()) return; // desktop keeps scroll spy
      e.preventDefault();
      var id=a.getAttribute('href');
      showPanel(id);
      try{ history.replaceState(null,'',id); }catch(_){}
    });
  });

  function onMode(){
    if(isMobile()){
      var hash=location.hash||'#rewards';
      showPanel(hash);
    }else{
      panels.forEach(function(p){ p.classList.add('is-active'); p.style.display=''; });
    }
  }
  MQ.addEventListener('change', onMode);
  onMode();
})();
`;

if (!html.includes("max-width:767px)")) {
  // already in css
}
if (!html.includes("showPanel(")) {
  html = html.replace("</body>", `<script>${mobileNavPatch}</script>\n</body>`);
}

fs.writeFileSync(p, html);
console.log({
  artPurple: html.includes("/rewards/blades/purple.svg"),
  artSizes: html.includes("260.988"),
  artPinkNeg: html.includes("-31.04"),
  rwd: html.includes("max-width:767px"),
  panels: html.includes('data-panel="rewards"'),
  mobileSwitch: html.includes("showPanel("),
  viewport: html.includes("device-width"),
});
