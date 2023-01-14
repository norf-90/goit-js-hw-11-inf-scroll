export default class CustomScroll {
  constructor(gallery) {
    this.cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
  }

  onMouseWheel(e) {
    if (e.deltaY > 0) {
      window.scrollBy({
        top: 400,
        behavior: 'smooth',
      });
    }
    if (e.deltaY < 0) {
      window.scrollBy({
        top: -400,
        behavior: 'smooth',
      });
    }
  }
}
