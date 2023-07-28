<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt-orders"
        v-model:expandedRows="expandedRows"
        :value="ordersComputed"
        data-key="id"
        :paginator="false"
        responsive-layout="stack"
        breakpoint="900px"
      >
        <template #header>
          <div
            class="table-header flex flex-column md:flex-row md:justify-content-between"
          >
            Manage orders
          </div>
        </template>
        <template #expansion="slotProps">
            <div class="p-3">
                <DataTable :value="getOriginalProductsArray(slotProps.data)">
                    <Column field="name" header="Name" sortable>
                      <template #body="productProps">
                          <router-link :to="`/product/${productProps.data.slug}`" style="text-decoration: none; color: inherit" target="_blank">
                          {{ productProps.data.name }}
                          </router-link>
                      </template>
                    </Column>
                    <Column field="category.name" header="Category" sortable></Column>
                    <Column field="price" header="Price">
                        <template #body="productProps">
                            {{ productProps.data.price / 100 }}
                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity">
                        <template #body="productProps">
                            {{ getQuantityForProduct(slotProps.data, productProps.data._id) }}
                        </template>
                    </Column>
                    <Column field="discount" header="Discount" sortable></Column>
                </DataTable>
            </div>
        </template>
        <Column expander style="width: 5rem" />
        <Column
          field="name"
          header="Name"
          style="min-width: 10rem"
          sortable
        />
        <Column
          field="price"
          header="Price"
          style="min-width: 3rem"
          sortable
        >
          <template #body="slotProps">
            <span>
                <router-link :to="`/admin-panel/orders/${slotProps.data.id}`" >{{slotProps.data.price}} </router-link>
            </span>
          </template>
        </Column>
        <Column
          field="email"
          header="Email"
          style="min-width: 3rem; max-width: 5rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
          sortable
        >
            <template #body="slotProps">
            <span
              :title="slotProps.data.email"
            >
              {{slotProps.data.email}}
            </span>
            </template>
        </Column>
        <Column
          field="zip"
          header="Zipcode"
          style="min-width: 3rem"
          sortable
        />
        <Column
          header="Address"
          field="address"
          style="min-width: 3rem; max-width: 5rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
          sortable
        >
          <template #body="slotProps">
            <span
              :title="slotProps.data.address"
            >
              {{slotProps.data.address}}
            </span>
          </template>
        </Column>
        <Column
          header="Status"
          field="status"
          style="min-width: 3rem"
          sortable
        >
          <template #body="slotProps">
              <Tag
                :severity="slotProps.data.statusInfo.severity"
                :value="slotProps.data.statusInfo.label"
                :icon="slotProps.data.statusInfo.icon"
              />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref, computed} from "vue"

import Column from "primevue/column";
import Tag from "primevue/tag";
import DataTable from "primevue/datatable";
import {getOrders} from "../../../managers/RequestManagers/orders.js";
import {statusLabels, statusIcons, statusSeverity} from "../../../utils/constants.js";

const orders = ref([]);
const selectedOrders = ref([]);
const expandedRows = ref([]);

onMounted(async () => {
  orders.value = await getOrders();
})

const ordersComputed = computed(() => {
    return !Array.isArray(orders.value) ? []
        : orders.value.map((order) => {
            const client = `${order?.firstName || '--'} ${order?.lastName || '--'}`;
            const price = order?.total / 100;
            const address = `${order.county}, ${order.city}, ${order.address}`;
            return {
                ...order,
                id: order._id,
                name: client,
                price,
                address,
                statusInfo: getStatusInfo({order}),
            }
        })
})

const getOriginalProductsArray = (order) => {
    return order.originalProducts.map((item) => item.product);
}

const getQuantityForProduct = (order, productId) => {
    return order.quantities.find((item) => Object.keys(item)[0] === productId)[productId]
}

const getStatusInfo = ({order, status: statusProp}) => {
    const status = statusProp || order?.status;

    return {
        label: statusLabels[status] || '-- Error - Check with Ionut --',
        severity: statusSeverity[status] || 'warning',
        icon: statusIcons[status] || 'pi pi-exclamation-triangle',
    }
}

</script>
<style scoped>

</style>