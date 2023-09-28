let tasks = [];

let taskId = 0;

const Status = {
  Pending: "Pending",
  Done: "Done",
};

function GenerateId() {
  taskId++;
  return taskId;
}

const taskFactory = function (title, description) {
  return {
    _id: GenerateId(),
    title: title,
    description: description,
    status: Status.Pending,
  };
};

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

loadTasks();

function searchByTitle(searchTerm) {
  let searchResult = [];
  for (const task of tasks) {
    if (task.title.includes(searchTerm)) {
      searchResult.push(task);
    }
  }
  return searchResult;
}


function uncheckTask(id) {
  for (const task of tasks) {
    if (task._id === id && task.status === Status.Done) {
      task.status = Status.Pending;
      saveToLocalStorage();
      return;
    }
  }
}

function checkTask(id) {
  for (const task of tasks) {
    if (task._id === id && task.status === Status.Pending) {
      task.status = Status.Done;
      saveToLocalStorage();
      return;
    }
  }
}

function validateTaskDescription(description) {
  for (const task of tasks) {
    if (task.description === description) {
      return false;
    }
  }
  return true;
}

function addTask(title, description) {
  const newTask = taskFactory(title, description);
  tasks.push(newTask);
  saveToLocalStorage();
  return newTask;
}

function deleteTask(id) {
  let index = 0;
  for (const task of tasks) {
    if (task._id === id) {
      tasks.splice(index, 1);
      saveToLocalStorage();
      return;
    }
    index++;
  }
}

function filterByStatus(status) {
  if (status !== Status.Done && status !== Status.Pending) {
    return "invalid status";
  }

  let filteredTasks = [];
  for (const task of tasks) {
    if (task.status === status) {
      filteredTasks.push(task);
    }
  }

  return filteredTasks;
}

function orderByNewestFirst() {
  let orderedTasks = [];

  for (let i = tasks.length - 1; i >= 0; i--) {
    orderedTasks.push(tasks[i]);
  }

  return orderedTasks;
}

function renderTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const listItem = createTaskListItem(task);
    taskList.appendChild(listItem);
  });
}

document
  .getElementById("task-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("Ttitle").value.trim();
    const description = document.getElementById("Tdescription").value.trim();

    if (!validateTaskDescription(description)) {
      alert("Task already exists");
    } else if (title && description && validateTaskDescription(description)) {
      const newTask = addTask(title, description);
      const listItem = createTaskListItem(newTask);
      const taskList = document.getElementById("task-list");
      taskList.appendChild(listItem);
      document.getElementById("Ttitle").value = "";
    }
    document.getElementById("Tdescription").value = "";
  });

function createTaskListItem(task) {
  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  const titleElement = document.createElement("div");
  titleElement.textContent = task.title;

  const descriptionElement = document.createElement("div");
  descriptionElement.textContent = task.description;

  const statusElement = document.createElement("div");

  const statusValue = document.createElement("span");
  statusValue.textContent = task.status;

  statusValue.classList.add(task.status.toLowerCase());

  statusElement.appendChild(document.createTextNode("Status: "));
  statusElement.appendChild(statusValue);
  if (task.status === Status.Done) {
    descriptionElement.classList.add("strikethrough");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.status === Status.Done;
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      statusValue.classList.remove(task.status.toLowerCase());
      checkTask(task._id);
      descriptionElement.classList.add("strikethrough");
    } else if (!checkbox.checked) {
      statusValue.classList.remove(task.status.toLowerCase());
      uncheckTask(task._id);
      descriptionElement.classList.remove("strikethrough");
    }

    statusValue.textContent = task.status;
    statusValue.classList.add(task.status.toLowerCase());
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the task?"
    );
    if (confirmDelete) {
      deleteTask(task._id);
      listItem.remove();
    }
  });

  listItem.appendChild(titleElement);
  listItem.appendChild(descriptionElement);
  listItem.appendChild(statusElement);
  listItem.appendChild(checkbox);
  listItem.appendChild(deleteButton);

  return listItem;
}

document.getElementById("filter-button").addEventListener("click", function () {
  const filterDropdown = document.getElementById("filter-dropdown");

  if (filterDropdown.style.display === "block") {
    filterDropdown.style.display = "none";
  } else {
    filterDropdown.style.display = "block";
  }

  document
    .querySelector(".filter-option[data-status='Done']")
    .addEventListener("click", function () {
      const filteredTasks = filterByStatus(Status.Done);
      renderTasks(filteredTasks);
    });

  document
    .querySelector(".filter-option[data-status='Pending']")
    .addEventListener("click", function () {
      const filteredTasks = filterByStatus(Status.Pending);
      console.log(filteredTasks);
      renderTasks(filteredTasks);
    });
});

document
  .getElementById("allTasks-button")
  .addEventListener("click", function () {
    renderTasks(tasks);
  });

document
  .getElementById("orderBy-button")
  .addEventListener("click", function () {
    const orderDropdown = document.getElementById("order-dropdown");

    if (orderDropdown.style.display === "block") {
      orderDropdown.style.display = "none";
    } else {
      orderDropdown.style.display = "block";
    }
  });

document
  .querySelector(".order-option[data-order='newest']")
  .addEventListener("click", function () {
    renderTasks(orderByNewestFirst());
  });

document
  .querySelector(".order-option[data-order='oldest']")
  .addEventListener("click", function () {
    renderTasks(tasks);
  });
  
document.getElementById("search-button").addEventListener("click", function() {
  const searchTerm = document.getElementById("search-term").value.trim();
  renderTasks(searchByTitle(searchTerm));
});


renderTasks(tasks);
