import MegaMath from "@/utils/MegaMath.js";

const funcs = {
    getDataSets (range, inter, params) {
        /* 基本思路如下 */
        /* 先在x轴原点两侧选取以interval为单位, total一半为数量的截平面, 即确定x的值 */
        /* 同理确定y轴截平面, 即确定y值 */
        /* 最后通过解二元一次方程确定z的值 */
        const r = Number(range);
        const interval = Number(inter);
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

                if (QUADRATIC) {
                    /* 有二次项和一次项才需要解一元二次方程 */
                    const z = MegaMath.solveQuadraticEquation(QUADRATIC, SINGLE, CONSTANT);
                    z.forEach(i => {
                        res.push([x, y, i]);
                    });
                } else if (!QUADRATIC && SINGLE) {
                    /* 没有二次项则是一元一次方程 */
                    res.push([x, y, -1 * CONSTANT / SINGLE]);
                } else if (!QUADRATIC && !SINGLE && A11 + A22 + A12 + A1 + A2 + A4 === 0) {
                    /* 此时z可以取任何值, 但需要验证x与y能否满足给定方程 */
                    for (let z = -1 * r; z <= r; z = z + interval) {
                        res.push([x, y, z]);
                    }
                }

                // console.log("==========================");
                // console.log("x:", x);
                // console.log("y:", y);
                // console.log("一元二次方程:", QUADRATIC + "z²+" + SINGLE + "z+" + CONSTANT + "=0");
            }
        }
        return res;
    }
};

export default funcs;
