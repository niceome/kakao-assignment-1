/* ============================
   app.js — Todo 앱 CRUD 로직
   ============================ */

// ─── 상태 ────────────────────────────────────────────────────────────────────

/**
 * todos: 앱의 핵심 상태 배열
 * 각 항목: { id: number, text: string, completed: boolean }
 */
let todos = [];

/** 다음 Todo에 부여할 고유 ID (추가될 때마다 1씩 증가) */
let nextId = 1;

// ─── DOM 참조 ─────────────────────────────────────────────────────────────────

const todoInput      = document.getElementById('todoInput');
const addBtn         = document.getElementById('addBtn');
const todoList       = document.getElementById('todoList');
const emptyState     = document.getElementById('emptyState');
const errorMessage   = document.getElementById('errorMessage');
const completedCount = document.getElementById('completedCount');
const totalCount     = document.getElementById('totalCount');

// ─── 초기화 ───────────────────────────────────────────────────────────────────

/** 앱 최초 실행 시 UI를 초기 상태로 렌더링 */
function init() {
  renderTodoList();
}

// ─── 이벤트 리스너 ────────────────────────────────────────────────────────────

/** 추가 버튼 클릭 시 Todo 생성 */
addBtn.addEventListener('click', handleAddTodo);

/** 입력창에서 Enter 키 입력 시 Todo 생성 */
todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleAddTodo();
  }
});

/** 입력 중 에러 메시지 자동 숨김 */
todoInput.addEventListener('input', () => {
  hideErrorMessage();
});

// ─── Todo 추가 ────────────────────────────────────────────────────────────────

/**
 * 입력값을 검증하고 새 Todo를 추가한다.
 * 빈 값이면 에러 메시지를 표시하고 중단한다.
 */
function handleAddTodo() {
  const inputText = todoInput.value.trim();

  // 빈 입력값 검증
  if (!inputText) {
    showErrorMessage('할 일을 입력해주세요.');
    todoInput.classList.add('input-error');
    // 애니메이션이 끝난 뒤 클래스 제거 (재사용 가능하도록)
    setTimeout(() => todoInput.classList.remove('input-error'), 300);
    todoInput.focus();
    return;
  }

  // 새 Todo 객체 생성
  const newTodo = {
    id: nextId++,
    text: inputText,
    completed: false,
  };

  todos.push(newTodo);
  todoInput.value = '';   // 입력창 초기화
  hideErrorMessage();
  renderTodoList();
  todoInput.focus();
}

// ─── Todo 삭제 ────────────────────────────────────────────────────────────────

/**
 * 주어진 id의 Todo를 배열에서 제거하고 화면을 갱신한다.
 * @param {number} id - 삭제할 Todo의 id
 */
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodoList();
}

// ─── Todo 완료 토글 ───────────────────────────────────────────────────────────

/**
 * 주어진 id의 Todo completed 상태를 반전시킨다.
 * @param {number} id - 완료 상태를 토글할 Todo의 id
 */
function toggleCompleteTodo(id) {
  const targetTodo = todos.find((todo) => todo.id === id);
  if (targetTodo) {
    targetTodo.completed = !targetTodo.completed;
  }
  renderTodoList();
}

// ─── Todo 수정 ────────────────────────────────────────────────────────────────

/**
 * 수정 모드로 전환한다.
 * 텍스트를 인라인 input으로 교체하고, 수정/삭제 버튼을 저장 버튼으로 바꾼다.
 * @param {number} id - 수정할 Todo의 id
 * @param {HTMLElement} itemElement - 해당 Todo의 li 요소
 */
