<template>
  <span id="search-query" v-if="hasSearch">
    Showing results for: <strong>{{ searchQuery }}</strong>
  </span>
  <div class="product-cards-container">
    <advanced-filters
        :sortable-columns="sortableColumns"
        filtersId="products"
        @changed="getProductsWithQuery"
    />
    <TransitionGroup name="list">
      <ProductCard
          v-for="product in productsStore.getProducts"
          :key="product._id"
          :product="product"
          :authenticated="authStore.authenticated"
      />
    </TransitionGroup>
  </div>
  <Paginator
      :total-records="productsStore.getTotalCount"
      :rows="productsStore.getLimit"
      :rows-per-page-options="productsStore.getLimitOptions"
      @page="onPaginationChange"
  />
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue';

import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from 'vue-router';

import Paginator from 'primevue/paginator';
import {useToast} from "primevue/usetoast";
import {useProductStore} from "../stores/product.js";
import {useAuthStore} from "../stores/auth.js";
import {setPageTitle} from "../utils/helpers.js";
import AdvancedFilters from "../components/AdvancedFilters.vue";


const route = useRoute();
const router = useRouter();
const toast = useToast();
const productsStore = useProductStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const products = productsStore.getProducts;

const hasSearch = computed(() => {
  if (route.path.includes('/search') && searchQuery.value !== '') {
    return true
  }
  return false
})

const page = ref(1);

onMounted(() => {
  getProductsWithQuery();
  setPageTitle('Home');
})

const sortableColumns = [
  {
    value: 'name',
    label: 'A-Z',
    showDirection: false,
  },
  {
    value: '-name',
    label: 'Z-A',
    showDirection: false,
  },
  {
    value: '-discount',
    label: 'Discount'
  },
  {
    value: 'date_added',
    label: 'Newest',
    showDirection: false,
  },
  {
    value: '-date_added',
    label: 'Oldest',
    showDirection: false,
  },
  {
    value: 'price',
    label: 'Price'
  },
  {
    value: '-price',
    label: 'Price'
  },
]

watch(() => route.fullPath, (newValue, oldValue) => {
  if (!['Search', 'Home'].includes(route.name)) return;
  getProductsWithQuery();
})

const onPaginationChange = (event) => {
  productsStore.setLimit(event.rows)
  page.value = event.page + 1;
  if (searchQuery.value)
    router.push({path: '/', query: {page: page.value, limit: productsStore.getLimit, query: searchQuery.value}})
  else {
    router.push({path: '/', query: {page: page.value, limit: productsStore.getLimit}})
  }
}

const getProductsWithQuery = async () => {
  page.value = route.query?.page ? parseInt(route.query?.page) : 1;
  searchQuery.value = route.query?.query || '';

  productsStore.setLimit(parseInt(route.query?.limit) || 20)

  await productsStore.fetchProducts(page.value, searchQuery.value);
}

</script>

<style>
.product-cards-container {
  padding-top: 100px;
  display: grid;
  min-width: 50vw;
  max-width: 80vw;
  margin: auto;
  grid-template-columns: repeat(5, minmax(200px, auto));
  grid-gap: clamp(10px, 3vw, 20px);
  justify-content: center;
}

/* TODO: better way to do this */
.advanced-filters + .card{
  grid-column: 1;
}

@media (max-width: 600px) {
  .product-cards-container {
    grid-template-columns: repeat(1, minmax(200px, auto));
  }
}

@media (min-width: 600px) {
  .product-cards-container {
    grid-template-columns: repeat(2, minmax(200px, auto));
  }
}

@media (min-width: 768px ) {
  .product-cards-container {
    grid-template-columns: repeat(3, minmax(200px, auto));
  }
}

@media (min-width: 992px) {
  .product-cards-container {
    grid-template-columns: repeat(4, minmax(200px, auto));
  }
}

@media (min-width: 1200px) {
  .product-cards-container {
    grid-template-columns: repeat(5, minmax(200px, 250px));
  }
}

.p-paginator {
  background-color: #f2f2f7;
}

#search-query {
  display: block;
  width: 100%;
  text-align: center;
  padding-top: 20px;
  font-size: 20px;
}

</style>