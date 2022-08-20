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
    children: [
      {
        path: "products",
        component: () => import("../views/Admin/Products.vue"),
      },
    ],
    meta: {requiresAuth: true, requiresAdmin: true}
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
