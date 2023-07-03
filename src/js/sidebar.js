import Notiflix from 'notiflix';
import { createCategoriesMarkup } from './render';
import { renderBooks } from './render';
import { getBooksByCategory } from './api-request';
import { getCategories } from './api-request';
import { renderTopBooks } from './render';
import { loadTopBooks } from './api-request';
import { makeTitleAccent } from './container';

Notiflix.Notify.init({
  width: '500px',
  position: 'center-center',
  fontSize: '20px',
  timeout: 1000,
  clickToClose: true,
  backOverlay: true,
  backOverlayColor: 'rgba(255,255,255,0.5)',
  failure: {
    background:
      'radial-gradient(189.32% 190.93% at 59.76% -23.42%, #4F2EE8 18.03%, #FFF 100%)',
    notiflixIconColor: '#fff',
  },
});

const refs = {
  categoryList: document.querySelector('.js-category-list'),
  homeContainer: document.querySelector('.all-books-area'),
  homeTitle: document.querySelector('.home-title'),
};

refs.categoryList.addEventListener('click', categoryPicker);

getCategories().then(({ data }) => {
  refs.categoryList.insertAdjacentHTML(
    'beforeend',
    createCategoriesMarkup(data)
  );
});

async function categoryPicker(evt) {
  if (evt.target === evt.currentTarget) {
    return;
  }
  if (evt.target.dataset.id !== refs.homeTitle.textContent) {
    try {
      if (evt.target.dataset.id === 'Best Sellers Books') {
        const data = await loadTopBooks();
        refs.homeContainer.innerHTML = renderTopBooks(data.data);
        makeTitleAccent('Best Sellers Books');
      } else {
        const booksByCategory = await getBooksByCategory(evt.target.dataset.id);
        if (!booksByCategory.data) {
          throw new Error('Sorry, no books match this category');
        }
        refs.homeContainer.innerHTML = renderBooks(booksByCategory.data);
        makeTitleAccent(evt.target.dataset.id);
        if (window.screen.width < 768) {
          window.scrollTo({
            top: 760,
            left: 0,
            behavior: 'smooth',
          });
        }
        else if (window.screen.width >= 768 && window.screen.width < 1440) {
          window.scrollTo({
            top: 670,
            left: 0,
            behavior: 'smooth',
          });
        }
      }
      const currentActiveCategory = document.querySelector('.active-category');
      currentActiveCategory.classList.remove('active-category');
      evt.target.classList.add('active-category');
    } catch (error) {
      Notiflix.Notify.failure(
        error.message || 'Sorry, no books match this category'
      );
    }
  }
}
