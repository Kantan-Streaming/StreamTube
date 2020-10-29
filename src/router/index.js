import Vue from "vue";
import VueRouter from "vue-router";
import Main from "@/views/Main";
import Settings from "@/views/Settings";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings
  }
];

const router = new VueRouter({
  routes
});

export default router;
