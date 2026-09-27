(function(){
// ---------- data ----------
const PLAYERS = [
  { id: "rao",   name: "Rao Rizwan", short: "Rao",   ch: "R", cls: "r" },
  { id: "aneeq", name: "Aneeq",      short: "Aneeq", ch: "A", cls: "a" },
];
const byId = Object.fromEntries(PLAYERS.map(p => [p.id, p]));
const CONTAINERS = [
  { id: "lc",  name: "LeetCode DSA",   ic: "🧠", c: "var(--lc)",  src: "NeetCode 150 roadmap" },
  { id: "oop", name: "OOP & LLD",      ic: "🧩", c: "var(--oop)", src: "AlgoMaster LLD course" },
  { id: "db",  name: "Database / SQL", ic: "🗄️", c: "var(--db)",  src: "LeetCode SQL 50 → PGExercises" },
  { id: "sd",  name: "System Design",  ic: "🏗️", c: "var(--sd)",  src: "AlgoMaster system design" },
];
const POLL_MS = 15000;

const DAYS = window.PLAN.days.map((d, idx) => {
  const [y, m, dd] = d.date.split("-").map(Number);
  return { ...d, idx, date: new Date(y, m - 1, dd) };
});
const WEEKS = [];
DAYS.forEach(d => { const w = Math.floor(d.idx / 7); (WEEKS[w] = WEEKS[w] || []).push(d); });
const itemsOf = d => CONTAINERS.flatMap(c => d.c[c.id]);
const ITEM_DAY = {};
DAYS.forEach(d => itemsOf(d).forEach(it => { ITEM_DAY[it.key] = d.idx; }));
const sections = (d, cid) => [...new Set(d.c[cid].map(x => x.sec))];
const dayTitle = d => d.rev ? "Weekly revision" : sections(d, "lc").join(" · ");

// ---------- helpers ----------
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtD = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
function todayIdx(){ const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - DAYS[0].date) / 864e5); }
const PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';

// ---------- state ----------
let state = { rao: {}, aneeq: {} };
let pending = 0, selected = null, lastUnlocked = null;
let me = null;
try { me = JSON.parse(localStorage.getItem("arena-me") || "null"); } catch (e) { me = null; }
if (me && !byId[me.player]) me = null;

// ---------- locks: day N+1 opens when all 20 items of day N are done ----------
const dayComplete = (pid, d) => itemsOf(d).every(it => state[pid][it.key]);
function unlockedCount(pid){
  let n = 1;
  while (n < DAYS.length && dayComplete(pid, DAYS[n - 1])) n++;
  return n;
}
const isLocked = idx => !!me && idx >= unlockedCount(me.player);

