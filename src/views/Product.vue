<template>
  <div class="product-wrapper">
    <div class="product-hero">
      <Galleria
        :value="imagesUrls"
        :num-visible="5"
        :show-indicators="true"
        :show-thumbnails="false"
        :show-indicators-on-item="true"
        container-style="width: 50%;"
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
        <h3>{{ computedTitle }}</h3>
        <span>{{priceWholePart}}<sup>{{priceFloatPart}}</sup> GBP</span>
        <rating model-value="rating" :readonly="true"></rating>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useProductStore} from "../stores/product.js";
import Galleria from 'primevue/galleria';
import Rating from 'primevue/rating';

const route = useRoute();
const productStore = useProductStore();

const product = ref({});


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

const computedTitle = computed(() => product.value?.name?.toUpperCase() || '')

const computedPrice = computed(() => {
  return product.value.price * (1 - product.value.discount / 100);
})

const priceWholePart = computed(() => {
  return Math.floor(computedPrice.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
})

const priceFloatPart = computed(() => {
  let value = computedPrice.value - parseInt((priceWholePart.value).replaceAll('.', ''));
  value = Math.round(value * 100).toString();
  return value.length === 2 ? value : value + '0'
})

const rating = computed(() => {
  return Math.round(product?.averageRating || 0)
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