(function(){
// ---------- data ----------
const PID = "rao";
const POLL_MS = 15000;
const STORY = window.STORY || { dsa: {}, sql: {} };
const PRIMERS = window.DB_PRIMERS || {};
const DAYS = window.PLAN.days.map((d, idx) => {
  const [y, m, dd] = d.date.split("-").map(Number);
  return { ...d, idx, date: new Date(y, m - 1, dd) };
});
const DSA_CH = window.PLAN.dsaChapters, SQL_CH = window.PLAN.sqlChapters;
const itemsOf = d => d.lc.items.concat(d.sql.items);
const STUDY = DAYS.filter(d => d.type === "study");
const DSA_TOTAL = STUDY.reduce((n, d) => n + d.lc.items.length, 0);
const SQL_TOTAL = STUDY.reduce((n, d) => n + d.sql.items.length, 0);
// chapter → its study days
const chapterDays = (kind, ci) => STUDY.filter(d => d[kind].ch === ci);

// ---------- helpers ----------
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const md = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const fmtD = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
function todayIdx(){ const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - DAYS[0].date) / 864e5); }
const PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';

// ---------- state ----------
let done = {};
let pending = 0, selected = null;
let pin = null;
try { pin = localStorage.getItem("solo-pin"); } catch (e) { pin = null; }

const isDone = it => !!done[it.key];
const dayComplete = d => itemsOf(d).every(isDone);
function progress(){
  const t = todayIdx();
  let behind = 0, ahead = 0;
  DAYS.forEach(d => {
    if (d.idx < t && !dayComplete(d)) behind++;
    if (d.idx > t && dayComplete(d)) ahead++;
  });
  // streak: consecutive complete plan days ending today (or yesterday if today isn't finished yet)
  let i = Math.min(t, DAYS.length - 1);
  if (i >= 0 && !dayComplete(DAYS[i])) i--;
  let streak = 0;
  while (i >= 0 && dayComplete(DAYS[i])) { streak++; i--; }
  const dsa = STUDY.reduce((n, d) => n + d.lc.items.filter(isDone).length, 0);
  const sql = STUDY.reduce((n, d) => n + d.sql.items.filter(isDone).length, 0);
  const daysDone = DAYS.filter(dayComplete).length;
  const today = t >= 0 && t < DAYS.length ? DAYS[t] : null;
  const todayDone = today ? itemsOf(today).filter(isDone).length : 0;
  const todayTotal = today ? itemsOf(today).length : 0;
  return { t, behind, ahead, streak, dsa, sql, daysDone, today, todayDone, todayTotal };
}

// ---------- titles ----------
function dayLabel(d){
  if (d.type === "checkpoint") return `Checkpoint · week ${d.week}`;
  if (d.type === "mock") return `Mock interview ${d.idx - DAYS.findIndex(x => x.type === "mock") + 1} of 6`;
  return `${d.lc.chName}${d.lc.parts > 1 ? ` · part ${d.lc.part}/${d.lc.parts}` : ""}`;
}

