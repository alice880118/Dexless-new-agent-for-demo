import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

/* 1) Keep hero visible on all mobile tabs */
html = html.replace(
  '<section class="hero-sec rw-panel is-active" id="rewards" data-panel="rewards">',
  '<section class="hero-sec" id="rewards">'
);

/* 2) Replace NTB status card with dual-layout markup */
const oldStatus = `    <!-- next reward card -->
    <div style="display:flex;flex-direction:column;gap:40px">
      <div style="border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:28px;display:flex;
                  align-items:flex-start;justify-content:space-between;width:100%">
        <div style="display:flex;gap:48px;align-items:center">
          <div style="display:flex;flex-direction:column;gap:11px;align-items:center;padding:16px">
            <img class="badge3d" src="/rewards/starter-badge.png"
                 style="width:160px;height:164px;object-fit:cover;object-position:bottom">
            <p style="font-size:24px;font-style:italic;font-weight:600;line-height:28px;
                      background:linear-gradient(270deg,#999,#fff);-webkit-background-clip:text;background-clip:text;color:transparent">Starter</p>
          </div>
          <div style="display:flex;flex-direction:column;justify-content:space-between;padding:12px 0;align-self:stretch">
            <div style="display:flex;flex-direction:column;gap:20px">
              <p style="font-size:24px;font-weight:600;line-height:28px;color:var(--w90);text-transform:capitalize">Your next reward</p>
              <div style="display:flex;flex-direction:column;gap:11px">
                <p style="font-size:16px;font-weight:600;line-height:28px;color:var(--w90);text-transform:capitalize">rewards</p>
                <div style="display:flex;gap:24px;align-items:center">
                  <div style="display:flex;gap:11px;align-items:flex-end;width:122px">
                    <p style="font-size:40px;font-weight:600;line-height:32px;color:var(--w90)">10</p>
                    <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w60);opacity:.8">USDC</p></div>
                  <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w80);opacity:.8">+</p>
                  <div style="display:flex;gap:11px;align-items:flex-end">
                    <p style="font-size:40px;font-weight:600;line-height:32px;color:var(--w90)">200</p>
                    <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w60);opacity:.8">Points</p></div>
                  <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w80);opacity:.8">+</p>
                  <div style="display:flex;gap:11px;align-items:flex-end">
                    <p style="font-size:40px;font-weight:600;line-height:32px;color:var(--w90)">2</p>
                    <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w60);opacity:.8">Tickets</p></div>
                </div>
              </div>
            </div>
            <button class="btn btn-p" style="width:286px;padding:16px 24px;margin-top:24px">Continue trading</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-end">
          <div class="pill pill-prog">In progress</div>
          <p style="font-size:16px;font-weight:500;line-height:20px;color:var(--w50)">Complete your first 14-day trading journey.</p>
        </div>
      </div>`;

const newStatus = `    <!-- next reward card -->
    <div class="ntb-block" style="display:flex;flex-direction:column;gap:40px">
      <div class="ntb-status">
        <div class="ntb-status-top">
          <div class="ntb-badge-col">
            <img class="badge3d ntb-badge-img" src="/rewards/starter-badge.png" data-m="/rewards/starter-badge-m.png" alt="">
            <p class="ntb-badge-label">Starter</p>
          </div>
          <div class="ntb-status-side">
            <div class="ntb-status-meta">
              <div class="pill pill-prog ntb-status-pill">In progress</div>
              <p class="ntb-status-title">Your next reward</p>
              <p class="ntb-status-desc">Complete your first 14-day trading journey.</p>
            </div>
            <div class="ntb-status-desk-body">
              <div style="display:flex;flex-direction:column;gap:11px">
                <p style="font-size:16px;font-weight:600;line-height:28px;color:var(--w90);text-transform:capitalize">rewards</p>
                <div style="display:flex;gap:24px;align-items:center">
                  <div style="display:flex;gap:11px;align-items:flex-end;width:122px">
                    <p style="font-size:40px;font-weight:600;line-height:32px;color:var(--w90)">10</p>
                    <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w60);opacity:.8">USDC</p></div>
                  <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w80);opacity:.8">+</p>
                  <div style="display:flex;gap:11px;align-items:flex-end">
                    <p style="font-size:40px;font-weight:600;line-height:32px;color:var(--w90)">200</p>
                    <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w60);opacity:.8">Points</p></div>
                  <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w80);opacity:.8">+</p>
                  <div style="display:flex;gap:11px;align-items:flex-end">
                    <p style="font-size:40px;font-weight:600;line-height:32px;color:var(--w90)">2</p>
                    <p style="font-size:18px;font-weight:600;line-height:18px;color:var(--w60);opacity:.8">Tickets</p></div>
                </div>
              </div>
              <button class="btn btn-p ntb-cta-desk" style="width:286px;padding:16px 24px;margin-top:24px">Continue trading</button>
            </div>
          </div>
        </div>
        <p class="ntb-status-reward">10 USDC + 200 points + 2 tickets</p>
        <button class="btn btn-p ntb-cta-mob">Continue trading</button>
      </div>`;

