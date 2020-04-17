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
        },
        {
            path: "Maze",
            component: () => import("@/views/three/Maze/Maze.vue"),
            name: "Maze",
            meta: { title: "迷宫" }
        },
        {
            path: "TwoBody",
            component: () => import("@/views/three/Two-Body/Two-Body.vue"),
            name: "TwoBody",
            meta: { title: "二体问题(i)" }
        }
        // {
        //     path: "GameOfLife",
        //     component: () => import("@/views/three/GameOfLife/GameOfLife.vue"),
        //     name: "GameOfLife",
        //     meta: { title: "生命游戏" }
        // }
    ]
};

export default threeRouter;
