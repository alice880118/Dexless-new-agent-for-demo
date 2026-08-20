import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

// 1) Lucky Wheel blades
const ART = `{
    purple:['/rewards/blades/blade-2.png', 0, 300, 270],
    green :['/rewards/blades/blade-1.png', 0, 300, 270],
    teal  :['/rewards/blades/blade-3.png', 0, 300, 270],
    pink  :['/rewards/blades/blade-5.png', 0, 300, 270],
    tan   :['/rewards/blades/blade-6.png', 0, 300, 270],
    yellow:['/rewards/blades/blade-7.png', 0, 300, 270],
    blue  :['/rewards/blades/blade-4.png', 0, 300, 270]
  }`;
html = html.replace(/var ART=\{[\s\S]*?\};\s*\/\* clockwise/, `var ART=${ART};\n  /* clockwise`);

// 2) Podium motion
if (!html.includes("podFloatA")) {
  html = html.replace(
    "/* ===== podium ===== */",
    `/* ===== podium motion ===== */
.pod{transition:transform .55s cubic-bezier(.22,.61,.36,1), filter .55s cubic-bezier(.22,.61,.36,1); transform-origin:50% 85%; will-change:transform; cursor:pointer}
.pod:nth-child(1){animation:podFloatA 4.6s ease-in-out infinite}
.pod:nth-child(2){animation:podFloatB 4.2s ease-in-out infinite}
.pod:nth-child(3){animation:podFloatC 5s ease-in-out infinite}
@keyframes podFloatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes podFloatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes podFloatC{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.pod:hover{animation-play-state:paused; transform:translateY(-14px) scale(1.04); filter:drop-shadow(0 18px 28px rgba(201,189,255,.28))}
.pod:hover .pod-img{transform:translate(-50%,-50%) scale(1.05)}
.pod-img{transition:transform .55s cubic-bezier(.22,.61,.36,1)}
/* ===== podium ===== */`,
  );
}

// 3) Claim popup
html = html.replace(
  /\\.claim\\{position:fixed;right:40px;top:50%;transform:translateY\\(-50%\\);width:181px;height:272px;z-index:90;\\s*animation:claimIn \\.9s var\\(--ease\\) 1\\.1s both\\}\\s*@keyframes claimIn\\{from\\{opacity:0;transform:translateY\\(-50%\\) translateX\\(40px\\)\\}to\\{opacity:1;transform:translateY\\(-50%\\) translateX\\(0\\)\\}\\}/,
  `.claim{position:fixed;right:40px;top:108px;transform:none;width:181px;height:272px;z-index:90;
  animation:claimIn 1.05s cubic-bezier(.22,.61,.36,1) 1.1s both}
@keyframes claimIn{from{opacity:0;transform:translate3d(36px,12px,0)}to{opacity:1;transform:translate3d(0,0,0)}}`,
);

// fallback simpler claim replace
if (html.includes("top:50%;transform:translateY(-50%)") && html.includes(".claim{")) {
  html = html.replace(
    ".claim{position:fixed;right:40px;top:50%;transform:translateY(-50%);width:181px;height:272px;z-index:90;\n  animation:claimIn .9s var(--ease) 1.1s both}",
    ".claim{position:fixed;right:40px;top:108px;transform:none;width:181px;height:272px;z-index:90;\n  animation:claimIn 1.05s cubic-bezier(.22,.61,.36,1) 1.1s both}",
  );
  html = html.replace(
    "@keyframes claimIn{from{opacity:0;transform:translateY(-50%) translateX(40px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}",
    "@keyframes claimIn{from{opacity:0;transform:translate3d(36px,12px,0)}to{opacity:1;transform:translate3d(0,0,0)}}",
  );
}

