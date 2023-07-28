<template>
  <div :class="['product-wrapper', {'no-scroll': isGalleryFS}]" v-if="shouldRender">
    <div class="product-hero">
      <ImageGallery
          :source="imagesUrls"
          custom-class="image-gallery"
          :full-screen="isGalleryFS"
          @closeGallery="isGalleryFS=false"
          @openFSGallery="isGalleryFS=true"
          @keyup.esc.prevent="isGalleryFS=false"
      ></ImageGallery>
      <div class="title-and-stuff">
        <span>
          <h2> {{ computedTitle }}</h2>
          <span v-if="!product?.discount" style="display: block; font-size: 1.3rem; color: #ef2809;"
          >{{ priceWholePart }}<sup>{{ priceFloatPart }}</sup> GBP</span
          >
          <p v-else>
            <span style="font-size: 0.85em"
            ><del>{{ parseFloat(product.price)?.toFixed(2) }} GBP </del></span
            >
            <span style="display: block; font-size: 1.3rem; color: #ef2809;">
              {{ priceWholePart }}<sup>{{ priceFloatPart }}</sup> GBP
            </span>
          </p>
          <br>
          <br>
          <Rating :modelValue="rating" :readonly="true" :cancel="false" class="rating" v-tooltip.bottom="ratingText"/>
        </span>
        <span class="product-action-buttons">
          <Button
              label="Add to cart"
              icon="pi pi-shopping-cart"
              class="p-button-sm"
              @click="addToCart"
          />
          <Button
              :label="favButtonLabel"
              icon="pi pi-heart"
              :class="favButtonClasses"
              @click="toggleFavorite"
          />
        </span>
      </div>
    </div>
    <div class="product-info-panels">
      <Panel header="Description">
        <p> {{ product.description || '-' }}</p>
      </Panel>
      <Panel header="Specifications">
        <div class="product-specifications" v-if="product.specifications">
          <template v-for="(val, key, index) in product.specifications" :key="'spec-'+index">
            <span :class="{'even-row': index % 2 === 1}" style="font-weight: 500">
              {{ key }}
            </span>
            <span :class="{'even-row': index % 2 === 1}">
              {{ val }}
            </span>
          </template>
        </div>
        <span v-else>-</span>
      </Panel>
      <Panel header="Reviews">
        <Button
            label="Add a review"
            icon="pi pi-plus"
            iconPos="left"
            style="margin-bottom: 10px"
            :disabled="!canReview"
            @click="openDialog"
        ></Button>
        <div v-if="reviews.length">
          <div v-for="(review, index) in reviews" :key="review.id || review._id">
            <span class="review-general-info">
              <Rating
                  style="display: inline"
                  v-model="review.rating"
                  :readonly="true"
                  :cancel="false"
              ></Rating>
              &nbsp&nbsp
               <span>
                {{ review.user.firstName + " " + review.user.lastName }}
              </span>
            </span>
            <span>
              <p class="review-title">
                {{ review.title }}
              </p>
              <p class="review-text">
                {{ review.text }}
              </p>
            </span>
            <Divider v-if="index !== reviews.length - 1"></Divider>
          </div>
        </div>
        <p v-else> This product has no reviews </p>
      </Panel>
    </div>
    <Dialog
        header="Add a review"
        v-model:visible="isDialogOpen"
        :modal="true"
    >
      <div class="dialog-content-review">
        <Rating
            v-model="newReview.rating"
            :cancel="false"
        >
        </Rating>
        <span class="field">
          <label for="username2">Title</label>
          <InputText
              v-model="newReview.title"
          >
          </InputText>
        </span>
        <span class="field">
          <label for="username2">Description</label>
          <Textarea
              v-model="newReview.text"
              :autoResize="true"
              rows="10"
          >
        </Textarea>
        </span>
        <div style="padding-top: 10px; width: fit-content; margin: auto;">
          <Button
              label="Submit"
              @click="submitReview"
          ></Button>
        </div>
      </div>
    </Dialog>
  </div>
  <div v-else-if="isLoading"></div>
  <div v-else
       id="no-product"
  >
    <span>
      Product could not be found or something went wrong.
    </span>
  </div>
</template>
<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useProductStore} from "../stores/product.js";
import {useAuthStore} from "../stores/auth.js";
import {useCartStore} from "../stores/cart.js";
import {config} from "../../application.config.js";
import Button from "primevue/button";
import Rating from "primevue/rating";
import Panel from "primevue/panel";
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import {useToast} from "primevue/usetoast";
import axios from "axios";
import Divider from 'primevue/divider';
import ImageGallery from "../components/ImageGallery.vue";

import {getReviewsForProduct} from "../managers/RequestManagers/review.js";
import {addToFavorite, removeFromFavorites} from "../managers/RequestManagers/favorite.js";
import {setPageTitle} from "../utils/helpers.js";

const {uploadsUrl} = config;

const route = useRoute();
const productStore = useProductStore();
const auth = useAuthStore();
const cart = useCartStore();
const toast = useToast();

const product = ref({});
const newReview = ref({});
const reviews = ref([]);
const isGalleryFS = ref(false);
const isDialogOpen = ref(false);
const isLoading = ref(true);

onMounted(async () => {
  const slug = route.params.slug;
  product.value = await productStore.fetchSingleProduct(slug);
  if (!!product.value) reviews.value = await getReviewsForProduct(product.value._id || product.value.id);
  isLoading.value = false;
  setPageTitle(!!product.value ? `${product.value.name}` : `Product`);
});

const shouldRender = computed(() => {
  return !isLoading.value && !!product.value;
})

