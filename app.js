const STORAGE_KEY = "dsa-interview-journey-2026";
const plan = window.PLAN;
const days = plan.days;
const phases = [
  ["arrive", "Recall", "15 min"],
  ["learn", "Learn", "45 min"],
  ["guided", "Practice", "55 min"],
  ["break", "Break", "15 min"],
  ["interview", "Interview", "70 min"],
  ["reflect", "Review", "30 min"],
];
function localISODate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
const interviewQuestions = [
  {
    title: "Reverse a string",
    prompt: "Return the characters of a string in reverse order. First describe an in-place two-pointer solution, then implement it.",
    link: "https://leetcode.com/problems/reverse-string/",
    answer: "def reverse_string(chars):\n    left, right = 0, len(chars) - 1\n    while left < right:\n        chars[left], chars[right] = chars[right], chars[left]\n        left += 1\n        right -= 1\n    return chars",
    note: "Swap the outer pair, move both pointers inward, and stop once they meet. Time O(n), extra space O(1) when reversing a mutable list.",
  },
  {
    title: "Check for a palindrome",
    prompt: "Return whether a string reads the same from both ends. For the interview version, ignore case and non-alphanumeric characters.",
    link: "https://leetcode.com/problems/valid-palindrome/",
    answer: "def is_palindrome(text):\n    left, right = 0, len(text) - 1\n    while left < right:\n        while left < right and not text[left].isalnum():\n            left += 1\n        while left < right and not text[right].isalnum():\n            right -= 1\n        if text[left].lower() != text[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True",
    note: "Compare the next relevant character at each end. This avoids allocating a cleaned copy: O(n) time and O(1) extra space.",
  },
  {
    title: "Check whether two strings are anagrams",
    prompt: "Decide whether two strings contain the same characters with the same frequencies. Explain how you handle case and spaces before coding.",
    link: "https://leetcode.com/problems/valid-anagram/",
    answer: "from collections import Counter\n\ndef are_anagrams(first, second):\n    return Counter(first) == Counter(second)",
    note: "A frequency map makes the requirement explicit. Time O(n + m), space O(k), where k is the number of distinct characters.",
  },
  {
    title: "Find the largest and second-largest values",
    prompt: "Return the two largest distinct values in one pass. State what you return if there is no second distinct value.",
    link: "",
    answer: "def two_largest(values):\n    largest = second = None\n    for value in values:\n        if largest is None or value > largest:\n            second, largest = largest, value\n        elif value != largest and (second is None or value > second):\n            second = value\n    return largest, second",
    note: "Maintain the best two distinct values seen so far. One pass takes O(n) time and O(1) extra space.",
  },
  {
    title: "Count character frequencies",
    prompt: "Build a map from each character to its number of occurrences. Then explain how you would use it to find the first unique character.",
    link: "",
    answer: "from collections import Counter\n\ndef character_counts(text):\n    return Counter(text)",
    note: "The map is updated once per character. Counting takes O(n) time and O(k) space for k distinct characters.",
  },
  {
    title: "Solve Two Sum",
    prompt: "Return the indices of two values that add to the target. Assume exactly one answer and do not use the same element twice.",
    link: "https://leetcode.com/problems/two-sum/",
    answer: "def two_sum(values, target):\n    seen = {}\n    for index, value in enumerate(values):\n        need = target - value\n        if need in seen:\n            return [seen[need], index]\n        seen[value] = index",
    note: "For each value, check whether its complement has already appeared, then store the current index. O(n) time and O(n) space.",
  },
  {
    title: "Move zeroes to the end",
    prompt: "Move every zero to the end of the array while preserving the order of non-zero values. Do it in place.",
    link: "https://leetcode.com/problems/move-zeroes/",
    answer: "def move_zeroes(values):\n    write = 0\n    for value in values:\n        if value != 0:\n            values[write] = value\n            write += 1\n    while write < len(values):\n        values[write] = 0\n        write += 1\n    return values",
    note: "The write pointer marks where the next non-zero belongs. This preserves order with O(n) time and O(1) extra space.",
  },
  {
    title: "Implement binary search",
    prompt: "Given a sorted array and a target, return its index or -1. State the interval invariant you maintain.",
    link: "https://leetcode.com/problems/binary-search/",
    answer: "def binary_search(values, target):\n    left, right = 0, len(values) - 1\n    while left <= right:\n        middle = left + (right - left) // 2\n        if values[middle] == target:\n            return middle\n        if values[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1",
    note: "With a closed interval, keep left <= right and remove middle after checking it. O(log n) time and O(1) extra space.",
  },
  {
    title: "Validate balanced parentheses",
    prompt: "Given brackets containing (), [], and {}, decide whether they are balanced and correctly nested.",
    link: "https://leetcode.com/problems/valid-parentheses/",
    answer: "def valid_parentheses(text):\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack = []\n    for char in text:\n        if char in pairs.values():\n            stack.append(char)\n        elif not stack or stack.pop() != pairs.get(char):\n            return False\n    return not stack",
    note: "The most recent unmatched opener must close first, so a stack matches the nesting rule. O(n) time and O(n) space.",
  },
  {
    title: "Reverse a linked list",
    prompt: "Reverse a singly linked list iteratively. Before coding, name what prev, current, and next will mean.",
    link: "https://leetcode.com/problems/reverse-linked-list/",
    answer: "def reverse_list(head):\n    previous = None\n    current = head\n    while current:\n        following = current.next\n        current.next = previous\n        previous = current\n        current = following\n    return previous",
    note: "Save the next node before changing the link. Each pointer moves once: O(n) time and O(1) extra space.",
  },
];

