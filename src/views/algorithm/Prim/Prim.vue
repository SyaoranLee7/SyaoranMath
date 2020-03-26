<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">Prim普里姆算法生成迷宫</div>
            <div class="link">
                <span href="https://blog.csdn.net/jjwwwww/article/details/82891213">指引明路</span>
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
                    <el-form-item label="迷宫边长">
                        <el-input v-model="length" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="start">
                    开始生成
                </el-button>
            </div>

            <div class="setting-result">
                <div class="title">算法结果</div>
                <div class="result">
                    <div id="resultData"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import MegaMath from "@/utils/MegaMath.js";
import Prim from "./Prim.js";
import constant from "@/utils/constant.js";
export default {
    data () {
        return {
            inputData: {},
            length: 10, // 迷宫边长

            result: [] // 渲染后的数据集
        };
    },

    methods: {
        start () {
            this.result = Prim.getMaze(this.length);
            this.initResultEchart();
            console.log("result:", this.result);
        },

        initResultEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("resultData"), {}, { renderer: "svg" });
            const xAxis = {
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: -1
            };
            const yAxis = {
                type: "value",
                axisLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: -1
            };
            const grid = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            };

            const series = {
                type: "scatter",
                data: this.result,
                symbol: "rect",
                symbolSize: 6,
                itemStyle: { color: "#000000" },
                silent: true // 不响应鼠标操作
            };
            const option = {
                xAxis,
                yAxis,
                grid,
                series,
                animation: false
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
        #resultData {
            display: inline-block;
            width: 600px;
            height: 600px;
        }
    }
}
</style>
