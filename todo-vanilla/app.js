/* =========================================================
   app.js — Todo 앱 메인 로직
   =========================================================
   데이터 구조:
   todoList = [
     {
       id:        number,   // 고유 식별자 (Date.now() 기반)
       text:      string,   // 할 일 내용
       isDone:    boolean,  // 완료 여부
       createdAt: number    // 생성 타임스탬프
     },
     ...
   ]
   ========================================================= */

// ── 상태(State) ──────────────────────────────────────────
/** 전체 Todo 배열. 앱의 유일한 진실 공급원(Single Source of Truth) */
let todoList = [];

/** 자동 증가 ID. 새 Todo 추가 시마다 할당 */
let nextTodoId = Date.now();

// ── DOM 참조 캐싱 ─────────────────────────────────────────
const todoInputEl      = document.getElementById('todoInput');
const addTodoBtnEl     = document.getElementById('addTodoBtn');
const activeTodoListEl = document.getElementById('activeTodoList');
const doneTodoListEl   = document.getElementById('doneTodoList');
const activeCountEl    = document.getElementById('activeCount');
const doneCountEl      = document.getElementById('doneCount');
const activeEmptyMsgEl = document.getElementById('activeEmptyMsg');
const doneEmptyMsgEl   = document.getElementById('doneEmptyMsg');

// ── 이벤트 바인딩 ─────────────────────────────────────────

/** [추가] 버튼 클릭 → Todo 추가 */
addTodoBtnEl.addEventListener('click', handleAddTodo);

/** 입력창에서 Enter 키 → Todo 추가 */
todoInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) handleAddTodo();
});

// ── 핵심 핸들러 ───────────────────────────────────────────

/**
 * Todo 추가 핸들러
 * 입력값을 검증하고 todoList에 새 항목을 삽입한 뒤 화면을 갱신한다.
 */
function handleAddTodo() {
  const rawText = todoInputEl.value.trim();

  // 빈 문자열이면 추가하지 않음
  if (!rawText) {
    shakeInputField();
    return;
  }

  const newTodo = {
    id:        nextTodoId++,
    text:      rawText,
    isDone:    false,
    createdAt: Date.now(),
  };

  todoList.push(newTodo);
  todoInputEl.value = ''; // 입력창 초기화
  renderAll();
}

/**
 * Todo 완료 / 미완료 토글
 * @param {number} todoId - 대상 Todo의 id
 */
function handleToggleDone(todoId) {
  const target = findTodoById(todoId);
  if (!target) return;

  target.isDone = !target.isDone;
  renderAll();
}

/**
 * Todo 수정 모드 진입
 * 해당 아이템의 텍스트 영역을 <input>으로 교체하고 포커스를 이동한다.
 * @param {number} todoId - 대상 Todo의 id
 */
function handleStartEdit(todoId) {
  const target    = findTodoById(todoId);
  const itemEl    = document.querySelector(`[data-id="${todoId}"]`);
  if (!target || !itemEl) return;

  // 텍스트 span → edit input 교체
  const textEl    = itemEl.querySelector('.todo-text');
  const actionsEl = itemEl.querySelector('.todo-actions');

  // 인라인 입력창 생성
  const editInputEl = document.createElement('input');
  editInputEl.type      = 'text';
  editInputEl.className = 'todo-edit-input';
  editInputEl.value     = target.text;
  editInputEl.maxLength = 100;

  // 텍스트 span 숨기고 입력창 삽입
  textEl.replaceWith(editInputEl);
  editInputEl.focus();
  editInputEl.select();

  // 액션 버튼을 [저장] 버튼만 보이도록 교체
  actionsEl.innerHTML = `
    <button class="btn-action btn-save"   title="저장" onclick="handleSaveEdit(${todoId})">💾</button>
    <button class="btn-action btn-delete" title="삭제" onclick="handleDeleteTodo(${todoId})">🗑</button>
  `;

  // 입력창에서 Enter → 저장
  editInputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  handleSaveEdit(todoId);
    if (e.key === 'Escape') renderAll(); // 취소: 원래 상태로 복원
  });
}

/**
 * 수정 내용 저장
 * 편집 모드의 입력값을 검증 후 todoList에 반영한다.
 * @param {number} todoId - 대상 Todo의 id
 */
function handleSaveEdit(todoId) {
  const target  = findTodoById(todoId);
  const itemEl  = document.querySelector(`[data-id="${todoId}"]`);
  if (!target || !itemEl) return;

  const editInputEl = itemEl.querySelector('.todo-edit-input');
  const newText     = editInputEl ? editInputEl.value.trim() : '';

  if (!newText) {
    editInputEl && editInputEl.classList.add('shake'); // 빈값 경고 애니메이션
    return;
  }

  target.text = newText;
  renderAll();
}

/**
 * Todo 삭제
 * @param {number} todoId - 삭제할 Todo의 id
 */
