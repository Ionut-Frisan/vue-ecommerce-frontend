<template>
  <div class="card">
    <Button icon="pi pi-heart"
            @mouseenter="isFavoritesButtonHovered = true"
            @mouseleave="isFavoritesButtonHovered = false"
            :class="favoritesButtonClasses"/>
    <img
        crossorigin="anonymous"
        class="card-image"
        :src="imageUrl"
    >
    <span class="discount" v-if="hasDiscount"> -{{ product.discount }}%</span>
    <div class="card-body">
      <span class="product-title" v-tooltip.bottom="product.name">{{ computedTitle }}</span>
      <div class="product-card-footer">
        <span class="product-rating">
          <Rating :modelValue="start" :readonly="true" :cancel="false" class="rating"/>
          <p class="rating-value">({{ rating }})</p>
        </span>
        <div class="product-actions">
          <span class="price">
            {{ priceWholePart }}<sup class="price-float-price">{{ priceFloatPart }}</sup> GBP
          </span>
          <Button icon="pi pi-shopping-cart" class="p-button-outlined" @click="addToCart"/>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, computed} from "vue";

import Rating from "primevue/rating";
import Button from "primevue/button";

import {useToast} from "primevue/usetoast";

import {useCartStore} from "../stores/cart.js";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const imageUrl = computed(() => {
  if (Array.isArray(props.product.images)) {
    if (props.product.images.length)
      return `http://localhost:5000/uploads/${props.product.images[0]}`
    return `http://localhost:5000/uploads/no-photo.jpeg`
  }
  return `http://localhost:5000/uploads/${props.product.images}`
})

const rating = computed(() => {
  // TODO: make this the no. of ratings instead of average? and average on hover?
  return props.product?.averageRating || 0;
})

const start = computed(() => {
  return Math.round(props.product?.averageRating || 0)
})

const computedTitle = computed(() => {
  // Clips the title if it's above certain length
  if (props.product.name.length > 35) {
    return props.product.name.slice(0, 35) + '...'
  }
  return props.product.name
})

const computedPrice = computed(() => {
  return props.product.price * (1 - props.product.discount / 100);
})

const priceWholePart = computed(() => {
  return Math.floor(computedPrice.value)
})

const priceFloatPart = computed(() => {
  let value = computedPrice.value - priceWholePart.value;
  value = Math.round(value * 100).toString();
  return value.length === 2 ? value : value + '0'
})

const hasDiscount = computed(() => {
  return props.product.discount !== 0
})

const isFavoritesButtonHovered = ref(false);

const favoritesButtonClasses = computed(() => {
  // TODO: add danger class if product is in favorites list
  // TODO: maybe disable it if user is not logged in
  let classes = 'p-button-rounded product-card-favorites-button p-button-lg'
  if (isFavoritesButtonHovered.value) {
    classes = `${classes} p-button-danger`
  } else {
    classes = `${classes} p-button-text  p-button-secondary`
  }
  return classes;
})

// actions
const cartStore = useCartStore();
const toast = useToast();

const addToCart = () => {
  cartStore.addToCart({product: props.product, quantity: 1});
  toast.add({severity: 'success', detail: 'Product was added to cart', life: 3000});
}
</script>

<style>
.product-card-favorites-button {
  position: absolute;
  top: 5px;
  left: 5px;
  transition: all 0.3s;
}

.card {
  max-width: 100%;
  width: 100%;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
}

.card:hover{
  box-shadow: 1px -1px 5px -2px rgba(0,0,0,0.5);
}

.card-image {
  max-width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  margin: auto;
  width: 100%;
}

.product-title{
  height: 2em;
}

.discount {
  position: absolute;
  transform: rotate(45deg);
  z-index: 10;
  right: -30px;
  top: 25px;
  width: 150px;
  text-align: center;
  background-color: red;
  overflow: hidden;
  font-weight: 600;
}

.card-body {
  text-align: center;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rating-value {
  display: inline-block;
  padding-left: 5px;
}

.rating {
  display: inline-block;
}

.product-rating {
  display: block;
}

.price {
  color: red;
  font-weight: 600;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  padding: 0 5px 5px 5px;
}

.p-toast-top-right{
  z-index: 40;
  top: 65px;
}
</style>