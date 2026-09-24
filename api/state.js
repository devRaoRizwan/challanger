// GET /api/state: both players' ticks plus the recent activity feed.
// Public (read-only), so anyone with the link can watch the scoreboard.
import { redis, PLAYERS, hashToObject } from "./_redis.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET" });
  try {
    const out = await redis([
      ...PLAYERS.map((p) => ["HGETALL", `sprint:done:${p}`]),
      ["LRANGE", "sprint:events", 0, 59],
    ]);
    const players = {};
    PLAYERS.forEach((p, i) => {
      players[p] = Object.fromEntries(
        Object.entries(hashToObject(out[i])).map(([key, ts]) => [key, Number(ts)])
      );
    });
    const events = (out[PLAYERS.length] || [])
      .map((s) => { try { return JSON.parse(s); } catch { return null; } })
      .filter(Boolean);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ players, events, now: Date.now() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
