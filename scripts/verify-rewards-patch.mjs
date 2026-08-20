import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

/* Guard scroll-spy on mobile so panel mode owns .on state */
if (!html.includes("if(window.matchMedia('(max-width:767px)').matches) return; /* mobile panels */")) {
  html = html.replace(
    "requestAnimationFrame(function(){ scrollQueued=false; syncFromScroll(); });",
    "requestAnimationFrame(function(){ scrollQueued=false; if(window.matchMedia('(max-width:767px)').matches) return; /* mobile panels */ syncFromScroll(); });",
  );
}

fs.writeFileSync(p, html);

const checks = {
  cup: html.includes('/rewards/cup.png'),
  viewport: html.includes("device-width"),
  art0: html.includes("purple:['/rewards/blades/purple.svg', 0, 260.988, 226.248]"),
  artAll0: (html.match(/blades\/\w+\.svg', 0, 260\.988, 226\.248/g) || []).length,
  stageWrap: html.includes("stage-wrap"),
  fitStage: html.includes("function fitStage"),
  showPanel: html.includes("function showPanel"),
  mobilePanel: html.includes(".rw-panel{display:none!important"),
  scrollGuard: html.includes("mobile panels"),
};
console.log(checks);
