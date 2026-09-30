const STORAGE_KEY = 'todo-list-v1';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const todoCount = document.getElementById('todo-count');
const clearCompletedButton = document.getElementById('clear-completed-button');
const filterButtons = document.querySelectorAll('.filter-button');
let todos = loadTodos();
let currentFilter = 'all';

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

// 計算目前已完成的待辦數量。
function getCompletedCount() {
  return todos.filter((todo) => todo.completed).length;
}

// 依照目前的篩選條件取得要顯示的待辦事項。
function getVisibleTodos() {
  if (currentFilter === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 依照目前的篩選條件取得空清單提示文字。
function getEmptyMessage() {
  if (todos.length === 0) {
    return '還沒有任何待辦事項，新增一個吧!';
  }

  if (currentFilter === 'active') {
    return '目前沒有未完成的事項。';
  }

  return '目前沒有已完成的事項。項目可能只是被目前的篩選條件隱藏。';
}

// 重新渲染清單、空狀態與底部計數。
function renderTodos() {
  const visibleTodos = getVisibleTodos();

  todoList.replaceChildren();

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.dataset.id = String(todo.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', '標記為完成');

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.setAttribute('aria-label', '刪除待辦');
    deleteButton.textContent = '×';

    item.append(checkbox, text, deleteButton);
    todoList.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  emptyState.textContent = getEmptyMessage();

  todoCount.textContent = `未完成: ${getUnfinishedCount()} 項`;
  clearCompletedButton.disabled = getCompletedCount() === 0;
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

// 顯示確認對話框後清除所有已完成的待辦事項。
function clearCompletedTodos() {
  if (getCompletedCount() === 0 || !window.confirm('確定要清除所有已完成的事項嗎？')) {
    return;
  }

  todos = todos.filter((todo) => !todo.completed);
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

// 處理清除已完成按鈕。
clearCompletedButton.addEventListener('click', clearCompletedTodos);

// 處理篩選按鈕，並同步更新目前的選取狀態。
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    renderTodos();
  });
});

// 頁面載入時顯示已儲存的待辦資料。
renderTodos();
