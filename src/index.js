import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fatchImages, per_page } from './api';
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('.load-more'),
  massege: document.querySelector('.text'),
};
refs.btn.addEventListener('click', onClick);
refs.form.addEventListener('submit', onSubmit);

let query;

let page = 1;

async function onClick() {
  page++;
  refs.btn.classList.add('hidden');
  try {
    const { data } = await fatchImages(query, page);
    const markup = createMarkup(data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    onBtnVisibole(data.totalHits);
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

async function onSubmit(e) {
  e.preventDefault();
  refs.massege.classList.add('hidden');
  refs.btn.classList.add('hidden');
  page = 1;
  const form = e.target;
  query = form.elements.searchQuery.value.trim();
  refs.gallery.innerHTML = '';

  if (query === '') {
    return;
  }
  try {
    const { data } = await fatchImages(query, page);
    if (data.hits.length === 0) {
      refs.btn.classList.add('hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      form.reset();
      return;
    }

    const markup = createMarkup(data.hits);
    refs.gallery.insertAdjacentHTML('afterbegin', markup);
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    onBtnVisibole(data.totalHits);
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}
function createMarkup(arr) {
  return arr
    .map(
      image => `<div class="photo-card">
      <img class="gallery_img" src=${image.webformatURL} alt=${image.tags} loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:${image.likes}</b>
        </p>
        <p class="info-item">
          <b>Views:${image.views}</b>
        </p>
        <p class="info-item">
          <b>Comments:${image.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads:${image.downloads}</b>
        </p>
      </div>
    </div>`
    )
    .join('');
}

function onBtnVisibole(totalHits) {
  if (Math.ceil(totalHits / per_page) <= page) {
    refs.massege.classList.remove('hidden');
  } else {
    refs.btn.classList.remove('hidden');
  }
}
