<template>
    <div class="lan-main-three">
        <div id="canvas"></div>
        <lan-setting :maxWidth="300">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="质点A的质量kg">
                    <el-input v-model="form.massA">
                        <template slot="append">x10^24kg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="质点A的坐标">
                    <el-input v-model="form.locA"></el-input>
                </el-form-item>
                <el-form-item label="质点A的速度向量">
                    <el-input v-model="form.speedA"></el-input>
                </el-form-item>
                <el-form-item label="质点B的质量kg">
                    <el-input v-model="form.massB">
                        <template slot="append">x10^24kg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="质点B的坐标">
                    <el-input v-model="form.locB"></el-input>
                </el-form-item>
                <el-form-item label="质点B的速度向量">
                    <el-input v-model="form.speedB"></el-input>
                </el-form-item>
                <el-form-item label="运动速度值">
                    <el-input v-model="form.speed"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="start">开始</el-button>
        </lan-setting>
    </div>
</template>

<script>
import * as THREE from "three";
import { TrackballControls } from "@/assets/js/TrackballControls.js";
import Stats from "stats.js";
import helper from "./helper.js";
import MegaMath from "@/utils/MegaMath.js";

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
            startAnimation: false,

            form: {
                massA: 20, // 质点A的质量 * 10^24
                locA: "-5, 5", // 质点A的坐标
                speedA: "-1, -1", // 质点A的初速度向量
                massB: 20, // 质点B的质量 * 10^24
                locB: "5, 5", // 质点B的坐标
                speedB: "1, 1", // 质点B的初速度向量
                speed: 3 // 速度基准值
            },
            pA: "", // 质点A
            speedA: [ 0, 0 ], // A的速度向量
            pB: "", // 质点B
            speedB: [ 0, 0 ], // B的速度向量
            centroid: "", // 质心
            speenC: [ 0, 0 ] // 质心的速度向量
        };
    },

    computed: {
    },

    mounted () {
        this.init();
        this.animate();
    },

    methods: {
        start () {
            if ( !this.startAnimation ) {
                this.$logger.log("start");

                /* 生成质心并计算其速度 */
                const pA = this.form.locA.split(",");
                const pB = this.form.locB.split(",");
                this.centroid = helper.getCentroidPosition(
                    [ Number( pA[0] ), Number( pA[1] ) ],
                    Number(this.form.massA),
                    [ Number( pB[0] ), Number( pB[1] ) ],
                    Number(this.form.massB) );
                const sA = this.form.speedA.split(",");
                const sB = this.form.speedB.split(",");
                this.speedA = [ Number( sA[0] ), Number( sA[1] ) ];
                this.speedB = [ Number( sB[0] ), Number( sB[1] ) ];
                this.speedC = helper.getCentroidSpeed( this.speedA, this.form.massA, this.speedB, this.form.massB );
                this.scene.add( this.centroid );
            }
            this.startAnimation = !this.startAnimation;

            this.$logger.log( "speedC:", this.speedC );
        },

        init () {
            /* 场景 */
            const scene = new THREE.Scene();
            this.scene = scene;

            /* 网格辅助 */
            const gridHelper = new THREE.GridHelper( 100, 100, "#C0C0C0", "#303030" );
            scene.add( gridHelper );

            /* 相机 */
            const camera = new THREE.PerspectiveCamera( 45, this.aspect, 1, 1000 );
            camera.position.x = 0;
            camera.position.y = -120;
            camera.position.z = 0;
            camera.lookAt( 0, 0, 0 );
            scene.add( camera );
            this.camera = camera;

            /* 根据参数生成质点A、质点B、系统质心 */
            this.pA = helper.getPointObjectPosition( this.form.locA );
            this.pB = helper.getPointObjectPosition( this.form.locB );
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
            // const controls = new TrackballControls(camera, renderer.domElement);
            // controls.rotateSpeed = 1.0;
            // controls.zoomSpeed = 1.2;
            // controls.panSpeed = 0.8;
            // controls.keys = [65, 83, 68];
            // this.controls = controls;
        },

        animate () {
            requestAnimationFrame(this.animate);
            // this.controls.update();
            this.stats.update();
            this.render();
        },

        render () {
            if ( this.startAnimation ) {
                const time = Number( this.form.speed ) * 0.01; // 时间
                const a = this.pA; // 星球质点A
                const b = this.pB; // 星球质心B
                const c = this.centroid; // 系统质心C
                const la = a.position.x + "," + a.position.z; // 星球质点A的坐标
                const lb = b.position.x + "," + b.position.z; // 星球质点B的坐标
                const lc = c.position.x + "," + c.position.z; // 系统质心C的坐标
                this.$logger.log("la. lb. lc:", la, lb, lc);

                /* 更新质点A的速度、位置 */
                const distanceAB = MegaMath.VectorOperation( la, lb, "-" ); // A与B的距离矢量
                const distanceAC = MegaMath.getEuclideanDistance( la, lc ); // A与C的距离
                const forceA = helper.getGravitation(
                    Number( this.form.massA ) * Math.pow( 10, 24 ),
                    Number( this.form.massB ) * Math.pow( 10, 24 ),
                    distanceAB
                ); // A受到的万有引力大小
                const locationA = helper.getPosition(
                    la,
                    lc,
                    forceA,
                    Number( this.form.massA ) * Math.pow( 10, 24 ),
                    this.speedA,
                    time
                ); // 获取下一时刻星球A的位置
                this.speedA = helper.getVelocity(
                    la,
                    forceA,
                    Number( this.form.massA ) * Math.pow( 10, 24 ),
                    this.speedA,
                    time
                ); // 获取下一时刻星球A的速度矢量
                a.position.x = locationA[0];
                a.position.y = locationA[1];

                /* 更新质心坐标 */
                const centroidX = c.x + this.speedC[0] * speed;
                const centroidZ = c.z + this.speedC[1] * speed;
                c.position.x += centroidX;
                c.position.z += centroidZ;

                // this.$logger.log("centroid:", centroid);
            }
            this.renderer.render( this.scene, this.camera );
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
