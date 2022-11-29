<template>
  <img
    v-if="product.image"
    src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
    :alt="product.image"
    class="product-image"
  >
  <div class="field">
    <label for="name">Name</label>
    <InputText
      id="name"
      v-model.trim="product.name"
      required="true"
      autofocus
      :class="{ 'p-invalid': errors?.name.length && submitted }"
    />
    <p v-for="err in errors?.name"  v-if="submitted" class="p-error error-helper">{{err}}</p>
  </div>
  <div class="field">
    <label for="description">Description</label>
    <Textarea
      id="description"
      v-model="product.description"
      :required="true"
      rows="3"
      cols="20"
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
      for="category"
      class="mb-3"
    >Category</label>
    <Dropdown
      id="category"
      v-model="product.category"
      :options="formattedCategories"
      :model-value="product.category"
      option-label="label"
      placeholder="Select a category"
      :filter="true"
      :class="{'p-invalid' : errors?.category.length && submitted} "
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
    <p v-for="err in errors?.category" v-if="submitted" class="p-error error-helper">{{err}}</p>
  </div>

  <div class="formgrid grid">
    <div class="field col">
      <label for="price">Price</label>
      <InputNumber
        id="price"
        v-model="product.price"
        mode="currency"
        currency="GBP"
        locale="en-US"
        :required="true"
        :class="{'p-invalid': errors?.price.length && submitted}"
      />
      <p v-for="err in errors?.price" v-if="submitted" class="p-error error-helper">{{err}}</p>
    </div>
    <div class="field col">
      <label for="quantity">Quantity</label>
      <InputNumber
        id="quantity"
        v-model="product.quantity"
        integeronly
        :required="true"
        :min="0"
        :class="{'p-invalid': errors?.quantity.length && submitted}"
      />
      <p v-for="err in errors?.quantity" v-if="submitted" class="p-error error-helper">{{err}}</p>
    </div>
    <div class="field col">
      <label for="discount">Discount</label>
      <InputNumber
        id="discount"
        v-model="product.discount"
        integeronly
        :min="0"
        :max="99.99"
      />
    </div>
    <div class="field col">
      <label for="needs_upload">Needs photo upload</label>
      <ToggleButton
        id="needs_upload"
        v-model="product.needs_upload"
        on-label="Product is personalized"
        off-label="Product is not personalized"
        on-icon="pi pi-check"
        off-icon="pi pi-times"
      />
    </div>
    <div class="field col full-width">
      <label for="image" class="image-label p-component">Images</label>
      <input
        id="image"
        ref="images"
        class="file-upload"
        type="file"
        name="image"
        multiple
        accept="image/*"
        @change="handleFileChange( $event )"
      >
    </div>
    <div class="buttons">
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="confirmCancel($event)"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        class="p-button-text"
        @click="submit"
      />
    </div>
  </div>
  <ConfirmPopup />
</template>

<script setup>
import {ref, computed} from "vue";
import { onMounted } from "vue";
import axios from "axios";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import ToggleButton from 'primevue/togglebutton';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import JsonEditorVue from 'json-editor-vue'

import validateObject from '../../validations/GenericValidations.js';

const props = defineProps({
  functionality: {
    type: String,
    default: 'add'
  },
  product: {
    type: Object
  }
})

const product = ref({quantity: 0, discount: 0, price: 0, name: '', needs_upload: false, description: ''});
onMounted(() => {
  getCategories();

  const formatProduct = (product) => {
    console.log(product)
    let copy = {...product};
    copy.category = {label: copy.category.name, value: copy.category._id};

    for (const key of ['images', 'slug', 'date_added']){
      delete copy[key]
    }
    return copy
  }

  if(props.functionality === 'edit'){
    product.value = { ...formatProduct(props.product) };
  }
});

const categories = ref([]);
const submitted = ref(false);
const images = ref(null);

const emit = defineEmits(['saved', 'cancel', 'edited']);
const confirm = useConfirm();
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
  for(const [key, error] of Object.entries(errors.value)){
    if(error.length) count += 1
  }
  return count > 1
})

const getRequestParams = () => {

  let formData = new FormData();
  const prod = product;
  if(prod.value?.images)
    for(const image of prod.value.images){
      formData.append('images', image)
    }

  // let specifications = JSON.parse(product.value.specifications) || null;

  // formData.append('images', prod.value.image);
  formData.append('category', prod.value?.category?.value || prod.value?.category?._id);
  formData.append('name', prod.value.name);
  formData.append('description', prod.value.description);
  formData.append('price', prod.value.price);
  formData.append('discount', prod.value.discount);
  formData.append('needs_upload', prod.value.needs_upload);
  formData.append('specifications', prod.value.specifications);
  return formData
}

const submit = async () => {
  if(hasErrors.value){
    toast.add({severity:'error', summary:'Please enter valid data', detail:'Product could not be added because the entered data is not valid', life: 5000})
    submitted.value = true;
    return
  }
  if(props.functionality === 'add')
    await axios.post('/products', getRequestParams(), {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then((res) =>
      { toast.add({severity:'success', summary:'Success', detail:'Product was added in database', life: 3000})
        emit('saved', res.data.data);
      })
      .catch((err) => {toast.add({severity:'error', summary:'Error', detail:'There was an error', life: 3000})})
  if(props.functionality === 'edit'){
    console.log(product);
    await axios.put(`/products/${product.value._id || product.value.id}`, getRequestParams(), {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
        .then((res) =>
        { toast.add({severity:'success', summary:'Success', detail:'Product was added in database', life: 3000})
          emit('edited', res.data.data);
        })
        .catch((err) => {toast.add({severity:'error', summary:'Error', detail:'There was an error', life: 3000})})
  }
}

const confirmCancel = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure?',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      toast.add({severity:'info', summary:'Canceled', detail:'Product was not added in database', life: 3000});
      emit('cancel');
    },
    reject: () => {
      toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
    }
  });
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
    return { label: category.name, value: category._id };
  });
});

</script>

<style scoped>
.buttons{
  display: flex;
  float: right;
  padding-top: 50px;
}

.error-helper{
  margin: 0 !important;
}

div > .error-helper:last-of-type{
  padding-bottom: 10px;
}

.file-upload{
  display: block;
  cursor: pointer;
}

</style>