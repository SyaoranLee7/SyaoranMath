import Layout from "@/layout";

const threeRouter = {
    path: "/three",
    component: Layout,
    redirect: "noRedirect",
    name: "Three",
    meta: {
        title: "Three.js"
    },
    children: [
        {
            path: "Astronomy",
            component: () => import("@/views/three/astronomy/astronomy.vue"),
            name: "Astronomy",
            meta: { title: "天体运动" }
        }
    ]
};

export default threeRouter;
