import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Query from './js/query';
import CustomScroll from './js/custom-scroll';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();

  const query = new Query(refs);

  query.clearMarkup();
  await query.fetchPictures();
  query.showTotal();
  query.createMarkup();
  query.checkAvailablePics();
  query.lightbox = new SimpleLightbox('.gallery a');

  if (query.availabePics > query.perPage) {
    query.loadMoreBtn.addEventListener(
      'click',
      query.onLoadMoreClick.bind(query)
    );
  }

  const customScroll = new CustomScroll(refs.gallery);

  // --- Add smooth scroll ---
  document.addEventListener(
    'wheel',
    throttle(customScroll.onMouseWheel.bind(customScroll), 100)
  );
}
