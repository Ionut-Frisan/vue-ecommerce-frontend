<template>
  <div :class="['gallery', customClass]">
    <div class="gallery-displayed-image-container">
      <img
        :src="props.images[activeIndex]"
        crossorigin="anonymous"
        class="gallery-displayed-image"
      >
    </div>
    <div class="gallery-thumbnail-container">
      <span
        :class="['gallery-navigation-button', {disabled: props.images.length === 1}]"
        @click="moveLeft"
      ><i
        class="pi pi-angle-left"
        style="font-size: 2rem"
      /></span>
      <div
        class="gallery-thumbnail-item-container"
        :style="computedThumbnailStyle"
      >
        <div
          v-for="(source, index) in props.images"
          :key="index"
          :class="activeIndex === index ? 'gallery-active-thumbnail-item' : 'gallery-thumbnail-item'"
        >
          <img
            :src="source"
            crossorigin="anonymous"
            style="cursor: pointer;"
            @click="activeIndex = index"
          >
        </div>
      </div>
      <span
        :class="['gallery-navigation-button', {disabled: props.images.length === 1}]"
        @click="moveRight"
      ><i
        class="pi pi-angle-right"
        style="font-size: 2rem"
      /></span>
    </div>
  </div>
</template>
<script setup>
import {computed, defineProps, ref} from "vue";
import {config} from "../../application.config";

const {uploadsUrl} = config;

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  customClass: {
    type: String,
    default: ''
  },
  noImages: Number
})
const activeIndex = ref(0)

const computedThumbnailStyle = computed(() => {
  const len = props.images.length;
  const style = {'justify-content': 'center', transform: 'none'};
  if(len > 5) {
    style['justify-content'] = 'start'
  }
  if(len > 5){
    if(activeIndex.value < 3){
      style['transform'] = 'none';
    }
    else if(len - activeIndex.value > 3){
      style['transform'] = `translateX(-${20 * (activeIndex.value - 1 )}%)`;
    } else style['transform'] = `translateX(-${20 * (len - activeIndex.value)}%)`;
  }
  return style;
})

const moveRight = () => {
  const len = props.images.length;
  if(activeIndex.value < len - 1) activeIndex.value += 1;
  else activeIndex.value = 0
}
const moveLeft = () => {
  const len = props.images.length;
  if(activeIndex.value > 0) activeIndex.value -= 1;
  else activeIndex.value = len - 1
}

</script>
<style>
/*.gallery{*/
/*  width: 300px;*/
/*}*/
.gallery-displayed-image-container{
  width: 100%;
  background-color: #181818;
  display: flex;
  justify-content: center;
  height: 400px;
  padding: 10px;
}

.gallery-displayed-image{
  object-fit: scale-down;
  max-width: 100%;
  max-height: 100%;
}

.gallery-thumbnail-item-container{
  display: flex;
  min-width: calc(100% - 100px);
  flex-flow: row;
  height: 100%;
  justify-content: start;
  transition: transform 0.3s ease 0s;
}

.gallery-thumbnail-item, .gallery-active-thumbnail-item{
  padding: 0 10px;
  width: 20%;
  aspect-ratio: 1;
  min-width: 20%;
  height: 100%;
  user-select: none;
  display: flex;
  justify-content: center;
  align-content: center;
}

.gallery-thumbnail-item img{
  width: 100%;
  max-width: 100px;
  object-fit: cover;
}
.gallery-active-thumbnail-item img{
  width: 100%;
  max-width: 100px;
  object-fit: cover;
}

.gallery-thumbnail-container{
  width: 100%;
  height: 100px;
  display: flex;
  background-color: #181818;
  padding: 10px 0;
  position: relative;
  overflow: hidden;
}

.gallery-navigation-button{
  position: relative;
  height: 100%;
  width: 50px;
  display: block;
  z-index: 10;
  background-color: #181818;
  cursor: pointer;
}

.gallery-navigation-button i{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  padding: 5px;
  color: white;
  font-size: 24px !important;
  display: block !important;
}

.gallery-navigation-button i:hover{
  background-color: #5f6063;
}

.gallery-navigation-button.disabled{
  cursor: default;
}

.gallery-navigation-button.disabled i:hover{
  background-color: #181818;
}

.gallery-navigation-button.disabled i{
  color: grey;
}

.gallery-active-thumbnail-item{
  opacity: 1;
}

.gallery-thumbnail-item{
  opacity: 0.5;
}
</style>