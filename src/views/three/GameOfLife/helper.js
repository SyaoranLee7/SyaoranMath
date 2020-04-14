import * as THREE from "three";
const defaultY = -1;
const defaultX = 0;
const defaultZ = 0;

const funcs = {
    /**
     * 根据生成模式, 初始化细胞
     * @param {String} mode: 初始模式, 默认为"滑翔机"
     */
    getInitLife ( mode = "glider", length = 100 ) {
        const cellPlane = new THREE.PlaneGeometry( 0.9, 0.9 ); // 细胞模块
        const cellMaterial = new THREE.MeshBasicMaterial({ color : "#00FF00" }); // 细胞材质
        const c = [];
        const g = new THREE.Group();
        switch ( mode ) {
            case "glider":
                for ( let i = 0; i < 6; i++ ) {
                    const cell = new THREE.Mesh( cellPlane, cellMaterial  );
                    c.push( cell );
                }
                c[0].position.set( defaultX + 1, defaultY, defaultZ ); // 正上方
                c[1].position.set( defaultX, defaultY, defaultZ + 1 ); // 正右方
                c[2].position.set( defaultX - 1, defaultY, defaultZ + 1 ); // 右下方
                c[3].position.set( defaultX - 1, defaultY, defaultZ ); // 正下方
                c[4].position.set( defaultX - 1, defaultY, defaultZ - 1 ); // 左下方
                c[0].rotateX( Math.PI / 2 );
                c[1].rotateX( Math.PI / 2 );
                c[2].rotateX( Math.PI / 2 );
                c[3].rotateX( Math.PI / 2 );
                c[4].rotateX( Math.PI / 2 );
                g.add( c[0] );
                g.add( c[1] );
                g.add( c[2] );
                g.add( c[3] );
                g.add( c[4] );
                break;
            default:
        }
        return g;
    }
};
export default funcs;
