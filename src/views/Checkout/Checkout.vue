<template>
  <div class="checkout-wrapper">
    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label for="firstName">First name</label>
        <InputText
          id="firstName"
          v-model="model.firstName"
          required
        />
      </div>
      <div class="field">
        <label for="lastName">Last name</label>
        <InputText
          id="lastName"
          v-model="model.lastName"
          required
        />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="model.email"
          required
        />
      </div>
      <div class="field">
        <label for="phone">Phone</label>
        <InputText
          id="phone"
          v-model="model.phone_number"
          required
          type="tel"
        />
      </div>
      <div class="field">
        <label for="county">County</label>
        <InputText
          id="county"
          v-model="model.county"
          required
        />
      </div>
      <div class="field">
        <label for="city">City</label>
        <InputText
          id="city"
          v-model="model.city"
          required
        />
      </div>
      <div class="field">
        <label for="address">Address</label>
        <InputText
          id="address"
          v-model="model.address"
          required
        />
      </div>
      <div class="field">
        <label for="zip">Zip code</label>
        <InputText
          id="zip"
          v-model="model.zip"
          required
        />
      </div>
      <div class="field">
        <label for="payment_type">Payment type</label>
        <span>
          <Checkbox
            id="payment_type"
            v-model="card"
            value="card"
            :binary="true"
            :disabled="true"
          />
          <label
            style="padding-left: 5px"
            for="payment_type"
          >Card</label>
        </span>
      </div>
      <Button
        label="Continue to payment page"
        icon="pi pi-credit-card"
        type="submit"
      />
    </form>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';

import InputText from "primevue/inputtext";
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import axios from "axios";
import {useToast} from "primevue/usetoast";
import {useCartStore} from "../../stores/cart";
import {setPageTitle} from "../../utils/helpers";

const toast = useToast();
const store = useCartStore()
const card = ref(true);

const products = ref(store.getCartItems);

const model = ref({
  firstName: "",
  lastName: "",
  country: "England",
  city: "",
  address: "",
  zip: "",
  email: "",
  payment_type: 'card'
});

onMounted(() => {
    setPageTitle('Checkout');
})

const handleSubmit = async () => {
  if (!Array.isArray(products.value) || !products.value.length) {
    toast.add({severity:'error', detail:'Please add products to cart before', life: 5000});
  }
  await axios.post('orders', {
    details: model.value,
    products: products.value
  })
      .then((res) => {
        if (res.data.success) {
          const { url } = res.data.data;
          if (typeof url === "string" && url.startsWith('https://checkout.stripe.com')) {
            // store.clearCart();
            localStorage.setItem('last_session_id', res.data.data.sessionId);
            window.location = url;
          }
        }
      })
      .catch((err) => {
        toast.add({severity:'error', detail:'There was an error, please try again.', life: 5000});
      })
}
</script>
<style scoped>
.checkout-wrapper{
  width: 60%;
  height: fit-content;
  background-color: white;
  padding: 30px 50px;
  margin: 100px auto;
}

.field > *{
  display: block;
}

.field{
  padding-bottom: 10px;
}

.p-inputtext{
  width: 100%;
}

.p-button{
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>