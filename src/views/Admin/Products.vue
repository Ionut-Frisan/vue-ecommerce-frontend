<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <router-link :to="`products/create`">
            <Button
              label="New"
              icon="pi pi-plus"
              class="p-button-success mr-2"
            />
          </router-link>
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            :disabled="!selectedProducts || !selectedProducts.length"
            @click="confirmDeleteSelected"
          />
        </template>

        <template #end>
          <FileUpload
            mode="basic"
            accept="image/*"
            :max-file-size="1000000"
            label="Import"
            choose-label="Import"
            class="mr-2 inline-block"
            disabled
          />
          <Button
            label="Export"
            icon="pi pi-upload"
            class="p-button-help"
            disabled
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        v-model:selection="selectedProducts"
        :value="products"
        data-key="id"
        :paginator="false"
        :rows="queryParams.limit"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[25, 50, 100]"
        current-page-report-template="Showing {first} to {last} of {totalRecords} products"
        responsive-layout="stack"
        breakpoint="900px"
      >
        <template #header>
          <div
            class="
              table-header
              flex flex-column
              md:flex-row md:justiify-content-between
            "
          >
            <h5 class="mb-2 md:m-0 p-as-md-center">
              Manage Products
            </h5>
            <div>
              <label for="field">Sort by</label>
              <dropdown
                id="field"
                v-model="queryParams.field"
                :options="formattedFields"
                option-label="label"
                option-value="value"
              />
              <label for="order"> Direction</label>
              <dropdown
                id="order"
                v-model="queryParams.order"
                :options="sortDirectionOptions"
                option-label="label"
                option-value="value"
              />
            </div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText placeholder="Search..." />
            </span>
          </div>
        </template>

        <Column
          selection-mode="multiple"
          style="width: 3rem"
          :exportable="false"
        />
        <Column
          field="name"
          header="Name"
          style="min-width: 10rem"
        />
        <Column header="Image">
          <template #body="slotProps">
            <img
              crossorigin="anonymous"
              :src="getImageUrl(slotProps.data.imageUrls)"
              alt="no image"
              class="product-image"
            >
          </template>
        </Column>
        <Column
          field="price"
          header="Price"
          style="min-width: 5rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.price }}
          </template>
        </Column>
        <Column
          field="category.name"
          header="Category"
          style="min-width: 10rem"
        />
        <Column
          field="rating"
          header="Reviews"
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <Rating
              :model-value="slotProps.data.rating"
              :readonly="true"
              :cancel="false"
            />
          </template>
        </Column>
        <Column
          field="discount"
          header="Discount"
          style="min-width: 5rem"
        />
        <Column
          field="needs_upload"
          header="Needs upload"
          style="min-width: 5rem"
        />
        <Column
          :exportable="false"
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <router-link :to="`products/update/${slotProps.data.slug}`">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
              />
            </router-link>
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-warning"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
        <template #footer>
          <label for="limit">Products/page </label>
          <Dropdown
            id="limit"
            v-model="queryParams.limit"
            :options="[10,25,50,100]"
          />
        </template>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem"
        />
        <span v-if="productToDelete">Are you sure you want to delete <b>{{ productToDelete.name }}</b>?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteProduct(productToDelete._id)"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem"
        />
        <span v-if="selectedProducts.length">Are you sure you want to delete {{ selectedProducts.length }} products?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="deleteProductsDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from "vue";
import { useToast } from "primevue/usetoast";
import {config} from "../../../application.config.js";

import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import DataTable from "primevue/datatable";
import FileUpload from "primevue/fileupload";
import Rating from "primevue/rating";
import Column from "primevue/column";
import Dropdown from "primevue/dropdown";

import axios from "axios";
import {setAdminPageTitle, getImageUrl as getImageUrlHelper} from "../../utils/helpers";

const {uploadsUrl, noImageUrl} = config;

// toasts
const toast = useToast();

// lifecycle hooks
onMounted(async () => {
  setAdminPageTitle('Products');
  await axios
      .get(`/products${query.value}`)
      .then((res) => {
        products.value = res.data.data;
      })
      .catch((err) => {
        console.error(err);
      });
});

// products functionality
const products = ref();
const productToDelete = ref(null);
const selectedProducts = ref([]);
const deleteProductDialog = ref(false)
const deleteProductsDialog = ref(false);

const confirmDeleteProduct = (product) => {
  deleteProductDialog.value = true;
  productToDelete.value = product;
}

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
}

const deleteProduct = (id) => {
  axios.delete(`/products/${id}`).then((res) => {
    if(res.data.success){
      toast.add({severity:'success', summary:'Success', detail:'Product was deleted', life: 3000});
      products.value = products.value.filter((product) => product._id !== id)
    }
    else{
      toast.add({severity:'error', summary:'Error', detail:'Product could not be deleted', life: 3000})
    }
  }).catch((err) => toast.add({severity:'error', summary:'Error', detail:'Product could not be deleted', life: 3000}));

  deleteProductDialog.value = false;
  productToDelete.value = null;
}

const deleteSelectedProducts = () => {
  toast.add({severity:'info', summary:'Warn', detail:'This functionality is not yet implemented', life: 5000});
  deleteProductsDialog.value = false;
}

const getImageUrl = (imageUrls) => getImageUrlHelper({imageUrls})[0] || `${noImageUrl}`;

// queries
const queryParams = ref({
  field: 'name',
  order: '',
  limit: 25,
  page: 1
})

const query = computed(() => {
  return `?sort=${queryParams.value.order}${queryParams.value.field}&limit=${queryParams.value.limit}&page=${queryParams.value.page}`
})

const runQuery = async () => {
  await axios
      .get(`/products${query.value}`)
      .then((res) => {
        products.value = res.data.data;
      })
      .catch((err) => {
        console.error(err);
      });
}

const formattedFields = computed(() => {
  return ['name', 'price', 'category', 'rating', 'discount', 'needs_upload'].map((field) => {
    return {
      label: field,
      value: field
    }
  })
})

const sortDirectionOptions = [{label: 'asc', value: ''}, {label: 'desc', value:'-'}]
const pageLimitOptions = [{label: '25', value: 25}, {label:'50', value: 50}, {label: '100', value: 100}]

watch(() => query.value, () => {
  runQuery();
})
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media screen and (max-width: 960px) {
.table-header{
    align-items: start;
  }
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>