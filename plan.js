window.PLAN = [
  {
    id: "hashing",
    title: "Arrays & Hashing",
    focus: "Learn how a map or set turns repeated searching into O(1) work.",
    insight: "When you keep track of what you have seen, you stop re-scanning the same data over and over.",
    steps: [
      { type: "concept", title: "Concept", text: "Hash maps and sets let you remember values as you move through the array. The usual move is: read a value, store it, then ask later whether it has already appeared." },
      { type: "warmup", title: "Warm-up: Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
      { type: "warmup", title: "Warm-up: Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/" },
      { type: "main", title: "Main: Valid Anagram", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/" },
      { type: "review", title: "Reflection", text: "What pattern did you use? Did you store counts, indices, or a set? Say it out loud before moving on." }
    ]
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    focus: "Use two moving indices when the array is sorted or when you need to shrink the search space.",
    insight: "One pointer moves from the left and the other from the right, eliminating impossible options as you go.",
    steps: [
      { type: "concept", title: "Concept", text: "Two pointers work well with sorted arrays or when you can compare the ends of a structure. Move the pointer that is making the answer worse, not the one that is just busy." },
      { type: "warmup", title: "Warm-up: Reverse String", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-string/" },
      { type: "warmup", title: "Warm-up: Move Zeroes", difficulty: "Easy", link: "https://leetcode.com/problems/move-zeroes/" },
      { type: "main", title: "Main: Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
      { type: "review", title: "Reflection", text: "Did you shrink the problem from both ends? Explain the pointer movement in one sentence." }
    ]
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    focus: "Keep a moving window and shrink or expand it as conditions change.",
    insight: "A window can be advanced without re-checking everything by keeping running sums or counts.",
    steps: [
      { type: "concept", title: "Concept", text: "You usually keep a right pointer expanding the window and a left pointer moving forward only when the window becomes invalid. This gives near-linear performance when done carefully." },
      { type: "warmup", title: "Warm-up: Maximum Average Subarray I", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-average-subarray-i/" },
      { type: "warmup", title: "Warm-up: Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { type: "main", title: "Main: Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { type: "review", title: "Reflection", text: "Did you maintain a running count or sum? If yes, explain how the window changed when it became invalid." }
    ]
  },
  {
    id: "stack",
    title: "Stack",
    focus: "Use a stack when the newest unfinished item controls the next move.",
    insight: "Stacks are the right structure whenever you want to process last-in-first-out behavior.",
    steps: [
      { type: "concept", title: "Concept", text: "Use a stack for matching pairs, evaluation, and monotonic relationships. The key question is: what is the most recent item that still matters?" },
      { type: "warmup", title: "Warm-up: Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },
      { type: "warmup", title: "Warm-up: Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
      { type: "main", title: "Main: Simplify Path", difficulty: "Medium", link: "https://leetcode.com/problems/simplify-path/" },
      { type: "review", title: "Reflection", text: "Can you explain why pushing and popping preserves the correct order? Say the stack logic in plain English." }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    focus: "Binary search works when the answer space is sorted and each check cuts it in half.",
    insight: "Sometimes the trick is not searching the array directly but searching over the answer itself.",
    steps: [
      { type: "concept", title: "Concept", text: "The search space shrinks by half every step. Use this when the array is sorted, or when the answer can be checked as true/false in a monotonic way." },
      { type: "warmup", title: "Warm-up: Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/" },
      { type: "warmup", title: "Warm-up: Search Insert Position", difficulty: "Easy", link: "https://leetcode.com/problems/search-insert-position/" },
      { type: "main", title: "Main: Guess Number Higher or Lower", difficulty: "Easy", link: "https://leetcode.com/problems/guess-number-higher-or-lower/" },
      { type: "review", title: "Reflection", text: "Did you shrink the search range correctly? Make sure your low/high boundary logic is crystal clear before continuing." }
    ]
  },
  {
    id: "tree-dfs",
    title: "Trees & DFS",
    focus: "Trees are solved by recursion: solve left, solve right, then combine the result.",
    insight: "A tree problem almost always becomes easier when you ask what each subtree can tell you.",
    steps: [
      { type: "concept", title: "Concept", text: "Recursive tree problems usually reduce to a simple pattern: process the node, recurse into left and right, then combine answers. Draw a small tree before writing code." },
      { type: "warmup", title: "Warm-up: Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { type: "warmup", title: "Warm-up: Same Tree", difficulty: "Easy", link: "https://leetcode.com/problems/same-tree/" },
      { type: "main", title: "Main: Invert Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/" },
      { type: "review", title: "Reflection", text: "What was the base case? What result did each subtree return to the parent node?" }
    ]
  },
  {
    id: "graphs",
    title: "Graphs",
    focus: "Graphs are about connectivity, visited states, and traversal order.",
    insight: "Use BFS for shortest path in unweighted graphs and DFS when exploring reachability.",
    steps: [
      { type: "concept", title: "Concept", text: "A graph is just a set of nodes with edges. Most problems rely on visited sets and a traversal strategy: BFS or DFS. Start with small examples and keep track of what has already been seen." },
      { type: "warmup", title: "Warm-up: Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/" },
      { type: "warmup", title: "Warm-up: Flood Fill", difficulty: "Easy", link: "https://leetcode.com/problems/flood-fill/" },
      { type: "main", title: "Main: Clone Graph", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/" },
      { type: "review", title: "Reflection", text: "How did you track visited nodes? Did you use BFS, DFS, or a queue? Explain the traversal clearly." }
    ]
  }
];
