let books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const UPDATE_KEY = 'Update_index';

function generateId() {
  return +new Date();
}

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
  }
}

function loadDataFromStorage() {

  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {

  const {id, judulBuku, penulis, tahun, timestamp, isCompleted} = bookObject;

  const textjudulBuku = document.createElement('h3');
  textjudulBuku.innerText = judulBuku;

  const textpenulis = document.createElement('p');
  textpenulis.innerText = `Karya : ${penulis}, ${tahun}`;

  const textsRead = document.createElement('p');
  textsRead.innerText = `Mulai dibaca pada ${timestamp}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');

  const textMain = document.createElement('div');
  textMain.classList.add('inner-book');
  textMain.append(textjudulBuku, textpenulis, textsRead);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  textContainer.append(textMain, actionContainer);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);
  
  if (isCompleted) {
    
    const Dbutton = document.createElement('button');
    Dbutton.classList.add('dropbtn');

    const dropContent = document.createElement('a');
    dropContent.classList.add('undo');
    dropContent.innerText = "Tandai belum dibaca";
    dropContent.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const dropContent2 = document.createElement('a');
    dropContent2.classList.add('delete');
    dropContent2.innerText = "Hapus";
    dropContent2.addEventListener('click', function () {
      if (confirm("Apakah Anda yakin akan menghapus item ini ?")) {
        removeTaskFromCompleted(id);
      }
    });

    const dropContent3 = document.createElement('a');
    dropContent3.classList.add('update');
    dropContent3.innerText = "Perbarui";
    dropContent3.addEventListener('click', function () {
      updateTask(id);
    });
    
    const dropDownContent = document.createElement('div');
    dropDownContent.classList.add('dropDownContent');
    dropDownContent.append(dropContent, dropContent2, dropContent3);

    const dropDown = document.createElement('div');
    dropDown.classList.add('dropDown');
    dropDown.append(Dbutton, dropDownContent);

    actionContainer.append(dropDown);
  } else {
    const Dbutton = document.createElement('button');
    Dbutton.classList.add('dropbtn');

    const dropContent2 = document.createElement('a');
    dropContent2.classList.add('delete');
    dropContent2.innerText = "Hapus";
    dropContent2.addEventListener('click', function () {
      if (confirm("Apakah Anda yakin akan menghapus item ini ?")) {
        removeTaskFromCompleted(id);
      }
    });
    const dropContent3 = document.createElement('a');
    dropContent3.classList.add('update');
    dropContent3.innerText = "Perbarui";
    dropContent3.addEventListener('click', function () {
      updateTask(id);
    });

    const dropContent4 = document.createElement('a');
    dropContent4.classList.add('check');
    dropContent4.innerText = "Tandai sudah dibaca";
    dropContent4.addEventListener('click', function () {
      addTaskToCompleted(id);
    });
    
    const dropDownContent = document.createElement('div');
    dropDownContent.classList.add('dropDownContent');
    dropDownContent.append(dropContent4, dropContent2, dropContent3);

    const dropDown = document.createElement('div');
    dropDown.classList.add('dropDown');
    dropDown.append(Dbutton, dropDownContent);
    actionContainer.append(dropDown);
  }

  return container;
}

function addBook() {
  const judulBuku = document.getElementById('title').value;
  const penulis = document.getElementById('author').value;
  const tahun = document.getElementById('year').value;
  const timestamp = document.getElementById('sRead').value;
  const checkbox = document.getElementById('isRead');
  let isRead = false;
  if (checkbox.checked == true) {
    console.log('CEK');
    isRead = true;
  }
  else {
    console.log('UNCEK');
  }
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, judulBuku, penulis, tahun, timestamp, isRead);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}


function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function updateTask(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget == null) return;

  const parsed = JSON.stringify(bookTarget);
  localStorage.setItem(UPDATE_KEY, parsed);

  window.location.replace("update.html");
}

function findItem() {
  const LocalData = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const textBook = document.getElementById('title').value;

  for (const element of LocalData){
    let Etask = element.task;
    if (Etask == textBook) {
      console.log(Etask);
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('form');
  const forms = document.forms;


  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    form.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }


  const search = forms['Findform'].querySelector('input');
  search.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const books = document.getElementsByClassName('inner');

    Array.from(books).forEach((book) => {
        const title = book.firstElementChild.firstElementChild.innerText;

        if (title.toLowerCase().indexOf(term) != -1) {
          book.style.display = "flex";
        } else {
          book.style.display = "none";
        }
      });
  });

});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');

  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}