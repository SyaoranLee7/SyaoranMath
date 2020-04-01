import * as THREE from "three";
import AStar from "@/views/algorithm/AStar/AStar.js";
import Prim from "@/views/algorithm/Prim/Prim.js";
import MegaMath from "@/utils/MegaMath.js";

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
        // const PlaneFloor = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry( length, length, 0 ),
        //     new THREE.MeshBasicMaterial({ map : floorTexture })
        // );
        const PlaneFloor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( length, length, 0 ),
            new THREE.MeshBasicMaterial({ color : "#C0C0C0" })
        );
        PlaneFloor.position.set(length / 2, length / 2, 0);
        return PlaneFloor;
    },

    /**
     * 生成迷宫, 地面为xy平面
     * @param {Array} maze: 迷宫数据
     */
    getMaze (maze) {
        const group = new THREE.Geometry();
        maze.forEach(i => {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry( 1, 1, 3 ),
                new THREE.MeshBasicMaterial({ color: "#500000" })
            );
            box.position.set(i[0], i[1], 0);
            box.updateMatrix();
            group.merge(box.geometry, box.matrix);
        });
        const geometry = new THREE.Mesh(
            group,
            new THREE.MeshBasicMaterial({ color: "#500000" })
        );
        return geometry;
    },

    /**
     * 生成人物(一个球)
     * @param {Array} maze: 迷宫数据
     * @param {Number} length: 迷宫边长
     * @param {Array} start: 迷宫起点
     */
    getMan (maze, length, start) {
        const manTexture = new THREE.TextureLoader().load(TextureMan);
        // const man = new THREE.Mesh(
        //     new THREE.SphereBufferGeometry( 0.5, 32, 32 ),
        //     new THREE.MeshBasicMaterial({ map : manTexture })
        // );
        const man = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 0.4, 32, 32 ),
            new THREE.MeshBasicMaterial({ color : "#FF0000" })
        );
        man.position.set(start[0], start[1], 0.5); // 设置人物在迷宫起点处
        // man.rotateX(Math.PI / 2);
        return man;
    },


    /**
     * 找到列表中离已知点最近的点
     * @param {Array} point: 二维坐标点
     * @param {Array} path: 路径数组
     */
    getClosePoint (point, path) {
        const arr = [];
        const a = point[0] + "," + point[1];
        let b;
        const res = path.find(i => {
            b = i[0] + "," + i[1];
            const dis = MegaMath.getMinkowskiDistance(a, b, 1);
            return dis === 1;
        });
        return res;
    }
};
export default funcs;
