import emptyBooks from '../images/shopping-svg/empty-books.webp';

function clipBookTitle(title) {
  let clippedTitle = '';
  if (window.screen.width < 768) {
    let maxLength = 33;
    title.length > maxLength
      ? (clippedTitle = title.slice(0, maxLength - 1) + '...')
      : (clippedTitle = title);
  } else if (window.screen.width >= 768 && window.screen.width < 1440) {
    let maxLength = 21;
    title.length > maxLength
      ? (clippedTitle = title.slice(0, maxLength - 1) + '...')
      : (clippedTitle = title);
  } else {
    let maxLength = 18;
    title.length > maxLength
      ? (clippedTitle = title.slice(0, maxLength - 1) + '...')
      : (clippedTitle = title);
  }
  return clippedTitle;
}

export function createCategoriesMarkup(arr) {
  const markup = arr
    .map(({ list_name }) => {
      const markup = `<li class="category-list-item" data-id="${list_name}">${list_name}</li>`
      return markup;
    })
    .join('');
    return markup
}

export function renderBooks(arr) {
  let markLoadItems = '';
  let titleBook = '';

  markLoadItems += arr
    .map(({ _id, title, author, book_image }) => {
      titleBook = clipBookTitle(title);
      return `<li class="home-book-item" data-id="${_id}">
            <div class="home-thumb-photo">
              <img data-src="${book_image}"
                alt="${title}"
                class="lazyload home-book-photo blur-up"
                >
                <p class="overlay-text">quick view</p>
            </div>
              <h3 class="home-book-name">${titleBook}</h3>
              <p class="home-book-author">${author}</p>
            </li>`;
    })
    .join('');
  let markupLoadCategory = `<ul class="home-book-list">${markLoadItems}</ul>`;
  return markupLoadCategory;
}

export function renderTopBooks(arr) {
  let valueIteration = 0;
  let titleBook = '';

  if (window.screen.width < 768) {
    return arr
      .map(({ books: [{ _id, title, author, book_image }], list_name }) => {
        titleBook = clipBookTitle(title);
        return `<div class="home-books-field">
          <h2 class="home-category-title">${list_name}</h2>

          <ul class="home-book-list">
          <li class="home-book-item" data-id="${_id}">
          <div class="home-thumb-photo">
              <img data-src="${book_image}"
                alt="${title}"
                class="lazyload home-book-photo blur-up"
                >
            </div>
              <h3 class="home-book-name">${titleBook}</h3>
              <p class="home-book-author">${author}</p>
            </li>
          </ul>
          
          <button class="btn load-more">see more</button>
        </div>`;
      })
      .join('');
  } else if (window.screen.width >= 768 && window.screen.width < 1440) {
    return arr
      .map(({ books, list_name }) => {
        valueIteration = 3;
        let markItem = renderMarkupBook(books, valueIteration);
        return `<div class="home-books-field">
     <h2 class="home-category-title">${list_name}</h2>
     <ul class="home-book-list">${markItem}</ul><button class="btn load-more">see more</button>
     </div>`;
      })
      .join('');
  } else {
    return arr
      .map(({ books, list_name }) => {
        valueIteration = 5;
        let markItems = renderMarkupBook(books, valueIteration);
        return `<div class="home-books-field">
     <h2 class="home-category-title">${list_name}</h2>
     <ul class="home-book-list">${markItems}</ul><button class="btn load-more">see more</button>
     </div>`;
      })
      .join('');
  }
}

export function renderMarkupBook(books, valueIteration) {
  let markItem = '';
  let titleBook = '';

  for (let i = 0; i < valueIteration; i += 1) {
    titleBook = clipBookTitle(books[i].title);
    markItem += `<li class="home-book-item" data-id="${books[i]._id}">
              <div class="home-thumb-photo">
              <img data-src="${books[i].book_image}"
                alt="${books[i].title}"
                class="lazyload home-book-photo blur-up"
                >
                <p class="overlay-text">quick view</p>
                </div>
              <h3 class="home-book-name">${titleBook}</h3>
              <p class="home-book-author">${books[i].author}</p>
            </li>`;
  }
  return markItem;
}

export function createMarkupSupport(arr) {
  const markup = arr
    .map(({ title, url, img, img2 }, idx) => {
      return `<li class="list-item swiper-slide">
  <span class="number">0${idx + 1}</span>
  <a href="${url}" target="_blank" rel="noopener noreferrer nofollow">
    <img class="normalize-img" src="${img}" srcset="${img} 1x, ${img2} 2x" alt="${title}" loading="lazy">
  </a>
</li>`;
    })
    .join('');
  return markup;
}

export function shoppingEmptyMarkup() {
  return `<p class="shopping-empty-text">
  This page is empty, add some books and proceed to order.
</p>
<img
  class="shopping-empty-img"
  src="${emptyBooks}"
  alt="books"
/>`;
}
