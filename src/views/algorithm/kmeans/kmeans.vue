<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">k-means聚类算法</div>
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
                    <el-form-item label="数据个数">
                        <el-input v-model="inputData.total" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="生成模式">
                        <el-tooltip
                            v-show="!inputData.mode"
                            effect="dark"
                            content="随机模式毫无意义..."
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -60px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-select v-model="inputData.mode">
                            <el-option label="簇模式" :value="1"></el-option>
                            <el-option label="随机模式" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="inputData.mode" label="模拟簇数目">
                        <el-input v-model="inputData.clust" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="k值">
                        <el-input v-model="inputData.value" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="迭代次数">
                        <el-input v-model="inputData.times" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="start">
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
import MegaMath from "@/utils/MegaMath.js";
import kmeans from "./kmeans.js";
import constant from "@/utils/constant.js";
export default {
    data () {
        return {
            inputData: {
                total: 100, // 生成数据个数
                mode: 1, // 生成随机数的模式
                clust: 2, // 将数据分成几簇
                value: 2, // k值
                times: 2 // 进行几次迭代
            },
            dataSets: [], // 初始数据集
            result: [] // 渲染后的数据集
        };
    },

    methods: {
        start () {
            if (!this.inputData.total || !this.inputData.clust || !this.inputData.value) {
                this.$message.error("请设置各参数");
                return;
            }

            // 清空数据
            this.result = [];

            // 生成数据
            const res = kmeans.kmeans(this.inputData);
            this.dataSets = res.dataSets;
            this.result = res.result;

            this.initOriginEchart(); // 生成原始数据图
            this.initResultEchart(); // 生成聚类后数据图
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
            for (let i = 0; i < Number(this.inputData.value); i++) {
                const obj = {
                    type: "scatter",
                    data: this.result[i],
                    symbolSize: 4,
                    itemStyle: { color: constant.colorBoxDark[i] }
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

<style lang="scss" scope>
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
