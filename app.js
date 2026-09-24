(function(){
const { DAYS, TRACKS, WEEKS, V } = window.PLAN;

const PLAYERS = [
  { id: "rao",   name: "Rao Rizwan", short: "Rao",   ch: "R", cls: "r" },
  { id: "aneeq", name: "Aneeq",      short: "Aneeq", ch: "A", cls: "a" },
];
const byId = Object.fromEntries(PLAYERS.map(p => [p.id, p]));
const rival = id => PLAYERS.find(p => p.id !== id);
const POLL_MS = 15000;
const STREAK_MIN = 5; // ticks per day to keep a streak alive

// ---------- plan index ----------
const ITEMS = {}; // key -> { it, day, track }
DAYS.forEach(d => {
  if (d.rev) d.items.forEach(it => { ITEMS[it.key] = { it, day: d, track: "rev" }; });
  else TRACKS.forEach(tr => (d[tr.id] || []).forEach(it => { ITEMS[it.key] = { it, day: d, track: tr.id }; }));
  d.qz.forEach(it => { ITEMS[it.key] = { it, day: d, track: "qz" }; });
  d.cnItems.forEach(it => { ITEMS[it.key] = { it, day: d, track: "cn" }; });
  d.qp.forEach(it => { ITEMS[it.key] = { it, day: d, track: "qp" }; });
});
const dayItems = d => d.qp.concat(d.cnItems, d.rev ? d.items : TRACKS.flatMap(tr => d[tr.id] || []), d.qz);
const ICON = { dsa: "🧠", sql: "🗄️", py: "🐍", sd: "🏗️", iv: "🎤", qp: "⚡", cn: "💡", qz: "🎯", rev: "🔁" };
const RACE = [{ id: "qp", name: "Quick picks", c: "var(--qp)" }, { id: "cn", name: "Concepts", c: "var(--cn)" }, ...TRACKS, { id: "qz", name: "Extra practice", c: "var(--qz)" }, { id: "rev", name: "Sunday revision", c: "var(--rev)" }];
const DIFF_PTS = { Easy: 5, Medium: 8, Hard: 12 };

// ---------- day locks ----------
// Day N+1 unlocks when every item of day N is done (the bonus "Extra practice" block doesn't count).
// Locks are per player; spectators (not logged in) see everything.
const requiredItems = d => dayItems(d).filter(it => ITEMS[it.key].track !== "qz");
const dayComplete = (pid, d) => requiredItems(d).every(it => state[pid][it.key]);
function unlockedCount(pid){
  let n = 1;
  while (n < DAYS.length && dayComplete(pid, DAYS[n - 1])) n++;
  return n; // days 1..n are open
}
const isLocked = idx => !!me && idx >= unlockedCount(me.player);
let lastUnlocked = null;
const TOTALS = {};
Object.values(ITEMS).forEach(m => { TOTALS[m.track] = (TOTALS[m.track] || 0) + 1; });

// ---------- dates & points ----------
const dayStr = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const localDay = ts => dayStr(new Date(ts));
const fmtD = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
function todayIdx(){ const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - DAYS[0].date) / 864e5); }

function basePts(key){
  const m = ITEMS[key]; if (!m) return 0;
  if (m.track === "rev") return 6;
  if (m.track === "qz") return DIFF_PTS[m.it.d] || 5;
  if (m.track === "cn") return 5;
  if (m.track === "qp") return 3;
  if (m.it.k === "p") return m.track === "dsa" ? 10 : 8;
  if (m.track === "iv") return 5;
  return m.it.k === "l" ? 4 : 5;
}
const onTime = (key, ts) => !!ITEMS[key] && localDay(ts) === dayStr(ITEMS[key].day.date);
const pts = (key, ts) => onTime(key, ts) ? Math.round(basePts(key) * 1.5) : basePts(key);

// ---------- state ----------
let state = { rao: {}, aneeq: {} };
let events = [];
let serverOffset = 0;
let loaded = false;
let pending = 0;
let lastLeader = null;
let unseen = 0;
const seen = new Set();
let me = null;
try { me = JSON.parse(localStorage.getItem("arena-me") || "null"); } catch (e) { me = null; }
if (me && !byId[me.player]) me = null;

// video metadata by YouTube id (from videos.js)
const VID_BY_ID = {};
Object.values(window.VIDEOS || {}).forEach(v => { VID_BY_ID[v.id] = v; });
const PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';
function vidPill(url, prefix){
  const m = /[?&]v=([\w-]{11})/.exec(url || "");
  const v = m && VID_BY_ID[m[1]];
  if (!v) return "";
  return `<a class="vid" href="${url}" target="_blank" rel="noopener" title="${esc(v.title)} — ${esc(v.ch)}">${PLAY}${prefix ? prefix + " · " : ""}${esc(v.len)} · ${esc(v.ch)}</a>`;
}

