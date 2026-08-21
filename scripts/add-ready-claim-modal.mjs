import fs from "fs";
import https from "https";
import http from "http";

const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchBuf(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

fs.mkdirSync("public/rewards/claim", { recursive: true });
const close = await fetchBuf(
  "https://www.figma.com/api/mcp/asset/e3d2780d-6b0d-4f28-a0eb-ddc74dea45e7.svg"
);
fs.writeFileSync("public/rewards/claim/close.svg", close);
console.log("close.svg", close.length);

const modalHtml = `
<!-- ═══════════ READY TO CLAIM MODAL ═══════════ -->
<div class="rc-overlay" id="rc-overlay" hidden>
  <div class="rc-dialog" role="dialog" aria-modal="true" aria-labelledby="rc-title">
    <button type="button" class="rc-close" id="rc-close" aria-label="Close">
      <img src="/rewards/claim/close.svg" alt="" width="32" height="32">
    </button>
    <div class="rc-panel">
      <div class="rc-head">
        <h3 class="rc-title" id="rc-title">Ready to claim</h3>
        <p class="rc-sub">Choose each reward individually. We’ll show exactly where it will be credited.</p>
      </div>
      <div class="rc-list" id="rc-list">
        <div class="rc-row" data-reward="points">
          <div class="rc-meta">
            <p class="rc-name rc-name-desk">88 Points + 1 Lucky Wheel Ticket</p>
            <p class="rc-name rc-name-mob">88 Points +<br>1 Wheel Ticket</p>
            <p class="rc-desc rc-desc-desk">First Trade Gift · Credits to your Points balance and Lucky Wheel</p>
            <p class="rc-desc rc-desc-mob">First Trade Gift</p>
          </div>
          <button type="button" class="btn btn-p rc-claim" data-claim>Claim</button>
        </div>
        <div class="rc-row" data-reward="usdc">
          <div class="rc-meta">
            <p class="rc-name">0.5 USDC</p>
            <p class="rc-desc rc-desc-desk">Lucky Wheel · Credits to your trading wallet</p>
            <p class="rc-desc rc-desc-mob">Lucky Wheel</p>
          </div>
          <button type="button" class="btn btn-p rc-claim" data-claim>Claim</button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

if (html.includes('id="rc-overlay"')) {
  console.log("modal already present, skip html insert");
} else {
  const mark = "<!-- ═══════════ FLOATING CLAIM POPUP";
  const i = html.indexOf(mark);
  if (i < 0) throw new Error("claim mark missing");
  // insert AFTER the floating claim block — find end of claim div
  const afterClaim = html.indexOf('<style>', i);
  if (afterClaim < 0) throw new Error("style after claim missing");
  html = html.slice(0, afterClaim) + modalHtml + "\n" + html.slice(afterClaim);
}

const css = `
/* ===== Ready to claim modal (Figma 7850:31541 / 7850:31542) ===== */
.rc-overlay{
  position:fixed;inset:0;z-index:220;display:flex;align-items:center;justify-content:center;
  padding:24px;box-sizing:border-box;
  background:rgba(0,0,0,.55);backdrop-filter:blur(2px)
}
.rc-overlay[hidden]{display:none!important}
.rc-dialog{
  position:relative;width:min(640px,100%);
  display:flex;flex-direction:column;align-items:flex-end;gap:8px
}
.rc-close{
  width:32px;height:32px;padding:0;border:0;background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;flex:none;opacity:.85
}
.rc-close:hover{opacity:1}
.rc-close img{width:32px;height:32px;display:block}
.rc-panel{
  width:100%;box-sizing:border-box;background:#202020;border-radius:16px;
  padding:24px;display:flex;flex-direction:column;gap:24px;align-items:stretch
}
.rc-head{display:flex;flex-direction:column;gap:14px;width:100%}
.rc-title{margin:0;font-size:24px;font-weight:600;line-height:26px;color:var(--w90)}
.rc-sub{margin:0;font-size:14px;font-weight:500;line-height:20px;color:var(--w60);text-transform:capitalize}
.rc-list{display:flex;flex-direction:column;gap:16px;width:100%}
.rc-row{
  display:flex;align-items:center;gap:16px;width:100%;box-sizing:border-box;
  background:rgba(255,255,255,.05);border-radius:12px;padding:8px 16px
}
.rc-meta{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.rc-name{margin:0;font-size:20px;font-weight:600;line-height:25px;color:var(--w90)}
.rc-desc{margin:0;font-size:14px;font-weight:500;line-height:20px;color:var(--w50);text-transform:capitalize}
.rc-name-mob,.rc-desc-mob{display:none}
.rc-claim{
  flex:none;padding:16px 24px;border-radius:999px;font-size:16px;font-weight:600;line-height:12px;
  text-transform:capitalize;border:0;cursor:pointer
}
.rc-claim:disabled,.rc-row.is-claimed .rc-claim{
  opacity:.45;cursor:default;filter:none;transform:none
}
.rc-row.is-claimed .rc-claim{pointer-events:none}

@media (max-width:767px){
  .rc-overlay{padding:16px;align-items:center}
  .rc-dialog{width:min(343px,100%)}
  .rc-close{width:28px;height:28px}
  .rc-close img{width:28px;height:28px}
  .rc-panel{padding:16px;gap:24px}
  .rc-title{font-size:16px;line-height:26px}
  .rc-sub{font-size:13px;line-height:18px}
  .rc-row{padding:4px 12px;gap:16px}
  .rc-name{font-size:16px;line-height:20px}
  .rc-name-desk,.rc-desc-desk{display:none}
  .rc-name-mob,.rc-desc-mob{display:block}
  .rc-desc{font-size:13px;line-height:20px}
  .rc-claim{height:32px;padding:4px 12px;font-size:12px;line-height:20px;filter:none}
}
`;

if (!html.includes("Ready to claim modal (Figma")) {
  const insertAt = html.indexOf("/* ===== floating claim popup ===== */");
  if (insertAt < 0) throw new Error("floating claim css missing");
  html = html.slice(0, insertAt) + css + "\n" + html.slice(insertAt);
}

const newJs = `  function openReadyClaim(){
    var ov=document.getElementById('rc-overlay');
    if(!ov) return;
    ov.hidden=false;
    document.documentElement.style.overflow='hidden';
  }
  function closeReadyClaim(){
    var ov=document.getElementById('rc-overlay');
    if(!ov) return;
    ov.hidden=true;
    document.documentElement.style.overflow='';
  }
  function goClaimRewards(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    openReadyClaim();
  }
  var claimEl=document.getElementById('claim');
  var claimBtn=document.getElementById('claim-btn');
  if(claimEl) claimEl.addEventListener('click', goClaimRewards);
  if(claimBtn) claimBtn.addEventListener('click', function(e){ e.stopPropagation(); goClaimRewards(e); });

  document.querySelectorAll('.ms-btn').forEach(function(b){
    if((b.textContent||'').trim().toLowerCase()==='view rewards'){
      b.addEventListener('click', function(e){ goClaimRewards(e); });
    }
  });

  var rcClose=document.getElementById('rc-close');
  var rcOv=document.getElementById('rc-overlay');
  if(rcClose) rcClose.addEventListener('click', closeReadyClaim);
  if(rcOv) rcOv.addEventListener('click', function(e){ if(e.target===rcOv) closeReadyClaim(); });
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape') closeReadyClaim();
  });

  document.querySelectorAll('[data-claim]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var row=btn.closest('.rc-row');
      if(!row || row.classList.contains('is-claimed')) return;
      row.classList.add('is-claimed');
      btn.textContent='Claimed';
      btn.disabled=true;
      var pop=document.getElementById('claim-count');
      if(pop){
        var n=Math.max(0,(+pop.textContent||0)-1);
        pop.textContent=String(n);
        if(n<=0){
          var fab=document.getElementById('claim');
          if(fab) fab.style.display='none';
        }
      }
    });
  });
`;

const oldStart = html.indexOf("  function goClaimRewards(){");
const oldEnd = html.indexOf("  document.querySelectorAll('[onclick*=\"scrollIntoView\"]')");
if (oldStart < 0 || oldEnd < 0) throw new Error("claim js markers missing");
html = html.slice(0, oldStart) + newJs + "\n" + html.slice(oldEnd);

fs.writeFileSync(PAGE, html);
console.log("patched", html.length);
