<template>
    <div id="maze" class="lan-main-three">

    </div>
</template>

<script>
import * as THREE from "three";
import helper from "./Maze.js";
import Stats from "stats.js";
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

            man: "", // 人物

            floorTexture: require("@/assets/texture/floor.jpg"),
            manTexture: require("@/assets/texture/man.jpg")
        };
    },

    mounted () {
        this.init();
        this.animate();
    },

    methods: {
        init () {
            /* 场景 */
            const scene = new THREE.Scene();

            /* 相机 */
            const camera = new THREE.PerspectiveCamera(45, this.aspect, 1, 10000);
            camera.position.set(0, 0, 1);
            camera.up.set(0, 0, 2);
            camera.lookAt(1, 0, 1);
            scene.add(camera);

            this.man = helper.getMan();

            scene.add( helper.getFloor() ); // 地板
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

            /* 事件监听 */
            document.addEventListener( "keydown", this.onKeyDown, false );

            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.stats = stats;
        },

        animate () {
            requestAnimationFrame(this.animate);
            this.stats.update();
            this.render();
        },

        render () {
            const man = this.man;

            const r = Date.now() * 0.0005;
            man.rotateY(0.01 * Math.sin( r ));

            this.renderer.render(this.scene, this.camera);
        },

        onKeyDown (event) {
            const man = this.man;
            // console.log("onKeyDown:", event);
            switch ( event.keyCode ) {
                case 87: /* 按下w */
                    man.position.x += 0.1;
                    break;
                case 65: /* 按下a */
                    man.position.y += 0.1;
                    break;
                case 68: /* 按下d */
                    man.position.y -= 0.1;
                    break;
                case 83: /* 按下s */
                    man.position.x -= 0.1;
                    break;
                default:
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