const md = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); // inline `code`
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = id => document.getElementById(id);

// ---------- stats ----------
function stats(pid){
  const done = state[pid];
  let score = 0, problems = 0, sqlp = 0, extra = 0, count = 0, lastTs = 0;
  const perDay = {};
  const hours = [];
  for (const [key, ts] of Object.entries(done)) {
    const m = ITEMS[key]; if (!m) continue;
    count++;
    score += pts(key, ts);
    if (m.it.k === "p") { if (m.track === "dsa") problems++; else sqlp++; }
    if (m.it.k === "x") { extra++; if (m.it.cat === "DSA") problems++; else if (m.it.cat === "SQL") sqlp++; }
    const ld = localDay(ts); perDay[ld] = (perDay[ld] || 0) + 1;
    hours.push(new Date(ts).getHours());
    if (ts > lastTs) lastTs = ts;
  }
  // current streak: today counts once it hits STREAK_MIN, otherwise count back from yesterday
  const d = new Date(); d.setHours(0, 0, 0, 0);
  const todayCount = perDay[dayStr(d)] || 0;
  if (todayCount < STREAK_MIN) d.setDate(d.getDate() - 1);
  let streak = 0;
  while ((perDay[dayStr(d)] || 0) >= STREAK_MIN) { streak++; d.setDate(d.getDate() - 1); }
  // best streak across the sprint (from a week before start, to allow early birds)
  let best = 0, run = 0;
  const c = new Date(DAYS[0].date); c.setDate(c.getDate() - 7);
  const end = new Date(); end.setHours(0, 0, 0, 0);
  while (c <= end) { run = (perDay[dayStr(c)] || 0) >= STREAK_MIN ? run + 1 : 0; best = Math.max(best, run); c.setDate(c.getDate() + 1); }
  return { score, problems, sqlp, extra, count, lastTs, perDay, hours, streak, best, todayCount };
}
function duelPts(pid, d){
  let s = 0, n = 0;
  const items = dayItems(d);
  items.forEach(it => { const ts = state[pid][it.key]; if (ts) { n++; if (onTime(it.key, ts)) s += pts(it.key, ts); } });
  return { s, n, total: items.length };
}
function duelWinner(d){
  const a = duelPts("rao", d).s, b = duelPts("aneeq", d).s;
  if (a === 0 && b === 0) return null;
  return a > b ? "rao" : b > a ? "aneeq" : "tie";
}
function daysWon(){
  const w = { rao: 0, aneeq: 0 };
  const t = Math.min(todayIdx(), DAYS.length);
  for (let i = 0; i < t; i++) { const r = duelWinner(DAYS[i]); if (r === "rao" || r === "aneeq") w[r]++; }
  return w;
}
function maxPerDay(pid, filter){
  const per = {};
  for (const [key, ts] of Object.entries(state[pid])) { const m = ITEMS[key]; if (m && filter(m)) { const ld = localDay(ts); per[ld] = (per[ld] || 0) + 1; } }
  return Math.max(0, ...Object.values(per));
}
function firstTicker(){
  let best = null;
  PLAYERS.forEach(p => Object.values(state[p.id]).forEach(ts => { if (!best || ts < best.ts) best = { pid: p.id, ts }; }));
  return best && best.pid;
}

const BADGES = [
  { i: "🩸", name: "First Blood",   d: "First tick of the sprint",           test: (pid)    => firstTicker() === pid },
  { i: "🎩", name: "Hat-trick",     d: "3 DSA problems in one day",          test: (pid)    => maxPerDay(pid, m => m.track === "dsa" && m.it.k === "p") >= 3 },
  { i: "🧹", name: "Clean Sweep",   d: "Finish a whole day on its date",     test: (pid)    => DAYS.some(d => dayItems(d).every(it => state[pid][it.key] && onTime(it.key, state[pid][it.key]))) },
  { i: "🔥", name: "On Fire",       d: "5-day streak",                       test: (pid, S) => S.best >= 5 },
  { i: "🚀", name: "Unstoppable",   d: "10-day streak",                      test: (pid, S) => S.best >= 10 },
  { i: "🗡️", name: "SQL Slayer",    d: "25 SQL problems",                    test: (pid, S) => S.sqlp >= 25 },
  { i: "🧩", name: "Pattern Hunter",d: "40 DSA problems",                    test: (pid, S) => S.problems >= 40 },
  { i: "⚙️", name: "Grinder",       d: "30 extra practice problems",         test: (pid, S) => S.extra >= 30 },
  { i: "💡", name: "Concept Master", d: "Finish 20 concepts of the day",      test: (pid)    => DAYS.filter(d => d.cnItems.length && d.cnItems.every(it => state[pid][it.key])).length >= 20 },
  { i: "⚡", name: "Speed Demon",   d: "30 quick picks solved",              test: (pid)    => Object.keys(state[pid]).filter(k => ITEMS[k] && ITEMS[k].track === "qp").length >= 30 },
  { i: "💯", name: "Centurion",     d: "100 items done",                     test: (pid, S) => S.count >= 100 },
  { i: "🐦", name: "Early Bird",    d: "Tick something between 4 and 7 am",  test: (pid, S) => S.hours.some(h => h >= 4 && h < 7) },
  { i: "🦉", name: "Night Owl",     d: "Tick something between midnight and 4 am", test: (pid, S) => S.hours.some(h => h < 4) },
];

