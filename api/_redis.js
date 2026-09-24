// Shared helpers for the API routes. Files starting with "_" are not deployed
// as routes by Vercel.
//
// Talks to Upstash Redis over its REST API, so there are no npm dependencies.
// Adding Upstash Redis from the Vercel Storage tab sets KV_REST_API_URL /
// KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).

export const PLAYERS = ["rao", "aneeq"];

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Runs several Redis commands in one round trip; returns their results in order.
export async function redis(commands) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error("Redis isn't connected. Add Upstash Redis in the Vercel project's Storage tab, then redeploy.");
  }
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis request failed (${res.status})`);
  const out = await res.json();
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

// HGETALL comes back as [field, value, field, value, ...] over REST.
export function hashToObject(result) {
  if (!result) return {};
  if (!Array.isArray(result)) return result;
  const obj = {};
  for (let i = 0; i < result.length; i += 2) obj[result[i]] = result[i + 1];
  return obj;
}
