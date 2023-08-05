<template>
  <div
    v-if="!!statusComputed"
    class="order-history"
  >
    <timeline
      :value="items"
      align="left"
      style="width: fit-content"
    >
      <template #content="slotProps">
        <span :style="{ color: slotProps.item.color }">
          {{ slotProps.item.label }}
        </span>
      </template>
      <template #marker="slotProps">
        <span
          class="status-icon"
          :style="{ color: slotProps.item.color }"
        >
          <i :class="slotProps.item.icon" />
        </span>
      </template>
    </timeline>
  </div>
</template>

<script setup>
// TODO: dynamic
// TODO: current status
import {computed} from "vue";
import Timeline from 'primevue/timeline';

import {statusLabels} from "../utils/constants.js";

const props = defineProps({
    order: {
        type: Object
    }
})

const notOkStatuses = ['paymentRejected', 'cancelled'];
const statusList = ['orderPlaced', 'paymentCompleted', 'orderAccepted', 'inProgress', 'delivering', 'completed'];

const statusComputed = computed(() => {
    const statusMapping = {
        cancelled: "cancelled",
        completed: "completed",
        delivering: "delivering",
        inProgress: "inProgress",
        orderAccepted: "orderAccepted",
        orderPlaced: "orderPlaced",
        paymentCompleted: "paymentCompleted",
        paymentRejected: "paymentRejected",
        waitingForPayment: "orderPlaced"
    }
    return statusMapping[props.order.status];
});

const statusIcons = computed(() => {
    return statusList.reduce((acc, status) => {
        const isStatusDone = (statusList.indexOf(status) < statusList.indexOf(statusComputed.value)) || statusComputed.value === 'completed' || status === 'orderPlaced';
        const icon = ['inProgress', 'delivering'].includes(statusComputed.value) ? "pi pi-spin pi-spinner" :
            (statusList.indexOf(status) <= statusList.indexOf(statusComputed.value)) ? "pi pi-check" : "pi pi-stop";
        // const icon = isStatusDone ? "pi pi-check" :
        //   status === statusComputed.value ? "pi pi-spin pi-spinner" : "pi pi-stop"
        return {
            ...acc,
            [status]: icon
        }
    }, {})
})

const statusColors = computed(() => {
    return statusList.reduce((acc, status) => {
        const isStatusDone = (statusList.indexOf(status) < statusList.indexOf(statusComputed.value)) || statusComputed.value === 'completed' || status === 'orderPlaced';
        // const color = isStatusDone ? "#4caf50" :
        //     status === statusComputed.value ? "#2196f3" : "";
        const color = ['inProgress', 'delivering'].includes(statusComputed.value) ? "#2196f3" :
            (statusList.indexOf(status) <= statusList.indexOf(statusComputed.value)) ? "#4caf50" : "#dee2e6";
        return {
            ...acc,
            [status]: color
        }
    }, {})
})

const items = computed(() => {
    if(notOkStatuses.includes(statusComputed.value)) {
        return [{
            label: statusLabels[statusComputed.value],
            icon: "pi pi-times",
            color: "#ff4032"
        }]
    }
    return statusList.map((status) => ({
        label: statusLabels[status],
        icon: statusIcons.value[status],
        color: statusColors.value[status]
    }))
})

</script>

<style>
.status-icon {
    border-radius: 50%;
    border: 1px solid;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-timeline-event-opposite{
    width: 0;
    flex: 0;
    padding: 0;
}

</style>