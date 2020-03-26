<template>
    <div class="lan-main">

        <div class="lan-main-head">
            <div class="title">空间几何渲染</div>
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
                    <el-form-item label="几何图形" required>
                        <el-select v-model="inputData.type">
                            <el-option label="球面" value="sphereSurface"></el-option>
                            <el-option label="椭球面" value="ellipsoidSurface"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="均匀分布" required>
                        <el-tooltip
                            effect="dark"
                            content="别选了真tm不会"
                            placement="top">
                            <div class="lan-form-tooltip" style="margin-left: -50px;">
                                <i class="el-icon-warning" />
                            </div>
                        </el-tooltip>
                        <el-switch v-model="inputData.balance" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>

                    <!-- 球面参数 -->
                    <div v-show="inputData.type === 'sphereSurface'"></div>

                    <!-- 椭球面参数 -->
                    <div v-show="inputData.type === 'ellipsoidSurface'">
                        <el-form-item label="长半轴a" required>
                            <el-input v-model="inputData.ellipsoid.a" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="中半轴b" required>
                            <el-input v-model="inputData.ellipsoid.b" type="text"></el-input>
                        </el-form-item>
                        <el-form-item label="短半轴c" required>
                            <el-input v-model="inputData.ellipsoid.c" type="text"></el-input>
                        </el-form-item>
                    </div>

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
import helper from "./SpaceGeometry.js";
export default {
    data () {
        return {
            // 输入项
            inputData: {
                total: 1000, // 生成数据个数
                type: "sphereSurface", // 生成几何图形
                balance: false, // 点是否均匀分布

                ellipsoid: {
                    a: 5, // 椭球长半轴
                    b: 4, // 椭球中半轴
                    c: 3 // 椭球短半轴
                }
            },

            dataSets: [] // 数据集
        };
    },

    methods: {
        // 生成数据
        initData () {
            if (this.inputData.type === "sphereSurface") {
                this.dataSets = helper.getSphereSurface(this.inputData);
            } else if (this.inputData.type === "ellipsoidSurface") {
                this.dataSets = helper.getEllipsoidSurface(this.inputData);
            }
            // this.dataSets = helper.getDataSets3D(this.inputData);
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
            console.log(this.dataSets);

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
