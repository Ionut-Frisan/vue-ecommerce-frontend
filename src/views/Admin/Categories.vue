<template>
  <div>
    <div style="padding-bottom: 20px">
      <form @submit.prevent="addCategory">
        <span class="field col">
          <label for="name">Name</label>
          <InputText
            id="name"
            v-model="newName"
            required
            style="width: 80%; margin: 0 10px"
          />
        </span>
        <Button
          label="Add"
          icon="pi pi-plus"
          class="p-button-primary"
          type="submit"
        ></Button>
      </form>
    </div>
    <nsf-table
      :model="['name', 'slug']"
      :data="categories"
      :remove-action="removeCategory"
      :edit-action="editCategory"
    ></nsf-table>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from "vue";
import {useToast} from "primevue/usetoast";

import axios from "axios";
import NsfTable from "../../components/Admin/NsfTable.vue";
import Button from 'primevue/button';

const categories = ref([]);
const selectedCategories = ref([]);
const categoryToDelete = ref({});
const deleteCategoryDialog = ref(false);
const newName = ref('');

const toast = useToast();

const queryParams = ref({
  field: 'name',
  order: '',
  limit: 25,
  page: 1
})

onMounted(async () => {
  await axios
      .get(`/categories`)
      .then((res) => {
        categories.value = res.data.data;
      })
      .catch((err) => {
        console.log(err)
      })
});

const formattedFields = computed(() => {
  return ['name', 'slug'].map((field) => {
    return {
      label: field,
      value: field
    }
  })
})

const sortDirectionOptions = [{label: 'asc', value: ''}, {label: 'desc', value:'-'}]

const addCategory = async () => {
  if (!newName.value) {
    toast.add({severity:'error', summary:'Enter valid name', life: 5000})
    return;
  }
  await axios
    .post(`/categories`, {name: newName.value})
    .then((res) => {
      toast.add({severity:'success', summary:'Category was added.', life: 5000});
      categories.value.push(res.data.data)
    })
    .catch((err) => toast.add({severity:'error', summary: err.error || 'Category could not be added.', life: 5000}))
}

const deleteSelectedCategories = () => {};

const removeCategory = async (category, newName) => {
  let id = typeof category === 'object' ? category._id || category.id : category;
  await axios
      .delete(`/categories/${id}`)
      .then((res) => {
        toast.add({severity:'success', summary:'Category was removed.', life: 5000});
        categories.value = categories.value.filter((category) => category._id !== id);
      })
      .catch((err) => toast.add({severity:'error', summary: err.error || 'Category could not be removed.', life: 5000}))
}

const editCategory = async (category, newName) => {
  let id = typeof category === 'object' ? category._id || category.id : category;
  let name = typeof newName === 'object' ? newName?.value : newName;
  if (!name) {
    toast.add({severity:'error', summary:'Enter valid name', life: 5000})
    return;
  }
  await axios
      .put(`/categories/${id}`, {name})
      .then((res) => {
        toast.add({severity:'success', summary:'Category was updated.', life: 5000});
        categories.value = categories.value.map((category) => {
          return category._id === id ? res.data.data : category;
        })
      })
      .catch((err) => toast.add({severity:'error', summary: err.error || 'Category could not be updated.', life: 5000}))
}

</script>

<style scoped>

</style>