import fs from "fs";

const p = "D:/Alice/git/0727_nav/public/rewards/page.html";
let html = fs.readFileSync(p, "utf8");

// 1) named block images
html = html.replace(
  '<img class="bg" src="/rewards/gift-phone.png">',
  '<img class="bg" src="/rewards/unlock-draw.png">',
);
html = html.replace(
  'src="/rewards/hero-banner.png"',
  'src="/rewards/win-iphone.png"',
);
html = html.replace(
  'src="/rewards/starter.png"',
  'src="/rewards/starter-badge.png"',
);
html = html.replace(
  'src="/rewards/first-trade-gift.png"',
  'src="/rewards/popup-gift.png"',
);

// 2) trophy motion CSS — float default; no wiggle hover
const oldTrophyCss = `/* trophy motion */
@keyframes trophyFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes trophyWiggle{0%{transform:rotate(0deg)}20%{transform:rotate(-10deg)}40%{transform:rotate(10deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(6deg)}100%{transform:rotate(0deg)}}
.trophy-wrap{animation:trophyFloat 3.2s ease-in-out infinite;transform-origin:50% 80%;cursor:pointer}
.trophy-wrap .trophy-img{transform-origin:50% 80%;display:block}
.trophy-wrap.enter .trophy-img,.trophy-wrap:hover .trophy-img{animation:trophyWiggle .7s ease}
.trophy-wrap:hover{animation-play-state:paused}
body{min-width:0!important;overflow-x:auto}
.page{align-items:center}`;

const newTrophyCss = `/* trophy motion */
@keyframes trophyFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-10px,0)}}
.trophy-wrap{transform-origin:50% 70%;cursor:pointer;will-change:transform;transition:transform .35s cubic-bezier(.22,.61,.36,1)}
.trophy-wrap.is-floating{animation:trophyFloat 3.2s ease-in-out infinite}
.trophy-wrap.is-tilting{animation:none}
.trophy-wrap .trophy-img{display:block;width:406px;height:477px;object-fit:contain;object-position:bottom;background:transparent;mix-blend-mode:normal;-webkit-mask-image:none}
.hero{isolation:isolate}
body{min-width:0!important;overflow-x:auto}
.page{align-items:center}

/* sliding nav pill */
.navpill{position:relative}
.navpill .nav-indicator{
  position:absolute;top:12px;left:0;height:calc(100% - 24px);
  border-radius:999px;background:#fff;z-index:0;
  transition:transform .45s cubic-bezier(.22,.61,.36,1), width .45s cubic-bezier(.22,.61,.36,1);
  pointer-events:none;
}
.navpill a{position:relative;z-index:1;background:transparent!important}
.navpill a.on{color:#000;font-weight:600}
.navpill a:hover{color:#fff;background:transparent!important;transform:none}
.navpill a.on:hover{color:#000}`;

if (!html.includes(oldTrophyCss)) {
  console.warn("old trophy css block not exact — trying loose replace");
  html = html.replace(
    /\/\* trophy motion \*\/[\s\S]*?\.page\{align-items:center\}/,
    newTrophyCss,
  );
} else {
  html = html.replace(oldTrophyCss, newTrophyCss);
}

// Replace enter-only trophy script with 3D tilt + sliding nav
const oldEnter = `<script>
(function(){
  var t=document.querySelector('.trophy-wrap');
  if(!t) return;
  t.classList.add('enter');
  setTimeout(function(){ t.classList.remove('enter'); }, 800);
})();
</script>`;

const newInteract = `<script>
(function(){
  var hero=document.querySelector('.hero');
  var wrap=document.querySelector('.trophy-wrap');
  if(!hero||!wrap) return;
  wrap.classList.add('is-floating');

  function onMove(e){
    var r=hero.getBoundingClientRect();
    var cx=r.left+r.width/2;
    var cy=r.top+r.height*0.55;
    var dx=(e.clientX-cx)/r.width;
    var dy=(e.clientY-cy)/r.height;
    var rotY=Math.max(-12, Math.min(12, -dx*18));
    var rotX=Math.max(-10, Math.min(10, dy*14));
    var tx=Math.max(-14, Math.min(14, -dx*22));
    var ty=Math.max(-10, Math.min(10, -dy*16));
    wrap.classList.remove('is-floating');
    wrap.classList.add('is-tilting');
    wrap.style.transform='perspective(900px) translate3d('+tx+'px,'+ty+'px,28px) rotateX('+rotX+'deg) rotateY('+rotY+'deg)';
  }
  function onLeave(){
    wrap.classList.remove('is-tilting');
    wrap.style.transform='';
    wrap.classList.add('is-floating');
  }
  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', onLeave);
})();

(function(){
  var pill=document.querySelector('.navpill');
  if(!pill) return;
  var links=[].slice.call(pill.querySelectorAll('a'));
  var ind=document.createElement('span');
  ind.className='nav-indicator';
  pill.insertBefore(ind, pill.firstChild);

  function moveTo(el){
    if(!el) return;
    var pr=pill.getBoundingClientRect();
    var r=el.getBoundingClientRect();
    ind.style.width=r.width+'px';
    ind.style.transform='translateX('+(r.left-pr.left)+'px)';
  }
  function active(){ return pill.querySelector('a.on') || links[0]; }

  moveTo(active());
  window.addEventListener('load', function(){ moveTo(active()); });
  window.addEventListener('resize', function(){ moveTo(active()); });

  links.forEach(function(a){
    a.addEventListener('click', function(){
      links.forEach(function(x){ x.classList.remove('on'); });
      a.classList.add('on');
      moveTo(a);
    });
  });

  // hook existing scroll spy: observe class changes
  var obs=new MutationObserver(function(){ moveTo(active()); });
  links.forEach(function(a){ obs.observe(a,{attributes:true,attributeFilter:['class']}); });
})();
</script>`;

if (html.includes(oldEnter)) {
  html = html.replace(oldEnter, newInteract);
} else {
  html = html.replace("</body>", newInteract + "\n</body>");
}

fs.writeFileSync(p, html);
console.log("patched", p);
console.log("unlock", html.includes("/rewards/unlock-draw.png"));
console.log("win", html.includes("/rewards/win-iphone.png"));
console.log("starter-badge", html.includes("/rewards/starter-badge.png"));
console.log("popup", html.includes("/rewards/popup-gift.png"));
console.log("indicator", html.includes("nav-indicator"));
console.log("is-floating", html.includes("is-floating"));
