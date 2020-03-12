<template>
    <div class="lan-main">

        <el-form
            :model="inputData"
            label-width="120px"
            label-position="left">
            <el-row type="flex" justify="start">

                <el-col :span="8" class="math-column">
                    <el-form-item label="数学期望">
                        <el-input v-model="inputData.mean" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="标准差">
                        <el-input v-model="inputData.standardDeviation" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="生成随机数量">
                        <el-input v-model="inputData.total" type="text"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="16" class="math-column result-column">
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="runMath">
                        计算结果: {{ result }}
                    </el-button>
                    <el-button
                        class="math-btn"
                        type="primary"
                        @click="checkResult">
                        多数据校验
                    </el-button>
                    <div id="check"></div>
                    <!-- <div class="data-sets">
                        <div
                            class="data-sets-item"
                            v-for="item in dataSets"
                            :key="item.id">
                            {{item.value}}
                        </div>
                    </div> -->
                </el-col>

            </el-row>
        </el-form>

    </div>
</template>
<script>
export default {
    data () {
        return {
            inputData: {
                mean: 0,
                standardDeviation: 1,
                total: 0
            },

            result: "",
            dataSets: [],
            max: "",
            min: ""
        };
    },

    methods: {
        // 开始计算
        runMath () {
            const res = this.getNormalDistribution(this.inputData.mean, this.inputData.standardDeviation);
            this.result = res;
        },

        // 生成服从正态分布的随机数
        getNormalDistribution (mean, standardDeviation) {
            const u = Number(mean);
            const o = Number(standardDeviation);

            /* Box-Muller变换 */
            // 产生在(0, 1]内两个均匀分布的随机数
            const u1 = Math.random();
            const u2 = Math.random();

            const R = Math.sqrt(-2 * Math.log(u1));
            const angle = 2 * Math.PI * u2;

            const z1 = R * Math.sin(angle);

            const x = u + (z1 * o);
            return x.toFixed(4);
        },

        // 验证准确性
        checkResult () {
            this.dataSets = [];
            const checkDataSets = [];
            for (let i = 0; i < this.inputData.total; i++) {
                const res = this.getNormalDistribution(this.inputData.mean, this.inputData.standardDeviation);
                this.dataSets.push({
                    id: i + 1,
                    value: res
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
.math-column {
    text-align: left;
    border-right: 1px solid #E8E8E8;
    padding: 10px;
    height: 100%;
}
.result-column {
    display: flex;
    flex-direction: column;
}
.math-btn {
    width: 20%;
    margin: 5px 10px;
}

.data-sets {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 20px 0;
}
.data-sets-item {
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    width: 9%;
    border: 1px solid #CCCCCC;
}
#check {
    width: 100%;
    height: 400px;
}
</style>
