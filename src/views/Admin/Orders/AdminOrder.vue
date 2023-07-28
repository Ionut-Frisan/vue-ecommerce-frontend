<template>
    <div class="order-wrapper">
        <h2>Order {{ order._id }}</h2>
        <div>
            <Tag
                    :severity="statusInfo.severity"
                    :value="statusInfo.label"
                    :icon="statusInfo.icon"
                    style="cursor: pointer"
                    @click="statusDialog = true"
            />
            <br/><br/>
            <ReadonlyValue :value="client" label="Client" label-position="top"/>
            <ReadonlyValue :value="order.email" label="Email" label-position="top"/>
            <ReadonlyValue :value="order.phone_number" label="Phone number" label-position="top"/>
            <ReadonlyValue :value="createdAt" label="Created at" label-position="top"/>
            <ReadonlyValue :value="address" label="Address" label-position="top"/>
            <ReadonlyValue :value="address" label="Address" label-position="top"/>
            <ReadonlyValue :value="order.vouchers" label="Vouchers" label-position="top"/>
            <ReadonlyValue :value="price.toString()" label="Total" label-position="top"/>
            <div class="order-products">
                <DataTable :value="getOriginalProductsArray()">
                    <Column field="name" header="Name" sortable>
                        <template #body="productProps">
                            <router-link :to="`/product/${productProps.data.slug}`"
                                         style="text-decoration: none; color: inherit" target="_blank">
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
                            {{ getQuantityForProduct(productProps.data._id) }}
                        </template>
                    </Column>
                    <Column field="discount" header="Discount" sortable></Column>
                </DataTable>
            </div>
        </div>
        <Dialog
                v-model:visible="statusDialog"
                header="Update product status"
                :modal="true"
                class="p-fluid"
                :closable="true"
        >
            <div>
                <Dropdown v-model="newStatus"
                          editable
                          option-label="label"
                          optionValue="value"
                          :options="statusList"
                          placeholder="Select new state"
                >
                    <template #option="slotProps">
                        <div>
                            <Tag
                                :severity="getStatusInfo(slotProps.option.value).severity"
                                :icon="getStatusInfo(slotProps.option.value).icon"
                            />
                            <span>&nbsp;{{slotProps.option.label}}</span>
                        </div>
                    </template>
                </Dropdown>
                <br/>
                <Button label="Update" :loading="isStatusReqPending" @click="updateStatus"/>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {computed, onMounted, ref} from 'vue';

import {useToast} from "primevue/usetoast";

import Tag from "primevue/tag";
import ReadonlyValue from "../../../components/ReadonlyValue.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

import {getOrderById, updateOrderStatus} from "../../../managers/RequestManagers/orders.js";
import {statusIcons, statusLabels, statusSeverity} from "../../../utils/constants.js";

const route = useRoute();
const order = ref({});

const toast = useToast();

const statusDialog = ref(false);
const newStatus = ref('');
const isStatusReqPending = ref(false);

onMounted(async () => {
    const id = route.params.id;
    order.value = await getOrderById(id);
    newStatus.value = order.value.status;
})

const client = computed(() => `${order.value?.firstName || '--'} ${order.value?.lastName || '--'}`);
const price = computed(() => order.value?.total / 100);
const address = computed(() => `${order.value.county}, ${order.value.city}, ${order.value.address}`);
const createdAt = computed(() => `${new Date(order.value?.created_at).toLocaleDateString()} ${new Date(order.value.created_at).toLocaleTimeString()}`);

const getOriginalProductsArray = () => {
    const source = order.value?.originalProducts || [];
    return source.map((item) => item.product);
}

const getQuantityForProduct = (productId) => {
    const source = order.value?.quantities || [];
    return source.find((item) => Object.keys(item)[0] === productId)[productId]
}

const statusList = computed(() => {
    return Object.entries(statusLabels).map(([value, label]) => ({value, label}))
})

const statusInfo = computed(() => {
    const status = order.value?.status;

    return getStatusInfo(status);
})

const getStatusInfo = (status) => {
    return {
        label: statusLabels[status] || '-- Error - Check with Ionut --',
        severity: statusSeverity[status] || 'warning',
        icon: statusIcons[status] || 'pi pi-exclamation-triangle',
    }
}

const updateStatus = async () => {
    isStatusReqPending.value = true;
    const successCallback = (res) => {
        toast.add({ severity:'success', summary:'Status was updated', life: 5000 });
        isStatusReqPending.value = false;
        order.value = res.data;
    }
    const errorCallback = () => {
        toast.add({ severity:'error', summary:'Status could not be updated', life: 10000 });
        isStatusReqPending.value = false;
    }
    await updateOrderStatus(order.value._id, newStatus.value, successCallback, errorCallback);
}

</script>
<style>
.order-wrapper {
    background-color: #fff;
    min-height: calc(100vh - 60px);
}
</style>