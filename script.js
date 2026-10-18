/* ======= YAHAN APNA DATA BADLO ======= */
const CONFIG = {
  shopName:  "IQBAAL CHICKEN SHOP",
  friendName:"The Iqbal",                  // dost ka naam
  friendPhoto:"friend.jpg",                // photo ka naam (same folder me rakho)
  message:   "🎁 Tere liye ek chhota sa gift — tap karke murgiyon ko hasao!"
};
/* ===================================== */

const $ = id => document.getElementById(id);
const scene = $('scene'), ground = $('ground');
$('shopName').textContent = CONFIG.shopName;
$('friendTag').textContent = CONFIG.friendName;
$('msg').textContent = CONFIG.message;

function setPhoto(src){
  const ph = $('ph');
  ph.style.backgroundImage = `url("${src}")`;
  ph.textContent = '';
}
if (CONFIG.friendPhoto) setPhoto(CONFIG.friendPhoto);
$('frameBox').addEventListener('click', () => { if(!CONFIG.friendPhoto) $('photoInput').click(); else burst(); });
$('photoInput').addEventListener('change', e => {
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader(); r.onload = () => { setPhoto(r.result); burst(); }; r.readAsDataURL(f);
});

/* ---- sound ---- */
let ac;
function cluck(){
  try{
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const t = ac.currentTime;
    [0, .12, .24].forEach((d,i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(520 + i*60, t+d);
      o.frequency.exponentialRampToValueAtTime(260, t+d+.09);
      g.gain.setValueAtTime(.08, t+d); g.gain.exponentialRampToValueAtTime(.001, t+d+.1);
      o.connect(g).connect(ac.destination); o.start(t+d); o.stop(t+d+.11);
    });
  }catch(e){}
}

/* ---- feathers ---- */
function burst(){
  for(let i=0;i<22;i++){
    const f = document.createElement('div');
    f.className = 'feather';
    f.textContent = ['🪶','✨','🍗','❤️'][i%4];
    f.style.left = Math.random()*100 + 'vw';
    f.style.animationDuration = (2.5 + Math.random()*2.5) + 's';
    f.style.animationDelay = Math.random()*.6 + 's';
    scene.appendChild(f);
    setTimeout(() => f.remove(), 6000);
  }
}

/* ---- hens ---- */
const palette = [
  {c:'#ffffff', w:'#eceff1'}, {c:'#c77c3b', w:'#a5622a'}, {c:'#f5f5f5', w:'#cfd8dc'},
  {c:'#8d5a2b', w:'#6d4320'}, {c:'#ffe082', w:'#ffca28'}, {c:'#e0a458', w:'#c98a3a'}
];
const lines = ['Cluck! 🐔','Kok kok!','Mujhe mat kha 😭','Iqbaal bhai! 🥹','Dana do 🌾','Party kab? 🎉'];
const hens = [];
function spawn(i){
  const p = palette[i % palette.length];
  const el = document.createElement('div');
  el.className = 'hen';
  el.innerHTML = `<div class="in"><svg viewBox="0 0 100 100" style="--c:${p.c};--w:${p.w}"><use href="#chicken"/></svg></div>`;
  const h = { el, x: Math.random()*(innerWidth-80), dir: Math.random()<.5?-1:1, v: .4 + Math.random()*.7, y: 6 + Math.random()*55, pause:0 };
  el.style.bottom = h.y + '%';
  el.style.zIndex = Math.round(100 - h.y);
  el.addEventListener('click', ev => {
    ev.stopPropagation(); cluck();
    el.classList.remove('jump'); void el.offsetWidth; el.classList.add('jump');
    const s = document.createElement('div'); s.className = 'say'; s.textContent = lines[Math.floor(Math.random()*lines.length)];
    el.appendChild(s); setTimeout(() => s.remove(), 1200);
    if(Math.random()<.5) burst();
  });
  ground.appendChild(el); hens.push(h);
}
for(let i=0;i<7;i++) spawn(i);

function tick(){
  const W = innerWidth - 74;
  hens.forEach(h => {
    if(h.pause > 0){ h.pause--; h.el.firstChild.firstChild.style.animationPlayState='paused'; }
    else{
      h.el.firstChild.firstChild.style.animationPlayState='running';
      h.x += h.dir * h.v;
      if(h.x < 0){ h.x = 0; h.dir = 1; } else if(h.x > W){ h.x = W; h.dir = -1; }
      if(Math.random() < .004){ h.pause = 60 + Math.random()*90; }
      if(Math.random() < .003){ h.dir *= -1; }
    }
    h.el.style.transform = `translateX(${h.x}px)`;
    h.el.firstChild.style.transform = `scaleX(${h.dir})`;
  });
  requestAnimationFrame(tick);
}

/* ---- start ---- */
$('tapBtn').addEventListener('click', () => {
  cluck();
  $('intro').classList.add('gone');
  scene.classList.add('show');
  setTimeout(burst, 900);
  tick();
});