let data = JSON.parse(localStorage.getItem("kanban")) || {
  backlog: [],
  build: [],
  record: [],
  edit: [],
  mix: [],
  locked: []
};

function save() {
  localStorage.setItem("kanban", JSON.stringify(data));
}

function addCard(status) {
  const text = prompt("Track name:");
  if (!text) return;
  data[status].push(text);
  save();
  render();
}

function render() {
  document.querySelectorAll(".column").forEach(col => {
    const status = col.dataset.status;
    const container = col.querySelector(".cards");
    container.innerHTML = "";

    data[status].forEach((text, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.draggable = true;

      const area = document.createElement("textarea");
      area.value = text;
      area.oninput = () => {
        data[status][index] = area.value;
        save();
      };

      card.appendChild(area);

      card.ondragstart = e => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ status, index }));
      };

      container.appendChild(card);
    });

    container.ondragover = e => e.preventDefault();
    container.ondrop = e => {
      e.preventDefault();
      const { status: from, index } = JSON.parse(e.dataTransfer.getData("text/plain"));
      const item = data[from].splice(index, 1)[0];
      data[status].push(item);
      save();
      render();
    };
  });
}

render();
