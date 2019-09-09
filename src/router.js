import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  // mode: "history",
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/identity",
      name: "identity",
      component: () => import("./views/Identity")
    },
    {
      path: "/startGame",
      name: "startGame",
      component: () => import("./views/StartGame")
    }
  ]
});
