import './css/styles.css';

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let query = {};

refs.form.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(e) {
  e.preventDefault();

  query = new Query(refs);

  query.hideLoadMoreBtn();
  query.clearMarkup();
  await query.fetchPictures();
  query.createMarkup();
  query.addMarkupToGallery();

  query.checkAvailablePics();
  query.increasePageByOne();
  query.showLoadMoreBtn();

  query.loadMoreBtn.addEventListener('click', query.onLoadMoreClick);
}

// async function onLoadMoreClick() {
//   await query.fetchPictures();
//   query.createMarkup();
//   query.addMarkupToGallery();
//   query.increasePageByOne();
//   query.decreaseAvailablePics();

//   console.log(query);
// }

class Query {
  constructor({ form, gallery, loadMoreBtn }) {
    this.API_KEY = '32728432-4d3846f56f533eef252fc55ae';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.page = 1;
    this.perPage = 40;

    this.form = form;
    this.gallery = gallery;
    this.loadMoreBtn = loadMoreBtn;

    this.value = this.form.elements.searchQuery.value
      .trim()
      .split(' ')
      .join('+');
    this.availabePics = null;
    this.hits = null;
    this.markup = null;
  }

  async fetchPictures() {
    try {
      const {
        data: { totalHits, hits },
      } = await axios(
        `${this.BASE_URL}?key=${this.API_KEY}&q=${this.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      );
      this.availabePics = totalHits;
      this.hits = hits;
    } catch (err) {
      console.error(err);
    }
  }

  createMarkup() {
    this.markup = this.hits
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
  }

  clearMarkup() {
    this.gallery.innerHTML = '';
  }

  addMarkupToGallery() {
    this.gallery.insertAdjacentHTML('beforeend', this.markup);
  }

  increasePageByOne() {
    this.page += 1;
    console.log(`page: ${this.page}`);
  }

  showLoadMoreBtn() {
    this.loadMoreBtn.classList.remove('is-hidden');
  }

  hideLoadMoreBtn() {
    this.loadMoreBtn.classList.add('is-hidden');
    console.log('hide loadmore btn');
  }

  async onLoadMoreClick() {
    await query.fetchPictures();
    query.createMarkup();
    query.addMarkupToGallery();
    query.increasePageByOne();
  }

  checkAvailablePics() {
    if (this.page * this.perPage >= this.availabePics) {
      this.hideLoadMoreBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  }
}
