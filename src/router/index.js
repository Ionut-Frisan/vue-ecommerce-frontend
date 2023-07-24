import { createRouter, createWebHistory } from "vue-router";
import {useAuthStore} from "../stores/auth.js";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: { requiresNonAuth: true }
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("../views/SignUp.vue"),
    meta: { requiresNonAuth: true }
  },
  {
    path: "/admin-panel",
    name: "Dashboard",
    component: () => import("../views/Admin/Dashboard.vue"),
    meta: {requiresAuth: true, requiresAdmin: true},
    children: [
      {
        path: "products",
        component: () => import("../views/Admin/Products.vue"),
      },
      {
        path: "categories",
        component: () => import("../views/Admin/Categories.vue"),
      },
      {
        path: "orders",
        component: () => import("../views/Admin/Orders/AdminOrders.vue"),
      },
      {
        path: "config",
        component: () => import("../views/Admin/Config.vue"),
      },
    ],
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },{
    path: '/search',
    name: 'Search',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout/Checkout.vue')
  },
  {
    path: '/product/:slug',
    name: 'Product',
    component: () => import('../views/Product.vue')
  },
  {
    path: '/success',
    name: 'Success',
    component: () => import('../views/Checkout/Success.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue')
  },
  {
    path: '/order/:id',
    name: 'Order',
    component: () => import('../views/Order.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if(to.path.includes('/sign-out')){
    auth.logOut();
    next({path: '/'});
    return;
  }
  if(!!Object.keys(to.meta).length){
    let redirected = false;
    if(to.meta.requiresAdmin && to.meta.requiresAuth && !auth.isAdmin){
      redirected = true;
      if(auth.isAuthenticated){
        next({path: from.path})
      }
      else next({path: '/login'})
    }
    if(to.meta.requiresAuth && !auth.isAuthenticated){
      redirected = true;
      next({path: '/login'});
    }
    if(to.meta.requiresNonAuth && auth.isAuthenticated){
      redirected = true;
      next({path: from.path, query: from.query});
    }
    if(!redirected){
      next();
    }
  }
  else next();
})

export default router;
