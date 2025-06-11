document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("auth-modal");
  const usernameInput = document.getElementById("username-input");
  const saveButton = document.getElementById("save-username");
  const welcomeTitle = document.querySelector(".welcome__title");
  const errorBox = document.getElementById("auth-error");
  const mainContent = document.querySelector(".main");

  // Плавне зникнення прелоадера та поява контенту
  setTimeout(() => {
    preloader.classList.add("fade-out");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("visible");
  }, 500);

  const savedName = localStorage.getItem("username");
  if (savedName) {
    welcomeTitle.textContent = `Hello, ${savedName}!`;
    modal.style.display = "none";
    // Показати прелоадер
  } else {
    modal.style.display = "flex";
  }

  function isValidName(name) {
    return /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]{2,}$/.test(name);
  }

  saveButton.addEventListener("click", () => {
    const name = usernameInput.value.trim();

    if (!isValidName(name)) {
      errorBox.textContent =
        "Please enter a valid name (only letters, min 2 characters)";
      return;
    }

    localStorage.setItem("username", name);
    welcomeTitle.textContent = `Hello, ${name}!`;
    modal.style.display = "none";

    // Показати прелоадер перед перезавантаженням
    // Показати прелоадер знову перед reload
    preloader.classList.remove("fade-out");
    preloader.style.display = "flex";
    mainContent.classList.remove("visible");

    setTimeout(() => {
      window.location.reload();
    }, 500); // або 500 для плавності
  });
});

//localStorage.clear(); // Clear localStorage for testing purposes, remove in production
