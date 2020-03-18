import MegaMath from "@/utils/MegaMath.js";

const range = 1000; // 取值范围
const standardDeviation = 60; // 数据离散的标准差
const funcs = {
    /**
      * 生成球面数据
      * @param {Number} options.total: 生成总数据个数
      * @returns {Array}: 数据集
      */
    getSphereSurface (options) {
        const radius = 500; // 球面半径
        const r = [];
        for (let i = 0; i < options.total; i++) {
            const Theta = Math.random() * 2 * Math.PI; // θ角度
            const Phi = Math.random() * Math.PI; // φ角度
            const x = radius * Math.sin(Phi) * Math.cos(Theta); // x=R*sinφ*cosθ
            const y = radius * Math.sin(Phi) * Math.sin(Theta); // y=R*sinφ*sinθ
            const z = radius * Math.cos(Phi); // z=R*cosφ
            r.push([x, y, z]);
        }
        return r;
    },

    /**
      * 生成椭球面数据
      * @param {Number} options.total: 生成总数据个数
      * @param {Number} options.ellipsoid.a: 椭球长半轴
      * @param {Number} options.ellipsoid.b: 椭球中半轴
      * @param {Number} options.ellipsoid.c: 椭球短半轴
      * @returns {Array}: 数据集
      */
    getEllipsoidSurface (options) {
        const r = [];
        /* 修正abc */
        const arr = [options.ellipsoid.a, options.ellipsoid.b, options.ellipsoid.c].sort();
        for (let i = 0; i < options.total; i++) {
            /* 方法一似乎由于三角函数非线性, 导致顶点处点过多 */
            // const Theta = Math.random() * Math.PI; // θ角度
            // const Phi = Math.random() * 2 * Math.PI; // φ角度
            // const x = arr[2] * Math.sin(Theta) * Math.cos(Phi); // x=a*sinθ*cosφ
            // const y = arr[1] * Math.sin(Theta) * Math.sin(Phi); // y=b*sinθ*sinφ
            // const z = arr[0] * Math.cos(Theta); // z=R*cosθ

            /* 方法二思路: 先随机生成x&y轴平面, 再计算出z坐标 */
            const x = Math.random() * arr[2] * MegaMath.getPlusOrMinus();
            const y = Math.random() * arr[1] * MegaMath.getPlusOrMinus();
            const xPlane = Math.pow(x, 2) / Math.pow(arr[2], 2);
            const yPlane = Math.pow(y, 2) / Math.pow(arr[1], 2);
            const z = Math.sqrt((1 - xPlane - yPlane) * Math.pow(arr[0], 2));
            r.push([x, y, z * MegaMath.getPlusOrMinus()]);
        }
        return r;
    }
};

export default funcs;
