import { ref, computed } from 'vue';
import {config} from "../../application.config.js";
import {getImageUrl as getImageUrlFromProduct } from "../utils/helpers.js";

export function useProduct(product) {
  const {uploadsUrl} = config;
  const prod = ref({...product});
  const getImageUrl = () => getImageUrlFromProduct(prod);

  const getAllImagesUrl = () => getImageUrlFromProduct(prod)

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