// ---------- build ----------
function itemHTML(it){
  const num = it.n ? `<span class="num">#${esc(it.n)}</span>` : "";
  const diff = it.d ? `<span class="diff diff-${it.d.toLowerCase()}">${esc(it.d)}</span>` : "";
  const vid = it.v ? `<a class="vid" href="https://www.youtube.com/watch?v=${it.v.id}" target="_blank" rel="noopener" title="${esc(it.v.title)}">${PLAY}${esc(it.v.len)} · NeetCode</a>` : "";
  const src = it.src.startsWith("YouTube") ? `<span class="src yt">▶ ${esc(it.src.replace("YouTube · ", ""))}</span>` : `<span class="src">${esc(it.src)}</span>`;
  return `<li class="item${it.rev ? " rev" : ""}" data-key="${it.key}">
    <input type="checkbox" id="${it.key}" data-key="${it.key}">
    <div class="body">
      <label for="${it.key}">${it.rev ? '<span class="again">↻ Revisit</span>' : ""}${num}<a href="${it.u}" target="_blank" rel="noopener">${esc(it.t)}</a></label>
      <div class="meta">${diff}${src}${vid}<span class="sec">${esc(it.sec)}</span></div>
    </div>
    <span class="chips">${PLAYERS.map(p => `<span class="chip ${p.cls}" title="${p.name}">${p.ch}</span>`).join("")}</span>
  </li>`;
}
function dayHTML(d, t){
  const today = d.idx === t;
  return `<section class="daypanel${today ? " is-today" : ""}${d.rev ? " is-rev" : ""}" id="day${d.idx + 1}" hidden>
    <header class="dayhead">
      <div class="dh-main">
        <span class="eyebrow">Day ${d.idx + 1} of ${DAYS.length} · ${fmtD(d.date)}${today ? " · Today" : ""}${d.rev ? " · Sunday revision" : ""}</span>
        <h2>${esc(dayTitle(d))}</h2>
        <p class="dsub">${d.rev ? "Re-solve 5 of this week's hardest items in each container, without looking at your old answers." : "5 items in each container · 20 in total"}</p>
        <span class="lockmsg"></span>
      </div>
      <div class="clock">
        <span class="ctime-l">⏰ Now</span>
        <span class="ctime"></span>
        <span class="cleft-l"></span>
        <span class="cleft"></span>
      </div>
    </header>
    <div class="dayprog" aria-hidden="true">
      <div class="bar r"><i></i></div><div class="bar a"><i></i></div>
      <div class="nums"><span class="nr"></span><span class="na"></span></div>
    </div>
    <div class="containers">
      ${CONTAINERS.map(c => `<div class="box" style="--c:${c.c}" data-c="${c.id}">
        <h3><span class="ic">${c.ic}</span><span class="bn">${c.name}<small>${esc(sections(d, c.id).join(" · "))}</small></span><span class="cnt"></span></h3>
        <ul class="items">${d.c[c.id].map(itemHTML).join("")}</ul>
        <p class="bsrc">Source: ${esc(c.src)}</p>
      </div>`).join("")}
    </div>
  </section>`;
}
function navHTML(d, t){
  const today = d.idx === t;
  return `<button type="button" class="dnav${d.rev ? " is-rev" : ""}${today ? " is-today" : ""}" id="nav${d.idx + 1}" data-idx="${d.idx}">
    <span class="dn"><span class="de" aria-hidden="true">${d.rev ? "🔁" : today ? "📍" : "📘"}</span>Day ${d.idx + 1}<span class="lk" aria-hidden="true"></span></span>
    <span class="dd">${fmtD(d.date)}${today ? " · <b>Today</b>" : ""}</span>
    <span class="dt">${esc(dayTitle(d))}</span>
    <span class="dp"><span class="bar r"><i></i></span><span class="bar a"><i></i></span></span>
    <span class="nums"><span class="nr"></span><span class="na"></span></span>
  </button>`;
}
function build(){
  const t = todayIdx();
  $("daylist").innerHTML = WEEKS.map((w, i) => `<div class="wk"><div class="wkh">Week ${i + 1}</div>${w.map(d => navHTML(d, t)).join("")}</div>`).join("");
  $("dayview").innerHTML = DAYS.map(d => dayHTML(d, t)).join("");
}

