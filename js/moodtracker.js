document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(
    ".mood-tracker__options button"
  );
  const currentMoodText = document.querySelector(".mood-tracker__current");
  const moodChartContainer = document.getElementById("moodChart");
  const historyButton = document
    .getElementById("history-button")
    .addEventListener("click", () => {
      moodChartContainer.style.maxHeight =
        moodChartContainer.style.maxHeight === "400px" ? "0" : "400px";
    });
  let moodChart;

  const username = localStorage.getItem("username");

  if (!username) {
    currentMoodText.textContent = "Please enter your name first.";
    moodButtons.forEach((btn) => (btn.disabled = true));
    return;
  }

  // Ключ для зберігання історії у localStorage
  const moodKey = `moodHistory_${username}`;

  // Завантаження історії з localStorage
  let moodHistory = JSON.parse(localStorage.getItem(moodKey)) || [];

  // Показати останній настрій
  if (moodHistory.length > 0) {
    const lastMood = moodHistory[moodHistory.length - 1];
    currentMoodText.textContent = `Your current mood is: ${lastMood.mood}`;
    renderMoodChart(); // <--- додай ось це
  }

  const updateMoodHistoryDisplay = renderMoodChart;

  function renderMoodChart() {
    const ctx = document.getElementById("moodChart").getContext("2d");

    const labels = moodHistory.map((entry) => entry.date);
    const moods = moodHistory.map((entry) => entry.mood);

    const moodToNumber = {
      Happy: 5,
      Excited: 4,
      Neutral: 3,
      Sad: 2,
      Angry: 1,
    };

    const dataValues = moods.map((mood) => moodToNumber[mood] || 0);

    if (moodChart) moodChart.destroy();

    moodChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Mood Level Over Time",
            data: dataValues,
            fill: false,
            borderColor: "blue",
            tension: 0.1,
            pointBackgroundColor: "blue",
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 6,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                const numToMood = {
                  1: "Angry",
                  2: "Sad",
                  3: "Neutral",
                  4: "Excited",
                  5: "Happy",
                };
                return numToMood[value] || "";
              },
            },
          },
        },
      },
    });
  }

  // При натисканні на кнопку настрою
  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.dataset.mood;
      const date = new Date().toLocaleString(); // або toLocaleDateString() для коротшої дати

      const entry = { mood, date };
      moodHistory.push(entry);
      localStorage.setItem(moodKey, JSON.stringify(moodHistory));

      // Скидаємо scale для всіх кнопок
      moodButtons.forEach((btn) => {
        btn.style.transform = "scale(1)";
      });

      // Збільшуємо лише вибрану кнопку
      button.style.transform = "scale(1.1)";
      // 🟡 ОНОВЛЕННЯ тексту поточного настрою
      currentMoodText.textContent = `Your current mood is: ${mood}`;

      updateMoodHistoryDisplay();
    });
  });
});

//localStorage.clear(); // Очистити localStorage для тестування, видалити в продакшн
