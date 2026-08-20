import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

const stageBlock = `  <!-- wheel stage -->
  <div class="stage">
    <div class="wheel" id="wheel-rot"></div>
    <div class="fade"></div>
    <div class="pointer">
      <img src="https://www.figma.com/api/mcp/asset/54e000f6-fed8-4a0f-a53d-fe8de6ac5791.svg" style="width:69px;height:69px">
    </div>
    <button class="btn btn-p spin-btn" id="spin-btn">Spin now</button>
    <p class="spin-cap">Use <b id="spin-use">1</b> of your <b id="spin-left">3</b> available spins</p>
    <div class="win" id="win"></div>
  </div>`;

const stageWrapped = `  <!-- wheel stage -->
  <div class="stage-wrap">
  <div class="stage">
    <div class="wheel" id="wheel-rot"></div>
    <div class="fade"></div>
    <div class="pointer">
      <img src="https://www.figma.com/api/mcp/asset/54e000f6-fed8-4a0f-a53d-fe8de6ac5791.svg" style="width:69px;height:69px">
    </div>
    <button class="btn btn-p spin-btn" id="spin-btn">Spin now</button>
    <p class="spin-cap">Use <b id="spin-use">1</b> of your <b id="spin-left">3</b> available spins</p>
    <div class="win" id="win"></div>
  </div>
  </div><!-- /stage-wrap -->`;

if (!html.includes("stage-wrap")) {
  if (!html.includes(stageBlock)) {
    console.error("stage block not found exactly");
    process.exit(1);
  }
  html = html.replace(stageBlock, stageWrapped);
}

const stageCss = `/* stage responsive scale */
.stage-wrap{width:100%;max-width:1434px;aspect-ratio:1434/650;overflow:hidden;position:relative;margin:0 auto}
.stage{width:1434px!important;height:650px!important;max-width:none!important;min-height:0!important;aspect-ratio:auto!important;transform-origin:top left}
`;

if (!html.includes(".stage-wrap{")) {
  html = html.replace(
    "/* ===== LUCKY WHEEL ===== */",
    `${stageCss}\n/* ===== LUCKY WHEEL ===== */`,
  );
}

/* Override earlier RWD that forced stage width:100% height:auto */
html = html.replace(
  ".card-today,.mini,.tablecard,.infocard,.stage{width:100%!important;max-width:1434px}",
  ".card-today,.mini,.tablecard,.infocard,.stage-wrap{width:100%!important;max-width:1434px}",
);
html = html.replace(
  ".stage{height:auto!important;min-height:420px;aspect-ratio:1434/650}",
  ".stage-wrap{height:auto!important;min-height:220px}",
);

if (!html.includes("/* mobile stage scale */")) {
  html = html.replace(
    "  #today.rw-panel{width:100%}\n}",
    `  #today.rw-panel{width:100%}
  /* mobile stage scale */
  .stage-wrap{width:calc(100% - 16px);border-radius:12px}
  #wheel{gap:28px!important}
  #wheel > div[style*="1434px"]{width:100%!important;max-width:100%}
  .pz-card{flex:1 1 140px}
}
`,
  );
}

if (!html.includes("function fitStage")) {
  const needle = `  MQ.addEventListener('change', onMode);
  onMode();
})();`;
  const insert = `  MQ.addEventListener('change', onMode);
  onMode();

  function fitStage(){
    var wrap=document.querySelector('.stage-wrap');
    var stage=document.querySelector('.stage');
    if(!wrap||!stage) return;
    var s=wrap.clientWidth/1434;
    stage.style.transform='scale('+s+')';
  }
  fitStage();
  window.addEventListener('resize', fitStage, {passive:true});

  document.querySelectorAll('[onclick*="scrollIntoView"]').forEach(function(el){
    el.addEventListener('click', function(e){
      if(!MQ.matches) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      var m=(el.getAttribute('onclick')||'').match(/getElementById\\('([^']+)'\\)/);
      if(m) showPanel('#'+m[1]);
    }, true);
  });
})();`;
  if (!html.includes(needle)) {
    console.error("onMode tail not found");
    process.exit(1);
  }
  html = html.replace(needle, insert);
}

fs.writeFileSync(p, html);
console.log({
  wrap: html.includes("stage-wrap"),
  fit: html.includes("function fitStage"),
  css: html.includes(".stage-wrap{width:100%"),
});
