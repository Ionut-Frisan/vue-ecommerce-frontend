import {defineStore} from 'pinia';
import axios from "axios";

export const useProductStore = defineStore('products', {
  state: () => ({
    data: {},
    limit: 20,
    limitOptions: [20, 30, 50],
    isLoading: false,
    favoritesCount: 0,
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
    getQueryParams: (state) => (page, query) => {
      let pageValue = page?.value || page || 1;
      const asString = `?page=${pageValue}&limit=${state.limit}&keyword=${query}`;
      const asObj = {
        page: 1,
        limit: state.limit,
        query: query
      }
      return {asString, asObj};
    }
  },
  actions: {
    setLimit(value) {
      if (this.limitOptions.indexOf(value) > -1) {
        this.limit = value;
        return true
      }
      return false
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
