<template>
  <div class="orders-wrapper">
    <h2>My orders</h2>
    <Order
      v-for="(order, index) in orders"
      :key="`order-${index}`"
      :order="order"
    />
  </div>
</template>
<script setup>

import {useAuthStore} from "../stores/auth.js";
import {ref, onMounted} from "vue";
import axios from "axios";
import Order from "../components/Order.vue";
import {setPageTitle} from "../utils/helpers.js";

const authStore = useAuthStore();

const authenticated = (authStore.isAuthenticated);

const orders = ref([]);

onMounted(async () => {
  setPageTitle('Orders');
  if (authenticated) {
    const res = await axios.get('/orders/me');
    const data = res.data;
    if (data.success) {
      orders.value = data.data;
    }
  }
})
</script>
<style scoped>
.orders-wrapper{
    width: 80%;
    margin: 10px 10%;
}

</style>