if (!html.includes("ntb-status")) {
  if (!html.includes(oldStatus.slice(0, 80))) {
    console.error("status card anchor not found");
  } else {
    html = html.replace(oldStatus, newStatus);
  }
}

/* 3) Update protection copy */
html = html.replace(
  `        <p class="sub-desc">Cashback, protection and tickets towards limited grand prizes.</p>`,
  `        <p class="sub-desc ntb-bundles-desc">First Trade Protection up to 10 USDC if your first closed position loses</p>`
);

/* 4) Insert mobile NTB CSS before closing of max-width:767 block - find #ntb,#missions line */
const ntbCss = `
  /* ===== New Trader Bonus mobile (Figma 7838:106393) ===== */
  .hero-sec{display:block!important}
  #ntb.rw-panel.is-active{
    display:flex!important;flex-direction:column;align-items:stretch;gap:24px;
    width:100%;padding:0 0 24px!important;box-sizing:border-box
  }
  #ntb > .sec-title{
    font-size:14px!important;line-height:20px!important;font-weight:700;
    text-align:left;padding:0 16px;width:100%;box-sizing:border-box
  }
  #ntb > .wrap{
    width:100%!important;max-width:100%!important;padding:0 16px;box-sizing:border-box;
    gap:24px!important;display:flex;flex-direction:column
  }
  #ntb .ntb-block{gap:24px!important;width:100%}
  #ntb .ntb-status{
    border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px;
    display:flex;flex-direction:column;gap:24px;width:100%;box-sizing:border-box;
    background:rgba(255,255,255,.02)
  }
  #ntb .ntb-status-top{display:flex;gap:12px;align-items:flex-start;width:100%}
  #ntb .ntb-badge-col{display:flex;flex-direction:column;align-items:center;gap:4px;width:88px;flex:none;padding:0}
  #ntb .ntb-badge-img{width:80px!important;height:82px!important;object-fit:cover;object-position:bottom;display:block}
  #ntb .ntb-badge-label{
    font-size:12px;font-style:italic;font-weight:600;line-height:16px;margin:0;
    background:linear-gradient(270deg,#999,#fff);-webkit-background-clip:text;background-clip:text;color:transparent
  }
  #ntb .ntb-status-side{flex:1;min-width:0;display:flex;flex-direction:column;gap:0}
  #ntb .ntb-status-meta{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
  #ntb .ntb-status-pill{padding:3px 9px;font-size:12px;line-height:20px;border-radius:8px;align-self:flex-start}
  #ntb .ntb-status-title{font-size:14px;font-weight:600;line-height:20px;color:rgba(255,255,255,.8);margin:0;text-transform:capitalize}
  #ntb .ntb-status-desc{font-size:13px;font-weight:500;line-height:20px;color:rgba(255,255,255,.6);margin:0}
  #ntb .ntb-status-desk-body{display:none!important}
  #ntb .ntb-status-reward{
    display:block;margin:0;width:100%;text-align:center;font-size:16px;font-weight:600;font-style:italic;line-height:20px;
    background:linear-gradient(90deg,#c9bdff,white 50%,#dbfd5c);-webkit-background-clip:text;background-clip:text;color:transparent
  }
  #ntb .ntb-cta-mob{
    display:flex!important;width:100%!important;height:32px;padding:4px 12px!important;
    font-size:12px!important;line-height:20px!important;justify-content:center
  }
  #ntb .ntb-cta-desk{display:none!important}

  /* vertical timeline */
  #ntb .ntb-axis{width:100%!important;max-width:100%;padding:0 0 0 0;margin:0}
  #ntb .ntb-axis-line{
    left:17px;right:auto;top:18px;bottom:18px;width:1px;height:auto;
    background:rgba(255,255,255,.18)
  }
  #ntb .ntb-steps{flex-direction:column;gap:20px;width:100%}
  #ntb .ntb-step{
    display:grid!important;grid-template-columns:36px minmax(0,1fr) auto;
    grid-template-areas:"node label pill" "node prog pill";
    column-gap:16px;row-gap:8px;align-items:center;min-height:0;width:100%;flex:none
  }
  #ntb .ntb-step.done{grid-template-areas:"node label pill"}
  #ntb .ntb-node{
    grid-area:node;width:36px;height:36px;margin:0;border:1px solid rgba(255,255,255,.5);
    border-radius:999px;background:#000
  }
  #ntb .ntb-node span{font-size:14px;line-height:28px;font-style:italic;font-weight:500;color:var(--w50)}
  #ntb .ntb-step.on .ntb-node{border-color:rgba(255,255,255,.5);background:#000;filter:none}
  #ntb .ntb-step.on .ntb-node span{background:none;-webkit-text-fill-color:unset;color:var(--w50)}
  #ntb .ntb-label{
    grid-area:label;margin:0;text-align:left;font-size:14px;font-weight:500;line-height:18px;color:var(--w50)
  }
  #ntb .ntb-step.on .ntb-label{font-weight:500;color:var(--w50)}
  #ntb .ntb-step.done .ntb-label{margin:0}
  #ntb .ntb-prog{
    grid-area:prog;margin:0;justify-content:flex-start;gap:8px
  }
  #ntb .ntb-prog b{font-size:14px;line-height:18px;color:var(--green)}
  #ntb .ntb-prog span{font-size:12px;line-height:18px;color:var(--w60)}
  #ntb .ntb-pill{
    grid-area:pill;padding:2px 8px;border-radius:8px;font-size:12px;line-height:20px;align-self:center
  }
  #ntb .ntb-pill.go{
    background:rgba(255,255,255,.1);color:transparent;
    background-image:none
  }
  #ntb .ntb-pill.go,#ntb .ntb-pill.done span{
    background:linear-gradient(90deg,#c9bdff,#fff 50%,#dbfd5c);-webkit-background-clip:text;background-clip:text;color:transparent
  }
  #ntb .ntb-pill.go{background:rgba(255,255,255,.1)}
  #ntb .ntb-pill.done{background:rgba(255,255,255,.1)}

  /* bundles */
  #ntb .wrap > div[style*="height:1px"]{display:none!important}
  #ntb .wrap > div:last-child{gap:24px!important;width:100%}
  #ntb .wrap > div:last-child > div:first-child{align-items:flex-start!important;gap:12px!important}
  #ntb .sub-title{font-size:16px!important;line-height:20px!important;font-weight:700;text-align:left;width:100%}
  #ntb .ntb-bundles-desc,#ntb .sub-desc{
    font-size:13px!important;line-height:20px!important;text-align:left;padding:0!important;width:100%
  }
  #ntb .wrap > div:last-child > div:last-child{
    padding:0!important;gap:20px!important;width:100%
  }
  #ntb .wrap > div:last-child > div:last-child > div:first-child{display:none!important}
  #ntb .tilt-row.bundle{
    width:100%!important;padding:16px!important;border-radius:12px;box-sizing:border-box;transform:none!important
  }
  #ntb .bundle-in{flex-direction:column;align-items:stretch;gap:16px}
  #ntb .bundle-left{flex-direction:column;align-items:stretch;gap:16px;width:100%}
  #ntb .bundle-col{width:100%!important;flex-direction:row;justify-content:space-between;align-items:flex-start;gap:12px}
  #ntb .bundle-col .pill{order:2;flex:none;padding:2px 8px;font-size:12px;line-height:20px;border-radius:8px}
  #ntb .bundle-col > div:last-child{order:1;flex:1;gap:2px!important}
  #ntb .bundle-t{font-size:14px!important;line-height:20px!important}
  #ntb .bundle-s{font-size:13px!important;line-height:20px!important}
  #ntb .chip{font-size:12px;line-height:20px;padding:4px 12px}
  #ntb .ticket{width:232px;height:77px;margin:0 auto;transform:scale(.79);transform-origin:center top;margin-bottom:-20px}
  #ntb .bundle-in > .btn{
    width:100%!important;height:32px;padding:4px 12px!important;font-size:12px!important;line-height:20px!important
  }
  #ntb .bundle.b2 > .bundle-in > div[style*="chance"],
  #ntb .bundle.b2 div[style*="chance at"]{
    width:100%!important;max-width:100%;border:0!important;background:transparent!important;padding:0!important;
    text-align:center;font-size:12px
  }
  #ntb .bundle.b2 div[style*="chance"] span{font-size:12px!important;line-height:12px!important}
`;