// ---------- reality checks (brutal motivation) ----------
// {r} = rival's short name, {me} = your short name. Picked by situation, rotated every 20 s.
const QUOTES = {
  general: [
    "Nobody is coming to save your career. Open LeetCode.",
    "The job market doesn't care that you're tired.",
    "You didn't lose your job to be comfortable. You lost it to get better.",
    "Two years of experience and still scared of a JOIN? Fix it today.",
    "Every hour you scroll, someone with less talent is getting your offer.",
    "Motivation is for amateurs. Show up anyway.",
    "Your bank balance is doing cardio. Are you?",
    "Recruiters don't hire 'I'll start Monday'.",
    "You're not stuck. You're just not doing the work.",
    "The interviewer won't grade your excuses.",
    "If you can't explain the GIL, you're not senior. You're just older.",
    "Comfort is the most expensive thing you own right now.",
    "Nobody remembers who almost studied.",
    "Discipline now, or 'sorry, we went with another candidate' later.",
    "The pain of studying is temporary. The pain of another rejection email isn't.",
  ],
  behind: [
    "{r} is ahead of you right now. Sit with that for a second. Then go fix it.",
    "{r} is solving problems while you read this sentence.",
    "Losing to {r} is a choice. You're making it right now.",
    "{r} will get the offer you're daydreaming about.",
    "Imagine {r} screenshotting this scoreboard. Because they might.",
    "Second place is just the first loser. {r} knows it.",
    "{r} isn't smarter than you. {r} just shows up.",
    "Every point {r} scores is a question you'll fumble in an interview.",
  ],
  ahead: [
    "You're ahead of {r}. That's the most dangerous place to get lazy.",
    "Leading is not winning. {r} is one good night away.",
    "Don't celebrate. The interviewer doesn't care about this scoreboard.",
    "A lead you stop defending is just a head start for {r}.",
    "Being better than {r} is the minimum. Be better than yesterday.",
  ],
  idle: [
    "Zero ticks today. Zero. Say it out loud and feel it.",
    "The day is burning and your score isn't moving.",
    "You opened this page. That's not work. Tick something.",
    "An empty day is a vote for staying unemployed.",
  ],
  risk: [
    "Your streak dies at midnight. Don't be the one who let it.",
    "Fewer than 5 ticks today. Your streak is on life support.",
    "Breaking the streak takes zero effort. That's exactly why losers do it.",
  ],
};
function realityCheck(S){
  const now = new Date();
  const slot = Math.floor(Date.now() / 20000); // rotates every 20 s
  const meId = me ? me.player : null;
  let pool = "general", label = "🔥 Reality check";
  if (meId) {
    const mine = S[meId], rv = S[rival(meId).id];
    if (mine.todayCount === 0 && now.getHours() >= 10) { pool = "idle"; label = "😴 You, today"; }
    else if (mine.todayCount < STREAK_MIN && mine.streak > 0 && now.getHours() >= 18) { pool = "risk"; label = "🚨 Streak alert"; }
    else if (mine.score < rv.score) { pool = slot % 3 === 2 ? "general" : "behind"; label = pool === "behind" ? "😤 You're losing" : label; }
    else if (mine.score > rv.score) { pool = slot % 2 ? "general" : "ahead"; label = pool === "ahead" ? "👀 Don't get comfy" : label; }
  }
  const list = QUOTES[pool];
  const r = meId ? rival(meId).short : "your rival";
  return { label, text: list[slot % list.length].replaceAll("{r}", r).replaceAll("{me}", meId ? byId[meId].short : "you") };
}

