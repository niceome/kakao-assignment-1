
// 로컬스토리지 키 이름 상수로 관리

const STORAGE_KEY_TODOS  = 'todos';
const STORAGE_KEY_NEXTID = 'nextId';



// todos는 할일 리스트
// id는 할일의 고유 번호, content는 string, completed는 boolean형으로 완료됐는지 안 됐는지
// 판단하기 위한 변수
let todos = [];

// 다음 할일에 추가할 ID 번호
let nextId = 1;

// 현재 필터 상태(all, completed, active)를 구분하기 위해서 기본값은 all로 설정
let currentFilter = 'all';

// selectedDate는 현재 일간뷰에서 활성화된 날짜를 뜻함. 
// getTodayNormal()는 오늘 날짜의 시,분,초를 모두 00:00:00으로 변환해서 바꿔줌
let selectedDate = getTodayNormal();


// 저장할 항목들(할일들 + 다음에 올 할일 ID)
// 로컬스토리지에 저장하기 위해서 stringfy로 모두 직렬화해서 저장.
// 저장하는 것은 신중해야하므로 try-catch문으로 예외 처리
// CRUD가 이뤄지고 나서 로컬 스토리지에 저장
function save() {
  try {
    localStorage.setItem(STORAGE_KEY_TODOS,  JSON.stringify(todos));
    localStorage.setItem(STORAGE_KEY_NEXTID, JSON.stringify(nextId));
  } catch (error) {
    // 예외 터지면 error 로그 출력
    console.warn('로컬스토리지 저장 실패:', error);
  }
}

// 로컬 스토리지에서 저장된 할일들과 다음에 올 할일 ID를 불러오기.
// 로컬 스토리지에 저장하는 과정과 반대로 parse를 통해서 역직렬화를 시도.
function load() {
  try {
    const savedTodos  = localStorage.getItem(STORAGE_KEY_TODOS);
    const savedNextId = localStorage.getItem(STORAGE_KEY_NEXTID);

    // 만약 todo가 빈값이면 저장되면 안됨. 그래서 그거 검증해주기
    if (savedTodos !== null) {
      todos = JSON.parse(savedTodos);
    }
    if (savedNextId !== null) {
      nextId = JSON.parse(savedNextId);
    }
  } catch (error) {
    // 파싱 실패시에 할일 목록을 빈 배열, 그리고 다음 todo ID를 1로 초기화시키기.
    console.warn('로컬스토리지 불러오기 실패, 초기 상태로 시작합니다:', error);
    todos  = [];
    nextId = 1;
  }
}

/**
 * 
 * @returns {Date}
 */
function getTodayNormal() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * @param {Date} date
 * @returns {string}
 * 
 * 
 */
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Date 객체를 화면에 표시할 'YYYY. MM. DD' 형식으로 변환한다.
 * @param {Date} date
 * @returns {string}
 */
