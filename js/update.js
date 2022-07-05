const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'BOOK_APPS';
const UPDATE_KEY = 'Update_index';

let todoTarget = JSON.parse(localStorage.getItem(UPDATE_KEY));
const serializedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
const data = serializedData[todoTarget];
console.log(data.id);
console.log(data.judulBuku);

function generateTodoObject(id, judulBuku, penulis, tahun, timestamp, isCompleted) {
  return {
    id,
    judulBuku,
    penulis,
    tahun,
    timestamp,
    isCompleted
  };
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
  
    document.dispatchEvent(new Event(SAVED_EVENT));
    console.log("Saved Succes");
  }
}

function loadDataFromStorage() {
  if (serializedData !== null) {
    for (const todo of serializedData) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addTodo() {
  const judulBuku = document.getElementById('title').value;
  const penulis = document.getElementById('author').value;
  const tahun = document.getElementById('year').value;
  const timestamp = document.getElementById('sRead').value;

  const generatedID = data.id;
  const todoObject = generateTodoObject(generatedID, judulBuku, penulis, tahun, timestamp, data.isCompleted);

  if (todoTarget === -1) return;
  todos.splice(todoTarget, 1, todoObject);
  
  saveData();
}

function updateTask(todoIndex) {
  if (todoIndex == null) return;

  const titleValue = data.judulBuku;
  const penulisValue = data.penulis;
  const tahunValue = data.tahun;
  const timestampValue = data.timestamp;

  let newTitle = document.getElementById('title');
  let newPenulis = document.getElementById('author');
  let newTahun = document.getElementById('year');
  let newTime = document.getElementById('sRead');
  
  newTitle.value = titleValue;
  newPenulis.value = penulisValue;
  newTahun.value = tahunValue;
  newTime.value = timestampValue;

}

document.addEventListener('DOMContentLoaded', function () {

  const updateForm = document.getElementById('update-form');

  updateForm.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("Update Button Click");  
    addTodo();
    updateForm.reset();
    window.location.replace("index.html");
  });


  if (isStorageExist()) {
    loadDataFromStorage();
    updateTask(todoTarget);
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});
