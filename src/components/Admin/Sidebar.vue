<template>
  <div :class="['sidebar', {'sidebar-minimized': isMinimized}]">
    <MegaMenu
      v-model:expandedKeys="expandedKeys"
      :model="items"
    />
  </div>
</template>

<script setup>
import {ref} from "vue";

import MegaMenu from "primevue/megamenu";

const expandedKeys = ref([]);

const items = ref([
    {
        key: "general",
        label: "General settings",
        icon: "pi pi-fw pi-cog",
        disabled: true,
        items: [
            [
                {
                    label: 'Database',
                    items: [
                        {label: 'Setting 3.1', to: '/'}, {label: 'Setting 3.2'}
                    ]
                }
            ]
        ]
    },
    {
        key: "0",
        label: "Products",
        icon: "pi pi-fw pi-box",
        items: [[
            {
                label: 'Database',
                items: [
                    {label: 'List', to: '/admin-panel/products'}
                ]
            }
        ]]
    },
    {
        key: "1",
        label: "Orders",
        icon: "pi pi-fw pi-pound",
        items: [[
            {
                label: 'Database',
                items: [
                    {label: 'List', to: '/admin-panel/orders'}
                ]
            },
            {
                label: 'Status',
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
        ]]
    },
    {
        key: "3",
        label: "Categories",
        icon: "pi pi-fw pi-folder-open",
        items: [[
            {
                label: 'Database',
                items: [
                    {label: 'List', to: '/admin-panel/categories'}
                ]
            }
        ]]
    },
    {
        label: "Users",
        icon: "pi pi-fw pi-users",
        disabled: true
    }
])

</script>

<style scoped>
.p-panelmenu {
    width: 15rem;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    overflow-x: hidden;
}

.sidebar-minimized .p-panelmenu {
    width: 1rem;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
}

</style>