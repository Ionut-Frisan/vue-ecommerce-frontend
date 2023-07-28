<template>
  <div class="wrapper">
    <Sidebar />
    <RouterView class="content" />
  </div>
</template>

<script setup>
import Sidebar from "../../components/Admin/Sidebar.vue";
import {onMounted} from "vue";
import {setAdminPageTitle} from "../../utils/helpers.js";

onMounted(() => setAdminPageTitle('Admin'));
</script>

<style scoped>
.wrapper {
  display: flex;
}

.content {
  width: 100% !important;
  padding: 50px;
  background-color: #fff;
  min-height: calc(100vh - 60px);
}
</style>