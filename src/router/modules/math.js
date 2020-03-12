import Layout from "@/layout";

const mathRouter = {
    path: "/math",
    component: Layout,
    redirect: "noRedirect",
    name: "Math",
    meta: {
        title: "Math"
    },
    children: [
        {
            path: "normalDistribution",
            component: () => import("@/views/math/NormalDistribution.vue"),
            name: "NormalDistribution",
            meta: { title: "正态分布" }
        },
        {
            path: "binomialDistribution",
            component: () => import("@/views/math/BinomialDistribution.vue"),
            name: "BinomialDistribution",
            meta: { title: "二项分布" }
        }
    ]
};

export default mathRouter;
