<template>
  <div class="order">
    <div class="order-header">
      <router-link :to="`order/${order._id}`">
        <p>Order {{ order._id || order.id }} &nbsp;</p>
      </router-link>
      <Button
        v-tooltip.top="'Copy order id'"
        icon="pi pi-copy"
        :class="buttonClasses"
        aria-label="Copy order id"
        @click="copyId"
      />
    </div>
    <p>Placed on: {{ createdAt }}</p>
    <p>Total: {{ price }}</p>
    <p class="status">
      {{ statusComputed }}
    </p>
  </div>
</template>
<script setup>
import {computed} from "vue";

import Button from "primevue/button";
import {useToast} from "primevue/usetoast";
import {isValidDate} from "../utils/helpers";
import {statusLabels} from "../utils/constants";

const toast = useToast();

const props = defineProps({
    order: {
        type: Object,
        required: true
    },
    dateSeparator: {
        type: String,
        default: "-"
    }
})

const statusComputed = computed(() => {
    return statusLabels[props.order.status] || "";
})

const createdAt = computed(() => {
    const created = new Date(props.order.created_at);
    if (!isValidDate(created)) return '--';

    const year = created.getFullYear();
    let month = created.getMonth() + 1;
    const day = created.getDate();
    const hour = created.getHours();
    const minute = created.getMinutes();
    month = month < 10 ? `0${month}` : month;

    return `${day}${props.dateSeparator}${month}${props.dateSeparator}${year}, ${hour}:${minute}`;
})

const price = computed(() => {
    return props.order.total / 100;
})

const buttonClasses = computed(() => {
    return `p-button-text p-button-secondary`
})

const copyId = () => {
    navigator.clipboard.writeText(props.order._id || props.order.id);
    toast.add({severity:'success', summary:'Id was copied.', life: 1000});
}
</script>

<style scoped>
.status {
    color: #00bfff;
    font-weight: bold;
}

.order-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.order-header .p-button {
    padding: 0;
    height: 100%;
}

.order .order-header p{
    color: #1763aa;
    font-weight:bolder;
    font-size: 1.4rem;
}

p{
    margin: 0;
}

.order{
    width: 100%;
    margin: 10px 0;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #dee2e6;
    font-size: 16px
}

.order p{
    font-size: 1.2rem;
}

.order a{
    text-decoration: none;
}
</style>