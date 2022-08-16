<template>
  <div class="wrapper">
    <Sidebar></Sidebar>
    <RouterView class="content"></RouterView>
  </div>
</template>

<script setup>
import Sidebar from "../../components/Admin/Sidebar.vue";
</script>

<style scoped>
.wrapper {
  display: flex;
}

.content {
  width: 100% !important;
  padding: 50px;
}
</style>