import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

html = html.replace(
  '<p style="font-size:12px;font-weight:500;line-height:20px;color:var(--w50)"><b style="font-weight:700;color:#fff">2</b> Spin available</p>',
  '<p class="spin-avail" style="font-size:13px;font-weight:500;line-height:20px;color:var(--w60)"><b class="spin-avail-n">2</b> Spin available</p>'
);

html = html.replace(
  '<span class="tag-mob">Winner Receives <em>6,666 USDC</em></span>',
  '<span class="tag-mob">Volume Race + ROI Masters</span>'
);

html = html.replace(
  '<p class="hero-h"><span class="hero-kicker">Genesis</span> Trading Competition</p>',
  `<p class="hero-h"><span class="hero-kicker">Genesis</span><span class="hero-h-desk"> Trading Competition</span></p>
          <p class="hero-h-mob">Trading<br>Competition</p>`
);

html = html.replace(
  '<button class="btn btn-g" style="padding:12px 28px;line-height:20px">View prize breakdown</button>',
  '<button class="btn btn-g hero-btn-sec" style="padding:12px 28px;line-height:20px"><span class="hero-btn-desk">View prize breakdown</span><span class="hero-btn-mob">Trade Now</span></button>'
);

if (!html.includes("earn-banner-m")) {
  html = html.replace(
    `<section class="stack48 rv rw-panel is-active" id="today" data-panel="rewards">
  <h2 class="sec-title" style="width:100%">Today’s trading</h2>`,
    `<section class="stack48 rv rw-panel is-active" id="today" data-panel="rewards">
  <h2 class="sec-title" style="width:100%">Today’s trading</h2>
  <div class="earn-banner-m">
    <img src="/rewards/earn-banner-m.png" alt="">
    <div class="earn-banner-m-copy">
      <p class="earn-banner-m-t">Finish everything to earn up to</p>
      <div class="earn-banner-m-row">
        <span class="earn-n">88</span><span class="earn-u">USDC</span>
        <span class="earn-plus">+</span>
        <span class="earn-n earn-n-sm">1,500</span><span class="earn-u">points</span>
        <span class="earn-plus">+</span>
        <span class="earn-n earn-n-sm">10</span><span class="earn-u">tickets</span>
      </div>
    </div>
  </div>`
  );
}

html = html.replace(
  `<img class="bg" src="/rewards/win-iphone.png"
             style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:16px">`,
  `<img class="bg spin-card-bg" src="/rewards/win-iphone.png" data-m="/rewards/spin-card-m.png"
             style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:16px">`
);

if (!html.includes("m-activity")) {
  html = html.replace(
    `  <!-- reward activity -->
  <div style="display:flex;flex-direction:column;gap:28px;align-items:center;width:100%">
    <h3 class="sub-title" style="letter-spacing:-.72px">Reward activity</h3>`,
    `  <!-- reward activity -->
  <div class="m-activity">
    <h3 class="sec-title m-activity-title">Today’s trading</h3>
    <div class="m-activity-list">
      <div class="m-act"><div class="m-act-l"><p class="m-act-s">Claimed</p><p class="m-act-d">Aug 18</p></div><div class="m-act-r"><p class="m-act-t">First Trade Gift</p><p class="m-act-v">88 Points + 1 Ticket</p></div></div>
      <div class="m-act"><div class="m-act-l"><p class="m-act-s">Claimed</p><p class="m-act-d">Aug 18</p></div><div class="m-act-r"><p class="m-act-t">First Trade Gift</p><p class="m-act-v">88 Points + 1 Ticket</p></div></div>
      <div class="m-act"><div class="m-act-l"><p class="m-act-s">Claimed</p><p class="m-act-d">Aug 18</p></div><div class="m-act-r"><p class="m-act-t">First Trade Gift</p><p class="m-act-v">88 Points + 1 Ticket</p></div></div>
    </div>
  </div>
  <div class="d-activity" style="display:flex;flex-direction:column;gap:28px;align-items:center;width:100%">
    <h3 class="sub-title" style="letter-spacing:-.72px">Reward activity</h3>`
  );
}