if (!html.includes("New Trader Bonus mobile")) {
  html = html.replace(
    "  #ntb,#missions,#competition,#wheel{padding:16px;box-sizing:border-box}\n}",
    ntbCss + "\n  #missions,#competition,#wheel{padding:16px;box-sizing:border-box}\n}"
  );
}

/* 5) Desktop defaults for new classes */
if (!html.includes(".ntb-status{")) {
  html = html.replace(
    "/* ===== New Trader Bonus timeline axis ===== */",
    `/* ===== NTB status card ===== */
.ntb-status{
  border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:28px;
  display:flex;flex-direction:column;gap:0;width:100%;box-sizing:border-box
}
.ntb-status-top{display:flex;align-items:flex-start;justify-content:space-between;width:100%;gap:48px}
.ntb-badge-col{display:flex;flex-direction:column;gap:11px;align-items:center;padding:16px;flex:none}
.ntb-badge-img{width:160px;height:164px;object-fit:cover;object-position:bottom;display:block}
.ntb-badge-label{
  font-size:24px;font-style:italic;font-weight:600;line-height:28px;margin:0;
  background:linear-gradient(270deg,#999,#fff);-webkit-background-clip:text;background-clip:text;color:transparent
}
.ntb-status-side{display:flex;flex:1;align-items:flex-start;justify-content:space-between;gap:24px;width:100%}
.ntb-status-meta{display:flex;flex-direction:column;gap:12px;align-items:flex-end;order:2}
.ntb-status-title{font-size:24px;font-weight:600;line-height:28px;color:var(--w90);margin:0;text-transform:capitalize;align-self:flex-start}
.ntb-status-desc{font-size:16px;font-weight:500;line-height:20px;color:var(--w50);margin:0;max-width:280px;text-align:right}
.ntb-status-desk-body{display:flex;flex-direction:column;justify-content:space-between;padding:12px 0;align-self:stretch;order:1;flex:1}
.ntb-status-desk-body .ntb-status-title{display:none}
.ntb-status-reward,.ntb-cta-mob{display:none}
.ntb-status-meta .ntb-status-title{display:none}
@media (min-width:768px){
  .ntb-status-side{display:contents}
  .ntb-status-top{display:flex;gap:48px;align-items:center}
  .ntb-status-meta{order:0;margin-left:auto}
  .ntb-status-desk-body{display:flex}
  .ntb-status-desk-body::before{
    content:"Your next reward";font-size:24px;font-weight:600;line-height:28px;color:var(--w90);
    text-transform:capitalize;margin-bottom:20px;display:block
  }
}

/* ===== New Trader Bonus timeline axis ===== */`
  );
}

