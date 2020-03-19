import Layout from "@/layout";

const mathRouter = {
    path: "/math",
    component: Layout,
    redirect: "noRedirect",
    name: "Math",
    meta: {
        title: "数学"
    },
    children: [
        {
            path: "NormalDistribution",
            component: () => import("@/views/math/NormalDistribution/NormalDistribution.vue"),
            name: "NormalDistribution",
            meta: { title: "正态分布" }
        },
        {
            path: "MinkowskiDistance",
            component: () => import("@/views/math/MinkowskiDistance/MinkowskiDistance.vue"),
            name: "MinkowskiDistance",
            meta: { title: "闵可夫斯基距离" }
        },
        {
            path: "SpaceGeometry",
            component: () => import("@/views/math/SpaceGeometry/SpaceGeometry.vue"),
            name: "SpaceGeometry",
            meta: { title: "空间几何" }
        },
        {
            path: "QuadraticSurface",
            component: () => import("@/views/math/QuadraticSurface/QuadraticSurface.vue"),
            name: "QuadraticSurface",
            meta: { title: "二次曲面" }
        }
    ]
};

export default mathRouter;