function startEditTodo(id, itemElement) {
  const targetTodo = todos.find((todo) => todo.id === id);
  if (!targetTodo) return;

  // 텍스트 span → 수정용 input으로 교체
  const textWrapper   = itemElement.querySelector('.todo-text-wrapper');
  const actionsWrapper = itemElement.querySelector('.todo-actions');

  textWrapper.innerHTML = `
    <input
      type="text"
      class="todo-edit-input"
      value="${escapeHtml(targetTodo.text)}"
      maxlength="100"
      aria-label="할 일 수정"
    />
  `;

  // 액션 버튼 → 저장 버튼으로 교체
  actionsWrapper.innerHTML = `
    <button class="action-btn save-btn" title="저장" aria-label="저장">✓</button>
  `;

  const editInput = textWrapper.querySelector('.todo-edit-input');
  const saveBtn   = actionsWrapper.querySelector('.save-btn');

  // 수정 input에 포커스 및 커서를 텍스트 끝으로 이동
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  // 저장 버튼 클릭 시 저장
  saveBtn.addEventListener('click', () => saveEditTodo(id, editInput));

  // Enter 키로도 저장 가능
  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveEditTodo(id, editInput);
    }
    // Escape 키로 수정 취소 (원래 화면 복원)
    if (event.key === 'Escape') {
      renderTodoList();
    }
  });
}

/**
 * 수정 내용을 검증하고 상태에 반영한 뒤 화면을 다시 렌더링한다.
 * @param {number} id - 수정할 Todo의 id
 * @param {HTMLInputElement} editInput - 수정 중인 input 요소
 */
function saveEditTodo(id, editInput) {
  const newText = editInput.value.trim();

  if (!newText) {
    // 빈 값이면 흔들기 효과만 주고 저장하지 않음
    editInput.style.animation = 'inputShake 0.3s ease';
    setTimeout(() => { editInput.style.animation = ''; }, 300);
    editInput.focus();
    return;
  }

  const targetTodo = todos.find((todo) => todo.id === id);
  if (targetTodo) {
    targetTodo.text = newText;
  }
  renderTodoList();
}

// ─── 렌더링 ───────────────────────────────────────────────────────────────────

/**
 * todos 배열을 기반으로 전체 목록을 다시 그린다.
 * 상태(stats)와 빈 상태 표시도 함께 갱신한다.
 */
function renderTodoList() {
  // 기존 목록 초기화
  todoList.innerHTML = '';

  // 빈 상태 처리
  if (todos.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    todos.forEach((todo) => {
      const listItem = createTodoElement(todo);
      todoList.appendChild(listItem);
    });
  }

  updateStats();
}

/**
 * 단일 Todo 객체를 받아 li DOM 요소를 생성하고 반환한다.
 * @param {{ id: number, text: string, completed: boolean }} todo
 * @returns {HTMLLIElement}
 */
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' todo-item--completed' : ''}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
    <div class="todo-text-wrapper">
      <span class="todo-text">${escapeHtml(todo.text)}</span>
    </div>
    <div class="todo-actions">
      <button class="action-btn complete-btn" title="${todo.completed ? '미완료로 변경' : '완료'}" aria-label="${todo.completed ? '미완료로 변경' : '완료'}">
        ${todo.completed ? '↩' : '✓'}
      </button>
      <button class="action-btn edit-btn" title="수정" aria-label="수정">✎</button>
      <button class="action-btn delete-btn" title="삭제" aria-label="삭제">✕</button>
    </div>
  `;

  // 완료 버튼 이벤트
  li.querySelector('.complete-btn').addEventListener('click', () => toggleCompleteTodo(todo.id));

  // 수정 버튼 이벤트
  li.querySelector('.edit-btn').addEventListener('click', () => startEditTodo(todo.id, li));

  // 삭제 버튼 이벤트
  li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

  return li;
}

// ─── 통계 업데이트 ────────────────────────────────────────────────────────────

/** 헤더의 완료/전체 카운트를 최신 상태로 갱신한다. */
function updateStats() {
  const total     = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  completedCount.textContent = completed;
  totalCount.textContent     = total;
}

// ─── 에러 메시지 ──────────────────────────────────────────────────────────────

/**
 * 에러 메시지를 표시한다.
 * @param {string} message - 표시할 메시지 텍스트
 */
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('error-message--visible');
}

/** 에러 메시지를 숨긴다. */
function hideErrorMessage() {
  errorMessage.classList.remove('error-message--visible');
}

// ─── 유틸리티 ─────────────────────────────────────────────────────────────────

/**
 * XSS 방지를 위해 사용자 입력 문자열의 HTML 특수문자를 이스케이프한다.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─── 앱 시작 ──────────────────────────────────────────────────────────────────
init();