/* Fix desktop layout - the status side structure is messy. Simplify desktop CSS. */
html = html.replace(
  `@media (min-width:768px){
  .ntb-status-side{display:contents}
  .ntb-status-top{display:flex;gap:48px;align-items:center}
  .ntb-status-meta{order:0;margin-left:auto}
  .ntb-status-desk-body{display:flex}
  .ntb-status-desk-body::before{
    content:"Your next reward";font-size:24px;font-weight:600;line-height:28px;color:var(--w90);
    text-transform:capitalize;margin-bottom:20px;display:block
  }
}`,
  `@media (min-width:768px){
  .ntb-status{flex-direction:row;align-items:flex-start;justify-content:space-between;gap:24px}
  .ntb-status-top{flex:1;display:flex;gap:48px;align-items:center}
  .ntb-status-side{display:flex;flex:1;flex-direction:row;align-items:stretch;justify-content:space-between;gap:24px}
  .ntb-status-meta{order:2;align-items:flex-end}
  .ntb-status-meta .ntb-status-title{display:none}
  .ntb-status-desk-body{display:flex;order:1}
  .ntb-status-desk-body::before{
    content:"Your next reward";font-size:24px;font-weight:600;line-height:28px;color:var(--w90);
    text-transform:capitalize;margin-bottom:20px;display:block
  }
  .ntb-status-reward,.ntb-cta-mob{display:none!important}
}`
);

/* 6) Badge swap + keep hero always on mobile */
if (!html.includes("swapNtbBadge")) {
  html = html.replace(
    `  swapSpinArt();
  MQ.addEventListener('change', swapSpinArt);`,
    `  swapSpinArt();
  MQ.addEventListener('change', swapSpinArt);

  function swapNtbBadge(){
    var img=document.querySelector('.ntb-badge-img');
    if(!img) return;
    var mob=img.getAttribute('data-m');
    if(!mob) return;
    if(!img.getAttribute('data-desk')) img.setAttribute('data-desk', '/rewards/starter-badge.png');
    img.src = MQ.matches ? mob : img.getAttribute('data-desk');
  }
  swapNtbBadge();
  MQ.addEventListener('change', swapNtbBadge);`
  );
}

fs.writeFileSync(p, html);
console.log({
  hero: html.includes('id="rewards-hero"'),
  status: html.includes("ntb-status"),
  css: html.includes("New Trader Bonus mobile"),
  reward: html.includes("ntb-status-reward"),
});
