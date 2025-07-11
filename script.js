const task_input = document.querySelector("#task-input");
const clear_btn = document.querySelector(".clear-btn");
const all = document.querySelector("#all");
const pending = document.querySelector("#pending");
const complete = document.querySelector("#completed");
const tabs = document.querySelectorAll("#input div a");
const list_group = document.querySelectorAll(".list-group");

let db = new Database({ table: "myTasks" });

const create_task_li = (ev) => {
  const li = document.createElement('li');
  li.classList.add('list-item');

  const div1 = document.createElement('div');
  div1.classList.add('div1');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = ev.status;
  input.onchange = () => update_status(input, ev.uuid);

  const span = document.createElement('span');
  if (ev.status) span.className = 'completed';
  span.textContent = ev.task;

  div1.appendChild(input);
  div1.appendChild(span);
  li.appendChild(div1);

  const dropup = document.createElement('div');
  dropup.classList.add('dropup');

  const dropup_span = document.createElement('span');
  dropup_span.textContent = "•••";

  const dropup_content = document.createElement('div');
  dropup_content.classList.add('dropup-content');

  const heading = document.createElement('div');
  heading.classList.add('heading');
  heading.textContent = `${ev.task.slice(0, 10)}${ev.task.length >= 10 ? "..." : ''}`;

  const edit_btn = document.createElement('a');
  edit_btn.classList.add('edit-btn');
  edit_btn.textContent = 'Edit';
  edit_btn.onclick = () => edit_task(span, ev.uuid);

  const delete_btn = document.createElement('a');
  delete_btn.classList.add('delete-btn');
  delete_btn.textContent = 'Delete';
  delete_btn.onclick = () => delete_task(ev.uuid);

  dropup_content.appendChild(heading);
  dropup_content.appendChild(edit_btn);
  dropup_content.appendChild(delete_btn);
  dropup.appendChild(dropup_content);
  dropup.appendChild(dropup_span);
  li.appendChild(dropup);

  return li;
};

const load_task = () => {
  db.getAllData()
    .then((all_tasks) => {
      all.innerHTML = "";
      pending.innerHTML = "";
      complete.innerHTML = "";

      if (all_tasks && all_tasks.length > 0) {
        all_tasks.forEach((ev) => {
          const li_all = create_task_li(ev);
          const li_tab = create_task_li(ev);

          all.appendChild(li_all);
          if (ev.status) {
            complete.appendChild(li_tab);
          } else {
            pending.appendChild(li_tab);
          }
        });
        task_input.value = "";
      }
    });
};

load_task();

task_input.onkeypress = (e) => {
  const task_value = e.target.value.trim();
  if (e.key === "Enter" && task_value !== '') {
    const data = {
      task: task_value,
      status: false
    };
    db.addData(data).then(() => load_task());
  }
};

function update_status(e, id) {
  db.updateData(id, { status: e.checked }).then(() => load_task());
}

function delete_task(id) {
  if (confirm("Are you sure?")) {
    db.deleteData(id).then(() => load_task());
  }
}

clear_btn.onclick = () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    db.delete();
    window.location.reload();
  }
};

function edit_task(span, id) {
  span.contentEditable = true;
  span.focus();
  span.onblur = (e) => {
    const updatedText = e.target.textContent.trim();
    if (updatedText) {
      db.updateData(id, { task: updatedText }).then(() => load_task());
    } else {
      load_task(); // Prevent saving empty text
    }
  };
}

// Slider effect on tab click
tabs.forEach((tab) => {
  tab.onclick = (e) => {
    tabs.forEach(t => t.classList.remove("active"));
    e.currentTarget.classList.add("active");

    const target = e.currentTarget.getAttribute("data-tab");

    list_group.forEach(list => {
      list.classList.remove("active");
      if ('#' + list.id === target) {
        setTimeout(() => list.classList.add("active"), 10);
      }
    });
  };
});