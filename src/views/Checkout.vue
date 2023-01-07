<template>
  <div class="checkout-wrapper">
    <form>
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
        <label for="country">Country</label>
        <InputText
          id="country"
          v-model="model.country"
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
import {ref} from 'vue';

import InputText from "primevue/inputtext";
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const card = ref(true);

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