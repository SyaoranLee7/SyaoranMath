<template>
    <div id="maze" class="lan-main-three">

        <el-button type="primary" @click="startPath">开始寻路</el-button>

    </div>
</template>

<script>
import * as THREE from "three";
import helper from "./Maze.js";
import Stats from "stats.js";
import { TrackballControls } from "@/assets/js/TrackballControls.js";
import Prim from "@/views/algorithm/Prim/Prim.js";
import AStar from "@/views/algorithm/AStar/AStar.js";

export default {
    name: "Maze",

    data () {
        return {
            scene: "", // 场景
            camera: "", // 相机
            aspect: window.innerWidth / window.innerHeight, // 相机长宽比
            renderer: "", // 渲染器
            controls: "", // 控制器
            stats: "", // 帧率

            maze: [], // 迷宫墙数据
            mazeMap: [], // 迷宫路点集数据
            length: 100, // 迷宫边长
            startPoint: [],
            path: [], // 路径数据
            nextPoint: [], // 寻路的下一个点坐标
            man: "", // 人物
            speed: 1, // 移动速度

            start: false, // 是否开始寻路

            floorTexture: require("@/assets/texture/floor.jpg"),
            manTexture: require("@/assets/texture/man.jpg")
        };
    },

    mounted () {
        this.init();
        this.initThree();
        this.animate();
    },

    methods: {
        init () {
            this.maze = Prim.getMaze(this.length); // 生成迷宫(其中点代表迷宫的墙)
            this.path = AStar.Astar(this.maze, this.length - 2); // 生成路径

            const sPoint = this.maze.find((i, index) => { // 初始化迷宫起点
                return (i[0] === 0 && i[1] !== index);
            });
            this.startPoint = [ sPoint[0], sPoint[1] - 1 ];

            this.nextPoint = helper.getClosePoint(this.startPoint, this.path); // 初始化下一路径点
            this.path.splice(this.path.length - 1, 1); // 按道理来说起点是path数组中的最后一个. 不对再改把
        },

        initThree () {
            /* 场景 */
            const scene = new THREE.Scene();

            /* 相机 */
            const camera = new THREE.PerspectiveCamera(45, this.aspect, 1, 10000);
            camera.position.set(this.length, this.length, 150);
            // camera.up.set(0, 0, 2);
            scene.add(camera);

            this.man = helper.getMan(this.maze, this.length, this.startPoint);

            scene.add( helper.getFloor(this.length) ); // 地板
            scene.add( helper.getMaze(this.maze, this.length) ); // 迷宫
            scene.add( this.man ); // 人物
            scene.add( helper.getAxisHelper() ); // 坐标轴

            /* 渲染器 */
            const container = document.createElement("div");
            document.getElementById("maze").appendChild(container);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            renderer.autoClear = false;

            /* Stats */
            const stats = new Stats();
            container.appendChild(stats.dom );

            /* 添加控制器 */
            const controls = new TrackballControls(camera, renderer.domElement);
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.keys = [65, 83, 68];
            /* 由于控制器更改了相机的lookAt对象, 需要在这里设置相机的lookAt */
            controls.target = new THREE.Vector3(this.length / 2, this.length / 2, 0);

            /* 事件监听 */
            // document.addEventListener( "keydown", this.onKeyDown, false );

            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.stats = stats;
            this.controls = controls;
        },

        animate () {
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.stats.update();
            this.render();
        },

        render () {
            if (this.start) {
                const nowPoint = [this.man.position.x, this.man.position.y]; // 当前人物所在位置
                const nextPoint = this.nextPoint;
                let xDif = nextPoint[0] - nowPoint[0];
                let yDif = nextPoint[1] - nowPoint[1];
                if ( Math.abs(xDif) < 0.001 ) xDif = 0; // 消除x微小误差
                if ( Math.abs(yDif) < 0.001 ) yDif = 0; // 消除y微小误差
                let xStop = false;
                let yStop = false;
                if ( xDif > 0) {
                    this.man.position.x += this.speed * 0.1;
                } else if ( xDif < 0 ){
                    this.man.position.x -= this.speed * 0.1;
                } else xStop = true;
                if ( yDif > 0) {
                    this.man.position.y += this.speed * 0.1;
                } else if ( yDif < 0 ){
                    this.man.position.y -= this.speed * 0.1;
                } else yStop = true;

                /* 到达节点后, 将path中的当前节点删除, 并寻找下一个节点 */
                if ( xStop && yStop ) {
                    const p = [ Number(nowPoint[0].toFixed(2)), Number(nowPoint[1].toFixed(2)) ];
                    this.path.splice(this.path.length - 1, 1); // 当前路径是path数组中的最后一个

                    if (!this.path.length) {
                        this.start = false;
                        console.log("走完了!");
                    } else this.nextPoint = this.path[ this.path.length - 1 ];
                }
            }
            this.renderer.render(this.scene, this.camera);
        },

        startPath () {
            this.start = !this.start;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
