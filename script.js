
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const months = [
  "Leden","Únor","Březen","Duben","Květen","Červen",
  "Červenec","Srpen","Září","Říjen","Listopad","Prosinec"
];

const monthSelect = document.getElementById("monthSelect");
const taskList = document.getElementById("taskList");
const taskText = document.getElementById("taskText");
const taskNote = document.getElementById("taskNote");
const addBtn = document.getElementById("addBtn");
const weekList = document.getElementById("weekList");
const taskDate = document.getElementById("taskDate");

// načtení dat nebo vytvoření prázdných
let data = JSON.parse(localStorage.getItem("harmonogram")) || {};

// vytvoření měsíců pokud nejsou
months.forEach(m => {
  if (!data[m]) data[m] = [];
  const option = document.createElement("option");
  option.value = m;
  option.textContent = m;
  monthSelect.appendChild(option);
});

// uložit data
function save() {
  localStorage.setItem("harmonogram", JSON.stringify(data));
}

async function loadTasksFromBackend() {
  // vyprázdníme lokální data
  months.forEach(m => data[m] = []);

  const snapshot = await getDocs(collection(db, "tasks"));

  snapshot.forEach(docSnap => {
    const task = { id: docSnap.id, ...docSnap.data() };
    data[task.month].push(task);
  });

  render();
}


function renderWeek() {
  weekList.innerHTML = "";

  const today = new Date();
  today.setHours(0,0,0,0);

  const inSevenDays = new Date();
  inSevenDays.setDate(today.getDate() + 7);
  inSevenDays.setHours(23,59,59,999);

  Object.values(data).forEach(monthTasks => {
    monthTasks.forEach(task => {
      if (task.done) return;

      const taskDate = new Date(task.plannedDate);

      if (taskDate >= today && taskDate <= inSevenDays) {
        const li = document.createElement("li");
        li.textContent = `${task.text} – ${task.plannedDate}`;
        weekList.appendChild(li);
      }
    });
  });
}


// vykreslení úkolů
function render() {
  taskList.innerHTML = "";
  const month = monthSelect.value;
  const today = new Date().toISOString().split("T")[0];

    data[month].forEach((task, index) => {

    const li = document.createElement("li");

    const row = document.createElement("div");
    row.className = "task-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.done) text.classList.add("done");

    checkbox.onchange = () => {
      task.done = checkbox.checked;
      if (task.done) {
        task.completedAt = new Date().toISOString();
      }
      save();
      render();
    };

    row.appendChild(checkbox);
    row.appendChild(text);
    li.appendChild(row);

    // 🔴 prošvihlé úkoly
    if (!task.done && task.plannedDate < today) {
      li.classList.add("overdue");
    }

    // 📅 termín úkolu
    const dateInfo = document.createElement("small");
    dateInfo.textContent = "Termín: " + task.plannedDate;
    li.appendChild(dateInfo);

    // 📝 poznámka
    if (task.note) {
      const note = document.createElement("small");
      note.textContent = "Poznámka: " + task.note;
      li.appendChild(note);
    }

    // 🔧 akce
const actions = document.createElement("div");
actions.className = "task-actions";

const editBox = document.createElement("div");
editBox.className = "edit-box";

const editText = document.createElement("input");
editText.value = task.text;

const editDate = document.createElement("input");
editDate.type = "date";
editDate.value = task.plannedDate;

const editNote = document.createElement("input");
editNote.value = task.note || "";

const saveBtn = document.createElement("button");
saveBtn.textContent = "Uložit";

const cancelBtn = document.createElement("button");
cancelBtn.textContent = "Zrušit";


// ✏️ upravit
const editBtn = document.createElement("button");
editBtn.textContent = "Upravit";
editBtn.className = "edit";

editBtn.onclick = () => {
  editBox.style.display = editBox.style.display === "block" ? "none" : "block";
};

saveBtn.onclick = () => {
  if (!editText.value || !editDate.value) {
    alert("Název a datum jsou povinné");
    return;
  }

  task.text = editText.value;
  task.plannedDate = editDate.value;
  task.note = editNote.value;

  save();
  render();

};

cancelBtn.onclick = () => {
  editText.value = task.text;
  editDate.value = task.plannedDate;
  editNote.value = task.note || "";
  editBox.style.display = "none";
};


actions.appendChild(editBtn);

// 🗑 smazat
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Smazat";
deleteBtn.className = "delete";
deleteBtn.onclick = () => {
  if (confirm("Opravdu chceš úkol smazat?")) {
    data[month].splice(index, 1);
    save();
    render();
  }
};


editBox.append(editText, editDate, editNote, saveBtn, cancelBtn);
li.appendChild(editBox);

actions.appendChild(deleteBtn);
li.appendChild(actions);

taskList.appendChild(li);
});
renderWeek();

}


// přidání úkolu
addBtn.onclick = async () => {
  if (!taskText.value || !taskDate.value) {
    alert("Úkol musí mít název a datum.");
    return;
  }

  await addDoc(collection(db, "tasks"), {
    text: taskText.value,
    note: taskNote.value,
    plannedDate: taskDate.value,
    done: false,
    completedAt: null,
    month: monthSelect.value,
    createdAt: serverTimestamp()
  });

  taskText.value = "";
  taskNote.value = "";
  taskDate.value = "";

  loadTasksFromBackend();
};



monthSelect.onchange = render;
loadTasksFromBackend();
