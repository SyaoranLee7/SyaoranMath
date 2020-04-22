import * as THREE from "three";
import MegaMath from "@/utils/MegaMath.js";

const radius = 0.5; // 质点半径

const funcs = {
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
    },

    /**
     * 计算两个质点中心的位置
     * @param {Array} l: 质点的坐标
     * @param {Number} m: 质点的质量
     */
    getCentroidPosition ( locationA, massA, locationB, massB ) {
        const x = ( massA * Number( locationA[0] ) + massB * Number( locationB[0] )) / ( massA + massB );
        const y = ( massA * Number( locationA[1] ) + massB * Number( locationB[1] )) / ( massA + massB );
        const centroid = new THREE.Mesh(
            new THREE.SphereBufferGeometry( radius / 2, 32, 32 ),
            new THREE.MeshBasicMaterial({ color : "#FF0000" })
        );
        centroid.position.set(  x, 0, y );
        return centroid;
    },

    /**
     * 计算两个质点中心的速度矢量
     * @param {Array} l: 两质点的速度矢量
     * @param {Number} m: 两质点的质量
     */
    getCentroidSpeed ( speedA, massA, speedB, massB ) {
        const speedX = ( speedA[0] * massA + speedB[0] * massB ) / ( massA + massB );
        const speedY = ( speedA[1] * massA + speedB[1] * massB ) / ( massA + massB );
        return [ speedX, speedY ];
    },

    /**
     * 计算两个质点的距离矢量
     * @param {String} l: 两质点的速度矢量
     */
    getDistance ( la, lb ) {
        const distance = MegaMath.getEuclideanDistance( la, lb );
        const direction = MegaMath.VectorOperation( lb, la, "-" );
        const vectorModule = Math.sqrt( Math.pow( direction[0], 2) + Math.pow( direction[1], 2 ) );
        return [ direction[0] / vectorModule * distance, direction[1] / vectorModule * distance ];
    },

    /**
     * 计算两个星球(质点)的万有引力
     * @param {Number} mass: 星球的质量
     * @param {Array} distance: 星球质心间的距离矢量*10^8m
     */
    getGravitation ( massA, massB, distance ) {
        const g = 6.754 * Math.pow( 10, -11 );
        const r = Math.sqrt( Math.pow( distance[0], 2) + Math.pow( distance[1], 2 ) ) * Math.pow( 10, 8 );
        const f = g * massA * massB / Math.pow( r, 2 );
        return f;
    },

    /**
     * 计算星球(质点)匀速圆周运动的线速度
     * @param {Number} mass: 星球的质量
     * @param {Array} radius: 圆周运动的半径矢量
     * @param {Number} force: 向心力大小
     */
    getLinearVelocity ( mass, radius, force ) {
        debugger;
        const r = Math.sqrt( Math.pow( radius[0], 2) + Math.pow( radius[1], 2 ) ); // 半径大小
        const v = Math.sqrt( force * r * Math.pow( 10, 8 ) / mass ); // 线速度大小
        return v;
    },

    /**
     * 计算星球(质点)下一时刻的位置
     * @param {Array} la: 质点A的坐标[ x, y ]
     * @param {Array} lc: 质点C的坐标[ x, y ], C静止
     * @param {Number} f: 两点间万有引力大小
     * @param {Number} m: 质点A的质量
     * @param {Array} v: 质点A的速度矢量
     * @param {Number} time: 经过时间(一般极短)
     * @return {Array}: 返回质点A下一时刻的位置[ x, y ]
     */
    getPosition ( la, lc, f, m, v, time ) {
        const locationA = [ Number( la.split(",")[0] ), Number( la.split(",")[1] ) ];

        const r = MegaMath.getEuclideanDistance( la, lc ) * Math.pow( 10, 8 ); // 星球圆周运动的半径
        const a = f / m; // 向心力
        const ax = a * this.getResolve( MegaMath.VectorOperation( la, lc, "-" ), "x" ); // 向心力水平分量
        const ay = a * this.getResolve( MegaMath.VectorOperation( la, lc, "-" ), "y" ); // 向心力竖直分量
        const vx = this.getResolve( v, "x" ); // 速度水平分量
        const vy = this.getResolve( v, "y" ); // 速度竖直分量
        const sx = vx * time + 1 / 2 * ax * time * time + locationA[0]; // 水平方向位移
        const sy = vy * time + 1 / 2 * ay * time * time + locationA[1]; // 竖直方向位移
        return [ sx, sy ];
    },

    /**
     * 计算星球(质点)下一时刻的速度
     * @param {Array} la: 质点A的坐标[ x, y ]
     * @param {Array} lc: 质点C的坐标[ x, y ], C静止
     * @param {Number} f: 两点间万有引力大小
     * @param {Number} m: 质点A的质量
     * @param {Array} v: 质点A的速度矢量
     * @param {Number} time: 经过时间(一般极短)
     * @return {Array}: 返回质点A下一时刻的位置[ x, y ]
     */
    getVelocity ( la, lc,f, m, v, t ) {
        const a = f / m; // 向心力
        const ax = a * this.getResolve( MegaMath.VectorOperation( la, lc, "-" ), "x" ); // 向心力水平分量
        const ay = a * this.getResolve( MegaMath.VectorOperation( la, lc, "-" ), "y" ); // 向心力竖直分量
        const vx = this.getResolve( v, "x" ); // 速度水平分量
        const vy = this.getResolve( v, "y" ); // 速度竖直分量
        const velocityX = vx + ax * time;
        const velocityY = vy + ay * time;
    },

    /* 获取一个向量在x或y上的分量大小 */
    getResolve ( v, di = "x" ) {
        const x = v[0];
        const y = v[1];
        if ( di === "x" ) {
            return x / Math.sqrt( x * x + y * y );
        } else if ( di === "y" ) {
            return y / Math.sqrt( x * x + y * y );
        }
    }
};
export default funcs;
