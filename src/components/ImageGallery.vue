<template>
  <div :class="classes">
    <div class="displayed-image">
      <img
        :src="selected.src"
        alt="yoyo"
        crossorigin="anonymous"
        @click="emits('openFSGallery')"
      >
    </div>
    <div
      v-if="!fullScreen"
      class="image-selector"
    >
      <span
        v-for="(val, index) in source"
        :key="'selector' + index"
        :class="{'selected-image': selectedIndex === index}"
        @click="selectedIndex = index"
      />
    </div>
    <div
      v-else
    >
      <span
        class="thumbnail-container"
      >
        <img
          v-for="(val, index) in source"
          :key="'selector' + index"
          class="image-thumbnail"
          :src="val.src"
          crossorigin="anonymous"
          @click="selectedIndex = index"
        >
      </span>
    </div>
    <span
      v-if="fullScreen"
      class="close-button"
    >
      <Button
        icon="pi pi-times"
        class="p-button-rounded p-button-danger p-button-outlined"
        @click="emits('closeGallery')"
      />
    </span>
  </div>
</template>
<script setup>
import {computed, ref} from 'vue';
import {config} from "../../application.config.js";
import Button from "primevue/button";

const { uploadsUrl } = config;
const emits = defineEmits(['closeGallery'])

const props = defineProps({
  source: {
    type: Array,
    default: () => []
  },
  customClass: String,
  fullScreen: {
    type: Boolean,
    default: false
  },
  startIndex: {
    type: Number,
    default: 0
  }
})

const selectedIndex = ref(props.startIndex);

const selected = computed(() => {
  if (!props.source) return {src: `${uploadsUrl}/no-photo.jpeg`};
  return props.source[selectedIndex.value] || props.source[0];
})

const classes = computed(() => {
  let cls = 'gallery ';
  if (props.customClass) cls += props.customClass + ' ';
  if (props.fullScreen) cls += 'gallery-fullscreen'
  return cls;
})

</script>

<style>
.image-selector span{
  display: block;
  width: 20px;
  height: 5px;
  border-radius: 5px;
  background-color: grey;
  cursor: pointer;
}

.selected-image{
  background-color: black !important;
}

.image-selector{
  display: flex;
  column-gap: 5px;
  justify-content: center;
  align-items: center;
}

.gallery > *{
  padding: calc(20px/3);
}

.gallery {
  border-radius: 3px;
}

.displayed-image{
  display: flex;
  justify-content: center;
  align-items: center;
}

.displayed-image img:hover{
  cursor: pointer;
}

.gallery-fullscreen{
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99 !important;
  padding: 60px 5% 60px 5%;
  background-color: #fff;
  border-radius: 0 !important;
}

.gallery-fullscreen > * {
  background-color: #fff;
}

.gallery-fullscreen .displayed-image{
  height: 85%;
  display: flex;
  justify-content: center;
}

.gallery-fullscreen img{
  object-fit: contain;
}

.thumbnail-container{
  height: 10%;
  display: flex;
  flex-direction: row;
  width: 80%;
  column-gap: 1%;
  justify-content: center;
  margin-left: 10%;
}

.image-thumbnail{
  width: 10%;
  display: inline;
  border: 1px solid rgba(0,0,0,0.1);
  padding: 1px;
}

.image-thumbnail:hover{
  cursor: pointer;
}

.close-button{
  position: fixed;
  top: 20px;
  right:20px;
}

@media (min-width: 992px) {
  /*TODO  */
}
</style>