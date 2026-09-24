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
3. In **Settings → Environment Variables**, add `RAO_PIN` and `ANEEQ_PIN`
   (6+ characters each). Each of you keeps your own PIN private.
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

## Scoring

- DSA problem 10, SQL problem 8, task 5, read/watch 4, revision 6, job applications 3.
- ×1.5 if ticked on the item's scheduled day.
- Daily duel: more on-time points on that day's plan wins the day.
- Streak: consecutive days with 5+ ticks.

## Data

Redis keys: `sprint:done:rao` and `sprint:done:aneeq` (hash: item key → tick time)
and `sprint:events` (activity feed). To reset the competition, delete those keys
in the Upstash console.

To change the plan, edit `plan.js`. Item keys are `d<day>-<track>-<index>`, so
don't reorder items inside a day once you've started ticking.
