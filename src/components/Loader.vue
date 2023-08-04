<template>
  <div
    v-if="productStore.getLoadStatus"
    id="loader-wrapper"
  >
    <ProgressSpinner
      id="spinner"
      style="height: 100px; width: 100px"
      stroke-width="8"
    />
  </div>
</template>

<script setup>
import ProgressSpinner from 'primevue/progressspinner';
// eslint-disable-next-line import/namespace
import {useProductStore} from '../stores/product';

const productStore = useProductStore();

</script>

<style>
#loader-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

#spinner {
  position: fixed;
  left: calc(50% - 25px);
  top: calc(50% - 35px);
}

@keyframes p-progress-spinner-color {
  100%,
  0% {
    stroke: #ffffff;
  }
  50% {
    stroke: #ffffff;
  }
}
</style>