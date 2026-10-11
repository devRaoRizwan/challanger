# DSA Momentum

A calm, static DSA study tracker built for momentum instead of pressure.

This version is intentionally simple:

- DSA only
- no database
- no login
- no reminders
- no heavy tracking system
- just learning, practice, and momentum

## What changed

The app now focuses on the pattern you actually need:

1. Learn the concept in a small, readable way.
2. Do a tiny warm-up.
3. Solve a focused main problem.
4. Review what pattern you used.
5. Keep moving without guilt.

## How it works

- Each chapter has a pattern explanation.
- Each session includes very small steps, so it never feels like a burden.
- Progress is saved locally in the browser using `localStorage`.
- There is no backend, no Redis, and no database.

## Run locally

Open `index.html` directly in the browser, or serve the folder with any static server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Project structure

- `index.html` — app shell
- `styles.css` — calm visual design
- `plan.js` — DSA chapter plan and practice list
- `app.js` — rendering + local progress tracking

## Why this feels better

This version avoids the pressure model of locking days and tracking everything like a productivity system. It feels more like a gentle training routine:

- more explanation before effort
- smaller workloads
- easier recovery when you are tired
- no guilt loop when you skip a day

It is built to support consistent learning, not strict perfection.
