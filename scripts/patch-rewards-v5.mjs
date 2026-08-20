import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

const oldRwdExtras = `.navbar{height:auto;padding:8px 0}
.navpill{flex-wrap:nowrap;overflow-x:auto;max-width:100%;scrollbar-width:none;gap:4px;padding:8px 10px}
.navpill::-webkit-scrollbar{display:none}
.navpill a{padding:12px 18px;font-size:14px;line-height:20px;white-space:nowrap}
.sec-title{font-size:clamp(22px,3vw,32px)!important;line-height:1.2!important}
.sub-title{font-size:clamp(18px,2.4vw,24px)!important;line-height:1.25!important}
.sub-desc{font-size:14px!important;line-height:22px!important}
.page{gap:80px;padding-bottom:80px;width:100%}
.card-today,.mini,.tablecard,.infocard,.stage-wrap{width:100%!important;max-width:1434px}
.card-today{height:auto!important;min-height:280px;flex-wrap:wrap;padding:20px!important}
.stage-wrap{height:auto!important;min-height:220px}
.claim{right:16px}

@media (max-width:1279px){
  .page{gap:72px}
  .hero-h{font-size:clamp(22px,2.8vw,28px)!important}
  .hero-n{font-size:clamp(48px,5vw,64px)!important}
  .sec-title{font-size:clamp(22px,2.6vw,28px)!important}
  .sub-title{font-size:clamp(18px,2.2vw,22px)!important}
  .navpill a{font-size:14px;line-height:20px}
}
/* tablet 768 */
@media (max-width:1024px){
  .page{gap:64px}
  .hero .d.hero-copy{gap:18px!important}
  .btn{font-size:14px}
}`;

const newDesktopRestore = `/* >=768: restore original type, gaps, card, tabs (hug content) */
@media (min-width:768px){
  .page{gap:140px;padding-bottom:160px}
  .sec-title{font-size:32px!important;line-height:24px!important;font-weight:700}
  .sub-title{font-size:24px!important;line-height:28px!important;font-weight:600}
  .sub-desc{font-size:16px!important;line-height:28px!important;padding:0}
  .navbar{height:105px;padding:0}
  .navpill{padding:12px 16px;gap:8px}
  .navpill a{padding:16px 32px;font-size:16px;line-height:12px}
  .card-today{
    width:1434px!important;height:343px!important;min-height:343px;
    flex-wrap:nowrap!important;padding:0 0 0 32px!important;
    align-items:center;justify-content:space-between
  }
  .mini{width:705px!important;height:253px!important}
  .tablecard,.infocard{width:1434px!important;max-width:1434px}
  .tabs{width:max-content;max-width:none;flex:none;align-self:center;margin:0 auto}
  .tabs button{flex:none;width:auto;white-space:nowrap;padding:16px 32px;font-size:16px;line-height:12px}
  .podium-row{width:100%;display:flex;align-items:center;justify-content:center}
  .podium-row > .pod{flex:none}
}

.navpill{flex-wrap:nowrap;overflow-x:auto;max-width:100%;scrollbar-width:none}
.navpill::-webkit-scrollbar{display:none}`;

if (!html.includes(oldRwdExtras)) {
  console.error("RWD extras block not found");
  process.exit(1);
}
html = html.replace(oldRwdExtras, newDesktopRestore);

/* mobile still needs fluid cards */
if (!html.includes("/* mobile cards */")) {
  html = html.replace(
    "  #today.rw-panel{width:100%}\n",
    `  #today.rw-panel{width:100%}
  /* mobile cards */
  .card-today,.mini,.tablecard,.infocard,.stage-wrap{width:100%!important;max-width:1434px}
  .card-today{height:auto!important;min-height:280px;flex-wrap:wrap;padding:20px!important}
  .stage-wrap{height:auto!important;min-height:220px}
  .tabs{width:max-content;max-width:100%;align-self:center}
  .podium-row{width:100%;justify-content:center;overflow-x:auto}
`,
  );
}

