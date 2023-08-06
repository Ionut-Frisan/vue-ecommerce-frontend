<template>
  <div :class="{'product-cards-container': !showBlankPage}">
    <TransitionGroup name="list">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
        :authenticated="authStore.authenticated"
        @toggle-favorite="handleToggleFavorite"
      />
    </TransitionGroup>
    <div v-if="showBlankPage">
      <BlankPage
        status-code="404"
        message="You have no favorites at the moment"
      />
    </div>
  </div>
</template>

<script setup>
// TODO: handle no favorite
import ProductCard from '../components/ProductCard.vue';

import {computed, onMounted, ref} from "vue";
import {useAuthStore} from "../stores/auth";
import {getMyFavorites} from "../managers/RequestManagers/favorite";
import {setPageTitle} from "../utils/helpers";
import BlankPage from "../components/BlankPage.vue";


const authStore = useAuthStore();

const products = ref([]);
const isLoading = ref(true);

onMounted(async () => {
    setPageTitle('Favorites');
    const response = await getMyFavorites();
    products.value = response || [];
    isLoading.value = false;
})

const handleToggleFavorite = ({id, newValue}) => {
    if (newValue) return;
    products.value = products.value.filter((product) => product._id !== id);
}

const showBlankPage = computed(() => !products.value.length && !isLoading.value);


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