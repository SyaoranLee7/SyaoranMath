<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">定积分计算</div>
        </div>

        <div class="lan-content">
            <div class="setting-base">
                <div class="title">参数设置</div>
                <el-form
                    :model="inputData"
                    label-width="120px"
                    label-position="left">
                    <el-form-item label="方程参数">
                        <el-tooltip
                            effect="dark"
                            content="a11X^2 + a22Y^2 + a1X + a2Y + a3XY + a4 = 0"
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -50px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-input v-model="cons" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="输入方程">
                        <div>{{ equation }}</div>
                    </el-form-item>
                    <el-form-item label="上限x=">
                        <el-input v-model="up" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="下限x=">
                        <el-input v-model="down" type="text"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="run">
                    计算结果: {{ area }}
                </el-button>
            </div>

            <div class="setting-result">
                <div class="title">结果展示</div>
                <div class="result">
                    <div id="result"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import helper from "./Integration.js";
export default {
    data () {
        return {
            inputData: {},
            cons: "1,0,0,-1,0,-5", // 方程1参数
            up: 3, // 积分上限
            down: -3, // 积分下限
            area: 0 // 计算结果
        };
    },

    computed: {
        equation () {
            const c = this.cons.split(",");
            const a11 = Number(c[0]) ? c[0] + "*X² + " : "";
            const a22 = Number(c[1]) ? c[1] + "*Y² + " : "";
            const a1 = Number(c[2]) ? c[2] + "*X + " : "";
            const a2 = Number(c[3]) ? c[3] + "*Y + " : "";
            const a3 = Number(c[4]) ? c[4] + "*X*Y + " : "";
            const a4 = Number(c[5]) || "0";
            const str = a11 + a22 + a1 + a2 + a3 + a4 + " = 0";
            return str;
        }
    },

    methods: {
        // 开始计算
        run () {
            this.area = helper.Integration(this.cons, this.up, this.down);
            this.initEchart();
        },

        initEchart (checkData) {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("result"), {}, { renderer: "svg" });
            const axis = { type: "value", axisTick: { show: false } };

            /* 生成上下限分界线数据点 */
            const xDownData = [];
            const xUpData = [];
            for (let i = -10; i < 10; i = i + 0.1) {
                xDownData.push( [ Number(this.down), i ] );
                xUpData.push( [ Number(this.up), i ] );
            }
            const seriesXDown = { type: "line", data: xDownData, silent: true, itemStyle: { opacity: 0 } };
            const seriesXUp = { type: "line", data: xUpData, silent: true, itemStyle: { opacity: 0 } };

            /* 生成函数数据点 */
            const seriesEquation = {
                type: "scatter",
                data: helper.getEquationData(this.cons),
                symbolSize: 2,
                silent: true
            };

            const series = [
                seriesXDown, seriesXUp, seriesEquation
            ];
            const option = {
                xAxis: axis,
                yAxis: axis,
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
        #result {
            width: 100%;
            height: 700px;
            border: 1px solid #666666;
            margin: 20px;
        }
    }
}
</style>