// ---------- quotes (brutal, based on how you're doing) ----------
const QUOTES = {
  before:  ["Starts Monday. Decide now that you won't miss a single day.", "The plan is ready. The only missing part is you showing up on Monday."],
  finished:["All 62 days done. Now go and take the offer.", "Plan complete. You did what most people only talk about."],
  behindBig:["{n} days behind. The plan didn't get harder. You got comfortable.", "{n} days of problems are waiting for you. Interviews won't wait with them.", "{n} days behind. Every day you skip, someone else is preparing for your job."],
  behindSmall:["{n} day(s) behind. That's how every 'I'll catch up on Sunday' starts.", "Behind by {n}. Fix it today, not 'this weekend'.", "{n} day(s) behind already. Small slips become a lost month."],
  idle:    ["Zero problems today. The interviewer won't ask how busy you were.", "Nothing ticked today. Comfort is the most expensive thing you own right now.", "Your LeetCode tab is only open in your head."],
  partial: ["{d} of {tt} done. Half a day is a full excuse.", "{left} left today. Finish what you started.", "{d}/{tt}. Stopping here is exactly what you'd tell yourself not to do."],
  streak:  ["{s}-day streak. Break it tonight and you start from zero.", "{s} days in a row. Don't be the one who ends it."],
  doneToday:["Today's done. Don't let tomorrow turn it into a fluke.", "Done for today. Do it again tomorrow. That's the whole secret."],
  ahead:   ["{a} day(s) ahead. Don't celebrate, protect the lead.", "Ahead of schedule by {a}. Good. Now make it boring and repeat it."],
  general: ["Nobody is coming to save your career. Open LeetCode.", "Motivation is for amateurs. Show up anyway.", "The job market doesn't care that you're tired."],
};
function pickQuote(P){
  const slot = Math.floor(Date.now() / 20000);
  const hour = new Date().getHours();
  let pool, tone, label;
  if (P.t < 0) { pool = "before"; tone = "neutral"; label = "Before you start"; }
  else if (P.daysDone === DAYS.length) { pool = "finished"; tone = "good"; label = "Finished"; }
  else if (P.behind >= 3) { pool = "behindBig"; tone = "bad"; label = `Behind by ${P.behind} days`; }
  else if (P.behind >= 1) { pool = "behindSmall"; tone = "bad"; label = `Behind by ${P.behind} day${P.behind > 1 ? "s" : ""}`; }
  else if (P.today && P.todayDone === P.todayTotal) { pool = P.ahead ? (slot % 2 ? "ahead" : "doneToday") : "doneToday"; tone = "good"; label = "On track"; }
  else if (P.todayDone === 0 && hour >= 11) { pool = "idle"; tone = "bad"; label = "Nothing done today"; }
  else if (P.todayDone > 0) { pool = P.streak >= 3 && slot % 2 ? "streak" : "partial"; tone = "warn"; label = "Today in progress"; }
  else { pool = P.streak >= 3 ? "streak" : "general"; tone = "neutral"; label = "Reality check"; }
  const list = QUOTES[pool];
  const text = list[slot % list.length]
    .replace("{n}", P.behind).replace("{d}", P.todayDone).replace("{tt}", P.todayTotal)
    .replace("{left}", P.todayTotal - P.todayDone).replace("{s}", P.streak).replace("{a}", P.ahead);
  return { text, tone, label };
}

