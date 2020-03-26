import * as THREE from "three";
const TextureFloor = require("@/assets/texture/floor.jpg");
const TextureMan = require("@/assets/texture/man.jpg");

const funcs = {
    /**
     * 生成坐标辅助线
     * @param {Number} length: 坐标轴长度
     */
    getAxisHelper (length = 5) {
        const axesHelper = new THREE.AxesHelper(length);
        return axesHelper;
    },

    /**
     * 生成地面, 地面为xy平面, 以原点为中心, 长宽为length
     * @param {Number} length: 平面边长
     */
    getFloor (length = 100) {
        const floorTexture = new THREE.TextureLoader().load(TextureFloor);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(10, 10);
        const PlaneFloor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( length, length, 0 ),
            new THREE.MeshBasicMaterial({ map : floorTexture })
        );
        return PlaneFloor;
    },

    /**
     * 生成人物(一个球)
     */
    getMan () {
        const manTexture = new THREE.TextureLoader().load(TextureMan);
        const man = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 0.5, 32, 32 ),
            new THREE.MeshBasicMaterial({ map : manTexture })
        );
        man.position.set(3, 0, 0.5);
        man.rotateX(Math.PI / 2);
        return man;
    }
};
export default funcs;