// ---------- taunts ----------
function hoursSince(ts){ return ts ? (Date.now() + serverOffset - ts) / 36e5 : Infinity; }
function taunt(S){
  const ra = S.rao.score, an = S.aneeq.score;
  if (ra === 0 && an === 0) return { main: "0 – 0. Whoever ticks first takes First Blood.", sub: "" };
  const diff = Math.abs(ra - an);
  if (diff === 0) return { main: `Dead even at ${ra}. The next tick takes the lead.`, sub: "" };
  const L = ra > an ? byId.rao : byId.aneeq, T = rival(L.id);
  let lines;
  if (me && me.player === L.id) {
    lines = diff < 20 ? [`You lead by ${diff}. That's one problem — ${T.short} can flip it tonight.`, `Up ${diff}. Barely. Keep going.`]
      : diff < 80 ? [`You're up ${diff}. Don't get comfortable.`, `+${diff}. ${T.short} is refreshing this page too.`]
      : [`+${diff}. ${T.short} is getting cooked.`, `${diff} ahead. Make it embarrassing.`];
  } else if (me && me.player === T.id) {
    lines = diff < 20 ? [`${L.short} leads by ${diff}. One DSA problem puts you back on top.`, `Down ${diff}. That's nothing — go take it back.`]
      : diff < 80 ? [`You're ${diff} behind ${L.short}. Open LeetCode.`, `${L.short} +${diff}. Are you really letting that happen?`]
      : [`${diff} behind. ${L.short} is running away with it.`, `${L.short} +${diff}. This is getting embarrassing.`];
  } else {
    lines = diff < 20 ? [`${L.short} edges it by ${diff}.`] : diff < 80 ? [`${L.short} pulls away, +${diff}.`] : [`${L.short} is cooking ${T.short}: +${diff}.`];
  }
  const idle = hoursSince(S[T.id].lastTs);
  const sub = S[T.id].count && idle >= 12 ? `${T.short} hasn't ticked anything in ${Math.floor(idle)} h.` : "";
  return { main: lines[diff % lines.length], sub };
}

