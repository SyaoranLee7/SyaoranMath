import Vue from "vue";

import "@/styles/index.scss"; // global css
import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import "echarts-gl"; // Echarts
import logger from "@/utils/logger"; // 替换console

// ElementUI
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Element);

const install = function (VueClass, opts = {}) {
    if (install.installed) return;

    /* methods */
    VueClass.logger = logger;
    VueClass.prototype.$logger = logger;
};
Vue.use(install);

import App from "./App";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    render: h => h(App)
});
