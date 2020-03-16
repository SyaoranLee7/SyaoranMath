export default {
    // 计算闵可夫斯基距离
    getMinkowskiDistance: (a, b, p) => {
        const arrA = a.split(",");
        const arrB = b.split(",");
        const parP = Number(p);
        if (arrA.length !== arrB.length) {
            this.$message.error("维度不同, 无法计算");
            return "无法计算";
        } else if (parP) {
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
    }
};
