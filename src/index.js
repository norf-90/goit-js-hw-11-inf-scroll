import './css/styles.css';

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const API_KEY = '32728432-4d3846f56f533eef252fc55ae';
const BASE_URL = 'https://pixabay.com/api/';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
formEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

let currentPage = 1;
let currentSearchValue = '';
let picturesNumber = 0;

function onFormSubmit(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  galleryEl.innerHTML = '';
  currentPage = 1;
  currentSearchValue = formEl.elements.searchQuery.value
    .trim()
    .split(' ')
    .join('+');

  addMarkup();
  loadMoreBtn.classList.remove('is-hidden');
}

function onLoadMoreClick() {
  currentPage += 1;
  addMarkup();
}

async function fetchPictures(valueForSearch) {
  const {
    data: { total, hits },
  } = await axios(
    `${BASE_URL}?key=${API_KEY}&q=${valueForSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`
  );
}

async function addMarkup() {
  try {
    const { total, hits } = await fetchPictures(currentSearchValue);
    console.log(hits);

    picturesNumber += hits.length;
    const markup = hits
      .map(picture => {
        return `<div class="photo-card">
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
    </div>`;
      })
      .join('');

    galleryEl.insertAdjacentHTML('beforeend', markup);
  } catch (err) {
    console.log(err);
  }
}
