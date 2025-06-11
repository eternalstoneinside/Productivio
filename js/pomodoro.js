let pomodoro = document.getElementById("pomodoro-timer");
let short = document.getElementById("short-timer");
let long = document.getElementById("long-timer");
let timers = document.querySelectorAll(".pomodoro__timer-display");
let session = document.getElementById("pomodoro-sesion");
let shortBreak = document.getElementById("short-break");
let longBreak = document.getElementById("long-break");
let startBtn = document.getElementById("start");
let stopBtn = document.getElementById("stop");
let resetBtn = document.getElementById("reset");

let pomodoroOptions = document.querySelectorAll(".pomodoro-option");

let currentTimer = null;
let timerInterval = null;
let remainingTimes = {
  pomodoro: null,
  short: null,
  long: null,
}; // залишок часу у мс
function getCurrentTimerKey() {
  if (currentTimer === pomodoro) return "pomodoro";
  if (currentTimer === short) return "short";
  if (currentTimer === long) return "long";
}
// show deafault timer
function showDefaultTimer() {
  pomodoro.style.display = "block";
  short.style.display = "none";
  long.style.display = "none";

  stopBtn.classList.add("disabled");
  resetBtn.classList.add("disabled");
  currentTimer = pomodoro;
  //   timers.innerHTML = pomodoro.innerHTML;
}

showDefaultTimer();

function hideAllTimers() {
  pomodoro.style.display = "none";
  short.style.display = "none";
  long.style.display = "none";
}

session.addEventListener("click", function () {
  hideAllTimers();

  pomodoro.style.display = "block";

  session.classList.add("active");
  shortBreak.classList.remove("active");
  longBreak.classList.remove("active");

  resetBtn.disabled = false;
  resetBtn.classList.remove("disabled");

  currentTimer = pomodoro;
  //   timers.innerHTML = pomodoro.innerHTML;
});

shortBreak.addEventListener("click", function () {
  hideAllTimers();

  short.style.display = "block";

  session.classList.remove("active");
  shortBreak.classList.add("active");
  longBreak.classList.remove("active");
  //   timers.innerHTML = pomodoro.innerHTML;

  resetBtn.disabled = false;
  resetBtn.classList.remove("disabled");

  currentTimer = short;
});
longBreak.addEventListener("click", function () {
  hideAllTimers();

  long.style.display = "block";

  longBreak.classList.add("active");
  shortBreak.classList.remove("active");
  session.classList.remove("active");

  resetBtn.disabled = false;
  resetBtn.classList.remove("disabled");
  //   timers.innerHTML = pomodoro.innerHTML;
  currentTimer = long;
});

//start timer

function startTimer(timerDisplay) {
  if (timerInterval) {
    cancelAnimationFrame(timerInterval); // Замість clearInterval
  }

  startBtn.disabled = true;
  startBtn.classList.add("disabled");

  stopBtn.disabled = false;
  stopBtn.classList.remove("disabled");

  resetBtn.disabled = false;
  resetBtn.classList.remove("disabled");

  let key = getCurrentTimerKey();
  let durationInMilliseconds;

  if (remainingTimes[key] !== null) {
    durationInMilliseconds = remainingTimes[key];
  } else {
    let timerDuration = timerDisplay
      .getAttribute("data-duration")
      .split(":")[0];
    durationInMilliseconds = timerDuration * 60 * 1000;
  }

  let endTimestamp = Date.now() + durationInMilliseconds;

  function updateTimer() {
    let remaining = endTimestamp - Date.now();
    remainingTimes[key] = remaining;

    if (remaining <= 0) {
      timerDisplay.textContent = "00:00";
      remainingTimes[key] = null;

      const alarm = new Audio("https://www.soundjay.com/button/beep-07.wav");
      alarm.play();

      startBtn.disabled = false;
      startBtn.classList.remove("disabled");

      [session, shortBreak, longBreak].forEach((btn) =>
        btn.classList.remove("disabled")
      );
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    timerDisplay.textContent = formattedTime;

    timerInterval = requestAnimationFrame(updateTimer); // Тут рекурсивний виклик
  }

  timerInterval = requestAnimationFrame(updateTimer);
}

startBtn.addEventListener("click", function () {
  if (!currentTimer) return;

  startTimer(currentTimer);

  // Всі варіанти кнопок для перемикання таймерів
  const buttons = [session, shortBreak, longBreak];

  // Додаємо disabled до всіх, крім активної
  buttons.forEach((btn) => {
    if (btn !== currentTimer) {
      btn.classList.add("disabled");
    } else {
      btn.classList.remove("disabled");
    }
  });
});

stopBtn.addEventListener("click", function () {
  if (currentTimer) {
    cancelAnimationFrame(timerInterval);
    startBtn.disabled = false;
    startBtn.classList.remove("disabled");

    stopBtn.disabled = true;
    stopBtn.classList.add("disabled");

    // Залишок часу лишається, щоб можна було продовжити

    // Знімаємо disabled з усіх кнопок
    [session, shortBreak, longBreak].forEach((btn) =>
      btn.classList.remove("disabled")
    );
  }
});

resetBtn.addEventListener("click", function () {
  if (currentTimer) {
    cancelAnimationFrame(timerInterval);
    const duration = currentTimer.getAttribute("data-duration");
    currentTimer.textContent = duration;

    startBtn.disabled = false;
    startBtn.classList.remove("disabled");

    stopBtn.disabled = true;
    stopBtn.classList.add("disabled");

    resetBtn.disabled = true;
    resetBtn.classList.add("disabled");

    let key = getCurrentTimerKey();
    remainingTimes[key] = null;

    [session, shortBreak, longBreak].forEach((btn) =>
      btn.classList.remove("disabled")
    );
  }
});