// ---------- build ----------
function itemHTML(it){
  const num = it.n ? `<span class="num">#${esc(it.n)}</span>` : "";
  const diff = it.d ? `<span class="diff diff-${it.d.toLowerCase()}">${esc(it.d)}</span>` : "";
  const vid = it.v ? `<a class="vid" href="https://www.youtube.com/watch?v=${it.v.id}" target="_blank" rel="noopener" title="${esc(it.v.title)}">${PLAY}${esc(it.v.len)} · NeetCode</a>` : "";
  const tag = it.mock ? '<span class="again">Timed</span>' : it.rev ? '<span class="again">Re-solve</span>' : "";
  return `<li class="item" data-key="${it.key}">
    <input type="checkbox" id="${it.key}" data-key="${it.key}">
    <div class="body">
      <label for="${it.key}">${tag}${num}<a href="${it.u}" target="_blank" rel="noopener">${esc(it.t)}</a></label>
      <div class="meta">${diff}<span class="src">${esc(it.src)}</span>${vid}${it.rev || it.mock ? `<span class="sec">${esc(it.sec.replace("SQL 50 · ", "").replace("PGExercises · ", "PGExercises: "))}</span>` : ""}</div>
    </div>
  </li>`;
}
function noteHTML(title, builds, text, links, open){
  return `<details class="note"${open ? " open" : ""}>
    <summary>${esc(title)}${open ? '<span class="new">new chapter</span>' : ""}</summary>
    ${builds ? `<p class="builds"><b>Builds on:</b> ${esc(builds)}</p>` : ""}
    <p>${md(text)}</p>
    ${links && links.length ? `<div class="plinks">${links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join("")}</div>` : ""}
  </details>`;
}
function boxHTML(d, kind){
  const isDsa = kind === "lc";
  const part = d[kind];
  let head, note = "";
  if (d.type === "study") {
    const chNum = part.ch + 1;
    head = `<h3><span class="tag">${isDsa ? "DSA" : "SQL"}</span><span class="bn">Chapter ${chNum} · ${esc(part.chName)}<small>${part.parts > 1 ? `Part ${part.part} of ${part.parts}` : "One-day chapter"}</small></span><span class="cnt"></span></h3>`;
    if (isDsa) {
      const s = STORY.dsa[part.chName];
      if (s) note = noteHTML(part.part === 1 ? "Start of the chapter: what to know" : `Chapter ${chNum} recap`, s.builds, s.text, null, part.part === 1);
    } else {
      const p = PRIMERS[part.sec];
      if (p) note = noteHTML(part.part === 1 ? "Start of the chapter: what to know" : `Chapter ${chNum} recap`, STORY.sql[part.chName], p.text, p.links, part.part === 1);
    }
  } else {
    head = `<h3><span class="tag">${isDsa ? "DSA" : "SQL"}</span><span class="bn">${d.type === "mock" ? (isDsa ? "Timed problems" : "Timed queries") : (isDsa ? "Re-solve this week's hardest" : "Re-solve this week's hardest queries")}<small>${d.type === "mock" ? (isDsa ? "25 min per medium · 40 min for the hard one · talk out loud" : "15 min each, no hints") : "No notes, no video. If you can't, rewatch and redo it tomorrow."}</small></span><span class="cnt"></span></h3>`;
  }
  return `<div class="box ${isDsa ? "dsa" : "sql"}" data-k="${kind}">${head}${note}<ul class="items">${part.items.map(itemHTML).join("")}</ul></div>`;
}
function dayHTML(d, t){
  const today = d.idx === t;
  let title, sub;
  if (d.type === "study") {
    title = `Chapter ${d.lc.ch + 1}: ${esc(d.lc.chName)}`;
    sub = `${d.lc.parts > 1 ? `Part ${d.lc.part} of ${d.lc.parts}` : "One-day chapter"} · SQL: ${esc(d.sql.chName)}${d.sql.parts > 1 ? ` (part ${d.sql.part} of ${d.sql.parts})` : ""}`;
  } else if (d.type === "checkpoint") {
    title = `Checkpoint: week ${d.week}`;
    sub = "Prove this week stuck. Re-solve its hardest problems from scratch.";
  } else {
    title = dayLabel(d);
    sub = "Final week. Treat every problem like a real interview: timer on, explain your approach out loud.";
  }
  return `<section class="daypanel${today ? " is-today" : ""} t-${d.type}" id="day${d.idx + 1}" hidden>
    <header class="dayhead">
      <p class="dh-eyebrow">Week ${d.week} · Day ${d.idx + 1} of ${DAYS.length} · ${fmtD(d.date)}${today ? ' · <b>Today</b>' : ""}</p>
      <h2>${title}</h2>
      <p class="dsub">${sub}</p>
      <div class="dayprog"><div class="bar"><i></i></div><span class="dcount"></span></div>
    </header>
    <div class="containers">${boxHTML(d, "lc")}${boxHTML(d, "sql")}</div>
  </section>`;
}
function navHTML(d, t){
  const today = d.idx === t;
  return `<button type="button" class="dnav t-${d.type}${today ? " is-today" : ""}" id="nav${d.idx + 1}" data-idx="${d.idx}">
    <span class="dn">Day ${d.idx + 1}<span class="lk"></span></span>
    <span class="dd">${fmtD(d.date)}${today ? " · <b>Today</b>" : ""}</span>
    <span class="dt">${esc(dayLabel(d))}</span>
    <span class="bar"><i></i></span>
  </button>`;
}
function chainHTML(kind, names){
  return names.map((n, ci) => {
    const ds = chapterDays(kind, ci);
    const range = ds.length ? `Day ${ds[0].idx + 1}${ds.length > 1 ? `–${ds[ds.length - 1].idx + 1}` : ""}` : "";
    return `<button type="button" class="blk" data-kind="${kind}" data-ch="${ci}" data-name="${esc(n)}" data-first="${ds[0] ? ds[0].idx : 0}">
      <span class="bnum">${ci + 1}</span><span class="bname">${esc(n.replace("PGExercises: ", "PGX: "))}</span><span class="brange">${range}</span><span class="bbar"><i></i></span>
    </button>`;
  }).join("");
}
function build(){
  const t = todayIdx();
  const weeks = [];
  DAYS.forEach(d => { (weeks[d.week - 1] = weeks[d.week - 1] || []).push(d); });
  $("daylist").innerHTML = weeks.map((w, i) => `<div class="wk"><div class="wkh">Week ${i + 1}${i === 8 ? " · mock interviews" : ""}</div>${w.map(d => navHTML(d, t)).join("")}</div>`).join("");
  $("dayview").innerHTML = DAYS.map(d => dayHTML(d, t)).join("");
  $("chain-dsa").innerHTML = chainHTML("lc", DSA_CH);
  $("chain-sql").innerHTML = chainHTML("sql", SQL_CH);
}