// ---------- selection & clock ----------
function defaultDay(){
  const t = Math.max(0, Math.min(todayIdx(), DAYS.length - 1));
  return me ? Math.min(t, unlockedCount(me.player) - 1) : t;
}
function selectDay(idx){
  if (isLocked(idx)) { toast(`Day ${idx + 1} is locked. Finish Day ${idx} first.`, true); return; }
  selected = idx;
  DAYS.forEach(d => {
    $("day" + (d.idx + 1)).hidden = d.idx !== idx;
    const nav = $("nav" + (d.idx + 1));
    nav.classList.toggle("sel", d.idx === idx);
    nav.setAttribute("aria-current", d.idx === idx ? "true" : "false");
  });
  tickClock();
}
const pad = n => String(n).padStart(2, "0");
function fmtDur(ms){
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
  return (d ? `${d}d ` : "") + `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
function tickClock(){
  if (selected === null) return;
  const d = DAYS[selected], el = $("day" + (selected + 1));
  const now = new Date(), start = d.date;
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  el.querySelector(".ctime").textContent = now.toLocaleTimeString("en-GB");
  let label, value;
  if (now < start) { label = "Starts in"; value = fmtDur(start - now); }
  else if (now < end) { label = "Left today"; value = fmtDur(end - now); }
  else { label = "Past day"; value = "catch up"; }
  el.querySelector(".cleft-l").textContent = label;
  el.querySelector(".cleft").textContent = value;
  const clock = el.querySelector(".clock");
  clock.classList.toggle("urgent", now >= start && now < end && end - now < 3 * 3600e3);
  clock.classList.toggle("past", now >= end);
}

// ---------- render live state ----------
function renderWho(){
  $("who").innerHTML = me
    ? `<span>Playing as <strong style="color:var(--${me.player})">${esc(byId[me.player].name)}</strong></span><button class="btn ghost" type="button" id="switch">Switch</button>`
    : `<span>Watching</span><button class="btn" type="button" id="switch">Log in to tick</button>`;
  $("switch").addEventListener("click", openLogin);
  document.body.style.setProperty("--me", me ? `var(--${me.player})` : "var(--done)");
}
function update(){
  document.querySelectorAll("li.item").forEach(li => {
    const key = li.dataset.key;
    const mine = !!(me && state[me.player][key]);
    const locked = isLocked(ITEM_DAY[key]);
    const inp = li.querySelector("input");
    inp.checked = mine;
    inp.disabled = !me || locked;
    inp.title = !me ? "Log in to tick" : locked ? "Finish the previous day to unlock" : "";
    li.classList.toggle("mine", mine);
    const chips = li.querySelectorAll(".chip");
    PLAYERS.forEach((p, i) => chips[i].classList.toggle("on", !!state[p.id][key]));
  });
  const u = me ? unlockedCount(me.player) : null;
  DAYS.forEach(d => {
    const el = $("day" + (d.idx + 1)), nav = $("nav" + (d.idx + 1));
    const items = itemsOf(d);
    const n = { rao: 0, aneeq: 0 };
    items.forEach(it => PLAYERS.forEach(p => { if (state[p.id][it.key]) n[p.id]++; }));
    [el, nav].forEach(box => {
      box.querySelector(".bar.r i").style.width = n.rao / items.length * 100 + "%";
      box.querySelector(".bar.a i").style.width = n.aneeq / items.length * 100 + "%";
      box.querySelector(".nr").textContent = `R ${n.rao}/${items.length}`;
      box.querySelector(".na").textContent = `A ${n.aneeq}/${items.length}`;
    });
    CONTAINERS.forEach(c => {
      const done = me ? d.c[c.id].filter(it => state[me.player][it.key]).length : null;
      el.querySelector(`.box[data-c="${c.id}"] .cnt`).textContent = done === null ? "5 items" : `${done}/5`;
    });
    const locked = isLocked(d.idx);
    const mineDone = !!me && dayComplete(me.player, d);
    nav.classList.toggle("locked", locked);
    nav.classList.toggle("complete", mineDone);
    nav.querySelector(".lk").textContent = locked ? "🔒" : mineDone ? "✓" : "";
    nav.title = locked ? `Finish Day ${d.idx} to unlock` : "";
    const left = locked && d.idx === u ? itemsOf(DAYS[d.idx - 1]).filter(it => !state[me.player][it.key]).length : 0;
    el.querySelector(".lockmsg").textContent = locked ? (d.idx === u ? `🔒 Finish Day ${d.idx} to unlock (${left} left)` : `🔒 Locked · finish Day ${d.idx} first`) : "";
  });
  if (me) {
    if (lastUnlocked !== null && u > lastUnlocked && u <= DAYS.length) {
      toast(`🔓 Day ${u} unlocked.`);
      selectDay(u - 1);
    }
    lastUnlocked = u;
  } else lastUnlocked = null;
  if (selected === null || isLocked(selected)) selectDay(defaultDay());
}

// ---------- toasts ----------
function toast(msg, isErr){
  const el = document.createElement("div");
  el.className = "toast" + (isErr ? " err" : "");
  el.textContent = msg;
  $("toasts").appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

// ---------- network ----------
async function api(path, body){
  const r = await fetch(path, body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : { cache: "no-store" });
  let data = {};
  try { data = await r.json(); } catch (e) {}
  if (!r.ok) { const err = new Error(data.error || `Request failed (${r.status})`); err.status = r.status; throw err; }
  return data;
}
async function poll(){
  try {
    const data = await api("/api/state");
    if (pending > 0) return; // don't overwrite a tick that's in flight
    state = { rao: data.players.rao || {}, aneeq: data.players.aneeq || {} };
    $("status").textContent = "Live · saved for both players";
    $("status").classList.remove("err");
    update();
  } catch (e) {
    $("status").textContent = location.protocol === "file:"
      ? "Offline: open the Vercel URL (or run `vercel dev`) to save progress."
      : `Can't reach the server: ${e.message}`;
    $("status").classList.add("err");
  }
}
document.addEventListener("change", async e => {
  const inp = e.target.closest("input[data-key]");
  if (!inp || !me) return;
  const key = inp.dataset.key, on = inp.checked, pid = me.player;
  if (isLocked(ITEM_DAY[key])) { inp.checked = !on; toast("That day is still locked.", true); return; }
  const prev = state[pid][key];
  if (on) state[pid][key] = Date.now(); else delete state[pid][key];
  update();
  pending++;
  try {
    const r = await api("/api/tick", { player: pid, pin: me.pin, key, done: on });
    if (on && r.ts) state[pid][key] = r.ts;
  } catch (err) {
    if (prev) state[pid][key] = prev; else delete state[pid][key];
    toast(err.status === 401 ? "Your PIN was rejected. Log in again." : `Not saved: ${err.message}`, true);
    if (err.status === 401) { me = null; saveMe(); renderWho(); openLogin(); }
  } finally {
    pending--;
    update();
  }
});