function formatDateLabel(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${d}`;
}

/**
 * Date 객체의 요일을 한국어로 반환한다.
 * @param {Date} date
 * @returns {string}
 */
function getDayOfWeek(date) {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

/**
 * 두 Date 객체가 같은 날짜인지 비교한다. (연/월/일 기준)
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

// ─── DOM 참조 ─────────────────────────────────────────────────────────────────

const todoInput         = document.getElementById('todoInput');
const addBtn            = document.getElementById('addBtn');
const todoList          = document.getElementById('todoList');
const emptyState        = document.getElementById('emptyState');
const emptyStateMsg     = document.getElementById('emptyStateMessage');
const errorMessage      = document.getElementById('errorMessage');
const completedCount    = document.getElementById('completedCount');
const totalCount        = document.getElementById('totalCount');
const filterTabs        = document.querySelectorAll('.filter-tab');

// 날짜 네비게이터 DOM
const prevDayBtn        = document.getElementById('prevDayBtn');
const nextDayBtn        = document.getElementById('nextDayBtn');
const selectedDateLabel = document.getElementById('selectedDateLabel');
const selectedDayOfWeek = document.getElementById('selectedDayOfWeek');
const todayBadge        = document.getElementById('todayBadge');

// ─── 초기화 ───────────────────────────────────────────────────────────────────

/**
 * 앱 최초 실행 시:
 * 1. 로컬스토리지에서 데이터 복원
 * 2. 이벤트 바인딩
 * 3. UI 렌더링
 */
function init() {
  load();   // 저장된 데이터 복원 (렌더링 전에 먼저 호출)
  bindFilterTabEvents();
  bindDateNavEvents();
  renderDateNav();
  renderTodoList();
}

// ─── 날짜 네비게이터 ──────────────────────────────────────────────────────────

function bindDateNavEvents() {
  prevDayBtn.addEventListener('click', () => moveSelectedDate(-1));
  nextDayBtn.addEventListener('click', () => moveSelectedDate(1));
}

/**
 * selectedDate를 지정한 일수만큼 이동한 뒤 UI를 갱신한다.
 * @param {number} days - 이동할 일수 (음수: 이전, 양수: 다음)
 */
function moveSelectedDate(days) {
  const next = new Date(selectedDate);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  selectedDate = next;

  // 날짜 변경 시 필터를 '전체'로 초기화
  currentFilter = 'all';
  updateActiveFilterTab();

  renderDateNav();
  renderTodoList();
}

function renderDateNav() {
  selectedDayOfWeek.textContent = getDayOfWeek(selectedDate);
  selectedDateLabel.textContent = formatDateLabel(selectedDate);

  const isToday = isSameDay(selectedDate, getTodayNormalized());
  todayBadge.classList.toggle('hidden', !isToday);
}

// ─── 필터 탭 ─────────────────────────────────────────────────────────────────

function bindFilterTabEvents() {
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentFilter = tab.dataset.filter;
      updateActiveFilterTab();
      renderTodoList();
    });
  });
}

function updateActiveFilterTab() {
  filterTabs.forEach((tab) => {
    tab.classList.toggle('filter-tab--active', tab.dataset.filter === currentFilter);
  });
}

/**
 * selectedDate + currentFilter 를 모두 적용해 표시할 Todo 목록을 반환한다.
 * @returns {Array}
 */
function getFilteredTodos() {
  const dateKey     = formatDateKey(selectedDate);
  const todosForDay = todos.filter((todo) => todo.date === dateKey);

  switch (currentFilter) {
    case 'active':    return todosForDay.filter((todo) => !todo.completed);
    case 'completed': return todosForDay.filter((todo) => todo.completed);
    default:          return todosForDay;
  }
}

function getIfEmptyMessage() {
  switch (currentFilter) {
    case 'active':    return '진행 중인 할 일이 없어요';
    case 'completed': return '완료된 할 일이 없어요';
    default:          return '이 날의 할 일이 없어요';
  }
}

// ─── Todo 추가 ────────────────────────────────────────────────────────────────

function handleAddTodo() {
  const inputText = todoInput.value.trim();

  if (!inputText) {
    showErrorMessage('할 일을 입력해주세요.');
    todoInput.classList.add('input-error');
    setTimeout(() => todoInput.classList.remove('input-error'), 300);
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: nextId++,
    text: inputText,
    completed: false,
    date: formatDateKey(selectedDate),
  };

  todos.push(newTodo);
  save();     

  todoInput.value = '';
  hideErrorMessage();

  if (currentFilter === 'completed') {
    currentFilter = 'all';
    updateActiveFilterTab();
  }

  renderTodoList();
  todoInput.focus();
}

// ─── Todo 삭제 ────────────────────────────────────────────────────────────────

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  save();     // 상태 변경 후 즉시 저장
  renderTodoList();
}

// ─── Todo 완료 토글 ───────────────────────────────────────────────────────────

function toggleCompleteTodo(id) {
  const target = todos.find((todo) => todo.id === id);
  if (target) target.completed = !target.completed;
  save();     // 상태 변경 후 즉시 저장
  renderTodoList();
}

// ─── Todo 수정 ────────────────────────────────────────────────────────────────

function startEditTodo(id, itemElement) {
  const target = todos.find((todo) => todo.id === id);
  if (!target) return;

  const textWrapper    = itemElement.querySelector('.todo-text-wrapper');
  const actionsWrapper = itemElement.querySelector('.todo-actions');

  textWrapper.innerHTML = `
    <input
      type="text"
      class="todo-edit-input"
      value="${escapeHtml(target.text)}"
      maxlength="100"
      aria-label="할 일 수정"
    />
  `;

  actionsWrapper.innerHTML = `
    <button class="action-btn save-btn" title="저장" aria-label="저장">✓</button>
  `;

  const editInput = textWrapper.querySelector('.todo-edit-input');
  const saveBtn   = actionsWrapper.querySelector('.save-btn');

  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  saveBtn.addEventListener('click', () => saveEditTodo(id, editInput));
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEditTodo(id, editInput);
    if (e.key === 'Escape') renderTodoList();  // 수정 취소 (저장 없이 원복)
  });
}

function saveEditTodo(id, editInput) {
  const newText = editInput.value.trim();
  if (!newText) {
    editInput.style.animation = 'inputShake 0.3s ease';
    setTimeout(() => { editInput.style.animation = ''; }, 300);
    editInput.focus();
    return;
  }
  const target = todos.find((todo) => todo.id === id);
  if (target) target.text = newText;
  save();     // 상태 변경 후 즉시 저장
  renderTodoList();
}

// ─── 렌더링 ───────────────────────────────────────────────────────────────────

function renderTodoList() {
  todoList.innerHTML = '';

  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    emptyStateMsg.textContent = getEmptyStateMessage();
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filtered.forEach((todo) => {
      todoList.appendChild(createTodoElement(todo));
    });
  }

  updateStats();
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' todo-item--completed' : ''}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
    <div class="todo-text-wrapper">
      <span class="todo-text">${escapeHtml(todo.text)}</span>
    </div>
    <div class="todo-actions">
      <button class="action-btn complete-btn"
        title="${todo.completed ? '미완료로 변경' : '완료'}"
        aria-label="${todo.completed ? '미완료로 변경' : '완료'}">
        ${todo.completed ? '↩' : '✓'}
      </button>
      <button class="action-btn edit-btn" title="수정" aria-label="수정">✎</button>
      <button class="action-btn delete-btn" title="삭제" aria-label="삭제">✕</button>
    </div>
  `;

  li.querySelector('.complete-btn').addEventListener('click', () => toggleCompleteTodo(todo.id));
  li.querySelector('.edit-btn').addEventListener('click', () => startEditTodo(todo.id, li));
  li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

  return li;
}

// ─── 통계 업데이트 ────────────────────────────────────────────────────────────

function updateStats() {
  const dateKey     = formatDateKey(selectedDate);
  const todosForDay = todos.filter((todo) => todo.date === dateKey);
  const total       = todosForDay.length;
  const completed   = todosForDay.filter((todo) => todo.completed).length;
  completedCount.textContent = completed;
  totalCount.textContent     = total;
}


// 에러 메시지 보여주기(사용자 당황하지 않게)
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('error-message--visible');
}

// 에러 메시지 다시 가리기
function hideErrorMessage() {
  errorMessage.classList.remove('error-message--visible');
}


// 1. addBtn은 클릭해서 todo에 추가하기
// 2. keydown()은 isComposing와 결합해 사용해서 한글일때도 마지막 한 번 더 저장 안되게함.
// 3. 또한 입력창에 입력과 같은 이벤트 발생시에 errorMsg 숨기기
addBtn.addEventListener('click', handleAddTodo);
todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing) handleAddTodo(); });
todoInput.addEventListener('input', hideErrorMessage);



// 앱 초기 시작
init();