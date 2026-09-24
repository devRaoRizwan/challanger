// POST /api/tick: tick or untick one item for one player. Needs that player's PIN.
//   { player, pin, check: true }         -> just verifies the PIN (login)
//   { player, pin, key, done: true }     -> tick (server records the time)
//   { player, pin, key, done: false }    -> untick
// PINs come from env vars RAO_PIN and ANEEQ_PIN.
import { timingSafeEqual } from "node:crypto";
import { redis, PLAYERS } from "./_redis.js";

const KEY_RE = /^d\d{1,2}-(dsa|sql|py|sd|job|rev|qz)-\d{1,2}$/;
const MAX_FAILS = 10; // wrong PINs allowed per player per 15 minutes

function pinMatches(player, pin) {
  const expected = process.env[`${player.toUpperCase()}_PIN`];
  if (!expected || typeof pin !== "string") return false;
  const a = Buffer.from(pin);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const { player, pin, key, done, check } = req.body || {};
  if (!PLAYERS.includes(player)) return res.status(400).json({ error: "Unknown player" });

  try {
    const failKey = `sprint:fail:${player}`;
    const [fails] = await redis([["GET", failKey]]);
    if (Number(fails) >= MAX_FAILS) {
      return res.status(429).json({ error: "Too many wrong PINs. Try again in 15 minutes." });
    }
    if (!pinMatches(player, pin)) {
      await redis([["INCR", failKey], ["EXPIRE", failKey, 900]]);
      return res.status(401).json({ error: "Wrong PIN" });
    }
    if (check) return res.status(200).json({ ok: true });

    if (typeof key !== "string" || !KEY_RE.test(key)) {
      return res.status(400).json({ error: "Unknown item" });
    }
    const ts = Date.now();
    if (done) {
      // HSETNX keeps the first tick time, so re-ticking can't farm on-time bonuses.
      const [added] = await redis([["HSETNX", `sprint:done:${player}`, key, String(ts)]]);
      if (added === 1) {
        await redis([
          ["LPUSH", "sprint:events", JSON.stringify({ player, key, ts })],
          ["LTRIM", "sprint:events", 0, 199],
        ]);
      }
    } else {
      await redis([["HDEL", `sprint:done:${player}`, key]]);
    }
    return res.status(200).json({ ok: true, ts });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
