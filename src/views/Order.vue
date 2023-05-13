<template>
  <div>asd</div>
</template>

<script setup>
// TODO: loading/not found/normal state
import {useRoute} from "vue-router";
import {ref, computed, onMounted} from "vue";
import axios from "axios";

const route = useRoute();
const order = ref({});

onMounted(async () => {
    const id = route.params.id;
    const res = await axios.get(`/orders/${id}`);
    order.value = res.data?.data || {};
})

</script>

<style>

</style>