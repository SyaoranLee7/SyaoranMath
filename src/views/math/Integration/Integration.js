import MegaMath from "@/utils/MegaMath.js";
const range = 5; // 取值范围
const inter = 0.01; // 精细度
const infinitesimal = 0.001 // 积分微元

const funcs = {
    /**
     * 计算给定平面方程的定积分
     * @param {String} p: 方程参数
     * @param {Number, String} up: 积分上限
     * @param {Number, String} down: 积分下限
     */
    Integration (p, up, down) {
        const u = Number(up);
        const d = Number(down);
        const c = p.split(",");
        let area = 0;
        for ( let x = d; x <= u; x = x + infinitesimal ) {
            /**
             * 先要解出此时的y值, 再计算差值与微元面积
             * 二元二次方程组为 c[0]X² + c[1]Y² + c[2]X + c[3]Y + c[4]XY + c[5] = 0
             */
            /* 一元二次方程为 QUADRATIC*Y² + SINGLE*Y + CONSTANT = 0 */
            const QUADRATIC = Number(c[1]); // 二次项
            const SINGLE = Number(c[3]) + Number(c[4]) * x; // 一次项
            const CONSTANT = Number(c[0]) * x * x + Number(c[2]) * x + Number(c[5]); // 常数项

            if ( QUADRATIC ) {
                const solution = MegaMath.solveQuadraticEquation(QUADRATIC, SINGLE, CONSTANT);
                const y1 = solution[0];
                const y2 = solution[1];
                area += ( y1 - y2 ) * infinitesimal;
            } else if ( !QUADRATIC && SINGLE ) {
                const y = -1 * CONSTANT / SINGLE;
                area += y * infinitesimal;
            }
        }
        return area;
    },

    /**
     * 根据输入的方程参数, 生成用于echarts渲染的点
     * @param {String} constant: 方程参数
     */
    getEquationData (constant) {
        const c = constant.split(",");
        const arr = [];
        /* 二元二次方程组为 c[0]X² + c[1]Y² + c[2]X + c[3]Y + c[4]XY + c[5] = 0 */
        /* 默认定义域为[-range, range], 取每一点对应的y值 */
        for ( let x = -1 * range; x < range; x = x + inter ) {
            /* 一元二次方程为 QUADRATIC*Y² + SINGLE*Y + CONSTANT = 0 */
            const QUADRATIC = Number(c[1]); // 二次项
            const SINGLE = Number(c[3]) + Number(c[4]) * x; // 一次项
            const CONSTANT = Number(c[0]) * x * x + Number(c[2]) * x + Number(c[5]); // 常数项

            if (QUADRATIC) {
                /* 有二次项和一次项才需要解一元二次方程 */
                const z = MegaMath.solveQuadraticEquation(QUADRATIC, SINGLE, CONSTANT);
                z.forEach(i => {
                    arr.push( [x, i] );
                });
            } else if (!QUADRATIC && SINGLE) {
                /* 没有二次项则是一元一次方程 */
                arr.push( [x, -1 * CONSTANT / SINGLE] );
            } else if (!QUADRATIC && !SINGLE) {
                /* 此时y可以取任何值 */
                for (let y = -1 * range; y <= range; y = y + inter) {
                    arr.push( [x, y] );
                }
            }
        }
        return arr;
    }
};
export default funcs;
