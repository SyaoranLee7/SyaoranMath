<template>
    <div id="astronomy" class="lan-main-three">

    </div>
</template>

<script>
import * as THREE from "three";
import { TrackballControls } from "@/assets/js/TrackballControls.js";
import Stats from "stats.js";
export default {
    name: "Astronomy",

    data () {
        return {
            scene: "",

            meshEarth: "",
            meshMoon: "",

            cameraPerspective: "",

            renderer: "",

            controls: "",

            stats: "",

            aspect: window.innerWidth / window.innerHeight,
            frustumSize: 600,

            earth: require("@/assets/texture/earth.jpg"),
            moon: require("@/assets/texture/moon.jpg")
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
            this.scene = scene;

            /* 坐标轴辅助一下 */
            const axesHelper = new THREE.AxesHelper(1000);
            // scene.add(axesHelper);

            /* 相机 */
            const cameraPerspective = new THREE.PerspectiveCamera(50, this.aspect, 1, 10000);
            cameraPerspective.position.x = 1000;
            cameraPerspective.position.y = 1000;
            cameraPerspective.position.z = 1000;
            scene.add(cameraPerspective);
            this.cameraPerspective = cameraPerspective;

            /* 添加地球 */
            const textureEarth = new THREE.TextureLoader().load(this.earth); // 地球纹理
            const materialEarth = new THREE.MeshBasicMaterial({ map : textureEarth });
            const meshEarth = new THREE.Mesh(
                new THREE.SphereBufferGeometry(200, 64, 64),
                materialEarth
            );
            meshEarth.lookAt(-1284, 400, 0); // 倾斜地球达到黄赤交角23.26°
            scene.add(meshEarth);
            this.meshEarth = meshEarth;
            /* 添加月球 */
            const textureMoon = new THREE.TextureLoader().load(this.moon); // 月球纹理
            const materialMoon = new THREE.MeshBasicMaterial({ map : textureMoon });
            const meshMoon = new THREE.Mesh(
                new THREE.SphereBufferGeometry(50, 64, 64),
                materialMoon
            );
            meshMoon.position.z = 2000;
            scene.add(meshMoon);
            this.meshMoon = meshMoon;

            /* 图形 -> 星空点 */
            const geometry = new THREE.BufferGeometry();
            const vertices = [];
            for (let i = 0; i < 10000; i ++) {
                vertices.push(THREE.Math.randFloatSpread(3000)); // x
                vertices.push(THREE.Math.randFloatSpread(3000)); // y
                vertices.push(THREE.Math.randFloatSpread(3000)); // z
            }
            geometry.setAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) );
            const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
            scene.add(particles);

            /* 渲染器 */
            const container = document.createElement("div");
            document.getElementById("astronomy").appendChild(container);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            renderer.autoClear = false;

            this.renderer = renderer;

            /* Stats */
            this.stats = new Stats();
            container.appendChild(this.stats.dom );

            /* 添加控制器 */
            const controls = new TrackballControls(this.cameraPerspective, renderer.domElement);
            controls.rotateSpeed = 1.0;
            controls.zoomSpeed = 1.2;
            controls.panSpeed = 0.8;
            controls.keys = [65, 83, 68];
            this.controls = controls;

            /* 监听 */
            // window.addEventListener( "resize", this.onWindowResize, false );
        },

        animate () {
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.stats.update();
            this.render();
        },

        render () {
            const meshEarth = this.meshEarth;
            const meshMoon = this.meshMoon;
            const r = Date.now() * 0.00005;

            meshEarth.rotateY(0.01 * Math.sin( r ));
            meshMoon.rotation.y -= 0.0001;
            meshMoon.position.x = 1000 * Math.cos( r );
            meshMoon.position.z = 1000 * Math.sin( r );

            this.renderer.clear();
            this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
            this.renderer.render(this.scene, this.cameraPerspective);
        },

        onWindowResize () {
            const SCREEN_WIDTH = window.innerWidth;
            const SCREEN_HEIGHT = window.innerHeight;
            const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

            this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

            this.cameraPerspective.aspect = 0.5 * aspect;
            this.cameraPerspective.updateProjectionMatrix();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
