import './css/styles.css';
import Notiflix from 'notiflix';
import photoCardTmp from './templates/card.hbs';
import ImagesApiService from './fetchImages';

const getEl = selector => document.querySelector(selector);
const inputRef = getEl('.searc-form__input');
const searchFormRef = getEl('.search-form');
const galleryContainerRef = getEl('.gallery');
const loadMoreBtn = getEl('.load-more');
const imagesApiService = new ImagesApiService();

searchFormRef.addEventListener('submit', (event) => {
    event.preventDefault();
    onSearch();
});
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch() {
    if (inputRef.value === '') {
        return Notiflix.Notify.failure('Please enter a search term !')
    };
    imagesApiService.query = inputRef.value;
    imagesApiService.resetPage();
    try {
        const images = await imagesApiService.fetchImages();
        if (images.hits.length === 0) {
            throw new Error;
        };
        clearGalleryContainer();
        totalInfo(images);
        interfaceRender(images);
        
        if (images.totalHits > 40) {
            showLoadMoreBtn()
        };
    } catch (error) {
        onFetchError();
    };
};

async function onLoadMore() {
    try {
        const images = await imagesApiService.fetchImages();
        const currentPage = imagesApiService.currentPage;
        interfaceRender(images);
        if (images.totalHits < currentPage * 40) {
            throw new Error;
        };
    } catch {
        onLoadMoreError();
    };
};

function interfaceRender(images) {
    galleryContainerRef.insertAdjacentHTML('beforeend', photoCardTmp(images));
};

function totalInfo(images) {
    const total = images.totalHits;
    Notiflix.Notify.info(`Hooray! We found ${total} images.`); 
}

function onFetchError() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    clearGalleryContainer();
    hideLoadMoreBtn();
};

function onLoadMoreError() {
    hideLoadMoreBtn();
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
};

function clearGalleryContainer() {
    galleryContainerRef.innerHTML = '';
};

function showLoadMoreBtn() {
    loadMoreBtn.classList.remove('is-hidden');
};

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('is-hidden');
};