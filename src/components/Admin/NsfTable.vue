<template>
  <div>
    <table class="admin-table">
      <tr class="table-header">
        <td style="width: 50px">
          <Checkbox
            v-model="selectAll"
            :binary="true"
          ></Checkbox>
        </td>
        <td v-for="field in model" :key="field+'-key'">
          {{ field }}
        </td>
        <td style="width: 100px">
          Actions
        </td>
      </tr>
      <tr
        v-for="(obj, row_index) in data"
        :key="obj.id || 'tr-'+row_index"
      >
        <td>
          <Checkbox
            :value="obj._id || obj.id"
            v-model="bulkSelected"
          />
        </td>
        <td
          v-for="(field, index) in model"
          :key="`td-${row_index}-${index}`"
        >
          {{ obj[field] || '' }}
        </td>
        <td class="action-buttons-table">
          <Button
            :disabled="isEditButtonDisabled"
            icon="pi pi-pencil"
            class="p-button-rounded p-button-warning"
            @click="openDialog('edit', obj)"
          />
          <Button
            :disabled="isRemoveButtonDisabled"
            icon="pi pi-trash"
            class="p-button-rounded p-button-success"
            @click="openDialog('remove', obj)"
          />
        </td>
      </tr>
    </table>
    <Dialog
      v-model:visible="removeEntityDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem"
        />
        <span v-if="selectedEntity">Are you sure you want to delete <b>{{ selectedEntity?.name || entityToDelete?._id }}</b>?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          class="p-button-text"
          @click="removeEntityDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          class="p-button-text"
          @click="submitAction('remove', selectedEntity, '')"
        />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="editEntityDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
      :closable="false"
    >
      <form @submit.prevent="submitAction('edit', selectedEntity, newName)">
        <div class="field col">
          <label for="name">New name</label>
          <InputText
            id="name" 
            v-model="newName"
            class="p-inputtext-lg"
            required
            style="width: 100%"
          />
        </div>
      </form>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="editEntityDialog = false"
        />
        <Button
          label="Edit"
          icon="pi pi-check"
          class="p-button-text"
          @click="submitAction('edit', selectedEntity, newName)"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {defineProps, computed, ref, watch} from 'vue';
import Button from 'primevue/button';
import Dialog from "primevue/dialog";
import Checkbox from 'primevue/checkbox';

const props = defineProps({
  model: Array,
  data: Array,
  removeAction: Function,
  editAction: Function
})

const removeEntityDialog = ref(false);
const bulkRemoveEntityDialog = ref(false);
const editEntityDialog = ref(false);
const selectedEntity = ref({});
const bulkSelected = ref([]);
const selectAll = ref(false);

const newName = ref('');
const newCategory = ref({});

const isRemoveButtonDisabled = computed(() => {
  return typeof props.removeAction === "undefined"
})

const isEditButtonDisabled = computed(() => {
  return typeof props.editAction === "undefined"
})

const openDialog = (type, obj) => {
  const getRef = (type) => {
    if (type === 'edit') return editEntityDialog;
    if (type === 'remove') return removeEntityDialog;
    if (type === 'bulkRemove') return bulkRemoveEntityDialog;
  }
  const ref = getRef(type);
  if(ref) ref.value = true;
  selectedEntity.value = obj;
};

const submitAction = (type, entity, name) => {
  const submitRemove = (entity, name) => {
    props.removeAction(entity);
    removeEntityDialog.value=false;
  }
  const submitEdit = (entity, name) => {
    props.editAction(entity, name);
    editEntityDialog.value=false;
  }

  const map = {
    'remove': submitRemove,
    'edit': submitEdit
  };
  map[type](entity, name);
}

watch(() => selectAll.value , (newValue, oldValue) => {
  if(newValue){
    bulkSelected.value = props.data.map((entity) => entity._id || entity.id)
  } else {
    if(bulkSelected.value.length === props.data.length)
      bulkSelected.value = []
  }
})

watch(() => bulkSelected.value, (newValue, oldValue) => {
  if(newValue.length === props.data.length) selectAll.value = true;
  else selectAll.value = false;
})

</script>

<style scoped>
.admin-table{
  border-radius: 4px;
  width: 100%;
  background: #fff;
}

.table-header{
  font-size: 1.5em;
  font-weight: 500;
  background-color: #f8f9fa;
}

.table-header > td {
  color: #000;
  padding: 10px 5px;
}

td{
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 5px;
  color: #5f6063;
}

tr:last-child > td{
  border-bottom: unset;
}

.field * {
  display: block;
}
</style>