/* Shared helpers for the SFF AI booths.
   Volunteers: change the secret code words here if you want new ones each day. */
const CODES = {
  pose:     "SKYBIRD",
  trash:    "RECYCLE",
  word:     "NEXTWORD",
  liar:     "FACTCHECK",
  stranger: "SAFEHERO",
  realai:   "SHARPEYES"
};

/* Shown on the menu and every win screen. Change the contact line to your page, phone or website. */
const BRAND = {
  contact: ""   // e.g. "📘 Facebook: CIY Club Myanmar  ·  📞 09-xxx xxx xxx"
};

const COMMON_T = {
  promo:     { en: "🚀 Want to build AI like this yourself? Learn with <b>CIY Club Myanmar</b> & <b>ScopeIT Education</b>!",
               my: "🚀 ဒီလို AI ကို ကိုယ်တိုင် တည်ဆောက်ချင်လား? <b>CIY Club Myanmar</b> နဲ့ <b>ScopeIT Education</b> မှာ လာသင်ပါ!" },
  credit:    { en: "Created by Coach Penny", my: "ဖန်တီးသူ - Coach Penny" },
  home:      { en: "⬅ All games", my: "⬅ ဂိမ်းအားလုံး" },
  mission:   { en: "MISSION", my: "မစ်ရှင်" },
  winTitle:  { en: "Mission complete!", my: "မစ်ရှင် အောင်မြင်ပါပြီ!" },
  codeLabel: { en: "Show this secret code to your coach", my: "ဒီလျှို့ဝှက်ကုဒ်ကို Coach ကို ပြပါ" },
  next:      { en: "Next player ▶", my: "နောက်ကစားသူ ▶" },
  learned:   { en: "What you found out", my: "သင်သိလိုက်ရတာ" }
};

let LANG = "my";
try { LANG = localStorage.getItem("sff-lang") || "my"; } catch (e) {}

function t(dict, key) {
  const item = (dict && dict[key]) || COMMON_T[key];
  if (!item) return key;
  return item[LANG] || item.en;
}
/* Pick from a {en,my} object directly */
function L(obj) { return obj ? (obj[LANG] || obj.en) : ""; }

/* Fill every element that has data-t="key" */
function applyLang(dict) {
  document.body.dataset.lang = LANG;
  document.documentElement.lang = LANG === "my" ? "my" : "en";
  document.querySelectorAll("[data-t]").forEach(el => { el.innerHTML = t(dict, el.dataset.t); });
  document.querySelectorAll(".lang button").forEach(b => b.classList.toggle("on", b.dataset.l === LANG));
}

function setLang(l, dict, onChange) {
  LANG = l;
  try { localStorage.setItem("sff-lang", l); } catch (e) {}
  applyLang(dict);
  if (onChange) onChange();
}

/* Top bar with home link + title + language switch */
function buildTopbar(dict, titleKey, onChange) {
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `
    <a class="home" href="index.html" data-t="home"></a>
    <h1 data-t="${titleKey}"></h1>
    <div class="lang"><button data-l="my">မြန်မာ</button><button data-l="en">English</button></div>`;
  document.body.prepend(bar);
  bar.querySelectorAll(".lang button").forEach(b => b.onclick = () => setLang(b.dataset.l, dict, onChange));
  sprinklePixels();
  const cr = document.createElement("div");
  cr.className = "credit";
  cr.innerHTML = `<span data-t="credit"></span> · CIY Club Myanmar × ScopeIT Education`;
  document.body.appendChild(cr);
  applyLang(dict);
}

/* Coloured pixel squares in the corners */
function sprinklePixels() {
  const colours = ["#1D2766", "#E5307A", "#22AED6", "#FFFDF5", "#F28C28", "#3A4590"];
  const spots = [
    { s: "left:0;bottom:0", n: 10 }, { s: "right:0;bottom:0", n: 10 }
  ];
  spots.forEach(sp => {
    const box = document.createElement("div");
    box.className = "pixels";
    box.style.cssText = sp.s + ";width:110px;height:90px";
    for (let i = 0; i < sp.n; i++) {
      const p = document.createElement("i");
      p.style.left = (Math.floor(Math.random() * 6) * 18) + "px";
      p.style.top = (Math.floor(Math.random() * 5) * 18) + "px";
      p.style.background = colours[i % colours.length];
      p.style.opacity = 0.85;
      box.appendChild(p);
    }
    document.body.appendChild(box);
  });
}

/* Win screen. learnedText is a {en,my} object. */
function showWin(gameKey, learnedText, emoji) {
  let win = document.querySelector(".win");
  if (!win) {
    win = document.createElement("div");
    win.className = "win";
    document.body.appendChild(win);
  }
  win.innerHTML = `
    <div class="card">
      <div class="big-emoji">${emoji || "🏆"}</div>
      <h2>${t(null, "winTitle")}</h2>
      ${learnedText ? `<div class="learned"><b>${t(null, "learned")}:</b><br>${L(learnedText)}</div>` : ""}
      <div class="codebox"><small>${t(null, "codeLabel")}</small><b>${CODES[gameKey]}</b></div>
      <div class="promo-line">${t(null, "promo")}${BRAND.contact ? `<small>${BRAND.contact}</small>` : ""}</div>
      <button class="btn pink big" id="nextPlayer">${t(null, "next")}</button>
    </div>`;
  win.classList.add("show");
  document.getElementById("nextPlayer").onclick = () => location.reload();
  confetti();
}

function confetti() {
  const colours = ["#E5307A", "#22AED6", "#FFE16A", "#3BB273", "#F28C28", "#fff"];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colours[i % colours.length];
    c.style.animationDuration = (2 + Math.random() * 2.5) + "s";
    c.style.animationDelay = (Math.random() * 0.8) + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
