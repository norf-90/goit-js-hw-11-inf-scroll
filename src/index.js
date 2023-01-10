import './css/styles.css';

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

const API_KEY = '32728432-4d3846f56f533eef252fc55ae';
const BASE_URL = 'https://pixabay.com/api/';

const formEl = document.querySelector('#search-form');
const picContainerEl = document.querySelector('.gallery');
formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  const valueForSearch = formEl.elements.searchQuery.value.trim();
  console.log(valueForSearch);
  // fetchPictures(valueForSearch);
  createMarkup(fetchPictures, picContainerEl, valueForSearch);
}

async function fetchPictures(valueForSearch) {
  const { data: pictures } = await axios(
    `${BASE_URL}?key=${API_KEY}&q=${valueForSearch}&image_type=photo&orientation=horizontal&safesearch=true`
  );

  return pictures;
}

async function createMarkup(pictures, el, valueForSearch) {
  try {
    el.innerHTML = '';
    const { total, hits } = await fetchPictures(valueForSearch);
    console.log(hits);

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

    el.insertAdjacentHTML('beforeend', markup);
  } catch (err) {
    console.log(err);
  }
}
