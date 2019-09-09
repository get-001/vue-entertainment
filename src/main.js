import Vue from "vue";
import './plugins/axios'
import App from "./App.vue";
import router from "./router";
// import store from "./store";
import './plugin/init.less';
import './plugin/muse-ui.js';
import "bootstrap/dist/css/bootstrap.css";
// material-design-icons-iconfont

Vue.config.productionTip = false;

new Vue({
  router,
  // store,``
  render: h => h(App)
}).$mount("#app");


// Who Is The Spy