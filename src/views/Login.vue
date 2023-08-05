<template>
  <div class="wrapper">
    <div class="text-content">
      <p class="title">
        Whynot
      </p>
      <p class="subtitle">
        I think i asked you why not
      </p>
    </div>
    <form
      class="form-content"
      @submit.prevent="login"
    >
      <InputText
        v-model="email"
        class="input-credentials p-inputtext-lg"
        type="text"
        placeholder="Email"
        name="email"
      />
      <span class="p-input-icon-right">
        <i
          class="pi"
          :class="{
            'pi-eye': showPassword,
            'pi-eye-slash': !showPassword,
          }"
          @click="togglePassType"
        />
        <InputText
          v-model="password"
          :type="passType"
          placeholder="Password"
          class="input-credentials p-inputtext-lg"
        />
      </span>
      <Button
        label="Log in"
        class="p-button-success"
        type="submit"
      />
      <RouterLink
        to="/reset-password"
        class="forgot-password"
      >
        Forgot password?
      </RouterLink>
      <span class="divider" />
      <RouterLink
        class="p-button p-button-primary"
        to="/sign-up"
      >
        Create new account
      </RouterLink>
    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth.js";
import {ref, computed, onMounted} from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {setPageTitle} from "../utils/helpers.js";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

onMounted(() => {
    setPageTitle('Log in');
})

const passType = computed(() => {
  return showPassword.value ? "text" : "password";
});

const togglePassType = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  let success = false;
  let token;
  // TODO: refactor this on backend so it's just one call
  await axios.post("/auth/login", {
    email: email.value, password: password.value
  }).then((res) => {
    console.log(res);
    if(res.data.success){
      success = true;
      auth.setAuthToken(res.data.token);
      token = res.data.token;
    }
  }).catch((err) => console.log(err));

  if(success){
    await axios.get("/auth/me", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if(res.data.success){
        auth.setUserRole(res.data.data);
        router.push({path:'/'})
      }
    }).catch((err) => console.log(err));
  }

}

</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px 30px;
  position: absolute;
  top: calc(50% + 30px);
  left: 50%;
  transform: translate(-50%, -50%);
    width: 100%;
}

.text-content {
  text-align: start;
}
.title {
  font-size: 48px;
  font-weight: 900;
  color: #689f38;
  margin: 0;
}

.subtitle {
  font-size: 36px;
  margin: 0;
}
.form-content {
  display: flex;
  flex-direction: column;
  margin: 0;
  align-items: center;
  padding: 30px;
  border: 1px solid #b4b8c0;
  width: 500px;
  border-radius: 6px;
  background-color: #fff;
}
.input-credentials {
  width: 300px !important;
  margin: 10px 0px;
  border-radius: 6px;
}

.forgot-password {
  text-decoration: none;
  color: #1877f2;
  padding: 10px 0;
}

.divider {
  width: 90%;
  margin: auto;
  border-top: 1px solid #b4b8c0;
  padding-bottom: 10px;
}

@media (max-width: 992px) {
    .wrapper {
        flex-direction: column;
        padding: 0;
    }

    .input-credentials:not(.name .input-credentials), .name, .p-input-icon-right{
        width: 100% !important;
    }
}
@media (max-width: 600px) {
    .form-content {
        padding: 20px;
        width: fit-content;
    }

    .name{
        flex-direction: column;
    }

    .single-line-inputs{
        width: 100% !important;
    }

    .input-credentials{
        min-width: 70vw !important;
    }

    .text-content{
        text-align: center;
    }
}
</style>
