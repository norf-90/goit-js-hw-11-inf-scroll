import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class Query {
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

      this.page += 1;
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

    this.gallery.insertAdjacentHTML('beforeend', this.markup);
  }

  clearMarkup() {
    this.gallery.innerHTML = '';
  }

  // async onLoadMoreClick() {
  //   await this.fetchPictures();
  //   this.createMarkup();
  //   this.lightbox.refresh();
  //   this.checkAvailablePics();
  // }

  checkAvailablePics() {
    if (
      this.page * this.perPage < this.availabePics ||
      !this.availabePics ||
      this.availabePics > this.perPage
    ) {
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
}
