<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">正态分布</div>
            <div class="link" href="https://blog.csdn.net/weixin_41793877/article/details/84700875">
                <span>Box-Muller别问我也不会</span>
            </div>
        </div>

        <div class="lan-content">
            <div class="setting-base">
                <div class="title">参数设置</div>
                <el-form
                    :model="inputData"
                    label-width="120px"
                    label-position="left">
                    <el-form-item label="数学期望">
                        <el-input v-model="inputData.mean" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="标准差">
                        <el-input v-model="inputData.standardDeviation" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="生成随机数量">
                        <el-input v-model="inputData.total" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="runMath">
                    计算结果: {{ result }}
                </el-button>
                <el-button type="primary" @click="checkResult">
                    开始校验
                </el-button>
            </div>

            <div class="setting-result">
                <div class="title">结果展示</div>
                <div class="result">
                    <div id="check"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import NormalDistribution from "./NormalDistribution.js";
export default {
    data () {
        return {
            inputData: {
                mean: 0, // 数学期望
                standardDeviation: 1, // 标准差
                total: 100 // 生成多少个数
            },

            result: "", // 单次生成正态分布的结果
            dataSets: [], // 多次生成的数据集合
            max: "", // 所有数的最大值
            min: "" // 所有数的最小值
        };
    },

    methods: {
        // 开始计算
        runMath () {
            const res = NormalDistribution.getNormalDistribution(this.inputData.mean, this.inputData.standardDeviation);
            this.result = res;
        },

        // 开始校验
        checkResult () {
            this.dataSets = [];
            const checkDataSets = [];
            for (let i = 0; i < this.inputData.total; i++) {
                const res = NormalDistribution.getNormalDistribution(this.inputData.mean, this.inputData.standardDeviation);
                this.dataSets.push({
                    id: i + 1, //
                    value: res // 正太分布数值
                });
                checkDataSets.push(res);
            }

            const max = Math.max(...checkDataSets);
            const min = Math.min(...checkDataSets);
            this.max = Math.ceil(max);
            this.min = Math.floor(min);
            const interval = (this.max - this.min) / 1;
            const checkData = [];

            let xAxis = min;
            for (let i = 0; i < interval; i++) {
                const obj = {
                    x: Number(xAxis.toFixed(0)),
                    number: 0
                };
                checkDataSets.forEach((item) => {
                    if (Number(Number(item).toFixed(0)) === obj.x) obj.number++;
                });
                checkData.push(obj);
                xAxis = xAxis + 1;
            }

            this.initEchart(checkData);
        },

        initEchart (checkData) {
            this.initShow = false;
            const xData = [];
            const yData = [];
            checkData.forEach((item) => {
                xData.push(item.x);
                yData.push(item.number);
            });
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("check"), {}, { renderer: "svg" });
            const xAxis = {
                type: "category",
                data: xData,
                axisTick: { show: false }
            };
            const yAxis = {
                type: "value",
                axisTick: { show: false }
            };
            const series = {
                type: "line",
                data: yData,
                lineStyle: {
                    normal: { width: 1 }
                },
                smooth: true
            };
            const option = {
                xAxis,
                yAxis,
                series
            };
            dom.setOption(option);
        }
    },

    created () {
    }
};
</script>

<style lang="scss" scoped>
.lan-main {
    .result {
        #check {
            width: 100%;
            height: 500px;
            border: 1px solid #666666;
            margin: 20px;
        }
    }
}
</style>
