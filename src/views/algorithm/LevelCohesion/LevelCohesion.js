import MegaMath from "@/utils/MegaMath.js";

const range = 1000; // 取值范围
const standardDeviation = 60; // 数据离散的标准差
const funcs = {
    /**
      * 生成三维原始数据
      * @param {Object} options.total: 生成总数据个数
      * @param {Object} options.clust: 生成簇个数
      * @returns {Array}: 数据集
      */
    getDataSets3D (options) {
        const r = [];
        const center = [];
        // 生成随机中心点, 定义域为[0, range]
        for (let i = 0; i < options.clust; i++) {
            const x = Math.random() * range;
            const y = Math.random() * range;
            const z = Math.random() * range;
            const p = {x: x, y: y, z: z};
            center.push(p);
        }

        // 对每个中心点生成簇
        center.forEach((p) => {
            for (let i = 0; i < options.total; i++) {
                const x = MegaMath.getNormalDistribution(p.x, standardDeviation);
                const y = MegaMath.getNormalDistribution(p.y, standardDeviation);
                const z = MegaMath.getNormalDistribution(p.z, standardDeviation);
                r.push([Number(x), Number(y), Number(z)]);
            }
        });
        return r;
    },

    /**
      * 计算一个三维坐标集合的中心点
      * @param {Array} arr: 点集合[[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], ...]
      * @returns {Array}: 中心点[x, y, z]
      */
    getCenter (arr) {
        let x = 0;
        let y = 0;
        let z = 0;
        arr.forEach((item) => {
            x = x + item[0];
            y = y + item[1];
            z = z + item[2];
        });
        const xCenter = x / arr.length;
        const yCenter = y / arr.length;
        const zCenter = z / arr.length;
        return [xCenter, yCenter, zCenter];
    },

    /**
      * 按最小簇数目规则开始聚类
      * @param {Number} minClust: 最小簇的数量. 当聚类到该数值时, 停止算法
      * @param {Array} clust: 待处理数据[[簇1], [簇2], [簇3], ...]
      * @returns {Array}: 数据集
      */
    cohesionByNumber (minClust, clust) {
        let result = []; // 算法的结果
        const ignoreList = [];

        /* 对数据洗牌打乱顺序, 避免多次算法的结果相同 */
        let clustLength = clust.length;
        while (clustLength) {
            const j = Math.floor(Math.random() * clustLength--);
            [clust[j], clust[clustLength]] = [clust[clustLength], clust[j]];
        }

        /* 只有当数据的簇比闸值大且不为一时, 才执行算法 */
        if (clust.length > minClust && clust.length !== 1) {

            /* 循环每个簇(记为簇A), 计算与其他所有簇的距离, 合并最近的 */
            clust.forEach((clustA, a) => {
                /* 判断这个簇A是否在之前被当作簇B合并过, 没有则继续 */
                const ignoreA = ignoreList.filter(i => {
                    return i === a;
                }).length;
                if (!ignoreA) {
                    const centerPointA = (this.getCenter(clustA)).toString(); // 获取簇A的中心点
                    let minDis = 0; // clustA与各个簇的最小距离
                    let minObject = {}; // 与clustA最近的clustB信息对象

                    clust.forEach((clustB, b) => {
                        /* 不计算a===b(同一个簇), 也不计算已经被合并过的簇 */
                        const ignoreB = ignoreList.filter(i => {
                            return i === b;
                        }).length;
                        if (a !== b && !ignoreB) {
                            const centerPointB = (this.getCenter(clustB).toString()); // 获取簇B的中心点
                            const dis = MegaMath.getMinkowskiDistance(centerPointA, centerPointB, 2); // 计算距离(欧式距离)
                            if (minDis === 0 || minDis > dis) {
                                minDis = dis;
                                minObject = {
                                    index: b,
                                    dis: dis,
                                    clust: clustB
                                };
                            }
                        }
                    });
                    // console.log("簇", a, "的最小距离为簇", minObject.index, ",距离为", minObject.dis);

                    if (!minObject.dis) {
                        /* 对于单数的簇, 最后会剩一个簇, 直接输出该簇 */
                        // console.log("对result输出簇", a);
                        result.push(clustA); // 剩最后一簇时，直接输出
                    } else {
                        /* 合并簇AB, 并输出到结果数组中 */
                        const arr = clustA.concat(minObject.clust);
                        result.push(arr);
                        // console.log("对result输出簇", a, "与", minObject.index);

                        ignoreList.push(minObject.index); // 下次大循环簇B时, 忽略簇B
                    }
                    ignoreList.push(a); // 下次大循环簇B时, 忽略簇A
                }
            });

        } else if (clust.length === 1) {
            /* 仅有一个簇时, 直接输出结果 */
            result.push(clust[0]);
        } else {
            /* 当簇数目小于等于目标闸值时, 直接返回该数据 */
            result = clust;
        }
        return { result };
    },

    /**
      * 按最大簇间距规则开始聚类
      * @param {Number} maxDistance: 最大簇间距. 当一个簇与其他簇的间距都大于该值时, 认为该簇已完成聚类
      * @param {Array} clust: 待处理数据[[簇1], [簇2], [簇3], ...]
      * @param {Array} result: 已聚类完成的数据[[簇1], [簇2], [簇3], ...]
      * @returns {Object} resultArr: 结果数据集
      * @returns {Object} processingResult: 未聚类完成的数据集
      */
    cohesionByDistance (maxDistance, clust, resultArr) {
        let result = resultArr; // 算法结果
        const ignoreList = [];
        const processingResult = [];

        /* 对数据洗牌打乱顺序, 避免多次算法的结果相同 */
        let clustLength = clust.length;
        while (clustLength) {
            const j = Math.floor(Math.random() * clustLength--);
            [clust[j], clust[clustLength]] = [clust[clustLength], clust[j]];
        }

        /* 只有当数据的簇数量不为1时, 才执行算法 */
        if (clust.length > 1) {
            /* 循环每个簇(记为簇A), 计算与其他所有簇的距离, 合并最近的 */
            clust.forEach((clustA, a) => {
                /* 判断这个簇A是否在之前被当作簇B合并过, 没有则继续 */
                const ignoreA = ignoreList.filter(i => {
                    return i === a;
                }).length;
                if (!ignoreA) {
                    const centerPointA = (this.getCenter(clustA)).toString(); // 获取簇A的中心点
                    let minDis = 0; // clustA与各个簇的最小距离
                    let minObject = {}; // 与clustA最近的clustB信息对象

                    clust.forEach((clustB, b) => {
                        /* 不计算a===b(同一个簇), 也不计算已经被合并过的簇 */
                        const ignoreB = ignoreList.filter(i => {
                            return i === b;
                        }).length;
                        if (a !== b && !ignoreB) {
                            const centerPointB = (this.getCenter(clustB).toString()); // 获取簇B的中心点
                            const dis = MegaMath.getMinkowskiDistance(centerPointA, centerPointB, 2); // 计算距离(欧氏距离)
                            // console.log("簇", a, "对簇", b, "的距离为", dis);
                            if (minDis === 0 || minDis > dis) {
                                minDis = dis;
                                minObject = {
                                    index: b,
                                    dis: dis,
                                    clust: clustB
                                };
                            }
                        }
                    });
                    // console.log("簇", a, "的最小距离为簇", minObject.index, ",距离为", minObject.dis);

                    if (minObject.dis > maxDistance) {
                        /* 若与其他簇的最小距离都大于闸值, 说明该簇足够远足够独立 */
                        // console.log("对result输出簇", a);
                        result.push(clustA);
                    } else if (minObject.dis <= maxDistance) {
                        /* 最小值小于闸值时, 合并这两个簇, 并转入待处理数组 */
                        const arr = clustA.concat(minObject.clust);
                        processingResult.push(arr);

                        // console.log("对processingResult输出簇", a, "与", minObject.index);
                        ignoreList.push(minObject.index); // 下次大循环簇B时, 忽略簇B
                    } else if (!minObject.dis) {
                        /* 对于单数的簇, 最后会剩一个簇, 直接输出该簇为待处理簇 */
                        // console.log("对processingResult输出簇", a);
                        processingResult.push(clustA);
                    }
                    ignoreList.push(a); // 下次大循环簇B时, 忽略簇A
                }
            });
        }

        // console.log("===================");
        // console.log("processingResult:", processingResult);
        // console.log("result:", result);
        return { result, processingResult };
    }
};

export default funcs;
