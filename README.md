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

## The plan

30 days, Mon 28 Sep → Tue 27 Oct 2026. Every day has 4 containers with 5 items each:

| Container | Source (followed in its own order) |
|---|---|
| 🧠 LeetCode DSA | NeetCode 150 roadmap: 130 free problems, each with its NeetCode video |
| 🧩 OOP & LLD | AlgoMaster LLD course (free chapters) → AlgoMaster concurrency → LLD interview problems (AlgoMaster + github.com/ashishps1/awesome-low-level-design) |
| 🗄️ Database / SQL | LeetCode SQL 50 (study-plan order) + 9 classic LeetCode DB problems → all 71 PGExercises |
| 🏗️ System Design | AlgoMaster system design course (free chapters) → AlgoMaster interview course → problem videos from github.com/ashishps1/awesome-system-design-resources |

Sundays (days 7, 14, 21, 28) revisit 5 of that week's hardest items per container.
The next day unlocks only when all 20 items of the current day are ticked (per player).
To change the content, edit `plan.js`.

## Data

Redis keys: `sprint2:done:rao` and `sprint2:done:aneeq` (hash: item key → tick time).
The old plan's `sprint:*` keys are left untouched and unused. To reset progress, delete the `sprint2:*` keys
in the Upstash console.

To change the plan, edit `plan.js`. Item keys are `d<day>-<track>-<index>`, so
don't reorder items inside a day once you've started ticking.
