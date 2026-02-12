// ===== 1. 초기화 및 날짜 표시 =====
document.addEventListener("DOMContentLoaded", () => {
  // Enter 키 입력 시 할 일 추가
  document.querySelector("#task-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
  });

  // 오늘 날짜 표시
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric", weekday: "long" };
  let dateString = today.toLocaleDateString("ko-KR", options);
  dateString = dateString.replace(/\d+/g, match => `<strong>${match}</strong>`);
  document.querySelector("#date").innerHTML = `오늘의 날짜 : ${dateString}`;

  // 저장된 목록 불러오기
  loadTasks();
});

// ===== 2. 할 일 추가 기능 =====
function addTask() {
  const input = document.querySelector("#task-input"); 
  const taskText = input.value.trim(); 

  if (!taskText) return; 

  const li = createTaskElement(taskText); 
  document.querySelector("#task-list").appendChild(li);

  saveTasks(); 
  input.value = ""; 
}

// ===== 3. 할 일 항목 생성 =====
function createTaskElement(taskText, isDone = false) {
  const li = document.createElement("li");

  const left = document.createElement("div");
  left.className = "left";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isDone; 

  const span = document.createElement("span");
  span.innerText = taskText;
  if (isDone) span.classList.add("done");

  checkbox.addEventListener("change", () => {
    toggleTask(checkbox, span);
    saveTasks(); 
  });

  span.addEventListener("click", () => editTask(span));

  left.appendChild(checkbox);
  left.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(li);
    saveTasks(); 
  });

  li.appendChild(left);
  li.appendChild(deleteBtn);

  return li;
}

// ===== 4. 완료 표시 토글 =====
function toggleTask(checkbox, span) {
  span.classList.toggle("done", checkbox.checked);
}

// ===== 5. 할 일 삭제 =====
function deleteTask(li) {
  li.remove();
}

// ===== 6. 할 일 수정 =====
function editTask(span) {
  const currentText = span.innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.classList.add("editing");

  function finishEdit() {
    span.innerText = input.value.trim() || currentText;
    span.style.display = "inline";
    input.remove();
    saveTasks(); 
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finishEdit();
  });
  input.addEventListener("blur", finishEdit);

  span.style.display = "none";
  span.parentNode.insertBefore(input, span);
  input.focus();
}

// ===== 7. LocalStorage 저장 =====
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    const span = li.querySelector("span");
    const checkbox = li.querySelector("input[type='checkbox']");
    tasks.push({ text: span.innerText, done: checkbox.checked });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== 8. LocalStorage 불러오기 =====
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    const li = createTaskElement(task.text, task.done);
    document.querySelector("#task-list").appendChild(li);
  });
}
