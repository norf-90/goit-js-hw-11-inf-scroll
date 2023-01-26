import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '32728432-4d3846f56f533eef252fc55ae';
const BASE_URL = 'https://pixabay.com/api/';
let page;
const perPage = 50;
let searchName = '';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.guard'),
};
document.addEventListener('wheel', throttle(onMouseWheel, 100));
refs.form.addEventListener('submit', onFormSubmit);

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const lightbox = new SimpleLightbox('.gallery a');

// Add infinite scroll
const observer = new IntersectionObserver(onIntersect, options);

async function onIntersect(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      if (!searchName) {
        return;
      }

      page += 1;
      const { totalHits, hits } = await fetchPictures(page);
      createMarkup({ totalHits, hits });
      lightbox.refresh();

      if (totalHits <= page * perPage && totalHits > 0) {
        observer.unobserve(refs.guard);
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}

async function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  searchName = refs.form.elements.searchQuery.value.trim().split(' ').join('+');

  if (!searchName) {
    return;
  }

  clearMarkup();
  await fetchPictures().then(data => {
    showTotal(data);
    createMarkup(data);
    lightbox.refresh();

    observer.observe(refs.guard);
  });
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

async function fetchPictures() {
  const {
    data: { totalHits, hits },
  } = await axios(
    `${BASE_URL}?key=${API_KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );

  return { totalHits, hits };
}

function showTotal({ totalHits }) {
  if (totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    return;
  }
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function createMarkup({ hits }) {
  const markup = hits
    .map(picture => {
      return `<a href="${picture.largeImageURL}"><div class="photo-card">
      <img class="photo-img" src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" />
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

function onMouseWheel(evt) {
  if (evt.deltaY > 0) {
    window.scrollBy({
      top: 600,
      behavior: 'smooth',
    });
  }
  if (evt.deltaY < 0) {
    window.scrollBy({
      top: -600,
      behavior: 'smooth',
    });
  }
}
