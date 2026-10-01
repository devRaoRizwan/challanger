// The story: each chapter builds on the ones before it.
// DSA chapters follow the NeetCode 150 roadmap; SQL chapters follow SQL 50 → classic problems → PGExercises.
// "builds" names the earlier chapter(s) this one stands on; "text" is the idea to understand before solving.
window.STORY = {
  dsa: {
    "Arrays & Hashing": {
      builds: "Nothing. This is the foundation every later chapter uses.",
      text: "A hash map or set gives O(1) lookups, which turns 'search the array again' (O(n²)) into one pass (O(n)). The pattern: walk the array once, store what you've seen (value → index or count), and ask the map instead of looping again.",
    },
    "Two Pointers": {
      builds: "Arrays & Hashing: same arrays, but now without the extra memory.",
      text: "When the array is sorted (or you can sort it), two indices walking toward each other replace the hash map with O(1) extra space. Move the pointer that makes the answer better; each move rules out one candidate, so the whole scan is O(n).",
    },
    "Sliding Window": {
      builds: "Two Pointers: the pointers now move in the same direction.",
      text: "Grow the right edge; shrink the left edge whenever the window breaks the rule. Keep a running count or sum (often a hash map from chapter 1) so each step is O(1). Know both kinds: fixed-size windows and variable-size windows.",
    },
    "Stack": {
      builds: "Arrays: a list you only touch at one end.",
      text: "Last in, first out. Use a stack when the most recent unfinished item decides what happens next: matching brackets, evaluating expressions, generating valid sequences. A monotonic stack (kept increasing or decreasing) finds the next greater or smaller element in O(n).",
    },
    "Binary Search": {
      builds: "Two Pointers on sorted arrays: lo and hi close in by halves.",
      text: "Halve the search space each step for O(log n). Beyond 'find x in a sorted array', binary search on the answer: if you can check 'is speed k enough?' and the answer only flips once, search over k. Be exact with lo / hi and mid = (lo + hi) // 2.",
    },
    "Linked List": {
      builds: "Two Pointers (fast and slow) and Arrays & Hashing (LRU Cache).",
      text: "Nodes and pointers instead of indices. Most problems are pointer rewiring (reverse, merge, reorder), so draw it before you code. A dummy head removes edge cases; fast and slow pointers find the middle and detect cycles; a hash map plus a doubly linked list gives an O(1) LRU cache.",
    },
    "Trees": {
      builds: "Linked List (nodes with two next pointers) and Binary Search (BST ordering).",
      text: "Almost every tree problem is DFS recursion: solve the left and right subtrees, then combine at the node. BFS with a queue gives level-by-level answers. In a BST, left < node < right, so you can skip half the tree, which is binary search again.",
    },
    "Tries": {
      builds: "Trees (each node has children) and Arrays & Hashing (children stored in a dict).",
      text: "A tree where each edge is one character. Insert and search a word in O(length of word), and prefix queries become cheap. This is the structure behind autocomplete, and the final problem combines it with grid DFS.",
    },
    "Heap / Priority Queue": {
      builds: "Trees: a complete binary tree stored in an array.",
      text: "A heap always gives the smallest item in O(1), with push and pop in O(log n); Python's heapq is a min-heap (negate values for a max-heap). For top-k problems keep a heap of size k; two heaps (a max-heap and a min-heap) track a running median.",
    },
    "Backtracking": {
      builds: "Trees (recursion) and Stack (the path you push and pop).",
      text: "DFS over a tree of decisions: choose, recurse, un-choose. Subsets, combinations and permutations all use the same template; prune branches that can't lead to a valid answer. Copy the path (path[:]) when you record a result.",
    },
    "Graphs": {
      builds: "Trees (BFS / DFS) and Backtracking, now with cycles, so you track visited.",
      text: "Nodes can have many neighbours and cycles, so keep a visited set. A grid is a graph with 4 neighbours per cell. BFS gives the shortest path in unweighted graphs; topological sort handles dependencies (course schedule); union-find answers 'are these connected?'.",
    },
    "Advanced Graphs": {
      builds: "Graphs plus Heap: weighted edges need a priority queue.",
      text: "Dijkstra is BFS with a min-heap for shortest paths on weighted graphs. Prim's algorithm builds a minimum spanning tree the same way. When the number of stops is limited, relax edges round by round (Bellman-Ford style). Eulerian paths (itinerary) use DFS that adds nodes on the way back.",
    },
    "1-D Dynamic Programming": {
      builds: "Backtracking: the same recursion, but you remember answers instead of recomputing them.",
      text: "Define dp[i] as the best answer for the first i items, write how dp[i] uses dp[i-1], dp[i-2] and so on, set the base cases, then fill bottom-up. If the recurrence isn't obvious, write the recursive solution first and add memoization (@lru_cache).",
    },
    "2-D Dynamic Programming": {
      builds: "1-D Dynamic Programming: one more dimension.",
      text: "dp[i][j] over two strings, a grid, or (item, remaining capacity). Draw the table, decide what one cell means, fill it row by row, and often keep only one row of memory. Interval DP (burst balloons) and string matching (regex) are the hardest forms.",
    },
    "Greedy": {
      builds: "Dynamic Programming: when only the best previous choice matters, the table collapses to one variable.",
      text: "Take the locally best choice and never look back. It only works when you can argue that choice never hurts. Kadane's algorithm (max subarray) and 'how far can I reach' scans (jump game) are the classic shapes.",
    },
    "Intervals": {
      builds: "Greedy plus sorting.",
      text: "Sort by start time (or end time), then sweep: merge when the next interval overlaps the current one, otherwise close it. Sorting by end time is the greedy rule for 'remove the fewest intervals'; a heap handles 'which interval is active now'.",
    },
    "Math & Geometry": {
      builds: "Arrays (2-D indexing) and Binary Search (fast power halves the exponent).",
      text: "Matrix tricks (rotate = transpose + reverse each row; spiral = shrink the four boundaries), digit arithmetic, and fast power (xⁿ by repeated squaring, O(log n)). Careful index bookkeeping is the whole game.",
    },
    "Bit Manipulation": {
      builds: "Math: numbers as binary. The final chapter.",
      text: "x & 1 checks odd or even; x & (x - 1) drops the lowest set bit; XOR cancels pairs (a ^ a = 0), which finds the single number. Shifts multiply or divide by 2. Use these to count bits and to add two numbers without +.",
    },
  },
  // SQL: what each chapter stands on (the topic explanation itself is in primers.js)
  sql: {
    "Select": "Nothing. The first building block: read rows and filter them.",
    "Basic Joins": "Select: now combine rows from two tables.",
    "Basic Aggregate Functions": "Basic Joins: join first, then summarize the rows.",
    "Sorting and Grouping": "Aggregates: compute them per group, then sort and filter the groups.",
    "Advanced Select and Joins": "Grouping and Joins: add CASE logic, UNION and window functions.",
    "Subqueries": "Everything so far: queries inside queries, CTEs and ranking.",
    "Advanced String Functions / Regex / Clause": "Select and Subqueries: transform and match text, remove duplicates.",
    "Classic Database Problems": "The whole SQL 50: classic interview problems that combine every chapter.",
    "PGExercises: Joins and Subqueries": "SQL 50 joins, now on a new schema (members, bookings, facilities).",
    "PGExercises: Aggregation": "Joins and Subqueries: heavy GROUP BY and window-function practice.",
    "PGExercises: Working with Timestamps": "Aggregation: group and calculate over dates and times.",
    "PGExercises: Recursive Queries": "CTEs from Subqueries: a CTE that refers to itself. The final chapter.",
  },
};