// ---------- build plan (once) ----------
function itemHTML(it, trackId){
  let label;
  if (it.k === "p") {
    label = `<span class="num">#${it.n}</span><a href="${it.u}" target="_blank" rel="noopener">${esc(it.t)}</a>` +
      (trackId === "dsa" ? vidPill(V(it.t), "Solution") : "");
  } else if (it.k === "x") {
    const diff = it.d ? `<span class="diff diff-${it.d.toLowerCase()}">${esc(it.d)}</span>` : "";
    label = `<span class="src">${esc(it.src)}</span><span class="cat">${esc(it.cat)}</span>` +
      `<a href="${it.u}" target="_blank" rel="noopener">${it.n ? `<span class="num">#${esc(it.n)}</span>` : ""}${esc(it.t)}</a>${diff}`;
  } else if (it.u) label = `<a href="${it.u}" target="_blank" rel="noopener">${esc(it.t)}</a>` + vidPill(it.u);
  else label = esc(it.t);
  const b = basePts(it.key);
  return `<li class="item" data-key="${it.key}">
    <input type="checkbox" id="${it.key}" data-key="${it.key}">
    <label for="${it.key}">${label}<span class="pv">${b} pts</span></label>
    <span class="chips">${PLAYERS.map(p => `<span class="chip ${p.cls}" title="${p.name}">${p.ch}</span>`).join("")}</span>
  </li>`;
}
// Layout: all days listed in the left column; only the selected day is shown on the right.
let selected = null;
function buildPlan(){
  const t = todayIdx();
  $("daylist").innerHTML = WEEKS.map(w => `
    <div class="wk"><div class="wkh">Week ${w.n} · ${esc(w.t)}</div>
      ${DAYS.slice(w.from, w.to + 1).map(d => navHTML(d, t)).join("")}
    </div>`).join("");
  $("dayview").innerHTML = DAYS.map(d => dayHTML(d, t)).join("");
}
function navHTML(d, t){
  const today = d.idx === t;
  return `<button type="button" class="dnav${d.rev ? " is-rev" : ""}${today ? " is-today" : ""}" id="nav${d.idx + 1}" data-idx="${d.idx}">
    <span class="dn"><span class="de" aria-hidden="true">${d.rev ? "🔁" : today ? "📍" : "📘"}</span>Day ${d.idx + 1}<span class="lk" aria-hidden="true"></span></span>
    <span class="dd">${fmtD(d.date)}${today ? " · <b>Today</b>" : ""}</span>
    <span class="dt">${esc(d.f)}</span>
    <span class="dp"><span class="bar r"><i></i></span><span class="bar a"><i></i></span></span>
    <span class="nums"><span class="nr"></span><span class="na"></span></span>
  </button>`;
}
function defaultDay(){
  const t = Math.max(0, Math.min(todayIdx(), DAYS.length - 1));
  return me ? Math.min(t, unlockedCount(me.player) - 1) : t;
}
function selectDay(idx, scroll){
  if (isLocked(idx)) { toast(`Day ${idx + 1} is locked. Finish Day ${idx} first.`, null, true); return; }
  selected = idx;
  DAYS.forEach(d => {
    $("day" + (d.idx + 1)).hidden = d.idx !== idx;
    const nav = $("nav" + (d.idx + 1));
    nav.classList.toggle("sel", d.idx === idx);
    nav.setAttribute("aria-current", d.idx === idx ? "true" : "false");
  });
  tickClock();
  if (scroll) $("dayview").scrollIntoView({ behavior: "smooth", block: "start" });
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
  const now = new Date();
  const start = d.date, end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  el.querySelector(".ctime").textContent = now.toLocaleTimeString("en-GB");
  const clock = el.querySelector(".clock");
  let label, value;
  if (now < start) { label = "Starts in"; value = fmtDur(start - now); }
  else if (now < end) { label = "Left today · on-time bonus"; value = fmtDur(end - now); }
  else { label = "Past day"; value = "catch up · base points"; }
  el.querySelector(".cleft-l").textContent = label;
  el.querySelector(".cleft").textContent = value;
  clock.classList.toggle("urgent", now >= start && now < end && end - now < 3 * 3600e3);
  clock.classList.toggle("past", now >= end);
}
function dayHTML(d, t){
  const isToday = d.idx === t;
  const c = d.cn;
  const concept = c ? `<div class="track wide concept" style="--c:var(--cn)">
      <h4><span class="ic">${ICON.cn}</span><span class="tn">Concept of the day · ${esc(c.t)}</span><span class="h">30 min</span></h4>
      <p class="cwhat">${md(c.what)}</p>
      <div class="cbox"><span class="clbl">Interview question</span>${md(c.ask)}</div>
      <div class="cbox try"><span class="clbl">Try it</span>${md(c.try)}</div>
      <div class="cres">${c.docs.map(x => `<a class="doc" href="${x.u}" target="_blank" rel="noopener">${esc(x.t)} ↗</a>`).join("")}<a class="vid" href="${c.video.u}" target="_blank" rel="noopener" title="${esc(c.video.title)} — ${esc(c.video.ch)}">${PLAY}${esc(c.video.len)} · ${esc(c.video.ch)}</a></div>
      <ul class="items">${d.cnItems.map(it => itemHTML(it, "cn")).join("")}</ul>
    </div>` : "";
  const quick = d.qp.length
    ? `<div class="track wide quick" style="--c:var(--qp)"><h4><span class="ic">${ICON.qp}</span><span class="tn">Quick picks · warm up before DSA</span><span class="h">10 min</span></h4><ul class="items">${d.qp.map(it => itemHTML(it, "qp")).join("")}</ul></div>`
    : "";
  const practice = d.qz.length
    ? `<div class="track wide practice" style="--c:var(--qz)"><h4><span class="ic">${ICON.qz}</span><span class="tn">Extra practice · solve on the platform</span><span class="h">bonus</span></h4><ul class="items">${d.qz.map(it => itemHTML(it, "qz")).join("")}</ul></div>`
    : "";
  const body = d.rev
    ? `<div class="tracks"><div class="track wide" style="--c:var(--rev)"><h4><span class="ic">${ICON.rev}</span><span class="tn">Revision &amp; career</span><span class="h">~5 h</span></h4><ul class="items">${d.items.map(it => itemHTML(it, "rev")).join("")}</ul></div>${quick}${concept}${practice}</div>`
    : `<div class="tracks">${quick}${concept}${TRACKS.map(tr => `<div class="track${tr.id === "iv" ? " wide" : ""}" style="--c:${tr.c}"><h4><span class="ic">${ICON[tr.id]}</span><span class="tn">${tr.name}</span><span class="h">${tr.hrs}</span></h4><ul class="items">${d[tr.id].map(it => itemHTML(it, tr.id)).join("")}</ul></div>`).join("")}${practice}</div>`;
  return `<section class="day daypanel${d.rev ? " is-rev" : ""}${isToday ? " is-today" : ""}" id="day${d.idx + 1}" hidden>
    <header class="dayhead">
      <div class="dh-main">
        <span class="eyebrow">Day ${d.idx + 1} of ${DAYS.length} · ${fmtD(d.date)}${isToday ? " · Today" : ""}${d.rev ? " · Sunday" : ""}</span>
        <h2>${esc(d.f)}</h2>
        <p class="dsub">${esc(d.s)}${d.cn ? ` · <span class="cn-tag">Concept: ${esc(d.cn.t)}</span>` : ""}</p>
        <span class="lockmsg"></span>
      </div>
      <div class="clock" aria-live="off">
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
    ${body}</section>`;
}

