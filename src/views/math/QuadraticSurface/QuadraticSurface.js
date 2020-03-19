import MegaMath from "@/utils/MegaMath.js";

const interval = 1; // 截平面间隔
const funcs = {
    getDataSets (range, params) {
        /* 基本思路如下 */
        /* 先在x轴原点两侧选取以interval为单位, total一半为数量的截平面, 即确定x的值 */
        /* 同理确定y轴截平面, 即确定y值 */
        /* 最后通过解二元一次方程确定z的值 */
        const r = Number(range);
        const res = [];
        const a = params.split(",");

        for (let x = -1 * r; x <= r; x = x + interval) {
            for (let y = -1 * r; y <= r; y = y + interval) {
                /* 二次曲面方程为 a11x^2+a22y^2+a33z^2+a12xy+a23yz+a13xz+a1x+a2y+a3z+a4=0 */
                /* A33项为未知数 */
                const A11 = Number(a[0]) * Math.pow(x, 2);
                const A22 = Number(a[1]) * Math.pow(y, 2);
                const A12 = Number(a[3]) * x * y;
                const A1 = Number(a[6]) * x;
                const A2 = Number(a[7]) * y;
                const A4 = Number(a[9]);

                /* 一元二次方程组为 a[2]z^2 + (a[4]y + a[5]x + a[8])z + (A11+A22+A12+A1+A2+A4) = 0 */
                const QUADRATIC = Number(a[2]); // 二次项
                const SINGLE = (Number(a[4]) * y) + (Number(a[5]) * x) + Number(a[8]); // 一次项
                const CONSTANT = A11 + A22 + A12 + A1 + A2 + A4; // 常数项
                const z = MegaMath.solveQuadraticEquation(QUADRATIC, SINGLE, CONSTANT);
                z.forEach(i => {
                    res.push([x, y, i]);
                });
            }
        }
        return res;
    }
};

export default funcs;
