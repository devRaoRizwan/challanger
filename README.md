# DSA Interview Journey

A local-first, day-by-day DSA learning plan for **Monday, October 12 through
Thursday, December 31, 2026**. The schedule is based on the course sequence in
`Master DSA using GFG and Leetcode - Sheet1.csv`.

There are 81 dated sessions, including a final mock-interview day. The source
sheet contributes 267 lessons and practice entries. Each day also has a rotating
interview warm-up with an answer that stays hidden until you mark that you have
attempted it.

## Daily study rhythm

The planned session is about 3 hours 50 minutes:

1. **15 min — Arrive and recall:** retrieve yesterday's idea without notes.
2. **45 min — Understand the idea:** read the short explanation and watch a
   concept lesson when one is available.
3. **55 min — Work through examples:** trace examples, then work on the course
   items.
4. **15 min — Break:** step away from the screen.
5. **70 min — Interview practice:** attempt the daily warm-up and explain your
   choices aloud.
6. **30 min — Review:** write the pattern, complexity, edge cases, and what to
   revisit.

Sundays keep the same structure but emphasize re-solving a question from that
week. There are no streaks, locks, or penalties for taking longer.

## Learning sequence

The plan starts with complexity, basic math, recursion fundamentals, hashing,
sorting, and arrays. It then moves through binary search, strings, linked lists,
bit manipulation, recursion/backtracking, stacks and queues, sliding windows,
greedy methods, trees, heaps, graphs, dynamic programming, and tries. Graphs
and dynamic programming are intentionally late in the sequence.

The course sheet contains explanatory videos and article titles, but some cells
do not include direct URLs. The app keeps available YouTube links, creates
problem links for LeetCode entries, and provides a web search for GFG entries.
For practice tasks, solution resources remain hidden until you record an attempt.

## Progress and privacy

Progress is stored in this browser's `localStorage`; there is no backend,
database, login, analytics, or reminder service. The same browser profile is
needed to retain progress. Clearing site data will remove it.

## Run locally

Serve the project directory with any static file server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project files

- `index.html` — daily plan interface
- `styles.css` — responsive visual design
- `plan.js` — all 81 dated sessions and course entries
- `app.js` — session rendering, interview prompts, and local progress
- `Master DSA using GFG and Leetcode - Sheet1.csv` — original course outline
