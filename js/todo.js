document.querySelectorAll(".todo__select").forEach((select) => {
  const selected = select.querySelector(".select__selected");
  const options = select.querySelector(".select__items");

  // Відкриття/закриття списку опцій
  selected.addEventListener("click", () => {
    select.classList.toggle("open");
  });

  // Вибір опції
  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent;
      selected.setAttribute("data-value", option.dataset.value);
      select.classList.remove("open");
    });
  });

  // Закриття при кліку поза селектом
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
    }
  });
});

document.getElementById("todo-add").addEventListener("click", () => {
  const input = document.getElementById("todo-input");
  const taskText = input.value.trim();

  // Отримуємо вибраний пріоритет із кастомного селекта
  const selectedPriorityEl = document.querySelector(".select__selected");
  const priorityValue = selectedPriorityEl.dataset.value; // напр. 'high'
  const priorityLabel = selectedPriorityEl.textContent.trim(); // 'High'

  if (!taskText) {
    input.classList.add("todo__input--error");
    input.setAttribute("placeholder", "Please enter a task...");
    input.focus();
    input.addEventListener(
      "input",
      () => {
        input.classList.remove("todo__input--error");
      },
      { once: true }
    );
    return;
  }

  // Перевірка на дублікати задач
  const list = document.getElementById("todo-list");
  const existingTasks = Array.from(list.querySelectorAll(".todo__text")).map(
    (el) => el.textContent.trim().toLowerCase()
  );

  if (existingTasks.includes(taskText.toLowerCase())) {
    input.classList.add("todo__input--error");
    input.value = ""; // очищаємо
    input.setAttribute("placeholder", "This task already exists...");
    input.focus();
    input.addEventListener(
      "input",
      () => {
        input.classList.remove("todo__input--error");
        input.setAttribute("placeholder", "Enter a task...");
      },
      { once: true }
    );
    return;
  }

  if (!priorityValue) {
    selectedPriorityEl.classList.add("select-selected--error");
    selectedPriorityEl.setAttribute("data-value", "");
    selectedPriorityEl.addEventListener("click", () => {
      selectedPriorityEl.classList.remove("select-selected--error");
    });
    return;
  }

  // Мапа для класів кольорових бейджів
  const priorityClassMap = {
    high: "todo__priority--high",
    personal: "todo__priority--personal",
    low: "todo__priority--low",
    hobby: "todo__priority--hobby",
  };
  const priorityOrder = {
    high: 1, // найважливіший
    personal: 2,
    hobby: 3,
    low: 4, // найменш важливий
  };
  const priorityClass = priorityClassMap[priorityValue] || "";

  // Створюємо DOM-елемент задачі
  const li = document.createElement("li");
  li.className = "todo__item";
  li.innerHTML = `
    <label class="todo__checkbox">
      <input type="checkbox" />
      <span class="todo__checkmark"></span>
    </label>
    <span class="todo__text">${taskText}</span>
    <span class="todo__priority ${priorityClass}">${priorityLabel}</span>
    <button class="todo__delete" aria-label="Delete task">&times;</button>
  `;
  li.dataset.priority = priorityValue;

  // Знаходимо місце для вставки
  const items = list.querySelectorAll(".todo__item");
  let inserted = false;

  items.forEach((item) => {
    const itemPriority = item.dataset.priority;
    if (
      priorityOrder[priorityValue] < priorityOrder[itemPriority] &&
      !inserted
    ) {
      list.insertBefore(li, item);
      inserted = true;
    }
  });

  if (!inserted) list.appendChild(li);

  // Очищення
  input.value = "";
  selectedPriorityEl.textContent = "Select priority";
  selectedPriorityEl.removeAttribute("data-value");
  updateProgressBar();
});
// Видалення задачі
document.getElementById("todo-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("todo__delete")) {
    const item = e.target.closest(".todo__item");
    item.remove();
    setTimeout(updateProgressBar, 0);
  }
});

// Відмітка задачі як виконано
document.getElementById("todo-list").addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    const item = e.target.closest(".todo__item");
    item.classList.toggle("todo__item--done", e.target.checked);
    updateProgressBar();
  }
});

function updateProgressBar() {
  const tasks = document.querySelectorAll(".todo__item");
  const completedTasks = document.querySelectorAll(".todo__item--done");

  const total = tasks.length;
  const completed = completedTasks.length;

  console.log(`Завдань: ${total}, Виконано: ${completed}`);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressBar = document.getElementById("progress-bar");
  progressBar.dataset.width = `${percentage}%`;
  progressBar.style.width = progressBar.dataset.width;
}
