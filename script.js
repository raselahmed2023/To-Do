/*STATE */
const input      = document.querySelector("#taskInput");
const addBtn     = document.querySelector("#addBtn");
const list       = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const counter    = document.querySelector("#counter");
const filterBtns = document.querySelectorAll(".filter");

let tasks = [];             // { id, text, completed }
let currentFilter = "all";  // "all" | "active" | "completed"

const NOTE_COLORS = [
  { bg: "var(--note-yellow)" },
  { bg: "var(--note-mint)"   },
  { bg: "var(--note-blue)"   },
  { bg: "var(--note-pink)"   },
];

/* ADD TASK LOGIC */
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  render();
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

/* DELETE TASK LOGIC */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

/*  COMPLETE / ACTIVE TOGGLE LOGIC */
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  render();
}

/* FILTER LOGIC*/
function setFilter(filterValue) {
  currentFilter = filterValue;

  filterBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filterValue);
  });

  render();
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

function getFilteredTasks() {
  if (currentFilter === "active")    return tasks.filter(t => !t.completed);
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  return tasks;
}

/* RENDER LOGIC */
function render() {
  list.replaceChildren();

  const filtered = getFilteredTasks();
  emptyState.classList.toggle("hidden", filtered.length !== 0);

  filtered.forEach((task) => {
    const palette = NOTE_COLORS[task.id % NOTE_COLORS.length];

    const note = document.createElement("div");
    note.className = `note w-44 min-h-[140px] rounded-sm p-4 flex flex-col justify-between ${task.completed ? "done" : ""}`;
    note.style.background = palette.bg;

    const text = document.createElement("p");
    text.textContent = task.text;
    text.className = "note-text font-hand text-xl leading-snug break-words";

    const actions = document.createElement("div");
    actions.className = "flex justify-between items-center mt-3 text-xs font-semibold";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.completed ? "↺ Active" : "✓ Done";
    doneBtn.className = "hover:underline";
    doneBtn.style.color = "var(--ink)";
    doneBtn.addEventListener("click", () => toggleComplete(task.id));

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.title = "Delete task";
    delBtn.className = "hover:opacity-70";
    delBtn.style.color = "var(--accent)";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    actions.append(doneBtn, delBtn);
    note.append(text, actions);
    list.append(note);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  counter.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining · ${tasks.length} total`;
}

/* Initial paint */
render();