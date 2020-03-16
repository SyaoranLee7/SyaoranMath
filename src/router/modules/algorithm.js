import Layout from "@/layout";

const algorithmRouter = {
    path: "/algorithm",
    component: Layout,
    redirect: "noRedirect",
    name: "Algorithm",
    meta: {
        title: "算法"
    },
    children: [
        {
            path: "kMeans",
            component: () => import("@/views/algorithm/kmeans/kmeans.vue"),
            name: "kMeans",
            meta: { title: "K-Means算法" }
        },
        {
            path: "kMeans3d",
            component: () => import("@/views/algorithm/kmeans/kmeans3D.vue"),
            name: "kMeans3D",
            meta: { title: "K-Means算法-3D" }
        }
    ]
};

export default algorithmRouter;
