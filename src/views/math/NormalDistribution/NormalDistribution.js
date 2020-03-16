export default {
    // 生成一个服从正态分布的随机数
    getNormalDistribution: (mean, standardDeviation) => {
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
    }
};
