// GET /api/remind?slot=morning|evening|night|test  →  sends you a WhatsApp message via CallMeBot.
//
// Call it from a scheduler (cron-job.org, or Vercel Cron in vercel.json). It's protected by a secret:
//   - Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" automatically when CRON_SECRET is set.
//   - Other schedulers add ?key=<CRON_SECRET> to the URL.
//
// Env vars:
//   CALLMEBOT_PHONE   your WhatsApp number with country code, e.g. +923001234567
//   CALLMEBOT_APIKEY  the apikey CallMeBot sent you on WhatsApp
//   CRON_SECRET       any long random string
//   REMIND_TZ         your timezone, e.g. Asia/Karachi (defaults to UTC)
//
// slot=morning  today's chapter and problem count (skipped if the day is already done)
// slot=evening  progress so far (skipped if done)
// slot=night    only sends if today isn't finished: the brutal one
// slot=test     always sends, so you can check the setup
import "../plan.js";
import { redis, NS } from "./_redis.js";

const PLAN = globalThis.PLAN;
const SITE = process.env.SITE_URL || "";

// Today's date (YYYY-MM-DD) in the given timezone.
function todayISO(tz) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
const itemsOf = (d) => d.lc.items.concat(d.sql.items);
const dayLabel = (d) =>
  d.type === "checkpoint" ? `Checkpoint (week ${d.week}): re-solve the week's hardest`
  : d.type === "mock" ? "Mock interview day: timed problems"
  : `Chapter ${d.lc.ch + 1}: ${d.lc.chName} (part ${d.lc.part}/${d.lc.parts}) · SQL: ${d.sql.chName}`;

const pick = (list) => list[Math.floor(Date.now() / 3.6e6) % list.length]; // rotates hourly
const NIGHT = [
  "You said you wanted this job. Your progress says you don't.",
  "Somewhere, someone less talented than you finished today's problems. You didn't.",
  "You're not tired. You're avoiding problems you can't solve yet.",
  "Every day you skip is a day you hand your offer to someone else.",
  "Average people stop here. Are you average?",
];
const EVENING = [
  "Half a day is a full excuse. Finish it.",
  "Stopping now is exactly what you'd tell yourself not to do.",
  "The evening is where people quit. Don't.",
];

async function sendWhatsApp(text) {
  const phone = process.env.CALLMEBOT_PHONE, apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) throw new Error("Set CALLMEBOT_PHONE and CALLMEBOT_APIKEY in Vercel.");
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const r = await fetch(url);
  const body = await r.text();
  if (!r.ok || /error|invalid|not allowed/i.test(body)) throw new Error(`CallMeBot: ${r.status} ${body.replace(/<[^>]+>/g, " ").trim().slice(0, 200)}`);
  return body;
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization || "";
  const key = (req.query && req.query.key) || "";
  if (!secret || (auth !== `Bearer ${secret}` && key !== secret)) {
    return res.status(401).json({ error: "Missing or wrong secret" });
  }
  const slot = (req.query && req.query.slot) || "night";
  try {
    const tz = process.env.REMIND_TZ || "UTC";
    const today = todayISO(tz);
    const idx = PLAN.days.findIndex((d) => d.date === today);
    const [hash] = await redis([["HGETALL", `${NS}:done:rao`]]);
    const done = new Set();
    if (Array.isArray(hash)) for (let i = 0; i < hash.length; i += 2) done.add(hash[i]);
    else if (hash) Object.keys(hash).forEach((k) => done.add(k));
    const complete = (d) => itemsOf(d).every((it) => done.has(it.key));

    let text;
    if (idx === -1) {
      const before = today < PLAN.days[0].date;
      if (slot !== "test") return res.status(200).json({ sent: false, reason: before ? "plan hasn't started" : "plan is over" });
      text = `*DSA + SQL plan*\nTest message: WhatsApp reminders work. ${before ? `The plan starts ${PLAN.days[0].date}.` : "The plan has ended."}`;
    } else {
      const day = PLAN.days[idx];
      const items = itemsOf(day);
      const n = items.filter((it) => done.has(it.key)).length;
      const behind = PLAN.days.slice(0, idx).filter((d) => !complete(d)).length;
      const finished = n === items.length;
      const head = `*Day ${idx + 1}/62* · ${dayLabel(day)}`;
      const status = `${n}/${items.length} done today${behind ? ` · *behind by ${behind} day${behind > 1 ? "s" : ""}*` : ""}`;
      const link = SITE ? `\n${SITE}` : "";

      if (slot === "test") text = `${head}\nTest message: reminders work.\n${status}${link}`;
      else if (finished) return res.status(200).json({ sent: false, reason: "today is done" });
      else if (slot === "morning") text = `${head}\n${items.length} problems today. Start now, not tonight.${behind ? `\nYou're already ${behind} day${behind > 1 ? "s" : ""} behind.` : ""}${link}`;
      else if (slot === "evening") text = `${head}\n${status}\n${pick(EVENING)}${link}`;
      else text = `${head}\n${status}\n*${n === 0 ? "Zero today." : `${items.length - n} left.`}* ${pick(NIGHT)}${link}`;
    }
    await sendWhatsApp(text);
    return res.status(200).json({ sent: true, slot, text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