/* podium center */
html = html.replace(
  '  <!-- podium -->\n  <div style="display:flex;align-items:center;width:990px">',
  '  <!-- podium -->\n  <div class="podium-row" style="display:flex;align-items:center;justify-content:center;width:100%">\n  <div style="display:flex;align-items:center;justify-content:center;width:990px">',
);

/* close extra podium wrapper: after 3rd pod, before next sibling */
if (!html.includes("</div><!-- /podium-row -->")) {
  const afterPods = html.indexOf("<!-- podium -->");
  // find the closing of 990 row: after third pod's closing, the </div> that closed width:990
  const marker =
    '      <p class="pod-n" style="top:184px;font-size:14px;background:linear-gradient(270deg,rgba(251,143,62,.9),rgba(255,204,183,.9));-webkit-background-clip:text;background-clip:text;color:transparent">mid****rth</p>';
  const idx = html.indexOf(marker);
  if (idx < 0) {
    console.error("pod3 marker not found");
    process.exit(1);
  }
  const podClose = html.indexOf("</div>", html.indexOf("</div>", idx) + 1);
  // structure: pod-n </p> then </div> (pod) then </div> (990)
  // idx is pod-n p, next </div> is pod, next is 990
  let searchFrom = idx;
  const first = html.indexOf("</div>", searchFrom); // pod
  const second = html.indexOf("</div>", first + 6); // 990 wrapper
  html =
    html.slice(0, second + 6) +
    "\n  </div><!-- /podium-row -->" +
    html.slice(second + 6);
}

/* Unlock card: $3,200 sits at end of filled 508px, not full 687 */
html = html.replace(
  `          <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-end;width:100%">
            <div style="display:flex;gap:10px;align-items:flex-end;font-style:italic;font-weight:600">
              <p style="font-size:29px;line-height:28px">$3,200</p>
              <p style="font-size:18px;line-height:21px;color:var(--w50)">to go</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:11px;width:100%">
              <div class="bar" style="width:687px;height:12px"><i style="width:508px;animation-delay:.25s"></i></div>`,
  `          <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:100%">
            <div style="width:508px;display:flex;gap:10px;align-items:flex-end;justify-content:flex-end;font-style:italic;font-weight:600">
              <p style="font-size:29px;line-height:28px">$3,200</p>
              <p style="font-size:18px;line-height:21px;color:var(--w50)">to go</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:11px;width:100%">
              <div class="bar" style="width:687px;height:12px"><i style="width:508px;animation-delay:.25s"></i></div>`,
);

/* left column shrink-0; right column fills card height */
html = html.replace(
  '<div style="position:relative;display:flex;flex-direction:column;height:271px;width:687px;justify-content:space-between">',
  '<div class="unlock-left" style="position:relative;display:flex;flex-direction:column;height:271px;width:687px;flex:none;justify-content:space-between">',
);
html = html.replace(
  '<div style="position:relative;display:flex;flex-direction:column;height:100%;align-items:flex-end;justify-content:space-between">\n        <div class="tag-tr">Every spin wins</div>',
  '<div class="unlock-right" style="position:relative;display:flex;flex-direction:column;height:343px;align-items:flex-end;justify-content:space-between;flex:none">\n        <div class="tag-tr">Every spin wins</div>',
);

if (!html.includes(".tabs{width:max-content") && html.includes(".tabs{background")) {
  html = html.replace(
    ".tabs{background:rgba(255,255,255,.05);border-radius:20px;padding:12px 16px;display:flex;gap:8px;align-items:center}",
    ".tabs{background:rgba(255,255,255,.05);border-radius:20px;padding:12px 16px;display:flex;gap:8px;align-items:center;width:max-content;flex:none;align-self:center}",
  );
}

fs.writeFileSync(p, html);
console.log({
  desktopRestore: html.includes("@media (min-width:768px)"),
  noGlobalClamp: !html.includes(".sec-title{font-size:clamp(22px,3vw,32px)"),
  podiumRow: html.includes("podium-row"),
  podiumClose: html.includes("/podium-row"),
  toGo508: html.includes("width:508px;display:flex;gap:10px"),
  unlockRight: html.includes('class="unlock-right"'),
  tabsHug: html.includes(".tabs{width:max-content") || html.includes("width:max-content;max-width:none"),
});
