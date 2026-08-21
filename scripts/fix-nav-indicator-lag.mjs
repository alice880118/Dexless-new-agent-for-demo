import fs from "fs";

const p = "public/rewards/page.html";
let h = fs.readFileSync(p, "utf8");
const start = h.indexOf("(function(){\n  var pill=document.querySelector('.navpill')");
const end = h.indexOf("})();\n</script>\n<script>\n(function(){\n  var MQ=");
if (start < 0 || end < 0) {
  console.error("markers", start, end);
  process.exit(1);
}

const neu = `(function(){
  var pill=document.querySelector('.navpill');
  if(!pill) return;
  var links=[].slice.call(pill.querySelectorAll('a'));
  var ind=pill.querySelector('.nav-indicator');
  if(!ind){
    ind=document.createElement('span');
    ind.className='nav-indicator';
    pill.insertBefore(ind, pill.firstChild);
  }

  var lastIdx=-1, spyLock=false, spyUnlockTimer=0, ready=false;

  function measure(el){
    if(!el) return null;
    var pr=pill.getBoundingClientRect();
    var r=el.getBoundingClientRect();
    return {x:r.left-pr.left+pill.scrollLeft, w:r.width};
  }
  function active(){ return pill.querySelector('a.on') || links[0]; }

  function moveTo(el, instant){
    var m=measure(el);
    if(!m) return;
    if(instant || !ready){
      ind.classList.add('no-anim');
      ind.style.width=m.w+'px';
      ind.style.transform='translate3d('+m.x+'px,0,0)';
      void ind.offsetWidth;
      ind.classList.remove('no-anim');
      ready=true;
      return;
    }
    ind.style.width=m.w+'px';
    ind.style.transform='translate3d('+m.x+'px,0,0)';
  }

  function lockSpy(ms){
    spyLock=true;
    clearTimeout(spyUnlockTimer);
    spyUnlockTimer=setTimeout(function(){ spyLock=false; }, ms||700);
  }

  moveTo(active(), true);
  window.addEventListener('resize', function(){ moveTo(active(), true); }, {passive:true});

  function syncFromScroll(){
    if(spyLock) return;
    if(window.matchMedia('(max-width:767px)').matches) return;
    var secs=links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
    var y=window.scrollY+220, idx=0;
    secs.forEach(function(s,i){ if(s && s.offsetTop<=y) idx=i; });
    if(idx===lastIdx) return;
    lastIdx=idx;
    links.forEach(function(a,i){ a.classList.toggle('on', i===idx); });
    moveTo(links[idx], false);
  }

  var scrollQueued=false;
  window.addEventListener('scroll', function(){
    if(scrollQueued || spyLock) return;
    scrollQueued=true;
    requestAnimationFrame(function(){ scrollQueued=false; syncFromScroll(); });
  },{passive:true});

  links.forEach(function(a){
    a.addEventListener('click', function(){
      links.forEach(function(x){ x.classList.remove('on'); });
      a.classList.add('on');
      lastIdx=links.indexOf(a);
      lockSpy(800);
      requestAnimationFrame(function(){ moveTo(a, false); });
    });
    a.addEventListener('rw-activate', function(){
      lastIdx=links.indexOf(a);
      lockSpy(400);
      requestAnimationFrame(function(){ moveTo(a, false); });
    });
  });
})();
`;

h = h.slice(0, start) + neu + h.slice(end);
fs.writeFileSync(p, h);
console.log("nav indicator fixed");