function readState() {
  const today = localISODate();
  const current = days.findIndex((day) => day.iso === today);
  const defaultDay = current < 0 ? (today < plan.start ? 0 : days.length - 1) : current;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      selected: Number.isInteger(saved.selected) ? Math.min(Math.max(saved.selected, 0), days.length - 1) : defaultDay,
      completed: saved.completed && typeof saved.completed === "object" ? saved.completed : {},
      attempted: saved.attempted && typeof saved.attempted === "object" ? saved.attempted : {},
      weekly: saved.weekly && typeof saved.weekly === "object" ? saved.weekly : {},
    };
  } catch {
    return { selected: defaultDay, completed: {}, attempted: {}, weekly: {} };
  }
}

const state = readState();
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const iconPaths = {
  left: '<path d="m14 18-6-6 6-6"/>',
  right: '<path d="m10 18 6-6-6-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  circle: '<circle cx="12" cy="12" r="8"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a14 14 0 0 1-3 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3-.5"/>',
  external: '<path d="M14 3h7v7M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  reset: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/>',
};
const icon = (name) => `<svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;
const keyFor = (day, item) => `${day.iso}:${item.id}`;
const safeUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : "";
  } catch {
    return "";
  }
};
const link = (url, label, className = "resource-link") => {
  const href = safeUrl(url);
  return href ? `<a class="${className}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${icon("external")}<span>${escapeHtml(label)}</span></a>` : "";
};
const displayDate = (iso, options = { weekday: "long", day: "numeric", month: "long" }) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", options);
const currentDay = () => days[state.selected];
const challengeFor = (day) => interviewQuestions[day.index % interviewQuestions.length];
const challengeKey = (day) => `${day.iso}:interview`;
let celebrationTimer;
function celebrateCompletion() {
  const layer = $("#celebration-layer");
  const colors = ["#36738a", "#4b91a1", "#398457", "#e3ad55", "#e47d63", "#f2c14e", "#6fbf9a", "#ef8c79"];
  const confetti = Array.from({ length: 180 }, (_, index) => {
    const left = Math.random() * 100;
    const drift = Math.round(Math.random() * 320 - 160);
    const delay = (Math.random() * 0.9).toFixed(2);
    const size = Math.round(6 + Math.random() * 8);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = index % 4 === 0 ? "round" : index % 4 === 1 ? "long" : "square";
    return `<i class="confetti-piece ${shape}" style="left:${left}vw;--drift:${drift}px;--delay:${delay}s;--size:${size}px;background:${color}"></i>`;
  }).join("");
  layer.innerHTML = `${confetti}<div class="celebration-toast" role="status"><span class="celebration-emoji" aria-hidden="true">🎉</span><span><strong>Well done!</strong><small>Step complete. Keep it going.</small></span><span class="celebration-poppers" aria-hidden="true">🎊 🎉</span></div>`;
  clearTimeout(celebrationTimer);
  celebrationTimer = setTimeout(() => { layer.innerHTML = ""; }, 3200);
}
const dayComplete = (day) =>
  day.tasks.every((task) => state.completed[keyFor(day, task)]) &&
  !!state.completed[challengeKey(day)];

