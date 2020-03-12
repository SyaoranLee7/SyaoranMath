<template>
    <div class="lan-main">
        <el-form
            class="lan-form"
            :model="inputData"
            label-width="120px"
            label-position="left"
            style="margin-top: 40px;">
            <el-row class="lan-row" type="flex" justify="start">

                <el-col :span="8" class="lan-col">
                    <div class="lan-title">生成数据</div>
                    <el-form-item label="数据个数">
                        <el-input v-model="inputData.num" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="模拟簇数目">
                        <el-input v-model="inputData.clust" type="text"></el-input>
                    </el-form-item>

                    <div class="lan-title">聚类参数</div>
                    <el-form-item label="k值">
                        <el-input v-model="inputData.k" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="终止次数">
                        <el-input v-model="inputData.stop" type="text"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="16" class="lan-col">
                    <div class="lan-btn">
                        <el-button
                            class="lan-btn"
                            type="primary"
                            @click="start">
                            开始聚类
                        </el-button>
                    </div>
                    <div id="preData"></div>
                    <div id="resultData"></div>
                </el-col>

            </el-row>
        </el-form>
    </div>
</template>
<script>
import MegaMath from "@/util/MegaMath.js";
export default {
    data () {
        return {
            inputData: {
                num: 100,
                clust: 2,
                k: 2,
                stop: 2
            },
            dataSets: [],
            result: [],

            colorBox: ["#FFC0CB", "#DC143C", "#FF00FF", "#8B008B", "#7B68EE", "#0000FF", "#B0C4DE", "#00FFFF", "#00FF00", "#FFFF00"]
        };
    },

    methods: {
        start () {
            if (!this.inputData.num || !this.inputData.clust || !this.inputData.k) {
                this.$message.error("请设置各参数");
                return;
            }

            // 清空数据
            this.result = [];
            this.dataSets = [];

            // 生成簇中心点
            const clust = [];
            for (let i = 0; i < this.inputData.clust; i++) {
                clust.push([
                    Math.random() * 1000,
                    Math.random() * 1000
                ]);
            }

            // 生成数据
            const num = Math.ceil(Number(this.inputData.num) / this.inputData.clust);
            clust.forEach((item) => {
                for (let i = 0; i < num; i++) {
                    const point = [
                        MegaMath.getNormalDistribution(item[0], 60),
                        MegaMath.getNormalDistribution(item[1], 60)
                    ];
                    this.dataSets.push(point);
                }
            });

            this.initOriginEchart(); // 生成原始数据图

            this.kMeans();

            this.initResultEchart();
        },

        // 主体
        kMeans () {
            const length = this.dataSets.length;
            const k = Number(this.inputData.k);
            const center = [];

            // 选取中心点
            for (let i = 0; i < k; i++) {
                const random = Math.floor(Math.random() * length);
                center.push([this.dataSets[random]]);
                this.result.push([]);
            }

            // 划分每点
            this.dataSets.forEach((point, m) => {
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
                this.result[belongs].push(point);
            });

            let iteration = 0;
            while (iteration < Number(this.inputData.stop) - 1) {
                const iCenter = []; // 中心点数组
                const iResult = []; // 结果数组

                // 计算每个簇的中心点
                const ds = JSON.parse(JSON.stringify(this.result));
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
                this.result.forEach((clust) => {
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

                this.result = JSON.parse(JSON.stringify(iResult));
                iteration++;
            }
        },

        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("preData"), {}, { renderer: "svg" });
            const xAxis = {
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            };
            const yAxis = {
                type: "value",
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            };
            const grid = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };
            const series = {
                type: "scatter",
                data: this.dataSets,
                symbolSize: 4,
                itemStyle: { color: "#000000" }
            };
            const option = {
                xAxis,
                yAxis,
                grid,
                series
            };
            dom.setOption(option);
        },

        initResultEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("resultData"), {}, { renderer: "svg" });
            const xAxis = {
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            };
            const yAxis = {
                type: "value",
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            };
            const grid = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            const seriesArr = [];
            for (let i = 0; i < Number(this.inputData.k); i++) {
                const obj = {
                    type: "scatter",
                    data: this.result[i],
                    symbolSize: 4,
                    itemStyle: { color: this.colorBox[i] }
                };
                seriesArr.push(obj);
            }
            const series = [...seriesArr];
            const option = {
                xAxis,
                yAxis,
                grid,
                series
            };
            dom.setOption(option);
        }
    },

    created () {
    },

    mounted () {
    }
};
</script>

<style>
.result-column {
    display: flex;
    flex-direction: column;
}
.math-btn {
    width: 20%;
    margin: 5px 10px;
}

#preData, #resultData {
    width: 70%;
    height: 600px;
    border: 1px solid #666666;
    margin: 20px;
    flex-shrink: 0;
}
</style>
