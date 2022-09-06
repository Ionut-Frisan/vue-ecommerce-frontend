<template>
  <div class="product-wrapper">
    <div class="product-hero">
      <Galleria
        :value="imagesUrls"
        :num-visible="5"
        :responsive-options="responsiveOptions"
        :show-indicators="true"
        :show-thumbnails="false"
        :show-indicators-on-item="true"
        container-style="width: 50%"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.src"
            :alt="product.title"
            crossorigin="anonymous"
            style="width: 100%"
          >
        </template>
      </Galleria>
      <div class="title-and-stuff">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useProductStore} from "../stores/product.js";
import {useProduct} from "../composables/product.js";
import Galleria from 'primevue/galleria';

const route = useRoute();
const productStore = useProductStore();

const product = ref({});

const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 5
  },
  {
    breakpoint: '768px',
    numVisible: 3
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
]

onMounted(async () => {
  const slug = route.params.slug;
  product.value = await productStore.fetchSingleProduct(slug);
})

const imagesUrls = computed(() => {
  if (Array.isArray(product.value.images)) {
    if (product.value.images.length) {
      return product.value.images.map((img) => {
        return {src: `http://localhost:5000/uploads/${img}`}
      })
    }
    return [{src: `http://localhost:5000/uploads/no-photo.jpeg`}]
  }
  return [{src: `http://localhost:5000/uploads/${product.value.images}`}]
})

</script>
<style>
.product-wrapper {
  width: 70%;
  margin: 10% auto 0 auto;
}

.product-hero{
  display: flex;
  flex-direction: row;
}

</style>