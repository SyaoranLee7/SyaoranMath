<template>
    <div class="lan-main">
        <el-form
            class="lan-form"
            :model="inputData"
            label-width="120px"
            label-position="left"
            style="margin-top: 40px;">
            <el-row class="lan-row" type="flex" justify="start">

                <el-col class="lan-col" :span="8">
                </el-col>

                <el-col class="lan-col" :span="16">
                    <el-button
                        class="lan-btn"
                        type="primary"
                        style="width: 180px"
                        @click="run">
                        开始
                    </el-button>

                    <div id="e1" class="echarts"></div>
                </el-col>

            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            inputData: {}
        };
    },

    methods: {
        run () {
            this.initOriginEchart();
        },

        initOriginEchart () {
            const echarts = require("echarts");
            const dom = echarts.init(document.getElementById("e1"));
            // const dom = echarts.init(document.getElementById("preData"), {}, { renderer: "svg" })

            const testData = [
                [2, 4, 10, 3]
            ];
            dom.setOption({
                xAxis3D: {
                    type: "value"
                },
                yAxis3D: {
                    type: "value"
                },
                zAxis3D: {
                    type: "value"
                },
                grid3D: {
                    axisLine: {
                        lineStyle: { color: "#fff" }
                    },
                    axisLabel: { show: false },
                    axisTick: { show: false },
                    axisPointer: { show: false },
                    environment: "#000000",
                    viewControl: {
                        // autoRotate: true
                    }
                },
                series: [{
                    type: "scatter3D",
                    data: testData
                }]
            });
        }
    },

    created () {
    }
};
</script>

<style scoped>
.echarts {
    width: 500px;
    height: 500px;
    margin: 20px;
}
</style>
