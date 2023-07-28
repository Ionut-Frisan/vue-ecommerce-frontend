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
      @submit.prevent="onSubmit"
    >
      <div class="name">
        <InputText
          v-model="data.fname"
          :class="[{ 'input-error': errors?.fname?.length },'input-credentials', 'p-inputtext-lg', 'single-line-inputs']"
          type="text"
          placeholder="First name"
          name="fname"
          @blur="validateSingleField('fname')"
        />
        <InputText
          v-model="data.lname"
          :class="[{ 'input-error': errors?.lname?.length },'input-credentials', 'p-inputtext-lg', 'single-line-inputs']"
          type="text"
          placeholder="Last name"
          name="lname"
          @blur="validateSingleField('lname')"
        />
      </div>
      <ul class="errors">
        <li
          v-for="err in errors?.fname?.concat(errors?.lname)"
          class="error-message"
        >
          {{ err }}
        </li>
      </ul>
      <InputText
        v-model="data.email"
        :class="[{ 'input-error': errors?.email?.length },'input-credentials', 'p-inputtext-lg']"
        type="text"
        placeholder="Email"
        name="email"
        @blur="validateSingleField('email')"
      />
      <ul class="errors">
        <li
          v-for="err in errors?.email"
          class="error-message"
        >
          {{ err.charAt(0).toUpperCase() + err.slice(1) }}
        </li>
      </ul>
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
          v-model="data.password"
          :type="passType"
          placeholder="Password"
          :class="[{ 'input-error': errors?.password?.length },'input-credentials', 'p-inputtext-lg']"
          @blur="validateSingleField('password')"
        />
      </span>
      <ul class="errors">
        <li
          v-for="err in errors?.password"
          class="error-message"
        >
          {{ err.charAt(0).toUpperCase() + err.slice(1) }}
        </li>
      </ul>
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
          v-model="data.repeatPassword"
          :type="passType"
          placeholder="Confirm password"
          :class="[{ 'input-error': errors?.repeatPassword?.length },'input-credentials', 'p-inputtext-lg']"
          @blur="validateSingleField('repeatPassword')"
        />
      </span>
      <ul class="errors">
        <li
          v-for="err in errors?.repeatPassword"
          class="error-message"
        >
          {{ err.charAt(0).toUpperCase() + err.slice(1) }}
        </li>
      </ul>
      <!--      <p v-if="responseErrors.length">-->
      <!--        <Message-->
      <!--            v-for="(err, index) in responseErrors"-->
      <!--            :key="err+index"-->
      <!--            severity="error">-->
      <!--          {{ err }}-->
      <!--        </Message>-->
      <!--      </p>-->
      <Button
        label="Sign up"
        class="p-button-success pb-10"
        type="submit"
      />
      <span class="divider" />
      <RouterLink
        to="/reset-password"
        class="forgot-password"
      >
        Already have an account? Log in
      </RouterLink>
    </form>
  </div>
</template>

<script setup>
import {useAuthStore} from "../stores/auth.js";
import {ref, computed, onMounted} from "vue";
import {useRouter} from 'vue-router';
import {useToast} from "primevue/usetoast";
import axios from "axios";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from 'primevue/message';

import validateObject from '../validations/GenericValidations.js';
import {setPageTitle} from "../utils/helpers.js";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const showPassword = ref(false);
const errors = ref([]);

const data = ref({
  email: '',
  password: '',
  repeatPassword: '',
  fname: '',
  lname: ''
})


const rules = {
  email: ['isEmail', 'required'],
  password: ['required', 'showAs:Password'],
  repeatPassword: ['required', 'showAs:Password'],
  fname: ['required', 'minLength:3', 'showAs:First name'],
  lname: ['required', 'minLength:3', 'showAs:Last name']
}

const responseErrors = ref([]);

onMounted(() => {
    setPageTitle('Create new account');
})

const validateSingleField = (field) => {
  const rule = {};
  const val = {}
  rule[field] = rules[field];
  val[field] = data.value[field];

  const err = validateObject(val, rule)
  errors.value = {...errors.value, ...err};
}

const validateAll = () => {
  errors.value = validateObject(data.value, rules);
}

const hasErrors = computed(() => {
  let count = 0;
  for (const [key, error] of Object.entries(errors.value)) {
    if (error.length) count += 1
  }
  return count > 1
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
    email: data.value.email, password: data.value.password
  }).then((res) => {
    console.log(res);
    if (res.data.success) {
      success = true;
      auth.setAuthToken(res.data.token);
      token = res.data.token;
    }
  }).catch((err) => console.log(err));

  if (success) {
    await axios.get("/auth/me", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.data.success) {
        auth.setUserRole(res.data.data);
        router.push({name: 'Dashboard', path: '/admin-panel'})
      }
    }).catch((err) => console.log(err));
  }
}

const onSubmit = async () => {
  let success = false;
  let token;
  await axios.post('/auth/register', {
    email: data.value.email,
    password: data.value.password,
    firstName: data.value.fname,
    lastName: data.value.lname
  }).then((res) => {
    if (res.data.success) {
      success = true;
      auth.setAuthToken(res.data.token);
      token = res.data.token;
    }
  }).catch((err) => {
    responseErrors.value = (err.error.split('\n')).splice(0, err.error.split('\n').length - 1);
    responseErrors.value.forEach((error) =>{
      toast.add({severity: 'error', summary: error, life: 20000})
    })
  });

  if (success) {
    await axios.get("/auth/me", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      if (res.data.success) {
        auth.setUserRole(res.data.data);
        router.push({path: '/'})
        toast.add({severity: 'success', summary: 'Your account has ben created', life: 5000})
      }
    }).catch((err) => {
      toast.add({severity: 'error', summary: err.error, life: 10000})
    });
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
  text-align: left;
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

.name {
  width: 300px !important;
  display: flex;
  justify-content: space-between;
}

.single-line-inputs {
  width: 48% !important;
}

.input-error, input-error:hover, input-error:enabled:hover {
  border: 1px solid red !important;
}

.error-message {
  color: red;
  padding: 0;
  margin: 0 0 0 0;
}

.errors {
  padding: 0 20px;
  margin: 0 0 0 0;
  text-align: left;
  width: 100%;
  list-style: none;
  font-size: 12px;
}

.pb-10 {
  margin-bottom: 10px;
}

</style>
