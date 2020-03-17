<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">k-means聚类算法3D演示</div>
            <div class="link" href="https://www.cnblogs.com/txx120/p/11487674.html">
                <span>指引明路</span>
            </div>
        </div>

        <div class="lan-content">
            <div class="setting-base">
                <div class="title">参数设置</div>
                <el-form
                    class="setting-base-form"
                    :model="inputData"
                    label-width="120px"
                    label-position="left">
                    <el-form-item label="数据个数" required>
                        <el-input v-model="inputData.total" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="生成模式" required>
                        <el-tooltip
                            v-show="!inputData.mode"
                            effect="dark"
                            content="随机模式毫无意义..."
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -50px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-select v-model="inputData.mode">
                            <el-option label="簇模式" :value="1"></el-option>
                            <el-option label="随机模式" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode" label="模拟簇数目" required>
                        <el-input v-model="inputData.clust" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="k值" required>
                        <el-input v-model="inputData.value" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="相似类型" required>
                        <el-select v-model="inputData.type">
                            <el-option label="ManhattanDistance" value="ManhattanDistance"></el-option>
                            <el-option label="EuclideanDistance" value="EuclideanDistance"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="迭代次数" required>
                        <el-input v-model="inputData.times" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="initData">
                    生成数据
                </el-button>
                <el-button type="primary" @click="run">
                    开始聚类
                </el-button>
            </div>

            <div class="setting-result">
                <div class="title">算法结果</div>
                <div class="result">
                    <div id="preData"></div>
                    <div id="resultData"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import kmeans from "./kmeans.js";
import constant from "@/utils/constant.js";
export default {
    data () {
        return {
            // 输入项
            inputData: {
                total: 100, // 生成数据个数
                mode: 1, // 生成随机数的模式
                clust: 2, // 将数据分成几簇
                type: "EuclideanDistance", // 计算相似度所用方法
                value: 2, // k值
                times: 2 // 进行几次迭代
            },

            dataSets: [], // 初始数据集
            result: [] // 渲染后的数据集
        };
    },

    methods: {
        run () {
            if (!this.dataSets.length) this.initData();
            this.result = kmeans.kmeans3D(this.inputData, this.dataSets);
            this.initResultEchart();
        },

        // 生成数据
        initData () {
            this.dataSets = kmeans.getDataSets3D(this.inputData);
            this.initOriginEchart();
        },

        // 渲染原始数据
        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("preData"));

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
                data: this.dataSets,
                symbol: "circle",
                symbolSize: 5,
                itemStyle: { color: "#FFFFFF" }
            };

            const option = {xAxis3D, yAxis3D, zAxis3D, grid3D, series};
            dom.setOption(option);
        },

        // 渲染聚类后的数据
        initResultEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("resultData"));

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
            for (let i = 0; i < Number(this.inputData.value); i++) {
                const obj = {
                    type: "scatter3D",
                    data: this.result[i],
                    symbol: "circle",
                    symbolSize: 5,
                    itemStyle: { color: constant.colorBoxDark[i] }
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
    }
};
</script>

<style lang="scss" scoped>
.lan-main {
    .result {
        display: flex;
        #preData, #resultData {
            display: inline-block;
            width: calc(50% - 40px);
            height: 500px;
            border: 1px solid #666666;
            margin: 20px;
            flex-shrink: 0;
        }
    }
}
</style>