if (!html.includes("hero-bg-m")) {
  html = html.replace(
    `<img class="hero-bg-img" src="/rewards/hero-bg.png" alt=""
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:1" />`,
    `<img class="hero-bg-img" src="/rewards/hero-bg.png" alt=""
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:1" />
      <img class="hero-bg-m" src="/rewards/hero-mobile.png" alt="" />`
  );
}

/* Mobile CSS block replacement */
const mobileCssStart = "@media (max-width:767px){";
const mobileCssEnd = "\n\n@media (max-width:390px){";
const i0 = html.indexOf(mobileCssStart);
const i1 = html.indexOf(mobileCssEnd);
if (i0 < 0 || i1 < 0) throw new Error("mobile css markers not found");

const newMobileCss = `@media (max-width:767px){
  body{min-width:0;overflow-x:hidden}
  .wrap{width:100%;max-width:100%;padding:0;box-sizing:border-box}
  .page{gap:24px;padding-bottom:48px;min-height:100dvh}
  .hero-sec{padding-top:0}
  .hero{
    position:relative!important;width:100%!important;max-width:100%!important;
    height:764px!important;min-height:764px;aspect-ratio:auto!important;
    display:block!important;padding:0;overflow:hidden!important;background:#000
  }
  .hero-bg-img{display:none!important}
  .hero-bg-m{
    display:block;position:absolute;left:50%;top:18px;transform:translateX(-50%);
    width:390px;max-width:100%;height:746px;object-fit:cover;object-position:top center;
    pointer-events:none;z-index:1
  }
  .hero>.d:not(.trophy-wrap):not(.hero-copy):not(.hero-cd){display:none!important}
  .trophy-wrap{display:none!important}
  .hero .d.hero-copy,.hero .d.hero-cd{
    position:absolute!important;left:50%!important;right:auto!important;bottom:auto!important;
    width:auto!important;height:auto!important;margin:0!important;translate:none!important;
    transform:translateX(-50%);z-index:5
  }
  .hero .d.hero-copy{
    top:31px!important;width:100%!important;max-width:390px;padding:0 16px;box-sizing:border-box;
    display:flex!important;flex-direction:column;align-items:center;gap:0!important
  }
  .tagchip{
    order:1;align-self:center;font-size:13px;line-height:20px;font-weight:500;
    padding:4px 12px;border-radius:999px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.5);
    color:#fff;margin-bottom:14px
  }
  .tag-desk{display:none}
  .tag-mob{display:inline;font-style:normal}
  .hero-titles{order:2;display:flex!important;flex-direction:column;align-items:center;width:100%;text-align:center;gap:0!important}
  .hero-kicker{
    display:block;font-size:20px;font-weight:500;line-height:32px;color:transparent;
    background:linear-gradient(90deg,rgba(255,255,255,.81),rgba(255,255,255,.9));
    -webkit-background-clip:text;background-clip:text;text-shadow:0 0 16px rgba(0,0,0,.8);margin:0
  }
  .hero-h{font-size:20px!important;line-height:32px!important;font-weight:500;background:none!important;
    -webkit-text-fill-color:unset;color:transparent;text-shadow:none;margin:0}
  .hero-h-desk{display:none}
  .hero-h-mob{
    display:block;margin:5px 0 0;font-size:35px;font-weight:600;line-height:39px;text-align:center;
    background:linear-gradient(90deg,rgba(255,255,255,.81),rgba(255,255,255,.9));
    -webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 16px rgba(0,0,0,.8)
  }
  .hero-n{
    font-size:44px!important;line-height:60px!important;font-weight:700;font-style:italic;margin-top:10px;
    background:linear-gradient(90deg,#c9bdff,white 50.96%,#dbfd5c 101.92%)!important;
    -webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent;
    color:transparent;text-shadow:0 0 16px rgba(0,0,0,.8)
  }
  .hero-tagline{display:none!important}
  .hero-btns{
    order:3;display:flex!important;width:310px;max-width:100%;justify-content:center;gap:12px!important;
    flex-wrap:nowrap;padding:0;margin-top:308px;z-index:6
  }
  .hero-btns .btn{
    width:149px!important;flex:none;max-width:none;padding:8px 28px!important;font-size:13px!important;line-height:20px!important
  }
  .hero-btn-desk{display:none}
  .hero-btn-mob{display:inline}
  .hero .d.hero-cd{
    top:622px!important;width:272px!important;display:flex!important;flex-direction:column;align-items:center;gap:11px!important
  }
  .hero-cd>div>p{font-size:13px!important;font-weight:500!important;line-height:20px!important;color:#fff!important;text-shadow:0 0 16px rgba(0,0,0,.8)}
  .hero-cd>p{font-size:12px!important;line-height:20px!important;opacity:.5}
  .hero-cd>div>div{display:flex;gap:8px;justify-content:center;width:100%}
  .cd-box{
    width:62px;height:56px;padding:8px 12px;border-radius:12px;box-sizing:border-box;
    background:rgba(0,0,0,.85);border:1px solid #888;justify-content:center
  }
  .cd-box.on{border-color:#dbfd5c}
  .cd-box b{font-size:16px;line-height:20px;letter-spacing:-.48px}
  .cd-box span{font-size:13px;line-height:18px}

  /* underline tabs under hero (Figma) */
  .navbar{
    position:relative!important;left:auto;right:auto;bottom:auto;top:auto!important;
    z-index:60;margin-top:0!important;height:40px!important;
    background:transparent;padding:12px 16px 0;border:0;border-bottom:1px solid rgba(255,255,255,.1);
    backdrop-filter:none;display:flex;align-items:flex-start
  }
  .navpill{
    width:100%;max-width:100%;justify-content:flex-start;gap:16px;padding:0;
    background:transparent!important;border:none;backdrop-filter:none;border-radius:0;
    overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none
  }
  .navpill::-webkit-scrollbar{display:none}
  .navpill .nav-indicator{display:none!important}
  .navpill a{
    padding:0 0 6px!important;font-size:13px!important;line-height:20px!important;
    color:rgba(255,255,255,.5)!important;font-weight:600;background:transparent!important;
    border-radius:0;box-shadow:none;white-space:nowrap;flex:none
  }
  .navpill a.on,.navpill a.on:hover{
    color:#fff!important;font-weight:600;background:transparent!important;
    box-shadow:inset 0 -2px 0 #dbfd5c
  }
  .navpill a:hover{color:rgba(255,255,255,.8)!important;transform:none}

  .sec-title{font-size:14px!important;line-height:20px!important;font-weight:700;text-align:left;padding:0 16px;width:100%;box-sizing:border-box}
  .sub-title{font-size:14px!important;line-height:20px!important;font-weight:600}
  .sub-desc{font-size:13px!important;line-height:20px!important;font-weight:500;padding:0 8px}
  .claim{right:12px;top:auto;bottom:24px;transform:scale(.78);transform-origin:bottom right}

  /* rewards home = long scroll; other tabs still panel-switch */
  .rw-panel{display:none!important;padding:0;min-height:0;width:100%}
  .rw-panel.is-active{display:flex!important;flex-direction:column;align-items:stretch;gap:24px;width:100%}
  .hero-sec.rw-panel.is-active{display:block!important}
  .stack48.rw-panel.is-active{gap:24px;padding:0 0 24px}
  #today.rw-panel{width:100%;padding:0 16px;box-sizing:border-box;align-items:stretch}
  #today.rw-panel > .sec-title{padding:0}
  #today.rw-panel > div[style*="1434px"],
  #today .d-activity{display:none!important}
  .earn-banner-m{
    display:block;position:relative;width:100%;height:90px;border-radius:0;overflow:hidden;flex:none
  }
  .earn-banner-m img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .earn-banner-m-copy{position:relative;z-index:1;padding:8px 16px;height:100%;display:flex;flex-direction:column;justify-content:center;gap:8px}
  .earn-banner-m-t{font-size:13px;font-weight:500;line-height:15px;color:rgba(0,0,0,.8);margin:0}
  .earn-banner-m-row{display:flex;gap:9px;align-items:flex-end;font-style:italic;flex-wrap:wrap}
  .earn-n{font-size:30px;font-weight:600;line-height:31px;color:#000}
  .earn-n-sm{font-size:16px;line-height:24px}
  .earn-u{font-size:13px;font-weight:500;line-height:20px;color:rgba(0,0,0,.5);margin-left:3px}
  .earn-plus{font-size:16px;font-weight:500;line-height:24px;color:rgba(0,0,0,.5)}

  #today > div[style*="flex-direction:column"]{width:100%!important;gap:24px!important;align-items:stretch!important}
  .card-today{
    width:100%!important;max-width:100%!important;height:auto!important;min-height:0;
    flex-direction:column;align-items:stretch;padding:16px!important;gap:32px;border-radius:12px;box-sizing:border-box
  }
  .card-today .unlock-left{width:100%!important;height:auto!important;gap:32px}
  .card-today .unlock-draw-copy{font-size:13px!important;line-height:20px!important}
  .card-today .unlock-left > div:last-child > div:first-child p:first-child{font-size:48px!important;line-height:54px!important}
  .card-today .unlock-left > div:last-child > div:first-child > div{font-size:16px!important;line-height:20px!important;width:auto!important;gap:4px!important}
  .card-today .bar{width:100%!important;height:6px!important}
  .card-today .bar i{width:78.83%!important}
  .card-today .unlock-right{
    position:absolute!important;top:16px;right:16px;height:auto!important;width:auto!important;padding:0!important
  }
  .card-today .unlock-right > div:last-child{display:none!important}
  .card-today .tag-tr{
    background:linear-gradient(90deg,rgba(255,255,255,.2),rgba(153,153,153,.2));
    border-radius:8px;padding:4px 8px;font-size:12px;line-height:20px;font-weight:500;color:#cfc4ff
  }

  #today > div > div[style*="gap:24px"]{
    flex-direction:column!important;width:100%!important;gap:24px!important;align-items:stretch!important
  }
  #today .mini{
    width:100%!important;max-width:100%!important;height:auto!important;min-height:0;border-radius:12px;
    padding:16px!important;box-sizing:border-box
  }
  #today .mini .upto{display:none!important}
  #today .mini:first-child{
    background:rgba(255,255,255,.05)!important;gap:32px;align-items:stretch!important;padding:16px!important
  }
  #today .mini:first-child > div:first-child{align-items:flex-start}
  #today .mini:first-child > div:first-child > div:first-child{padding-top:0}
  #today .mini:first-child > div:first-child > div:first-child p{font-size:16px;font-weight:600;line-height:20px}
  #today .mini:first-child .linkbtn{
    border:1px solid rgba(255,255,255,.5);border-radius:999px;width:120px;height:32px;padding:4px 12px;
    justify-content:center;font-size:12px;line-height:20px;font-weight:500;color:#fff
  }
  #today .mini:first-child .linkbtn svg{display:none}
  #today .mini:last-child{
    min-height:231px;justify-content:space-between;padding:16px!important;position:relative
  }
  #today .spin-card-bg{content:""; }
  .spin-avail-n{font-size:16px;font-weight:700;font-style:italic;line-height:20px;color:rgba(255,255,255,.8)}
  #today .mini:last-child .btn{
    position:absolute!important;top:16px;right:16px;width:120px!important;height:32px;padding:4px 12px!important;
    font-size:12px!important;line-height:20px!important
  }
  #today .mini:last-child > div:first-of-type{margin-top:auto}
  #today .mini:last-child p[style*="24px"],
  #today .mini:last-child p[style*="32px"]{font-size:20px!important;line-height:20px!important}

  #today > div[style*="gap:24px"][style*="align-items:stretch"]{
    flex-direction:column!important;width:100%!important;gap:0!important;border:1px solid rgba(255,255,255,.1);
    border-radius:12px;overflow:hidden
  }
  #today .infocard{
    width:100%!important;border:0;border-radius:0;padding:12px;box-sizing:border-box;
    background:transparent
  }
  #today .infocard + .infocard{border-top:1px solid rgba(255,255,255,.1)}

  .m-activity{display:flex;flex-direction:column;gap:24px;width:100%}
  .m-activity-title{padding:0!important}
  .m-activity-list{
    border:1px solid rgba(255,255,255,.1);border-radius:12px;display:flex;flex-direction:column;gap:8px;padding:0
  }
  .m-act{
    display:flex;align-items:center;justify-content:space-between;padding:12px;border-radius:12px;
    background:rgba(255,255,255,.05)
  }
  .m-act-l{display:flex;flex-direction:column;gap:7px}
  .m-act-s{font-size:14px;font-weight:600;line-height:20px;color:var(--w60);margin:0}
  .m-act-d{font-size:16px;font-weight:600;line-height:23px;color:var(--w90);margin:0}
  .m-act-r{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;gap:12px;min-height:50px}
  .m-act-t{font-size:14px;font-weight:600;line-height:20px;color:var(--w60);margin:0}
  .m-act-v{font-size:13px;font-weight:500;line-height:18px;color:var(--w60);opacity:.8;margin:0}

  .podium-row{width:100%;justify-content:center;overflow-x:auto}
  #wheel{gap:28px!important}
  #wheel > div[style*="1434px"]{width:100%!important;max-width:100%}
  .pz-card{flex:1 1 140px}
  .stage-wrap{height:auto!important;min-height:220px;width:calc(100% - 16px);border-radius:12px;margin:0 auto}
  .tabs{width:max-content;max-width:100%;align-self:center}
  #ntb,#missions,#competition,#wheel{padding:16px;box-sizing:border-box}
}

.hero-bg-m,.hero-h-mob,.hero-btn-mob,.earn-banner-m,.m-activity{display:none}
.hero-btn-desk,.hero-h-desk{display:inline}
.spin-avail-n{font-size:16px;font-weight:700;font-style:italic;line-height:20px;color:rgba(255,255,255,.8)}
`;

