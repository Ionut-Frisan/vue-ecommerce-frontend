import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/admin-panel",
    name: "Dashboard",
    component: () => import("../views/Admin/Dashboard.vue"),
    children: [
      {
        path: "products",
        component: () => import("../views/Admin/Products.vue"),
      },
    ],
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },{
    path: '/search',
    name: 'Search',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