// ---------- render live parts ----------
function renderWho(){
  $("who").innerHTML = me
    ? `<span>Playing as <strong style="color:var(--${me.player})">${esc(byId[me.player].name)}</strong></span><button class="btn ghost" type="button" id="switch">Switch</button>`
    : `<span>Watching</span><button class="btn" type="button" id="switch">Log in to tick</button>`;
  $("switch").addEventListener("click", openLogin);
  document.body.style.setProperty("--me", me ? `var(--${me.player})` : "var(--done)");
}

function updateAll(){
  const S = { rao: stats("rao"), aneeq: stats("aneeq") };
  const won = daysWon();
  const leader = S.rao.score === S.aneeq.score ? null : (S.rao.score > S.aneeq.score ? "rao" : "aneeq");

  // fighters
  PLAYERS.forEach(p => {
    const s = S[p.id];
    const el = $("f-" + p.id);
    el.classList.toggle("leading", leader === p.id);
    el.innerHTML = `
      <div class="name"><span class="crown"${leader === p.id ? "" : " hidden"} title="Leader">♛</span>${esc(p.name)}${me && me.player === p.id ? '<span class="you">you</span>' : ""}</div>
      <div class="score">${s.score}<small>pts</small></div>
      <div class="fstats">
        <span>🔥 <b>${s.streak}</b>-day streak</span>
        <span>🏆 <b>${won[p.id]}</b> days won</span>
        <span>🧠 <b>${s.problems}</b> DSA · 🗄️ <b>${s.sqlp}</b> SQL</span>
      </div>`;
  });
  const total = S.rao.score + S.aneeq.score;
  const rShare = total ? S.rao.score / total * 100 : 50;
  $("tug-r").style.width = rShare + "%";
  $("tug-a").style.width = (100 - rShare) + "%";
  const tt = taunt(S);
  $("taunt").innerHTML = esc(tt.main) + (tt.sub ? `<small>${esc(tt.sub)}</small>` : "");
  const rc = realityCheck(S);
  $("reality-label").textContent = rc.label;
  $("reality-text").textContent = rc.text;

  if (loaded && lastLeader && leader && leader !== lastLeader) toast(`♛ ${byId[leader].name} just took the lead!`, leader);
  if (leader) lastLeader = leader;

  // today's duel
  const t = todayIdx();
  const di = Math.max(0, Math.min(t, DAYS.length - 1));
  const d = DAYS[di];
  const live = t >= 0 && t < DAYS.length;
  $("duel-title").innerHTML = `⚔️ ${live ? "Today's duel" : t < 0 ? "First duel" : "Final duel"} <span>Day ${di + 1} · ${fmtD(d.date)}</span>`;
  const dp = { rao: duelPts("rao", d), aneeq: duelPts("aneeq", d) };
  const dw = dp.rao.s === dp.aneeq.s ? null : (dp.rao.s > dp.aneeq.s ? "rao" : "aneeq");
  $("duel").innerHTML = PLAYERS.map(p => `
    <div class="duelside${dw === p.id ? " win" : ""}" data-p="${p.id}">
      <span class="n">${esc(p.short)}${dw === p.id ? " · winning" : ""}</span>
      <span class="big">${dp[p.id].s}<small> on-time pts</small></span>
      <span class="eyebrow">${dp[p.id].n}/${dp[p.id].total} items</span>
    </div>`).join("");
  let note;
  if (t < 0) note = `Starts ${fmtD(DAYS[0].date)}. Ticks made before then earn base points only.`;
  else if (!live) note = "The sprint is over. Check the record below.";
  else if (!dw) note = dp.rao.s === 0 ? "Nobody has scored today yet. First tick leads the duel." : "Tied today. Break it.";
  else {
    const gap = Math.abs(dp.rao.s - dp.aneeq.s);
    note = me && me.player !== dw ? `You're ${gap} on-time points behind today. Midnight is the deadline.` : `${byId[dw].short} leads today by ${gap}. Midnight is the deadline.`;
  }
  $("duel-note").textContent = note;
  $("record").innerHTML = DAYS.map((dd, i) => {
    const w = i <= t ? duelWinner(dd) : null;
    const cls = w === "rao" ? "r" : w === "aneeq" ? "a" : w === "tie" ? "t" : "";
    const who = w === "rao" || w === "aneeq" ? byId[w].short + " won" : w === "tie" ? "Tie" : i <= t ? "No score" : "Upcoming";
    return `<i class="${cls}${i === t ? " now" : ""}" title="Day ${i + 1} (${fmtD(dd.date)}): ${who}">${i + 1}</i>`;
  }).join("");

  // track race
  $("race").innerHTML = RACE.map(tr => {
    const c = { rao: 0, aneeq: 0 };
    PLAYERS.forEach(p => Object.keys(state[p.id]).forEach(k => { if (ITEMS[k] && ITEMS[k].track === tr.id) c[p.id]++; }));
    const tot = TOTALS[tr.id] || 1;
    return `<div class="row" style="--c:${tr.c}"><span class="lbl">${ICON[tr.id] || ""} ${esc(tr.name)}</span>
      <div class="bars"><div class="bar r"><i style="width:${c.rao / tot * 100}%"></i></div><div class="bar a"><i style="width:${c.aneeq / tot * 100}%"></i></div>
      <div class="nums"><span>Rao ${c.rao}</span><span>${tot} total</span><span>Aneeq ${c.aneeq}</span></div></div></div>`;
  }).join("");

  // feed: only ticks that still stand
  const feed = events.filter(e => byId[e.player] && ITEMS[e.key] && state[e.player][e.key] === e.ts).slice(0, 25);
  $("feed").innerHTML = feed.length ? feed.map(e => {
    const m = ITEMS[e.key];
    const verb = m.it.k === "p" || m.it.k === "x" ? "solved" : "finished";
    const title = m.it.n ? `#${m.it.n} ${m.it.t}` : m.it.k === "x" ? `${m.it.t} (${m.it.src})` : m.it.t;
    return `<li data-p="${e.player}"><span><strong>${esc(byId[e.player].short)}</strong> ${verb} ${esc(title)} <span class="pts">+${pts(e.key, e.ts)}</span></span><span class="t">${relTime(e.ts)}</span></li>`;
  }).join("") : `<li style="display:block"><p class="empty">No ticks yet. The first one gets First Blood.</p></li>`;

  // badges
  $("badges").innerHTML = BADGES.map(b => {
    const holders = PLAYERS.filter(p => b.test(p.id, S[p.id]));
    return `<div class="badge${holders.length ? " got" : ""}"><span class="bi" aria-hidden="true">${b.i}</span><b>${esc(b.name)}</b><span class="d">${esc(b.d)}</span><span class="holders">${PLAYERS.map(p => `<span class="${holders.includes(p) ? p.cls : ""}">${p.short}</span>`).join("")}</span></div>`;
  }).join("");

  // plan: checkboxes, chips, day bars
  document.querySelectorAll("li.item").forEach(li => {
    const key = li.dataset.key;
    const mine = !!(me && state[me.player][key]);
    const inp = li.querySelector("input");
    inp.checked = mine;
    const lockedItem = ITEMS[key] && isLocked(ITEMS[key].day.idx);
    inp.disabled = !me || lockedItem;
    inp.title = !me ? "Log in to tick" : lockedItem ? "Finish the previous day to unlock" : "";
    li.classList.toggle("mine", mine);
    const chips = li.querySelectorAll(".chip");
    PLAYERS.forEach((p, i) => chips[i].classList.toggle("on", !!state[p.id][key]));
  });
  DAYS.forEach(dd => {
    const el = $("day" + (dd.idx + 1)); if (!el) return;
    const items = dayItems(dd);
    const n = { rao: 0, aneeq: 0 };
    items.forEach(it => PLAYERS.forEach(p => { if (state[p.id][it.key]) n[p.id]++; }));
    const nav = $("nav" + (dd.idx + 1));
    [el, nav].forEach(box => {
      box.querySelector(".bar.r i").style.width = n.rao / items.length * 100 + "%";
      box.querySelector(".bar.a i").style.width = n.aneeq / items.length * 100 + "%";
      box.querySelector(".nr").textContent = `R ${n.rao}/${items.length}`;
      box.querySelector(".na").textContent = `A ${n.aneeq}/${items.length}`;
    });
    const locked = isLocked(dd.idx);
    el.classList.toggle("locked", locked);
    nav.classList.toggle("locked", locked);
    const doneMine = !!me && dayComplete(me.player, dd);
    nav.classList.toggle("complete", doneMine);
    nav.querySelector(".lk").textContent = locked ? "🔒" : doneMine ? "✓" : "";
    nav.title = locked ? `Finish Day ${dd.idx} to unlock` : "";
    const msg = el.querySelector(".lockmsg");
    if (locked) {
      const left = requiredItems(DAYS[dd.idx - 1]).filter(it => !state[me.player][it.key]).length;
      msg.textContent = dd.idx === unlockedCount(me.player)
        ? `🔒 Finish Day ${dd.idx} to unlock (${left} left)`
        : `🔒 Locked · finish Day ${dd.idx} first`;
    } else msg.textContent = "";
  });

  // announce a newly unlocked day
  if (me) {
    const u = unlockedCount(me.player);
    if (lastUnlocked !== null && u > lastUnlocked && u <= DAYS.length) {
      toast(`🔓 Day ${u} unlocked. ${rival(me.player).short} can't rest now.`, me.player);
      selectDay(u - 1, true);
    }
    lastUnlocked = u;
  } else lastUnlocked = null;

  if (selected === null || isLocked(selected)) selectDay(defaultDay());
}