// ---------- selection ----------
function selectDay(idx){
  selected = idx;
  DAYS.forEach(d => {
    $("day" + (d.idx + 1)).hidden = d.idx !== idx;
    const nav = $("nav" + (d.idx + 1));
    nav.classList.toggle("sel", d.idx === idx);
    nav.setAttribute("aria-current", d.idx === idx ? "true" : "false");
  });
  update();
}

// ---------- render live state ----------
function renderWho(){
  $("who").innerHTML = pin
    ? `<span class="who-on">Saving as Rao</span><button class="btn light" type="button" id="switch">Lock</button>`
    : `<span>View only</span><button class="btn light" type="button" id="switch">Enter PIN</button>`;
  $("switch").addEventListener("click", () => {
    if (pin) { pin = null; savePin(); renderWho(); update(); }
    else openLogin();
  });
}
function update(){
  const P = progress();
  // stats
  const status = P.t < 0 ? `<b>Starts ${fmtD(DAYS[0].date)}</b>` : P.behind ? `<b class="bad">Behind by ${P.behind} day${P.behind > 1 ? "s" : ""}</b>` : `<b class="good">On track</b>${P.ahead ? ` · ${P.ahead} ahead` : ""}`;
  $("stats").innerHTML = `
    <div class="stat"><span>Status</span>${status}</div>
    <div class="stat"><span>Streak</span><b>${P.streak} day${P.streak === 1 ? "" : "s"}</b></div>
    <div class="stat"><span>DSA solved</span><b>${P.dsa} / ${DSA_TOTAL}</b></div>
    <div class="stat"><span>SQL solved</span><b>${P.sql} / ${SQL_TOTAL}</b></div>
    <div class="stat"><span>Days complete</span><b>${P.daysDone} / ${DAYS.length}</b></div>`;
  // quote
  const q = pickQuote(P);
  $("quote").className = "quote " + q.tone;
  $("q-label").textContent = q.label;
  $("q-text").textContent = q.text;
  // items
  document.querySelectorAll("li.item").forEach(li => {
    const v = !!done[li.dataset.key];
    const inp = li.querySelector("input");
    inp.checked = v; inp.disabled = !pin; inp.title = pin ? "" : "Enter your PIN to tick";
    li.classList.toggle("mine", v);
  });
  // days
  DAYS.forEach(d => {
    const items = itemsOf(d), n = items.filter(isDone).length, full = n === items.length;
    const el = $("day" + (d.idx + 1)), nav = $("nav" + (d.idx + 1));
    el.querySelector(".bar i").style.width = n / items.length * 100 + "%";
    el.querySelector(".dcount").textContent = `${n} / ${items.length} done`;
    ["lc", "sql"].forEach(k => {
      const its = d[k].items;
      el.querySelector(`.box[data-k="${k}"] .cnt`).textContent = `${its.filter(isDone).length}/${its.length}`;
    });
    nav.querySelector(".bar i").style.width = n / items.length * 100 + "%";
    const late = d.idx < P.t && !full;
    nav.classList.toggle("complete", full);
    nav.classList.toggle("late", late);
    nav.querySelector(".lk").textContent = full ? "✓ Done" : late ? "Behind" : "";
  });
  // story map
  document.querySelectorAll(".blk").forEach(b => {
    const ds = chapterDays(b.dataset.kind, Number(b.dataset.ch));
    const its = ds.flatMap(d => d[b.dataset.kind].items);
    const n = its.filter(isDone).length;
    const cur = selected !== null && DAYS[selected].type === "study" && DAYS[selected][b.dataset.kind].ch === Number(b.dataset.ch);
    b.classList.toggle("done", n === its.length && its.length > 0);
    b.classList.toggle("current", cur);
    b.querySelector(".bbar i").style.width = (its.length ? n / its.length * 100 : 0) + "%";
    b.title = `Chapter ${Number(b.dataset.ch) + 1}: ${b.dataset.name} · ${n} of ${its.length} solved`;
  });
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
    if (pending > 0) return;
    done = (data.players && data.players[PID]) || {};
    $("status").textContent = "Saved online · syncs every 15 s";
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
  if (!inp || !pin) return;
  const key = inp.dataset.key, on = inp.checked;
  const before = DAYS.filter(dayComplete).length;
  const prev = done[key];
  if (on) done[key] = Date.now(); else delete done[key];
  update();
  pending++;
  try {
    const r = await api("/api/tick", { player: PID, pin, key, done: on });
    if (on && r.ts) done[key] = r.ts;
    if (DAYS.filter(dayComplete).length > before) toast("Day complete. Next block unlocked in the story.");
  } catch (err) {
    if (prev) done[key] = prev; else delete done[key];
    toast(err.status === 401 ? "Your PIN was rejected. Enter it again." : `Not saved: ${err.message}`, true);
    if (err.status === 401) { pin = null; savePin(); renderWho(); openLogin(); }
  } finally {
    pending--;
    update();
  }
});

