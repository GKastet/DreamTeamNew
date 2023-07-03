import Pagination from 'tui-pagination';
import {allBooksInfo} from './shopping.js';
import { shoppingEmptyMarkup } from './render.js';

const booksLocalStorage = JSON.parse(localStorage.getItem('books') || '[]');

const refs = {
bookList: document.querySelector('.shopping-book-list'),
paginationContainer: document.getElementById('tui-pagination-container'),
emptyList: document.querySelector('.shopping-empty-list'),
}

let booksPerPage = 3;
let visiblePages = 3;
const page = 0;
function checkDeviceWidth(){
  if (window.innerWidth < 768) {
    booksPerPage = 4;
    visiblePages = 2;
    }}
    checkDeviceWidth()
allBooksInfo(paginationFromStorage(page, booksPerPage))
function paginationFromStorage(page, booksPerPage){
  const paginatedLocalStorageBooks = booksLocalStorage.slice(page, booksPerPage)
  return paginatedLocalStorageBooks
  }
const paginationOptions = {
    totalItems: booksLocalStorage.length,
    itemsPerPage: booksPerPage,
    visiblePages: visiblePages,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
    page: 1,
    template: { page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
      '</a>'
    },
  }

const pagination = new Pagination(refs.paginationContainer, paginationOptions);

function displayCurrentPage() {
  const currentPage = pagination.getCurrentPage();
  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const currentPageData = booksLocalStorage.slice(start, end);
  checkLocalStoragePaginated(currentPageData)
  }

pagination.on('afterMove', function (eventData) {
  displayCurrentPage();
  });

refs.bookList.addEventListener('click', handlerDeleteBook);

function handlerDeleteBook(evt) {
    if (evt.target.nodeName !== 'BUTTON') {
      return;
    }
    let newLocalStorage = booksLocalStorage;
    const deleteBook = evt.target.parentNode.parentNode;  
    const deleteBookId = deleteBook.dataset['id'];
    const deleteIndex = newLocalStorage.indexOf(deleteBookId); 
    newLocalStorage.splice(deleteIndex, 1);
    deleteBook.remove();
    localStorage.setItem('books', JSON.stringify(newLocalStorage));
    newLocalStorage = JSON.parse(localStorage.getItem('books'));
    if (!refs.bookList.children.length){
      console.log(refs.bookList.children.length);
      pagination.movePageTo(pagination.getCurrentPage() - 1)
    }
    return;
  }
  
  function checkLocalStoragePaginated(arr) {
    if (!arr.length) {
      refs.paginationContainer.setAttribute('hidden', 'true');
       refs.emptyList.insertAdjacentHTML('afterbegin', shoppingEmptyMarkup());////if (!arr.length) {
       refs.emptyList.classList.remove('display');
       refs.bookList.classList.add('display');
    } else {
       refs.emptyList.classList.add('display');
       refs.bookList.classList.remove('display');
      allBooksInfo(arr);
    }
    return;
  }