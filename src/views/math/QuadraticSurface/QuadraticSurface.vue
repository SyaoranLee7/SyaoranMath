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
                    <el-form-item label="精细度" required>
                        <el-input v-model="interval" type="text"></el-input>
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
                    <el-form-item label="方程提示" required>
                        <el-select v-model="type">
                            <el-option label="球面" value="sphere"></el-option>
                            <el-option label="圆柱面" value="cylinder"></el-option>
                            <el-option label="椭圆抛物面" value="EllipticalParaboloid"></el-option>
                            <el-option label="双曲抛物面" value="HyperbolicParaboloid"></el-option>
                            <el-option label="单叶双曲面" value="Hyperboloid"></el-option>
                            <el-option label="双叶双曲面" value="hyperboloidOfTwoSheets"></el-option>
                            <el-option label="椭圆锥面" value="EllipticCone"></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <el-button type="primary" @click="initData">
                    生成图像
                </el-button>
                <div class="tips">
                    <span class="name">{{ typeName }}</span>的一般方程是: <span class="equation">{{ equation }}</span>
                </div>
                <div class="example">{{ example }}</div>
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
            range: 50, // 形成数据的范围
            interval: 5, // 精细度
            params: "1,1,1,0,0,0,-4,-4,-4,0", // 参数
            type: "cylinder", // 方程形式

            dataSets: [] // 数据集
        };
    },

    computed: {
        typeName () {
            let name = "";
            switch (this.type) {
                case "cylinder":
                    name = "圆柱面";
                    break;
                case "sphere":
                    name = "球面";
                    break;
                case "EllipticalParaboloid":
                    name = "椭圆抛物面";
                    break;
                case "HyperbolicParaboloid":
                    name = "双曲抛物面";
                    break;
                case "Hyperboloid":
                    name = "单叶双曲线";
                    break;
                case "hyperboloidOfTwoSheets":
                    name = "双叶双曲面";
                    break;
                case "EllipticCone":
                    name = "椭圆锥面";
                    break;
                default:
                    name = "";
            }
            return name;
        },
        equation () {
            let e = "";
            switch (this.type) {
                case "cylinder":
                    e = "X² + Y² - R² = 0";
                    break;
                case "sphere":
                    e = "X² + Y² + Z² - R² = 0";
                    break;
                case "EllipticalParaboloid":
                    e = "X²/a² + Y²/b² - 2Z = 0";
                    break;
                case "HyperbolicParaboloid":
                    e = "-X²/a² + Y²/b² - 2Z = 0";
                    break;
                case "Hyperboloid":
                    e = "X²/a² + Y²/b² - Z²/c² - 1 = 0";
                    break;
                case "hyperboloidOfTwoSheets":
                    e = "X²/a² + Y²/b² - Z²/c² + 1 = 0";
                    break;
                case "EllipticCone":
                    e = "X²/a² + Y²/b² - Z² = 0";
                    break;
                default:
                    e = "";
            }
            return e;
        },
        example () {
            let e = "";
            switch (this.type) {
                case "cylinder":
                    e = "1,1,0,0,0,0,0,0,0,-16";
                    break;
                case "sphere":
                    e = "1,1,1,0,0,0,-2,-2,-2,-300";
                    break;
                case "EllipticalParaboloid":
                    e = "0.2,0.2,0,0,0,0,0,0,-2,0";
                    break;
                case "HyperbolicParaboloid":
                    e = "-0.2,0.2,0,0,0,0,0,0,-2,0";
                    break;
                case "Hyperboloid":
                    e = "0.1,0.2,-0.05,0,0,0,0,0,0,-1";
                    break;
                case "hyperboloidOfTwoSheets":
                    e = "0.1,0.2,-0.05,0,0,0,0,0,0,1";
                    break;
                case "EllipticCone":
                    e = "0.33,0.5,-1,0,0,0,0,0,0,0";
                    break;
                default:
                    e = "";
            }
            return "参数例子: " + e;
        }
    },

    methods: {
        // 生成数据
        initData () {
            this.dataSets = helper.getDataSets(this.range, this.interval, this.params);
            this.initOriginEchart();
            // console.log("dataSets:", this.dataSets);
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
@import "~@/styles/variables.scss";
.lan-main {
    .setting-base {
        .tips {
            margin-top: 20px;
            .name { color: $fontColor_blue; font-weight: 700; }
            .equation { font-weight: 700; }
        }
        .example { margin-top: 20px; }
    }
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