function persist() {
  const status = $("#save-status");
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    status.textContent = "Progress is saved in this browser only.";
    status.classList.remove("save-error");
  } catch (error) {
    status.textContent = `Could not save progress in this browser: ${error.message}`;
    status.classList.add("save-error");
  }
}

function selectDay(index) {
  state.selected = Math.min(Math.max(index, 0), days.length - 1);
  persist();
  render();
}

function renderWeeks() {
  const weeks = new Map();
  for (const day of days) {
    if (!weeks.has(day.week)) weeks.set(day.week, []);
    weeks.get(day.week).push(day);
  }
  $("#week-list").innerHTML = [...weeks.entries()].map(([week, weekDays]) => {
    const selected = currentDay().week === week;
    const first = weekDays[0];
    const last = weekDays[weekDays.length - 1];
    const complete = weekDays.filter(dayComplete).length;
    return `
      <button class="week-button ${selected ? "active" : ""}" type="button" data-week="${week}">
        <span class="week-index">W${String(week).padStart(2, "0")}</span>
        <span class="week-copy">
          <strong>${escapeHtml(first.parent)}</strong>
          <small>${displayDate(first.iso, { day: "numeric", month: "short" })}–${displayDate(last.iso, { day: "numeric", month: "short" })} · ${complete}/${weekDays.length} days</small>
        </span>
        <span class="week-chevron" aria-hidden="true">${icon("right")}</span>
      </button>
    `;
  }).join("");
  $("#week-list").querySelectorAll("[data-week]").forEach((button) => {
    button.addEventListener("click", () => {
      const week = Number(button.dataset.week);
      const firstDay = days.find((day) => day.week === week);
      selectDay(firstDay.index);
    });
  });
  const doneDays = days.filter(dayComplete).length;
  $("#overall-label").textContent = `${doneDays} of ${days.length} sessions completed`;
  $("#overall-bar").style.width = `${(doneDays / days.length) * 100}%`;
}

function renderDayPicker() {
  const weekDays = days.filter((day) => day.week === currentDay().week);
  $("#day-picker").innerHTML = weekDays.map((day) => `
    <button class="date-chip ${day.index === state.selected ? "active" : ""} ${dayComplete(day) ? "complete" : ""}"
      type="button" data-day="${day.index}" aria-current="${day.index === state.selected ? "date" : "false"}">
      <span>${day.weekday.slice(0, 3)}</span>
      <strong>${displayDate(day.iso, { day: "numeric" })}</strong>
      <small>${dayComplete(day) ? "Done" : day.isCapstone ? "Mock" : "Study"}</small>
    </button>
  `).join("");
  $("#day-picker").querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => selectDay(Number(button.dataset.day)));
  });
}

function renderSession(day) {
  $("#day-heading").textContent = `Day ${day.index + 1} of ${days.length}`;
  $("#day-subheading").textContent = `${displayDate(day.iso)} · Week ${day.week} of 12`;
  $("#prev-day").disabled = day.index === 0;
  $("#next-day").disabled = day.index === days.length - 1;
  $("#task-count").textContent = `${day.tasks.length + 1} steps · follow in order`;

  const completed = day.tasks.filter((task) => state.completed[keyFor(day, task)]).length +
    (state.completed[challengeKey(day)] ? 1 : 0);
  const total = day.tasks.length + 1;
  const sunday = day.weeklyReview;
  $("#session-card").innerHTML = `
    <div class="session-top">
      <div>
        <p class="eyebrow">${sunday ? "Sunday interview lab" : day.isCapstone ? "Final practice" : "Today's session"}</p>
        <h2>${sunday ? "Consolidate, don't cram." : day.isCapstone ? "Practice being interview-ready." : "A steady session. No race."}</h2>
        <p>${sunday
          ? "Today is still a learning day, but make the emphasis review: revisit a question from this week before opening a new solution."
          : "The schedule makes room for understanding, a real break, practice, and a calm review."}</p>
      </div>
      <div class="session-progress" aria-label="${completed} of ${total} practice steps complete">
        <strong>${completed}<span>/${total}</span></strong>
        <small>steps done</small>
      </div>
    </div>
    <div class="session-timeline">
      ${phases.map(([id, title, duration, detail], index) => `
        <div class="phase">
          <span class="phase-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="phase-copy"><strong>${title}</strong></span>
          <span class="phase-duration">${duration}</span>
        </div>
      `).join("")}
    </div>
    ${sunday ? `
      <label class="weekly-check">
        <input type="checkbox" data-weekly="${day.iso}" ${state.weekly[day.iso] ? "checked" : ""}>
        <span>Re-solved one question from this week without notes</span>
      </label>` : ""}
  `;
  $("#session-card").querySelectorAll("[data-weekly]").forEach((input) => {
    input.addEventListener("change", () => {
      state.weekly[day.iso] = input.checked;
      persist();
    });
  });
}

