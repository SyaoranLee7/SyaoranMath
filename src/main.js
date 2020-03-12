import Vue from "vue";

// ElementUI
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Element);

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    render: h => h(App)
});
