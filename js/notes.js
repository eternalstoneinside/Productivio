document.addEventListener("DOMContentLoaded", () => {
  const noteInput = document.getElementById("notes-input");
  const addNoteBtn = document.getElementById("notes-add");
  const noteList = document.getElementById("note-list");

  const notesKey = "myNotes";
  let notes = JSON.parse(localStorage.getItem(notesKey)) || [];

  function renderNotes() {
    noteList.innerHTML = "";
    notes.forEach((note, index) => {
      const noteItem = document.createElement("div");
      noteItem.className = "note-item";
      noteList.style.display = "flex";
      noteItem.draggable = true;
      noteItem.dataset.index = index;

      noteItem.innerHTML = `
      <p>${note}</p>
      <button data-index="${index}" class="delete-note">x</button>
    `;
      noteList.appendChild(noteItem);
    });

    // Видалення
    document.querySelectorAll(".delete-note").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        notes.splice(index, 1);
        localStorage.setItem(notesKey, JSON.stringify(notes));
        renderNotes();
      });
    });

    enableDragAndDrop(); // <--- додаємо функціонал драг-н-дроп
  }
  function enableDragAndDrop() {
    let dragStartIndex;

    const noteItems = document.querySelectorAll(".note-item");

    noteItems.forEach((item) => {
      item.addEventListener("dragstart", () => {
        dragStartIndex = +item.dataset.index;
        item.classList.add("dragging");
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        item.classList.add("drag-over");
      });

      item.addEventListener("dragleave", () => {
        item.classList.remove("drag-over");
      });

      item.addEventListener("drop", () => {
        const dragEndIndex = +item.dataset.index;
        item.classList.remove("drag-over");
        swapNotes(dragStartIndex, dragEndIndex);
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
      });
    });
  }

  function swapNotes(fromIndex, toIndex) {
    const item = notes[fromIndex];
    notes.splice(fromIndex, 1);
    notes.splice(toIndex, 0, item);
    localStorage.setItem(notesKey, JSON.stringify(notes));
    renderNotes();
  }
  addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (text === "") return;

    notes.push(text);
    localStorage.setItem(notesKey, JSON.stringify(notes));
    noteInput.value = "";
    renderNotes();
  });

  // Початкове відображення
  renderNotes();
});