html = html.replace(
  `.claim-gift{width:127px;height:127px;object-fit:contain;background:transparent;transition:transform .55s var(--ease),filter .55s var(--ease);
  animation:giftFloat 5s ease-in-out infinite}
.claim-card:hover .claim-gift{animation:none;transform:rotate(10deg) scale(1.07);filter:drop-shadow(0 0 18px rgba(201,189,255,.55))}
@keyframes giftFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`,
  `.claim-gift{width:127px;height:127px;object-fit:contain;background:transparent;transition:transform .85s cubic-bezier(.22,.61,.36,1),filter .85s cubic-bezier(.22,.61,.36,1);
  animation:giftFloat 5.5s cubic-bezier(.45,.05,.55,.95) infinite; transform-origin:50% 70%}
.claim-card:hover .claim-gift{animation:none;transform:rotate(5deg) scale(1.04);filter:drop-shadow(0 0 18px rgba(201,189,255,.45))}
@keyframes giftFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(5deg)}}`,
);

// trophy CSS — rAF owns transform
html = html.replace(
  `.trophy-wrap{transform-origin:50% 70%;cursor:pointer;will-change:transform;transition:transform .35s cubic-bezier(.22,.61,.36,1)}
.trophy-wrap.is-floating{animation:trophyFloat 3.2s ease-in-out infinite}
.trophy-wrap.is-tilting{animation:none}`,
  `.trophy-wrap{transform-origin:50% 70%;cursor:pointer;will-change:transform}
.trophy-wrap.is-floating,.trophy-wrap.is-tilting{animation:none}`,
);

html = html.replace(
  `.navpill .nav-indicator{
  position:absolute;top:12px;left:0;height:calc(100% - 24px);
  border-radius:999px;background:#fff;z-index:0;
  transition:transform .45s cubic-bezier(.22,.61,.36,1), width .45s cubic-bezier(.22,.61,.36,1);
  pointer-events:none;
}`,
  `.navpill .nav-indicator{
  position:absolute;top:12px;left:0;height:calc(100% - 24px);
  border-radius:999px;background:#fff;z-index:0;
  pointer-events:none; will-change:transform,width;
}`,
);

html = html.replace(
  `  var links=[].slice.call(document.querySelectorAll('.navpill a'));
  var secs=links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  window.addEventListener('scroll',function(){
    var y=window.scrollY+220, idx=0;
    secs.forEach(function(s,i){ if(s && s.offsetTop<=y) idx=i; });
    links.forEach(function(a,i){ a.classList.toggle('on', i===idx); });
  },{passive:true});`,
  `  /* nav scroll spy handled by sliding-indicator script */`,
);

const marker = "<script>\n(function(){\n  var hero=document.querySelector('.hero');";
const idx = html.lastIndexOf(marker);
if (idx < 0) {
  console.error("hero script marker missing");
  process.exit(1);
}

