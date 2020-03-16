import MegaMath from "@/utils/MegaMath.js";

const range = 1000; // 取值范围
const standardDeviation = 60; // 数据离散的标准差
const funcs = {
    /**
     * 生成簇中心点
     * @param {Number} clust: 生成个数
     * @returns {Array}: 数组中包含clust个数据点坐标
     */
    getClust (clust) {
        const r = [];
        for (let i = 0; i < clust; i++) {
            r.push([
                Math.random() * range,
                Math.random() * range
            ]);
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
    },

    /**
      * 生成原始数据
      * @param {Object} option.total: 生成总数据个数
      * @param {Object} option.clust: 生成簇个数
      * @returns {Array}: 数据集
      */
    getDataSets (option) {
        const r = [];
        if (option.mode) {
            const num = Math.ceil(Number(option.total) / option.clust);
            const clust = this.getClust(option.clust);

            clust.forEach((item) => {
                for (let i = 0; i < num; i++) {
                    const point = [
                        MegaMath.getNormalDistribution(item[0], standardDeviation),
                        MegaMath.getNormalDistribution(item[1], standardDeviation)
                    ];
                    r.push(point);
                }
            });
        } else {
            for (let i = 0; i < option.total; i++) {
                r.push([Math.random() * range, Math.random() * range]);
            }
        }
        return r;
    },

    /**
      * 生成三维原始数据
      * @param {Object} options.total: 生成总数据个数
      * @param {Object} options.clust: 生成簇个数
      * @returns {Array}: 数据集
      */
    getDataSets3D (options) {
        const r = [];
        if (options.mode) {
            // 生成随机中心点, 定义域为[0, range]
            const center = this.getClust3D(options.clust);

            // 对每个中心点生成簇
            center.forEach((center) => {
                for (let i = 0; i < options.total; i++) {
                    const x = MegaMath.getNormalDistribution(center.x, standardDeviation);
                    const y = MegaMath.getNormalDistribution(center.y, standardDeviation);
                    const z = MegaMath.getNormalDistribution(center.z, standardDeviation);
                    r.push([x, y, z]);
                }
            });
        } else {
            for (let i = 0; i < options.total; i++) {
                r.push([Math.random() * range, Math.random() * range, Math.random() * range]);
            }
        }
        return r;
    },

    /**
      * K-means聚类算法
      * @param {Object} options.total: 生成总数据个数
      * @param {Object} options.mode: 生成数据规则。0为随机生成，1为簇生成
      * @param {Object} options.clust: 生成簇个数
      * @param {Object} options.value: 算法中的k值
      * @param {Object} options.times: 算法迭代次数
      * @returns {Array}: 数据集
      */
    kmeans (options) {
        let result = []; // 最终结果
        const dataSets = this.getDataSets(options); // 生成原始数据

        const length = dataSets.length;
        const k = Number(options.value);
        const center = [];

        // 选取中心点
        for (let i = 0; i < k; i++) {
            const random = Math.floor(Math.random() * length);
            center.push([dataSets[random]]);
            result.push([]);
        }

        // 划分每点
        dataSets.forEach((point, m) => {
            let distance = 0;
            let belongs = 0;
            center.forEach((sample, n) => {
                // 获取数据点与中心点的欧氏距离
                const pointA = point.toString();
                const pointB = sample.toString();
                const dis = MegaMath.getEuclideanDistance(pointA, pointB);
                if (n === 0) {
                    distance = dis;
                } else if (n !== 0 && dis < distance) {
                    distance = dis;
                    belongs = n;
                }
            });
            result[belongs].push(point);
        });

        let iteration = 0;
        while (iteration < Number(options.times) - 1) {
            const iCenter = []; // 中心点数组
            const iResult = []; // 结果数组

            // 计算每个簇的中心点
            const ds = JSON.parse(JSON.stringify(result));
            ds.forEach((dsItem) => {
                let xCenter = 0;
                let yCenter = 0;
                dsItem.forEach((point) => {
                    xCenter = Number(xCenter + Number(point[0]));
                    yCenter = Number(yCenter + Number(point[1]));
                });
                xCenter = xCenter / dsItem.length;
                yCenter = yCenter / dsItem.length;
                iCenter.push([xCenter, yCenter]);
                iResult.push([]);
            });

            // 分类各数据
            result.forEach((clust) => {
                clust.forEach((point) => {
                    let distance = 0;
                    let belongs = 0;
                    iCenter.forEach((sample, n) => {
                        // 获取数据点与中心点的欧氏距离
                        const pointA = point.toString();
                        const pointB = sample.toString();
                        const dis = MegaMath.getEuclideanDistance(pointA, pointB);
                        if (n === 0) {
                            distance = dis;
                        } else if (n !== 0 && dis < distance) {
                            distance = dis;
                            belongs = n;
                        }
                    });
                    iResult[belongs].push(point);
                });
            });

            result = JSON.parse(JSON.stringify(iResult));
            iteration++;
        }

        return { result: result, dataSets: dataSets };
    },

    /**
      * K-means三维聚类算法
      * @param {Object} options.total: 生成总数据个数
      * @param {Object} options.mode: 生成数据规则。0为随机生成，1为簇生成
      * @param {Object} options.clust: 生成簇个数
      * @param {Object} options.type: 计算相似度的方式，有"ManhattanDistance"、"EuclideanDistance"
      * @param {Object} options.value: 算法中的k值
      * @param {Object} options.times: 算法迭代次数
      * @param {Array} data: 原始数据数组 [[x1, y1, z1], [x2, y2, z2], ...]
      * @returns {Array}: 数据集
      */
    kmeans3D (options, data) {
        const center = [];
        let r = [];

        /* 在已有数据中, 选取随机k个中心点 */
        for (let i = 0; i < Number(options.value); i++) {
            const random = Math.floor(Math.random() * data.length);
            center.push([data[random]]);
            r.push([]); // 同时在结果数组中创建k个空数组
        }

        /* 计算每一个点与中心点的距离 */
        data.forEach((point, m) => {
            let distance = 0; // 与中心点最近距离
            let belongs = 0; // 与哪个中心点距离最近
            center.forEach((sample, n) => {
                // 获取数据点与中心点的距离
                const pointA = point.toString();
                const pointB = sample.toString();
                let dis = "";
                if (options.type === "EuclideanDistance") { // 欧式距离
                    dis = MegaMath.getMinkowskiDistance(pointA, pointB, 2);
                } else if (options.type === "ManhattanDistance") { // 几何距离
                    dis = MegaMath.getMinkowskiDistance(pointA, pointB, 1);
                }

                /* 将距离与上一个中心点的距离做对比，保存最近的那一个 */
                if (n === 0) {
                    distance = dis;
                } else if (n !== 0 && dis < distance) {
                    distance = dis;
                    belongs = n;
                }
            });
            r[belongs].push(point);
        });

        /* 循环直至达到终止闸值 */
        let kmeansContinue = true; // 是否继续
        let lastICenter = [];
        while (kmeansContinue) {
            const iCenter = []; // 中心点数组
            const iResult = []; // 结果数组

            /* 计算每个簇的中心点 */
            const ds = JSON.parse(JSON.stringify(r));
            ds.forEach((dsItem) => {
                let xCenter = 0;
                let yCenter = 0;
                let zCenter = 0;
                dsItem.forEach((point) => {
                    xCenter = Number(xCenter + Number(point[0]));
                    yCenter = Number(yCenter + Number(point[1]));
                    zCenter = Number(zCenter + Number(point[2]));
                });
                xCenter = xCenter / dsItem.length;
                yCenter = yCenter / dsItem.length;
                zCenter = zCenter / dsItem.length;
                iCenter.push([xCenter, yCenter, zCenter]);
                iResult.push([]);
            });

            /* 计算最大闸值并判断是否需要终止 */
            if (lastICenter.length !== 0) {
                const stopArr = [];
                iCenter.forEach((point, i) => {
                    const pointA = point.toString();
                    const pointB = lastICenter[i].toString();
                    let dis = "";
                    if (options.type === "EuclideanDistance") {
                        dis = MegaMath.getMinkowskiDistance(pointA, pointB, 2);
                    } else if (options.type === "ManhattanDistance") {
                        dis = MegaMath.getMinkowskiDistance(pointA, pointB, 1);
                    }

                    stopArr.push(dis);
                });

                const stopMax = Math.max(...stopArr);
                if (stopMax < options.times) kmeansContinue = false;
            }
            lastICenter = JSON.parse(JSON.stringify(iCenter));

            // 分类各数据
            r.forEach((clust) => {
                clust.forEach((point) => {
                    let distance = 0;
                    let belongs = 0;
                    iCenter.forEach((sample, n) => {
                        // 获取数据点与中心点的欧氏距离
                        const pointA = point.toString();
                        const pointB = sample.toString();
                        let dis = "";
                        if (options.type === "EuclideanDistance") {
                            dis = MegaMath.getMinkowskiDistance(pointA, pointB, 2);
                        } else if (options.type === "ManhattanDistance") {
                            dis = MegaMath.getMinkowskiDistance(pointA, pointB, 1);
                        }

                        if (n === 0) {
                            distance = dis;
                        } else if (n !== 0 && dis < distance) {
                            distance = dis;
                            belongs = n;
                        }
                    });
                    iResult[belongs].push(point);
                });
            });

            r = JSON.parse(JSON.stringify(iResult));
        }
        return r;
    }
};

export default funcs;