function relTime(ts){
  const s = Math.max(0, (Date.now() + serverOffset - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}

// ---------- toasts ----------
function toast(msg, pid, isErr){
  const el = document.createElement("div");
  el.className = "toast" + (isErr ? " err" : "");
  if (pid) el.dataset.p = pid;
  el.textContent = msg;
  $("toasts").appendChild(el);
  setTimeout(() => el.remove(), 5000);
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
    if (pending > 0) return; // don't overwrite an in-flight tick
    serverOffset = data.now - Date.now();
    state = { rao: data.players.rao || {}, aneeq: data.players.aneeq || {} };
    events = data.events || [];
    const fresh = events.filter(e => !seen.has(e.player + e.key + e.ts));
    events.forEach(e => seen.add(e.player + e.key + e.ts));
    if (loaded) {
      fresh.filter(e => !me || e.player !== me.player).slice(0, 3).reverse().forEach(e => {
        const m = ITEMS[e.key]; if (!m) return;
        const what = m.it.k === "p" || m.it.k === "x" ? `solved ${m.it.n ? "#" + m.it.n + " " : ""}${m.it.t}` : `finished "${m.it.t}"`;
        toast(`${byId[e.player].short} just ${what} (+${pts(e.key, e.ts)}). Your move.`, e.player);
        if (document.hidden) { unseen++; document.title = `(${unseen}) ${byId[e.player].short} is scoring…`; }
      });
    }
    loaded = true;
    $("status").textContent = "Live · updates every 15 s";
    $("status").classList.remove("err");
    updateAll();
  } catch (e) {
    $("status").textContent = location.protocol === "file:"
      ? "Offline: open the Vercel URL (or run `vercel dev`) to see the live scoreboard."
      : `Can't reach the scoreboard: ${e.message}`;
    $("status").classList.add("err");
  }
}

document.addEventListener("change", async e => {
  const inp = e.target.closest("input[data-key]");
  if (!inp || !me) return;
  const key = inp.dataset.key, on = inp.checked, pid = me.player;
  if (ITEMS[key] && isLocked(ITEMS[key].day.idx)) { inp.checked = !on; toast("That day is still locked. Finish the previous day first.", null, true); return; }
  const prev = state[pid][key];
  const S0 = stats(pid);
  if (on) state[pid][key] = Date.now() + serverOffset; else delete state[pid][key];
  updateAll();
  pending++;
  try {
    const r = await api("/api/tick", { player: pid, pin: me.pin, key, done: on });
    if (on && r.ts) state[pid][key] = r.ts;
    if (on) {
      const got = pts(key, state[pid][key]);
      const S1 = stats(pid);
      const rv = stats(rival(pid).id);
      let msg = `+${got}${onTime(key, state[pid][key]) ? " (on-time bonus)" : ""}`;
      if (S0.score <= rv.score && S1.score > rv.score) msg += `. You just passed ${rival(pid).short}!`;
      else if (S1.score > rv.score) msg += `. Lead: +${S1.score - rv.score}`;
      else msg += `. ${rv.score - S1.score} behind ${rival(pid).short}`;
      if (S0.todayCount === STREAK_MIN - 1 && S1.todayCount === STREAK_MIN) msg += " · streak secured for today 🔥";
      toast(msg, pid);
    }
  } catch (err) {
    if (prev) state[pid][key] = prev; else delete state[pid][key];
    toast(err.status === 401 ? "Your PIN was rejected. Log in again." : `Not saved: ${err.message}`, null, true);
    if (err.status === 401) { me = null; saveMe(); renderWho(); openLogin(); }
  } finally {
    pending--;
    updateAll();
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
    renderWho(); updateAll();
    toast(`Welcome, ${byId[picked].short}. ${rival(picked).short} is waiting.`, picked);
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
  selectDay(Number(b.dataset.idx), matchMedia("(max-width: 860px)").matches);
});
setInterval(tickClock, 1000);

// ---------- boot ----------
buildPlan();
renderWho();
updateAll();
let watching = false;
try { watching = localStorage.getItem("arena-watch") === "1"; } catch (e) {}
if (!me && !watching && location.protocol !== "file:") openLogin();
poll();
setInterval(poll, POLL_MS); // keeps running in background tabs so the title can flash
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) { unseen = 0; document.title = "Rao vs Aneeq Sprint"; poll(); }
});
setInterval(updateAll, 20000); // rotate reality checks, refresh relative times, day rollover
})();
