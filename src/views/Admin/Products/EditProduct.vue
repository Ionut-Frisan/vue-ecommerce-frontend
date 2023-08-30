<template>
  <div class="edit-product-wrapper">
    <h2>{{ pageTitle }}</h2>
    <div class="field">
      <label for="name">Name</label>
      <InputText
          id="name"
          v-model.trim="product.name"
          :class="{ 'p-invalid': errors?.name.length && submitted }"
          autofocus
          required="true"
      />
      <p v-for="err in errors?.name" v-if="submitted" class="p-error error-helper">{{ err }}</p>
    </div>
    <div class="field">
      <label for="description">
        Description
        <Button @click="toggleOverlay" text icon="pi pi-eye"></Button>
      </label>
      <Textarea
          id="description"
          v-model="product.description"
          :required="true"
          cols="20"
          rows="5"
      />
    </div>
    <div class="field">
      <label for="specifications">Specifications</label>
      <JsonEditorVue
          v-model="product.specifications"
          :navigationBar="false"
      >
      </JsonEditorVue>
    </div>
    <div class="field">
      <label
          class="mb-3"
          for="category"
      >Category</label>
      <Dropdown
          id="category"
          v-model="product.category"
          :class="{'p-invalid' : errors?.category.length && submitted} "
          :filter="true"
          :model-value="product.category"
          :options="formattedCategories"
          option-label="label"
          option-value="value"
          placeholder="Select a category"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
          <span :class="'product-badge status-' + slotProps.value.value">{{
              slotProps.value.label
            }}</span>
          </div>
          <div v-else-if="slotProps.value && !slotProps.value.value">
          <span
              :class="'product-badge status-' + slotProps.value.toLowerCase()"
          >{{ slotProps.value }}</span>
          </div>
          <span v-else>
          {{ slotProps.placeholder }}
        </span>
        </template>
      </Dropdown>
      <p v-for="err in errors?.category" v-if="submitted" class="p-error error-helper">{{ err }}</p>
    </div>

    <div class="field col">
      <label for="price">Price</label>
      <InputNumber
          id="price"
          v-model="product.price"
          :class="{'p-invalid': errors?.price.length && submitted}"
          :required="true"
          currency="GBP"
          locale="en-US"
          mode="currency"
      />
      <p v-for="err in errors?.price" v-if="submitted" class="p-error error-helper">{{ err }}</p>
    </div>
    <div class="field col">
      <label for="quantity">Quantity</label>
      <InputNumber
          id="quantity"
          v-model="product.quantity"
          :class="{'p-invalid': errors?.quantity.length && submitted}"
          :min="0"
          :required="true"
          integeronly
      />
      <p v-for="err in errors?.quantity" v-if="submitted" class="p-error error-helper">{{ err }}</p>
    </div>
    <div class="field col">
      <label for="discount">Discount</label>
      <InputNumber
          id="discount"
          v-model="product.discount"
          :max="99.99"
          :min="0"
          integeronly
      />
    </div>
    <div class="field col">
      <label for="needs_upload">Needs photo upload</label>
      <ToggleButton
          id="needs_upload"
          v-model="product.needs_upload"
          off-icon="pi pi-times"
          off-label="Product is not personalized"
          on-icon="pi pi-check"
          on-label="Product is personalized"
      />
    </div>
    <div class="field col full-width">
      <label class="image-label p-component" for="image">Images</label>
      <input
          id="image"
          ref="images"
          accept="image/*"
          class="file-upload"
          multiple
          name="image"
          type="file"
          @change="handleFileChange( $event )"
      >
    </div>
    <div class="buttons">
      <Button
          class="p-button-primary"
          icon="pi pi-check"
          label="Save"
          @click="submit"
      />
    </div>
    <OverlayPanel ref="overlay">
      <p v-html="markdownToHtml(product.description)"></p>
    </OverlayPanel>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";

import {useToast} from "primevue/usetoast";
import {useProductStore} from "../../../stores/product.js";

import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import ToggleButton from 'primevue/togglebutton';
import Button from 'primevue/button';
import OverlayPanel from "primevue/overlaypanel";
import JsonEditorVue from 'json-editor-vue'

import { markdownToHtml } from "../../../utils/markdown.js";
import validateObject from '../../../validations/GenericValidations.js';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

const overlay = ref();

const pageTitle = ref('Edit product');
const product = ref({
  quantity: 0,
  discount: 0,
  price: 0,
  name: '',
  needs_upload: false,
  description: '',
  specification: {},
});

const toggleOverlay = (event) => {
  overlay.value.toggle(event);
}

onMounted(async () => {
  await getCategories();
  product.value = await productStore.fetchSingleProduct(route.params.slug);
  pageTitle.value = `Edit product: ${product.value.name || '--'}`;

  const formatProduct = (product) => {
    let copy = {...product};
    copy.category = {label: copy.category.name, value: copy.category._id};

    for (const key of ['images', 'slug', 'date_added']) {
      delete copy[key]
    }
    return copy
  }
  product.value = {...formatProduct(props.product)};
});

const categories = ref([]);
const submitted = ref(false);
const images = ref(null);

const emit = defineEmits(['saved', 'cancel', 'edited']);
const toast = useToast();

const handleFileChange = () => {
  product.value.images = images.value.files;
  getRequestParams();
}

const rules = {
  name: ['required', 'minLength:5'],
  category: ['required'],
  price: ['required', 'min:0.01'],
  quantity: ['required']
}

const errors = computed(() => {
  return validateObject(product.value, rules);
})

const hasErrors = computed(() => {
  let count = 0;
  for (const [key, error] of Object.entries(errors.value)) {
    if (error.length) count += 1
  }
  return count > 1
})

const getRequestParams = () => {

  let formData = new FormData();
  const prod = product;
  if (prod.value?.images)
    for (const image of prod.value.images) {
      formData.append('images', image)
    }

  formData.append('category', prod.value?.category?.value || prod.value?.category?._id || prod.value?.category);
  formData.append('name', prod.value.name);
  formData.append('description', prod.value.description);
  formData.append('price', prod.value.price);
  formData.append('discount', prod.value.discount);
  formData.append('needs_upload', prod.value.needs_upload);
  formData.append('specifications', prod.value.specifications);
  return formData
}

const submit = async () => {
  if (hasErrors.value) {
    toast.add({
      severity: 'error',
      summary: 'Please enter valid data',
      detail: 'Product could not be added because the entered data is not valid',
      life: 5000
    })
    submitted.value = true;
    return
  }

  await axios.put(`/products/${product.value._id || product.value.id}`, getRequestParams(), {
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
      .then((res) => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Product was edited', life: 3000})
        emit('edited', res.data.data);
      })
      .catch((err) => {
        toast.add({severity: 'error', summary: 'Error', detail: 'There was an error', life: 3000})
      })
}

const getCategories = async () => {
  await axios
      .get("/categories")
      .then((res) => {
        categories.value = res.data.data;
      })
      .catch((err) => {
        console.error(err);
      });
};

const formattedCategories = computed(() => {
  return categories.value.map((category) => {
    return {label: category.name, value: category._id};
  });
});

</script>

<style scoped>
.buttons {
  display: flex;
  float: right;
  padding-top: 50px;
}

.error-helper {
  margin: 0 !important;
}

div > .error-helper:last-of-type {
  padding-bottom: 10px;
}

.file-upload {
  display: block;
  cursor: pointer;
}

.field {
  display: flex;
  flex-direction: column;
}

.edit-product-wrapper {
  padding: 50px 20% !important;
}

.edit-product-wrapper .field {
  margin: 1rem 0;
}

</style>