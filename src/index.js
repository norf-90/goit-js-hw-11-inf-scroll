import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import Query from './js/query';
// import CustomScroll from './js/custom-scroll';

// Variables
const API_KEY = '32728432-4d3846f56f533eef252fc55ae';
const BASE_URL = 'https://pixabay.com/api/';
let page;
const perPage = 50;

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.guard'),
};

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();
  page = 1;

  clearMarkup();
  await fetchPictures().then(data => {
    showTotal(data);
    createMarkup(data);
    checkAvailablePics(data);
  });

  const lightbox = new SimpleLightbox('.gallery a');
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

async function fetchPictures() {
  const value = refs.form.elements.searchQuery.value
    .trim()
    .split(' ')
    .join('+');

  const {
    data: { totalHits, hits },
  } = await axios(
    `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );

  page += 1;
  return { totalHits, hits };
}

function showTotal(data) {
  if (!data.totalHits) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function createMarkup(data) {
  const markup = data.hits
    .map(picture => {
      return `<a href="${picture.largeImageURL}"><div class="photo-card">
      <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" width="400"/>
      <div class="info">
        <p class="info-item">
          <b>Likes</b> <span>${picture.likes}</span>
        </p>
        <p class="info-item">
          
        <b>Views</b> <span>${picture.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b> <span>${picture.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b> <span>${picture.downloads}</span>
        </p>
      </div>
    </div></a>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function checkAvailablePics(data) {
  if (
    page * perPage < data.totalHits ||
    !data.totalHits ||
    data.totalHits > perPage
  ) {
    return;
  }
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function onMouseWheel(e) {
  if (e.deltaY > 0) {
    window.scrollBy({
      top: 600,
      behavior: 'smooth',
    });
  }
  if (e.deltaY < 0) {
    window.scrollBy({
      top: -600,
      behavior: 'smooth',
    });
  }
}
