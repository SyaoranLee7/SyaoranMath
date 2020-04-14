import * as THREE from "three";

const radius = 0.5; // 质点半径

const funcs = {
    /**
     * 根据参数生成质点
     * @param {String} l: 质点的坐标
     */
    getPointObject (l) {
        const location = l.split(",");
        const point = new THREE.Mesh(
            new THREE.SphereBufferGeometry( radius, 32, 32 ),
            new THREE.MeshBasicMaterial({ color : "#FFFFFF" })
        );
        point.position.set( location[0], location[1], location[2] );
        return point;
    }
};
export default funcs;
