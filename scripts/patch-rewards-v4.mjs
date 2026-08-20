import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = "D:/Alice/git/0727_nav";
const page = `${root}/public/rewards/page.html`;
const assets = "C:/Users/user/.cursor/projects/d-Alice-git-0727-nav/assets";
const outDir = `${root}/public/rewards/missions`;
fs.mkdirSync(outDir, { recursive: true });

const copies = [
  {
    src: "c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_404f2f3d0fd6602a137016d5f8472458_images_ChatGPT_Image_2026_8_19____11_52_00__3__1-17c41179-0f9c-413e-8a15-98151e21b96c.png",
    dest: "social-x.png",
  },
  {
    src: "c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_404f2f3d0fd6602a137016d5f8472458_images_ChatGPT_Image_2026_8_19____11_52_00__3__1-1-cbf69bb3-ead8-4c03-920e-18d9517428d7.png",
    dest: "social-tg.png",
  },
  {
    src: "c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_404f2f3d0fd6602a137016d5f8472458_images_ChatGPT_Image_2026_8_19____11_52_00__3__1-2-ed8353c6-02c2-46f1-a101-9aca2b12e12a.png",
    dest: "social-share.png",
  },
];

async function toTransparentPng(src, dest, thr = 245) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  // near-white AND near-black → alpha (icons on white/black)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    if (r >= thr && g >= thr && b >= thr) data[i + 3] = 0;
    else if (r <= 12 && g <= 12 && b <= 12) data[i + 3] = 0;
  }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);
  const m = await sharp(dest).metadata();
  console.log(path.basename(dest), m.width, m.height, "alpha", m.hasAlpha);
}

for (const c of copies) {
  await toTransparentPng(path.join(assets, c.src), path.join(outDir, c.dest));
}

let html = fs.readFileSync(page, "utf8");

/* 1) Unlock copy → 16px desktop */
html = html.replace(
  '<p style="font-size:24px;line-height:24px;color:var(--w60);font-weight:500;text-transform:capitalize">\n          Unlock your next draw at',
  '<p class="unlock-draw-copy" style="font-size:16px;line-height:24px;color:var(--w60);font-weight:500;text-transform:capitalize">\n          Unlock your next draw at',
);

/* 2) Hero: restore desktop size — remove global fluid overrides */
const badHero = `.hero{width:100%!important;max-width:1434px;height:auto!important;min-height:360px;aspect-ratio:1434/519}
.hero .d.hero-copy{left:4%!important;top:12%!important;width:min(530px,52%)!important;gap:24px!important}
.hero .d.hero-cd{left:auto!important;right:3%!important;top:auto!important;bottom:8%!important;width:min(392px,42%)!important}
.hero-h{font-size:clamp(22px,3.2vw,36px)!important;line-height:1.25!important}
.hero-n{font-size:clamp(40px,6vw,80px)!important;line-height:1!important}`;

const goodHero = `/* desktop keeps original 1434×519; fluid only below */
@media (max-width:1433px){
  .hero{width:100%!important;max-width:1434px;height:auto!important;min-height:360px;aspect-ratio:1434/519}
  .hero .d.hero-copy{left:4%!important;top:12%!important;width:min(530px,52%)!important;gap:24px!important}
  .hero .d.hero-cd{left:auto!important;right:3%!important;top:auto!important;bottom:8%!important;width:min(392px,42%)!important}
  .trophy-wrap{left:50%!important;top:0!important;width:min(360px,42%)!important;height:auto!important;translate:-50% 0;aspect-ratio:478/537}
  .trophy-wrap .trophy-img{width:100%!important;height:auto!important}
  .hero-h{font-size:clamp(22px,3.2vw,36px)!important;line-height:1.25!important}
  .hero-n{font-size:clamp(40px,6vw,80px)!important;line-height:1!important}
}
@media (min-width:1434px){
  .hero{width:1434px!important;height:519px!important;max-width:1434px;min-height:0;aspect-ratio:auto}
  .hero .d.hero-copy{left:117px!important;top:69px!important;width:530px!important;gap:54px!important;right:auto!important;bottom:auto!important}
  .hero .d.hero-cd{left:995px!important;top:292px!important;width:392px!important;right:auto!important;bottom:auto!important}
  .trophy-wrap{left:565px!important;top:-8px!important;width:478px!important;height:537px!important;translate:none}
  .trophy-wrap .trophy-img{width:406px!important;height:477px!important}
}`;

if (!html.includes(badHero)) {
  console.warn("badHero block not found exactly — trying looser replace");
  // already patched?
  if (!html.includes("@media (min-width:1434px)")) {
    html = html.replace(
      ".hero{width:100%!important;max-width:1434px;height:auto!important;min-height:360px;aspect-ratio:1434/519}",
      "/* hero fluid moved to media query */",
    );
  }
} else {
  html = html.replace(badHero, goodHero);
}

/* Ensure desktop restore even if partial */
if (!html.includes("@media (min-width:1434px)")) {
  html = html.replace(
    "/* ===== RWD (align with app breakpoints: 768 / 390) ===== */",
    `/* ===== RWD (align with app breakpoints: 768 / 390) ===== */
@media (min-width:1434px){
  .hero{width:1434px!important;height:519px!important;max-width:1434px;min-height:0;aspect-ratio:auto}
  .hero .d.hero-copy{left:117px!important;top:69px!important;width:530px!important;gap:54px!important;right:auto!important;bottom:auto!important}
  .hero .d.hero-cd{left:995px!important;top:292px!important;width:392px!important;right:auto!important;bottom:auto!important}
  .trophy-wrap{left:565px!important;top:-8px!important;width:478px!important;height:537px!important;translate:none}
  .trophy-wrap .trophy-img{width:406px!important;height:477px!important}
}
`,
  );
}

