<template>
    <div class="lan-main-three">
        <div id="canvas"></div>
        <lan-setting :maxWidth="300">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="质点A的质量kg">
                    <el-input v-model="form.massA"></el-input>
                </el-form-item>
                <el-form-item label="质点A的坐标">
                    <el-input v-model="form.locA"></el-input>
                </el-form-item>
                <el-form-item label="质点A的速度">
                    <el-input v-model="form.speedA"></el-input>
                </el-form-item>
                <el-form-item label="质点B的质量kg">
                    <el-input v-model="form.massB"></el-input>
                </el-form-item>
                <el-form-item label="质点B的坐标">
                    <el-input v-model="form.locB"></el-input>
                </el-form-item>
                <el-form-item label="质点B的速度">
                    <el-input v-model="form.speedB"></el-input>
                </el-form-item>
                <el-form-item label="运动速度值">
                    <el-input v-model="form.speed"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="btnClick">{{ btnText }}</el-button>
        </lan-setting>
    </div>
</template>

<script>
import * as THREE from "three";
import { TrackballControls } from "@/assets/js/TrackballControls.js";
import Stats from "stats.js";
import helper from "./helper.js";

import LanSetting from "@/components/lan-setting";
export default {
    name: "Astronomy",

    components: {
        LanSetting
    },

    data () {
        return {
            scene: "", // 场景
            camera: "", // 相机
            renderer: "", // 渲染器
            stats: "", // 性能器
            controls: "", // 控制器
            aspect: window.innerWidth / window.innerHeight,

            form: {
                massA: 10, // 质点A的质量
                locA: "30,30,30", // 质点A的三维坐标
                speedA: 10, // 质点A的速率
                massB: 5, // 质点A的质量
                locB: "-30,-30,40", // 质点A的三维坐标
                speedB: 5, // 质点B的速率
                speed: 1 // 速度基准值
            },
            pA: "", // 质点A
            pB: "", // 质点B

            status: "stop" // 当前动画状态
        };
    },

    computed: {
        btnText () {
            return this.status === "start" ? "停止" : "开始";
        }
    },

    mounted () {
        this.init();
        this.animate();
    },

    methods: {
        init () {
            /* 场景 */
            const scene = new THREE.Scene();
            this.scene = scene;

            /* 坐标轴辅助 */
            const axesHelper = new THREE.AxesHelper( 1000 );
            scene.add( axesHelper );

            /* 相机 */
            const camera = new THREE.PerspectiveCamera( 45, this.aspect, 1, 1000 );
            camera.position.x = 100;
            camera.position.y = 100;
            camera.position.z = 100;
            scene.add( camera );
            this.camera = camera;

            /* 根据参数生成质点A和质点B */
            this.pA = helper.getPointObject( this.form.locA );
            this.pB = helper.getPointObject( this.form.locB );
            scene.add( this.pA );
            scene.add( this.pB );

            /* 渲染器 */
            const container = document.createElement("div");
            document.getElementById("canvas").appendChild(container);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            this.renderer = renderer;

            /* Stats */
            this.stats = new Stats();
            container.appendChild(this.stats.dom );

            /* 添加控制器 */
            const controls = new TrackballControls(camera, renderer.domElement);
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.keys = [65, 83, 68];
            this.controls = controls;
        },

        animate () {
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.stats.update();
            this.render();
        },

        render () {
            if ( this.status === "stop" ) return;

            const pA = this.pA;
            const pB = this.pB;

            this.renderer.render(this.scene, this.camera);
        },

        // 点击开始、停止按钮
        btnClick () {
            this.status = this.status === "start" ? "stop" : "start";
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
