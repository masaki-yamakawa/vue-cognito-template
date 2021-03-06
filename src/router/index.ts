import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ConfirmationCode from "../views/ConfirmationCode.vue";
import Home from "../views/Home.vue";
import Signin from "../views/Signin.vue";
import Signup from "../views/Signup.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/confcode",
    name: "ConfirmationCode",
    component: ConfirmationCode,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
