<template>
  <nav class="navbar">
    <p class="navbar-branding">
      <router-link to="/">
        Whynot
      </router-link>
    </p>
    <form
      :class="[{ 'is-not-open': !showMobile }, 'search-input-wrapper']"
      @submit="onSearch"
    >
      <span class="p-input-icon-right">
        <i class="pi pi-search" />
        <InputText
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="What are you looking for today?"
        />
      </span>
    </form>
    <ul
      class="nav-items"
      :class="{ 'is-not-open': !showMobile }"
    >
      <li class="nav-item">
        <Button
          label="Cart"
          icon="pi pi-shopping-cart"
          class="p-button-text"
          style="color: white"
          :badge="cart.getCartLength.toString()"
          badge-class="p-badge-danger"
          @click="redirect('/cart')"
        />
      </li>
      <li class="nav-item">
        <Button
          label="Favourites"
          icon="pi pi-heart-fill"
          class="p-button-outlined"
          style="color: white"
          :badge="productsStore.favoritesCount.toString()"
          badge-class="p-badge-danger"
          @click="redirect('/favorites')"
        />
      </li>
      <li class="nav-item">
        <SplitButton
          icon="pi pi-user white"
          class="p-button-text white"
          :model="computedItems"
          to="/"
        />
      </li>
    </ul>
    <i
      class="pi pi-bars hamburger"
      @click="toggleMobile"
    />
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "../stores/auth";

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import { useCartStore } from "../stores/cart";
import router from "../router/index";
import { useProductStore } from "../stores/product";


const auth = useAuthStore();
const cart = useCartStore();
const productsStore = useProductStore();

let onClickOutsideEvent;

let showMobile = ref(false);

const toggleMobile = () => {
  showMobile.value = !showMobile.value;
};

const searchQuery = ref("");

const computedItems = computed(() => {
  let items = [
    {
      label: "Settings",
      icon: "pi pi-cog",
      to: "/"
    }
  ];
  if (auth.isAuthenticated && auth.isAdmin) {
    items.push({
      label: "Admin",
      icon: "pi pi-user-edit",
      to: "/admin-panel"
    });
  }
  if (!auth.isAuthenticated) {
    items.push({
      label: "Sign in",
      icon: "pi pi-sign-in",
      to: "/login"
    });
    items.push({
      label: "Register",
      icon: "pi pi-user-plus",
      to: "/sign-up"
    });
  } else {
    items.push({
        label: "My orders",
        icon: "pi pi-check-square",
        to: "/orders"
    });
    items.push({
      label: "Sign out",
      icon: "pi pi-sign-out",
      to: "/sign-out"
    });
  }
  return items;
});

// Programmatic routing
const redirect = (path) => {
  router.push(path);
};

const queryObj = computed(() => {
  return productsStore.getQueryParams(1, searchQuery.value).asObj;
});

const onSearch = (e) => {
  e.preventDefault();
  if (searchQuery.value) {
    router.push({ path: "/search", query: queryObj.value });
  }
  searchQuery.value = "";
};

onMounted(() => {
    onClickOutsideEvent = window.addEventListener('click', (event) => {
        if(!event.target.closest('.navbar')) {
            showMobile.value = false;
        }
    });
})

onBeforeUnmount(() => {
  window.removeEventListener(onClickOutsideEvent);
})

</script>

<style>
.navbar {
  z-index: 30 !important;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  min-width: 100vw;
  background-color: #000;
  height: 60px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.nav-items {
  list-style: none;
  display: flex;
}

.nav-item {
  padding: 0 10px;
}

.navbar-branding {
  font-weight: 600;
  font-size: 24px;
  cursor: pointer;
}

.navbar-branding > a {
  text-decoration: none;
  color: #fff;
}

.white {
  color: white;
}

.hamburger {
  display: none !important;
  padding: 0 10px;
  cursor: pointer;
}

.search-input {
  width: 400px;
}

@media (max-width: 992px) {
  .is-not-open {
    display: none !important;
  }

  .nav-items {
    position: absolute;
    top: 95px;
    left: 0;
    width: 100vw;
    display: flex;
    flex-direction: column;
    background-color: black;
    padding: 0;
    margin: 0;
    justify-content: space-between;
    align-items: center;
  }

  .hamburger {
    display: block !important;
  }

  .search-input {
    width: 300px;
  }

  .search-input-wrapper {
    position: absolute;
    top: 59px;
    left: 0;
    width: 100vw;
    display: flex;
    flex-direction: column;
    background-color: black;
    padding: 0;
    margin: 0;
    justify-content: space-between;
    align-items: center;
  }
}
</style>