function handleDeleteTodo(todoId) {
  todoList = todoList.filter((todo) => todo.id !== todoId);
  renderAll();
}

// ── 렌더링 ────────────────────────────────────────────────

/**
 * 전체 화면 갱신 (진행 중 목록 + 완료 목록 + 카운터)
 * 상태가 바뀔 때마다 호출되는 단일 진입점.
 */
function renderAll() {
  const activeTodos = todoList.filter((t) => !t.isDone);
  const doneTodos   = todoList.filter((t) =>  t.isDone);

  renderTodoList(activeTodoListEl, activeTodos, false);
  renderTodoList(doneTodoListEl,   doneTodos,   true);
  updateCounters(activeTodos.length, doneTodos.length);
  updateEmptyMessages(activeTodos.length, doneTodos.length);
}

/**
 * 특정 <ul> 요소에 Todo 아이템들을 렌더링한다.
 * @param {HTMLElement} listEl   - 렌더링 대상 <ul>
 * @param {Array}       todos    - 렌더링할 Todo 배열
 * @param {boolean}     isDoneSection - 완료 섹션 여부
 */
function renderTodoList(listEl, todos, isDoneSection) {
  listEl.innerHTML = ''; // 기존 목록 초기화

  todos.forEach((todo) => {
    const li = createTodoItemElement(todo, isDoneSection);
    listEl.appendChild(li);
  });
}

/**
 * 하나의 Todo 항목에 해당하는 <li> DOM 요소를 생성해 반환한다.
 * @param {Object}  todo          - Todo 데이터 객체
 * @param {boolean} isDoneSection - 완료 섹션 여부 (버튼 종류 결정)
 * @returns {HTMLLIElement}
 */
function createTodoItemElement(todo, isDoneSection) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.isDone ? ' is-done' : ''}`;
  li.dataset.id = todo.id; // 이벤트 핸들러에서 id 참조용

  // 체크박스
  const checkbox       = document.createElement('input');
  checkbox.type        = 'checkbox';
  checkbox.className   = 'todo-checkbox';
  checkbox.checked     = todo.isDone;
  checkbox.title       = todo.isDone ? '미완료로 되돌리기' : '완료로 표시';
  checkbox.addEventListener('change', () => handleToggleDone(todo.id));

  // 텍스트
  const textSpan       = document.createElement('span');
  textSpan.className   = 'todo-text';
  textSpan.textContent = todo.text;

  // 액션 버튼 영역
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'todo-actions';

  if (!isDoneSection) {
    // 진행 중 섹션: [수정] [삭제] 버튼
    actionsDiv.innerHTML = `
      <button class="btn-action btn-edit"   title="수정" onclick="handleStartEdit(${todo.id})">✏️</button>
      <button class="btn-action btn-delete" title="삭제" onclick="handleDeleteTodo(${todo.id})">🗑</button>
    `;
  } else {
    // 완료 섹션: [되돌리기] [삭제] 버튼
    actionsDiv.innerHTML = `
      <button class="btn-action btn-undo"   title="되돌리기" onclick="handleToggleDone(${todo.id})">↩️</button>
      <button class="btn-action btn-delete" title="삭제"     onclick="handleDeleteTodo(${todo.id})">🗑</button>
    `;
  }

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(actionsDiv);

  return li;
}

/**
 * 헤더의 진행 중 / 완료 카운터를 업데이트한다.
 * @param {number} activeCount - 진행 중인 Todo 수
 * @param {number} doneCount   - 완료된 Todo 수
 */
function updateCounters(activeCount, doneCount) {
  activeCountEl.textContent = activeCount;
  doneCountEl.textContent   = doneCount;
}

/**
 * 목록이 비어 있을 때 안내 메시지 표시 여부를 제어한다.
 * @param {number} activeCount
 * @param {number} doneCount
 */
function updateEmptyMessages(activeCount, doneCount) {
  activeEmptyMsgEl.style.display = activeCount === 0 ? 'block' : 'none';
  doneEmptyMsgEl.style.display   = doneCount   === 0 ? 'block' : 'none';
}

// ── 유틸리티 ─────────────────────────────────────────────

/**
 * id로 todoList에서 특정 항목을 찾아 반환한다.
 * @param {number} todoId
 * @returns {Object|undefined}
 */
function findTodoById(todoId) {
  return todoList.find((todo) => todo.id === todoId);
}

/**
 * 입력창에 흔들림 애니메이션을 적용해 빈 입력을 알린다.
 * (CSS animation이 없으므로 클래스 토글로 구현)
 */
function shakeInputField() {
  todoInputEl.style.borderColor = '#f44336';
  todoInputEl.style.boxShadow   = '0 0 0 3px rgba(244,67,54,0.15)';
  setTimeout(() => {
    todoInputEl.style.borderColor = '';
    todoInputEl.style.boxShadow   = '';
  }, 600);
  todoInputEl.focus();
}

// ── 초기 렌더 ─────────────────────────────────────────────
renderAll();