const newScripts = `<script>
(function(){
  var hero=document.querySelector('.hero');
  var wrap=document.querySelector('.trophy-wrap');
  if(!hero||!wrap) return;

  var target={tx:0,ty:0,rx:0,ry:0,tz:0};
  var cur={tx:0,ty:0,rx:0,ry:0,tz:0};
  var hovering=false;
  var floatT=0;

  wrap.classList.add('is-floating');
  wrap.style.transition='none';
  wrap.style.willChange='transform';

  function lerp(a,b,t){ return a+(b-a)*t; }

  function tick(now){
    requestAnimationFrame(tick);
    floatT=now*0.001;
    var floatY = hovering ? 0 : Math.sin(floatT*Math.PI*2/3.2)*-10;
    var ease = hovering ? 0.12 : 0.075;
    cur.tx=lerp(cur.tx, target.tx, ease);
    cur.ty=lerp(cur.ty, target.ty + floatY, ease);
    cur.rx=lerp(cur.rx, target.rx, ease);
    cur.ry=lerp(cur.ry, target.ry, ease);
    cur.tz=lerp(cur.tz, target.tz, ease);
    wrap.style.transform='perspective(900px) translate3d('+cur.tx.toFixed(2)+'px,'+cur.ty.toFixed(2)+'px,'+cur.tz.toFixed(2)+'px) rotateX('+cur.rx.toFixed(2)+'deg) rotateY('+cur.ry.toFixed(2)+'deg)';
  }
  requestAnimationFrame(tick);

  function onMove(e){
    hovering=true;
    wrap.classList.remove('is-floating');
    wrap.classList.add('is-tilting');
    var r=hero.getBoundingClientRect();
    var cx=r.left+r.width/2;
    var cy=r.top+r.height*0.55;
    var dx=(e.clientX-cx)/r.width;
    var dy=(e.clientY-cy)/r.height;
    target.ry=Math.max(-12, Math.min(12, -dx*18));
    target.rx=Math.max(-10, Math.min(10, dy*14));
    target.tx=Math.max(-14, Math.min(14, -dx*22));
    target.ty=Math.max(-10, Math.min(10, -dy*16));
    target.tz=28;
  }
  function onLeave(){
    hovering=false;
    wrap.classList.remove('is-tilting');
    wrap.classList.add('is-floating');
    target.tx=0; target.ty=0; target.rx=0; target.ry=0; target.tz=0;
  }
  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', onLeave);
})();

(function(){
  var pill=document.querySelector('.navpill');
  if(!pill) return;
  var links=[].slice.call(pill.querySelectorAll('a'));
  var ind=pill.querySelector('.nav-indicator');
  if(!ind){
    ind=document.createElement('span');
    ind.className='nav-indicator';
    pill.insertBefore(ind, pill.firstChild);
  }

  var curX=0, curW=0, tarX=0, tarW=0, ready=false, lastIdx=-1;
  ind.style.transition='none';

  function measure(el){
    if(!el) return null;
    var pr=pill.getBoundingClientRect();
    var r=el.getBoundingClientRect();
    return {x:r.left-pr.left, w:r.width};
  }
  function active(){ return pill.querySelector('a.on') || links[0]; }

  function setTarget(el){
    var m=measure(el);
    if(!m) return;
    tarX=m.x; tarW=m.w;
    if(!ready){
      curX=tarX; curW=tarW; ready=true;
      ind.style.width=curW+'px';
      ind.style.transform='translate3d('+curX+'px,0,0)';
    }
  }

  function tick(){
    requestAnimationFrame(tick);
    curX += (tarX-curX)*0.18;
    curW += (tarW-curW)*0.18;
    if(Math.abs(tarX-curX)<0.2 && Math.abs(tarW-curW)<0.2){ curX=tarX; curW=tarW; }
    ind.style.width=curW+'px';
    ind.style.transform='translate3d('+curX+'px,0,0)';
  }
  requestAnimationFrame(tick);
  setTarget(active());
  window.addEventListener('resize', function(){ setTarget(active()); });

  function syncFromScroll(){
    var secs=links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
    var y=window.scrollY+220, idx=0;
    secs.forEach(function(s,i){ if(s && s.offsetTop<=y) idx=i; });
    if(idx===lastIdx) return;
    lastIdx=idx;
    links.forEach(function(a,i){ a.classList.toggle('on', i===idx); });
    setTarget(links[idx]);
  }

  var scrollQueued=false;
  window.addEventListener('scroll', function(){
    if(scrollQueued) return;
    scrollQueued=true;
    requestAnimationFrame(function(){ scrollQueued=false; syncFromScroll(); });
  },{passive:true});

  links.forEach(function(a){
    a.addEventListener('click', function(){
      links.forEach(function(x){ x.classList.remove('on'); });
      a.classList.add('on');
      lastIdx=links.indexOf(a);
      setTarget(a);
    });
  });
})();
</script>
</body>
</html>`;

html = html.slice(0, idx) + newScripts;
fs.writeFileSync(p, html);

console.log({
  blades: html.includes("/rewards/blades/blade-1.png"),
  pod: html.includes("podFloatA"),
  claimTop: html.includes("top:108px"),
  rot5: html.includes("rotate(5deg)"),
  trophyLerp: html.includes("ease = hovering"),
  navRaf: html.includes("curX += (tarX-curX)"),
});
