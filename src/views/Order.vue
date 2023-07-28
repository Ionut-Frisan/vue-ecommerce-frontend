<template>
  <div class="order-wrapper">
      <h2 class="order-title">Order {{order._id}}</h2>
      <div class="order-header">
          <span>Placed on:</span>
          <span>{{createdAt}}</span>
          <br>
          <span>Total:</span>
          <span>{{price}}</span>
      </div>
      <div class="history-wrapper">
          <order-history :order="order"/>
      </div>
      <div class="order-info-wrapper">
          <div class="order-info">
              <strong>For:</strong>
              <br>
              <span>&nbsp;&nbsp;{{name}}</span>
          </div>
          <div class="order-info">
              <strong>Adress:</strong>
              <br>
              <span>&nbsp;&nbsp;{{address}}</span>
          </div>
          <div class="order-info">
              <strong>Email:</strong>
              <br>
              <span>&nbsp;&nbsp;{{email}}</span>
          </div>
          <div class="order-info">
              <strong>Phone number:</strong>
              <br>
              <span>&nbsp;&nbsp;{{phoneNumber}}</span>
          </div>
          <div class="order-info">
              <strong>Payment type:</strong>
              <br>
              <span>&nbsp;&nbsp;Card</span>
          </div>
          <div class="order-info">
              <strong>Vouchers:</strong>
              <br>
              <span>&nbsp;&nbsp;--</span>
          </div>
      </div>
  </div>
</template>

<script setup>
// TODO: loading/not found/normal state
import {useRoute} from "vue-router";
import {ref, computed, onMounted} from "vue";
import axios from "axios";

import OrderHistory from "../components/OrderHistory.vue";
import {isValidDate, setPageTitle} from "../utils/helpers.js";

import {statusLabels} from "../utils/constants.js";

const route = useRoute();
const order = ref({});

onMounted(async () => {
    const id = route.params.id;
    setPageTitle(`Order ${id}`);
    const res = await axios.get(`/orders/${id}`);
    order.value = res.data?.data || {};
})

const name = computed(() => `${order.value.firstName || ''} ${order.value.lastName || ''}`);
const email = computed(() => {
    const [username, domain] = order.value.email?.split?.('@') || [];
    const length = username?.length || 0;
    if (length < 2 || !length) {
        return '--';
    }
    return `${username.charAt(0).padEnd(length - 2, '*')}${username.charAt(length - 1)}@${domain}`;
})
const createdAt = computed(() => {
    const created = new Date(order.value.created_at);
    if (!isValidDate(created)) return '--';
    const separator = '-';
    const year = created.getFullYear();
    let month = created.getMonth() + 1;
    const day = created.getDate();
    const hour = created.getHours();
    const minute = created.getMinutes();
    month = month < 10 ? `0${month}` : month;

    return `${day}${separator}${month}${separator}${year}, ${hour}:${minute}`;
})

const statusComputed = computed(() => {
    return statusLabels[order.value.status] || "";
})

const address = computed(() => {
    let addr = order.value.address;
    addr += order.value.city ? `, ${order.value.city}` : '';
    addr += order.value.county ? `, ${order.value.county}` : '';
    return addr;
})

const price = computed(() => {
    return order.value.total / 100 || '--';
})

const phoneNumber = computed(() => {
    return order.value.phone_number || '--';
})
</script>

<style scoped>

.order-wrapper{
    margin: 20px 10%;
    width: 80%;
    background-color: #e4f1f9;
    padding: 1px 20px;
    box-shadow: 1px 1px 2px #bbc6cc;
    border-radius: 5px;
}

.order-header span:nth-of-type(odd){
    width: 100px;
    display: inline-block;
}

.order-header span:nth-of-type(even){
    font-weight: bold;
    color: #070606C4;
}

.order-header, .order-info-wrapper{
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 1px 1px 2px #bbc6cc;
}

.order-info-wrapper{
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 5px;
    margin-bottom: 20px;
}

.history-wrapper{
    margin: 20px 0;
}
</style>