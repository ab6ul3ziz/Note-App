//get the theme mood
function setTheChosenTheme() {
  if (localStorage.getItem("theme")) {
    document.body.className = localStorage.getItem("theme");
  }
}
setTheChosenTheme();
//click on add to show new note container
let addNoteContainer = document.getElementById("new-note-container");
let newNoteSpan = document.getElementById("new-note");
newNoteSpan.onclick = () => {
  addNoteContainer.classList.add("show");
};
// click on close btn to close new note container
let closeNewNoteSpan = document.getElementById("close-btn");
closeNewNoteSpan.onclick = () => {
  addNoteContainer.classList.remove("show");
};
// show Tooltip if the input value empty
let tooltip = document.getElementById("tooltip-input");
function showTooltip() {
  if (!tooltip.classList.contains("active")) {
    tooltip.classList.add("active");
  }
}
//select elments
let notesBoxContainer = document.getElementById("notes-boxes");
let addNoteBtn = document.getElementById("add-note-button");
let inputOfText = document.getElementById("new-text-note");
let inputOfTitle = document.getElementById("new-title-note");
// hide tooltip after click on input of title
inputOfTitle.onclick = () => tooltip.classList.remove("active");
// add new note to notes-boxes
function addNewNote() {
  addNoteBtn.addEventListener("click", () => {
    if (inputOfTitle.value.trim() === "") {
      showTooltip();
    } else {
      let noteBox = document.createElement("div");
      noteBox.className = "box";
      noteBox.id = "box";
      // h3
      let noteTitleElement = document.createElement("h3");
      let noteTitleText = document.createTextNode(inputOfTitle.value);
      noteTitleElement.appendChild(noteTitleText);
      noteBox.appendChild(noteTitleElement);
      // delete icon
      let deleteIcon = document.createElement("i");
      deleteIcon.className = "fa-regular fa-trash-can delete-note";
      noteTitleElement.appendChild(deleteIcon);
      //set date & time
      let date = new Date();
      let dateAndTimeEl = document.createElement("span");
      dateAndTimeEl.className = "date-and-time";
      let dateText = document.createTextNode(
        `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} | ${date.getHours()}:${date.getMinutes()}`
      );
      dateAndTimeEl.appendChild(dateText);
      noteBox.appendChild(dateAndTimeEl);
      //paragraph
      let noteTextElement = document.createElement("p");
      let nontText = document.createTextNode(inputOfText.value);
      noteTextElement.appendChild(nontText);
      noteBox.appendChild(noteTextElement);
      // copy note text icon
      let copyIcon = document.createElement("i");
      copyIcon.className = "fa-regular fa-copy copy-note";
      noteTitleElement.appendChild(copyIcon);
      // add note box to notes box container
      notesBoxContainer.appendChild(noteBox);
      inputOfTitle.value = "";
      inputOfText.value = "";
      // close add new note container after add
      addNoteContainer.classList.remove("show");
      // set direction of text by the language
      if (isEnglishText(noteTextElement.innerHTML)) {
        noteBox.setAttribute("lang", "en");
      }
      saveNoteToLocalStorage(noteBox);
    }
    showNote();
  });
}
addNewNote();
// copy the note text to clipboard when click at copy icon
function copyText() {
  let allCopyIcon = document.querySelectorAll(".copy-note");
  allCopyIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      navigator.clipboard.writeText(
        icon.parentNode.parentNode.children.item(2).innerText
      );
      icon.className = "fa-solid fa-copy copy-note";
      let switchIcon = setTimeout(() => {
        icon.className = "fa-regular fa-copy copy-note";
      }, 2000);
    });
  });
}
// check text language
function isEnglishText(text) {
  const englishPattern = /[a-zA-Z]/;
  return englishPattern.test(text);
}
// show the note on click it and overlay
function showNote() {
  let allNoteBox = document.querySelectorAll("#box");
  let closeNoteBtn = document.getElementById("close-note-button");
  let overlay = document.getElementById("overlay");
  allNoteBox.forEach((box) => {
    box.addEventListener("click", (e) => {
      copyText();
      if (!e.target.classList.contains("delete-note")) {
        if (!box.classList.contains("show")) {
          //show overlay element and close btn
          window.scrollTo(0, 0);
          box.classList.add("show");
          overlay.classList.add("show");
          closeNoteBtn.classList.add("show");
        }
      }
    });
    closeNote(allNoteBox, closeNoteBtn, overlay);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  showNote();
});
// close note and hide overlay on click at close btn
function closeNote(allNoteBox, closeNoteBtn, overlay) {
  allNoteBox.forEach((box) => {
    closeNoteBtn.addEventListener("click", function () {
      closeNoteBtn.classList.remove("show");
      overlay.classList.remove("show");
      box.classList.remove("show");
    });
  });
}
// save note to local storage
function saveNoteToLocalStorage(noteBox) {
  let allNotes = [];
  if (localStorage.getItem("notes")) {
    allNotes = JSON.parse(localStorage.getItem("notes"));
  }
  allNotes.push(noteBox.outerHTML);
  localStorage.setItem("notes", JSON.stringify(allNotes));
}
function loadNotesFromLocalStorage() {
  if (localStorage.getItem("notes")) {
    let allNotes = JSON.parse(localStorage.getItem("notes"));
    allNotes.forEach((note) => {
      notesBoxContainer.innerHTML += note;
    });
  }
}
loadNotesFromLocalStorage();
function deleteNoteBox(noteBox) {
  noteBox.remove();
  deleteNoteFromLocalStorage(noteBox);
}
// delete note and refrech local storage
function deleteNoteFromLocalStorage(noteBox) {
  let allNotes = [];
  if (localStorage.getItem("notes")) {
    allNotes = JSON.parse(localStorage.getItem("notes"));
    allNotes = allNotes.filter((note) => note !== noteBox.outerHTML);
    localStorage.setItem("notes", JSON.stringify(allNotes));
  }
}
//click on trash icon to delete note from page & local storage
notesBoxContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-note")) {
    let noteBox = e.target.parentNode.parentNode;
    deleteNoteBox(noteBox);
  }
});
// set icon theme when page reload
const iconTheme = document.querySelector("#icon");
if (localStorage.getItem("theme")) {
  iconTheme.className = "fa-solid fa-moon moon-icon";
  addThemeToStorage();
}
// switch between icon & theme
iconTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  if (iconTheme.classList.contains("fa-sun")) {
    iconTheme.className = "fa-solid fa-moon moon-icon";
  } else {
    iconTheme.className = "fa-solid fa-sun sun-icon";
  }
  addThemeToStorage();
});
// save the chosen theme to local storeage
function addThemeToStorage() {
  let chosenTheme = document.body.classList.value;
  localStorage.setItem("theme", `${chosenTheme}`);
}
