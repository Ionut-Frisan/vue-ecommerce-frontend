<template>
  <div class="cart-page-wrapper">
    <h1>Cart</h1>
    <div class="cart-content-wrapper">
      <div class="cart-content">
        <div class="cart-products">
          <TransitionGroup name="list">
            <CartItem
              v-for="item in cart.getCartItems"
              :key="item.product._id"
              :item="item"
            />
          </TransitionGroup>
        </div>
      </div>
      <div class="cart-proceed-checkout">
        <div class="cart-summary">
          <span id="order-summary-title">Order Summary</span>
          <div class="cart-cost-info">
            <span>Products cost:</span>
            <span>{{ formattedTotal.whole }}<sup>{{ formattedTotal.float }}</sup> GBP</span>
          </div>
          <div class="cart-cost-info">
            <span>Delivery fee:</span>
            <span>{{ formattedDeliveryFee.whole }}<sup>{{ formattedDeliveryFee.float }}</sup> GBP</span>
          </div>
          <span class="divider" />
          <div class="cart-total-container">
            <strong><span class="cart-total-info"> Total: <span class="cart-total-value"> {{ formattedTotalWithFee.whole }}<sup>{{ formattedTotalWithFee.float }}</sup> GBP</span></span></strong>
          </div>
          <a
            href="#"
            class="link checkout-btn"
          >
            <div class="btn-icon">
              <i class="pi pi-angle-double-right" />
            </div>
            Continue
          </a>
        </div>
        <div class="cart-add-voucher">
          <span id="order-summary-title">Add voucher</span>
          <span class="divider" />
          <InputText
            v-model="voucher"
            class="voucher-input"
          />
          <a
            href="#"
            class="link checkout-btn"
          >
            <div class="btn-icon">
              <i class="pi pi-plus" />
            </div>
            Add
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useCartStore} from "../stores/cart.js";
import CartItem from "../components/CartItem.vue";
import {getFormattedPrice} from '../utils/price.js'

const cart = useCartStore();

const items = ref(cart.getCartItems);

const voucher = ref('');

const deliveryFee = 5;

const formattedDeliveryFee = getFormattedPrice(deliveryFee);

const formattedTotalWithFee = computed(() => {
  return getFormattedPrice(cart.getCartTotalPrice + deliveryFee);
})
const formattedTotal = computed(() => {
  return getFormattedPrice(cart.getCartTotalPrice);
})
</script>

<style scoped>
body{
  background-color: #fafafa;
}

.cart-page-wrapper{
  width: 1200px;
  margin: auto;
}

.cart-products{
  display: flex;
  flex-flow: column;
  row-gap: 20px;
}

.cart-content-wrapper{
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
  margin: auto;
  column-gap: 20px;
}

.cart-summary, .cart-add-voucher{
  background-color: #fff;
  box-shadow: 3px 3px 2px #e3e3e3;
  border-radius: 5px;
  padding: 0 20px 20px 20px;
}

.cart-add-voucher{
  margin-top: 10px;
}

.cart-cost-info{
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  padding: 5px 0;
}

#order-summary-title{
  font-weight: 600;
  font-size: 20px;
  padding: 10px 0;
  display: block;
}

.divider{
  display: block;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
}
.cart-total-info{
  font-size: 20px;
}
.cart-total-value{
  display: block;
  font-size: 25px;
  padding-bottom: 10px;
}

.link{
  text-decoration: none;
  color: #fff;
}

.checkout-btn{
  display: block;
  width: 100% !important;
  background-image: linear-gradient(to bottom right,#3482cc,#1763aa);
  font-size: 18px;
  text-align: center;
  position: relative;
  height: 35px;
  border-radius: 8px;
  line-height: 35px;
  padding-left: 45px;
  overflow: hidden;
}

.btn-icon{
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 45px;
  text-align: center;
  background-color: #e71e25;
  line-height: 35px;
  border-bottom-right-radius: 1.866rem 5rem;
  -webkit-border-bottom-right-radius: 1.866rem 5rem;
}

.voucher-input{
  width: 100%;
  margin-bottom: 10px;
}

.list-enter-active {
  transition: all .3s ease;
}
.list-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.list-enter, .list-leave-to
  /* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(100px);
  opacity: 0;
}
</style>