const imagesUrls = computed(() => {
  if (Array.isArray(product.value.images)) {
    if (product.value.images.length) {
      return product.value.images.map((img) => {
        return {src: `${uploadsUrl}/${img}`};
      });
    }
    return [{src: `${uploadsUrl}/no-photo.jpeg`}];
  }
  return [{src: `${uploadsUrl}/${product.value.images}`}];
});

const computedTitle = computed(() => product.value?.name?.toUpperCase() || "");

const computedPrice = computed(() => {
  return product.value.price * (1 - product.value.discount / 100);
});

const priceWholePart = computed(() => {
  return Math.floor(computedPrice.value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

const priceFloatPart = computed(() => {
  let value =
      computedPrice.value - parseInt(priceWholePart.value.replaceAll(".", ""));
  value = Math.round(value * 100).toString();
  return value.length === 2 ? value : value + "0";
});

const rating = computed(() => {
  return Math.ceil(product?.value.averageRating || 0);
});

const ratingText = computed(() => {
  return product?.value.averageRating ? product?.value.averageRating.toString() : 'No reviews yet'
})

const hasDiscount = computed(() => {
  return product.value.discount !== 0
})

const canReview = computed(() => {
  return !reviews.value.some((review) => review.isMine) && !!auth.authenticated;
})

const favButtonClasses = computed(() => {
  return product.value.favorite ? 'p-button-sm p-button-danger p-button-outlined' : 'p-button-sm p-button-danger '
})

const favButtonLabel = computed(() => {
  return product.value.favorite ? 'Remove from favourites' : 'Add to favourites'
})

const openDialog = () => {
  if (!auth.authenticated) return;
  isDialogOpen.value = true;
}

const submitReview = async () => {
  console.log(auth.isAuthenticated);
  let hasErrors = false;
  if (!newReview.value.rating) {
    toast.add({severity: 'error', detail: 'Please choose a rating.', life: 5000, closable: true});
    hasErrors = true;
  }
  if (newReview.value.title && newReview.value.title.length < 2 || !newReview.value.title) {
    toast.add({severity: 'error', detail: 'Title must be over 2 characters or none.', life: 5000, closable: true});
    hasErrors = true;
  }
  if (newReview.value.text && newReview.value.text.length < 2 || !newReview.value.text) {
    toast.add({
      severity: 'error',
      detail: 'Description must be over 5 characters or none.',
      life: 5000,
      closable: true
    });
    hasErrors = true;
  }
  if (hasErrors) return;
  await axios
      .post(`/reviews`, {
        ...newReview.value,
        product: product.value._id || product.value._id
      })
      .then((res) => {
        reviews.value.push(res.data.data);
        toast.add({severity: 'success', detail: 'Your review has been added.', life: 5000, closable: true});
        isDialogOpen.value = false;
      })
      .catch((err) => {
        if (err.error.includes('Duplicate field value entered:'))
          toast.add({severity: 'error', detail: 'You have already reviewed this product.', life: 5000, closable: true})
        else if (err.error.includes('Not authorized to access this route'))
          toast.add({
            severity: 'error',
            detail: 'You must be logged in to review a product.',
            life: 5000,
            closable: true
          })
        else
          toast.add({severity: 'error', detail: 'Something went wrong.', life: 5000, closable: true})
      });
}

const toggleFavorite = async () => {
  if (!product.value.favorite) {
    const res = await addToFavorite(product.value._id || product.value.id)
    if (res.success) {
      productStore.favoritesCount += 1;
      product.value.favorite = true;
    }
  } else {
    const res = await removeFromFavorites(product.value._id || product.value.id)
    if (res.success) {
      productStore.favoritesCount -= 1;
      product.value.favorite = false;
    }
  }
}

const addToCart = () => {
  cart.addToCart({quantity: 1, product: product.value});
}

</script>
<style>

#no-product {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1877f2;
  max-width: 50%;
  margin: auto;
  text-align: center;
  display: flex;
  height: 90vh;
  align-items: center;
}

.p-dialog {
  width: 40%;
}

.dialog-content-review {
  padding: 20px;
  min-width: 250px;
  width: 100%;
}

.dialog-content-review input, textarea {
  width: 100%;
}

.field * {
  display: block;
}

.product-wrapper {
  width: 80%;
  margin: 5% auto 0 auto;
}

.product-hero {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 1rem;
  height: 500px;
  border: 1px solid #dee2e6;
  border-radius: 3px;
}

.title-and-stuff {
  width: 40%;
  padding: 0 1em;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-action-buttons * {
  margin: 0.5em;
}

.product-action-buttons {
  display: flex;
  margin: 0 auto;
}

.product-specifications {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.product-specifications > span {
  padding: 5px;
}

.even-row {
  background-color: #f2f2f7;
}

.review-title {
  font-size: 1.2em;
  font-weight: 450;
  margin: 0;
}

.review-text {
  padding: 0 10px;
}

.product-info-panels > * {
  padding-top: 10px;
}

.product-info-panels > *:last-child {
  padding-bottom: 200px;
}

@media (max-width: 1380px) {
  .product-action-buttons {
    flex-direction: column;
    margin: 0;
  }

  .product-action-buttons > * {
    width: 100%;
  }
}

@media (max-width: 992px) {
  .title-and-stuff {
    width: 50%;
  }
}

@media (max-width: 600px) {
  .product-wrapper {
    width: 95%;
  }

  .product-hero {
    flex-direction: column;
    height: fit-content;
    max-width: unset;
  }

  .title-and-stuff {
    width: 100%;
  }

  .image-gallery {
    width: 100%;
  }

  .product-action-buttons {
    padding-top: 2rem;
  }
}

</style>
