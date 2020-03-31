export default {
    /**
     * 产生正负数1或者-1
     */
    getPlusOrMinus () {
        const num = Math.random() - 0.5;
        return num < 0 ? -1 : 1;
    },

    /** 产生随机整数
     * @param {Number} range: 产生随机数的范围
     */
    getRandomInt (range) {
        const num = Math.random() * range;
        return Number(num.toFixed(0));
    },

    /**
     * 解一元二次方程
     * @param {Number} q: 二次项
     * @param {Number} s: 一次项
     * @param {Number} c: 常数项
     * @returns {Array}: 解(可能为空也可能有两个解)
     */
    solveQuadraticEquation (q, s, c) {
        const beta = Math.pow(s, 2) - 4 * q * c;
        if (beta < 0) {
            /* 无实根 */
            return [];
        } else if (beta === 0) {
            /* 两相等根 */
            return [s / 2 / q * -1];
        } else {
            return [
                (-1 * s + Math.sqrt(beta)) / 2 / q,
                (-1 * s - Math.sqrt(beta)) / 2 / q
            ];
        }
    },

    /**
     * 产生服从正态分布的随机数
     * @param {Number} mean: 数学期望
     * @param {Number} standardDeviation: 标准差
     * @returns {Number}: 返回一个服从正态分布的随机数
     */
    getNormalDistribution (mean, standardDeviation) {
        const u = Number(mean);
        const o = Number(standardDeviation);

        /* Box-Muller变换 */
        // 产生在(0, 1]内两个均匀分布的随机数
        const u1 = Math.random();
        const u2 = Math.random();

        const R = Math.sqrt(-2 * Math.log(u1));
        const angle = 2 * Math.PI * u2;

        const z1 = R * Math.sin(angle);

        const x = u + (z1 * o);
        return Number(x.toFixed(4));
    },

    /**
     * 计算欧里几得距离
     * @param {String} pointA: A点坐标 -> 1,1,1,1,1 (五维)
     * @param {String} pointB: B点坐标 -> 2,2,2,2,2 (五维)
     * @return {Number} 返回两点的欧氏距离(直线距离)
     */
    getEuclideanDistance (pointA, pointB) {
        const a = pointA.split(",");
        const b = pointB.split(",");

        let result = 0;
        a.forEach((item, index) => {
            const dis = Math.pow(Number(a[index]) - Number(b[index]), 2);
            result = result + dis;
        });
        result = Math.sqrt(result);

        return result;
    },

    /**
     * 计算闵可夫斯基距离集合
     * @param {String} a: A点坐标 -> 1,1,1,1,1 (五维)
     * @param {String} b: B点坐标 -> 2,2,2,2,2 (五维)
     * @param {Number} p: p=1->曼哈顿距离, p=2->欧氏距离, p=无穷大(代码中即p=0)->切比雪夫距离
     * @return {Number} 返回两点的欧氏距离(直线距离)
     */
    getMinkowskiDistance (a, b, p) {
        const arrA = a.split(",");
        const arrB = b.split(",");
        const parP = Number(p);
        if (parP) {
            let result = 0;
            arrA.forEach((item, index) => {
                const cal = Math.abs(arrA[index] - arrB[index]);
                result = result + Math.pow(cal, p);
            });
            result = Math.pow(result, 1 / p);
            return result;
        } else if (parP === 0) {
            let resultArr = [];
            arrA.forEach((item, index) => {
                const cal = Math.abs(arrA[index] - arrB[index]);
                resultArr.push(cal);
            });
            return Math.max(...resultArr);
        }
    },

    // 计算余弦相似度
    getCosineSimilarity (a, b) {
        const arrA = a.split(",");
        const arrB = b.split(",");

        let dot = 0;
        let lengthA = 0;
        let lengthB = 0;
        arrA.forEach((item, index) => {
            dot = dot + arrA[index] * arrB[index];
            lengthA = lengthA + Math.pow(arrA[index], 2);
            lengthB = lengthB + Math.pow(arrB[index], 2);
        });
        const result = dot / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
        return result;
    }
};
