<template>
  <div class="cart-item">
    <div class="cart-item-wrapper">
      <div class="cart-item-image-container">
        <img
          :src="getImageUrl()"
          crossorigin="anonymous"
          alt="Product image"
          class="cart-item-image"
        >
      </div>
      <div class="cart-item-details">
        <span class="cart-item-title">
          {{ computedTitle }}
        </span>
        <span :class="computedAvailability">In stock</span>
        <span class="cart-item-price">{{ priceWholePart }}<sup class="price-float-price">{{ priceFloatPart }}</sup> GBP</span>
        <InputNumber
          id="quantity"
          v-model="quantity"
          mode="decimal"
          show-buttons
          :min="0"
          :max="10"
          input-style="width: 50px; !important"
          style="height: 20px; width: fit-content;"
          button-layout="horizontal"
          decrement-button-icon="pi pi-minus"
          increment-button-icon="pi pi-plus"
          decrement-button-class="decrement-quantity"
          increment-button-class="increment-quantity"
          class="cart-item-quantity"
          @input="updateQuantity"
        />
        <span
          class="cart-item-remove-product"
          @click="removeFromCart"
        >Remove from cart</span>
      </div>
    </div>
    <div class="cart-item-subtotal">
      <span><strong>Subtotal:</strong> {{ subtotalWholePart }}<sup><small class="mf-decimal" />{{ subtotalFloatPart }}</sup> GBP</span>
    </div>
  </div>
</template>

<script setup>

import {ref, defineProps, computed} from "vue";
import {useProduct} from "../composables/product";

import InputNumber from 'primevue/inputnumber';
// eslint-disable-next-line import/namespace
import {useCartStore} from '../stores/cart';

const props = defineProps({
  item: {
    required: true,
    type: Object
  }
});

const cart = useCartStore();
const subtotal = computed(() => {
  return cart.getSubtotalById(props.item.product._id)
});

const {getImageUrl, hasDiscount, priceWholePart, priceFloatPart, computedTitle} = useProduct(props.item.product);

const quantity = ref(props.item.quantity);

const updateQuantity = (event) => {
  cart.updateQuantity(props.item, event.value);
}

const computedAvailability = computed(() => {
  return 'cart-item-in-stock'
})

const subtotalWholePart = computed(() => {
  return Math.floor(subtotal.value)
})

const subtotalFloatPart = computed(() => {
  let value = subtotal.value - priceWholePart.value;
  value = Math.round(value * 100).toString();
  return value.length === 2 ? value : value.length > 2 ? value.slice(0,2) : value + '0'
})

const removeFromCart = () => {
  cart.removeFromCart(props.item);
}

</script>

<style>
.cart-item {
  background-color: #e4f1f9;
  padding: 20px 20px 45px 20px;
  position: relative;
  border-radius: 5px;
}

.cart-item-quantity > input {
  text-align: center;
  width: 35px !important;
}

.decrement-quantity, .increment-quantity {
  width: 25px !important;
}

.cart-item-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
}

.cart-item-image {
  width: 200px;
  max-height: 400px;
}

.cart-item-details {
  padding: 30px;
  display: flex;
  flex-flow: column;
  row-gap: 5px;
}

.cart-item-wrapper{
  background-color: #fff;
  display: flex;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 2px #bbc6cc;
}

.cart-item-title{
  font-weight: 700;
  font-size: 20px;
}

.cart-item-in-stock{
   color: #0d650d;
}
.cart-item-out-of-stock{
   color: red;
}

.cart-item-limited-stock{
   color: #d36c43;
}

/*.cart-item-price{*/
/*  padding: 5px 0;*/
/*}*/

.price-change-enter-active {
  transition: all .3s ease;
}
.price-change-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.price-change-enter, .price-change-leave-to
  /* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.cart-item-subtotal{
  position: absolute;
  display: flex;
  right: 20px;
  margin: 10px;
}

.cart-item-remove-product{
  color: #1877f2;
  cursor: pointer;
}

@media (max-width: 992px) {

  .cart-item-image-container{
    width: 40%;
    max-height: 200px;
  }
  .cart-item-image{
    width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .cart-item-details{
    padding: 10px;
  }
}

@media (max-width: 600px) {
  .cart-item-wrapper{
    flex-flow: column;
  }

  .cart-item-wrapper > * {
    margin: auto;
  }

  .cart-item-details > *{
    margin: auto;
  }

  .cart-item-image-container{
    min-width: 100px;
  }
}

</style>