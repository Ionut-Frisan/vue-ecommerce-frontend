<template>
  <div class="favorites-wrapper">
    <ul>
      <li v-for="favorite in favorites" :key="favorite._id">
        {{favorite.name}}
      </li>
    </ul>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {getMyFavorites} from "../managers/RequestManagers/favorite.js";

const favorites = [];

onMounted(async () => {
  favorites.value = await getMyFavorites();
  console.warn(favorites.value);
})
</script>

<style scoped>

</style>