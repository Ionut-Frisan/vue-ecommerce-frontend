import { ref, computed } from 'vue';
import {config} from "../../application.config.js";

export function useProduct(product) {
  const {uploadsUrl} = config;
  const prod = ref({...product});
  const getImageUrl = () => {
    if (Array.isArray(prod.value.images)) {
      if (prod.value.images.length)
        return `${uploadsUrl}/${prod.value.images[0]}`
      return `${uploadsUrl}/no-photo.jpeg`
    }
    return `${uploadsUrl}/${prod.value.images}`
  }

  const getAllImagesUrl = () => {
    if(Array.isArray(prod.value.images)){
      if (prod.value.images.length){
        return prod.value.images.map((img) => `${uploadsUrl}/${img}`)
      }
      return [`${uploadsUrl}/no-photo.jpeg`]
    }
    return `${uploadsUrl}/${prod.value.images}`
  }

  const computedPrice = computed(() => {
    return prod.value.price * (1 - prod.value.discount / 100);
  })

  const priceWholePart = computed(() => {
    return Math.floor(computedPrice.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  })

  const priceFloatPart = computed(() => {
    let value = computedPrice.value - parseInt((priceWholePart.value).replaceAll('.', ''));
    value = Math.round(value * 100).toString();
    return value.length === 2 ? value : value + '0'
  })

  const hasDiscount = computed(() => {
    return prod.value.discount !== 0
  })

  const computedTitle = computed(() => {
    return prod.value.name.charAt(0).toUpperCase() + prod.value.name.slice(1);
  })

  return {getImageUrl, getAllImagesUrl, priceFloatPart, priceWholePart, hasDiscount, computedTitle};
}