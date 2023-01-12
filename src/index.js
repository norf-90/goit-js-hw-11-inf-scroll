import './css/styles.css';

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

// let query = {};

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();

  const query = new Query(refs);
  query.lightbox = new SimpleLightbox('.gallery a');

  query.hideLoadMoreBtn();
  query.clearMarkup();
  await query.fetchPictures();
  query.showTotal();
  query.createMarkup();
  query.addMarkupToGallery();
  query.lightbox.refresh();
  refs.gallery.onscroll = addSmoozeScroll;
  query.checkAvailablePics();
  query.increasePageByOne();

  document.addEventListener('scroll', addSmoozeScroll);

  // query.scrollToEnd();
}

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
      if (this.hits.length) this.showLoadMoreBtn();
    } catch (err) {
      console.error(err);
    }
  }

  createMarkup() {
    this.markup = this.hits
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
  }

  clearMarkup() {
    this.gallery.innerHTML = '';
  }

  addMarkupToGallery() {
    this.gallery.insertAdjacentHTML('beforeend', this.markup);
  }

  increasePageByOne() {
    console.log('increasing by one ...');
    this.page += 1;
    console.log(`page: ${this.page}`);
  }

  showLoadMoreBtn() {
    this.loadMoreBtn.classList.remove('is-hidden');
  }

  hideLoadMoreBtn() {
    this.loadMoreBtn.classList.add('is-hidden');
  }

  async onLoadMoreClick() {
    await this.fetchPictures();
    this.createMarkup();
    this.addMarkupToGallery();
    this.lightbox.refresh();
    this.checkAvailablePics();
    this.increasePageByOne();

    // this.scrollToEnd();
  }

  checkAvailablePics() {
    console.log('cheking');
    // if (this.availabePics)
    if (this.page * this.perPage < this.availabePics || !this.availabePics) {
      return;
    }
    this.hideLoadMoreBtn();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  showTotal() {
    if (!this.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${this.availabePics} images.`);
  }

  scrollToEnd() {
    const { top: yCoord } = document
      .querySelector('.gallery')
      .lastElementChild.getBoundingClientRect();
    window.scrollBy({
      top: yCoord * 2,
      behavior: 'smooth',
    });
  }
}

function addSmoozeScroll() {
  const { top: yCoord } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: -yCoord * 2,
    behavior: 'smooth',
  });
}
