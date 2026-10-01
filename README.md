# Rao vs Aneeq: 30-day backend interview sprint

A static page (`index.html`, `styles.css`, `plan.js`, `app.js`) with two Vercel
functions (`api/state.js`, `api/tick.js`) that store both players' progress in
Upstash Redis. No build step and no npm dependencies.

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it at vercel.com/new.
   Framework preset: **Other**. Leave the build command empty.
   (Or run `npx vercel` in this folder.)
2. In the project, open **Storage → Create Database → Upstash for Redis** (free plan)
   and connect it to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. In **Settings → Environment Variables**, add `RAO_PIN`
   (6+ characters). Keep it private: it is what lets you tick problems.
4. **Redeploy** so the functions pick up the variables.
5. Open the URL, pick your name and enter your PIN. Anyone without a PIN can only watch.

## Run locally

```bash
npm i -g vercel
vercel link              # connect to the Vercel project
vercel env pull .env.local
vercel dev               # http://localhost:3000
```

Opening `index.html` directly from disk shows the plan, but not the live scoreboard.

## The plan

62 days, Mon 5 Oct → Sat 5 Dec 2026, DSA + SQL only, for one person (PIN in `RAO_PIN`).
It's told as a story: chapters build on each other, and every study day stays inside one chapter.

- **DSA (18 chapters):** the NeetCode 150 roadmap, all 143 free problems, each with its NeetCode video, plus 96 warm-ups.
- **SQL (12 chapters):** LeetCode SQL 50 → 9 classic LeetCode database problems → PGExercises (joins, aggregation, timestamps, recursive). 96 problems, plus 48 raw-query exercises.
- **Mon–Sat, weeks 1–8:** 2 DSA warm-ups (easy, same pattern) + about 3 main DSA, and about 2 LeetCode SQL + 1 raw-query
  exercise from [sql-practice.online](https://www.sql-practice.online/scenario) on the same topic. All are needed to unlock the next day.
  Each chapter opens with a note: what it builds on and what to know.
- **Sundays:** checkpoint. Re-solve that week's 5 hardest DSA and 3 hardest SQL problems.
- **Week 9 (30 Nov – 5 Dec):** mock interviews. Timed re-solves picked from across the plan.
- Days lock: the next day opens only when the current one is fully done. The header shows your streak, problems solved, and whether you're on track or behind; the quote reacts to it.

Content lives in `plan.js` (problems), `story.js` (DSA chapter notes, SQL "builds on"), `primers.js` (SQL notes).

## Data

Redis key: `sprint3:done:rao` (hash: item key → tick time).
Older `sprint:*` and `sprint2:*` keys are left untouched and unused. To reset progress, delete the `sprint3:*` keys
in the Upstash console.

To change the plan, edit `plan.js`. Item keys are `d<day>-<lc|sql>-<index>`, so
don't reorder items inside a day once you've started ticking.
