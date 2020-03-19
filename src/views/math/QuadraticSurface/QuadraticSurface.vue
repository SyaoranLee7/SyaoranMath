<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">二次曲面渲染</div>
            <div class="link" href="https://baike.baidu.com/item/%E4%BA%8C%E6%AC%A1%E6%9B%B2%E9%9D%A2">
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
                    <el-form-item label="显示范围" required>
                        <el-input v-model="range" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="参数" required>
                        <el-tooltip
                            effect="dark"
                            content="a11,a22,a33,a12,a23,a31,a1,a2,a3,a4"
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -70px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-input v-model="params" type="text"></el-input>
                    </el-form-item>

                </el-form>
                <el-button type="primary" @click="initData">
                    生成图像
                </el-button>
            </div>

            <div class="setting-result">
                <div class="title">空间几何</div>
                <div class="result">
                    <div id="geometry"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import helper from "./QuadraticSurface.js";
export default {
    data () {
        return {
            inputData: {},
            range: 100, // 形成数据的范围
            params: "1,1,1,0,0,0,-4,-4,-4,0",

            dataSets: [] // 数据集
        };
    },

    methods: {
        // 生成数据
        initData () {
            this.dataSets = helper.getDataSets(this.range, this.params);
            this.initOriginEchart();
        },

        // 渲染原始数据
        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("geometry"));

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
        }
    }
};
</script>

<style lang="scss" scoped>
.lan-main {
    .result {
        display: flex;
        #geometry {
            width: 100%;
            height: 700px;
            border: 1px solid #666666;
        }
    }
}
</style>
