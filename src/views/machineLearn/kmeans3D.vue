<template>
    <div class="lan-main main">
        <div class="setting">
            <el-form
                ref="form"
                :model="inputData"
                :rules="rules"
                label-width="120px"
                label-position="left">
                <el-row type="flex" justify="start">
                    <el-col :span="24" class="math-column">
                        <div class="menu-title">生成数据</div>
                        <el-form-item label="数据个数" required prop="num">
                            <el-input v-model="inputData.num" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="模拟簇数目" required prop="clust">
                            <el-input v-model="inputData.clust" type="text"></el-input>
                        </el-form-item>

                        <div class="menu-title">聚类参数</div>
                        <el-form-item label="k值" required prop="k">
                            <el-input v-model="inputData.k" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="相似类型" required>
                            <el-select v-model="inputData.type">
                                <el-option label="ManhattanDistance" value="ManhattanDistance"></el-option>
                                <el-option label="EuclideanDistance" value="EuclideanDistance"></el-option>
                                <!-- <el-option label="CosineSimilarity" value="CosineSimilarity"></el-option> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="终止闸值" required prop="stop">
                            <el-input v-model="inputData.stop" type="text"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button type="primary" @click="initData">生成随机数据</el-button>
            <el-button type="primary" @click="run">开始</el-button>
        </div>

        <div class="echarts">
            <div id="e1"></div>
            <div id="e2"></div>
        </div>
    </div>
