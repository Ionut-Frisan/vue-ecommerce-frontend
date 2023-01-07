<template>
  <div class="sidebar">
    <PanelMenu
      v-model:expandedKeys="expandedKeys"
      :model="items"
      @contextmenu="onSidebarRightClick"
    />
    <ContextMenu
      ref="menu"
      :model="contextMenuItems"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ContextMenu from "primevue/contextmenu";

const expandedKeys = ref([]);
const menu = ref();

const onSidebarRightClick = (event) => {
  menu.value.show(event);
};

const contextMenuItems = ref([
  {
    key: "0",
    label: "Collapse all",
    icon: "pi pi-fw pi-angle-double-up",
    command: () => collapseAll()
  },
  {
    key: "1",
    label: "Expand all",
    icon: "pi pi-fw pi-angle-double-down",
    command: () => expandAll()
  }
]);

const items = ref([
  {
    key: "general",
    label: "General settings",
    icon: "pi pi-fw pi-cog",
    items: [
      {
        key: "general_0",
        label: "Configuration",
        icon: "pi pi-fw pi-file",
        to: "/admin-panel/config"
      }
    ]
  },
  {
    key: "0",
    label: "Products",
    icon: "pi pi-fw pi-box",
    items: [
      {
        key: "0_0",
        label: "Database",
        icon: "pi pi-fw pi-database",
        to: "/admin-panel/products"
      },
      {
        key: "0_2",
        label: "Add",
        icon: "pi pi-fw pi-plus"
      }
    ]
  },
  {
    key: "1",
    label: "Orders",
    icon: "pi pi-fw pi-pound",
    items: [
      {
        key: "1_0",
        label: "All",
        icon: "pi pi-fw pi-list"
      },
      {
        key: "1_1",
        label: "Status",
        icon: "pi pi-fw pi-users",
        items: [
          {
            key: "1_1_0",
            label: "In progress",
            icon: "pi pi-spin pi-spinner"
          },
          {
            key: "2_2_1",
            icon: "pi pi-fw pi-check",
            label: "Completed"
          },
          {
            key: "2_2_2",
            icon: "pi pi-fw pi-question",
            label: "Payment not processed"
          },
          {
            key: "2_2_2",
            icon: "pi pi-fw pi-times",
            label: "Cancelled"
          }
        ]
      }
    ]
  },
  {
    key: "2",
    label: "Users",
    icon: "pi pi-fw pi-user",
    items: [
      {
        key: "2_0",
        label: "New",
        icon: "pi pi-fw pi-user-plus"
      },
      {
        key: "2_1",
        label: "Delete",
        icon: "pi pi-fw pi-user-minus"
      },
      {
        key: "2_2",
        label: "Search",
        icon: "pi pi-fw pi-users",
        items: [
          {
            key: "2_2_0",
            label: "Filter",
            icon: "pi pi-fw pi-filter",
            items: [
              {
                key: "2_2_0_0",
                label: "Print",
                icon: "pi pi-fw pi-print"
              }
            ]
          },
          {
            key: "2_2_1",
            icon: "pi pi-fw pi-bars",
            label: "List"
          }
        ]
      }
    ]
  },
  {
    key: "3",
    label: "Categories",
    icon: "pi pi-fw pi-folder-open",
    items: [
      {
        key: "3_0",
        label: "Database",
        icon: "pi pi-fw pi-database",
        to: "/admin-panel/categories"
      },
      {
        key: "3_1",
        label: "Add",
        icon: "pi pi-fw pi-plus"
      }
    ]
  },
  {
    key: "3",
    label: "Categories",
    icon: "pi pi-fw pi-folder-open",
    items: [
      {
        key: "3_0",
        label: "Database",
        icon: "pi pi-fw pi-database"
      },
      {
        key: "3_1",
        label: "Add",
        icon: "pi pi-fw pi-plus"
      }
    ]
  }
]);

const expandAll = () => {
  let intermediate = {};
  for (let item of items.value) {
    intermediate[item.key] = true;
  }
  expandedKeys.value = { ...intermediate };
};
const collapseAll = () => {
  expandedKeys.value = {};
};
</script>

<style scoped>
.p-panelmenu {
  width: 15rem;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>