html = html.slice(0, i0) + newMobileCss + html.slice(i1);

/* Desktop defaults for new elements inside 390 override cleanup */
html = html.replace(
  `@media (max-width:390px){
  .hero-n{font-size:36px!important;line-height:40px!important}
  .hero-h{font-size:24px!important;line-height:30px!important}
  .navpill a{padding:10px 12px!important;font-size:13px!important}
  .claim{transform:scale(.7)}
}`,
  `@media (max-width:390px){
  .hero{height:auto!important;min-height:0;aspect-ratio:390/764}
  .hero-bg-m{width:100%;height:auto;aspect-ratio:390/746;top:0}
  .claim{transform:scale(.7)}
}`
);

/* JS: swap spin card art on mobile */
if (!html.includes("spin-card-bg")) {
  // already added class above
}
if (!html.includes("data-m-src-swap")) {
  html = html.replace(
    `  fitStage();
  window.addEventListener('resize', fitStage, {passive:true});`,
    `  fitStage();
  window.addEventListener('resize', fitStage, {passive:true});

  /* data-m-src-swap */
  function swapSpinArt(){
    var img=document.querySelector('.spin-card-bg');
    if(!img) return;
    var desk=img.getAttribute('src');
    var mob=img.getAttribute('data-m');
    if(!mob) return;
    if(!img.getAttribute('data-desk')) img.setAttribute('data-desk', desk.indexOf('spin-card-m')>=0 ? '/rewards/win-iphone.png' : desk);
    img.src = MQ.matches ? mob : img.getAttribute('data-desk');
  }
  swapSpinArt();
  MQ.addEventListener('change', swapSpinArt);`
  );
}

fs.writeFileSync(p, html);
console.log("ok", {
  spin: html.includes("spin-avail-n"),
  earn: html.includes("earn-banner-m"),
  heroM: html.includes("hero-bg-m"),
  act: html.includes("m-activity"),
  css: html.includes("earn-banner-m-copy"),
});
