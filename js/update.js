const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const UPDATE_KEY = 'Update_index';

let bookTarget = JSON.parse(localStorage.getItem(UPDATE_KEY));
const serializedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
const data = serializedData[bookTarget];
console.log(data.id);
console.log(data.judulBuku);

function generateBookObject(id, judulBuku, penulis, tahun, timestamp, isCompleted) {
  return {
    id,
    judulBuku,
    penulis,
    tahun,
    timestamp,
    isCompleted
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
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
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  
    document.dispatchEvent(new Event(SAVED_EVENT));
    console.log("Saved Succes");
  }
}

function loadDataFromStorage() {
  if (serializedData !== null) {
    for (const book of serializedData) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const judulBuku = document.getElementById('title').value;
  const penulis = document.getElementById('author').value;
  const tahun = document.getElementById('year').value;
  const timestamp = document.getElementById('sRead').value;

  const generatedID = data.id;
  const bookObject = generateBookObject(generatedID, judulBuku, penulis, tahun, timestamp, data.isCompleted);

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1, bookObject);
  
  saveData();
}

function updateTask(bookIndex) {
  if (bookIndex == null) return;

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
    addBook();
    updateForm.reset();
    window.location.replace("index.html");
  });


  if (isStorageExist()) {
    loadDataFromStorage();
    updateTask(bookTarget);
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});
