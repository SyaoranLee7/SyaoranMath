<template>
    <div class="lan-main-three">
        <div id="canvas"></div>
        <lan-setting :maxWidth="300">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="初始模式">
                    <el-select v-model="form.mode" placeholder="请选择模式">
                        <el-option
                            v-for="i in modeList"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="clear">初始化</el-button>
            <el-button type="primary" @click="start">开始</el-button>
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

            plane: "", // 地面

            form: {
                mode: "glider"
            },
            modeList: [
                { label: "滑翔机", value: "glider" }
            ]
        };
    },

    computed: {
    },

    mounted () {
        this.init();
        this.animate();
    },

    methods: {
        // 初始化
        clear () {},

        // 开始
        start () {},

        init () {
            /* 场景 */
            const scene = new THREE.Scene();
            this.scene = scene;

            /* 坐标轴辅助 */
            // const axesHelper = new THREE.AxesHelper( 1000 );
            // scene.add( axesHelper );

            /* 相机 */
            const camera = new THREE.PerspectiveCamera( 45, this.aspect, 1, 1000 );
            camera.position.set( 0, -130, 0 ); // 从下往上看
            camera.lookAt( 0, 0, 0 );
            scene.add( camera );
            this.camera = camera;

            /* 物体 */
            const gridHelper = new THREE.GridHelper( 100, 100, "#FFFFFF", 0x808080 );
            scene.add( gridHelper );
            this.life = helper.getInitLife( this.form.mode, 100 ); // 初始细胞
            scene.add( this.life );

            /* 渲染器 */
            const container = document.createElement( "div" );
            document.getElementById( "canvas" ).appendChild( container );
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );
            renderer.autoClear = false;
            this.renderer = renderer;

            /* Stats */
            this.stats = new Stats();
            container.appendChild( this.stats.dom );

            /* 添加控制器 */
            // const controls = new TrackballControls( camera, renderer.domElement );
            // controls.rotateSpeed = 1.0;
            // controls.zoomSpeed = 1.2;
            // controls.panSpeed = 0.8;
            // controls.keys = [ 65, 83, 68 ];
            // /* 由于控制器更改了相机的lookAt对象, 需要在这里设置相机的lookAt */
            // controls.target = new THREE.Vector3( 0.1, 0, 0.1 );
            // this.controls = controls;
        },

        animate () {
            requestAnimationFrame(this.animate);
            // this.controls.update();
            this.stats.update();
            this.render();
        },

        render () {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