function renderLesson(day) {
  $("#lesson-card").innerHTML = `
    <div class="lesson-icon" aria-hidden="true">✦</div>
    <div class="lesson-copy">
      <p class="eyebrow">Before you code · ${escapeHtml(day.parent)}${day.part ? ` · Part ${day.part} of ${day.parts}` : ""}</p>
      <h2>${escapeHtml(day.focus)}</h2>
      <p>${escapeHtml(day.explanation)}</p>
    </div>
  `;
}

function renderTask(day, task, order) {
  const key = keyFor(day, task);
  const completed = !!state.completed[key];
  const attempted = !!state.attempted[key];
  const videoLink = link(task.video, task.isTheory ? "Watch the concept lesson" : "Watch the explanation");
  const problemLink = link(task.problemUrl, "Open the problem", "primary-link");
  const articleLink = task.article
    ? link(task.article, "Read the reference")
    : task.articleTitle
      ? link(`https://www.google.com/search?q=${encodeURIComponent(task.articleTitle)}`, "Find this article")
      : "";
  const helpLinks = [videoLink, articleLink].filter(Boolean).join("");
  const isReview = task.sourceStatus === "Completed";

  return `
    <article class="course-task ${completed ? "completed" : ""}">
      <div class="task-marker" aria-label="Step ${order}${completed ? ", completed" : ""}">${String(order).padStart(2, "0")}</div>
      <div class="course-task-content">
        <div class="task-heading">
          <div>
            <p class="task-kicker">${task.isTheory ? "Concept lesson" : isReview ? "Revisit from course sheet" : "Practice"}</p>
            <h3>${escapeHtml(task.title)}</h3>
          </div>
          <button class="complete-button ${completed ? "marked" : ""}" type="button" data-complete="${escapeHtml(key)}">
            ${icon(completed ? "check" : "circle")}<span>${completed ? "Done" : "Mark done"}</span>
          </button>
        </div>
        <p class="task-source">${escapeHtml(task.platform || "Course exercise")}</p>
        <div class="task-links">
          ${task.isTheory ? videoLink : problemLink}
          ${!task.isTheory && task.problemUrl && attempted && helpLinks ? `<span class="help-links">${helpLinks}</span>` : ""}
          ${!task.isTheory && !task.problemUrl && attempted && helpLinks ? `<span class="help-links">${helpLinks}</span>` : ""}
        </div>
        ${!task.isTheory && (task.video || task.article || task.articleTitle) ? `
          <button class="attempt-button ${attempted ? "attempted" : ""}" type="button" data-attempt="${escapeHtml(key)}">
            ${icon(attempted ? "eyeOff" : "eye")}<span>${attempted ? "Hide support" : "Reveal support"}</span>
          </button>
        ` : ""}
      </div>
    </article>
  `;
}

function renderChallenge(day) {
  const challenge = challengeFor(day);
  const key = challengeKey(day);
  const attempted = !!state.attempted[key];
  const completed = !!state.completed[key];
  return `
    <article class="interview-question ${completed ? "completed" : ""}">
      <span class="interview-step">${String(day.tasks.length + 1).padStart(2, "0")} · Final step</span>
      <div class="interview-heading">
        <div>
          <p class="eyebrow">Daily interview warm-up · 20–30 min</p>
          <h2>${escapeHtml(challenge.title)}</h2>
        </div>
        <button class="complete-button ${completed ? "marked" : ""}" type="button" data-complete="${escapeHtml(key)}">
          ${icon(completed ? "check" : "circle")}<span>${completed ? "Done" : "Mark done"}</span>
        </button>
      </div>
      <p class="question-prompt">${escapeHtml(challenge.prompt)}</p>
      ${link(challenge.link, "Open related practice problem")}
      <button class="attempt-button ${attempted ? "attempted" : ""}" type="button" data-attempt="${escapeHtml(key)}">
        ${icon(attempted ? "eyeOff" : "eye")}<span>${attempted ? "Hide answer" : "Reveal answer"}</span>
      </button>
      ${attempted ? `
        <div class="answer-panel">
          <p class="answer-label">One possible answer · Python</p>
          <pre><code>${escapeHtml(challenge.answer)}</code></pre>
          <p>${escapeHtml(challenge.note)}</p>
        </div>` : `
        <p class="answer-promise">The answer stays hidden until you tell the app you have attempted it.</p>
      `}
    </article>
  `;
}

