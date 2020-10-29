import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueYoutube from "vue-youtube";
import { firestorePlugin } from "vuefire";

Vue.use(firestorePlugin);
Vue.use(VueYoutube);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
