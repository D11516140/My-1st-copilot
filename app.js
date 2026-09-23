const STORAGE_KEY = 'todo-list-v1';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const todoCount = document.getElementById('todo-count');
let todos = loadTodos();

// 讀取儲存的待辦資料，資料格式不正確時回傳空陣列。
function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];

    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos.filter(
      (todo) => todo && typeof todo.id === 'number' && typeof todo.text === 'string'
    );
  } catch (error) {
    console.error('讀取 localStorage 失敗：', error);
    return [];
  }
}

// 將待辦資料儲存到 localStorage。
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('儲存 localStorage 失敗：', error);
  }
}

// 計算目前尚未完成的待辦數量。
function getUnfinishedCount() {
  return todos.filter((todo) => !todo.completed).length;
}

// 將文字中的特殊字元轉義，避免插入 HTML 時造成 XSS。
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 重新渲染清單、空狀態與底部計數。
function renderTodos() {
  emptyState.hidden = todos.length > 0;
  todoList.innerHTML = todos
    .map(
      (todo) => `
        <li class="todo-item${todo.completed ? ' completed' : ''}" data-id="${todo.id}">
          <input
            type="checkbox"
            ${todo.completed ? 'checked' : ''}
            aria-label="標記為完成"
          >
          <span class="todo-text">${escapeHtml(todo.text)}</span>
          <button type="button" class="delete-button" aria-label="刪除待辦">&times;</button>
        </li>
      `
    )
    .join('');

  todoCount.textContent = `未完成: ${getUnfinishedCount()} 項`;
}

// 新增待辦事項，空白內容直接忽略。
function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  todos.push({
    id: Date.now() + Math.random(),
    text: trimmedText,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

// 刪除指定的待辦事項。
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// 切換指定待辦事項的完成狀態。
function toggleTodo(id, completed) {
  todos = todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo));
  saveTodos();
  renderTodos();
}

// 處理新增表單送出。
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

// 使用事件委派處理動態產生的勾選框與刪除按鈕。
todoList.addEventListener('change', (event) => {
  if (!event.target.matches('input[type="checkbox"]')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  toggleTodo(Number(item.dataset.id), event.target.checked);
});

todoList.addEventListener('click', (event) => {
  if (!event.target.matches('.delete-button')) {
    return;
  }

  const item = event.target.closest('.todo-item');
  deleteTodo(Number(item.dataset.id));
});

// 頁面載入時顯示已儲存的待辦資料。
renderTodos();
