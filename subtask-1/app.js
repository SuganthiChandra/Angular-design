let todos = [];
let filteredTodos = [];
let selectedTodo = null;

let nameAsc = true;
let dateAsc = true;

// Generate random date between Jan 1 and Jul 1, 2024
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Fetch todos
async function fetchTodos() {
  console.log("Fetching todos...");

  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
  const data = await res.json();

  console.log(data);

  todos = data.map(todo => ({
    ...todo,
    createdAt: new Date(
      2024,
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 28) + 1
    )
  }));

  filteredTodos = [...todos];
  renderTodos(filteredTodos);
}

// Render todos
function renderTodos(list) {
  const container = document.getElementById('todo-list');
  container.innerHTML = '';

  list.forEach(todo => {
    const row = document.createElement('div');
    row.className = 'todo-item';

    const title = document.createElement('div');
    title.className = 'todo-title';
    title.textContent = todo.title;
    title.onclick = () => selectTodo(todo);

    const date = document.createElement('div');
    date.className = 'todo-date';
    date.textContent = new Date(todo.createdAt).toLocaleDateString();

    row.appendChild(title);
    row.appendChild(date);
    container.appendChild(row);
  });
}

// Select todo
function selectTodo(todo) {
  selectedTodo = todo;
  document.getElementById('description').value = todo.title;
}

// Update description
function updateDescription() {
  if (!selectedTodo) return;
  selectedTodo.title = document.getElementById('description').value;
  renderTodos(filteredTodos);
}

// Sort by Name (Description)
function sortByName() {
  filteredTodos.sort((a, b) =>
    nameAsc
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );

  nameAsc = !nameAsc;
  document.getElementById('nameArrow').textContent = nameAsc ? '⌄' : '⌃';
  renderTodos(filteredTodos);
}

// Sort by Creation Date
function sortByCreationDate() {
  filteredTodos.sort((a, b) =>
    dateAsc
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  dateAsc = !dateAsc;
  document.getElementById('dateArrow').textContent = dateAsc ? '⌄' : '⌃';
  renderTodos(filteredTodos);
}

// Apply date filter
function applyDateFilter() {
  const from = document.getElementById('fromDate').value;
  const to = document.getElementById('toDate').value;

  filteredTodos = todos.filter(todo => {
    const d = new Date(todo.createdAt);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });

  renderTodos(filteredTodos);
}

// Reset date filter
function resetDateFilter() {
  document.getElementById('fromDate').value = '';
  document.getElementById('toDate').value = '';
  filteredTodos = [...todos];
  renderTodos(filteredTodos);
}

window.onload = fetchTodos;
