import MegaMath from "@/utils/MegaMath.js";

const range = 1000; // 取值范围
const standardDeviation = 60; // 数据离散的标准差
const funcs = {
    /**
      * 生成原始数据
      * @param {Object} options: 设置参数
      * @param {Number} options.mode: 生成数据的模式: 1->簇, 2->圆环
      * @param {Number} options.clust: 生成数据的模式为簇时的簇数量
      * @param {Number} options.totalClust: 生成数据的模式为簇时的数据数量
      * @param {Number} options.radiusSmall: 生成数据的模式为球中球时小球的半径
      * @param {Number} options.totalSmall: 生成数据的模式为球中球时小球的数据量
      * @param {Number} options.radiusOutside: 生成数据的模式为球中球时大球的外半径
      * @param {Number} options.radiusIutside: 生成数据的模式为球中球时大球的内半径
      * @param {Number} options.totalRing: 生成数据的模式为球中球时大球的数据量
      * @returns {Array}: 数据集
      */
    getDataSets3D (options) {
        const r = [];
        if (options.mode === 1) {
            const center = this.getClust3D(options.clust); // 生成随机中心点, 定义域为[0, range]
            center.forEach((center) => { // 对每个中心点生成簇
                for (let i = 0; i < options.totalClust; i++) {
                    const x = MegaMath.getNormalDistribution(center.x, standardDeviation);
                    const y = MegaMath.getNormalDistribution(center.y, standardDeviation);
                    const z = MegaMath.getNormalDistribution(center.z, standardDeviation);
                    r.push([x, y, z]);
                }
            });
        } else if (options.mode === 2) {
            /* 生成以原点为圆点, 小球半径为标准差而产生的服从二项分布的点, 组成小球 */
            for (let i = 0; i < options.totalSmall; i++) {
                const x = MegaMath.getNormalDistribution(0, options.radiusSmall);
                const y = MegaMath.getNormalDistribution(0, options.radiusSmall);
                const z = MegaMath.getNormalDistribution(0, options.radiusSmall);
                r.push([x, y, z]);
            }
            /* 球环是一个标准差为大小半径差的一半的环 */
            const standardDeviationRadius = (options.radiusOutside - options.radiusIutside) / 2; // 期望
            for (let i = 0; i < options.totalRing; i++) {
                const radius = MegaMath.getNormalDistribution(0, standardDeviationRadius) + options.radiusIutside; // 某一点所在球面半径
                const Theta = Math.random() * 2 * Math.PI; // θ角度
                const Phi = Math.random() * 2 * Math.PI; // φ角度
                const x = radius * Math.sin(Phi) * Math.cos(Theta);
                const y = radius * Math.sin(Phi) * Math.sin(Theta);
                const z = radius * Math.cos(Phi);
                r.push([x, y, z]);
            }
        }
        return r;
    },

    /**
     * 生成三维簇中心点
     * @param {Number} clust: 生成个数
     * @returns {Array}: 数组中包含clust个数据点坐标
     */
    getClust3D (clust) {
        const r = [];
        for (let i = 0; i < clust; i++) {
            const x = Math.random() * range;
            const y = Math.random() * range;
            const z = Math.random() * range;
            const center = {x: x, y: y, z: z};
            r.push(center);
        }
        return r;
    }
};

export default funcs;
