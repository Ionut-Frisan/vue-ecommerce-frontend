<template>
  <div class="product-wrapper">
    <div class="product-hero">
      <Galleria
          :value="imagesUrls"
          :num-visible="5"
          :show-indicators="true"
          :show-thumbnails="false"
          :show-indicators-on-item="true"
          :circular="true"
          container-style="width: 50%;"
      >
        <template #item="slotProps">
          <div class="card-top">
            <div class="badges-offer-right">
              <span class="badge discount-badge" v-if="hasDiscount">-{{ product.discount }}%</span>
            </div>
            <img
                :src="slotProps.item.src"
                :alt="product.title"
                crossorigin="anonymous"
                style="object-fit: contain; max-width: 100%; max-height: 100%"
            />
          </div>
        </template>
      </Galleria>
      <div class="title-and-stuff">
        <span>
          <h3>{{ computedTitle }}</h3>
          <span v-if="!product?.discount"
          >{{ priceWholePart }}<sup>{{ priceFloatPart }}</sup> GBP</span
          >
          <p v-else>
            <span style="font-size: 0.85em"
            ><del>{{ parseFloat(product.price)?.toFixed(2) }} GBP </del></span
            >
            <span style="display: block"
            >new price: {{
                priceWholePart
              }}<sup>{{ priceFloatPart }}</sup> GBP</span
            >
          </p>
        </span>
        <span class="product-action-buttons">
          <Button
              label="Add to cart"
              icon="pi pi-shopping-cart"
              class="p-button-md"
          />
          <Button
              label="Add to favourites"
              icon="pi pi-heart"
              class="p-button-md"
          />
        </span>
        <!-- TODO: move this to a separate ratings section <rating model-value="rating" :readonly="true"></rating> -->
      </div>
    </div>
    <div class="product-info-panels">
      <Panel header="Description">
        <p> {{product.description || '-'}}</p>
      </Panel>
      <Panel header="Specifications">
        <div class="product-specifications" v-if="product.specifications">
          <template v-for="(val, key, index) in product.specifications" :key="'spec-'+index">
            <span :class="{'even-row': index % 2 === 1}" style="font-weight: 500">
              {{key}}
            </span>
            <span :class="{'even-row': index % 2 === 1}">
              {{val}}
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
          :disabled="!auth.authenticated"
          @click="openDialog"
        ></Button>
        <div v-if="reviews.length">
          <div v-for="review in reviews" :key="review.id || review._id">
            <span class="review-general-info">
              <Rating
                  style="display: inline"
                  v-model="review.rating"
                  :readonly="true"
                  :cancel="false"
              ></Rating>
              &nbsp&nbsp
               <span>
                {{review.user.firstName + " " + review.user.lastName}}
              </span>
            </span>
            <span>
              <p class="review-title">
                {{review.title}}
              </p>
              <p class="review-text">
                {{review.text}}
              </p>
            </span>
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
</template>
<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useProductStore} from "../stores/product.js";
import {useAuthStore} from "../stores/auth.js";
import Galleria from "primevue/galleria";
import Button from "primevue/button";
import Rating from "primevue/rating";
import Panel from "primevue/panel";
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import {useToast} from "primevue/usetoast";
import axios from "axios";

const route = useRoute();
const productStore = useProductStore();
const auth = useAuthStore();
const toast = useToast();

const product = ref({});
const newReview = ref({});
const reviews = ref([
  {
    title: "test for review",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus ut faucibus pulvinar elementum integer enim neque volutpat ac. Euismod nisi porta lorem mollis aliquam ut porttitor. Ac feugiat sed lectus vestibulum mattis ullamcorper. Pulvinar elementum integer enim neque. Mauris pellentesque pulvinar pellentesque habitant morbi tristique. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Vitae proin sagittis nisl rhoncus mattis rhoncus urna. Morbi tincidunt ornare massa eget egestas. Amet est placerat in egestas erat imperdiet.\n" +
        "\n" +
        "In dictum non consectetur a erat nam at lectus. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Mattis enim ut tellus elementum sagittis vitae et leo. Dolor sit amet consectetur adipiscing. Placerat vestibulum lectus mauris ultrices eros.",
    rating: 4,
    createAt: "2022-11-23T16:42:17.040+00:00",
    user: {
      firstName: "Ionut",
      lastName: "Frisan"
    }
  }
]);
const isGalleryFS = ref(false);
const isDialogOpen = ref(false);

onMounted(async () => {
  const slug = route.params.slug;
  product.value = await productStore.fetchSingleProduct(slug);
});

const imagesUrls = computed(() => {
  if (Array.isArray(product.value.images)) {
    if (product.value.images.length) {
      return product.value.images.map((img) => {
        return {src: `http://localhost:5000/uploads/${img}`};
      });
    }
    return [{src: `http://localhost:5000/uploads/no-photo.jpeg`}];
  }
  return [{src: `http://localhost:5000/uploads/${product.value.images}`}];
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
  return Math.round(product?.averageRating || 0);
});

const hasDiscount = computed(() => {
  return product.value.discount !== 0
})

const openDialog = () => {
  if(!auth.authenticated) return;
  isDialogOpen.value = true;
}

const submitReview = async () => {
  let hasErrors = false;
  if(!newReview.value.rating) {
    toast.add({severity: 'error', detail: 'Please choose a rating.', life: 5000, closable: true});
    hasErrors = true;
  }
  if(newReview.value.title && newReview.value.title.length < 2){
    toast.add({severity: 'error', detail: 'Title must be over 2 characters or none.', life: 5000, closable: true});
    hasErrors = true;
  }
  if(newReview.value.text && newReview.value.text.length < 2){
    toast.add({severity: 'error', detail: 'Description must be over 5 characters or none.', life: 5000, closable: true});
    hasErrors = true;
  }
  if(hasErrors) return;
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
        if(err.error.includes('Duplicate field value entered:'))
          toast.add({severity: 'error', detail: 'You have already reviewed this product.', life: 5000, closable: true})
        else
          toast.add({severity: 'error', detail: 'Something went wrong.', life: 5000, closable: true})
      });
}

</script>
<style>
.p-dialog{
  width: 40%;
}

.dialog-content-review{
  padding: 20px;
  min-width: 250px;
  width: 100%;
}

.dialog-content-review input, textarea{
  width: 100%;
}

.field * {
  display: block;
}

.product-wrapper {
  width: 70%;
  margin: 10% auto 0 auto;
}

.product-hero {
  display: flex;
  flex-direction: row;
}

.title-and-stuff {
  width: 50%;
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

.product-specifications > span{
  padding: 5px;
}

.even-row{
  background-color: #f2f2f7;
}

.review-title{
  font-size: 1.2em;
  font-weight: 450;
  margin: 0;
}

.review-text{
  padding: 0 10px;
}

.product-info-panels > *{
  padding-top: 10px;
}

.product-info-panels > *:last-child{
  padding-bottom: 200px;
}

</style>