// ---------- login ----------
function savePin(){ try { pin ? localStorage.setItem("solo-pin", pin) : localStorage.removeItem("solo-pin"); } catch (e) {} }
function openLogin(){
  $("pin").value = ""; $("login-err").textContent = "";
  $("login").hidden = false; $("pin").focus();
}
$("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const p = $("pin").value.trim();
  $("enter").disabled = true;
  try {
    await api("/api/tick", { player: PID, pin: p, check: true });
    pin = p; savePin();
    try { localStorage.removeItem("solo-watch"); } catch (e2) {}
    $("login").hidden = true;
    renderWho(); update();
  } catch (err) {
    $("login-err").textContent = err.status === 401 ? "Wrong PIN. Try again." : err.status === 429 ? err.message : `Couldn't check your PIN: ${err.message}`;
  } finally { $("enter").disabled = false; }
});
$("watch").addEventListener("click", () => { $("login").hidden = true; try { localStorage.setItem("solo-watch", "1"); } catch (e) {} });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("login").hidden) $("login").hidden = true; });
$("daylist").addEventListener("click", e => {
  const b = e.target.closest(".dnav"); if (!b) return;
  selectDay(Number(b.dataset.idx));
  if (matchMedia("(max-width: 860px)").matches) $("dayview").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelectorAll(".chain").forEach(c => c.addEventListener("click", e => {
  const b = e.target.closest(".blk"); if (!b) return;
  selectDay(Number(b.dataset.first));
  $("dayview").scrollIntoView({ behavior: "smooth", block: "start" });
}));

// ---------- boot ----------
build();
renderWho();
selectDay(Math.max(0, Math.min(todayIdx(), DAYS.length - 1)));
let watching = false;
try { watching = localStorage.getItem("solo-watch") === "1"; } catch (e) {}
if (!pin && !watching && location.protocol !== "file:") openLogin();
poll();
setInterval(poll, POLL_MS);
setInterval(update, 20000); // rotate quotes, refresh "today"
document.addEventListener("visibilitychange", () => { if (!document.hidden) poll(); });
})();
