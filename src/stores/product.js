import {defineStore} from 'pinia';
import axios from "axios";

export const useProductStore = defineStore('products', {
  state: () => ({
    data: {},
    limit: 20,
    limitOptions: [20, 30, 50],
    isLoading: false,
    favoritesCount: 0,
    loaders: [],
    categories: [],
    filters: {},
  }),
  getters: {
    getLimit() {
      return this.limit
    },
    getProducts(){
      return this.data.data
    },
    getTotalCount(){
      return this.data.pagination?.count || 0
    },
    getLimitOptions(){
      return this.limitOptions
    },
    isEmpty(){
      return this.data?.data.length === 0
    },
    getLoadStatus() {
      return this.loaders.length > 0;
    },
    getQueryParams: (state) => (page, query, filtersId= 'products' ) => {
      let pageValue = page?.value || page || 1;
      const category = state.filters[filtersId]?.category || '';
      const sort = state.filters[filtersId]?.sortBy || '';
      console.log(state);
      let asString = `?page=${pageValue}&limit=${state.limit}&keyword=${query}&sort=${sort}`;
      if(category){
        asString += `&category=${category}`;
      }
      console.warn({category, sort});
      const asObj = {
        page: 1,
        limit: state.limit,
        query: query,
        category,
        sort,
      }
      return {asString, asObj};
    },
    getFiltersValue: (state) => (key, filtersId= 'products', defaultValue = '') => state.filters[filtersId]?.[key],
    getFilters: (state) => (filtersId) => (state.filters[filtersId] || {}),
  },
  actions: {
    addLoader(url) {
      this.loaders.push(url);
    },
    clearLoader(url) {
      setTimeout(() => {
        const index = this.loaders.indexOf(url);
        if(index !== -1) this.loaders.splice(index, 1);
      }, 50);
    },
    setLimit(value) {
      if (this.limitOptions.indexOf(value) > -1) {
        this.limit = value;
        return true
      }
      return false
    },
    setFilters(value, filtersId = 'products') {
      if(typeof value !== 'object') return;
      this.filters[filtersId] = value;
    },
    setFilterKeyValue(value, key, filtersId = 'products') {
      if (!this.filters[filtersId]) {
        this.filters[filtersId] = {};
      }
      this.filters[filtersId][key] = value;
    },
    async fetchProducts(page = 1, query='') {
      const queryParams = this.getQueryParams(page, query).asString;
      await axios
        .get(`/products${queryParams}`)
        .then((res) => {
          this.data = res.data
        })
        .catch((err) => {});
    },
    async fetchSingleProduct(slug){
      let product = {}
      await axios
        .get(`/products/${slug}`)
        .then((res) => {
          product = res.data.data[0];
        })
        .catch((err) => {})
      return product
    },
    async fetchCategories(){
      if (this.categories.length) return;
      await axios
          .get('/categories')
          .then((res) => {
            this.categories = res.data.data || []
          })
          .catch((err) => {})
    },
    // TODO: get favorites count from backend on mounted
    setFavoriteValue(id, newValue){
      this.data.data = this.data.data
        .map((product) => {
          const prodId = product._id || product.id;
          return prodId === id ?
            {
              ...product,
              favorite: newValue
            } :
            product
        })
    }
  }
})
