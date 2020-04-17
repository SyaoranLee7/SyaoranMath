import Layout from "@/layout";

const applicationRouter = {
    path: "/application",
    component: Layout,
    redirect: "noRedirect",
    name: "Application",
    meta: {
        title: "应用"
    },
    children: [
        {
            path: "GameOfLife",
            component: () => import("@/views/application/GameOfLife/GameOfLife.vue"),
            name: "GameOfLife",
            meta: { title: "生命游戏" }
        }
    ]
};

export default applicationRouter;
