<template>
  <div class="blank-page">
      <h2>{{messageComputed}}</h2>
  </div>
</template>

<script setup>
import {computed} from "vue";

const props= defineProps({
    statusCode: {
        type: String,
        default: "404"
    },
    message: {
        type: String,
        default: "Not Found"
    }
});

const messageComputed = computed(() => props.statusCode ? `${props.statusCode} | ${props.message}` : props.message);

</script>

<style>
.blank-page {
    color: #b4b8c0;
    width: 100%;
    height: calc(100vh - 100px);
    text-align: center;
    position: relative;
}

.blank-page h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

</style>