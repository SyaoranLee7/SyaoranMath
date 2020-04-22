import * as THREE from "three";
import MegaMath from "@/utils/MegaMath.js";

const color = "#B0B0B0";
const boxLength = 20;

const funcs = {
    /**
     * 生成cube阵
     */
    getCube ( center ) {
        const group = new THREE.Geometry();

        /* 空间主体 */
        const box = new THREE.Mesh(
            new THREE.BoxGeometry( boxLength, boxLength, boxLength ),
            new THREE.MeshBasicMaterial({ color })
        );
        box.position.set( center.x, center.y, center.z );
        box.updateMatrix();
        group.merge(box.geometry, box.matrix);

        /* 六面通道 */
        const pipe1 = this.getPipe(); // 上方
        pipe1.position.set()
        const pipe = new THREE.Mesh(
            new THREE.CylinderGeometry( 2, 2, 4, 32 ),
            new THREE.MeshBasicMaterial({ color })
        );
        pipe.position.set( 0, 0, 2 );
        pipe.rotateX( Math.PI / 2 );

        pipe.updateMatrix();
        group.merge(pipe.geometry, pipe.matrix);
        const geometry = new THREE.Mesh(
            group,
            new THREE.MeshBasicMaterial({ color })
        );
        return geometry;
    },

    getPipe () {
        const pipe = new THREE.Mesh(
            new THREE.CylinderGeometry( 2, 2, 4, 32 ),
            new THREE.MeshBasicMaterial({ color })
        );
        return pipe;
    },

    /**
     * 生成每个cube阵的一个面
     */
    getWall () {
        const group = new THREE.Geometry();
        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry( 10, 10 ),
            new THREE.MeshBasicMaterial({ color })
        );
        const pipe = new THREE.Mesh(
            new THREE.CylinderGeometry( 2, 2, 4, 32 ),
            new THREE.MeshBasicMaterial({ color })
        );
        wall.position.set( 0, 0, 0 );
        pipe.position.set( 0, 0, 2 );
        pipe.rotateX( Math.PI / 2 );
        wall.updateMatrix();
        pipe.updateMatrix();
        group.merge(wall.geometry, wall.matrix);
        group.merge(pipe.geometry, pipe.matrix);
        const geometry = new THREE.Mesh(
            group,
            new THREE.MeshBasicMaterial({ color })
        );
        return geometry;
    },

    /**
     * 根据参数生成质点
     * @param {String} l: 质点的坐标
     */
    getPointObjectPosition ( l ) {
        const location = l.split(",");
        const point = new THREE.Mesh(
            new THREE.SphereBufferGeometry( radius, 32, 32 ),
            new THREE.MeshBasicMaterial({ color : "#FFFFFF" })
        );
        point.position.set( location[0], 0, location[1] );
        return point;
    }
};
export default funcs;
