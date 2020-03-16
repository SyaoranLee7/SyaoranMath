import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// Layout
import Layout from "@/layout";

// Modules
import Math from "./modules/math.js";
import Algorithm from "./modules/algorithm.js";

export const constantRoutes = [
    {
        path: "/404",
        component: () => import("@/views/404"),
        hidden: true
    },
    {
        path: "/",
        component: Layout,
        redirect: "/home",
        hidden: true,
        children: [{
            path: "home",
            name: "",
            component: () => import("@/views/home/index"),
            meta: { title: "首页" }
        }]
    },
    {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/index"),
        meta: { title: "首页" }
    },
    Math,
    Algorithm,
    { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
});

const router = createRouter();
export default router;
