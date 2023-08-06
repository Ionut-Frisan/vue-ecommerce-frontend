<template>
  <div class="advanced-filters">
    <dropdown
      v-if="hasSorting"
      v-model="sortBy"
      :options="sortOptions"
      option-label="label"
      placeholder="Sort by"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value">
          <span>{{ slotProps.value.label }}&nbsp;</span>
          <i
            v-if="slotProps.value.showDirection !== false"
            :class="[{'pi pi-arrow-up': !slotProps.value.value.startsWith('-')},{'pi pi-arrow-down': slotProps.value.value.startsWith('-')}]"
          />
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div>
          <span>{{ slotProps.option.label }}&nbsp;</span>
          <i
            v-if="slotProps.option.showDirection !== false"
            :class="[{'pi pi-arrow-up': !slotProps.option.value.startsWith('-')},{'pi pi-arrow-down': slotProps.option.value.startsWith('-')}]"
          />
        </div>
      </template>
    </dropdown>
    <dropdown
      v-model="category"
      placeholder="Category"
      :options="product.categories"
      option-label="name"
      option-value="id"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import Dropdown from 'primevue/dropdown';
import {useProductStore} from "../stores/product";

const emits = defineEmits(['changed']);

const props = defineProps({
  sortableColumns: {
    type: Array,
    default: () => ([])
  },
  filtersId: {
    type: String,
    default: ''
  },
  defaultSort: {
    type: Object,
    default: () => ({
      value: '-date_added',
      label: "Newest",
      showDirection: false
    })
  }
})

const product = useProductStore();

const sortBy = ref();
const category = ref();

onMounted(() => {
  sortBy.value = props.defaultSort;
})

const hasSorting = computed(() => true);
const sortOptions = computed(() => {
  return props.sortableColumns;
})

watch(sortBy, (newValue) => {
  product.setFilterKeyValue(sortBy.value.value, 'sortBy', props.filtersId);
  emits('changed', product.getFilters(props.filtersId))
});
watch(category, (newValue) => {
  product.setFilterKeyValue(category.value, 'category', props.filtersId);
  emits('changed', product.getFilters(props.filtersId))
});

</script>

<style>
.advanced-filters{
  display: flex;
  gap: 1rem;
}

@media (max-width: 600px) {
  .advanced-filters{
    flex-direction: column;
  }
  .advanced-filters + * {
    width: 100%;
  }
}
</style>