</template>
<script>
import MegaMath from "@/util/MegaMath.js";
export default {
    data () {
        return {
            // 输入项
            inputData: {
                num: 100,
                clust: 3,
                k: 3,
                type: "EuclideanDistance",
                stop: 5
            },
            rules: {
                num: [{ required: true, message: "请设置每簇的数据量" }],
                clust: [{ required: true, message: "请设置簇数目" }],
                k: [{ required: true, message: "请设置k值" }],
                stop: [{ required: true, message: "请设置终止闸值" }]
            },

            // 原数据
            originData: [],
            center: [],
            standardDeviation: 100,

            // 聚类数据
            result: [],

            // 其他参数
            check: false,
            colorBox: ["#FFC0CB", "#DC143C", "#FF00FF", "#8B008B", "#7B68EE", "#0000FF", "#B0C4DE", "#00FFFF", "#00FF00", "#FFFF00"]
        };
    },

    methods: {
        run () {
            this.$refs.form.validate((valid) => {
                this.check = !valid;
            });
            if (this.check) return;

            // 清空数据
            this.result = [];
            this.center = [];

            this.kmeans();
            this.initResultEchart();
        },

        kmeans () {
            const length = this.originData.length;
            const k = Number(this.inputData.k);
            const type = this.inputData.type;
            const center = [];

            // 在已有数据中, 选取随机k个中心点
            for (let i = 0; i < k; i++) {
                const random = Math.floor(Math.random() * length);
                center.push([this.originData[random]]);
                this.result.push([]);
            }

            // 初始聚类点
            this.originData.forEach((point, m) => {
                let distance = 0;
                let belongs = 0;
                center.forEach((sample, n) => {
                    // 获取数据点与中心点的欧氏距离
                    const pointA = point.toString();
                    const pointB = sample.toString();
                    let dis = "";
                    if (type === "CosineSimilarity") {
                        dis = MegaMath.getCosineSimilarity(pointA, pointB);
                    } else if (type === "EuclideanDistance") {
                        dis = MegaMath.getMinkowskiDistance(pointA, pointB, 2);
                    } else if (type === "ManhattanDistance") {
                        dis = MegaMath.getMinkowskiDistance(pointA, pointB, 1);
                    }

                    if (n === 0) {
                        distance = dis;
                    } else if (n !== 0 && dis < distance) {
                        distance = dis;
                        belongs = n;
                    }
                });
                this.result[belongs].push(point);
            });

            // 循环直至达到终止闸值
            let kmeansContinue = true;
            let lastICenter = [];
            while (kmeansContinue) {
                const iCenter = []; // 中心点数组
                const iResult = []; // 结果数组

                // 计算每个簇的中心点
                const ds = JSON.parse(JSON.stringify(this.result));
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

                // 计算最大闸值并判断是否需要终止
                if (lastICenter.length !== 0) {
                    const stopArr = [];
                    iCenter.forEach((point, i) => {
                        const pointA = point.toString();
                        const pointB = lastICenter[i].toString();
                        let dis = "";
                        if (type === "CosineSimilarity") {
                            dis = MegaMath.getCosineSimilarity(pointA, pointB);
                        } else if (type === "EuclideanDistance") {
                            dis = MegaMath.getMinkowskiDistance(pointA, pointB, 2);
                        } else if (type === "ManhattanDistance") {
                            dis = MegaMath.getMinkowskiDistance(pointA, pointB, 1);
                        }

                        stopArr.push(dis);
                    });

                    const stopMax = Math.max(...stopArr);
                    if (stopMax < this.inputData.stop) kmeansContinue = false;
                }
                lastICenter = JSON.parse(JSON.stringify(iCenter));

                // 分类各数据
                this.result.forEach((clust) => {
                    clust.forEach((point) => {
                        let distance = 0;
                        let belongs = 0;
                        iCenter.forEach((sample, n) => {
                            // 获取数据点与中心点的欧氏距离
                            const pointA = point.toString();
                            const pointB = sample.toString();
                            let dis = "";
                            if (type === "CosineSimilarity") {
                                dis = MegaMath.getCosineSimilarity(pointA, pointB);
                            } else if (type === "EuclideanDistance") {
                                dis = MegaMath.getMinkowskiDistance(pointA, pointB, 2);
                            } else if (type === "ManhattanDistance") {
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

                this.result = JSON.parse(JSON.stringify(iResult));
            }
        },

        initData () {
            this.$refs.form.validate((valid) => {
                this.check = !valid;
            });
            if (this.check) return;

            this.center = [];
            this.originData = [];
            // 生成随机中心点, 定义域为[0, 1000]
            for (let i = 0; i < this.inputData.clust; i++) {
                const x = Math.random() * 1000;
                const y = Math.random() * 1000;
                const z = Math.random() * 1000;
                const center = {x: x, y: y, z: z};
                this.center.push(center);
            }

            // 对每个中心点生成簇
            this.center.forEach((center) => {
                for (let i = 0; i < this.inputData.num; i++) {
                    const x = MegaMath.getNormalDistribution(center.x, this.standardDeviation);
                    const y = MegaMath.getNormalDistribution(center.y, this.standardDeviation);
                    const z = MegaMath.getNormalDistribution(center.z, this.standardDeviation);
                    this.originData.push([x, y, z]);
                }
            });

            this.initOriginEchart();
        },

        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("e1"));

            const xAxis3D = {
                type: "value"
            };

            const yAxis3D = {
                type: "value"
            };

            const zAxis3D = {
                type: "value"
            };

            const grid3D = {
                axisLine: { lineStyle: { color: "#fff" } },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisPointer: { show: false },
                environment: "#000000"
            };

            const series = {
                type: "scatter3D",
                data: this.originData,
                symbol: "circle",
                symbolSize: 5,
                itemStyle: { color: "#FFFFFF" }
            };

            const option = {xAxis3D, yAxis3D, zAxis3D, grid3D, series};
            dom.setOption(option);
        },

        initResultEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("e2"));

            const xAxis3D = {
                type: "value"
            };

            const yAxis3D = {
                type: "value"
            };

            const zAxis3D = {
                type: "value"
            };

            const grid3D = {
                axisLine: { lineStyle: { color: "#fff" } },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisPointer: { show: false },
                environment: "#000000"
            };

            const seriesArr = [];
            for (let i = 0; i < Number(this.inputData.k); i++) {
                const obj = {
                    type: "scatter3D",
                    data: this.result[i],
                    symbol: "circle",
                    symbolSize: 5,
                    itemStyle: { color: this.colorBox[i] }
                };
                seriesArr.push(obj);
            }
            const series = [...seriesArr];

            const option = {xAxis3D, yAxis3D, zAxis3D, grid3D, series};
            dom.setOption(option);
        }
    },

    created () {
    },

    mounted () {
        this.initData();
    }
};
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: row;
}
.setting {
    width: 30%;
    margin: 10px;
    overflow: auto;
}
.menu-title {
    text-align: center;
    font-size: 16px;
    color: #999999;
    border-top: 1px solid #cccccc;
    line-height: 30px;
    height: 30px;
}
.echarts {
    width: 70%;
    overflow: auto;
}
#e1, #e2 {
    width: 800px;
    height: 600px;
    margin: 10px auto;
}
</style>