// ---------- login ----------
function saveMe(){ try { me ? localStorage.setItem("arena-me", JSON.stringify(me)) : localStorage.removeItem("arena-me"); } catch (e) {} }
let picked = null;
function openLogin(){
  picked = me ? me.player : null;
  document.querySelectorAll("#pick button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.p === picked)));
  $("pin").value = "";
  $("login-err").textContent = "";
  $("login").hidden = false;
  $("pin").focus();
}
document.querySelectorAll("#pick button").forEach(b => b.addEventListener("click", () => {
  picked = b.dataset.p;
  document.querySelectorAll("#pick button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $("pin").focus();
}));
$("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!picked) { $("login-err").textContent = "Pick your name first."; return; }
  const pin = $("pin").value.trim();
  $("enter").disabled = true;
  try {
    await api("/api/tick", { player: picked, pin, check: true });
    me = { player: picked, pin };
    saveMe();
    try { localStorage.removeItem("arena-watch"); } catch (e2) {}
    $("login").hidden = true;
    renderWho(); lastUnlocked = null; selected = null; update();
  } catch (err) {
    $("login-err").textContent = err.status === 401 ? "Wrong PIN. Try again."
      : err.status === 429 ? err.message
      : `Couldn't check your PIN: ${err.message}`;
  } finally { $("enter").disabled = false; }
});
$("watch").addEventListener("click", () => {
  $("login").hidden = true;
  try { localStorage.setItem("arena-watch", "1"); } catch (e) {}
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("login").hidden) $("login").hidden = true; });
$("daylist").addEventListener("click", e => {
  const b = e.target.closest(".dnav"); if (!b) return;
  selectDay(Number(b.dataset.idx));
  if (matchMedia("(max-width: 860px)").matches) $("dayview").scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------- boot ----------
build();
renderWho();
update();
let watching = false;
try { watching = localStorage.getItem("arena-watch") === "1"; } catch (e) {}
if (!me && !watching && location.protocol !== "file:") openLogin();
poll();
setInterval(poll, POLL_MS);
setInterval(tickClock, 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) poll(); });
})();
