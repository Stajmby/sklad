const months = [
  "leden","unor","brezen","duben","kveten","cerven",
  "cervenec","srpen","zari","rijen","listopad","prosinec"
];

let data = JSON.parse(localStorage.getItem("harmonogram")) || {};

months.forEach(m => data[m] ??= []);

const monthSelect = document.getElementById("monthSelect");
months.forEach(m => {
  const opt = document.createElement("option");
  opt.value = m;
  opt.textContent = m.toUpperCase();
  monthSelect.appendChild(opt);
});

function save() {
  localStorage.setItem("harmonogram", JSON.stringify(data));
}

function render() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  data[monthSelect.value].forEach((task, i) => {
    const li = document.createElement("li");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.done;
    cb.onchange = () => {
      task.done = cb.checked;
      save();
    };

    const span = document.createElement("span");
    span.textContent = task.text;

    li.append(cb, span);
    list.appendChild(li);
  });
}

function addTask() {
  const text = document.getElementById("taskInput").value;
  if (!text) return;

  data[monthSelect.value].push({
    text,
    done: false,
    note: ""
  });

  document.getElementById("taskInput").value = "";
  save();
  render();
}

monthSelect.onchange = render;
render();
