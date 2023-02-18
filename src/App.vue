<script setup>
import Navbar from "./components/Navbar.vue";
import Toast from "primevue/toast";
import Loader from '../src/components/Loader.vue';

import {useAuthStore} from "./stores/auth.js";
import {useCartStore} from "./stores/cart.js";
import {useProductStore} from "./stores/product.js";
import {onBeforeMount, onMounted} from "vue";
import axios from "axios";
import {getMyFavorites} from "./managers/RequestManagers/favorite.js";
import {checkToken} from "./managers/RequestManagers/auth.js";

const auth = useAuthStore();
const cart = useCartStore();
const product = useProductStore();

const checkAuthentication = async () => {
  const authenticated = await checkToken();
  if (!authenticated) await auth.logOut();
}

onBeforeMount(() => {
  auth.initFromLocal();
  cart.initializeStore();
})

onMounted(async () => {
  await checkAuthentication();
  if(auth.isAuthenticated){
    const favorites = await getMyFavorites();
    product.favoritesCount = favorites.length;
  }
})

axios.interceptors.request.use((config) => {
  product.isLoading = true;
  return config;
})
axios.interceptors.response.use((response) => {
  product.isLoading = false;
  return response;
}, (error) => {
  product.isLoading = false;
  if (error.response && error.response.data) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
})
</script>

<template>
  <Navbar/>
  <Loader />
  <RouterView />
  <Toast />
</template>

<style>

body {
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  background-color: #f2f2f7;
  overflow-x: hidden;
  min-width: 300px;
}
</style>
