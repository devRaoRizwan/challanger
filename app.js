const STORAGE_KEY = "dsa-momentum-state";
const plan = window.PLAN || [];

const state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { done: {}, selected: 0 };
    const parsed = JSON.parse(raw);
    return {
      done: parsed.done || {},
      selected: Number.isInteger(parsed.selected) ? parsed.selected : 0,
    };
  } catch {
    return { done: {}, selected: 0 };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function chapterProgress(chapter) {
  const total = chapter.steps.length;
  const done = chapter.steps.filter((step, idx) => step.type !== "concept" && !!state.done[`${chapter.id}-${idx}`]).length;
  return { done, total };
}

function renderSidebar() {
  const list = document.getElementById("chapter-list");
  list.innerHTML = plan
    .map((chapter, index) => {
      const { done, total } = chapterProgress(chapter);
      const active = state.selected === index ? "active" : "";
      const width = total ? (done / total) * 100 : 0;
      return `
        <button class="chapter-item ${active}" data-index="${index}" type="button">
          <div class="chapter-pill">${index + 1}</div>
          <div class="chapter-copy">
            <span class="chapter-name">${chapter.title}</span>
            <span class="chapter-meta">${done}/${total} complete</span>
          </div>
          <span class="mini-bar"><i style="width:${width}%"></i></span>
        </button>
      `;
    })
    .join("");

  list.querySelectorAll(".chapter-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.selected = Number(button.dataset.index);
      saveState();
      render();
    });
  });
}

function renderMain() {
  const chapter = plan[state.selected] || plan[0];
  const { done, total } = chapterProgress(chapter);
  const title = document.getElementById("chapter-title");
  const pill = document.getElementById("progress-pill");
  const focus = document.getElementById("focus-card");
  const taskList = document.getElementById("task-list");

  title.textContent = chapter.title;
  pill.textContent = `${done} / ${total}`;

  focus.innerHTML = `
    <div class="focus-header">
      <span class="label">Current pattern</span>
      <span class="badge">Baby steps</span>
    </div>
    <h3>${chapter.focus}</h3>
    <p>${chapter.insight}</p>
  `;

  taskList.innerHTML = chapter.steps
    .map((step, index) => {
      const key = `${chapter.id}-${index}`;
      const checked = !!state.done[key];

      if (step.type === "concept") {
        return `
          <article class="task task-concept ${checked ? "done" : ""}">
            <div class="task-topline">
              <span class="tag concept">Concept</span>
              <span class="task-title">${step.title}</span>
            </div>
            <p>${step.text}</p>
          </article>
        `;
      }

      if (step.type === "review") {
        return `
          <article class="task task-review ${checked ? "done" : ""}">
            <div class="task-topline">
              <span class="tag review">Reflection</span>
              <span class="task-title">${step.title}</span>
            </div>
            <p>${step.text}</p>
          </article>
        `;
      }

      const difficultyClass = step.difficulty.toLowerCase();
      return `
        <label class="task task-practice ${checked ? "done" : ""}">
          <input type="checkbox" data-key="${key}" ${checked ? "checked" : ""} />
          <div class="task-main">
            <div class="task-topline">
              <span class="tag ${step.type}">${step.type === "warmup" ? "Warm-up" : "Main"}</span>
              <span class="level ${difficultyClass}">${step.difficulty}</span>
            </div>
            <div class="task-copy">
              <strong>${step.title}</strong>
              ${step.link ? `<a href="${step.link}" target="_blank" rel="noreferrer noopener">Open problem</a>` : ""}
            </div>
          </div>
        </label>
      `;
    })
    .join("");

  taskList.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const key = event.target.dataset.key;
      if (event.target.checked) {
        state.done[key] = true;
      } else {
        delete state.done[key];
      }
      saveState();
      render();
    });
  });
}

function renderSummary() {
  const allSteps = plan.reduce((sum, chapter) => sum + chapter.steps.filter((step) => step.type !== "concept" && step.type !== "review").length, 0);
  const doneCount = Object.keys(state.done).length;
  const title = document.querySelector(".brand-block h1");
  title.textContent = `DSA Momentum · ${doneCount}/${allSteps}`;
}

function render() {
  renderSummary();
  renderSidebar();
  renderMain();
}

render();
