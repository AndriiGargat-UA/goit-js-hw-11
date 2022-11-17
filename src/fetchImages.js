import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31295719-80ad41cd84927168cdbfaac9e';
const param = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImages() {
        console.log(this)
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${param}&page=${this.page}`);
        this.incrementPage();
        return response.data;
    }

    incrementPage() {
        this.page += 1;
    }
    
    get currentPage() {        
        return this.page - 1;
    }

    resetPage() {
        this.page = 1;
    } 

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}