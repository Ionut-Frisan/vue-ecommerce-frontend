<script setup>
import Navbar from "./components/Navbar.vue";
import Toast from "primevue/toast";
import Loader from '../src/components/Loader.vue';

import {useAuthStore} from "./stores/auth.js";
import {useCartStore} from "./stores/cart.js";
import {onBeforeMount} from "vue";

const auth = useAuthStore();
const cart = useCartStore();

onBeforeMount(() => {
  auth.initFromLocal();
  cart.initializeStore();
})
</script>

<template>
  <Navbar />
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
}
</style>