/* 3) Social Tasks cards */
const tradingOpen =
  '  <div style="display:flex;gap:24px;align-items:center;justify-content:center;width:1434px">\n    <div class="arrow">';
const tradingOpenNew =
  '  <div class="ms-row" data-ms="trading" style="display:flex;gap:24px;align-items:center;justify-content:center;width:1434px">\n    <div class="arrow">';

if (html.includes('data-ms="trading"')) {
  console.log("trading row already tagged");
} else if (html.includes(tradingOpen)) {
  html = html.replace(tradingOpen, tradingOpenNew);
} else {
  console.error("trading row open not found");
  process.exit(1);
}

const socialRow = `
  <div class="ms-row" data-ms="social" style="display:none;gap:24px;align-items:center;justify-content:center;width:1434px">
    <div class="arrow"><svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="21.5" stroke="rgba(255,255,255,.25)"/><path d="M24.5 15.5L18 22l6.5 6.5" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>

    <div class="tilt ms-card">
      <p class="ms-title" style="top:55px">Follow DEXless on X</p>
      <img class="ms-img" src="/rewards/missions/social-x.png" alt="" style="top:129px;width:128px;height:128px;margin-left:-64px;object-fit:contain">
      <div class="ms-meta" style="top:294px">
        <div class="ms-num"><b style="color:var(--green)">50</b><span>points</span></div>
        <p class="ms-sub">Stay close to market updates and campaign news.</p>
      </div>
      <button class="btn btn-p ms-btn">Verify</button>
    </div>

    <div class="tilt ms-card">
      <p class="ms-title" style="top:39px;line-height:26px">Join the DEXless<br>Telegram</p>
      <img class="ms-img" src="/rewards/missions/social-tg.png" alt="" style="top:129px;width:128px;height:128px;margin-left:-64px;object-fit:contain">
      <div class="ms-meta" style="top:294px">
        <div class="ms-num"><b style="color:var(--green)">50</b><span>points</span></div>
        <p class="ms-sub">Get community updates and support.</p>
      </div>
      <button class="btn btn-p ms-btn">Verify</button>
    </div>

    <div class="tilt ms-card">
      <p class="ms-title" style="top:55px">Share the competition</p>
      <img class="ms-img" src="/rewards/missions/social-share.png" alt="" style="top:122px;width:140px;height:144px;margin-left:-70px;object-fit:contain">
      <div class="ms-meta" style="top:294px">
        <div class="ms-num"><b style="color:var(--green)">1</b><span>Ticket</span></div>
        <p class="ms-sub">Invite friends to join the leaderboard.</p>
      </div>
      <button class="btn btn-p ms-btn">Verify</button>
    </div>

    <div class="arrow"><svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="21.5" stroke="rgba(255,255,255,.25)"/><path d="M19.5 15.5L26 22l-6.5 6.5" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  </div>
`;

if (!html.includes('data-ms="social"')) {
  // insert after trading row closes — before </section> of missions
  const marker =
    '    <div class="arrow"><svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="21.5" stroke="rgba(255,255,255,.25)"/><path d="M19.5 15.5L26 22l-6.5 6.5" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>\n  </div>\n</section>\n\n<!-- ═══════════ TRADING COMPETITION';
  const replacement =
    '    <div class="arrow"><svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="21.5" stroke="rgba(255,255,255,.25)"/><path d="M19.5 15.5L26 22l-6.5 6.5" stroke="rgba(255,255,255,.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>\n  </div>' +
    socialRow +
    "\n</section>\n\n<!-- ═══════════ TRADING COMPETITION";
  if (!html.includes(marker)) {
    console.error("missions close marker not found");
    process.exit(1);
  }
  html = html.replace(marker, replacement);
}

/* Tab switch for mission rows */
const oldTabs = `document.querySelectorAll('.tabs').forEach(function(g){
    g.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        g.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');
      });
    });
  });`;

const newTabs = `document.querySelectorAll('.tabs').forEach(function(g){
    g.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        g.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');
        var sec=g.closest('section')||g.parentElement;
        if(!sec) return;
        var label=(b.textContent||'').trim();
        var rows=sec.querySelectorAll('.ms-row');
        if(!rows.length) return;
        rows.forEach(function(row){
          var kind=row.getAttribute('data-ms');
          var show=(label==='Social Tasks' && kind==='social')||(label!=='Social Tasks' && kind==='trading');
          row.style.display=show?'flex':'none';
        });
      });
    });
  });`;

if (html.includes(oldTabs)) {
  html = html.replace(oldTabs, newTabs);
} else if (!html.includes("data-ms")) {
  console.warn("tabs js not replaced");
} else if (!html.includes("Social Tasks' && kind")) {
  // try if already partial
  console.warn("tabs may need manual check");
}

fs.writeFileSync(page, html);
console.log({
  unlock16: html.includes('class="unlock-draw-copy" style="font-size:16px'),
  social: html.includes('data-ms="social"'),
  trading: html.includes('data-ms="trading"'),
  heroDesktop: html.includes("@media (min-width:1434px)"),
  tabSwitch: html.includes("Social Tasks' && kind"),
  noGlobalHeroFluid: !html.includes(
    ".hero{width:100%!important;max-width:1434px;height:auto!important;min-height:360px;aspect-ratio:1434/519}",
  ),
});
