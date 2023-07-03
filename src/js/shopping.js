import './support.js';
import './render.js';
import './api-request.js';
import './menu.js';
import './scrollUp.js';
import './pagination.js';
import './loader.js';
import './theme-swich.js';

import { shoppingEmptyMarkup } from './render.js';
import {getBookById} from './api-request.js';

import symbol from '../images/shopping-svg/symbol-defs.svg';
import svg from '../images/shopping-svg/trash.svg';

const refs = {
  emptyList: document.querySelector('.shopping-empty-list'),
  bookList: document.querySelector('.shopping-book-list'),
  shoppingSupport: document.querySelector('.container-support'),
};
document.body.classList.add('is-hidden');
refs.emptyList.classList.add('display');
refs.bookList.classList.add('display');


const booksLocalStorage = JSON.parse(localStorage.getItem('books') || '[]');
let screenWidth = window.innerWidth;

const defaultBookData = {
  bookTitle: 'Book title',
  genres: 'Genres',
  description:
  'This book is suitable for a wide audience of readers. Its content will surely interest the reader. Also, the book provides a lot of new knowledge in various areas of life and gives food for thought. Enjoy reading!',
 author: 'Author',
}

function containerSupport(screen) {
  if (screen < 1440) {
    refs.shoppingSupport.classList.add('display');
  } else {
    refs.shoppingSupport.classList.remove('display');
  }
  return;
}
containerSupport(screenWidth);

function containerSupportDynamic(screen) {
  if (screen < 1421) {    
    refs.shoppingSupport.classList.add('display')
  } else { 
    refs.shoppingSupport.classList.remove('display');
  }
  return;
}


export function markUp(arr, {bookTitle, genres, description, author}) {
  return arr
    .map(el => {
      let elDescription = el.description;
      let elTitle = el.title;

      if (window.innerWidth < 768) {
        description = description.split('').splice(0, 85).join('') + '...';
        elDescription = elDescription.split('').splice(0, 85).join('') + '...';
        if (elTitle.length > 16) {
          elTitle = elTitle.split('').splice(0, 16).join('') + '...';
        }
      } else if (window.innerWidth >= 768 && window.innerWidth < 1440) {
        description =
          'This book is suitable for a wide audience of readers. Its content will surely interest the reader. Also, the book provides a lot of new knowledge in various areas of life and gives food for thought. Enjoy reading!';
        description = description.split('').splice(0, 248).join('') + '...';
        elDescription = el.description;
        elDescription = elDescription.split('').splice(0, 248).join('') + '...';
      } else {
        description = description;
        elDescription = el.description;
      }

      return `<li class="shopping-book-item" data-id="${el._id}">
        <div class="shopping-book-img">
          <img class="shopping-book-poster" src="${
            el.book_image
          }" alt="book-title '${
        el.title ? el.title : bookTitle
      }'" loading="lazy" />
        </div>
        <div class="shopping-book-text">
          <h2 class="shopping-book-title">${el.title ? elTitle : bookTitle}</h2>
          <p class="shopping-book-genres">${el.genres ? el.genres : genres}</p>
          <p class="shopping-book-description">${
            el.description ?  elDescription : description
          }</p>

          <div class="shopping-book-item-footer">
            <p class="shopping-book-author">${
              el.author ? el.author : author
            }</p>
            <ul class="shopping-book-shops">
              <li>
                <a class="shopping-shop-link img-thumb" href="${
                  el.buy_links[0].url
                }" target="_blank" rel="noreferrer noopener">
                  <svg class="shopping-svg-amazon icon-header" width="16" height="16">
                    <use class="svg" href="${symbol}#Amazon_logo"></use>
                  </svg>                
                </a>
              </li>
              <li>
                <a class="shopping-shop-link img-thumb" href="${
                  el.buy_links[1].url
                }" target="_blank" rel="noreferrer noopener">
                  <svg class="shopping-svg-open-book" width="16" height="16">
                    <use class="svg" href="${symbol}#open-book"></use>
                  </svg>
                </a>
              </li>
              <li>
                <a class="shopping-shop-link img-thumb" href="${
                  el.buy_links[4].url
                }" target="_blank" rel="noreferrer noopener">
                  <svg class="shopping-svg-book-shop" width="16" height="16">
                    <use class="svg" href="${symbol}#book-shop"></use>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <button class="shopping-btn-delete">
            <svg class="svg-trash" width="16" height="16">
              <use class="svg" href="${svg}#trash"></use>
            </svg>
          </button>
        </div>
      </li>`;
    })
    .join('');
}

export async function allBooksInfo (arr){   
  const booksArrPromises = arr.map(async id=>{
    const eachBook = await getBookById(id);    
    return eachBook;
  }) 
  const booksArrOfObjects = await Promise.all(booksArrPromises)  
  refs.bookList.innerHTML = markUp(booksArrOfObjects, defaultBookData) 
if(refs.bookList.children.length){
  refs.bookList.firstElementChild.classList.add("tui-first-child")
  refs.bookList.lastElementChild.classList.add("tui-last-child")
}
}

function checkLocalStorage(arr) {
  if (!arr.length) {
    document.getElementById('tui-pagination-container').setAttribute('hidden', 'true');
    refs.emptyList.insertAdjacentHTML('afterbegin', shoppingEmptyMarkup());
    refs.emptyList.classList.remove('display');
    refs.bookList.classList.add('display');
  } else {
    refs.emptyList.classList.add('display');
    refs.bookList.classList.remove('display');    
  }
  return;
}

function checkLocalStorageDynamic(arr) {
  if (!arr.length) {
    document.getElementById('tui-pagination-container').setAttribute('hidden', 'true');
    refs.emptyList.insertAdjacentHTML('afterbegin', shoppingEmptyMarkup());    
    refs.emptyList.classList.remove('display');
    refs.bookList.classList.add('display');
  } else {
    allBooksInfo(arr);
    refs.emptyList.classList.add('display');
    refs.bookList.classList.remove('display');    
  }
  return;
}

checkLocalStorage(booksLocalStorage);

window.addEventListener('resize',(e) => {
  const width= document.body.clientWidth;   
  containerSupportDynamic(width);
  //checkLocalStorageDynamic(booksLocalStorage);
  return width;   
});


