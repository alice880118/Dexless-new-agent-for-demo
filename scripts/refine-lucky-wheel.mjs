import fs from "fs";
const PAGE = "public/rewards/page.html";
let html = fs.readFileSync(PAGE, "utf8");

// Fix prize build: no counter-rotate (stays in wedge); prizes spin with wheel
html = html.replace(
  /html\+='<div class="lw-seg" style="transform:rotate\('\+ang\+'deg\)">'\+[\s\S]*?'<\/div>'\+\s*'<\/div>';/,
  `html+='<div class="lw-seg" style="transform:rotate('+ang+'deg)">'+
      '<img class="lw-blade" src="'+p.blade+'" alt="">'+
      '<div class="lw-prize">'+
        '<img src="'+p.img+'" alt="">'+
        '<p class="lw-pt">'+p.title+'</p>'+
        '<p class="lw-ps">'+p.sub+'</p>'+
      '</div>'+
    '</div>';`
);

// Improve win overlay + prize position CSS
html = html.replace(
  `.lw-prize{
  position:absolute;left:50%;top:92px;width:170px;margin-left:-85px;
  display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;
  transform-origin:50% 331px
}`,
  `.lw-prize{
  position:absolute;left:50%;top:78px;width:170px;margin-left:-85px;
  display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center
}`
);

html = html.replace(
  `.lw-win{
  display:none;flex-direction:column;align-items:center;gap:12px;
  width:min(420px,92%);padding:28px 24px;border-radius:20px;
  border:1px solid rgba(201,189,255,.55);background:rgba(0,0,0,.82);
  box-shadow:0 0 40px rgba(219,253,92,.18);text-align:center;z-index:20
}
.lw-win.show{display:flex;animation:lwWinIn .45s cubic-bezier(.22,.61,.36,1) both}`,
  `.lw-win{
  position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
  display:none;flex-direction:column;align-items:center;gap:12px;
  width:min(420px,92%);padding:28px 24px;border-radius:20px;
  border:1px solid rgba(201,189,255,.55);background:rgba(0,0,0,.9);
  box-shadow:0 0 40px rgba(219,253,92,.22);text-align:center;z-index:200
}
.lw-win.show{display:flex;animation:lwWinIn .45s cubic-bezier(.22,.61,.36,1) both}`
);

// Desktop-only absolute layout note: on mobile scale stage with transform
html = html.replace(
  `@media (max-width:767px){
  .lw-stage{width:100%;height:auto;aspect-ratio:1434/1080;transform:none}
  .lw-stage > *{transform-origin:top left}
  /* scale via font-size trick avoided; use zoom-like width 100% with absolute children in % */
}`,
  `@media (max-width:767px){
  .lw-stage{
    width:100%;height:0;padding-bottom:75.3%; /* 1080/1434 */
    overflow:hidden
  }
  .lw-stage-inner-scale{display:none}
  #lw-stage{transform:scale(calc(100vw / 1434));transform-origin:top left;height:1080px;padding-bottom:0;width:1434px}
}`
);

fs.writeFileSync(PAGE, html);
console.log("refined");
console.log("prize pool?", html.includes("Prize pool"));
console.log("earn more?", html.includes("Earn more spins"));
console.log("SPIN cta?", html.includes("lw-cta-label"));