function renderTasks(day) {
  $("#task-list").innerHTML = day.tasks.map((task, index) => renderTask(day, task, index + 1)).join("");
  $("#task-list").querySelectorAll("[data-complete]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.complete;
      const completing = !state.completed[key];
      if (completing) {
        state.completed[key] = true;
        celebrateCompletion();
      } else {
        delete state.completed[key];
      }
      persist();
      render();
    });
  });
  $("#task-list").querySelectorAll("[data-attempt]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.attempt;
      state.attempted[key] = !state.attempted[key];
      if (!state.attempted[key]) delete state.attempted[key];
      persist();
      render();
    });
  });
}

function renderDashboard() {
  const completed = Object.keys(state.completed).filter(k => k.includes(":csv-") || k.includes(":interview")).length;
  const totalTasks = days.reduce((sum, d) => sum + d.tasks.length + 1, 0);
  const completionPercent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  // This week stats
  const currentDayObj = currentDay();
  const currentWeekNum = currentDayObj.week;
  const weekDays = days.filter(d => d.week === currentWeekNum);
  const weekCompleted = weekDays.reduce((sum, d) => {
    const dayTasks = d.tasks.filter(t => state.completed[keyFor(d, t)]).length + (state.completed[challengeKey(d)] ? 1 : 0);
    return sum + dayTasks;
  }, 0);
  const weekTotal = weekDays.reduce((sum, d) => sum + d.tasks.length + 1, 0);
  const weekPercent = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  // Interview practice count
  const interviewCompleted = Object.keys(state.completed).filter(k => k.includes(":interview")).length;

  // Calculate streak (consecutive days with at least one completion)
  let streak = 0;
  let checkDate = new Date();
  while (true) {
    const dateKey = checkDate.toISOString().split('T')[0];
    const hasCompletionOnDay = Object.keys(state.completed).some(k => k.startsWith(dateKey));
    if (hasCompletionOnDay) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Update dashboard DOM
  const totalPercent = Math.min(completionPercent, 100);
  $("#stat-total").textContent = `${totalPercent}%`;
  $("#progress-fill").style.width = `${totalPercent}%`;
  $("#stat-days").textContent = `${completed} of ${totalTasks} tasks`;

  $("#stat-week").textContent = `${weekPercent}%`;
  $("#progress-week").style.width = `${weekPercent}%`;
  $("#stat-week-days").textContent = `${weekCompleted} of ${weekTotal} tasks`;

  $("#stat-streak").textContent = streak;
  $("#stat-interview").textContent = interviewCompleted;
}

function render() {
  renderDashboard();
  const day = currentDay();
  renderWeeks();
  renderDayPicker();
  renderSession(day);
  renderLesson(day);
  renderTasks(day);
  $("#interview-card").innerHTML = renderChallenge(day);
  $("#interview-card").querySelectorAll("[data-complete]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.complete;
      const completing = !state.completed[key];
      if (completing) {
        state.completed[key] = true;
        celebrateCompletion();
      } else {
        delete state.completed[key];
      }
      persist();
      render();
    });
  });
  $("#interview-card").querySelectorAll("[data-attempt]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.attempt;
      state.attempted[key] = !state.attempted[key];
      if (!state.attempted[key]) delete state.attempted[key];
      persist();
      render();
    });
  });
  $("#prev-day").disabled = day.index === 0;
  $("#next-day").disabled = day.index === days.length - 1;
}

$("#prev-day").addEventListener("click", () => selectDay(state.selected - 1));
$("#next-day").addEventListener("click", () => selectDay(state.selected + 1));
$("#today-button").addEventListener("click", () => {
  const today = localISODate();
  const index = days.findIndex((day) => day.iso === today);
  selectDay(index < 0 ? (today < plan.start ? 0 : days.length - 1) : index);
});
$("#reset-day").addEventListener("click", () => {
  const day = currentDay();
  for (const task of day.tasks) {
    delete state.completed[keyFor(day, task)];
    delete state.attempted[keyFor(day, task)];
  }
  delete state.completed[challengeKey(day)];
  delete state.attempted[challengeKey(day)];
  delete state.weekly[day.iso];
  persist();
  render();
});

render();
