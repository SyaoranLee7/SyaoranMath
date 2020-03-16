export default {
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
        return x.toFixed(4);
    },

    // 计算欧里几得距离
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

    // 计算闵可夫斯基距离集合
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
